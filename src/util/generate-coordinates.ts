import { Coordinate } from "../models/coordinate";

export function generateRangeCoordiantes(range: number): Coordinate[] {
    const cooridantes: Coordinate[] = []
    for(let i = -range; i<=range; i++) {
        for(let j = -range; j<=range; j++) {
            if(i-j<=range && j-i<=range) {
                cooridantes.push(new Coordinate(i,j))
            }
        }   
    }
    return cooridantes
}