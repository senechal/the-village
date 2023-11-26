import { type Game } from '../../scenes/Game'
import * as EventEmitter from '../../Utils/EventEmitter'

export class Character extends Phaser.Physics.Arcade.Sprite {
  readonly id: string
  private initialAnim: [string, string] = ['idle', 'right']
  characterName: string
  readonly config: CharRendeConfig
  frozen: boolean
  scene: Game
  constructor(scene: Game, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
    this.scene = scene
    this.id = texture
    this.config = this.scene.cache.json.get(`${this.id}-char-config`)
    this.anims.play(`${this.id}-idle-right`)
    this.init()
  }

  getInitialAnim(): [string, string] {
    return this.initialAnim
  }

  setAnim(type?: string, direction?: string): Character {
    const [initType, initDirection] = this.initialAnim
    this.anims.play(`${this.id}-${type ?? initType}-${direction ?? initDirection}`, true)
    return this
  }

  setInitialAnim(type: string, direction: string): Character {
    this.anims.play(`${this.id}-${type}-${direction}`, true)
    this.initialAnim = [type, direction]
    return this
  }

  setCharcterName(name: string): Character {
    this.characterName = name
    return this
  }

  getId(): string {
    return this.id
  }

  eventListeners(): void {
    EventEmitter.gameEvents.on(EventEmitter.OPEN_DIALOG, () => {
      this.frozen = true
    })
    EventEmitter.gameEvents.on(EventEmitter.CLOSE_DIALOG, () => {
      this.frozen = false
    })
  }

  setFrozen(frozen: boolean): Character {
    this.frozen = frozen
    return this
  }

  init(): void {
    const { offset, speed } = this.config
    const [offsetX, offsetY] = offset

    this.scene.gridEngine.addCharacter({
      id: this.id,
      sprite: this,
      startPosition: { x: this.x, y: this.y },
      offsetY,
      offsetX,
      numberOfDirections: 4,
      speed
    })

    this.scene.gridEngine.movementStarted().subscribe((directions: Directions): void => {
      const { charId, direction } = directions
      if (charId === this.id) {
        this.anims.play(`${this.id}-walk-${direction}`, true)
      }
    })

    this.scene.gridEngine.movementStopped().subscribe((directions: Directions) => {
      const { charId, direction } = directions
      if (charId === this.id) {
        this.anims.stop()
        const [, side] = direction.split('-')
        this.anims.play(`${this.id}-idle-${side}`)
      }
    })

    this.scene.gridEngine.directionChanged().subscribe((directions: Directions) => {
      const { charId, direction } = directions
      if (charId === this.id) {
        const [, side] = direction.split('-')
        this.anims.play(`${this.id}-idle-${side}`)
      }
    })

    this.eventListeners()
    // this.scene.input.enableDebug(this)
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)
    this.setOrigin(...this.config.origin)
  }
}
