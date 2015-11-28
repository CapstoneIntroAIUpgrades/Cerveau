// Generated by Creer at 10:54PM on November 27, 2015 UTC, git hash: '1b69e788060071d644dd7b8745dca107577844e1'

var Class = require(__basedir + "/utilities/class");
var serializer = require(__basedir + "/gameplay/serializer");
var log = require(__basedir + "/gameplay/log");
var TwoPlayerGame = require(__basedir + "/gameplay/shared/twoPlayerGame");
var TurnBasedGame = require(__basedir + "/gameplay/shared/turnBasedGame");

//<<-- Creer-Merge: requires -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.

// any additional requires you want can be required here safely between Creer re-runs

//<<-- /Creer-Merge: requires -->>

// @class Game: The traditional 8x8 chess board with pieces.
var Game = Class(TwoPlayerGame, TurnBasedGame, {
    /**
     * Initializes Games.
     *
     * @param {Object} data - a simple mapping passsed in to the constructor with whatever you sent with it. GameSettings are in here by key/value as well.
     */
    init: function(data) {
        TurnBasedGame.init.apply(this, arguments);
        TwoPlayerGame.init.apply(this, arguments);

        /**
         * How many chess tiles vertically there are making columns.
         *
         * @type {number}
         */
        this._addProperty("files", serializer.defaultInteger(data.files));

        /**
         * All the pieces in the game.
         *
         * @type {list.<Piece>}
         */
        this._addProperty("pieces", serializer.defaultArray(data.pieces));

        /**
         * How many chess tiles horizontally there are making rows. Traditionally represented by a letter for humans.
         *
         * @type {number}
         */
        this._addProperty("ranks", serializer.defaultInteger(data.ranks));

        /**
         * How many turns until the game ends because no pawn has moved and no piece has been taken
         *
         * @type {number}
         */
        this._addProperty("turnsToStalemate", serializer.defaultInteger(data.turnsToStalemate));


        //<<-- Creer-Merge: init -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.

        this.files = 8;
        this.ranks = 8;
        this.maxTurns = 6000; // longest possible game without stalemate is 5,950

        // variables not exposed to AIs
        this.pieceMovedThisTurn = null;
        this.pieceTypes = ["Pawn", "Rook", "Bishop", "Knight", "King", "Queen"];
        this.validPromotionTypes = ["Rook", "Bishop", "Knight", "Queen"];
        this.board = this.emptyBoard();
        this.inCheckBoardFor = {}; // mapping of player ids to 2D Arrays (boards)
        this.maxTurnsToStalement = 100; // fifty-move-rule. If after this many turns no pawns advance and no pieces are captured, it is agreed by both players to be a stalement
        this.turnsToStalemate = this.maxTurnsToStalement;

        //<<-- /Creer-Merge: init -->>
    },

    name: "Chess",
    webserverID: "MegaMinerAI-##-Chess",


    /**
     * This is called when the game begins, once players are connected and ready to play, and game objects have been initialized. Anything in init() may not have the appropriate game objects created yet..
     */
    begin: function() {
        TurnBasedGame.begin.apply(this, arguments);
        TwoPlayerGame.begin.apply(this, arguments);

        //<<-- Creer-Merge: begin -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.

        this.players[0].fileDirection = 1;
        this.players[1].fileDirection = -1;

        for(var i = 0; i < this.players.length; i++) {
            this.inCheckBoardFor[this.players[i].id] = this.emptyBoard();
        }

        // create the initial board
        for(var rank = 0; rank < this.ranks; rank++) {
            for(var file = 0; file < this.files; file++) {
                var type = null;
                if(file === 1 || file === 6) { // then create a pawn
                    type = "Pawn";
                }
                else {
                    if(rank === 0 || rank === 7) {
                        type = "Rook";
                    }
                    else if(rank === 1 || rank === 6) {
                        type = "Knight";
                    }
                    else if(rank === 2 || rank === 5) {
                        type = "Bishop";
                    }
                    else if(rank === 3) {
                        type = "King";
                    }
                    else { // rank === 4
                        type = "Queen";
                    }
                }

                var owner = null;
                if(file <= 1) {
                    owner = this.players[0];
                }
                else if(file >= 6) {
                    owner = this.players[1];
                }

                var piece = ((type && owner)
                    ? this.create("Piece", {
                        type: type,
                        owner: owner,
                        rank: rank,
                        file: file,
                    })
                    : undefined
                );

                if(piece) {
                    if(piece.type === "King") {
                        piece.owner.king = piece;
                    }

                    this.pieces.push(piece);
                    piece.owner.pieces.push(piece);
                }
            }
        }

        this.update();

        //<<-- /Creer-Merge: begin -->>
    },

    /**
     * This is called when the game has started, after all the begin()s. This is a good spot to send orders.
     */
    _started: function() {
        TurnBasedGame._started.apply(this, arguments);
        TwoPlayerGame._started.apply(this, arguments);

        //<<-- Creer-Merge: _started -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        // any logic for _started can be put here
        //<<-- /Creer-Merge: _started -->>
    },


    //<<-- Creer-Merge: added-functions -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.

    maxInvalidsPerPlayer: 0, // If a player sends an invalid move, they lose.

    // Utility Functions \\

    isInBounds: function(rank, file) {
        if(typeof(rank) === "object") {
            file = rank.file;
            rank = rank.rank;
        }

        return (rank >= 0 && rank < this.ranks && file >= 0 && file < this.files);
    },

    getPieceAt: function(rank, file) {
        if(typeof(rank) === "object") {
            file = rank.file;
            rank = rank.rank;
        }

        if(!this.isInBounds(rank, file)) {
            return undefined;
        }

        return this.board[rank][file];
    },

    emptyBoard: function(board) {
        board = board || [];
        for(var rank = 0; rank < this.ranks; rank++) {
            board[rank] = board[rank] || [];
            for(var file = 0; file < this.files; file++) {
                board[rank][file] = undefined;
            }
        }

        return board;
    },



    // Logic \\

    /**
     * @override
     */
    nextTurn: function() {
        if(!this.pieceMovedThisTurn) {
            this.declareLoser(this.currentPlayer, "Ended turn {} without moving a Piece.".format(this.currentTurn));
            this.declareWinner(this.currentPlayer.otherPlayer, "Other player ({}) ended turn {} without moving a Piece.".format(this.currentPlayer, this.currentTurn));
            return;
        }

        this.update();

        var stalement; // we will look for a variety of stalemate senarios

        if(this.turnsToStalemate <= 0) {
            stalement = "{} moves without a capture or pawn advancement.".format(this.maxTurnsToStalement);
        }

        // check for stalement via no valid moves
        var noMoves = true;
        var nextPlayer = this.currentPlayer.otherPlayer;
        for(var i = 0; i < nextPlayer.pieces.length; i++) {
            if(nextPlayer.pieces[i].validMoves.length > 0) {
                noMoves = false;
                break;
            }
        }

        if(noMoves) {
            stalement = "Player {} has no valid moves, but is not in check.";
        }
        else if(this.pieces.length === 2) {
            stalement = "Only Kings left.";
        }
        else if(this.pieces.length === 3) { // two kings and one extra piece. if a bishop or knight checkmate is impossible
            for(var i = 0; i < this.pieces.length; i++) {
                var pieceType = this.pieces[i].type;
                if(pieceType === "Knight" || pieceType === "Bishop") {
                    stalement = "3 Pieces left, King vs King & {}, which is impossible to checkmate with.".format(pieceType);
                    break;
                }
            }
        }
        else { // check for all bishops on the same tile type (light or dark tiles)
            var tile = undefined;
            for(var i = 0; i < this.pieces.length; i++) {
                var uncapturedPiece = this.pieces[i];
                if(uncapturedPiece.type === "Bishop") {
                    var bishopsTile = (uncapturedPiece.rank + uncapturedPiece.file)%2;
                    if(tile === undefined) {
                        tile = bishopsTile;
                    }
                    else if(tile !== bishopsTile) {
                        break; // they are on different tiles, checkmate is possible
                    }
                }
                else if(uncapturedPiece.type !== "King") {
                    tile = undefined;
                    break;
                }
            }

            if(tile !== undefined) {
                stalement = "With only Kings and Bishops, and with all of the Bishops on the same tile color, Checkmate is impossible";
            }
        }

        if(stalement) {
            this.declareLosers(this.players, "Stalement! - " + stalement);
            return;
        }

        // check for checkmate. Because players cannot move into checkmate it should be impossible for both players to be in checkmate simultanously
        for(var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            player.inCheck = Boolean(this.inCheckBoardFor[player.id][player.king.rank][player.king.file]);

            if(player.inCheck && player.king.validMoves.length === 0) { // checkmate!
                this.declareLoser(player, "Checkmated");
                this.declareWinner(player.otherPlayer, "Checkmate!");
                return;
            }
        }

        return TurnBasedGame.nextTurn.apply(this, arguments);
    },

    update: function() {
        for(var i = 0; i < this.players.length; i++) {
            this.emptyBoard(this.inCheckBoardFor[this.players[i].id]);
        }
        this.emptyBoard(this.board);

        this.pieceMovedThisTurn = null;
        this.updatePieces();
    },

    updatePieces: function() {
        for(var i = 0; i < this.pieces.length; i++) {
            var piece = this.pieces[i];
            this.board[piece.rank][piece.file] = piece;
        }

        var kings = [];
        for(var i = 0; i < this.pieces.length; i++) {
            var piece = this.pieces[i];
            piece.generateValidMoves();

            for(var j = 0; j < piece.validMoves.length; j++) {
                var move = piece.validMoves[j];

                if(move.captures) {
                    this.inCheckBoardFor[move.captures.owner.otherPlayer.id][move.rank][move.file] = piece;
                }
            }
        }

        // we now have a real this.inCheckBoardFor, so remove validMoves from the king that are invalid
        for(var i = 0; i < this.players.length; i++) {
            var king = this.players[i].king;
            var inCheckBoardFor = this.inCheckBoardFor;
            king.validMoves.filter(function(move) { // removes moves that are in check, as kings cannot move into check
                return !inCheckBoardFor[king.owner.id][move.rank][move.file];
            });
        }
    },

    /**
     * @override
     */
    _maxTurnsReached: function() {
        this.declareLosers(this.players, "Stalemate - {} turns reached.".format(this.maxTurns));

        return TurnBasedGame._maxTurnsReached.apply(this, arguments);
    },

    //<<-- /Creer-Merge: added-functions -->>

});

module.exports = Game;
