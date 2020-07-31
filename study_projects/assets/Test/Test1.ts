
const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends cc.Component {

  @property(cc.Layout)
  layout: cc.Layout = null

  onLoad(){
      cc.log(this.layout.paddingTop, this.layout.paddingLeft, this.layout.paddingBottom, this.layout.paddingBottom, this.layout.spacingX, this.layout.spacingY)
  }

    // update (dt) {}
}
