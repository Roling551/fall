export class TraverseTreeInfo {
    constructor(public width: number, public height: number){}
}

export class CellInfo<T>{
    constructor(public cell: Cell<T>, public row: number, public column: number, public parent?: CellInfo<T>){}
}

export class Cell<T> {
    children = new Array<Cell<T>>()
    public parent?: Cell<T>
    constructor(public value: T) {}

    addChild(value: T): Cell<T> {
        const childCell = new Cell(value)
        childCell.parent = this
        this.children.push(childCell)
        return childCell;
    }

    traverse(array: CellInfo<T>[], row: number, column: number, parent?: CellInfo<T>): TraverseTreeInfo {
        const cellInfo = new CellInfo(this, row, column, parent)
        array.push(cellInfo);
        let width = 0
        let height = 1
        for(const [index, child] of this.children.entries()) {
            const traverseTreeInfo = child.traverse(array, row+1, column + width, cellInfo)
            width += traverseTreeInfo.width
            height = Math.max(height, traverseTreeInfo.height+1)
        }
        return new TraverseTreeInfo(Math.max(width, 1), height)
    }
}