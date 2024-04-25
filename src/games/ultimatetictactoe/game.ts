import { BaseGameRequiredData } from "~/core/game";
import { BaseClasses } from ".";
import { UltimateTicTacToeGameManager } from "./game-manager";
import { GameObject } from "./game-object";
import { UltimateTicTacToeGameSettingsManager } from "./game-settings";
import { Player } from "./player";

// <<-- Creer-Merge: imports -->>
import { Mutable } from "~/utils";

/** A player that can be mutated BEFORE the game starts. */
type MutablePlayer = Mutable<Player>;
// <<-- /Creer-Merge: imports -->>

/**
 * Tic Tac Toe but on nine boards.
 */
export class UltimateTicTacToeGame extends BaseClasses.Game {
    /** The manager of this game, that controls everything around it. */
    public readonly manager!: UltimateTicTacToeGameManager;

    /** The settings used to initialize the game, as set by players. */
    public readonly settings = Object.freeze(this.settingsManager.values);

    /**
     * The number of tiles on the board along the y (vertical) axis.
     */
    public readonly cols!: number;

    /**
     * A mapping of every game object's ID to the actual game object. Primarily
     * used by the server and client to easily refer to the game objects via ID.
     */
    public gameObjects!: { [id: string]: GameObject };

    /**
     * List of all the players in the game.
     */
    public players!: Player[];

    /**
     * A string describing all of the information necessary to fully represent
     * the game's state.
     */
    public repString!: string;

    /**
     * The number of cells on the board along the x (horizontal) axis.
     */
    public readonly rows!: number;

    /**
     * A unique identifier for the game instance that is being played.
     */
    public readonly session!: string;

    // <<-- Creer-Merge: attributes -->>

    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.

    // <<-- /Creer-Merge: attributes -->>

    /**
     * Called when a Game is created.
     *
     * @param settingsManager - The manager that holds initial settings.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(
        protected settingsManager: UltimateTicTacToeGameSettingsManager,
        required: Readonly<BaseGameRequiredData>,
    ) {
        super(settingsManager, required);

        // <<-- Creer-Merge: constructor -->>
        (this.players[0] as MutablePlayer).piece = "x";
        (this.players[1] as MutablePlayer).piece = "o";
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
