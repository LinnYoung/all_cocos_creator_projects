import Http, { RequestObj } from "../server/Http";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {
  onLoad() {
    this.httpRequest();
  }

  httpRequest() {
    const obj: RequestObj = { url: "http://127.0.0.1:8182", success:(arg:any)=>{
        console.log(arg)
    }};

    Http.request(obj);
  }
}
