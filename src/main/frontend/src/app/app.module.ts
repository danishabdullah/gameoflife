import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';


import {
    MatButtonModule, MatSlideToggleModule, MatCardModule, MatButtonToggleModule,
    MatSnackBarModule
} from '@angular/material';


import {AppComponent} from './app.component';
import {PlayComponent} from './play/play.component';
import {ListComponent} from './list/list.component';
import {KeysPipe} from "./Shared/pipes/key";
import {GameService} from "./Shared/services/game";
import {GamesService} from "./Shared/services/games";

const appRoutes: Routes = [
    {path: 'list', component: ListComponent},
    {path: 'play', component: PlayComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        PlayComponent,
        ListComponent,
        KeysPipe
    ],
    imports: [
        RouterModule.forRoot(appRoutes),
        BrowserModule, HttpClientModule, BrowserAnimationsModule, MatButtonModule, MatCardModule,
        MatSlideToggleModule, MatButtonToggleModule, MatSnackBarModule
    ],
    providers: [GameService, GamesService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
