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

  public bulltePool: cc.NodePool = null; // 子弹节点池

  onLoad() {
    this._initialPos = cc.v2(0, -this.node.height / 2);

    this.initBulltePool(); // 初始化子弹节点池

    // 发射炮弹，暂时只支持点击发射，功能后期扩展
    this.node.on(cc.Node.EventType.TOUCH_START, this.handleTouchStart, this);
  }

  private initBulltePool(): void {
    this.bulltePool = new cc.NodePool();
    for (let i = 0; i < 10; ++i) {
      const bullte = cc.instantiate(this.bulletPre);
      this.bulltePool.put(bullte);
    }
  }

  // 炮塔及发射角度
  private handleTouchStart(event: cc.Touch) {
    const pos = this.content.convertToNodeSpaceAR(event.getLocation());
    const newPos = pos.sub(this._initialPos);
    let radian = newPos.signAngle(cc.v2(0, 1));
    const newAngle = (radian * 180) / Math.PI;
    this.canno.angle = -newAngle;

    this.emitBullte(this.canno.angle);
  }

  // 发射炮弹
  private emitBullte(angle: number) {
    let bullteNode = this.bulltePool.get();
    if (!bullteNode) {
      bullteNode = cc.instantiate(this.bulletPre);
    }

    bullteNode.angle = angle;
    const worldPos = this.canno.convertToWorldSpaceAR(cc.Vec2.ZERO);
    const pos = this.content.convertToNodeSpaceAR(worldPos);
    bullteNode.setPosition(pos);
    this.content.addChild(bullteNode);
  }
}
