// import type Phaser from 'phaser'
import { Character } from '../Character'
import * as EventEmitter from '../../Utils/EventEmitter'

export class NPC extends Character {
  dialogs: string[]
  init(): void {
    super.init()
  }

  setDialogs(dialogs: string[]): Character {
    this.dialogs = dialogs
    return this
  }

  eventListeners(): void {
    super.eventListeners()
    this.setInteractive()
    this.on(Phaser.Input.Events.POINTER_UP, () => {
      if (!this.frozen) {
        this.scene.gridEngine.stopMovement(this.scene.getPlayerId())
        const pos = this.scene.gridEngine.getPosition(this.id)
        this.scene.gridEngine
          .moveTo(this.scene.getPlayerId(), pos, {
            noPathFoundStrategy: 'CLOSEST_REACHABLE'
          })
          .subscribe(() => {
            this.scene.time.delayedCall(500, this.talk, [], this)
          })
      }
    })
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.input.off(Phaser.Input.Events.POINTER_UP)
    })
  }

  talk(): void {
    const direction = this.scene.getPlayerDirection()
    this.setAnim('idle', direction === 'right' ? 'left' : 'right')
    this.setOrigin(0.5, 1)
    EventEmitter.gameEvents.emit(EventEmitter.TEXT_DIALOG, this.dialogs)
  }
}
