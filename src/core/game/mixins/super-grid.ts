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
    /** The row position of the piece that will be moved. Null if not used. */
    public readonly startRow: number | null;

    /** The col position of the piece that will be moved. Null if not used. */
    public readonly startCol: number | null;

    /** The row position of where the moving piece moved. Null if not used. */
    public readonly endRow: number | null;

    /** The col position of where the moving piece moved. Null if not used. */
    public readonly endCol: number | null;

    /** The name of the piece that will be placed onto the board. Null if not used. */
    public readonly placedPiece: string | null;

    /** The row position of the piece that will be placed onto the board. Null if not used. */
    public readonly placeRow: number | null;

    /** The col position of the piece that will be placed onto the board. Null if not used. */
    public readonly placeCol: number | null;

    constructor(
        startRow: null | number = null,
        startCol: null | number = null,
        endRow: null | number = null,
        endCol: null | number = null,
        placedPiece: null | string = null,
        placeRow: null | number = null,
        placeCol: null | number = null,
    ) {
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
        this.placedPiece = placedPiece;
        this.placeRow = placeRow;
        this.placeCol = placeCol;
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

    class SuperGridGameManager extends base.GameManager {
        /** 2D list of what pieces are placed in cells on the board. Each piece should be one character. Space characters denote an empty cell. */
        public board!: string[][];

        /** All information needed for the repString that is not shared between all SuperGrid games. */
        public auxiliary!: string[];

        /** Maps different endings of the game to specific game over messages. */
        public readonly gameOverMessages!: { [index: number]: string };

        /** Defines the order in which players take their turns. Each player name should be one character. */
        public playerOrder!: string[];

        public readonly game!: SuperGridGame;

        protected start(): void {
            super.start();
            this.board = [];
            for (let i = 0; i < this.game.rows; i++) {
                this.board.push([]);
                for (let j = 0; j < this.game.cols; j++) {
                    this.board[i].push(" ");
                }
            }
            this.auxiliary = [];
            this.setInitialBoardState();
            this.initRepString();
            void this.processTurn();
        }

        /** Should be overridden by subgame.
         *  Initializes the board by setting the starting pieces, auxiliary information, etc.
         */
        protected setInitialBoardState(): void {}

        /** Process a turn of the game.
         * Should recursively call itself until the game is over. */
        protected async processTurn(): Promise<void> {
            let curPlayer: string = this.game.repString.split(" ", 2)[1][0];
            let playerIndex: number = this.playerOrder.indexOf(curPlayer);
            const player = this.game.players[playerIndex];
            const move = await (player.ai as SuperGridGameAI).makeMove();
            if (!this.transition(this.convertSubmoveToMove(move), player)) {
                this.declareLoser(`Made an invalid move ('${move}').`, player);
                for (let i = 0; i < this.game.players.length; i++) {
                    if (i != playerIndex)
                        this.declareWinner(
                            "Opponent made an invalid move.",
                            this.game.players[i],
                        );
                }
                this.endGame();
            }
            this.updateRepString();
            const turnCode = this.getGameOverCode();
            if (turnCode == 0) void this.processTurn();
            else {
                this.declareWinnersAndLosers(turnCode);
                this.endGame();
            }
        }

        /**Intended to be overwritten.
         * Declares who the players that won and lost given a specific game over code. */
        protected declareWinnersAndLosers(gameOverCode: number): void {
            // Pass. Intended to be overridden by a game.
        }

        /**
         * Translates move notation from the sub-game into the standardized SuperGridMove object.
         * Expected to be overwritten by subgame.
         *
         * @param subMove - A string describing the move made in the sub-game's unique notation.
         *
         * @returns Move in standardized SuperGridMove object.
         */
        protected convertSubmoveToMove(subMove: string): SuperGridMove {
            return new SuperGridMove();
        }

        /**
         * Checks if the game should end.
         * Expected to be overwritten by subgame.
         *
         * @returns A number. 0 if game is not over. Other values indicate how the game has ended via the gameOverMessages dictionary.
         */
        protected getGameOverCode(): number {
            return 1;
        }

        /**
         * Validates a move, then updates board, auxiliary, and repString accordingly.
         * Expected to be overwritten by subgame.
         *
         * @param move - The attempted move in a standardized SuperGridMove object.
         * @param player - The player that is attempting the move.
         *
         * @returns A boolean that is True if move is valid or False if move is not valid.
         */
        protected transition(
            move: SuperGridMove,
            player: SuperGridPlayer,
        ): boolean {
            return false;
        }

        /** Initializes the repString to a valid starting state */
        protected initRepString(): void {
            let newRepString: string = "";

            for (let row = this.game.rows - 1; row >= 0; row--) {
                let spaces = 0;
                for (let col = 0; col < this.game.cols; col++) {
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
            newRepString += this.playerOrder[0];

            // Update auxiliary information.
            for (let i = 0; i < this.auxiliary.length; i++) {
                newRepString += " ";
                newRepString += this.auxiliary[i];
            }

            this.game.repString = newRepString;
        }

        /**
         * Updates the repString given the current board and auxiliary information.
         * Does not typically need to be overwritten by subgame.
         * Assumes pieces and player names are represented as single characters. Override this function if that is not true for your game.
         */
        protected updateRepString(): void {
            let newRepString: string = "";

            // Update board information.
            for (let row = this.game.rows - 1; row >= 0; row--) {
                let spaces = 0;
                for (let col = 0; col < this.game.cols; col++) {
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
            let curPlayer: string = this.game.repString.split(" ", 2)[1][0];
            let curPlayerIndex: number = this.playerOrder.indexOf(curPlayer);
            let nextPlayerIndex: number =
                (curPlayerIndex + 1) % this.playerOrder.length;
            newRepString += this.playerOrder[nextPlayerIndex];

            // Update auxiliary information.
            for (let i = 0; i < this.auxiliary.length; i++) {
                newRepString += " ";
                newRepString += this.auxiliary[i];
            }

            this.game.repString = newRepString;
        }
    }

    /** A super grid game AI. */
    class SuperGridGameAI extends base.AI {
        /**
         * This is called every time it is this AI.player's turn to make a move.
         *
         * @returns A string for the move you want to
         * make. If the move is invalid or not properly formatted you will lose the
         * game.
         */
        public async makeMove(): Promise<string> {
            return this.executeOrder("makeMove") as Promise<string>;
        }
    }

    /** A super grid game. */
    class SuperGridGame extends base.Game {
        /** A string describing all of the information necessary to fully describe the game's state. */
        public repString!: string;

        /** The number of rows in the game. */
        public readonly rows!: number;

        /** The number of columns in the game. */
        public readonly cols!: number;
    }

    return {
        ...base,
        GameSettings: SuperGridGameSettings,
        Game: SuperGridGame,
        GameManager: SuperGridGameManager,
        AI: SuperGridGameAI,
    };
}
