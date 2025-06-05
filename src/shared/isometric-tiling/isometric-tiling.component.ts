import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, Input, input, OnInit, output, signal, TemplateRef } from '@angular/core';
import panzoom, { PanZoom, Transform } from 'panzoom';

@Component({
  selector: 'app-isometric-tiling',
  imports: [CommonModule],
  templateUrl: './isometric-tiling.component.html',
  styleUrl: './isometric-tiling.component.scss'
})
export class IsometricTilingComponent<T> implements OnInit, AfterViewInit {
  @Input({required: true}) tilesData! : Map<string, T>;
  @Input() minZoom = 0.5;
  @Input() maxZoom = 6;

  @Input() backgroundImage?: string;

  @Input({required: true}) sizeX!:number;
  @Input({required: true}) sizeY!:number;

  @Input({required: true}) tileTemplate!:TemplateRef<any>;

  @Input() distanceToUpdate = 20;

  @Input() allowedPixelsMovedForClick = 5;

  tileClick = output<{key:{x:number, y:number}, value:T}>();
  updateTiles = output<{x: number, y:number}>();

  public positionRectX = 0
  public positionRectY = 0

  public positionX = 0
  public positionY = 0

  public centerPositionX = 0
  public centerPositionY = 0

  public previousCenterPositionX = 0
  public previousCenterPositionY = 0

  public tileOnScreenX = 0
  public tileOnScreenY = 0

  currentTransform: Transform = {x:0, y:0, scale:1}
  panStartTransform: Transform | null = null

  ngOnInit(): void {
    this.calculateTilesOnScreen()
    this.calcuateCenterPosition()
  }

  ngAfterViewInit() {
    const element = document.getElementById('zoom-target');
    const instance = panzoom(element!, {zoomDoubleClickSpeed: 1, minZoom: this.minZoom, maxZoom: this.maxZoom});

    const component = this
    instance.on('transform', function(e: any) {
      const transform = e.getTransform()
      component.currentTransform = transform
      component.positionRectX = Math.floor(transform.x/component.sizeX/transform.scale)
      component.positionRectY = Math.floor(transform.y/component.sizeY/transform.scale)
      component.positionX = Math.floor((-transform.x/component.sizeX - transform.y/component.sizeY)/transform.scale)
      component.positionY = Math.floor((transform.x/component.sizeX - transform.y/component.sizeY)/transform.scale + 0.5)
      component.calculateTilesOnScreen()
      component.calcuateCenterPosition()
    });

    instance.on('panstart', function(e: any) {
      component.panStartTransform = {...e.getTransform()} as Transform
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.calculateTilesOnScreen()
    this.calcuateCenterPosition()
  }

  private calculateTilesOnScreen() {
    this.tileOnScreenX = Math.ceil(window.innerWidth / this.sizeX / this.currentTransform.scale);
    this.tileOnScreenY = Math.ceil(window.innerHeight / this.sizeY / this.currentTransform.scale);
  }

  private  calcuateCenterPosition() {
      const transform = {
        x:this.currentTransform.x - window.innerWidth/2, 
        y:this.currentTransform.y - window.innerHeight/2, 
        scale:this.currentTransform.scale
      }
      this.centerPositionX = Math.floor((-transform.x/this.sizeX - transform.y/this.sizeY)/transform.scale)
      this.centerPositionY = Math.floor((transform.x/this.sizeX - transform.y/this.sizeY)/transform.scale + 0.5)
      if(
            !this.previousCenterPositionX
          ||
            Math.abs(this.centerPositionX - this.previousCenterPositionX) +
            Math.abs(this.centerPositionY - this.previousCenterPositionY) >=
            this.distanceToUpdate
        ) {
          this.updateTiles.emit({x:this.centerPositionX, y:this.centerPositionY})
          this.previousCenterPositionX = this.centerPositionX
          this.previousCenterPositionY = this.centerPositionY
      }
  }

  public getTransformX(x: number, y:number) {
    return (this.sizeX * (x - y)) / 2
  }
  public getTransformY(x: number, y:number) {
    return (this.sizeY * (x + y)) / 2
  }

  public onTileClick(tileData:{key:{x:number, y:number}, value:any}) {
    // console.log("click")
    // if(
    //   !this.panStartTransform || 
    //   this.getOnScreenTransformDistance(this.panStartTransform, this.currentTransform) < this.allowedPixelsMovedForClick
    // ) {
    //   this.tileClick.emit(tileData)
    // } else {
    //   console.log("click didnt happen")
    //   console.log(this.panStartTransform)
    //   console.log(this.getOnScreenTransformDistance(this.panStartTransform, this.currentTransform))
    // }
    this.tileClick.emit(tileData)
    this.panStartTransform = null
  }

  private getOnScreenTransformDistance(t1: Transform, t2: Transform): number {
    return Math.sqrt((t1.x - t2.x) ** 2 + (t1.y - t2.y) ** 2)
  }

  get backgroundTransform(): string {
     return `translate(${(-this.positionRectX-1) *this.sizeX}px, ${(-this.positionRectY-1) *this.sizeY}px)`;
  }

  getRange(n: number): ArrayIterator<number> {
    return Array(n).keys()
  }
}
