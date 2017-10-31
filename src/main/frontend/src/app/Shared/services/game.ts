import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Game} from "../models/Game";
import {Cell} from "../models/Cell";
import {worldX, worldY} from "../consts";
import {Set} from 'typescript-collections';
import {GameResponse, makeGame} from "../interfaces/GameResponse";

@Injectable()
export class GameService {
    currentGame: Game;
    currentGameId: number;

    constructor(private http: HttpClient) {
    }

    makeGame(id: number, wX: number, wY: number, aliveCells: Set<Cell> = new Set<Cell>()) {
        this.currentGameId = id;
        this.currentGame = new Game(wX, wY, aliveCells);
    }

    getCurrentStateData() {
        if (typeof (this.currentGame) === 'undefined'){
            this.currentGame = new Game(worldX, worldY);
        }
        let temp: Set<Cell> = new Set<Cell>();
        console.log(`drawing new state with ${this.currentGame.state['living'].size()} living ` +
            `and ${this.currentGame.state['dying'].size()} dying cells`);
        temp.union(this.currentGame.state['living']); // living cells will get their colour or intermediate colours.
        temp.union(this.currentGame.state['dying']); // dying cells will get intermediate colours.
        for (let x = 0; x < worldX; x++) { // the rest should get dead colours.
            for (let y = 0; y < worldY; y++) {
                let cell = new Cell(x, y, worldX, worldY, 0);
                temp.add(cell);
            }
        }
        return temp.toArray();
    }

    getNextStateData() {
        this.currentGame.conwayStep();
        return this.getCurrentStateData();
    }

    loadRemote(id: number) {
        let url = `/games/${id}`;
        this.http.get<GameResponse>(url)
            .subscribe(
                data => {
                    this.currentGame = makeGame(data as GameResponse);
                },
                err => {
                    console.log(err);
                }
            );
    }


    save() {
        let url = '/save?worldX=' + this.currentGame.worldX +
                  '&worldY=' + this.currentGame.worldY +
                  '&aliveCells='+ this.currentGame.stringifyInitialState(); // FIXME: hacky way to not write additional code for param verification on java side.
        let data = {
            'worldX': this.currentGame.worldX,
            'worldY': this.currentGame.worldY,
            'aliveCells': this.currentGame.stringifyInitialState()

        };
        this.http.post(url, data)
            .subscribe(
                res => {
                    console.log(res);
                    this.currentGameId = res['id'];
                    return res['id']
                },
                err => {
                    console.log(err);
                }
            );
    }

    setGame(game: Game, id?: number){
        this.currentGame = game;
        this.currentGameId = id;
        this.getCurrentStateData();
    }

}
