import { Injectable } from "@angular/core";
import { Headquarters } from "../models/headquarters";

@Injectable({
  providedIn: 'root'
})
export class HeadquartersService {
    headquarters = new Headquarters()
}