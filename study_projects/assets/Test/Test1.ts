const { ccclass, property } = cc._decorator;

@ccclass
export default class Test extends cc.Component {
  @property(cc.ScrollView)
  scrollview: cc.ScrollView = null;

  @property(cc.Node)
  view: cc.Node = null;

  onLoad() {
    // cc.log(
    //   "lllll:",
    //   this.view.convertToWorldSpace(cc.v2(0, 0)),
    //   this.view.convertToWorldSpaceAR(cc.v2(0, 0))
    // );

    const w1 = this.view.convertToWorldSpaceAR(cc.v2(0, 0));
    const w2 = this.scrollview.node.convertToWorldSpaceAR(
      cc.v2(0, -125)
    );
    cc.log(w1, w2);
    const ww1 = this.view.convertToWorldSpace(cc.v2(0, 0));
    const ww2 = this.scrollview.node.convertToWorldSpaceAR(
      cc.v2(0 - this.view.width / 2, -125 - this.view.height / 2)
    );

    cc.log(ww1, ww2);
  }

  // update (dt) {}
}
