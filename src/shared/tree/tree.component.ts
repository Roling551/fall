import { Component, Input, OnChanges, OnInit, TemplateRef } from '@angular/core';
import { Cell, CellInfo, TraverseTreeInfo } from '../../models/cell';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tree',
  imports: [CommonModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent<T> implements OnChanges {

  @Input({required: true}) cellTemplate!: TemplateRef<any>;
  @Input({required: true}) tree!: Cell<T>

  @Input({required: true}) sizeX!: number;
  @Input({required: true}) sizeY!: number;

  @Input({required: true}) spaceX!: number;
  @Input({required: true}) spaceY!: number;

  cellInfoArray?: CellInfo<T>[];
  traverseInfo?: TraverseTreeInfo;


  ngOnChanges(): void {
    const {cellInfoArray, traverseInfo} = this.traverse(this.tree)
    this.cellInfoArray = cellInfoArray
    this.traverseInfo = traverseInfo
  }

  traverse(tree: Cell<T>) {
    const cellInfoArray:CellInfo<T>[] = []
    const traverseInfo = tree.traverse(cellInfoArray, 0, 0)
    return {cellInfoArray, traverseInfo}
  }

  public getTransformX(column:number) {
    return (this.sizeX + this.spaceX) * column
  }
  public getTransformY(row:number) {
    return (this.sizeY + this.spaceY) * row
  }
  public getSvgHeight() {
    return (this.sizeY + this.spaceY) * (this.traverseInfo? this.traverseInfo.height: 0)
  }
  public getSvgWidth() {
    return (this.sizeX + this.spaceX) *  (this.traverseInfo? this.traverseInfo.width: 0)
  }
  public getBottomY(row:number) {
    return (this.sizeY + this.spaceY) * row + this.sizeY
  }
  public getMiddleX(column: number) {
    return (this.sizeX + this.spaceX) * column + this.sizeX / 2
  }
  public getWidth(cell:CellInfo<T>) {
    return (cell.cell.width * this.sizeX) + ((cell.cell.width - 1) * this.spaceX)
  }
}
