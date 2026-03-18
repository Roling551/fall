import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PlayerStatsService {
    provisionCapacity = signal(25)
    characterCardsDrawnPerTurn = signal(3)
}