// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MainScene from "./MainScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
  @property(cc.Node)
  wall: cc.Node = null;

  private wallRect: cc.Rect = null;

  onLoad() {
    this.wallRect = this.wall.getBoundingBox();
  }

  update(dt) {
    const bulletRect = this.node.getBoundingBox();
    const isPa = bulletRect.intersects(this.wallRect);

    if (isPa) {
      cc.director
        .getScene()
        .getChildByName("Canvas")
        .getComponent(MainScene)
        .putBullet(this.node);
    }
  }
}
