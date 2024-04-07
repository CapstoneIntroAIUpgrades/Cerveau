// This file is where you should put logic to control the game and everything
// around it.
import {
    BaseClasses,
    UltimateTicTacToeGame,
    UltimateTicTacToeGameObjectFactory,
} from "./";

// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
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

    protected transition(move: SuperGridMove, player: SuperGridPlayer): boolean {
        if (this.board[move.placeRow][move.placeCol] != " ") return false;
        if (this.auxiliary[0] != "0"
            && parseInt(this.auxiliary[0]) != getSubgameIndex(move.placeRow, move.placeCol))
            return false;
        
        this.board[move.placeRow][move.placeCol] = player.piece;

        (r, c) = getSubgameCenter(i);
        status = isSubgameWon(getSubgameIndex(move.placeRow, move.placeCol))
        if (status != "") {
            for (int x=-1; x<2; x++) {
                for (int y=-1; y<2; y++) {
                    this.board[r+x][c+y] = status;
                }
            }
        }

        nextSubgame = (move.placeCol - c+1) + 3*(move.placeRow - r+1) + 1
        if (isSubgameWon(nextSubgame) != "") this.auxiliary[0] = "0";
        else this.auxiliary[0] = nextSubgame.toString();

        return true;
    }

    protected isSubgameWon(i: number): string {
        (r, c) = getSubgameCenter(i);
        b = this.board;
        if (b[r-1][c-1] === b[r-1][c] && b[r-1][c] === b[r-1][c+1]) return b[r-1][c-1];
        if (b[r][c-1] === b[r][c] && b[r][c] === b[r][c+1]) return b[r][c-1];
        if (b[r+1][c-1] === b[r+1][c] && b[r+1][c] === b[r+1][c+1]) return b[r+1][c-1];
        
        if (b[r-1][c-1] === b[r][c-1] && b[r][c-1] === b[r+1][c-1]) return b[r-1][c-1];
        if (b[r-1][c] === b[r][c] && b[r][c] === b[r+1][c]) return b[r-1][c];
        if (b[r-1][c+1] === b[r][c+1] && b[r][c+1] === b[r+1][c+1]) return b[r-1][c+1];
        
        if (b[r-1][c-1] === b[r][c] && b[r][c] === b[r+1][c+1]) return b[r-1][c-1];
        if (b[r-1][c+1] === b[r][c] && b[r][c] === b[r+1][c-1]) return b[r-1][c+1];

        for (int x=-1; x<2; x++) {
            for (int y=-1; y<2; y++) {
                if b[r+x][c+y] === " " return "";
            }
        }
        
        return "=";
    }
      

    protected getSubgameCenter(i: number): (number, number) {
        return ( Math.trunc((i-1) / 3) * 3 + 1, ((i-1) % 3) * 3 + 1);
    }
    
    protected getSubgameIndex(row: number, col: number): number {
        sgCol = col / 3;
        sgRow = Math.trunc(row / 3);
        return sgCol + 3 * sgRow + 1;
    }
    
    // <<-- /Creer-Merge: protected-private-methods -->>
}
