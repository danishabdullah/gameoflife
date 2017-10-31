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
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    constructor(private gameService: GameService, private gamesService: GamesService,
                private router: Router, private snackbar: MatSnackBar){
    }

    reload() {
        this.gamesService.loadGames();
        let snackbarConf = new MatSnackBarConfig();
        snackbarConf.duration = 2500;
        let snackbarRef = this.snackbar.open('Game data has been loaded.)',
            '', snackbarConf);
    }

    select(id: number, game: Game) {
        this.router.navigateByUrl('/play').then( success => {
            console.log("Setting the game to new game");
            this.gameService.setGame(game, id);
            }
        );
    }

    ngOnInit() {
        this.gamesService.loadGames();
    }

}
