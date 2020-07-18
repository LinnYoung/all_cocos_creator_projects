import AStarFindPath from "./AStarFindPath";
import Grid from "./Grid";

const { ccclass, property } = cc._decorator;

const ROW: number = 32;
const COLUMN: number = 49;
@ccclass
export default class Map extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  gridPre: cc.Prefab = null;

  @property(cc.Node)
  player: cc.Node = null;

  private findPath: AStarFindPath = null;

  onLoad() {
    this.findPath = new AStarFindPath();

    this.initData();

    this.content.on("touchend", this.handleClickContent, this);
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

    this.findPath.loadData(data, 100);

    for (let i = 0; i < data.length; ++i) {
      for (let j = 0; j < data[i].length; ++j) {
        const point = this.findPath.findPointByGridePos(j, i);
        const node = cc.instantiate(this.gridPre);
        const comp = node.getComponent(Grid);
        comp.init(point);
        node.setPosition(point.X * 100 + 50, point.Y * 100 + 50);
        this.content.addChild(node);
      }
    }

    this.player.position = cc.v3(50, 50);
    this.player.zIndex = cc.macro.MAX_ZINDEX;
    this.player.active = true;
  }

  private positions: Array<cc.Vec2> = null;
  private handleClickContent(event: cc.Event.EventTouch) {
    const pos = this.content.convertToNodeSpaceAR(event.getLocation());
    this.positions = this.findPath.findPath(this.player.position, pos);
    if (this.positions && this.positions.length > 0) {
      this.player.stopActionByTag(1);
      this.startMove();
    }
  }

  private startMove() {
    const position = this.positions.shift();
    if (position) {
      cc.tween(this.player)
        .to(
          this.player.position.sub(cc.v3(position.x, position.y)).mag() / 260,
          {
            position: cc.v3(position.x, position.y),
          }
        )
        .call(() => {
          this.startMove();
        })
        .tag(1)
        .start();
    }
  }
}
