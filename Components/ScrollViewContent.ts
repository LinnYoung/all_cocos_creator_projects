const { ccclass, property } = cc._decorator

export interface ScrollViewDataProvider {
    /**
     * 列表数量
     */
    scrollViewCellCount(): number

    /**
     * 返回指定格子下标的位置
     * @param index 下标
     */
    scrollViewCellPosition?(index: number): cc.Vec2

    /**
     * 返回列表视图的ContentSize
     */
    scrollViewContentSize(): cc.Size

    /**
     * 返回指定格子的包围盒，需要在不创建节点的情况下获得包围盒大小,用以判断是否创建
     * @param index 下标
     */
    scrollViewCellBoundingBox(index: number): cc.Rect

    /**
     * 创建格子节点
     */
    scrollViewCellCreate(): cc.Node

    /**
     * 更新格子节点数据
     * @param cellNode
     * @param index
     */
    scrollViewCellUpdate(cellNode: cc.Node, index: number)
}

interface Cell {
    index: number
    node?: cc.Node
    bbox?: cc.Rect
    position?: cc.Vec2
    lock?: boolean
    visible: boolean
}

@ccclass
export default class ScrollViewContent extends cc.Component {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property({ displayName: '复用节点' })
    reuseNode: boolean = false

    @property({
        type: cc.Integer,
        displayName: '最大冗余节点数',
        min: 0,
        tooltip: '复用节点时有效，指定额外允许冗余不被回收的节点数'
    })
    maxPoolFreeCount: number = 1

    @property({ tooltip: '水平自动排布时,x间距' })
    paddingX: number = 0

    @property({ tooltip: '垂直自动排布时,y间距' })
    paddingY: number = 0

    @property({
        displayName: '延时创建间隔',
        tooltip: '创建节点延时时间',
        min: 0
    })
    delayCreateInterval: number = 0

    private _dataProvider: ScrollViewDataProvider = null

    private _nodePool: Array<cc.Node> = []

    private getFromPool(): cc.Node | undefined {
        return this._nodePool.pop()
    }

    private putToPool(node: cc.Node) {
        node.setPosition(-100000, -100000)
        this._nodePool.push(node)
    }

    init(provider: ScrollViewDataProvider) {
        this._dataProvider = provider
        this.initCells()
    }

    onLoad() {
        this.scrollView.node.on('scrolling', this.handleScrolling, this)
        this.scrollView.node.on('scroll-ended', this.handleScrollEnded, this)
        if (!this._dataProvider) {
            return
        }
    }

    /**
     * 重新加载数据
     */
    public reload() {
        this.unscheduleAllCallbacks()
        this._pendingCreateCount = 0

        this._cells.forEach(cell => {
            if (cell.node) {
                if (this.reuseNode) {
                    // 复用模式下，将现在节点全部放回池中
                    this.putToPool(cell.node)
                } else {
                    cell.node.destroy()
                }
                cell.node = null
            }
        })

        this._cells.length = 0
        this._lastUpdatedOffset = null
        this.initCells()
        this.handleScrollEnded()
    }

    private _cells: Array<Cell> = []

    private initCells() {
        const cellCount = this._dataProvider.scrollViewCellCount()
        this._cells.length = 0
        for (let i = 0; i < cellCount; ++i) {
            const bbox = this._dataProvider.scrollViewCellBoundingBox(i)
            this.getCell(i).bbox = bbox
        }
        this._cells.forEach(cell => {
            cell.position = this.calculateCellPosition(cell.index)
        })
        this.node.setContentSize(this._dataProvider.scrollViewContentSize())
        this.handleScrolling()
    }

    onDestroy() {
        this.scrollView.node.off('scrolling', this.handleScrolling, this)
        this.scrollView.node.off('scroll-ended', this.handleScrollEnded, this)
        while (this._nodePool.length > 0) {
            const node = this._nodePool.pop()
            if (cc.isValid(node)) {
                node.destroy()
            }
        }
    }

    private calculateCellPosition(index: number) {
        if (this._dataProvider.scrollViewCellPosition) {
            return this._dataProvider.scrollViewCellPosition(index)
        } else {
            let x = 0
            if (this.scrollView.horizontal) {
                for (let i = 0; i <= index; ++i) {
                    const cell = this.getCell(i)
                    if (i < index) {
                        x += cell.bbox.width + this.paddingX
                    } else {
                        x -= cell.bbox.origin.x - this.paddingX
                    }
                }
            }
            let y = 0
            if (this.scrollView.vertical) {
                for (let i = 0; i <= index; ++i) {
                    const cell = this.getCell(i)
                    if (i < index) {
                        y -= cell.bbox.height - this.paddingY
                    } else {
                        y += cell.bbox.origin.y + this.paddingY
                    }
                }
            }
            return cc.v2(x, y)
        }
    }

    public getCellByIndex(index: number): Cell {
        return this.getCell(index)
    }

    private getCell(index: number) {
        if (this._cells[index] === undefined) {
            this._cells[index] = { index, visible: true }
        }
        return this._cells[index]
    }

    private _lastUpdatedOffset: cc.Vec2 = null

    public updateContent() {
        this.handleScrolling()
    }

    private handleScrolling() {
        const view = this.node.parent
        const viewBBox = view.getBoundingBox()

        if (
            this._lastUpdatedOffset &&
            this.scrollView
                .getScrollOffset()
                .sub(this._lastUpdatedOffset)
                .magSqr() < 100
        ) {
            return
        }
        this._lastUpdatedOffset = this.scrollView.getScrollOffset()

        const visibleArr = []
        for (let i = 0; i < this._dataProvider.scrollViewCellCount(); ++i) {
            const cell = this.getCell(i)
            // 判断是否可见
            const bbox = cc.rect(
                this.node.position.x + cell.bbox.origin.x + cell.position.x,
                this.node.position.y + cell.bbox.origin.y + cell.position.y,
                cell.bbox.size.width,
                cell.bbox.size.height
            )
            const visible = viewBBox.intersects(bbox)

            if (this.reuseNode) {
                this.updateWithReuseMode(cell, visible, i)
            } else {
                this.updateWithActiveMode(cell, visible, i)
            }

            if (visible) {
                visibleArr.push(i)
            }
        }
    }

    private handleScrollEnded() {
        while (this._nodePool.length > this.maxPoolFreeCount) {
            const node = this._nodePool.pop()
            node.destroy()
        }
    }

    // 复用节点模式
    private updateWithReuseMode(cell: Cell, visible: boolean, index: number) {
        cell.visible = visible
        if (visible) {
            if (!cell.node) {
                if (cell.lock) {
                    return
                }
                const cachedNode = this.getFromPool()

                cell.lock = true
                const fun = node => {
                    cell.lock = false
                    cell.node = node
                    cell.node.position = cell.position
                    cell.node.setContentSize(cell.bbox.size)
                    this._dataProvider.scrollViewCellUpdate(cell.node, index)
                    if (!cachedNode) {
                        this.node.addChild(cell.node)
                    }
                    if (!cell.visible) {
                        this.putToPool(cell.node)
                        cell.node = null
                    }
                }

                if (!cachedNode) {
                    this.delayCreate(fun)
                } else {
                    fun(cachedNode)
                }
            }
        } else {
            if (cell.node) {
                this.putToPool(cell.node)
                cell.node = null
            }
        }
    }

    // 控制显隐模式
    private updateWithActiveMode(cell: Cell, visible: boolean, index: number) {
        cell.visible = visible
        if (visible) {
            if (!cell.node) {
                if (cell.lock) {
                    return
                }
                cell.lock = true
                cell.visible = true
                this.delayCreate(node => {
                    node.position = cell.position
                    node.setContentSize(cell.bbox.size)
                    cell.lock = false
                    cell.node = node
                    this._dataProvider.scrollViewCellUpdate(cell.node, index)
                    this.node.addChild(cell.node)
                    if (!cell.visible) {
                        cell.node.active = false
                    }
                })
            } else {
                cell.node.active = true
            }
        } else {
            if (cell.node) {
                cell.node.active = false
            }
        }
    }

    private _pendingCreateCount = 0

    private delayCreate(callback: (node: cc.Node) => void) {
        if (this.delayCreateInterval <= 0) {
            const node = this._dataProvider.scrollViewCellCreate()
            callback(node)
            return
        }

        this.scheduleOnce(() => {
            const node = this._dataProvider.scrollViewCellCreate()
            this._pendingCreateCount--
            callback(node)
        }, this.delayCreateInterval * this._pendingCreateCount)
        this._pendingCreateCount++
    }
}
