import Http, { RequestObj } from "../server/Http";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {
  onLoad() {
    this.httpRequest();
  }

  addLabel(content: string) {
    const node = new cc.Node();
    node.addComponent(cc.Label).string = content;
    this.node.addChild(node);
  }

  httpRequest() {
    const obj: RequestObj = {
      url: "http://127.0.0.1:8182",
      success: (arg: any) => {
        console.log(arg);
        this.addLabel(arg.info)
      },
    };

    Http.request(obj);
  }
}
