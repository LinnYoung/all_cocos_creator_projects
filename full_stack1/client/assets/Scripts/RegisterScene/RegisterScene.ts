import Http, { RequestObj } from "../server/Http";
import configure from "../server/Configure";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RegisterScene extends cc.Component {
  @property(cc.EditBox)
  account: cc.EditBox = null;

  @property(cc.EditBox)
  passworld: cc.EditBox = null;

  @property(cc.EditBox)
  confirPsw: cc.EditBox = null;

  handleRegister() {
    if (this.account.string === "") {
      return;
    }
    if (this.passworld.string === "") {
      return;
    }

    if (this.passworld.string !== this.confirPsw.string) {
      return;
    }

    const obj: RequestObj = {
      url: configure.baseURL + "register/",
      data: { userName: this.account.string, passWorld: this.passworld.string },
      success: (jsonData) => {
        cc.log("注册成功：", jsonData);
      },
      fail: (data) => {
        cc.log("注册失败:", data);
      },
    };

    Http.request(obj);
  }
}
