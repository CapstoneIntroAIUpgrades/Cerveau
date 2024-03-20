import { BasePlayer } from "~/core/game";
import * as Base from "./base";

/** A player in a super grid game. */
export type SuperGridPlayer = BasePlayer;

/**
 * A base game that is perfect information, turn-based, played on a 2D grid, and has moves that allow for one piece to be moved to a different position and/or a piece to be placed onto the board.
 *
 * @param base - The BaseGame to mix in super grid logic.
 * @param base.AI - The AI to extend.
 * @param base.Game - The Game to extend.
 * @param base.GameManager - the GameObject to extend.
 * @param base.GameObject - The FameObject to extend.
 * @param base.GameSettings - The GameSettings to extend.
 * @returns A new BaseGame class with SuperGrid logic mixed in.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

export class SuperGridMove {
    /** The x position of the piece that will be moved. Null if not used. */
    public readonly startX: number | null;

    /** The y position of the piece that will be moved. Null if not used. */
    public readonly startY: number | null;

    /** The x position of where the moving piece moved. Null if not used. */
    public readonly endX: number | null;

    /** The y position of where the moving piece moved. Null if not used. */
    public readonly endY: number | null;

    /** The name of the piece that will be placed onto the board. Null if not used. */
    public readonly placedPiece: string | null;

    /** The x position of the piece that will be placed onto the board. Null if not used. */
    public readonly placeX: number | null;

    /** The y position of the piece that will be placed onto the board. Null if not used. */
    public readonly placeY: number | null;

    constructor(
        startX = null,
        startY = null,
        endX = null,
        endY = null,
        placedPiece = null,
        placeX = null,
        placeY = null,
    ) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.placedPiece = placedPiece;
        this.placeX = placeX;
        this.placeY = placeY;
    }
}

export function mixSuperGrid<
    TBaseAI extends Base.BaseAIConstructor,
    TBaseGame extends Base.BaseGameConstructor,
    TBaseGameManager extends Base.BaseGameManagerConstructor,
    TBaseGameObject extends Base.BaseGameObjectConstructor,
    TBaseGameSettings extends Base.BaseGameSettingsManagerConstructor
>(base: {
    /** The AI to extend. */
    AI: TBaseAI;
    /** The Game to extend. */
    Game: TBaseGame;
    /** The GameManager to extend. */
    GameManager: TBaseGameManager;
    /** The GameObject to extend. */
    GameObject: TBaseGameObject;
    /** The GameSettings to extend. */
    GameSettings: TBaseGameSettings;
}) {
    /** The settings for a SuperGrid game. */
    class SuperGridGameSettings extends base.GameSettings {
        /** The schema for a SuperGrid game, adding in configurable grid sizes. */
        public get schema() {
            return this.makeSchema({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                ...(super.schema || (this as any).schema),
                cols: {
                    default: 1,
                    min: 1,
                    description:
                        "The number of cells on the board along the x (horizontal) axis.",
                },
                rows: {
                    default: 1,
                    min: 1,
                    description:
                        "The number of cells on the board along the y (vertical) axis.",
                },
            });
        }

        /** The current settings values. */
        public values = this.initialValues(this.schema);
    }

    /** A super grid game. */
    class SuperGridGame extends base.Game {
        /** The number of rows in the game. */
        public readonly rows!: number;

        /** The number of columns in the game. */
        public readonly cols!: number;

        /** The list of all abbreviated names for each piece that is in the game. Each piece should be represented by a single character. */
        public readonly possiblePieces!: string;

        /** 2D list of what pieces are placed in cells on the board. Each piece should be one character. Space characters denote an empty cell. */
        public board!: string[][];

        /** All information needed for the repString that is not shared between all SuperGrid games. */
        public auxiliary!: string[];

        /** A string describing all of the information necessary to fully describe the game's state. */
        public repString!: string;

        /** Maps different endings of the game to specific game over messages. */
        public readonly gameOverMessages!: { [index: number]: string };

        /** Defines the order in which players take their turns. Each player name should be one character. */
        public playerOrder!: string[];

        /**
         * Validates a move, then updates board, auxiliary, and repString accordingly.
         * Expected to be overwritten by subgame.
         *
         * @param move - The attempted move in a standardized SuperGridMove object.
         *
         * @returns A boolean that is True if move is valid or False if move is not valid.
         */
        public transition(move: SuperGridMove): boolean {
            return false;
        }

        /**
         * Updates the repString given the current board and auxiliary information.
         * Does not typically need to be overwritten by subgame.
         * Assumes pieces and player names are represented as single characters. Override this function if that is not true for your game.
         */
        public updateRepString(): void {
            let newRepString: string = "";

            // Update board information.
            for (let row = this.rows - 1; row >= 0; row--) {
                let spaces = 0;
                for (let col = 0; col < this.cols; col++) {
                    if (this.board[row][col] == " ") {
                        spaces++;
                    } else {
                        if (spaces != 0) {
                            newRepString += spaces;
                            spaces = 0;
                        }
                        newRepString += this.board[row][col];
                    }
                }
                if (spaces != 0) {
                    newRepString += spaces;
                }
                if (row != 0) {
                    newRepString += "/";
                }
            }

            // Update turn player information.
            newRepString += " ";
            let curPlayer: string = this.repString.split(" ", 2)[1][0];
            let curPlayerIndex: number = this.playerOrder.indexOf(curPlayer);
            let nextPlayerIndex: number =
                (curPlayerIndex + 1) % this.playerOrder.length;
            newRepString += this.playerOrder[nextPlayerIndex];

            // Update auxiliary information.
            for (let i = 0; i < this.auxiliary.length; i++) {
                newRepString += " ";
                newRepString += this.auxiliary[i];
            }

            this.repString = newRepString;
        }

        /**
         * Translates move notation from the sub-game into the standardized SuperGridMove object.
         * Expected to be overwritten by subgame.
         *
         * @param subMove - A string describing the move made in the sub-game's unique notation.
         *
         * @returns Move in standardized SuperGridMove object.
         */
        public convertSubmoveToMove(subMove: string): SuperGridMove {
            return new SuperGridMove();
        }

        /**
         * Checks if the game should end.
         * Expected to be overwritten by subgame.
         *
         * @returns A number. 0 if game is not over. Other values indicate how the game has ended via the gameOverMessages dictionary.
         */
        public isGameOver(): number {
            return 1;
        }
    }

    return {
        ...base,
        GameSettings: SuperGridGameSettings,
        Game: SuperGridGame,
    };
}
