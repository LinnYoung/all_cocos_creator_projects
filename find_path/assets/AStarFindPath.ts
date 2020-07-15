// point 属性
export class Point {
  constructor(public X: number, public Y: number, public value: number) {}

  // 总路程 G+H
  public F: number;

  //  G 表示从起点 A 移动到网格上指定方格的移动耗费 (可沿斜方向移动).
  public G: number;

  // H 表示从指定的方格移动到终点 B 的预计耗费 (H 有很多计算方法, 这里我们设定只可以上下左右移动).
  public H: number;

  /**
   * 值不等3的时候可走
   */
  public isWalk(): boolean {
    return this.value !== 3;
  }
}

export default class AStarFindPath {
  private _date: Array<Point> = []

//   findPath(start: Point, end: Point, is) {}
}
