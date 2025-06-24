import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Cell, CellInfo } from '../../models/cell';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tree',
  imports: [CommonModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent {

  @Input({required: true}) cellTemplate!: TemplateRef<any>;

  @Input({required: true}) sizeX!: number;
  @Input({required: true}) sizeY!: number;

  @Input({required: true}) spaceX!: number;
  @Input({required: true}) spaceY!: number;

  tree = new Cell<number>(0);
  cellInfoArray
  traverseInfo


  constructor() {
    const childA = this.tree.addChild(1);
    this.tree.addChild(2);
    childA.addChild(3);
    childA.addChild(4);
    const {cellInfoArray, traverseInfo} = this.traverse()
    this.cellInfoArray = cellInfoArray
    this.traverseInfo = traverseInfo
    console.log(traverseInfo.height)
  }

  traverse() {
    const cellInfoArray:CellInfo<number>[] = []
    const traverseInfo = this.tree.traverse(cellInfoArray, 0, 0)
    return {cellInfoArray, traverseInfo}
  }

  public getTransformX(column:number) {
    return (this.sizeX + this.spaceX) * column
  }
  public getTransformY(row:number) {
    return (this.sizeY + this.spaceY) * row
  }
  public getSvgHeight() {
    return (this.sizeY + this.spaceY) * this.traverseInfo.height 
  }
  public getSvgWidth() {
    return (this.sizeX + this.spaceX) *  this.traverseInfo.width
  }
  public getBottomY(row:number) {
    return (this.sizeY + this.spaceY) * row + this.sizeY
  }
  public getMiddleX(column: number) {
    return (this.sizeX + this.spaceX) * column + this.sizeX / 2
  }
}
