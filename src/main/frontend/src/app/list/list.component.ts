import {Component, OnInit} from '@angular/core';
import {GamesService} from "../Shared/services/games";
import {GameService} from "../Shared/services/game";
import {Game} from "../Shared/models/Game";
import {TRANSITION_TIME, worldX, worldY} from "../Shared/consts";
import {Router} from "@angular/router";
import {Cell} from "../Shared/models/Cell";
import {getColour} from "../Shared/funcs";
import * as d3 from 'd3';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';



@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    providers: [GamesService, GameService]
})
export class ListComponent implements OnInit {

    constructor(private gameService: GameService, private gamesService: GamesService,
                private router: Router, private snackbar: MatSnackBar){
        gamesService.loadGames();
    }

    reload() {
        this.gamesService.loadGames();
        let snackbarConf = new MatSnackBarConfig();
        snackbarConf.duration = 2500;
        let snackbarRef = this.snackbar.open('Game data has been loaded. :)',
            '', snackbarConf);
    }

    // select(id: number, game: Game) {
    //     this.gameService.setGame(game, id);
    //     this.router.navigateByUrl('/play').then( success =>
    //             // this.transitionWorld()
    //     );
    // }

    ngOnInit() {
    }

    // getCurrentStateData() {
    //     let self = this;
    //     return self.gameService.getCurrentStateData();
    // }
    //
    // transitionWorld(){
    //     let WORLD = d3.select('#grid');
    //
    //     WORLD
    //         .data(this.getCurrentStateData(),
    //             (d: Cell) => d.toString())
    //         .transition()
    //         .delay(TRANSITION_TIME * 0.1)
    //         .duration(TRANSITION_TIME * 0.9)
    //         .attr('fill', function (d: Cell) {
    //             return getColour(d.state);
    //         });
    // }

}
