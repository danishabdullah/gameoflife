import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';


import {Cell} from "../Shared/models/Cell";
import {getColour} from "../Shared/funcs";
import {
    strokeColour, userBirthColour, userKillColour, windowX, worldX, worldY, xCellWidth,
    yCellWidth, windowY, TRANSITION_TIME
} from "../Shared/consts";
import {GameService} from "../Shared/services/game";


@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.css'],
    providers: [GameService, MatSnackBar]
})
export class PlayComponent implements OnInit {
    CONTROL = 0;
    WORLD: any;
    TIMER: any;

    constructor(private gameService: GameService, private snackBar: MatSnackBar) {
    }

    getCurrentStateData() {
        let self = this;
        return self.gameService.getCurrentStateData();
    }

    animationStart() {
        if (this.CONTROL === 0) {
            this.CONTROL = 1;
        } else {
            console.log("Cannot start -- already running.");
            return;
        }
        if (!this.gameService.currentGame.playable) {
            console.log("Animation cannot be started until initial conditions are set.");
            this.CONTROL = 0;
            return;
        }
        if (this.TIMER) {
            console.log("interval cleared");
            clearInterval(this.TIMER);
        }
        let self = this;
        function animationStep() {
            self.gameService.getNextStateData();
            if (!self.gameService.currentGame.playable) {
                clearInterval(self.TIMER);
                self.CONTROL = 0;
            }
            self.WORLD
                .data(self.getCurrentStateData(),
                    (d: Cell) => d.toString())
                .transition()
                .delay(TRANSITION_TIME * 0.1)
                .duration(TRANSITION_TIME * 0.9)
                .attr('fill', function (d: Cell) {
                    return getColour(d.state);
                });
        }
        this.TIMER = setInterval(animationStep, TRANSITION_TIME);
    }

    animationReset() {
        if (this.CONTROL === 1) {
            // Stop and reset
            clearInterval(this.TIMER);
            this.CONTROL = 0;
            console.log("Stopped and reset.");
        } else if (this.CONTROL === 0) {
            console.log("Reset already stopped sim.");
        }
        this.gameService.currentGame.reset();
        this.WORLD
            .data(this.getCurrentStateData(),
                (d: Cell) => d.toString())
            .transition()
            .delay(0)
            .duration(1000)
            .attr('fill', function (d: Cell) {
                console.log(`resetting the cell colour to ${d.state}`);
                return getColour(d.state);
            });
    }

    animationStop() {
        if (this.CONTROL === 0) {
            console.log("Cannot stop -- not running.");
        } else {
            clearInterval(this.TIMER);
            console.log("Stopped running simulation.");
            this.CONTROL = 0;
        }

    }

    randomizeAnimation() {
        if (this.CONTROL === 1) {
            clearInterval(this.TIMER);
            this.CONTROL = 0;
            console.log("Stopped and random data added.");
        } else if (this.CONTROL === 0) {
            console.log("Random data replacing stopped board.");
        }
        this.gameService.currentGame.reset();
        this.gameService.currentGame.randomizeInitState();
        this.WORLD
            .data(this.getCurrentStateData(),
                (d: Cell) => d.toString())
            .transition()
            .delay(TRANSITION_TIME * 0.1)
            .duration(TRANSITION_TIME * 0.9)
            .attr('fill', function (d: Cell) {
                return getColour(d.state);
            });
    }

    saveWorld() {
        if (this.CONTROL === 1) {
            clearInterval(this.TIMER);
            this.CONTROL = 0;
            console.log("Stopped and saved");
        } else if (this.CONTROL === 0) {
            console.log("Saved data");
        }
        let snackbarConf = new MatSnackBarConfig();
        snackbarConf.duration = 2500;

        try {
            let res = this.gameService.save();
            let snackBar = this.snackBar.open('Game conditions saved to the database',
                '', snackbarConf);
        } catch (e) {
            console.log(`failed to save: ${e}`);
            let snackBar = this.snackBar.open('Saving failed. Please check server settings.',
                '', snackbarConf);
        }
    }

    ngOnInit() {
        let id = '#grid';

        let svg = d3.select(id).append("svg")
            .attr("width", windowX)
            .attr("height", windowY)
            .attr("class", "grid");

        let group = svg.append("g");

        let cellFactory = (w) => {
            // create the cells using d3 rectangles.
            w
                .attr('class', 'cell')
                .attr('height', yCellWidth)
                .attr('width', xCellWidth)
                .attr('x', function (d: Cell) {
                    return (d.x * xCellWidth);
                })
                .attr('y', function (d: Cell) {
                    return (d.y * yCellWidth);
                })
                .attr('fill', function (d: Cell) {
                    return getColour(d.state);
                })
                .attr('stroke', strokeColour)
                .attr('ObjectID', function (d: Cell) {
                    return (d.toString());
                }); // mainly for debugging

        };
        let world = group.selectAll('cells').data(this.getCurrentStateData(),
            (d: Cell) => d.toString()).enter().append('rect').call(cellFactory);
        this.WORLD = world;
        let self = this;
        world
            .on('click', function () {
                let element = d3.select(this);
                let cell: Cell = element.data()[0] as Cell;
                if (Cell.DEATH_STATES.includes(cell.state)) {
                    cell.state = 5;
                    self.gameService.currentGame.addLivingCellToCurrentState(cell);
                    element.attr('fill', userBirthColour);
                } else {
                    cell.state = 6;
                    self.gameService.currentGame.killLivingFromCurrentState(cell);
                    element.attr('fill', userKillColour);
                }
            })
            .on('mouseover', function () {
                let element = d3.select(this);
                let cell: Cell = element.data()[0] as Cell;
                if (Cell.DEATH_STATES.includes(cell.state)) {
                    element.attr('fill', userBirthColour);
                }
            })
            .on('mouseout', function () {
                let element = d3.select(this);
                let cell: Cell = element.data()[0] as Cell;
                element.attr('fill', getColour(cell.state));
            });

    }

}
