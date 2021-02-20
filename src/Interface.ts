import { terminal as term } from 'terminal-kit'
import { Game } from './Game'

// using Symbols instead of enum values as input can also be letters, numbers, and special characters (for player names)
const GameInput = {
  UNKNOWN: Symbol(),
  MORE: Symbol(), // right arrow
  LESS: Symbol(), // left arrow
  UP: Symbol(), // up arrow
  DOWN: Symbol(), // down arrow
  SUBMIT: Symbol(), // enter key
  BACKSPACE: Symbol() // backspace key
}

enum UIStep {
  TITLE_SCREEN,
  OPTIONS,
  IN_GAME,
  GAME_SUMMARY
}

enum GameOption {
  PLAYER_1_NAME,
  PLAYER_2_NAME,
  STACKS_COUNT,
  MAX_STICKS_PER_TURN,
  SUBMIT
}

const OPTION_BOUNDARIES = {
  players: { // player names min and max length
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
}

export class Interface {
  private step = UIStep.TITLE_SCREEN // current step of the UI
  private clockSpeed = 1000 / 20 // UI redraw/refresh rate
  private game: Game
  private players: [string, string] = ['', ''] // this interface only allows for 2 player games

  // options for the game
  private stacksCount = 3
  private maxSticksPerTurn = 5

  // in: options ui, currently selected option (player1 name, player2 name, stack count, max sticks per turn, submit button)
  private curGameOption = GameOption.PLAYER_1_NAME

  // in: game ui, stack and stick count choice of the player
  private selectedStack = 0
  private selectedStickCount = 1

  constructor () {
    process.stdin.setRawMode(true)
  }

  // get
  private async getGameInput (): Promise<Symbol | string> {
    return new Promise(resolve => {
      process.stdin.once('data', (data) => {
        const input = data.toString()

        // special keys
        switch (input) {
          case '\u001B\u005B\u0041': return resolve(GameInput.UP)
          case '\u001B\u005B\u0042': return resolve(GameInput.DOWN)
          case '\u001B\u005B\u0043': return resolve(GameInput.MORE)
          case '\u001B\u005B\u0044': return resolve(GameInput.LESS)
          case '\u000A':
          case '\u000D': return resolve(GameInput.SUBMIT)
          case '\u007F': return resolve(GameInput.BACKSPACE)
        }

        // Ctrl+C -> quit program
        if (input === '\u0003') {
          term.processExit(0)
        }

        // allowed keyboard input (used for player names)
        if (input.length === 1 && ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_+= ').includes(input)) {
          return resolve(input)
        }

        return resolve(GameInput.UNKNOWN)
      })
    })
  }

  // reset the screen, used before each UI draw
  private reset (): void {
    term.clear().move(2, 2)
    term.styleReset().bold.cyan('Nim Game').styleReset('\n\n')
  }

  // title screen
  private async printTitleScreen (): Promise<void> {
    this.reset()

    term(' Press any key to start...')

    await this.getGameInput()

    this.step = UIStep.OPTIONS
  }

  // print option and its current value on screen
  // applies special styling whener or not the option is selected
  private printOption (id: GameOption, name: string, value: number | string): void {
    term.styleReset()

    if (this.curGameOption === id) {
      term('\n ').bgBrightBlue(name).styleReset(': ')
    } else {
      term('\n ' + name + ': ')
    }

    term.styleReset().red(value)
  }

  // changes a numeric option like stack count or max sticks per turn
  // left arrow to increment by one
  // right arrow to decrement by one
  private updateNumericOption (action: Symbol): void {
    const delta = action === GameInput.MORE ? 1 : -1

    if (this.curGameOption === GameOption.STACKS_COUNT) {
      const newValue = this.stacksCount + delta

      if (OPTION_BOUNDARIES.stacksCount.max >= newValue && newValue >= OPTION_BOUNDARIES.stacksCount.min) {
        this.stacksCount = newValue
      }
    } else if (this.curGameOption === GameOption.MAX_STICKS_PER_TURN) {
      const newValue = this.maxSticksPerTurn + delta

      if (OPTION_BOUNDARIES.maxSticksPerTurn.max >= newValue && newValue >= OPTION_BOUNDARIES.maxSticksPerTurn.min) {
        this.maxSticksPerTurn = newValue
      }
    }
  }

  // draws the options UI to let users set player names and other options for the game
  private async drawOptionsScreen (): Promise<void> {
    this.reset()

    term.bold(' * Game Options *')
    term.styleReset('\n Use UP and DOWN to move between options, RIGHT and LEFT to change numeric values, and regular keyboard (A-Z, a-z, spaces, and -_+=) for player names')

    this.printOption(GameOption.PLAYER_1_NAME, 'Player #1', this.players[0])
    this.printOption(GameOption.PLAYER_2_NAME, 'Player #2', this.players[1])
    this.printOption(GameOption.STACKS_COUNT, 'Stacks', this.stacksCount)
    this.printOption(GameOption.MAX_STICKS_PER_TURN, 'Max Sticks per Turn', this.maxSticksPerTurn)

    term.styleReset('\n\n')

    if (this.curGameOption === GameOption.SUBMIT) {
      term('   ').bgGreen('[Submit]')
    } else {
      term(' [ Submit ]')
    }

    const input = await this.getGameInput()

    switch (input) {
      case GameInput.UP: // move up in the options list
        this.curGameOption = Math.max(0, this.curGameOption - 1)
        break
      case GameInput.DOWN: // move down
        this.curGameOption = Math.min(GameOption.SUBMIT, this.curGameOption + 1)
        break
      case GameInput.MORE: // increment/decrement numeric values
      case GameInput.LESS:
        this.updateNumericOption(input)
        break
      case GameInput.BACKSPACE:
        if (this.curGameOption === GameOption.PLAYER_1_NAME) {
          this.players[0] = this.players[0].slice(0, -1)
        } else if (this.curGameOption === GameOption.PLAYER_2_NAME) {
          this.players[1] = this.players[1].slice(0, -1)
        }
        break
      case GameInput.SUBMIT: // start game!
        if (!GameOption.SUBMIT) {
          break
        }

        // player names may not have been set
        if (this.players[0].length < OPTION_BOUNDARIES.players.min || this.players[1].length < OPTION_BOUNDARIES.players.min) {
          break
        }

        this.game = new Game({
          players: this.players,
          maxTakesByTurn: this.maxSticksPerTurn,
          boardProperties: {
            stacks: this.stacksCount
          }
        })

        this.step = UIStep.IN_GAME
        break
      case GameInput.UNKNOWN: // non-allowed character, just ignore
        break
      default: // dealing with characters (player names)
        if (this.curGameOption === GameOption.PLAYER_1_NAME && this.players[0].length < OPTION_BOUNDARIES.players.max) {
          this.players[0] += input
        } else if (this.curGameOption === GameOption.PLAYER_2_NAME && this.players[1].length < OPTION_BOUNDARIES.players.max) {
          this.players[1] += input
        }
    }
  }

  // print UI during game
  private async gameTurn (): Promise<void> {
    this.reset()

    const { board, waitingFor: player } = this.game.getGameState()

    this.selectedStickCount = Math.min(board[this.selectedStack], this.selectedStickCount)

    term(' Select the stack with UP/DOWN and select the number of sticks to take with RIGHT/LEFT. Press ENTER to submit\n\n')

    term(' Current player: ').red(player).styleReset('\n\n')

    // drawing board, applying special styling to selected stack and sticks
    for (let i = 0; i < board.length; i++) {
      if (this.selectedStack === i) {
        term.yellow(' ' + (i + 1).toString().padStart(2, ' ')).cyan(' | ')
        term.yellow('I '.repeat(this.selectedStickCount))
        term.magenta('I '.repeat(board[i] - this.selectedStickCount))
      } else {
        term.magenta(' ' + (i + 1).toString().padStart(2, ' ')).cyan(' | ')
        term.magenta('I '.repeat(board[i]))
      }

      term('\n')
    }

    const input = await this.getGameInput()

    switch (input) {
      case GameInput.UP: // move up in stacks list
        this.selectedStack = Math.max(0, this.selectedStack - 1)
        // also update stick count
        this.selectedStickCount = Math.min(board[this.selectedStack], this.selectedStickCount)
        break
      case GameInput.DOWN: // move down
        this.selectedStack = Math.min(board.length - 1, this.selectedStack + 1)
        this.selectedStickCount = Math.min(board[this.selectedStack], this.selectedStickCount)
        break
      case GameInput.MORE: // add one to the number of selected sticks
        this.selectedStickCount = Math.min(board[this.selectedStack], this.maxSticksPerTurn, this.selectedStickCount + 1)
        break
      case GameInput.LESS: // remove one
        this.selectedStickCount = Math.max(1, this.selectedStickCount - 1)
        break
      case GameInput.SUBMIT: // confirm move
        if (!this.game.isMoveValid(this.selectedStack, this.selectedStickCount)) {
          break
        }

        const nextPlayer = this.game.play(this.selectedStack, this.selectedStickCount)

        // the game ended
        if (nextPlayer === null) {
          this.step = UIStep.GAME_SUMMARY
        }

        break
    }
  }

  // prints the summary UI
  private async summary (): Promise<void> {
    this.reset()

    const winner = this.game.getWinner()

    term(' Winner: ').bold.yellow(winner)
    term('\n\n Press Ctrl+C to exit or any other key to play again')

    await this.getGameInput()

    this.step = UIStep.OPTIONS
  }

  // main draw routine, called at most every `this.clockSpeed` ms
  private async draw (): Promise<void> {
    try {
      switch (this.step) {
        case UIStep.TITLE_SCREEN:
          await this.printTitleScreen()
          break
        case UIStep.OPTIONS:
          await this.drawOptionsScreen()
          break
        case UIStep.IN_GAME:
          await this.gameTurn()
          break
        case UIStep.GAME_SUMMARY:
          await this.summary()
          break
        default:
          throw new Error('Unknown state: ' + this.step)
      }

      setTimeout(() => this.draw(), this.clockSpeed)
    } catch (e) {
      console.error('Game failed')
      console.error(e)
    }
  }

  start (): void {
    this.draw()
  }
}
