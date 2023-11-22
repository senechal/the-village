import { type Game } from '../../scenes/Game'
import { Character } from '../Character'

export class Monster extends Character {
  private readonly ramdomDelay: number
  constructor(
    scene: Game,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)
    this.ramdomDelay = 3000
  }

  init(): void {
    super.init()
    const { random } = this.config
    const radius = typeof random === 'number' ? random : undefined
    if (random) this.randomMovement(radius)
  }

  protected randomMovement(radius?: number): void {
    this.scene.gridEngine.moveRandomly(this.id, this.ramdomDelay, radius)
  }
}
