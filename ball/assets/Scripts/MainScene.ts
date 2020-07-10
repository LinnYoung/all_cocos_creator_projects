const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {
  @property(cc.Node)
  bulle: cc.Node = null;

  @property(cc.Node)
  wall: cc.Node = null;

  private bullePool: cc.NodePool = new cc.NodePool();

  onLoad() {
    // 开启物理系统
    let manager = cc.director.getPhysicsManager();
    manager.enabled = true;

    cc.log("比率： ", cc.PhysicsManager.PTM_RATIO);
    // 重力加速度为0
    manager.gravity = cc.v2();

    for (let i = 0; i < 10; this.bullePool.size(), i++) {
      this.bullePool.put(cc.instantiate(this.bulle));
    }
  }

  start() {
    this.node.on("touchend", this.emitBulle, this);
  }

  private emitBulle() {
    let bulle = this.bullePool.get();
    if (!bulle) {
      bulle = cc.instantiate(this.bulle);
    }

    bulle.active = true;
    bulle.angle = 0;
    bulle.setPosition(-this.node.width / 2, 0);
    this.node.addChild(bulle);

    this.scheduleOnce(() => {
      this.moveBulle(bulle);
    }, 1);
  }

  private moveBulle(bulle: cc.Node) {
    const tween = cc
      .tween()
      .by(0.1, { position: cc.v2(20, 0) })
      .call(() => {
        if (bulle.x > this.node.width / 2 + 50) {
          this.putBullet(bulle);
        }
      });

    cc.tween(bulle).repeatForever(tween).start();
  }

  public putBullet(node: cc.Node) {
    cc.log("回收！！！");
    this.bullePool.put(node);
    node.stopAllActions();
  }
}
