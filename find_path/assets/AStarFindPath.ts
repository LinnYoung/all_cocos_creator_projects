// point 属性
export class Point {
  /**
   * Point 构造函数
   * @param X 列索引值
   * @param Y 行索引值
   * @param value 值
   */
  constructor(public X: number, public Y: number, public value: number) {}

  //  G+H
  public F: number;

  //  G 表示从起点 A 移动到网格上指定方格的移动耗费 (可沿斜方向移动).
  public G: number;

  // H 表示从指定的方格移动到终点 B 的预计耗费 (H 有很多计算方法, 这里我们设定只可以上下左右移动).
  public H: number;

  public parentPoint: Point;

  public closed: boolean; // 是否关闭

  public visited: boolean = false;
  /**
   * 1可走
   * 值不等3的时候可走
   */
  public isWalk(): boolean {
    return this.value !== 3;
  }

  public updateWeight(parent: Point, startPoint: Point, endPoint: Point) {
    // 消耗值 g
    const g0 = this.X === parent.X || this.Y === parent.Y ? 10 : 14;
    const g = parent.G + g0;
    // 预估值 h
    const h = Math.abs(parent.X - endPoint.X) + Math.abs(parent.Y - endPoint.Y);
    const f = g + h;

    if (!this.visited || f < this.F) {
      this.G = g;
      this.F = f;
      this.H = h;
      return true;
    } else {
      return false;
    }
  }

  init() {
    this.G = 0;
    this.H = 0;
    this.F = 0;
    this.closed = false;
    this.parentPoint = null;
    this.visited = false;
  }
}

class BinaryHeap {
  private _data: Point[] = [];

  public insert(point: Point) {
    point.visited = true;
    if (this._data.length === 0) {
      this._data.push(point);
      return;
    }

    let inserted = false;
    for (let i = this._data.length - 1; i >= 0; --i) {
      if (this._data[i].F > point.F) {
        this._data.splice(i + 1, 0, point);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      this._data.splice(0, 0, point);
    }
  }

  update(point: Point) {
    const i = this._data.indexOf(point);
    if (i >= 0) {
      this._data.splice(i, 1);
    }
    this.insert(point);
  }

  pop() {
    return this._data.length === 0 ? null : this._data.pop();
  }
}

export default class AStarFindPath {
  private _data: Array<Point> = [];

  /**行 */
  private _row: number = null;
  /**列 */
  private _column: number = null;
  /**格子相对地图大小*/
  private _grideSize: number = null;

  /**
   * 数据为一行一行的填写
   * 加载数据
   */
  loadData(data: Array<Array<number>>, size: number) {
    this._row = data.length;
    this._column = data[0].length;
    this._grideSize = size;
    // 行（遍历）
    for (let i = 0; i < data.length; ++i) {
      // 列（遍历）
      for (let j = 0; j < data[i].length; ++j) {
        // i行j列
        let point = new Point(j, i, data[i][j]);
        this._data[i * this._column + j] = point;
      }
    }
  }

  /**
   *
   * @param startPos 起点坐标
   * @param endPos 终点坐标
   */
  public findPath(startPos, endPos): Array<cc.Vec2> {
    let path: Array<cc.Vec2> = [];

    // 起点
    const startPoint = this.findGrideByPosition(startPos);
    // 终点
    const endPoint = this.findGrideByPosition(endPos);

    if (!endPoint || !startPoint) {
      console.error("找不到终点或起点！！！");
      return path;
    }

    if (!endPoint.isWalk()) {
      console.error("点击区域不可到达！！！");
      return path;
    }

    // 当在同一格子内（格子大才存在）
    if (startPoint === endPoint) {
      path.push(endPos);
      return path;
    }

    // 初始化数据
    this._data.forEach(function (n) {
      n.init();
    });

    let openList = new BinaryHeap();
    openList.insert(startPoint);

    var minPoint: Point = null;
    while (!endPoint.closed) {
      const cur = openList.pop();
      if (!cur) {
        break;
      }
      // 丢进关闭
      cur.closed = true;

      // 得到相邻Point
      let nearPoints = this.findNearPoints(cur);

      nearPoints.forEach((nearPoint) => {
        const changed = nearPoint.updateWeight(cur, startPoint, endPoint);
        if (!minPoint || nearPoint.F <= minPoint.F) {
          minPoint = nearPoint;
        }

        if (nearPoint.visited) {
          // 已被计算过
          if (changed) {
            nearPoint.parentPoint = cur;
            openList.update(nearPoint);
          }
        } else {
          // 未计算过
          nearPoint.parentPoint = cur;
          openList.insert(nearPoint);
        }
      });
    }

    if (endPoint.closed) {
      let cur2 = endPoint.closed ? endPoint : minPoint;
      let pointPath = [cur2];
      while (cur2.parentPoint) {
        pointPath.push(cur2.parentPoint);
        cur2 = cur2.parentPoint;
      }

      for (let i = pointPath.length - 1; i >= 0; --i) {
        path.push(
          cc.v2(
            pointPath[i].X * this._grideSize + this._grideSize / 2,
            pointPath[i].Y * this._grideSize + this._grideSize / 2
          )
        );
      }
    }
    return path;
  }

  /**
   *    寻找附近所有节点
   * @param parentPoint 父点
   * @param endPoint 终点
   */
  private findNearPoints(parentPoint: Point): Array<Point> {
    const x = parentPoint.X;
    const y = parentPoint.Y;
    /** 相邻集合*/
    let nearList: Array<Point> = [];

    const top = this.nearPoint(x + 1, y, nearList);
    const bottom = this.nearPoint(x - 1, y, nearList);
    const left = this.nearPoint(x, y - 1, nearList);
    const right = this.nearPoint(x, y + 1, nearList);

    if (top || right) {
      this.nearPoint(x + 1, y + 1, nearList);
    }
    if (top || left) {
      this.nearPoint(x + 1, y - 1, nearList);
    }
    if (bottom || right) {
      this.nearPoint(x - 1, y + 1, nearList);
    }
    if (bottom || left) {
      this.nearPoint(x - 1, y - 1, nearList);
    }
    return nearList;
  }

  /**
   * 通过地图坐标找到对应的格子
   * @param pos 坐标
   */
  private findGrideByPosition(pos: cc.Vec2): Point {
    // 列
    const x = Math.floor(pos.x / this._grideSize);
    // 行
    const y = Math.floor(pos.y / this._grideSize);
    const point: Point = this._data[y * this._column + x];
    return point;
  }

  /**
   * 附近节点的信息
   * @param x
   * @param y
   * @param list
   */
  private nearPoint(x: number, y: number, list: Array<Point>): boolean {
    const point = this.findPointByGridePos(x, y);
    if (point && !point.closed && point.isWalk) {
      list.push(point);
      return true;
    }
    return false;
  }

  /**
   *   通过格子坐标得到 Point
   * @param x 列
   * @param y 行
   */
  public findPointByGridePos(x: number, y: number): Point {
    if (x >= this._column || x < 0 || y < 0 || y > this._row) {
      // 超出地图
      return null;
    }

    const point = this._data[y * this._column + x];

    return point;
  }
}
