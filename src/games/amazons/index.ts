// WARNING: Here be Dragons
// This file is generated by Creer, do not modify it
// It basically sets up all the classes, interfaces, types, and what-not that
// we need for TypeScript to know the base classes, while allowing for minimal
// code for developers to be forced to fill out.

/* eslint-disable @typescript-eslint/no-empty-interface */

// base game classes
import {
    BaseAI,
    BaseGame,
    BaseGameManager,
    BaseGameObject,
    BaseGameObjectFactory,
    BaseGameSettingsManager,
    BasePlayer,
    makeNamespace,
} from "~/core/game";

// mixins
import { SuperGridPlayer, mixSuperGrid } from "~/core/game/mixins";

/**
 * The interface that the Player for the Amazons game
 * must implement from mixed in game logic.
 */
export interface BaseAmazonsPlayer extends BasePlayer, SuperGridPlayer {}

const base0 = {
    AI: BaseAI,
    Game: BaseGame,
    GameManager: BaseGameManager,
    GameObject: BaseGameObject,
    GameSettings: BaseGameSettingsManager,
};

const base1 = mixSuperGrid(base0);

const mixed = base1;

/** The base AI class for the Amazons game will mixin logic. */
class BaseAmazonsAI extends mixed.AI {}

/** The base Game class for the Amazons game will mixin logic. */
class BaseAmazonsGame extends mixed.Game {}

/** The base GameManager class for the Amazons game will mixin logic. */
class BaseAmazonsGameManager extends mixed.GameManager {}

/** The base GameObject class for the Amazons game will mixin logic. */
class BaseAmazonsGameObject extends mixed.GameObject {}

/** The base GameSettings class for the Amazons game will mixin logic. */
class BaseAmazonsGameSettings extends mixed.GameSettings {}

/** The Base classes that game classes build off of. */
export const BaseClasses = {
    AI: BaseAmazonsAI,
    Game: BaseAmazonsGame,
    GameManager: BaseAmazonsGameManager,
    GameObject: BaseAmazonsGameObject,
    GameSettings: BaseAmazonsGameSettings,
};

// Now all the base classes are created;
// so we can start importing/exporting the classes that need them.

/** All the possible properties for GameObject instances. */
export interface GameObjectProperties {}

/** All the possible properties for Player instances. */
export interface PlayerProperties {
    /**
     * What type of client this is, e.g. 'Python', 'JavaScript', or some other
     * language. For potential data mining purposes.
     */
    clientType?: string;

    /**
     * If the player lost the game or not.
     */
    lost?: boolean;

    /**
     * The name of the player.
     */
    name?: string;

    /**
     * The color (side) of this player. Either 'Q' or 'q', with the 'Q' player
     * having the first move.
     */
    piece?: "Q" | "q";

    /**
     * The reason why the player lost the game.
     */
    reasonLost?: string;

    /**
     * The reason why the player won the game.
     */
    reasonWon?: string;

    /**
     * The amount of time (in ns) remaining for this AI to send commands.
     */
    timeRemaining?: number;

    /**
     * If the player won the game or not.
     */
    won?: boolean;
}

/**
 * The default args passed to a constructor function for class
 * instances of GameObject.
 */
export type GameObjectConstructorArgs<
    T extends Record<string, unknown> = Record<string, unknown>
> = Readonly<GameObjectProperties & T>;

/**
 * The default args passed to a constructor function for class
 * instances of Player.
 */
export type PlayerConstructorArgs<
    T extends Record<string, unknown> = Record<string, unknown>
> = Readonly<BaseAmazonsPlayer & PlayerProperties & T>;

export * from "./game-object";
export * from "./player";
export * from "./game";
export * from "./game-manager";
export * from "./ai";

import { GameObject } from "./game-object";
import { Player } from "./player";

import { AI } from "./ai";
import { AmazonsGame } from "./game";
import { AmazonsGameManager } from "./game-manager";
import { AmazonsGameSettingsManager } from "./game-settings";

/**
 * The factory that **must** be used to create any game objects in
 * the Amazons game.
 */
export class AmazonsGameObjectFactory extends BaseGameObjectFactory {}

/**
 * The shared namespace for Amazons that is used to
 * initialize each game instance.
 */
export const Namespace = makeNamespace({
    AI,
    Game: AmazonsGame,
    GameManager: AmazonsGameManager,
    GameObjectFactory: AmazonsGameObjectFactory,
    GameSettingsManager: AmazonsGameSettingsManager,
    Player,

    // These are generated metadata that allow delta-merging values from
    // clients.
    // They are never intended to be directly interfaced with outside of the
    // Cerveau core developers.
    gameName: "Amazons",
    gameSettingsManager: new AmazonsGameSettingsManager(),
    gameObjectsSchema: {
        AI: {
            attributes: {},
            functions: {
                makeMove: {
                    args: [],
                    returns: {
                        typeName: "string",
                    },
                },
            },
        },
        Game: {
            attributes: {
                cols: {
                    typeName: "int",
                },
                gameObjects: {
                    typeName: "dictionary",
                    keyType: {
                        typeName: "string",
                    },
                    valueType: {
                        typeName: "gameObject",
                        gameObjectClass: GameObject,
                        nullable: false,
                    },
                },
                players: {
                    typeName: "list",
                    valueType: {
                        typeName: "gameObject",
                        gameObjectClass: Player,
                        nullable: false,
                    },
                },
                repString: {
                    typeName: "string",
                },
                rows: {
                    typeName: "int",
                },
                session: {
                    typeName: "string",
                },
            },
            functions: {},
        },
        GameObject: {
            attributes: {
                gameObjectName: {
                    typeName: "string",
                },
                id: {
                    typeName: "string",
                },
                logs: {
                    typeName: "list",
                    valueType: {
                        typeName: "string",
                    },
                },
            },
            functions: {
                log: {
                    args: [
                        {
                            argName: "message",
                            typeName: "string",
                        },
                    ],
                    returns: {
                        typeName: "void",
                    },
                },
            },
        },
        Player: {
            parentClassName: "GameObject",
            attributes: {
                clientType: {
                    typeName: "string",
                },
                lost: {
                    typeName: "boolean",
                },
                name: {
                    typeName: "string",
                },
                piece: {
                    typeName: "string",
                    defaultValue: "Q",
                    literals: ["Q", "q"],
                },
                reasonLost: {
                    typeName: "string",
                },
                reasonWon: {
                    typeName: "string",
                },
                timeRemaining: {
                    typeName: "float",
                },
                won: {
                    typeName: "boolean",
                },
            },
            functions: {},
        },
    },
    gameVersion:
        "1b2ac0db4655c0c135ffbf80607a97ab5434b880e1b76f1ade9fdaf44670ae23",
});
