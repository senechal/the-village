import Phaser from 'phaser'
import * as EventEmitter from '../../Utils/EventEmitter'

export class UI extends Phaser.Scene {
  constructor() {
    super('UI')
  }

  create(): void {
    this.modal.create({}, this)

    EventEmitter.gameEvents.on(EventEmitter.TEXT_DIALOG, (dialogs: string[]) => {
      this.modal.showDialog(dialogs)
    })
    EventEmitter.gameEvents.on(EventEmitter.INVENTORY, (items: string[]) => {
      this.modal.showInventory(items)
    })
    EventEmitter.gameEvents.on(
      EventEmitter.SHOP,
      (playerItems: ItemConfig[], shopItems: ItemConfig[]) => {
        this.modal.showShop(playerItems, shopItems)
      }
    )
  }
}
