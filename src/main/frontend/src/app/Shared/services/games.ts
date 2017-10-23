import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Game} from "../models/Game";
import {GameResponse, makeGame} from "../interfaces/GameResponse";

@Injectable()
export class GamesService {
    games: Array<object> = [];

    constructor(private http: HttpClient) {
    }

    loadGames() {
        let url = "/games";
        this.http.get<Array<GameResponse>>(url)
            .subscribe(
                data => {
                    for (let game of data) {
                        this.games.push({id: game.id, 'game': makeGame(game)});
                    }
                },
                err => {
                    console.log(err);
                });
    }
}
