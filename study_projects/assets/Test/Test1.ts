const { ccclass, property } = cc._decorator

@ccclass
export default class Test extends cc.Component {

    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null

    @property(cc.Node)
    view: cc.Node = null

    onLoad() {
        cc.log('lllll:', this.view.getBoundingBox(), this.view.getBoundingBoxToWorld())
        // this.scrollview.content.children.forEach((item) => {
        //     cc.log(
        //         'rect: ',
        //         item.getBoundingBoxToWorld(),

        //         this.view.getBoundingBoxToWorld(),

        //         this.view
        //             .getBoundingBoxToWorld()
        //             .intersects(item.getBoundingBoxToWorld())
        //     )
        // })
    }

    // update (dt) {}
}
