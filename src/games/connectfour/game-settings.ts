import { SettingsFromSchema } from "~/core/game/base/base-game-settings";
import { UnknownObject } from "~/utils";
import { BaseClasses } from ".";

// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>

/**
 * The settings manager for the ConnectFour game.
 */
export class ConnectFourGameSettingsManager extends BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            ...(super.schema || (this as any).schema),

            // ConnectFour game specific settings
            // <<-- Creer-Merge: schema -->>

            cols: {
                default: 7,
                min: 7,
                description:
                    "The number of cells on the board along the x (horizontal) axis.",
            },
            rows: {
                default: 6,
                min: 6,
                description:
                    "The number of cells on the board along the y (vertical) axis.",
            },

            // <<-- /Creer-Merge: schema -->>

            // Base settings
            playerStartingTime: {
                // <<-- Creer-Merge: player-starting-time -->>
                default: 6e10, // 1 min in ns
                // <<-- /Creer-Merge: player-starting-time -->>
                min: 0,
                description: "The starting time (in ns) for each player.",
            },
        });
    }

    /**
     * The current values for the game's settings.
     */
    public values!: SettingsFromSchema<
        ConnectFourGameSettingsManager["schema"]
    >;

    /**
     * Try to invalidate all the game settings here, so invalid values do not
     * reach the game.
     *
     * @param someSettings - A subset of settings that will be tested.
     * @returns An error if the settings fail to validate, otherwise the
     * valid game settings for this game.
     */
    protected invalidate(someSettings: UnknownObject): UnknownObject | Error {
        const invalidated = super.invalidate(someSettings);
        if (invalidated instanceof Error) {
            return invalidated;
        }

        const settings = { ...this.values, ...someSettings, ...invalidated };

        // <<-- Creer-Merge: invalidate -->>

        // Write logic here to check the values in `settings`. If there is a
        // problem with the values a player sent, return an error with a string
        // describing why their value(s) are wrong

        // <<-- /Creer-Merge: invalidate -->>

        return settings;
    }
}
