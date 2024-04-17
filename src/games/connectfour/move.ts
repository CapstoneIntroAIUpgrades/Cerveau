import { BaseGameObjectRequiredData } from "~/core/game";
import { MoveConstructorArgs } from ".";
import { GameObject } from "./game-object";

// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>

/**
 * A move in any SuperGrid game in standardized notation.
 */
export class Move extends GameObject {
    /**
     * The x position of where the moving piece moved. Undefined if not used.
     */
    public endX!: number;

    /**
     * The y position of where the moving piece moved. Undefined if not used.
     */
    public endY!: number;

    /**
     * The x position of the piece that will be placed onto the board.
     * Undefined if not used.
     */
    public placeX!: number;

    /**
     * The y position of the piece that will be placed onto the board.
     * Undefined if not used.
     */
    public placeY!: number;

    /**
     * The name of the piece that will be placed onto the board. Should be one
     * character. Undefined if not used.
     */
    public placedPiece!: string;

    /**
     * The x position of the piece that will be moved. Undefined if not used.
     */
    public startX!: number;

    /**
     * The y position of the piece that will be moved. Undefined if not used.
     */
    public startY!: number;

    // <<-- Creer-Merge: attributes -->>

    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.

    // <<-- /Creer-Merge: attributes -->>

    /**
     * Called when a Move is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(
        args: MoveConstructorArgs<{
            // <<-- Creer-Merge: constructor-args -->>
            // You can add more constructor args in here
            // <<-- /Creer-Merge: constructor-args -->>
        }>,
        required: Readonly<BaseGameObjectRequiredData>,
    ) {
        super(args, required);

        // <<-- Creer-Merge: constructor -->>
        // setup any thing you need here
        // <<-- /Creer-Merge: constructor -->>
    }

    // <<-- Creer-Merge: public-functions -->>

    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.

    // <<-- /Creer-Merge: public-functions -->>

    // <<-- Creer-Merge: protected-private-functions -->>

    // Any additional protected or pirate methods can go here.

    // <<-- /Creer-Merge: protected-private-functions -->>
}
