// This file is where you should put logic to control the game and everything
// around it.
import { AmazonsGame, AmazonsGameObjectFactory, BaseClasses } from "./";

// <<-- Creer-Merge: imports -->>
import { SuperGridMove, SuperGridPlayer } from "~/core/game";
import { Player } from "./player";
// <<-- /Creer-Merge: imports -->>

/**
 * Manages the game logic around the Amazons Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
export class AmazonsGameManager extends BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID. */
    public static get aliases(): string[] {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-##-Amazons",
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
    public readonly game!: AmazonsGame;

    /** The factory that must be used to initialize new game objects. */
    public readonly create!: AmazonsGameObjectFactory;

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

    public readonly playerOrder: string[] = ["Q", "q"];

    protected setInitialBoardState(): void {
        this.board[0][3] = "Q";
        this.board[0][6] = "Q";
        this.board[3][0] = "Q";
        this.board[3][9] = "Q";
        this.board[6][0] = "q";
        this.board[6][9] = "q";
        this.board[9][3] = "q";
        this.board[9][6] = "q";
    }

    /** Amazon move is "<origin row> <origin col> <new row> <new col> <blocking row> <blocking col>" */
    protected convertSubmoveToMove(subMove: string): SuperGridMove {
        // Split string to string[] then cast each element to int
        const parts: number[] = subMove
            .split(" ")
            .map((str) => Number.parseInt(str));
        return new SuperGridMove(
            parts[0],
            parts[1],
            parts[2],
            parts[3],
            "X",
            parts[4],
            parts[5],
        );
    }

    protected transition(
        move: SuperGridMove,
        player: SuperGridPlayer,
    ): boolean {
        // cast SuperGridPlayer to Player
        const amazonsPlayer = player as Player;

        // Check if move is valid
        if (!this.validateMove(move, amazonsPlayer)) {
            return false;
        }

        // Update board
        // We've already made sure that the positions are valid
        this.board[move.startRow!][move.startCol!] = " ";
        this.board[move.endRow!][move.endCol!] = amazonsPlayer.piece;
        this.board[move.placeRow!][move.placeCol!] = move.placedPiece!;
        this.prettyPrintBoard();

        // No Aux to update

        return true;
    }

    protected prettyPrintBoard(): void {
        for (let i = 9; i > -1; i--) {
            console.log((i) + " " + this.board[i].join(""));
        }
        console.log("  0123456789\n");
    }

    protected checkBounds(val: number | null, upperBound: number): boolean {
        return val != null && val < upperBound && val >= 0;
    }

    protected validateMove(move: SuperGridMove, player: Player): boolean {
        // Check that all attributes of the move are in-bounds,
        // piece being moved is owned by the current player,
        // and the move end and placed end are empty

        // TODO: Check for queen movement rules
        if (
            move.endCol === null ||
            move.endRow === null ||
            move.startRow === null ||
            move.startCol === null
        ) {
            return false;
        }

        let valid_bishop_move: boolean =
            Math.abs(move.endCol - move.startCol) ==
            Math.abs(move.endRow - move.startRow);

        let valid_rook_move: boolean =
            move.endRow == move.startRow || move.endCol == move.startCol;

        let blocked: boolean = false;
        const dRow = Math.sign(move.endRow - move.startRow);
        const dCol = Math.sign(move.endCol - move.startCol);

        let row = move.startRow + dRow;
        let col = move.startCol + dCol;
        while (row !== move.endRow || col !== move.endCol) {
            if (this.board[row][col] !== " ") {
                blocked = true;
                break;
            }
            row += dRow;
            col += dCol;
        }

        let queen_rules: boolean =
            (valid_rook_move || valid_bishop_move) &&
            !blocked &&
            !(move.startCol == move.endCol && move.startRow == move.endRow);

        return (
            queen_rules &&
            this.checkBounds(move.startRow, this.game.rows) &&
            this.checkBounds(move.startCol, this.game.cols) &&
            this.checkBounds(move.endRow, this.game.rows) &&
            this.checkBounds(move.endCol, this.game.cols) &&
            move.placedPiece == "X" &&
            this.checkBounds(move.placeRow, this.game.rows) &&
            this.checkBounds(move.placeCol, this.game.cols) &&
            this.board[move.startRow!][move.startCol!] == player.piece &&
            this.board[move.endRow!][move.endCol!] == " " &&
            (this.board[move.placeRow!][move.placeCol!] == " " ||
                (move.placeRow == move.startRow &&
                    move.placeCol == move.startCol))
        );
    }

    protected isValidEmptySpace(row: number, col: number): boolean {
        return (
            this.checkBounds(row, this.game.rows) &&
            this.checkBounds(col, this.game.cols) &&
            this.board[row][col] == " "
        );
    }

    /** Checks if there is a valid move from a given location
     *  @returns True if there is a valid move
     */
    protected checkAdjacent(row: number, col: number): boolean {
        return (
            // Up and left
            this.isValidEmptySpace(row - 1, col - 1) ||
            // Up
            this.isValidEmptySpace(row, col - 1) ||
            // Up and right
            this.isValidEmptySpace(row + 1, col - 1) ||
            // Left
            this.isValidEmptySpace(row - 1, col) ||
            // Right
            this.isValidEmptySpace(row + 1, col) ||
            // Down and Left
            this.isValidEmptySpace(row - 1, col + 1) ||
            // Down
            this.isValidEmptySpace(row, col + 1) ||
            // Down and Right
            this.isValidEmptySpace(row + 1, col + 1)
        );
    }

    protected getGameOverCode(): number {
        let player1CanMove = false;
        let player2CanMove = false;

        for (let i = 0; i < this.game.rows; i++) {
            for (let j = 0; j < this.game.cols; j++) {
                if (this.board[i][j] == "Q") {
                    player1CanMove =
                        player1CanMove || this.checkAdjacent(i, j);
                } else if (this.board[i][j] == "q") {
                    player2CanMove =
                        player2CanMove || this.checkAdjacent(i, j);
                }

                if (player1CanMove && player2CanMove) {
                    return 0; // Game continues, both players can still move
                }
            }
        }

        if (player1CanMove && !player2CanMove) {
            return 1; // Player 1 wins
        } else if (player2CanMove && !player1CanMove) {
            return 2; // Player 2 wins
        } else {
            return 3; // Neither can move? Shouldn't be possible but might as well handle it.
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
