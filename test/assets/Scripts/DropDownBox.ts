const { ccclass, property } = cc._decorator;

@ccclass
export default class DropDownBox extends cc.Component {
  @property(cc.EditBox)
  inputBox: cc.EditBox = null;

  @property(cc.Node)
  dropView: cc.Node = null;

  private accounts: Array<string> = null;
  private canOpen: boolean = true;
  private account: string = null;

  onLoad() {
    this.inputBox.node.on(
      "editing-did-began",
      () => {
        this.handleBegan();
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

    this.accounts = ["Linn1", "Linn2", "Linn3", "Linn4", "Linn5"];
  }

  private handleBegan() {
    if (!this.canOpen) {
      return;
    }
    this.canOpen = false;

    // this.account = this.inputBox.string;

    this.dropView.removeAllChildren();
    this.accounts.forEach((account) => {
      const node = new cc.Node();
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
    });
    this.dropView.getComponent(cc.Layout).updateLayout();
    this.dropView.active = true;
  }

  private selectedAccount(account: string) {
    this.inputBox.string = account;
  }
}
