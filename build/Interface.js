"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var terminal_kit_1 = require("terminal-kit");
var Game_1 = require("./Game");
var GameInput = {
    UNKNOWN: Symbol(),
    MORE: Symbol(),
    LESS: Symbol(),
    UP: Symbol(),
    DOWN: Symbol(),
    SUBMIT: Symbol(),
    BACKSPACE: Symbol()
};
var UIStep;
(function (UIStep) {
    UIStep[UIStep["TITLE_SCREEN"] = 0] = "TITLE_SCREEN";
    UIStep[UIStep["OPTIONS"] = 1] = "OPTIONS";
    UIStep[UIStep["IN_GAME"] = 2] = "IN_GAME";
    UIStep[UIStep["GAME_SUMMARY"] = 3] = "GAME_SUMMARY";
})(UIStep || (UIStep = {}));
var GameOption;
(function (GameOption) {
    GameOption[GameOption["PLAYER_1_NAME"] = 0] = "PLAYER_1_NAME";
    GameOption[GameOption["PLAYER_2_NAME"] = 1] = "PLAYER_2_NAME";
    GameOption[GameOption["STACKS_COUNT"] = 2] = "STACKS_COUNT";
    GameOption[GameOption["MAX_STICKS_PER_TURN"] = 3] = "MAX_STICKS_PER_TURN";
    GameOption[GameOption["SUBMIT"] = 4] = "SUBMIT";
})(GameOption || (GameOption = {}));
var OPTION_BOUNDARIES = {
    players: {
        min: 2,
        max: 50
    },
    stacksCount: {
        min: 1,
        max: 10
    },
    maxSticksPerTurn: {
        min: 1,
        max: 10 * 2 - 1
    }
};
var Interface = (function () {
    function Interface() {
        this.step = UIStep.TITLE_SCREEN;
        this.clockSpeed = 1000 / 20;
        this.players = ['', ''];
        this.stacksCount = 3;
        this.maxSticksPerTurn = 5;
        this.curGameOption = GameOption.PLAYER_1_NAME;
        this.selectedStack = 0;
        this.selectedStickCount = 1;
        process.stdin.setRawMode(true);
    }
    Interface.prototype.getGameInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve) {
                        process.stdin.once('data', function (data) {
                            var input = data.toString();
                            switch (input) {
                                case '\u001B\u005B\u0041': return resolve(GameInput.UP);
                                case '\u001B\u005B\u0042': return resolve(GameInput.DOWN);
                                case '\u001B\u005B\u0043': return resolve(GameInput.MORE);
                                case '\u001B\u005B\u0044': return resolve(GameInput.LESS);
                                case '\u000A':
                                case '\u000D': return resolve(GameInput.SUBMIT);
                                case '\u007F': return resolve(GameInput.BACKSPACE);
                            }
                            if (input === '\u0003') {
                                terminal_kit_1.terminal.processExit(0);
                            }
                            if (input.length === 1 && ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_+= ').includes(input)) {
                                return resolve(input);
                            }
                            return resolve(GameInput.UNKNOWN);
                        });
                    })];
            });
        });
    };
    Interface.prototype.reset = function () {
        terminal_kit_1.terminal.clear().move(2, 2);
        terminal_kit_1.terminal.styleReset().bold.cyan('Nim Game').styleReset('\n\n');
    };
    Interface.prototype.printTitleScreen = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.reset();
                        terminal_kit_1.terminal(' Press any key to start...');
                        return [4, this.getGameInput()];
                    case 1:
                        _a.sent();
                        this.step = UIStep.OPTIONS;
                        return [2];
                }
            });
        });
    };
    Interface.prototype.printOption = function (id, name, value) {
        terminal_kit_1.terminal.styleReset();
        if (this.curGameOption === id) {
            terminal_kit_1.terminal('\n ').bgBrightBlue(name).styleReset(': ');
        }
        else {
            terminal_kit_1.terminal('\n ' + name + ': ');
        }
        terminal_kit_1.terminal.styleReset().red(value);
    };
    Interface.prototype.updateNumericOption = function (action) {
        var delta = action === GameInput.MORE ? 1 : -1;
        if (this.curGameOption === GameOption.STACKS_COUNT) {
            var newValue = this.stacksCount + delta;
            if (OPTION_BOUNDARIES.stacksCount.max >= newValue && newValue >= OPTION_BOUNDARIES.stacksCount.min) {
                this.stacksCount = newValue;
            }
        }
        else if (this.curGameOption === GameOption.MAX_STICKS_PER_TURN) {
            var newValue = this.maxSticksPerTurn + delta;
            if (OPTION_BOUNDARIES.maxSticksPerTurn.max >= newValue && newValue >= OPTION_BOUNDARIES.maxSticksPerTurn.min) {
                this.maxSticksPerTurn = newValue;
            }
        }
    };
    Interface.prototype.drawOptionsScreen = function () {
        return __awaiter(this, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.reset();
                        terminal_kit_1.terminal.bold(' * Game Options *');
                        terminal_kit_1.terminal.styleReset('\n Use UP and DOWN to move between options, RIGHT and LEFT to change numeric values, and regular keyboard (A-Z, a-z, spaces, and -_+=) for player names');
                        this.printOption(GameOption.PLAYER_1_NAME, 'Player #1', this.players[0]);
                        this.printOption(GameOption.PLAYER_2_NAME, 'Player #2', this.players[1]);
                        this.printOption(GameOption.STACKS_COUNT, 'Stacks', this.stacksCount);
                        this.printOption(GameOption.MAX_STICKS_PER_TURN, 'Max Sticks per Turn', this.maxSticksPerTurn);
                        terminal_kit_1.terminal.styleReset('\n\n');
                        if (this.curGameOption === GameOption.SUBMIT) {
                            terminal_kit_1.terminal('   ').bgGreen('[Submit]');
                        }
                        else {
                            terminal_kit_1.terminal(' [ Submit ]');
                        }
                        return [4, this.getGameInput()];
                    case 1:
                        input = _a.sent();
                        switch (input) {
                            case GameInput.UP:
                                this.curGameOption = Math.max(0, this.curGameOption - 1);
                                break;
                            case GameInput.DOWN:
                                this.curGameOption = Math.min(GameOption.SUBMIT, this.curGameOption + 1);
                                break;
                            case GameInput.MORE:
                            case GameInput.LESS:
                                this.updateNumericOption(input);
                                break;
                            case GameInput.BACKSPACE:
                                if (this.curGameOption === GameOption.PLAYER_1_NAME) {
                                    this.players[0] = this.players[0].slice(0, -1);
                                }
                                else if (this.curGameOption === GameOption.PLAYER_2_NAME) {
                                    this.players[1] = this.players[1].slice(0, -1);
                                }
                                break;
                            case GameInput.SUBMIT:
                                if (!GameOption.SUBMIT) {
                                    break;
                                }
                                if (this.players[0].length < OPTION_BOUNDARIES.players.min || this.players[1].length < OPTION_BOUNDARIES.players.min) {
                                    break;
                                }
                                this.game = new Game_1.Game({
                                    players: this.players,
                                    maxTakesByTurn: this.maxSticksPerTurn,
                                    boardProperties: {
                                        stacks: this.stacksCount
                                    }
                                });
                                this.step = UIStep.IN_GAME;
                                break;
                            case GameInput.UNKNOWN:
                                break;
                            default:
                                if (this.curGameOption === GameOption.PLAYER_1_NAME && this.players[0].length < OPTION_BOUNDARIES.players.max) {
                                    this.players[0] += input;
                                }
                                else if (this.curGameOption === GameOption.PLAYER_2_NAME && this.players[1].length < OPTION_BOUNDARIES.players.max) {
                                    this.players[1] += input;
                                }
                        }
                        return [2];
                }
            });
        });
    };
    Interface.prototype.gameTurn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, board, player, i, input, nextPlayer;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.reset();
                        _a = this.game.getGameState(), board = _a.board, player = _a.waitingFor;
                        this.selectedStickCount = Math.min(board[this.selectedStack], this.selectedStickCount);
                        terminal_kit_1.terminal(' Select the stack with UP/DOWN and select the number of sticks to take with RIGHT/LEFT. Press ENTER to submit\n\n');
                        terminal_kit_1.terminal(' Current player: ').red(player).styleReset('\n\n');
                        for (i = 0; i < board.length; i++) {
                            if (this.selectedStack === i) {
                                terminal_kit_1.terminal.yellow(' ' + (i + 1).toString().padStart(2, ' ')).cyan(' | ');
                                terminal_kit_1.terminal.yellow('I '.repeat(this.selectedStickCount));
                                terminal_kit_1.terminal.magenta('I '.repeat(board[i] - this.selectedStickCount));
                            }
                            else {
                                terminal_kit_1.terminal.magenta(' ' + (i + 1).toString().padStart(2, ' ')).cyan(' | ');
                                terminal_kit_1.terminal.magenta('I '.repeat(board[i]));
                            }
                            terminal_kit_1.terminal('\n');
                        }
                        return [4, this.getGameInput()];
                    case 1:
                        input = _b.sent();
                        switch (input) {
                            case GameInput.UP:
                                this.selectedStack = Math.max(0, this.selectedStack - 1);
                                this.selectedStickCount = Math.min(board[this.selectedStack], this.selectedStickCount);
                                break;
                            case GameInput.DOWN:
                                this.selectedStack = Math.min(board.length - 1, this.selectedStack + 1);
                                this.selectedStickCount = Math.min(board[this.selectedStack], this.selectedStickCount);
                                break;
                            case GameInput.MORE:
                                this.selectedStickCount = Math.min(board[this.selectedStack], this.maxSticksPerTurn, this.selectedStickCount + 1);
                                break;
                            case GameInput.LESS:
                                this.selectedStickCount = Math.max(1, this.selectedStickCount - 1);
                                break;
                            case GameInput.SUBMIT:
                                if (!this.game.isMoveValid(this.selectedStack, this.selectedStickCount)) {
                                    break;
                                }
                                nextPlayer = this.game.play(this.selectedStack, this.selectedStickCount);
                                if (nextPlayer === null) {
                                    this.step = UIStep.GAME_SUMMARY;
                                }
                                break;
                        }
                        return [2];
                }
            });
        });
    };
    Interface.prototype.summary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var winner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.reset();
                        winner = this.game.getWinner();
                        terminal_kit_1.terminal(' Winner: ').bold.yellow(winner);
                        terminal_kit_1.terminal('\n\n Press Ctrl+C to exit or any other key to play again');
                        return [4, this.getGameInput()];
                    case 1:
                        _a.sent();
                        this.step = UIStep.OPTIONS;
                        return [2];
                }
            });
        });
    };
    Interface.prototype.draw = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 11, , 12]);
                        _a = this.step;
                        switch (_a) {
                            case UIStep.TITLE_SCREEN: return [3, 1];
                            case UIStep.OPTIONS: return [3, 3];
                            case UIStep.IN_GAME: return [3, 5];
                            case UIStep.GAME_SUMMARY: return [3, 7];
                        }
                        return [3, 9];
                    case 1: return [4, this.printTitleScreen()];
                    case 2:
                        _b.sent();
                        return [3, 10];
                    case 3: return [4, this.drawOptionsScreen()];
                    case 4:
                        _b.sent();
                        return [3, 10];
                    case 5: return [4, this.gameTurn()];
                    case 6:
                        _b.sent();
                        return [3, 10];
                    case 7: return [4, this.summary()];
                    case 8:
                        _b.sent();
                        return [3, 10];
                    case 9: throw new Error('Unknown state: ' + this.step);
                    case 10:
                        setTimeout(function () { return _this.draw(); }, this.clockSpeed);
                        return [3, 12];
                    case 11:
                        e_1 = _b.sent();
                        console.error('Game failed');
                        console.error(e_1);
                        return [3, 12];
                    case 12: return [2];
                }
            });
        });
    };
    Interface.prototype.start = function () {
        this.draw();
    };
    return Interface;
}());
exports.Interface = Interface;
