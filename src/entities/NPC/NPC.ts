// import type Phaser from 'phaser'
import { Character } from '../Character'
import * as EventEmitter from '../../Utils/EventEmitter'

export class NPC extends Character {
  dialogs: string[]
  shop: string[]
  quest: string[]

  init(): void {
    super.init()
    this.scene.input.enableDebug(this)
  }

  setDialogs(dialogs: string[]): Character {
    this.dialogs = dialogs
    return this
  }

  setShop(shop: string[]): Character {
    this.shop = shop
    return this
  }

  setQuest(quest: string[]): Character {
    this.quest = quest
    return this
  }

  eventListeners(): void {
    super.eventListeners()
    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(...this.config.hitArea),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true
    })
    this.on(Phaser.Input.Events.POINTER_UP, () => {
      if (!this.frozen) {
        this.scene.gridEngine.stopMovement(this.scene.getPlayerId())
        const pos = this.scene.gridEngine.getPosition(this.id)
        this.scene.gridEngine
          .moveTo(this.scene.getPlayerId(), pos, {
            noPathFoundStrategy: 'CLOSEST_REACHABLE'
          })
          .subscribe(({ result }: { result: string }) => {
            if (result === 'SUCCESS') {
              this.scene.time.delayedCall(500, this.lookAt, [], this)
              if (this.quest) {
                this.scene.time.delayedCall(500, this.startQuest, [], this)
              } else if (this.shop) {
                this.scene.time.delayedCall(500, this.openShop, [], this)
              } else if (this.dialogs) {
                this.scene.time.delayedCall(500, this.talk, [], this)
              }
            }
          })
      }
    })
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.off(Phaser.Input.Events.POINTER_UP)
    })
  }

  private lookAt(): void {
    const playerPos = this.scene.gridEngine.getPosition(this.scene.getPlayerId())
    const npcPos = this.scene.gridEngine.getPosition(this.id)
    let direction
    if (playerPos.x === npcPos.x) {
      if (playerPos.y > npcPos.y) {
        direction = 'right'
      } else {
        direction = 'left'
      }
    } else {
      if (playerPos.x > npcPos.x) {
        direction = 'left'
      } else {
        direction = 'right'
      }
    }
    this.scene.getplayer().setAnim('idle', direction)
    this.scene.getplayer().setOrigin(0.5, 1)
    this.setAnim('idle', direction === 'right' ? 'left' : 'right')
    this.setOrigin(0.5, 1)
  }

  talk(): void {
    EventEmitter.gameEvents.emit(EventEmitter.TEXT_DIALOG, this.dialogs)
  }

  openShop(): void {
    EventEmitter.gameEvents.emit(EventEmitter.SHOP, this.shop)
  }

  startQuest(): void {
    console.log('Starting Quest')
  }
}
