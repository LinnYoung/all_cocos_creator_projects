const { ccclass, property } = cc._decorator;

@ccclass
export default class GoldFly extends cc.Component {
  @property(cc.Node)
  a: cc.Node = null;
  @property(cc.Node)
  b: cc.Node = null;

  @property(cc.Node)
  gold: cc.Node = null;

  private goldPool: cc.NodePool = null;

  onLoad() {
    this.goldPool = new cc.NodePool();
    for (let i = 0; i < 20; ++i) {
      const gold = cc.instantiate(this.gold);
      this.goldPool.put(gold);
    }

    this.a.on(cc.Node.EventType.TOUCH_END, this.ClickA, this);
  }

  private ClickA() {
    const random = Math.random() * 20 + 1;
    const worldPos = this.a.convertToWorldSpaceAR(cc.v2(0, 0));
    const golds = this.getCirclePoints(10, worldPos, random);
    const targetPos = this.node.convertToNodeSpaceAR(
      this.b.convertToWorldSpaceAR(cc.Vec2.ZERO)
    );
    const starPos = this.node.convertToNodeSpaceAR(
      this.a.convertToWorldSpaceAR(cc.Vec2.ZERO)
    );
    this.createAnimation(golds, starPos, targetPos);
  }

  getCirclePoints(
    r: number,
    pos: cc.Vec2,
    count: number,
    randomScope: number = 60
  ): cc.Vec2[] {
    let points = [];
    let radians = (Math.PI / 180) * Math.round(360 / count);
    for (let i = 0; i < count; i++) {
      let x = pos.x + r * Math.sin(radians * i);
      let y = pos.y + r * Math.cos(radians * i);
      points.unshift(
        cc.v2(x + Math.random() * randomScope, y + Math.random() * randomScope)
      );
    }
    return points;
  }

  createAnimation(pos: cc.Vec2[], starPos: cc.Vec2, targetPos: cc.Vec2) {
    pos.forEach((p, idx) => {
      const position = this.node.convertToNodeSpaceAR(p);
      let node: cc.Node = null;
      if (this.goldPool.size() > 0) {
        node = this.goldPool.get();
      } else {
        node = cc.instantiate(this.gold);
      }
      node.active = true;
      node.setPosition(starPos);
      this.node.addChild(node);

      node.runAction(
        cc.sequence(
          cc.moveTo(0.3, position),
          cc.delayTime(idx * 0.02),
          cc.moveTo(0.5, targetPos),
          cc.callFunc(() => {
            node.active = false;
            this.goldPool.put(node);
          })
        )
      );
    });
  }
}
