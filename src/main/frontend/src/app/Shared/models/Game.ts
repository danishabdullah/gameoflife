import {Set} from 'typescript-collections';
import {Cell} from "./Cell";
import {MAX_X, MAX_Y, MIN_X, MIN_Y} from "../consts";
import {getRandomInt} from "../funcs";


export class Game {
    worldX: number;
    worldY: number;
    state: object;
    playable: boolean;
    step = 0;
    history: object = {};

    constructor(worldX: number, worldY: number, aliveCells = new Set<Cell>()) {
        this.playable = false;
        if (!(worldX && worldY)) {
            throw new RangeError("No game can be played on a size zero WORLD. " +
                "Please supply a reasonable WORLD size.");
        }
        if ((worldX > MAX_X) || (worldX < MIN_X)) {
            throw new RangeError("Invalid WORLD co-ordinates for this game. " +
                `worldX must be between (${MIN_X}, ${MAX_X})`);
        }

        if ((worldY > MAX_Y) || (worldY < MIN_Y)) {
            throw new RangeError("Invalid WORLD co-ordinates for this game. " +
                `worldX must be between (${MIN_X}, ${MAX_X})`);
        }
        if (!aliveCells.size()) {
            console.log("Game is being initialized but it can't be played until " +
                "initial alive cells are added.");
            this.playable = false;
        } else {
            this.playable = true;
        }

        this.worldX = worldX;
        this.worldY = worldY;
        this.state = {'living': aliveCells, 'dying': new Set<Cell>()};
        this.history[`${this.step}`] = this.state;
    }

    addLivingCellToCurrentState(cell: Cell) {
        console.log("adding living cell");
        if (!cell) {
            return;
        }
        if (this.step) {
            console.log("We should not add living cells during the game runs.");
        }
        cell.giveLife(true);
        if (!this.playable) {
            this.playable = true;
        }
        if (this.state['living'].contains(cell)) {
            this.state['living'].remove(cell);
        }
        this.state['living'].add(cell);
    }

    killLivingFromCurrentState(cell: Cell) {
        if (!cell) {
            return;
        }
        cell.kill("user interaction");
        this.state['living'].remove(cell);
        if (!this.state['living'].size()) {
            this.playable = false;
        }
        if (this.state['dying'].contains(cell)) {
            this.state['dying'].remove(cell);
        }
        this.state['dying'].add(cell);
    }

    conwayStepEvolvingDeadCells(aliveCells: Set<Cell>) {
        // create an aggregator to collect all the dead cells
        let aggregator: Set<Cell> = new Set<Cell>();
        // animationStep through all the neighbours of the alive cells and collect them
        // if they aren't alive.
        // console.log(`About to find out dead neighbours for ${aliveCells.size()} living cells`);
        for (let aliveCell of aliveCells.toArray()) {
            let neighbours = aliveCell.getNeighbours();
            // console.log(`${aliveCell.toString()} has ${neighbours.size()} neighbours`); // debug message
            for (let neighbour of neighbours.toArray()) {
                if (!aliveCells.contains(neighbour)) {
                    aggregator.add(neighbour);
                }
            }
        }
        return aggregator;
    }

    getLivingNeighbourCount(cell: Cell, aliveCells: Set<Cell>) {
        // counts neighbouring living cells for any cell.
        let count = 0;
        let neighbours = cell.getNeighbours();

        for (let neighbour of neighbours.toArray()) {
            // console.log(`Is (${neighbour.toString()}) alive?`); // debug message
            if (aliveCells.contains(neighbour)) {
                // console.log("yes"); // debug message
                count += 1;
            }
        }
        // console.log(`(${cell.toString()}) has ${count} neighbours alive out of ${neighbours.size()}.`);
        return count;
    }

    conwayStep() {
        if (!this.playable) {
            console.log("Game cannot be played. Please add some living cells first " +
                "with addLivingCellToCurrentState function.");
            return this.state;
        }

        let aliveCellsNextStep: Set<Cell> = new Set<Cell>();
        let dyingCellsNextStep: Set<Cell> = new Set<Cell>();
        let neighbouringDeadCells = this.conwayStepEvolvingDeadCells(this.state['living']);

        console.log(`checking who survived of the ${this.state['living'].size()} alive cells`);
        for (let aliveCell of this.state['living'].toArray()) {
            let neighbours = this.getLivingNeighbourCount(aliveCell, this.state['living']);
            if (neighbours < 2) {
                console.log(`(${aliveCell.toString()}) will die of underpopulation`);
                aliveCell.kill("under population"); // set internal state of the cell
                dyingCellsNextStep.add(aliveCell);
            } else if (neighbours <= 3) {
                console.log(`(${aliveCell.toString()}) will stay alive`);
                aliveCell.keepAlive(); // set internal state of the cell
                aliveCellsNextStep.add(aliveCell);
            } else {
                console.log(`(${aliveCell.toString()}) will die of overpopulation`);
                aliveCell.kill("over population"); // set internal state of the cell
                dyingCellsNextStep.add(aliveCell);
            }
        }
        console.log(`checking who is affected of the ${neighbouringDeadCells.size()} dead neighbouring cells`);
        for (let deadCell of neighbouringDeadCells.toArray()) {
            let neighbours = this.getLivingNeighbourCount(deadCell, this.state['living']);
            if (neighbours === 3) {
                console.log(`(${deadCell.toString()}) will be born.`);
                deadCell.giveLife();
                aliveCellsNextStep.add(deadCell);
            }
        }
        // overwrite alive cells and move the history to next animationStep.
        this.state = {living: aliveCellsNextStep, dying: dyingCellsNextStep};
        if (!aliveCellsNextStep.size()) {
            this.playable = false;
        }
        // increment animationStep
        this.step += 1;
        // save history
        this.history[`${this.step}`] = this.state;
        return this.state;
    }

    reset() {
        this.step = 0;
        this.state = {'living': new Set<Cell>(), 'dying': new Set<Cell>()};
        this.history = {'0': this.state};
        this.playable = false;
    }

    randomizeInitState() {
        if (this.step) {
            console.log("Cannot randomize init state as the game is already at animationStep: " + this.step);
            return;
        }
        let numElements = getRandomInt(50, this.worldY * this.worldX) % 200;
        console.log(`Adding ${numElements} random cells to the initial state`);
        for (let i = 0; i < numElements; i++) {
            let rX = getRandomInt(0, this.worldX);
            let rY = getRandomInt(0, this.worldY);
            this.addLivingCellToCurrentState(new Cell(rX, rY, this.worldX, this.worldY));
        }
    }

    stringifyInitialState(): string {
        let cells = this.history[0].living.toArray();
        let cellStrings: Array<string> = [];
        for (let cell of cells) {
            cellStrings.push(cell.toString());
        }
        return cellStrings.join(';');
    }

    binaryInitialState(): string {
        let living = this.history[0].living;
        let res = [];
        for (let y = 0; y < this.worldY; y++){
            let buffer = [];
            for (let x = 0; x < this.worldX; x++){
                let cell = new Cell(x, y, this.worldX, this.worldY);
                if (living.contains(cell)){
                    buffer.push(1);
                } else {
                    buffer.push(0);
                }
            }
            res.push(buffer.join(" "));
        }
        return res.join('\n');
    }
}
