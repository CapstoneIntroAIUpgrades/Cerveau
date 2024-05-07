// This file is where you should put logic to control the game and everything
// around it.
import { BaseClasses, ConnectFourGame, ConnectFourGameObjectFactory } from ".";

// <<-- Creer-Merge: imports -->>
import { SuperGridMove, SuperGridPlayer } from "~/core/game";
import { Player } from "./player";
// <<-- /Creer-Merge: imports -->>

/**
 * Manages the game logic around the ConnectFour Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
export class ConnectFourGameManager extends BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID. */
    public static get aliases(): string[] {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-##-ConnectFour",
            // <<-- /Creer-Merge: aliases -->>
        ];
    }

    /** The number of players that must connect to play this game. */
    public static get requiredNumberOfPlayers(): number {
        // <<-- Creer-Merge: required-number-of-players -->>
        // override this if you want to set a different number of players
        return 2;
        // <<-- /Creer-Merge: required-number-of-players -->>
    }

    /** The game this GameManager is managing. */
    public readonly game!: ConnectFourGame;

    /** The factory that must be used to initialize new game objects. */
    public readonly create!: ConnectFourGameObjectFactory;

    // <<-- Creer-Merge: public-methods -->>

    // any additional public methods you need can be added here

    // <<-- /Creer-Merge: public-methods -->>

    // <<-- Creer-Merge: protected-private-methods -->>

    public readonly gameOverMessages: { [index: number]: string } = {
        1: "Player 1 wins",
        2: "Player 2 wins",
        3: "Draw",
        4: "Player 1 submitted an invalid move",
        5: "Player 2 submitted an invalid move",
    };

    public readonly playerOrder: string[] = ["r", "y"];

    /** ConnectFour move is "<col>" */
    protected convertSubmoveToMove(subMove: string): SuperGridMove {
        return new SuperGridMove(
            null,
            null,
            null,
            null,
            this.game.repString.split(" ", 2)[1][0],
            this.getRowFromCol(Number.parseInt(subMove)),
            Number.parseInt(subMove),
        );
    }

    /** Gets the row from a col. "Gravity" */
    protected getRowFromCol(col: number): number {
        let row = -1;
        for (let i = this.game.rows-1; i > -1; i--) {
            if (this.board[i][col] == " ") {
                row = i;
            }
        }
        return row;
    }

    protected transition(
        move: SuperGridMove,
        player: SuperGridPlayer,
    ): boolean {
        // cast SuperGridPlayer to Player
        const connectFourPlayer = player as Player;

        // Check if move is valid
        if (!this.validateMove(move, connectFourPlayer)) {
            return false;
        }

        // Update board
        // We've already made sure that the positions are valid
        this.board[move.placeRow!][move.placeCol!] = move.placedPiece!;
        //this.prettyPrintBoard();

        // No Aux to update

        return true;
    }

    protected prettyPrintBoard(): void {
        let x = "";
        for (let i = this.game.rows-1; i > -1; i--) {
            x = this.board[i].join("|");
            console.log("|" + x + "|");
        };
        console.log(" 0 1 2 3 4 5 6\n");
    }

    protected checkBounds(val: number | null, upperBound: number): boolean {
        return val != null && val < upperBound && val >= 0;
    }

    /* A valid space must be in bounds, blank, and the space below it must be "r", "y", or out of bounds */
    protected isValidEmptySpace(row: number, col: number): boolean {
        return (
            this.checkBounds(row, this.game.rows) &&
            this.checkBounds(col, this.game.cols) &&
            this.board[row][col] == " " &&
            (!this.checkBounds(row - 1, this.game.rows) ||
                this.board[row - 1][col] == "r" ||
                this.board[row - 1][col] == "y")
        );
    }

    protected validateMove(move: SuperGridMove, player: Player): boolean {
        // Check that all attributes of the move are in-bounds,
        // piece being placed is owned by the current player,
        // and the placed end is empty
        return (
            move.placedPiece == player.color &&
            this.isValidEmptySpace(
                move.placeRow as number,
                move.placeCol as number,
            )
        );
    }

    /* Returns the max of two numbers */
    protected max(n1: number, n2: number): number {
        if (n1 > n2) {
            return n1;
        } else {
            return n2;
        }
    }

    /* Checks for instances of four in a row. */
    protected checkWinCondition(): string {
        // return values = {"", "r", "y"}
        // verticals
        let v1 = [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
            [5, 0],
        ];
        let v2 = [
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1],
            [4, 1],
            [5, 1],
        ];
        let v3 = [
            [0, 2],
            [1, 2],
            [2, 2],
            [3, 2],
            [4, 2],
            [5, 2],
        ];
        let v4 = [
            [0, 3],
            [1, 3],
            [2, 3],
            [3, 3],
            [4, 3],
            [5, 3],
        ];
        let v5 = [
            [0, 4],
            [1, 4],
            [2, 4],
            [3, 4],
            [4, 4],
            [5, 4],
        ];
        let v6 = [
            [0, 5],
            [1, 5],
            [2, 5],
            [3, 5],
            [4, 5],
            [5, 5],
        ];
        let v7 = [
            [0, 6],
            [1, 6],
            [2, 6],
            [3, 6],
            [4, 6],
            [5, 6],
        ];
        // slash
        let s1 = [
            [0, 3],
            [1, 2],
            [2, 1],
            [3, 0],
        ];
        let s2 = [
            [0, 4],
            [1, 3],
            [2, 2],
            [3, 1],
            [4, 0],
        ];
        let s3 = [
            [0, 5],
            [1, 4],
            [2, 3],
            [3, 2],
            [4, 1],
            [5, 0],
        ];
        let s4 = [
            [0, 6],
            [1, 5],
            [2, 4],
            [3, 3],
            [4, 2],
            [5, 1],
        ];
        let s5 = [
            [1, 6],
            [2, 5],
            [3, 4],
            [4, 3],
            [5, 2],
        ];
        let s6 = [
            [2, 6],
            [3, 5],
            [4, 4],
            [5, 3],
        ];
        // horizontals
        let h1 = [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
            [0, 5],
            [0, 6],
        ];
        let h2 = [
            [1, 0],
            [1, 1],
            [1, 2],
            [1, 3],
            [1, 4],
            [1, 5],
            [1, 6],
        ];
        let h3 = [
            [2, 0],
            [2, 1],
            [2, 2],
            [2, 3],
            [2, 4],
            [2, 5],
            [2, 6],
        ];
        let h4 = [
            [3, 0],
            [3, 1],
            [3, 2],
            [3, 3],
            [3, 4],
            [3, 5],
            [3, 6],
        ];
        let h5 = [
            [4, 0],
            [4, 1],
            [4, 2],
            [4, 3],
            [4, 4],
            [4, 5],
            [4, 6],
        ];
        let h6 = [
            [5, 0],
            [5, 1],
            [5, 2],
            [5, 3],
            [5, 4],
            [5, 5],
            [5, 6],
        ];
        // backslash
        let b1 = [
            [2, 0],
            [3, 1],
            [4, 2],
            [5, 3],
        ];
        let b2 = [
            [1, 0],
            [2, 1],
            [3, 2],
            [4, 3],
            [5, 4],
        ];
        let b3 = [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5],
        ];
        let b4 = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 6],
        ];
        let b5 = [
            [0, 2],
            [1, 3],
            [2, 4],
            [3, 5],
            [4, 6],
        ];
        let b6 = [
            [0, 3],
            [1, 4],
            [2, 5],
            [3, 6],
        ];

        let all_paths = [
            v1,
            v2,
            v3,
            v4,
            v5,
            v6,
            v7,
            s1,
            s2,
            s3,
            s4,
            s5,
            s6,
            h1,
            h2,
            h3,
            h4,
            h5,
            h6,
            b1,
            b2,
            b3,
            b4,
            b5,
            b6,
        ];
        for (let path of all_paths) {
            let count_r = 0;
            let longest_r = 0;
            let count_y = 0;
            let longest_y = 0;
            for (let point of path) {
                if (this.board[point[0]][point[1]] == "r") {
                    count_r = count_r + 1;
                    longest_r = this.max(longest_r, count_r);
                } else {
                    count_r = 0;
                }
                if (this.board[point[0]][point[1]] == "y") {
                    count_y = count_y + 1;
                    longest_y = this.max(longest_y, count_y);
                } else {
                    count_y = 0;
                }
            }
            if (longest_r >= 4) {
                return "r";
            }
            if (longest_y >= 4) {
                return "y";
            }
        }
        return "";
    }

    /* Determine who won, if anyone did. */
    protected getGameOverCode(): number {
        // return code meanings:
        // 0= game continues
        // 1= Player 1 (r) wins
        // 2= Player 2 (y) wins
        // 3= tie

        let empty_spaces = 0;
        for (let i = this.game.rows-1; i > -1; i--) {
            for (let j = 0; j < this.game.cols; j++) {
                if (this.isValidEmptySpace(i, j)) {
                    empty_spaces = empty_spaces + 1;
                }
            }
        }
        let win_con = this.checkWinCondition();
        if (win_con != "") {
            // assign winner
            if (win_con == "r") {
                return 1; // Player 1 wins
            } else {
                return 2; // Player 2 wins
            }
        } else {
            if (empty_spaces > 0) {
                return 0; // game continues
            } else {
                return 3; // tie
            }
        }
    }

    protected declareWinnersAndLosers(gameOverCode: number): void {
        const winners: Player[] = [];
        const losers: Player[] = [];
        switch (gameOverCode) {
            case 1: {
                // Player 1 wins
                winners.push(this.game.players[0]);
                losers.push(this.game.players[1]);
                break;
            }
            case 2: {
                // Player 2 wins
                winners.push(this.game.players[1]);
                losers.push(this.game.players[0]);
                break;
            }
            case 3: {
                // Draw
                losers.push(...this.game.players);
                break;
            }
            case 4: {
                // Player 1 submitted invalid move
                winners.push(this.game.players[1]);
                losers.push(this.game.players[0]);
                break;
            }
            case 5: {
                // Player 2 submitted invalid move
                winners.push(this.game.players[0]);
                losers.push(this.game.players[1]);
                break;
            }
        }
        this.declareWinners(this.gameOverMessages[gameOverCode], ...winners);
        this.declareLosers(this.gameOverMessages[gameOverCode], ...losers);
    }

    // <<-- /Creer-Merge: protected-private-methods -->>
}
