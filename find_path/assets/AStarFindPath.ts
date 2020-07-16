// point 属性
export class Point {
  /**
   * Point 构造函数
   * @param X 行索引值
   * @param Y 列索引值
   * @param value 值
   */
  constructor(public X: number, public Y: number, public value: number) {}

  // 总路程 G+H
  public F: number;

  //  G 表示从起点 A 移动到网格上指定方格的移动耗费 (可沿斜方向移动).
  public G: number;

  // H 表示从指定的方格移动到终点 B 的预计耗费 (H 有很多计算方法, 这里我们设定只可以上下左右移动).
  public H: number;

  /**
   * 1可走
   * 值不等3的时候可走
   */
  public isWalk(): boolean {
    return this.value !== 3;
  }
}

export default class AStarFindPath {
  private _data: Array<Point> = [];

  /**行 */
  private _row: number = null;
  /**列 */
  private _column: number = null;
  /**格子相对地图大小*/
  private _grideSize = null;

  /**
   * 加载数据
   */
  loadData(data: Array<Array<number>>, size: number) {
    this._row = data.length;
    this._column = data[0].length;
    this._grideSize = size;

    // 行（遍历）
    for (let i = 0; i < data.length; ++i) {
      // 列（遍历）
      for (let j = 0; (j = data[i].length); ++j) {
        // i行j列
        let point = new Point(i, j, data[i][j]);
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
      cc.error("找不到终点或起点！！！");
      return path;
    }

    if (endPoint.isWalk) {
      cc.error("点击区域不可到达！！！");
      return path;
    }

    // 当在同一格子内（格子大才存在）
    if (startPoint === endPoint) {
      path.push(endPos);
      return path;
    }

    



  }

  /**
   * 通过坐标找到对应的格子
   * @param pos 坐标
   */
  private findGrideByPosition(pos: cc.Vec2): Point {
    const x = Math.floor(pos.x / this._grideSize);
    const y = Math.floor(pos.y / this._grideSize);
    const point: Point = this._data[x * this._column + y];
    return point;
  }
}
