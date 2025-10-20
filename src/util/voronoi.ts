import { Coordinate } from "../models/coordinate";

export function getRandomVoronoi(xSize: number, ySize: number, sitesNumber: number) {
    const sites = getRandomSites(xSize, ySize, sitesNumber)
    return voronoi(xSize, ySize, sites.sites, sites.array)
}

export function getRandomSites(xSize: number, ySize: number, sitesNumber: number) {
    const array:number[][] = Array.from({ length: xSize }, () => Array(ySize).fill(-1));
    const sites:Coordinate[] = []
    for(let i = 0; i<sitesNumber; i++) {
        let correctPlacement = false
        while(!correctPlacement) {
            const randomX = Math.floor(Math.random() * xSize)
            const randomY = Math.floor(Math.random() * ySize)
            if(array[randomX][randomY] < 0) {
                correctPlacement = true
                array[randomX][randomY] = i
                sites.push(new Coordinate(randomX, randomY))
            }
        }
    }
    return {sites, array}
}

export function voronoi(xSize: number, ySize: number, sites: Coordinate[], array?:number[][]) {
    const sitesNumber = sites.length
    if(!array) {
        array = Array.from({ length: xSize }, () => Array(ySize).fill(-1));
    }
    for(let x = 0; x<xSize; x++) {
        for(let y = 0; y<ySize; y++) {
            if(array[x][y]<0) {
                let shortestDistance = Infinity
                let closestSite = 0
                for(let i = 0; i<sitesNumber; i++) {
                    const site = sites[i]
                    const distance = countDistance(x, y, site.x, site.y)
                    if(distance < shortestDistance) {
                        shortestDistance = distance
                        closestSite = i
                    }
                }
                array[x][y]=closestSite
            }
        }
    }
    return array
}

function countDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}