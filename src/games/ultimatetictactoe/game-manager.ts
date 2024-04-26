// This file is where you should put logic to control the game and everything
// around it.
import {
    BaseClasses,
    UltimateTicTacToeGame,
    UltimateTicTacToeGameObjectFactory,
} from ".";

// <<-- Creer-Merge: imports -->>
import { SuperGridMove, SuperGridPlayer } from "~/core/game";
import { Player } from "./player";
// <<-- /Creer-Merge: imports -->>

/**
 * Manages the game logic around the UltimateTicTacToe Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
export class UltimateTicTacToeGameManager extends BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID. */
    public static get aliases(): string[] {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-##-UltimateTicTacToe",
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
    public readonly game!: UltimateTicTacToeGame;

    /** The factory that must be used to initialize new game objects. */
    public readonly create!: UltimateTicTacToeGameObjectFactory;

    // <<-- Creer-Merge: public-methods -->>

    // any additional public methods you need can be added here

    // <<-- /Creer-Merge: public-methods -->>

    // <<-- Creer-Merge: protected-private-methods -->>

    // any additional protected/private methods you need can be added here

    public readonly gameOverMessages: { [index: number]: string } = {
        1: "Player 1 wins",
        2: "Player 2 wins",
        3: "Draw",
        4: "Player 1 submitted an invalid move",
        5: "Player 2 submitted an invalid move",
    };

    public readonly playerOrder: string[] = ["x", "o"];

    protected setInitialBoardState(): void {
        this.auxiliary[0] = "0";
    }

    protected transition(move: SuperGridMove, player: SuperGridPlayer): boolean {
        const ultimateTicTacToePlayer = player as Player;
        if (move.placedPiece !== ultimateTicTacToePlayer.piece) return false;
        if (move.placeRow == null || move.placeRow < 0 || move.placeRow >= this.game.rows
            || move.placeCol == null || move.placeCol < 0 || move.placeCol >= this.game.cols)
            return false;
        if (this.board[move.placeRow][move.placeCol] !== " ") return false;
        if (this.auxiliary[0] !== "0"
            && parseInt(this.auxiliary[0]) !== this.getSubgameIndex(move.placeRow, move.placeCol))
            return false;
        
        this.board[move.placeRow!][move.placeCol!] = move.placedPiece!;

        let [r, c] = this.getSubgameCenter(this.getSubgameIndex(move.placeRow, move.placeCol));
        let status = this.isSubgameWon(this.getSubgameIndex(move.placeRow, move.placeCol))
        if (status !== "" && status !== "=") {
            for (let x=-1; x<2; x++) {
                for (let y=-1; y<2; y++) {
                    this.board[r+x][c+y] = status;
                }
            }
        }

        let nextSubgame = (move.placeCol - c+1) + 3*(move.placeRow - r+1) + 1;
        if (this.isSubgameWon(nextSubgame) !== "") this.auxiliary[0] = "0";
        else this.auxiliary[0] = nextSubgame.toString();

        this.prettyPrintBoard();

        return true;
    }

    protected prettyPrintBoard(): void {
        for (let i = 8; i > 5; i--) {
            console.log((i + 1) + " " + this.board[i].slice(0, 3).join("") + "|" + this.board[i].slice(3, 6).join("") + "|" + this.board[i].slice(6, 9).join(""));
        }
        console.log("  ---+---+---");
        for (let i = 5; i > 2; i--) {
            console.log((i + 1) + " " + this.board[i].slice(0, 3).join("") + "|" + this.board[i].slice(3, 6).join("") + "|" + this.board[i].slice(6, 9).join(""));
        }
        console.log("  ---+---+---");
        for (let i = 2; i > -1; i--) {
            console.log((i + 1) + " " + this.board[i].slice(0, 3).join("") + "|" + this.board[i].slice(3, 6).join("") + "|" + this.board[i].slice(6, 9).join(""));
        }
        console.log("  abc def ghi\n");
    }

    protected isSubgameWon(i: number): string {
        let [r, c] = this.getSubgameCenter(i);
        let b = this.board;
        if (b[r-1][c-1] !== " " && b[r-1][c-1] === b[r-1][c] && b[r-1][c] === b[r-1][c+1]) return b[r-1][c-1];
        if (b[r][c-1] !== " " && b[r][c-1] === b[r][c] && b[r][c] === b[r][c+1]) return b[r][c-1];
        if (b[r+1][c-1] !== " " && b[r+1][c-1] === b[r+1][c] && b[r+1][c] === b[r+1][c+1]) return b[r+1][c-1];
        if (b[r-1][c-1] !== " " && b[r-1][c-1] === b[r][c-1] && b[r][c-1] === b[r+1][c-1]) return b[r-1][c-1];
        if (b[r-1][c] !== " " && b[r-1][c] === b[r][c] && b[r][c] === b[r+1][c]) return b[r-1][c];
        if (b[r-1][c+1] !== " " && b[r-1][c+1] === b[r][c+1] && b[r][c+1] === b[r+1][c+1]) return b[r-1][c+1];
        if (b[r][c] !== " " && b[r-1][c-1] === b[r][c] && b[r][c] === b[r+1][c+1]) return b[r][c];
        if (b[r][c] !== " " && b[r-1][c+1] === b[r][c] && b[r][c] === b[r+1][c-1]) return b[r][c];

        for (let x=-1; x<2; x++) {
            for (let y=-1; y<2; y++) {
                if (b[r+x][c+y] === " ") return "";
            }
        }
        
        return "=";
    }
      

    protected getSubgameCenter(i: number): [number, number] {
        return [ Math.trunc((i-1) / 3) * 3 + 1, ((i-1) % 3) * 3 + 1 ];
    }
    
    protected getSubgameIndex(row: number, col: number): number {
        let sgCol = Math.trunc(col / 3);
        let sgRow = Math.trunc(row / 3);
        return sgCol + 3 * sgRow + 1;
    }

    protected convertSubmoveToMove(subMove: string): SuperGridMove {
        // Split string to string[] then cast each element to int
        let rowStr = "123456789";
	let colStr = "abcdefghi";
        return new SuperGridMove(
            null,
            null,
            null,
            null,
            this.game.repString.split(" ", 2)[1][0],
            rowStr.indexOf(subMove[1]),
            colStr.indexOf(subMove[0]),
        );
    }
    protected getGameOverCode(): number {
        for (let r = 0; r < this.game.rows; r++) {
            let eq = true;
            if (this.board[r][0] === " ") continue;
            for (let c = 1; c < this.game.cols; c++) {
                eq = eq && this.board[r][c-1] === this.board[r][c];
            }
            if (eq) return (this.playerOrder.indexOf(this.board[r][0]) + 1);
        }

        for (let c = 0; c < this.game.cols; c++) {
            let eq = true;
            if (this.board[0][c] === " ") continue;
            for (let r = 1; r < this.game.rows; r++) {
                eq = eq && this.board[r-1][c] === this.board[r][c];
            }
            if (eq) return (this.playerOrder.indexOf(this.board[0][c]) + 1);
        }

        let eqDpos = true;
        if (this.board[0][0] !== " ") {
            for (let i = 1; i < this.game.rows; i++) { // requires game is square
                eqDpos = eqDpos && this.board[i-1][i-1] === this.board[i][i];
            }
            if (eqDpos) return (this.playerOrder.indexOf(this.board[0][0]) + 1);
        }

        let eqDneg = true;
        if (this.board[this.game.rows-1][0] !== " ") {
            for (let i = 1; i < this.game.rows; i++) { // requires game is square
                eqDneg = eqDneg && this.board[this.game.rows - i][i-1] === this.board[this.game.rows - i - 1][i];
            }
            if (eqDneg) return (this.playerOrder.indexOf(this.board[0][0]) + 1);
        }

        for (let r = 0; r < this.game.rows; r++) {
            for (let c = 0; c < this.game.cols; c++) {
                if (this.board[r][c] == " ") return 0;
            }
        }

        return 3;
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
