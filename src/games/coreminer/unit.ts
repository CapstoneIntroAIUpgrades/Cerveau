import { IBaseGameObjectRequiredData } from "~/core/game";
import { IUnitBuildArgs, IUnitDumpArgs, IUnitMineArgs, IUnitMoveArgs,
         IUnitProperties, IUnitUpgradeArgs } from "./";
import { GameObject } from "./game-object";
import { Job } from "./job";
import { Player } from "./player";
import { Tile } from "./tile";

// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>

/**
 * A unit in the game.
 */
export class Unit extends GameObject {
    /**
     * The number of bombs being carried by this Unit. (0 to job cargo capacity
     * - other carried materials).
     */
    public bombs!: number;

    /**
     * The number of building materials carried by this Unit. (0 to job cargo
     * capacity - other carried materials).
     */
    public buildingMaterials!: number;

    /**
     * The amount of dirt carried by this Unit. (0 to job cargo capacity -
     * other carried materials).
     */
    public dirt!: number;

    /**
     * The remaining health of a Unit.
     */
    public health!: number;

    /**
     * The Job this Unit has.
     */
    public readonly job: Job;

    /**
     * The maximum amount of cargo this Unit can carry.
     */
    public maxCargoCapacity!: number;

    /**
     * The maximum health of this Unit.
     */
    public maxHealth!: number;

    /**
     * The maximum mining power of this Unit.
     */
    public maxMiningPower!: number;

    /**
     * The maximum moves this Unit can have.
     */
    public maxMoves!: number;

    /**
     * The remaining mining power this Unit has this turn.
     */
    public miningPower!: number;

    /**
     * The number of moves this Unit has left this turn.
     */
    public moves!: number;

    /**
     * The amount of ore carried by this Unit. (0 to job capacity - other
     * carried materials).
     */
    public ore!: number;

    /**
     * The Player that owns and can control this Unit.
     */
    public owner?: Player;

    /**
     * The Tile this Unit is on.
     */
    public tile?: Tile;

    // <<-- Creer-Merge: attributes -->>

    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.

    // <<-- /Creer-Merge: attributes -->>

    /**
     * Called when a Unit is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(
        args: Readonly<IUnitProperties & {
            // <<-- Creer-Merge: constructor-args -->>
            /** The job this unit will have */
            job: Job;
            // <<-- /Creer-Merge: constructor-args -->>
        }>,
        required: Readonly<IBaseGameObjectRequiredData>,
    ) {
        super(args, required);

        // <<-- Creer-Merge: constructor -->>
        this.job = args.job;
        // <<-- /Creer-Merge: constructor -->>
    }

    // <<-- Creer-Merge: public-functions -->>

    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.

    // <<-- /Creer-Merge: public-functions -->>

    /**
     * Invalidation function for build. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to build on.
     * @param type - The structure to build (support, ladder, or shield).
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    protected invalidateBuild(
        player: Player,
        tile: Tile,
        type: "support" | "ladder" | "shield",
    ): void | string | IUnitBuildArgs {
        // <<-- Creer-Merge: invalidate-build -->>

        // Check all the arguments for build here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.

        if (!this) {
            return 'This unit does not exist!';
        }
        if (this.health === 0) {
            return 'You can\'t build with a dead unit.';
        }
        if (tile.isBase) {
            return 'You cannot build on a base.';
        }
        if (tile.isSupport) {
            return 'You cannot build on a support.';
        }
        if (tile.isBase) {
            return 'You cannot build on a ladder.';
        }
        if (tile.isFalling) {
            return 'You cannot build on a falling tile.';
        }

        //tile must be adjacent to or the same as the tile the unit is on
        if (tile !== this.tile?.tileEast && tile !== this.tile?.tileNorth &&
            tile !== this.tile?.tileWest && tile !== this.tile?.tileSouth && tile !== this.tile) {
            return 'That tile is too far away to be built on.';
        }
        switch (type) {
            case "support":
                if (tile.dirt > 0 || tile.ore > 0)
                    return 'You can only build a support on an empty tile.';
                else if (this.buildingMaterials < this.game.supportCost)
                    return 'You don\'t have enough building materials to build a support';
                break;
            case "ladder":
                if (tile.dirt > 0 || tile.ore > 0)
                    return 'You can only build a ladder on an empty tile.';
                else if (this.buildingMaterials < this.game.ladderCost)
                    return 'You don\'t have enough building materials to build a ladder';
                break;
            case "shield":
                if (tile.dirt === 0 && tile.ore === 0)
                    return 'You can\'t build a shield on an empty tile.';
                else if (tile.shielding === 2)
                    return 'This tile already has full shield.';
                else if (this.buildingMaterials < this.game.shieldCost)
                    return 'You don\'t have enough building materials to build a shield';
                break;
            default:
                return 'Invalid build type.';
        }

        // <<-- /Creer-Merge: invalidate-build -->>
    }

    /**
     * Builds a support, shield, or ladder on Unit's tile, or an adjacent Tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to build on.
     * @param type - The structure to build (support, ladder, or shield).
     * @returns True if successfully built, False otherwise.
     */
    protected async build(
        player: Player,
        tile: Tile,
        type: "support" | "ladder" | "shield",
    ): Promise<boolean> {
        // <<-- Creer-Merge: build -->>

        // Add logic here for build.
 
        switch (type) {
            case "support":
                tile.isSupport = true;
                this.buildingMaterials -= this.game.supportCost;    //decrement building materials used
                break;
            case "ladder":
                tile.isLadder = true;
                this.buildingMaterials -= this.game.ladderCost;
                break;
            case "shield":
                tile.shielding = 2;
                this.buildingMaterials -= this.game.shieldCost;
                break;
        }
        return true;
        // <<-- /Creer-Merge: build -->>
    }

    /**
     * Invalidation function for dump. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The tile the materials will be dumped on.
     * @param material - The material the Unit will drop. 'dirt', 'ore', or
     * 'bomb'.
     * @param amount - The number of materials to drop. Amounts <= 0 will drop
     * all the materials.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    protected invalidateDump(
        player: Player,
        tile: Tile,
        material: "dirt" | "ore" | "bomb",
        amount: number,
    ): void | string | IUnitDumpArgs {
        // <<-- Creer-Merge: invalidate-dump -->>

        // Check all the arguments for dump here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        if (this.owner !== player || this.owner === undefined) {
            return `${this} isn't owned by you.`;
        }

        // Make sure the unit is alive.
        if (this.health <= 0) {
            return `${this} is dead.`;
        }

        // Make sure the unit is on a tile.
        if (!this.tile) {
            return `${this} is not on a tile.`;
        }

        //Checks if the tile is a ladder
        if (this.tile.isLadder && (material === `dirt` || material === `ore`)){
            return `You cannot dump dirt or ore onto a ladder tile.`;
        }

        //Checks if the tile is a support
        if (this.tile.isSupport && (material === `dirt` || material === `ore`)){
            return `You cannot dump dirt or ore onto a support tile.`;
        }

        //Checks if tile is falling.
        if (this.tile.isFalling && (material === `dirt` || material === `ore`)){
            return `This tile is falling, you have bigger things to worry about than dumping dirt or ore.`;
        }

        //Checks if you have negative dirt.
        if (material === `dirt` && this.dirt < 0){
            return 'You have negative dirt. This should not happen. Contact devs.';
        }

        //Checks if you have dirt to dump
        if (material === `dirt` && this.dirt === 0){
            return 'You have no dirt to dump.';
        }

        if (material === `bomb` && this.bombs === 0){
            return `You have no bombs to dump.`;
        }

        if (material === `bomb` && this.bombs < 0){
            return `You have negative bombs. This should not happen. Contact devs.`;
        }

        if (material === `ore` && this.ore === 0){
            return `You have no ore to dump.`;
        }

        if material === `ore` && this.ore < 0){
            return `You have negative ore. This should not happen. Contact devs.`;
        }

        // <<-- /Creer-Merge: invalidate-dump -->>
    }

    /**
     * Dumps materials from cargo to an adjacent tile.
     *
     * @param player - The player that called this.
     * @param tile - The tile the materials will be dumped on.
     * @param material - The material the Unit will drop. 'dirt', 'ore', or
     * 'bomb'.
     * @param amount - The number of materials to drop. Amounts <= 0 will drop
     * all the materials.
     * @returns True if successfully dumped materials, false otherwise.
     */
    protected async dump(
        player: Player,
        tile: Tile,
        material: "dirt" | "ore" | "bomb",
        amount: number,
    ): Promise<boolean> {
        // <<-- Creer-Merge: dump -->>

        // Add logic here for dump.

        // TODO: replace this with actual logic
        if ((this.tile.isHopper || this.tile.isBase) && material === `ore`){
            player.money += amount * this.game.oreValue;
            player.value += amount * this.game.oreValue;
            this.ore -= amount;
        }

        else if ((this.tile.isHopper || this.tile.isBase) && material === `dirt`){
            player.money += amount;
            player.value += amount;
            this.dirt -= amount;
        }
        
        else if ((this.tile.isHopper || this.tile.isBase) && material === `bomb`){
            player.bombs += amount;
            this.bombs -= amount;
        }

        else{
            if (material === `dirt`){
                this.tile.dirt += amount;
                this.dirt -= amount;
            }

            if (material === `ore`){
                this.tile.ore += amount;
                this.ore -= amount;
            }

            if (material === `bomb`){
                tile.units.push(this.game.manager.create.unit({title: this.game.jobs[1].title, cost: this.game.jobs[1].cost});
                this.bombs -= amount;
            }
        }



        // <<-- /Creer-Merge: dump -->>
    }

    /**
     * Invalidation function for mine. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile the materials will be mined from.
     * @param amount - The amount of material to mine up. Amounts <= 0 will
     * mine all the materials that the Unit can.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    protected invalidateMine(
        player: Player,
        tile: Tile,
        amount: number,
    ): void | string | IUnitMineArgs {
        // <<-- Creer-Merge: invalidate-mine -->>

        // Check all the arguments for mine here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
             
        const reason = this.invalidate(player, true);
        // If there is a reason, return it.
        if (reason) {
            return reason;
        }
        
        if (!this) {
            return `Unit doesn't exist`;
        }
        
        if (!tile) {
            return `Tile doesn't exist`;
        }
        
        if (Player !== this.Player) {
            return `You do not own this unit`;
        }
        
        if (this.job.title !== "miner") {
            return `${this} must be a miner to mine.`;
        }
        
        if (this.moves < 1) {
            return `${this} does not have enough moves`;
        }
        
        const currentLoad = this.bombs + this.buildingMaterials +
            this.dirt + this.ore;
        if (this.job.cargoCapacity <= current load) {
            return `${this} cannot hold any more materials!`;
        }
        
        if (tile.dirt + tile.ore < 0) {
            return `No dirt or ore to mine`;
        }
        
        // <<-- /Creer-Merge: invalidate-mine -->>
    }

    /**
     * Mines the Tile the Unit is on or an adjacent tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile the materials will be mined from.
     * @param amount - The amount of material to mine up. Amounts <= 0 will
     * mine all the materials that the Unit can.
     * @returns True if successfully mined, false otherwise.
     */
    protected async mine(
        player: Player,
        tile: Tile,
        amount: number,
    ): Promise<boolean> {
        // <<-- Creer-Merge: mine -->>
        
        // --- 80 Columns ---------------------------------------------------- #
        // A unit may mine ore and dirt from a tile. If a tile contains both, we
        // can make them mine ore first, then dirt, or vice versa, or alternate
        // between the two. Balancing will decide, just clearly pick one.
        // Update isFalling variables
        // Supports give support to 3 in a horizontal line sbove them (T shape
        // kinda)
        // SupportÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢s 3 above (add ore + dirt) - 3 * material (ore and dirt) of
        // block support is on
        
        const currentLoad = this.bombs + this.buildingMaterials +
            this.dirt + this.ore;
        if (0 < tile.dirt) {
            const actualAmount = Math.min(tile.dirt, this.miningPower,
                this.job.cargoCapacity - currentLoad);
            tile.dirt -= actualAmount;
            this.dirt += actualAmount;
        }
        else {
            const actualAmount = Math.min(tile.ore, this.miningPower,
                this.job.cargoCapacity - currentLoad);
            tile.ore -= actualAmount;
            this.ore +- actualAmount;
        }
        this.moves = Math.min(0, this.moves - 1);
        
        if (!this.checkForSupport(tile)) {
            tile.isFalling = true;
        }
        for (i = tile.x - 1; tile.x + 1 <= i; i++) {
            for (j = tile.y; tile.y + 3 <= j; j++) {
                if (!this.checkForSupport(
                    this.game.tiles[i+(j*this.game.mapWidth)])) {
                    this.game.tiles[i+(j*this.game.mapWidth)].isFalling = true;
                }
            }
        }
        
        return false;

        // <<-- /Creer-Merge: mine -->>
    }

    /**
     * Invalidation function for move. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile this Unit should move to.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    protected invalidateMove(
        player: Player,
        tile: Tile,
    ): void | string | IUnitMoveArgs {
        // <<-- Creer-Merge: invalidate-move -->>

        // Check all the arguments for move here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.

        // <<-- /Creer-Merge: invalidate-move -->>
    }

    /**
     * Moves this Unit from its current Tile to an adjacent Tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile this Unit should move to.
     * @returns True if it moved, false otherwise.
     */
    protected async move(player: Player, tile: Tile): Promise<boolean> {
        // <<-- Creer-Merge: move -->>
        var block_fall = 0;
        var below = tile.tileSouth;
        // Moves robot
        if (!this.tile) {
            throw new Error(`${this} has no Tile to move from!`);
        }
        this.tile.unit = undefined;
        this.tile = tile;
        tile.unit = this;
        this.moves -= 1;
        //Checks the amount fallen
        while (below.dirt == 0 || below.ore == 0 || !below )
        {
            block_fall++;
        }
        //Calculates the damages
        
                
        // TODO: replace this with actual logic
        return false;

        // <<-- /Creer-Merge: move -->>
    }

    /**
     * Invalidation function for upgrade. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param attribute - The attribute of the Unit to be upgraded.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    protected invalidateUpgrade(
        player: Player,
        attribute: "health" | "miningPower" | "moves" | "capacity",
    ): void | string | IUnitUpgradeArgs {
        // <<-- Creer-Merge: invalidate-upgrade -->>
        if (!player || player !== this.game.currentPlayer) {
            return `It's not your turn to dig deeper, ${player}.`;
        }

        if (!this) {
            return `This unit does not exist and can't dig deeper.`;
        }

        if (this.owner !== player || this.owner === undefined) {
            return `${this} isn't under your control to dig deeper`;
        }

        if (this.health <= 0) {
            return `${this} is dead, it can't dig any deeper :(`;
        }

        if (!this.tile) {
            return `${this} is not on a tile. I think you might have dug too deep.`;
        }

        if (tier === 1) {
            if (player.money < 1) {
                return `You don't have enough money for this upgrade to dig deeper.`;
            }
        } 

        if (tier === 2) {
            if (player.money < 2) {
                return `You don't have enough money for this upgrade to dig deeper.`;
            }
        } 

        if (tier === 3) {
            if (player.money < 3) {
                return `You don't have enough money for this upgrade to dig deeper.`;
            }
        } 

        if (this.tile !== this.tile) {
            return `${this} must be on the same tile to upgrade so you can dig deeper.`;
        }

        if (attribute === "health") {
            if (this.health === this.maxHealth) {
                return `${this} is already at its max health to dig deeper with.`;
            }
        }
        if (attribute === "miningPower") {
            if (this.maxMiningPower === this.maxMiningPower) {
                return `${this} is already at its max mining power to dig deeper with.`;
            }
        }

        if (attribute === "moves") {
            if (this.moves === this.maxMoves) {
                return `${this} is already at its max moves to dig deeper with.`;
            }
        }

        if (attribute === "capacity") {
            //capacity does not exist 
            if (this.capacity === this.maxCargoCapacity) {
                return `${this} is already at its max capacity to dig deeper with.`;
            }
        }
        // <<-- /Creer-Merge: invalidate-upgrade -->>
    }

    /**
     * Upgrade an attribute of this Unit. "health", "miningPower", "moves", or
     * "capacity".
     *
     * @param player - The player that called this.
     * @param attribute - The attribute of the Unit to be upgraded.
     * @returns True if successfully upgraded, False otherwise.
     */
    protected async upgrade(
        player: Player,
        attribute: "health" | "miningPower" | "moves" | "capacity",
    ): Promise<boolean> {
        // <<-- Creer-Merge: upgrade -->>
        if (!this.tile) {
            return false;
        }

        if (tier === 1) {
            //10 is a place holder since i dont know what the values are supposed to be
            if (attribute === "health") {
                this.health = 10;
            }
            else if (attribute === "miningPower") {
                this.miningPower = 10;
            }
            else if (attribute === "moves") {
                this.moves = 10;
            }
            else if (attribute === "capacity") {
                this.capacity = 10;
            }
        }
        else if (tier === 2) {
            //20 is a place holder since i dont know what the values are supposed to be
            if (attribute === "health") {
                this.health = 20;
            }
            else if (attribute === "miningPower") {
                this.miningPower = 20;
            }
            else if (attribute === "moves") {
                this.moves = 20;
            }
            else if (attribute === "capacity") {
                this.capacity = 20;
            }
        }
        else if (tier === 3) {
            //20 is a place holder since i dont know what the values are supposed to be
            if (attribute === "health") {
                this.health = 30;
            }
            else if (attribute === "miningPower") {
                this.miningPower = 30;
            }
            else if (attribute === "moves") {
                this.moves = 30;
            }
            else if (attribute === "capacity") {
                this.capacity = 30;
            }
        }

        return true;
        
        // <<-- /Creer-Merge: upgrade -->>
    }

    // <<-- Creer-Merge: protected-private-functions -->>

    // Any additional protected or pirate methods can go here.

    // <<-- /Creer-Merge: protected-private-functions -->>
}
