export class CellInfo<T>{
    constructor(public cell: Cell<T>, public row: number, public column: number){}
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

    traverse(array: CellInfo<T>[], row: number, column: number): number {
        const cellInfo = new CellInfo(this, row, column)
        array.push(cellInfo);
        let columnsToTheRight = 0
        for(const [index, child] of this.children.entries()) {
            columnsToTheRight += child.traverse(array, row+1, column + columnsToTheRight)
        }
        return columnsToTheRight == 0 ? 1 : columnsToTheRight;
    }
}