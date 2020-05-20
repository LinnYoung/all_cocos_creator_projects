const { ccclass, property } = cc._decorator;

@ccclass
export default class DropDownBox2 extends cc.Component {
  @property(cc.EditBox)
  inputBox: cc.EditBox = null;

  @property(cc.Node)
  dropView: cc.Node = null;

  private accounts: Array<string> = null;
  private canOpen: boolean = true;

  onLoad() {
    this.inputBox.node.on(
      "editing-did-began",
      () => {
        this.handleBegan();
      },
      this
    );

    this.inputBox.node.on(
      "text-changed",
      () => {
        const str = this.inputBox.string;
        this.updateDropDownView(str);
      },
      this
    );

    this.inputBox.node.on("editing-did-ended", () => {
      this.scheduleOnce(() => {
        this.canOpen = true;
        this.dropView.active = false;
        this.inputBox.blur();
      }, 0.5);
    });

    this.accounts = [
      "Linn1",
      "Linn2",
      "Linn3",
      "Linn4",
      "Linn5",
      "123456",
      "123456789",
    ];
  }

  private handleBegan() {
    if (!this.canOpen) {
      return;
    }
    this.canOpen = false;

    const str = this.inputBox.string;
    this.updateDropDownView(str);
  }

  updateDropDownView(str: string) {
    this.accounts.forEach((account, idx: number) => {
      let node = this.dropView.children[idx];
      if (!node) {
        node = new cc.Node();
        node.setContentSize(cc.size(200, 30));
        const label = node.addComponent(cc.Label);
        label.fontSize = 28;
        label.string = account;
        this.dropView.addChild(node);
        node.on(
          "touchend",
          () => {
            this.selectedAccount(account);
          },
          this
        );
      }
      let visibel: boolean = true;
      for (let i = 0; i < str.length; ++i) {
        if (account[i]) {
          if (account[i] !== str[i]) {
            visibel = false;
          }
        } else {
          visibel = false;
        }
      }
      node.active = visibel;
    });
    this.dropView.getComponent(cc.Layout).updateLayout();
    this.dropView.active = true;
  }

  private selectedAccount(account: string) {
    this.inputBox.string = account;
  }
}
