const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  bulletPre: cc.Prefab = null;

  @property(cc.Node)
  canno: cc.Node = null; // 炮塔

  // 初始坐标值（因为炮台的锚点坐标）我这里屏幕中间最下方（0，width/2)
  private _initialPos: cc.Vec2 = null; // cc.v2(0, -this.node.width / 2);

  onLoad() {
    this._initialPos = cc.v2(0, -this.node.height / 2);
    this.node.on(cc.Node.EventType.TOUCH_START, this.emitBullte, this);
  }

  private emitBullte(event: cc.Touch) {
    const pos = this.content.convertToNodeSpaceAR(event.getLocation());
    const newPos = pos.sub(this._initialPos);
    let radian = newPos.signAngle(cc.v2(0, 1));
    const newAngle = (radian * 180) / Math.PI + 180;

    this.canno.angle = newAngle;
    cc.log("angle; ", this.canno.angle);
  }
}
