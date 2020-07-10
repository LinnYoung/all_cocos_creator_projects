const { ccclass, property } = cc._decorator;

@ccclass
export default class test extends cc.Component {
  @property(cc.Node)
  a: cc.Node = null;

  @property(cc.Node)
  b: cc.Node = null;

  private offset: cc.Vec2 = cc.v2(200, 200);

  private go: boolean = true;
  start() {
    // cc.log("p1： ", this.b.position);

    // this.b.position = this.a.position.addSelf(
    //   cc.v3(this.offset.x, this.offset.y, 0)
    // );

    // cc.log("pos2: ", this.b.position);

    this.a.on(
      cc.Node.EventType.TOUCH_START,
      (event: cc.Event) => {
        if (this.go) {
          this.a["_touchListener"].setSwallowTouches(false);
          this.go = false;
        } else {
          this.a["_touchListener"].setSwallowTouches(true);
          //   event.stopPropagationImmediate();
          this.go = true;
        }
      },
      this
    );

    this.a.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        cc.log("Click a!!!!");
      },
      this
    );

    this.b.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        cc.log("Click b!!!!");
      },
      this
    );
  }
}
