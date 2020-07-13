import MainScene from "./MainScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
  private _stage: MainScene = null;

  onLoad() {
    this._stage = cc.director
      .getScene()
      .getChildByName("Canvas")
      .getComponent(MainScene);
  }

  update(dt) {
    this.moveSelf(dt);
  }

  private moveSelf(dt: number) {
    let selfX = this.node.x;
    let selfY = this.node.y;

    selfX += dt * 800 * Math.sin((-this.node.angle / 180) * Math.PI);
    selfY += dt * 800 * Math.cos((-this.node.angle / 180) * Math.PI);
    this.node.x = selfX;
    this.node.y = selfY;

    if (
      this.node.x >= this._stage.content.width / 2 ||
      this.node.x <= -this._stage.content.width / 2
    ) {
      this.node.angle = -this.node.angle;
    } else if (
      this.node.y >= this._stage.content.height / 2 ||
      this.node.y <= -this._stage.content.height / 2
    ) {
      this.node.angle = 180 - this.node.angle;
    }

    // if (
    //   !this._stage.content
    //     .getBoundingBox()
    //     .intersects(this.node.getBoundingBox())
    // ) {
    //   cc.log("回收");
    //   this._stage.bulltePool.put(this.node);
    // }
  }
}
