import {Set} from 'typescript-collections';

import {MAX_X, MAX_Y, MIN_X, MIN_Y} from "../consts";

export class Cell {
    static DEATH_STATES: Array<number> = [0, 3, 4, 6];
    static LIFE_STATES: Array<number> = [1, 2, 5];
    x: number;
    y: number;
    worldX: number;
    worldY: number;
    neighbours: Set<Cell> = new Set<Cell>();
    state = 0; // 0 = dead,
               // 1 = staying alive,
               // 2 = will be born because of reproduction,
               // 3 = will die because of over population,
               // 4 = will die because of under population,
               // 5 = will be born because of user interaction,
               // 6 = will be killed because of user interaction

    constructor(x: number, y: number, worldX: number, worldY: number, state: number = 0) {
        // Don't want a ridiculously large grid. Max `600 x 288 = 172800` cells.
        // Realistically our outer code is going to restrict it even further.
        // Most cases should be `50 x 24 = 1200` depending on screen size.

        if ((worldX > MAX_X) || (worldX < MIN_X)) {
            throw new RangeError(`Invalid world co-ordinates for Point(${x}, ${y}). ` +
                `worldX must be between (${MIN_X}, ${MAX_X})`);
        }

        if ((worldY > MAX_Y) || (worldY < MIN_Y)) {
            throw new RangeError(`Invalid world co-ordinates for Point(${x}, ${y}). ` +
                `worldY must be between (${MIN_Y}, ${MAX_Y})`);
        }

        // Wrap out of bounds points to the boundary. When searching for neighbours,
        // this should make the search easy as the wrap will take care of the points
        // past the edge and if we take a set of all neighbours, same points will be
        // eliminated. Hence the need for a fast/efficient hash function.
        if ((x > worldX)) {
            console.log(`x co-ordinate (${x}) is out of world x range (${MIN_X}, ${worldX}). ` +
                `Wrapping around to the limits of the world`);
            x = worldX;
        } else if (x < MIN_X) {
            console.log(`x co-ordinate (${x}) is out of world x range (${MIN_X}, ${worldX}). ` +
                `Wrapping around to the limits of the world.`);
            x = MIN_X;
        }
        if (y > worldY) {
            console.log(`y co-ordinate (${y}) is out of world y range (${MIN_Y}, ${worldY}) ` +
                `Wrapping around to the limits of the world.`);
            y = worldY;
        } else if (y < MIN_Y) {
            console.log(`y co-ordinate (${y}) is out of world y range (${MIN_Y}, ${worldY}) ` +
                `Wrapping around to the limits of the world.`);
            y = MIN_Y;
        }
        if (state > 4 || state < 0) {
            console.log("state of cell can only be between 0 and 4. Invalid input prodvided " +
                `for point (${x}, ${y}). Resetting state to 0.`);
            state = 0;
        }
        this.x = x;
        this.y = y;
        this.worldX = worldX;
        this.worldY = worldY;
        this.state = state;
    }

    hash() {
        // for reasonably small x and y values this should be a sufficient hash as we
        // are multiplying the components with primes and adding up.
        // helps clear up identity issues.
        return this.x * 3 + this.y * 5;
    }

    toString() {
        return `${this.x},${this.y}`;
    }

    getNeighbours() {
        // Calculating with offsets in a data structure that handles that gracefully can
        // simplify neighbour counting and sums. However, it will be less maintainable in
        // future. Hence why such a verbose version is being preferred.

        // we are not going to wrap around. Taking advantage of initialization
        // confining to WORLD limits code, we don't have to do much of check for
        // boundaries here

        if (this.neighbours.size()) {
            // Calculating only once is enough
            return this.neighbours;
        }

        let above = true;
        let below = true;
        let left = true;
        let right = true;

        // where can the neighbours be
        if ((this.x - 1) < MIN_X) {
            // console.log(`No neighbours above for (${this.toString()})`); // debug message
            above = false;
        }
        if ((this.x + 1) > this.worldX) {
            // console.log(`No neighbours below for (${this.toString()})`); // debug message
            below = false;
        }
        if ((this.y - 1) < MIN_Y) {
            // console.log(`No neighbours left for (${this.toString()})`); // debug message
            left = false;
        }
        if ((this.y + 1) > this.worldY) {
            // console.log(`No neighbours right for (${this.toString()})`); // debug message
            right = false;
        }
        // console.log(`above: ${above}\nbelow: ${below}\nleft: ${left}\nright: ${right}\n`); // debug message

        // collect neighbours
        // Note: Edge checking is further aided by the wrapping to the
        // bounds in the constructor
        let neighbours: Set<Cell> = new Set<Cell>();

        const neighboursInc = [-1, 0, 1];

        // handle the neighbours above first.
        for (let rowInc of neighboursInc) {
            // console.log(`rowInc is ${rowInc}`); // debug message
            // rows go top to bottom
            if ((rowInc === -1) && (!above)) {
                // console.log("Not going above"); // debug message
                // shouldn't go up
                continue;
            } else if ((rowInc === 1) && (!below)) {
                // console.log("Not going below"); // debug message
                // shouldn't go below
                continue;
            }
            for (let colInc of neighboursInc) {
                // console.log(`colInc is ${colInc}`); // debug message
                // cols go left to right
                if ((colInc === -1) && (!left)) {
                    // console.log("Not going left."); // debug message
                    // shouldn't go left
                    continue;
                } else if ((colInc === 1) && (!right)) {
                    // console.log("Not going right."); // debug message
                    // shouldn't go right
                    continue;
                }
                if ((rowInc === 0) && (colInc === 0)) {
                    // console.log("skipping the same point"); // debug message
                    // we are at the same point as current one since there's no increment
                    continue;
                }
                let neighbour = new Cell(this.x + rowInc, this.y + colInc,
                    this.worldX, this.worldY);
                neighbours.add(neighbour);
            }
        }
        if (!neighbours.size()) {
            // Zero neighbours doesn't make any sense.
            throw RangeError(`There must be at least one neighbour for (${this.x}, ${this.y})`);
        }
        this.neighbours = neighbours;
        return neighbours;
    }

    kill(reason: string) {
        if (reason === "over population") {
            this.state = 3;
        } else if (reason === "under population") {
            this.state = 4;
        } else if (reason === 'user interaction') {
            this.state = 6;
        } else {
            console.log("Invalid reason for killing the cell provided");
        }
    }

    giveLife(userIntervention: boolean = false) {
        if (userIntervention === true) {
            this.state = 5;
        } else {
            this.state = 2;
        }
    }

    keepAlive() {
        this.state = 1;
    }
}
