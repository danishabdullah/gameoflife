export const X_MULTIPLE = 50;
export const Y_MULTIPLE = 24;

export const MAX_X = X_MULTIPLE * 12; // 50 * 12 = 600
export const MAX_Y = Y_MULTIPLE * 12; // 24 * 12 = 288

export const MIN_X = 0; // grid always starts at x = 0
export const MIN_Y = 0; // grid always starts at y = 0

export const winHeight = window.innerHeight;
export const winWidth = window.innerWidth;
export const xGridWidth = (0.75 * winWidth); // Get 75% dimension
export const yGridWidth = (0.70 * winHeight); // Get 70% dimension
export const worldX = 50;
export const worldY = 24;
export const xCellWidth = Math.round(xGridWidth / worldX);
export const yCellWidth = Math.round(yGridWidth / worldY) - 1;
export const windowX = worldX * xCellWidth;
let winY = worldY * yCellWidth;
if (winY > yGridWidth) {
    winY = winY - yCellWidth;
}
export const windowY = winY;
export const TRANSITION_TIME = 1000; // transition time


// Colours for various states and strokes.
export const strokeColour = "#444444";
export const deathColour = "#5c768e"; // state = 0
export const livingColour = "#afd581"; // state = 1
export const birthColour = "#92dbb7"; // state = 2
export const underPopulationColour = "#78285d"; // state = 3
export const overPopulationColour = "#aa4539"; // state = 4
export const userBirthColour = "#9ddc96"; // state = 5
export const userKillColour = "#89302e"; // state = 6


console.log(`Initiation parameters are 
    winHeight : ${winHeight}
    winWidth  : ${winWidth}
    xGridWidth: ${xGridWidth}
    yGridWidth: ${yGridWidth}
    worldX    : ${worldX}
    worldY    : ${worldY}
    xCellWidth: ${xCellWidth}
    yCellWidth: ${yCellWidth}
    windowX   : ${windowX}
    windowY   : ${windowY}
    TransTime : ${TRANSITION_TIME}
`);

