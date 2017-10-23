import {
    birthColour, deathColour, livingColour, overPopulationColour, TRANSITION_TIME, underPopulationColour,
    userBirthColour, userKillColour
} from "./consts";
import {Cell} from "./models/Cell";

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getColour(state: number, monochrome: boolean = false) {
    if (monochrome) {
        if (Cell.LIFE_STATES.includes(state)) {
            return livingColour;
        } else {
            return deathColour;
        }
    }
    switch (state) {
        case 0:
            return deathColour;
        case 1:
            return livingColour;
        case 2:
            return birthColour;
        case 3:
            return overPopulationColour;
        case 4:
            return underPopulationColour;
        case 5:
            return userBirthColour;
        case 6:
            return userKillColour;
        default:
            return deathColour;
    }
}

export function getColourLegend(monochrome: boolean = false){
    if (monochrome) {
        return [
            {'colour': deathColour, 'reason': 'Dead Cells'},
            {'colour': livingColour, 'reason': 'Living Cells'}
            ];
    } else {
        return [
            {'colour': deathColour, 'reason': 'Dead'},
            {'colour': livingColour, 'reason': 'Living'},
            {'colour': birthColour, 'reason': 'Newly Born'},
            {'colour': overPopulationColour, 'reason': 'Died of Over Population'},
            {'colour': underPopulationColour, 'reason': 'Died of Under Population'},
            {'colour': userBirthColour, 'reason': 'Born through User Interaction'},
            {'colour': userKillColour, 'reason': 'Killed by User Interaction'}
        ];
    }
}


