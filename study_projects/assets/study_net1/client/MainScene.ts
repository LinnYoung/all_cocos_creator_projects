import Server from "./net/Server";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Mainscene extends cc.Component {
  httpRequest() {
    const obj = {
      url: "http://127.0.0.1:8182",
    };

    Server.request(obj);
  }
}
