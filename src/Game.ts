export interface GameOptions {
  // stacks: number
  maxTakesByTurn: number
  // if there are 2 to 10 players, the winner will be the one that finished the game
  // if there are 2 players exactly, the winner will be the one that did not finish the game
  players: string[]
  // either create a new game or restore a game (may be used for min-max AIs)
  boardProperties: { stacks: number } | { stacks: number[], nextPlayerIndex: number }
}

export interface GameState {
  board: number[]
  waitingFor: string
  winner: string | null
}

export class Game {
  private stacks: number[] = []
  private maxTakesByTurn: number
  private winner: string | null = null
  private players: string[]
  private turn = 0

  constructor (opts: GameOptions) {
    if (opts.players.length > 10 || !opts.players.length) {
      throw new Error('Invalid player count')
    }

    if (opts.players.some(player => player.length < 2)) {
      throw new Error('Invalid player name')
    }

    this.players = opts.players.slice()

    if (opts.maxTakesByTurn < 1) {
      throw new Error('Invalid max takes by turn')
    }

    this.maxTakesByTurn = opts.maxTakesByTurn

    if ('nextPlayerIndex' in opts.boardProperties) {
      // restore game

      if (opts.boardProperties.stacks.some(sticks => sticks < 0)) {
        throw new Error('Invalid board')
      }

      this.stacks = opts.boardProperties.stacks.slice()

      if (opts.boardProperties.nextPlayerIndex < 0) {
        throw new Error('Invalid turn')
      }

      this.turn = opts.boardProperties.nextPlayerIndex
    } else {
      // new game

      if (opts.boardProperties.stacks < 1 || opts.boardProperties.stacks > 10) {
        throw new Error('Invalid stack count')
      }

      for (let i = 0; i < opts.boardProperties.stacks; i++) {
        this.stacks.push(2 * i + 1)
      }
    }
  }

  getBoard (): number[] {
    return this.stacks.slice()
  }

  getCurrentPlayer (): string {
    return this.players[this.turn % this.players.length]
  }

  getWinner (): string | null {
    return this.winner
  }

  getGameState (): GameState {
    return {
      waitingFor: this.getCurrentPlayer(),
      board: this.getBoard(),
      winner: this.getWinner()
    }
  }

  isMoveValid (stack: number, count: number): boolean {
    //        stack exists      &&             valid sticks count            &&  stack has enough sticks
    return stack in this.stacks && count > 0 && count <= this.maxTakesByTurn && this.stacks[stack] >= count
  }

  // returns the next player, or null if the game is finished
  play (stack: number, count: number): string | null {
    if (this.winner) {
      throw new Error('Game is finished')
    }

    if (!this.isMoveValid(stack, count)) {
      throw new Error('Move is not valid')
    }

    this.stacks[stack] -= count

    const remainingSticks = this.stacks.reduce((a, c) => a + c)

    if (remainingSticks) {
      this.turn++
      return this.getCurrentPlayer() // next player
    }

    // determining winner
    if (this.players.length === 2) {
      this.winner = this.players[(this.turn + 1) % this.players.length]
    } else {
      this.winner = this.getCurrentPlayer()
    }

    return null
  }
}
