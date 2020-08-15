const { ccclass, property } = cc._decorator;

/**
 * 该组件只是用于从上往下，从左向右的列表！
 * ，content 的锚点设置在 （0，1）做上角 （警告：否则坐标会有问题）
 */

export interface ContentDataProvider {
  /**
   * 数据长度
   */
  cellCount(): number;

  /**
   * 节点
   */
  cellNode(): cc.Node;

  /**
   * 更新节点数据
   */
  upateCell(cell: cc.Node, index: number);
}

interface Cell {
  index: number;
  position: cc.Vec2;
  isLoad: boolean;
}

/**
 * 使用方法，把content 的锚点设置到左上角（0，1）
 *  不支持（垂直和水平同时滚动）
 *  完成
 */
@ccclass
export default class ContentComponent extends cc.Component {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Layout)
  layout: cc.Layout = null;

  private _provider: ContentDataProvider = null;
  private item: cc.Node = null;

  // 初始化调用
  init(provider: ContentDataProvider) {
    this.layout.enabled = false;
    this._provider = provider;
    this.item = provider.cellNode();
    this.load();
    this.setCotentSize();
    this.handleScrolling();
  }

  // 刷新时调用
  reload() {
    if (this._items.length !== this._provider.cellCount()) {
      if (this._items.length > this._provider.cellCount()) {
        let diffVaule = this._items.length - this._provider.cellCount();
        this._items.splice(this._provider.cellCount() - 1, diffVaule);
        this.node.children.splice(this._provider.cellCount() - 1, diffVaule);
      } else {
        for (let i = this._items.length; i < this._provider.cellCount(); ++i) {
          this.createItem(i);
        }
      }
      this.setCotentSize();
      this.handleScrolling();
    }
  }

  // 设置content 的大小（由于layout去掉了）
  setCotentSize() {
    switch (this.layout.type) {
      case cc.Layout.Type.HORIZONTAL:
        this.node.setContentSize(
          cc.size(
            (this._provider.cellCount() - 1) *
              (this.item.width + this.layout.spacingX) +
              this.item.width +
              this.layout.paddingLeft +
              this.layout.paddingRight,
            this.node.height
          )
        );
        break;
      case cc.Layout.Type.VERTICAL:
        this.node.setContentSize(
          cc.size(
            this.node.width,
            (this._provider.cellCount() - 1) *
              (this.item.height + this.layout.spacingY) +
              this.item.height +
              this.layout.paddingTop +
              this.layout.paddingBottom
          )
        );
        break;
      case cc.Layout.Type.GRID:
        if (this.layout.startAxis === cc.Layout.AxisDirection.HORIZONTAL) {
          this.node.setContentSize(
            cc.size(
              (Math.ceil(this._provider.cellCount() / this._oneColOfNum) - 1) *
                (this.item.width + this.layout.spacingX) +
                this.item.width +
                this.layout.paddingLeft +
                this.layout.paddingRight,
              this.node.height
            )
          );
        } else if (this.layout.startAxis === cc.Layout.AxisDirection.VERTICAL) {
          this.node.setContentSize(
            cc.size(
              this.node.width,
              (Math.ceil(this._provider.cellCount() / this._oneRowOfNum) - 1) *
                (this.item.height + this.layout.spacingY) +
                this.item.height +
                this.layout.paddingTop +
                this.layout.paddingBottom
            )
          );
        }
        break;
    }
  }

  onLoad() {
    this.regestEvent();
    // this.layout.enabled = false;
  }

  regestEvent() {
    this.scrollView.node.on("scrolling", this.handleScrolling, this);
  }

  /**所有数据对应的Cell结构数据 */
  private _items: Array<Cell> = [];

  /** 加载数据   */
  public load() {
    // 先算出一行或者一列的数量（当布局为网格）
    if (this.layout.type === cc.Layout.Type.GRID) {
      if (this.layout.startAxis === cc.Layout.AxisDirection.HORIZONTAL) {
        this._computeOneRowOfNum();
      } else {
        this._computeOneColOfNum();
      }
    }

    // 创建初始化数据
    for (let i = 0; i < this._provider.cellCount(); ++i) {
      this.createItem(i);
    }
  }

  /**
   * 创建没有Item 的数据(并不是节点)
   * @param index
   */
  createItem(index: number) {
    // 算位置，算出相应的坐标 （Layout，可以得出 位置）
    let position: cc.Vec2 = null;
    switch (this.layout.type) {
      case cc.Layout.Type.HORIZONTAL:
        if (index === 0) {
          position = cc.v2(
            this.layout.paddingLeft + this.item.width / 2,
            -this.item.width
          );
        } else {
          position = cc.v2(
            this.layout.paddingLeft +
              this.item.width * index +
              this.item.width / 2 +
              this.layout.spacingX,
            -this.item.width
          );
        }
        break;
      case cc.Layout.Type.VERTICAL:
        if (index === 0) {
          position = cc.v2(
            this.node.width / 2,
            -this.layout.paddingTop + this.item.height / 2
          );
        } else {
          position = cc.v2(
            this.node.width / 2,
            -(
              this.layout.paddingTop +
              this.item.height * index +
              this.item.height / 2 +
              this.layout.spacingY
            )
          );
        }

        break;
      case cc.Layout.Type.GRID:
        if (this.layout.startAxis === cc.Layout.AxisDirection.HORIZONTAL) {
          position = cc.v2(
            this.layout.paddingLeft +
              (index % this._oneRowOfNum) *
                (this.item.width + this.layout.spacingX) +
              this.item.width / 2,
            -(
              this.layout.paddingTop +
              Math.floor(index / this._oneRowOfNum) *
                (this.item.height + this.layout.spacingY) +
              this.item.height / 2
            )
          );
        } else if (this.layout.startAxis === cc.Layout.AxisDirection.VERTICAL) {
          // 纵向排列 向右扩张
          position = cc.v2(
            this.layout.paddingLeft +
              (index / this._oneColOfNum) *
                (this.item.width + this.layout.spacingX) +
              this.item.width / 2,
            -(
              this.layout.paddingTop +
              Math.floor(index % this._oneRowOfNum) *
                (this.item.height + this.layout.spacingY) +
              this.item.height / 2
            )
          );
        }
        break;
    }

    let item = { index: index, position: position } as Cell;

    this._items[index] = item;
  }

  private handleScrolling() {
    const view = this.node.parent;
    // 获取左下角坐标
    const viewWorldPos = view.convertToWorldSpaceAR(cc.Vec2.ZERO);

    const viewWorldRect = cc.rect(
      viewWorldPos.x - view.width / 2,
      viewWorldPos.y - view.height / 2,
      view.width,
      view.height
    );

    for (let i = 0; i < this._items.length; ++i) {
      const cell = this._items[i];
      const cellWorldPos = this.node.convertToWorldSpaceAR(
        cc.v2(
          cell.position.x - this.item.width / 2,
          cell.position.y - this.item.height / 2
        )
      );
      const cellWorldRect = cc.rect(
        cellWorldPos.x,
        cellWorldPos.y,
        this.item.width,
        this.item.height
      );

      const visible = viewWorldRect.intersects(cellWorldRect);
      this.ctorlItem(cell, visible);
    }
  }

  // 控制节点
  private ctorlItem(cell: Cell, visible: boolean) {
    let item: cc.Node = this.node.children[cell.index];
    if (visible) {
      if (item) {
        item.active = true;
      } else {
        item = cc.instantiate(this.item);
        item.setPosition(cell.position);
        // this.node.children[cell.index] = item;
        this.node.addChild(item)
      }
      this._provider.upateCell(item, cell.index);
    } else {
      if (item) {
        item.active = false;
      }
    }
  }

  /**
   * 算出一行可以容纳几个子节点(layout type为 grid 时，切axiotype 为 hor)
   */
  private _oneRowOfNum: number = 1;
  _computeOneRowOfNum() {
    // 剩余宽度
    const _surplusWidth =
      this.scrollView.content.width -
      this.layout.paddingLeft -
      this.layout.paddingRight;
    // 一个节点所在宽度
    const _width = this.item.width + this.layout.spacingX;

    this._oneRowOfNum = Math.floor(_surplusWidth / _width);
    // 剩余宽度是否还能容下一个节点
    if (_surplusWidth % this._oneRowOfNum >= this.item.width) {
      this._oneRowOfNum++;
    }
  }

  /**
   * 算出一列可以容纳几个子节点(layout type为 grid 时，切axiotype 为 ver)
   */
  private _oneColOfNum: number = 1;
  _computeOneColOfNum() {
    // 剩余高度
    const _surplusHeight =
      this.scrollView.content.height -
      this.layout.paddingTop -
      this.layout.paddingBottom;
    // 一个节点所在高度
    const _height = this.item.height + this.layout.spacingY;

    this._oneColOfNum = Math.floor(_surplusHeight / _height);
    // 剩余高度是否还能容下一个节点
    if (_surplusHeight % this._oneColOfNum >= this.item.height) {
      this._oneColOfNum++;
    }
  }
}
