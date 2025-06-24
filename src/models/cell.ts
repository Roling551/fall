export class TraverseTreeInfo {
    constructor(public width: number, public height: number){}
}

export interface CellCreationData<T>{
    data: T, 
    children?: CellCreationData<T>[]
}

export function createTree<T>(creationData: CellCreationData<T>):Cell<T> 
{
    const cell = new Cell(creationData.data)
    if(!creationData.children) {
        return cell
    }
    for(const child of creationData.children) {
        cell.addChild(createTree(child));
    }
    return cell
}

export class CellInfo<T>{
    constructor(public cell: Cell<T>, public row: number, public column: number, public parent?: CellInfo<T>){}
}

export class Cell<T> {
    children = new Array<Cell<T>>()
    public parent?: Cell<T>
    constructor(public value: T) {}

    addChild(child: Cell<T>): Cell<T> {
        child.parent = this
        this.children.push(child)
        return child;
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