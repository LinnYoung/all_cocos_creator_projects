import AStarFindPath from "./AStarFindPath";

const { ccclass, property } = cc._decorator;

const ROW: number = 32;
const COLUMN: number = 49;
@ccclass
export default class Map extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  // 49宽（列）   32高（行）
  onLoad() {
    this.initData();
  }

  initData() {
    const data = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
      [1, 1, 3, 1, 1, 1, 1, 1, 1, 3],
      [1, 1, 3, 1, 1, 1, 1, 1, 1, 3],
      [1, 1, 3, 1, 1, 1, 1, 1, 1, 3],
      [1, 1, 3, 1, 1, 1, 1, 1, 1, 3],
      [1, 1, 3, 1, 1, 1, 1, 1, 1, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    ];
    const findPath = new AStarFindPath();
    findPath.loadData(data, 100);

    for (let i = 0; i < data.length; ++i) {
      for (let j = 0; j < data[i].length; ++j) {
        const point = findPath.findPointByGridePos(j, i);
        const node = new cc.Node();
        node.setContentSize(100);
        const label = node.addComponent(cc.Label);
        label.fontSize = 18;
        label.lineHeight = 18;
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        label.string = point.value + "";
        node.color = point.isWalk()
          ? cc.color(255, 255, 255)
          : cc.color(255, 0, 0);

        // label["_forceUpdateRenderData"]();
        node.setPosition(point.X * 100 + 50, point.Y * 100 + 50);
        this.content.addChild(node);
        // if (point.isWalk) {
        // }
      }
    }
  }
}
