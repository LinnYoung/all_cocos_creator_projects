const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  bulletPre: cc.Prefab = null;

  @property(cc.Node)
  canno: cc.Node = null; // 炮塔

  // 初始坐标值（因为炮台的锚点坐标）我这里屏幕中间最下方（0，height/2)
  private _initialPos: cc.Vec2 = null;

  onLoad() {
    this._initialPos = cc.v2(0, -this.node.height / 2);
    this.node.on(cc.Node.EventType.TOUCH_START, this.emitBullte, this);
  }

  // 炮塔及发射角度
  private emitBullte(event: cc.Touch) {
    const pos = this.content.convertToNodeSpaceAR(event.getLocation());
    const newPos = pos.sub(this._initialPos);
    let radian = newPos.signAngle(cc.v2(0, 1));
    const newAngle = (radian * 180) / Math.PI;
    this.canno.angle = -newAngle;
  }
}
