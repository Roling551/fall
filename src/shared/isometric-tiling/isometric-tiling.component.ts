import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, HostListener, Input, input, OnInit, output, signal, TemplateRef, Type } from '@angular/core';
import panzoom, { PanZoom, Transform } from 'panzoom';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordinate } from '../../models/coordinate';


@Component({
  selector: 'app-isometric-tiling',
  imports: [CommonModule],
  templateUrl: './isometric-tiling.component.html',
  styleUrl: './isometric-tiling.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsometricTilingComponent<T> implements OnInit, AfterViewInit {
  @Input({required: true}) tilesData! : Map<string, T>;
  @Input() minZoom = 0.1;
  @Input() maxZoom = 10;

  @Input() backgroundImage?: string;

  @Input({required: true}) sizeX!:number;
  @Input({required: true}) sizeY!:number;

  @Input({required: true}) tileTemplate!:TemplateRef<any>;
  @Input() additionalGraphics:Map<string, {doRender:((tile: T) => boolean), template:undefined|Type<any>, input?:any}> = new Map();

  @Input() distanceToUpdate = 20;

  @Input() allowedPixelsMovedForClick = 10;

  tileClick = output<T>();

  public positionRectX = 0
  public positionRectY = 0

  public positionX = signal(0)
  public positionY = signal(0)

  public centerPositionX = 0
  public centerPositionY = 0

  public previousCenterPositionX = 0
  public previousCenterPositionY = 0

  public tileOnScreenX = 0
  public tileOnScreenY = 0

  public backgroundTransform = signal("0px, 0px")

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
      component.positionX.set(Math.floor((-transform.x/component.sizeX - transform.y/component.sizeY)/transform.scale))
      component.positionY.set(Math.floor((transform.x/component.sizeX - transform.y/component.sizeY)/transform.scale + 0.5))
      component.calculateTilesOnScreen()
      component.calcuateCenterPosition()
      component.calculateBackgroundTransform()
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
          this.previousCenterPositionX = this.centerPositionX
          this.previousCenterPositionY = this.centerPositionY
      }
  }

  public getTransformX(coordinate: string) {
    const [x, y] = coordinate.split("_").map(n=>Number(n))
    return (this.sizeX * (x - y)) / 2
  }
  public getTransformY(coordinate: string) {
    const [x, y] = coordinate.split("_").map(n=>Number(n))
    return (this.sizeY * (x + y)) / 2
  }

  public onTileClick(tile:T) {
    if(
      !this.panStartTransform || 
      this.getOnScreenTransformDistance(this.panStartTransform, this.currentTransform) < this.allowedPixelsMovedForClick
    ) {
      this.tileClick.emit(tile)
    }
    this.panStartTransform = null
  }

  private getOnScreenTransformDistance(t1: Transform, t2: Transform): number {
    return Math.sqrt((t1.x - t2.x) ** 2 + (t1.y - t2.y) ** 2)
  }

  private calculateBackgroundTransform() {
     this.backgroundTransform.set(
      `translate(${(-this.positionRectX-1) *this.sizeX}px, ${(-this.positionRectY-1) *this.sizeY}px)`
    )
  }

  public getBackgroundSize() {
    return this.sizeX/2 + 'px ' + this.sizeY/2 + 'px'
  }

  getRange(n: number): ArrayIterator<number> {
    return Array(n).keys()
  }

  public getKeyValuePair(x: number, y: number, value: T) {
    return {key: new Coordinate(x,y), value}
  }
}
