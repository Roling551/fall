import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { TextPart } from '../models/text-part';

@Directive({
  selector: '[hoverInfo]'
})
export class HoverInfoDirective implements OnInit {
  @Input() hoverInfo?: TextPart[];

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
        if(this.hoverInfo){
            (this.el.nativeElement as any).__hoverInfo = this.hoverInfo;
        }
    }
}