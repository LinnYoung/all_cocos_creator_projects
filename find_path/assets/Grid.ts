import { Point } from "./AStarFindPath";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Grid extends cc.Component {
  @property(cc.Label)
  value: cc.Label = null;

  init(point: Point) {
    this.node.color = point.isWalk()
      ? cc.color(255, 255, 255)
      : cc.color(255, 0, 0);
    this.value.string = point.value.toString();
  }
}
