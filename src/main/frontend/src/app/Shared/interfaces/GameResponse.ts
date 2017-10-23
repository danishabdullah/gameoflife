import {Cell} from "../models/Cell";
import {Set} from 'typescript-collections';
import {Game} from "../models/Game";

export interface GameResponse {
    id: number;
    worldX: number;
    worldY: number;
    aliveCells: string;
}

export function getAliveCellsFromLoadedGameData(res: GameResponse): Set<Cell> {
    let cells: Array<string> = res.aliveCells.split(';');
    if (!cells.length) {
        return new Set<Cell>();
    }
    let agg: Set<Cell> = new Set<Cell>();
    for (let cellData of cells) {
        let x: number,
            y: number,
            x0: string,
            y0: string;
        [x0, y0] = cellData.split(',');
        x = parseInt(x0, 10);
        y = parseInt(y0, 10);
        try {
            let cell = new Cell(x, y, res.worldX, res.worldY, 2);
            agg.add(cell);
        } catch (e) {
            // ignore exceptions
        }
    }
    return agg;
}

export function makeGame(data: GameResponse): Game {
    return new Game(data.worldX, data.worldY, getAliveCellsFromLoadedGameData(data));
}
