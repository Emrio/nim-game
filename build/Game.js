"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game = (function () {
    function Game(opts) {
        this.stacks = [];
        this.winner = null;
        this.turn = 0;
        if (opts.players.length > 10 || !opts.players.length) {
            throw new Error('Invalid player count');
        }
        if (opts.players.some(function (player) { return player.length < 2; })) {
            throw new Error('Invalid player name');
        }
        this.players = opts.players.slice();
        if (opts.maxTakesByTurn < 1) {
            throw new Error('Invalid max takes by turn');
        }
        this.maxTakesByTurn = opts.maxTakesByTurn;
        if ('nextPlayerIndex' in opts.boardProperties) {
            if (opts.boardProperties.stacks.some(function (sticks) { return sticks < 0; })) {
                throw new Error('Invalid board');
            }
            this.stacks = opts.boardProperties.stacks.slice();
            if (opts.boardProperties.nextPlayerIndex < 0) {
                throw new Error('Invalid turn');
            }
            this.turn = opts.boardProperties.nextPlayerIndex;
        }
        else {
            if (opts.boardProperties.stacks < 1 || opts.boardProperties.stacks > 10) {
                throw new Error('Invalid stack count');
            }
            for (var i = 0; i < opts.boardProperties.stacks; i++) {
                this.stacks.push(2 * i + 1);
            }
        }
    }
    Game.prototype.getBoard = function () {
        return this.stacks.slice();
    };
    Game.prototype.getCurrentPlayer = function () {
        return this.players[this.turn % this.players.length];
    };
    Game.prototype.getWinner = function () {
        return this.winner;
    };
    Game.prototype.getGameState = function () {
        return {
            waitingFor: this.getCurrentPlayer(),
            board: this.getBoard(),
            winner: this.getWinner()
        };
    };
    Game.prototype.isMoveValid = function (stack, count) {
        return stack in this.stacks && count > 0 && count <= this.maxTakesByTurn && this.stacks[stack] >= count;
    };
    Game.prototype.play = function (stack, count) {
        if (this.winner) {
            throw new Error('Game is finished');
        }
        if (!this.isMoveValid(stack, count)) {
            throw new Error('Move is not valid');
        }
        this.stacks[stack] -= count;
        var remainingSticks = this.stacks.reduce(function (a, c) { return a + c; });
        if (remainingSticks) {
            this.turn++;
            return this.getCurrentPlayer();
        }
        if (this.players.length === 2) {
            this.winner = this.players[(this.turn + 1) % this.players.length];
        }
        else {
            this.winner = this.getCurrentPlayer();
        }
        return null;
    };
    return Game;
}());
exports.Game = Game;
