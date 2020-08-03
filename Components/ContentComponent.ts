const { ccclass, property } = cc._decorator

interface Cell {
    index: number
    position: cc.Vec2
}

/**
 * 使用方法，把content 的锚点设置到左上角（0，1）
 *  不支持（垂直和水平同时滚动）
 *  未完成
 */
@ccclass
export default class ScrollViewComponent extends cc.Component {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Layout)
    layout: cc.Layout = null

    @property({ tooltip: '一行几个节点', type: cc.Integer })
    row: number = 0 // 当横向滚动时 row 可为零自动加载

    @property({ tooltip: '一列几个节点', type: cc.Integer })
    column: number = 0 // 垂直滚动时column自动加载

    protected data: Array<any> = []
    protected item: cc.Node = null

    private _viewList: Cell[] = []
    private _hideList: Cell[] = []

    regestEvent() {
        this.scrollView.node.on('scrolling', this.handleScrolling, this)
    }

    private _items: Array<Cell> = []
    public load() {
        if (this.layout.type === cc.Layout.Type.GRID) {
            if (this.layout.startAxis === cc.Layout.AxisDirection.HORIZONTAL) {
                this._computeOneRowOfNum()
            } else {
                this._computeOneColOfNum()
            }
        }

        // 创建初始化数据
        for (let i = 0; i < this.data.length; ++i) {
            this.createItem(i)
        }
    }

    /**
     * 创建没有Item 的数据(并不是节点)
     * @param index
     */
    createItem(index: number) {
        // 算位置，算出相应的坐标 （Layout，可以得出 位置）
        let position: cc.Vec2 = null

        switch (this.layout.type) {
            case cc.Layout.Type.HORIZONTAL:
                if (index === 0) {
                    position = cc.v2(
                        this.layout.paddingLeft + this.item.width / 2,
                        0
                    )
                } else {
                    position = cc.v2(
                        this.layout.paddingLeft +
                            this.item.width * index +
                            this.item.width / 2 +
                            this.layout.spacingX,
                        0
                    )
                }
                break
            case cc.Layout.Type.VERTICAL:
                if (index === 0) {
                    position = cc.v2(
                        0,
                        this.layout.paddingTop + this.item.height / 2
                    )
                } else {
                    position = cc.v2(
                        0,
                        this.layout.paddingTop +
                            this.item.height * index +
                            this.item.height / 2 +
                            this.layout.spacingY
                    )
                }

                break
            case cc.Layout.Type.GRID:
                if (
                    this.layout.startAxis === cc.Layout.AxisDirection.HORIZONTAL
                ) {
                    position = cc.v2(
                        this.layout.paddingLeft +
                            (index % this._oneRowOfNum) *
                                (this.item.width + this.layout.spacingX) +
                            this.item.width / 2,
                        this.layout.paddingTop +
                            Math.floor(index / this._oneRowOfNum) *
                                (this.item.height + this.layout.spacingY) +
                            this.item.height / 2
                    )
                } else if (
                    this.layout.startAxis === cc.Layout.AxisDirection.VERTICAL
                ) {
                    // 纵向排列 向右扩张
                    position = cc.v2(
                        this.layout.paddingLeft +
                            (index / this._oneColOfNum) *
                                (this.item.width + this.layout.spacingX) +
                            this.item.width / 2,
                        this.layout.paddingTop +
                            Math.floor(index % this._oneRowOfNum) *
                                (this.item.height + this.layout.spacingY) +
                            this.item.height / 2
                    )
                }
                break
        }

        let item = { index: index, position: position } as Cell
        this._items[index] = item
    }

    private handleScrolling() {
        const view = this.node.parent
        const viewRect = view.getBoundingBox()

        if (this.scrollView.vertical) {
            // 垂直 （多少列）
            const _column = this.column > 0 ? this.column : 1

            for (let i = 0; i < this._items.length; ++i) {
                const _colu = Math.floor(i / _column)
            }
        }
    }

    /**
     * 算出一行可以容纳几个子节点(layout type为 grid 时，切axiotype 为 hor)
     */
    private _oneRowOfNum: number = 1
    _computeOneRowOfNum() {
        // 剩余宽度
        const _surplusWidth =
            this.scrollView.content.width -
            this.layout.paddingLeft -
            this.layout.paddingRight
        // 一个节点所在宽度
        const _width = this.item.width + this.layout.spacingX

        this._oneRowOfNum = Math.floor(_surplusWidth / _width)
        // 剩余宽度是否还能容下一个节点
        if (_surplusWidth % this._oneRowOfNum >= this.item.width) {
            this._oneRowOfNum++
        }
    }

    /**
     * 算出一列可以容纳几个子节点(layout type为 grid 时，切axiotype 为 ver)
     */
    private _oneColOfNum: number = 1
    _computeOneColOfNum() {
        // 剩余高度
        const _surplusHeight =
            this.scrollView.content.height -
            this.layout.paddingTop -
            this.layout.paddingBottom
        // 一个节点所在高度
        const _height = this.item.height + this.layout.spacingY

        this._oneColOfNum = Math.floor(_surplusHeight / _height)
        // 剩余高度是否还能容下一个节点
        if (_surplusHeight % this._oneColOfNum >= this.item.height) {
            this._oneColOfNum++
        }
    }
}
