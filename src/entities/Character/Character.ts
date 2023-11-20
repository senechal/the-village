import Phaser from 'phaser'

export class Character extends Phaser.Physics.Arcade.Sprite {
  readonly id: string
  readonly config: CharConfig
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)
    this.id = texture
    this.config = this.scene.cache.json.get(`${this.id}-char-config`)

    this.init()
  }

  getId(): string {
    return this.id
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

    this.scene.gridEngine
      .movementStarted()
      .subscribe((directions: Directions): void => {
        const { charId, direction } = directions
        if (charId === this.id) {
          this.anims.play(`${this.id}-${direction}`, true)
        }
      })

    this.scene.gridEngine
      .movementStopped()
      .subscribe((directions: Directions) => {
        const { charId, direction } = directions
        if (charId === this.id) {
          this.anims.stop()
          const [, side] = direction.split('-')
          this.anims.play(`${this.id}-idle-${side}`)
        }
      })

    this.scene.gridEngine
      .directionChanged()
      .subscribe((directions: Directions) => {
        const { charId, direction } = directions
        if (charId === this.id) {
          const [, side] = direction.split('-')
          this.anims.play(`${this.id}-idle-${side}`)
        }
      })
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)
    this.setOrigin(...this.config.origin)
  }
}
