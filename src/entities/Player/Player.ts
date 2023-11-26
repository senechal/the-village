import { type Game } from '../../scenes/Game'
import { Character } from '../Character'
import { round, toIso } from '../../helpers'

const pinTweenConfig = {
  // alpha: 0.8,
  alpha: {
    getStart: () => 0.8,
    getEnd: () => 0.3
  },
  yoyo: true,
  repeat: -1,
  ease: 'Sine.easeInOut',
  delay: 1,
  duration: 400
}

export class Player extends Character {
  private pin: any
  private pinTween: Phaser.Tweens.Tween

  constructor(scene: Game, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
    scene.physics.add.existing(this)
    this.scene.add.existing(this)
  }

  init(): void {
    super.init()
    this.pin = this.scene.add.image(0, 0, this.config.pin).setAlpha(0).setOrigin(0.5, 0.75)
    this.pinTween = this.scene.tweens
      .add({
        targets: this.pin,
        ...pinTweenConfig
      })
      .pause()
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
                    () => {
                      this.pinTween.pause()
                      this.pin.setAlpha(0)
                    },
                    [],
                    this
                  )
                } else {
                  this.pinTween.pause()
                  this.pin.setAlpha(0)
                }
              })

            this.pinTween.restart()
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
