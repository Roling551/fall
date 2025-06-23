import { Component, Input, OnInit } from '@angular/core';
import { Cell, CellInfo } from '../../models/node';

@Component({
  selector: 'app-tree',
  imports: [],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent implements OnInit{

  // @Input({required: true}) sizeX!:number;
  // @Input({required: true}) sizeY!:number;

  @Input() sizeX = 100;
  @Input() sizeY = 50;

  tree = new Cell<number>(0);
  cellInfo

  constructor() {
    const childA = this.tree.addChild(1);
    this.tree.addChild(2);
    childA.addChild(3);
    childA.addChild(4);
    this.cellInfo = this.getCellInfo()
  }

  ngOnInit(): void {
  }

  getCellInfo() {
    const array:CellInfo<number>[] = []
    this.tree.traverse(array, 0, 0)
    return array
  }

  public getTransformX(column:number) {
    return this.sizeX * column
  }
  public getTransformY(row:number) {
    return this.sizeY * row
  }
}
