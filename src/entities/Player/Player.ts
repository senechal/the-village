import { type Game } from '../../scenes/Game'
import { Character } from '../Character'
import { round, toIso } from '../../helpers'

const pinTweenConfig = {
  scaleX: 0.6,
  scaleY: 0.6,
  yoyo: true,
  repeat: -1,
  ease: 'Sine.easeInOut',
  delay: 1
}

export class Player extends Character {
  private pin: Phaser.GameObjects.Ellipse

  constructor(scene: Game, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
    scene.physics.add.existing(this)
    this.scene.add.existing(this)
  }

  init(): void {
    super.init()
    this.pin = this.scene.add.ellipse(0, 0, 16, 8, 0x000000, 0.5).setAlpha(0)
    this.scene.tweens.add({
      targets: this.pin,
      ...pinTweenConfig
    })
  }

  getSpeed(): number {
    return this.config.speed
  }

  eventListeners(): void {
    super.eventListeners()

    this.scene.input.on(
      Phaser.Input.Events.POINTER_UP,
      (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
        if (!this.frozen) {
          if (!currentlyOver.length) {
            this.pin.setAlpha(0)
            const { worldX, worldY } = pointer
            const target = round(this.scene.getGroundLayer().worldToTileXY(worldX, worldY))

            this.scene.gridEngine
              .moveTo(this.scene.getPlayerId(), target)
              .subscribe(({ result }: { result: string }) => {
                if (result === 'SUCCESS') {
                  this.scene.time.delayedCall(
                    1000 / this.config.speed,
                    () => this.pin.setAlpha(0),
                    [],
                    this
                  )
                } else {
                  this.pin.setAlpha(0)
                }
              })

            this.pin.setAlpha(0.5)
            this.pin.setPosition(...toIso(target.x * 32, target.y * 32, 0, -4))
          }
        }
      }
    )

    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.input.off(Phaser.Input.Events.POINTER_UP)
    })
  }
}
