const { ccclass, property } = cc._decorator;

/**
 *  scrollView: cc.Scrollview组件
 *  使用说明 Hbar . Vbar 为移动的 bar 条
 *  Item：后面可以直接去掉（滚动视图容器 content 内的子节点）
 *  turnDown： 下移按钮 ，turnUp： 上移按钮 （移动视图）--->同理 turnLeft/turnRight
 *  distance: 点击移动按钮所移动 距离单位
 *
 */

@ccclass
export default class ScrollViewComponent extends cc.Component {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  Hbar: cc.Node = null;

  @property(cc.Node)
  vBar: cc.Node = null;

  @property(cc.Node)
  item: cc.Node = null;

  @property(cc.Node)
  turnDown: cc.Node = null;
  @property(cc.Node)
  turnUp: cc.Node = null;

  @property(cc.Node)
  turnRight: cc.Node = null;
  @property(cc.Node)
  turnLeft: cc.Node = null;

  @property({ tooltip: "点击移动一次得距离" })
  distance: number = 0;

  private content: cc.Node = null;
  private vMax: number = 0; // 垂直移动最大值
  private hMax: number = 0; // 水平移动最大值

  private isMoveBar: boolean = false;

  private ismoveV: boolean = false;
  private ismoveH: boolean = false;

  private posY: number = 0;
  private posX: number = 0;

  onLoad() {
    this.content = this.scrollView.content;
    this.scrollView.inertia = false;
    this.roadData();
    this.initBarData();
    this.scrollView.node.on("scrolling", this.scrollUpdate, this);
  }

  roadData() {
    for (let i = 0; i < 50; i++) {
      const node = cc.instantiate(this.item);
      node.color = new cc.Color(100 + i * 10, 100, 100 + i + 10);
      this.content.addChild(node);
    }
  }

  private initBarData() {
    // 垂直
    if (this.vBar) {
      this.vMax = -(this.vBar.parent.height - this.vBar.height);

      this.addVBarMonitorEvent();
    }

    //水平
    if (this.Hbar) {
      this.hMax = this.Hbar.parent.width - this.Hbar.width;
      this.addHBarMonitorEvent();
    }
  }

  /************垂直**************/
  addVBarMonitorEvent() {
    this.vBar.on(cc.Node.EventType.TOUCH_END, this.handleTouchEnd, this);
    this.vBar.on(cc.Node.EventType.TOUCH_CANCEL, this.handleTouchEnd, this);
    this.vBar.on(cc.Node.EventType.TOUCH_MOVE, this.moveVBar, this);
    this.turnDown &&
      this.turnDown.on(cc.Node.EventType.TOUCH_END, this.handleTurnDown, this);
    this.turnUp &&
      this.turnUp.on(cc.Node.EventType.TOUCH_END, this.handleTurnUp, this);
  }

  moveVBar(event: cc.Event.EventTouch) {
    let delta = event.getDelta();
    this.posY += delta.y;
    if (delta.y < 0) {
      // 向下拖动
      if (this.posY <= this.vMax) {
        this.posY = this.vMax;
      }
    } else {
      // 向上
      if (this.posY >= 0) {
        this.posY = 0;
      }
    }
    this.ismoveV = true;
    this.updateScrollView();
  }
  handleTurnDown() {
    if (this.posY === this.vMax || this.distance === 0) return;

    if (this.posY - this.distance <= this.vMax) {
      this.posY = this.vMax;
    } else {
      this.posY -= this.distance;
    }
    this.ismoveV = true;
    this.updateScrollView();
    this.handleTouchEnd();
  }
  handleTurnUp() {
    if (this.posY === 0 || this.distance === 0) return;

    if (this.posY + this.distance >= 0) {
      this.posY = 0;
    } else {
      this.posY += this.distance;
    }
    this.ismoveV = true;
    this.updateScrollView();
    this.handleTouchEnd();
  }

  /***************水平************/

  addHBarMonitorEvent() {
    this.Hbar.on(cc.Node.EventType.TOUCH_END, this.handleTouchEnd, this);
    this.Hbar.on(cc.Node.EventType.TOUCH_CANCEL, this.handleTouchEnd, this);
    this.Hbar.on(cc.Node.EventType.TOUCH_MOVE, this.moveHBar, this);
    this.turnRight &&
      this.turnRight.on(
        cc.Node.EventType.TOUCH_END,
        this.handleTurnRight,
        this
      );
    this.turnLeft &&
      this.turnLeft.on(cc.Node.EventType.TOUCH_END, this.handleTurnLeft, this);
  }

  moveHBar(event: cc.Event.EventTouch) {
    let delta = event.getDelta();
    this.posX += delta.x;
    if (delta.x > 0) {
      // 向左拖动
      if (this.posX >= this.hMax) {
        this.posX = this.hMax;
      }
    } else {
      // 向右
      if (this.posX <= 0) {
        this.posX = 0;
      }
    }
    this.ismoveH = true;
    this.updateScrollView();
  }
  handleTurnRight() {
    if (this.posX === this.hMax || this.distance === 0) return;

    if (this.posX + this.distance >= this.hMax) {
      this.posX = this.hMax;
    } else {
      this.posX += this.distance;
    }
    this.ismoveH = true;
    this.updateScrollView();
    this.handleTouchEnd();
  }
  handleTurnLeft() {
    if (this.posX === 0 || this.distance === 0) return;

    if (this.posX - this.distance <= 0) {
      this.posX = 0;
    } else {
      this.posX -= this.distance;
    }
    this.ismoveH = true;
    this.updateScrollView();
    this.handleTouchEnd();
  }

  /***********公用********/
  handleTouchEnd() {
    this.isMoveBar = false;
    this.ismoveH = false;
    this.ismoveV = false;
  }

  updateScrollView() {
    this.isMoveBar = true;
    let vPre = this.posY / this.vMax;
    let hPre = this.posX / this.hMax;
    if (this.vBar && this.ismoveV) {
      this.vBar.y = this.posY;
      this.scrollView.scrollToPercentVertical(1 - vPre, 0.1);
    } else if (this.Hbar && this.ismoveH) {
      this.Hbar.x = this.posX;
      this.scrollView.scrollToPercentHorizontal(hPre, 0.1);
    }
  }

  private scrollUpdate() {
    if (this.isMoveBar) return;
    let scorllMove = this.scrollView.getScrollOffset();
    let vPre =
      scorllMove.y / (this.content.height - this.content.parent.height);
    this.posY = vPre * this.vMax;
    let hPre = scorllMove.x / (this.content.parent.width - this.content.width);
    this.posX = hPre * this.hMax;
    if (this.vBar) {
      this.vBar.y = this.posY;
    }
    if (this.Hbar) {
      this.Hbar.x = this.posX;
    }
  }
}
