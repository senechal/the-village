/* eslint-disable @typescript-eslint/member-delimiter-style */
import Phaser from 'phaser'
import * as EventEmitter from '../../Utils/EventEmitter'
import { Dialog } from './Dialog'
import { Shop } from './Shop'

export class ModalPlugin extends Phaser.Plugins.BasePlugin {
  scene: Phaser.Scene
  private systems: Phaser.Scenes.Systems
  private dialog: Dialog
  private shop: Shop

  create(config: any, scene: Phaser.Scene): Phaser.Plugins.BasePlugin {
    this.scene = scene
    this.systems = scene.sys
    if (!this.systems.settings.isBooted) {
      this.systems.events.once('boot', this.boot, this)
    }

    const { dialog, inventory } = config

    this.dialog = new Dialog(this, dialog)
    this.shop = new Shop(this, inventory)
    return this
  }

  boot(): any {
    EventEmitter.gameEvents.on(EventEmitter.SHUTDOWN, this.shutdown, this)
    EventEmitter.gameEvents.on(EventEmitter.DESTROY, this.shutdown, this)
  }

  shutdown(): any {}
  destory(): any {
    this.shutdown()
    this.scene = undefined
  }

  showDialog(text: string[], config: DialogConfig): void {
    this.dialog.showDialog(text, config)
  }

  // showInventory(items?: string[]): void {
  //   this.inventory.showInventory(items)
  // }

  showShop(playerItems: ItemConfig[], shopItems: ItemConfig[], message?: string): void {
    this.shop.showShop(playerItems, shopItems, message)
  }
}
