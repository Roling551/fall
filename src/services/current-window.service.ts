import { Injectable, signal } from "@angular/core";


export type Window = "world-map" | "tech-tree"

@Injectable({
  providedIn: 'root'
})
export class CurrentWindowService {
    public currentWindow = signal<Window>("world-map")
}