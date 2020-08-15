import ContentComponent, { ContentDataProvider } from "./ContentComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Test extends cc.Component implements ContentDataProvider {
  @property(ContentComponent)
  content: ContentComponent = null;

  @property(cc.Node)
  item: cc.Node = null;

  private count  =  101
  onLoad() {
    // this.isgo = true;
    // for (let i = 2; i < 10001; ++i) {
    //   const item = cc.instantiate(this.item);
    //   item.getChildByName("value").getComponent(cc.Label).string = i + "";
    //   this.content.addChild(item);
    // }

    this.content.init(this)

    this.node.on('touchend', ()=>{
        this.count ++;
        this.content.reload()
       cc.log( this.content.node.getContentSize())
    })

  }

  cellCount() {
    return this.count;
  }

  cellNode() {
    return this.item;
  }

  upateCell(item: cc.Node, index: number) {
    item.getChildByName("value").getComponent(cc.Label).string = index + "";
  }



}
