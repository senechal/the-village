import Phaser from 'phaser'
import { merge } from 'lodash-es'
import * as lockr from 'lockr'
import * as EventEmitter from '../../Utils/EventEmitter'
import { UI_LOCAL_STORAGE } from '../typedef'

export class UI extends Phaser.Scene {
  private state: PlayerState
  private bodyCounter: Phaser.GameObjects.Text
  private bodyBanner: Phaser.GameObjects.Group
  private mindCounter: Phaser.GameObjects.Text
  private mindBanner: Phaser.GameObjects.Group
  private inventoryButton: any
  private equipmentButton: any
  private battleIndicator: any

  constructor() {
    super('UI')
    const localData = lockr.get(UI_LOCAL_STORAGE) ?? {}
    this.state = {
      body: 8,
      mind: 2,
      attack: 2,
      defence: 2,
      equipment: {},
      inventory: {
        gold: 2500,
        items: []
      },
      ...localData
    }
  }

  init(): void {
    window.addEventListener('beforeunload', e => {
      this.shutdown()
    })
  }

  shutdown(): void {
    lockr.set(UI_LOCAL_STORAGE, this.state)
  }

  setState(newState: PlayerStateSetter): void {
    this.state = merge(this.state, newState)
  }

  eventListeners(): void {
    EventEmitter.gameEvents.on(EventEmitter.TEXT_DIALOG, (dialogs: string[]) => {
      this.modal.showDialog(dialogs)
    })

    EventEmitter.gameEvents.on(EventEmitter.INVENTORY, (items: string[]) => {
      this.modal.showInventory(items)
    })

    EventEmitter.gameEvents.on(EventEmitter.SHOP, (shopItems: ItemConfig[]) => {
      this.modal.showShop(this.state.inventory.items, shopItems, this.state.inventory.gold)
    })

    EventEmitter.gameEvents.on(EventEmitter.BUY_ITEM, (items: ItemConfig[], gold: number) => {
      this.setState({
        inventory: {
          items,
          gold
        }
      })
    })

    EventEmitter.gameEvents.on(EventEmitter.SELL_ITEM, (items: ItemConfig[], gold: number) => {
      this.setState({
        inventory: {
          items,
          gold
        }
      })
    })

    if (this.inventoryButton) {
      this.inventoryButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.openInventory)
    }

    if (this.equipmentButton) {
      this.equipmentButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.openEquiment)
    }
  }

  create(): void {
    this.modal.create({}, this)
    this.createBodyBanner()
    this.createMindBanner()
    this.updateMindCount()
    this.createActionBar()
    this.eventListeners()
  }

  private createBodyBanner(): void {
    if (this.bodyBanner) {
      this.bodyBanner.getChildren().forEach(child => {
        child.destroy()
      })
      this.bodyBanner.destroy()
    }
    if (this.bodyCounter) this.bodyCounter.destroy()
    this.bodyBanner = this.add.group()
    this.bodyBanner.createMultiple({
      key: 'body-mind',
      frame: [0, 2],
      frameQuantity: 1
    })
    Phaser.Actions.GridAlign(this.bodyBanner.getChildren(), {
      width: 2,
      height: 1,
      cellWidth: 32,
      cellHeight: 32,
      x: 32,
      y: 16
    })
    this.bodyCounter = this.add
      .text(80, 32, `${this.state.body}`, {
        color: '#cc613d',
        font: 'bold 20px monospace'
      })
      .setOrigin(0.5, 0.5)
  }

  private createMindBanner(): void {
    if (this.mindBanner) {
      this.mindBanner.getChildren().forEach(child => {
        child.destroy()
      })
      this.bodyBanner.destroy()
    }
    if (this.mindCounter) this.mindCounter.destroy()
    this.mindBanner = this.add.group()
    this.mindBanner.createMultiple({
      key: 'body-mind',
      frame: [1, 2],
      frameQuantity: 1
    })
    Phaser.Actions.GridAlign(this.mindBanner.getChildren(), {
      width: 2,
      height: 1,
      cellWidth: 32,
      cellHeight: 32,
      x: 100,
      y: 16
    })
    this.mindCounter = this.add
      .text(146, 32, `${this.state.mind}`, {
        color: '#cc613d',
        font: 'bold 20px monospace'
      })
      .setOrigin(0.5, 0.5)
  }

  private updateBodyCount(): void {
    this.bodyCounter.setText(`${this.state.body}`)
  }

  private updateMindCount(): void {
    this.mindCounter.setText(`${this.state.mind}`)
  }

  private createActionBar(): void {
    const { height } = this.scale
    if (this.inventoryButton) this.inventoryButton.destroy()
    this.inventoryButton = this.add
      .sprite(32, height - 32, 'action-buttons', 1)
      .setOrigin(0, 1)
      .setInteractive({ useHandCursor: true })
    if (this.equipmentButton) this.equipmentButton.destroy()
    this.equipmentButton = this.add
      .sprite(32 + 64, height - 32, 'action-buttons', 2)
      .setOrigin(0, 1)
      .setInteractive({ useHandCursor: true })
    this.updateBattleIndicator('walk')
  }

  private updateBattleIndicator(battleState: string): void {
    const frames = {
      walk: 3,
      battle: 4
    }

    const { width, height } = this.scale
    if (this.battleIndicator) this.battleIndicator.destroy()
    this.battleIndicator = this.add
      .sprite(width - 32, height - 32, 'action-buttons', frames[battleState as keyof typeof frames])
      .setOrigin(1, 1)
    // .setInteractive({ useHandCursor: true })
  }

  private openInventory(): void {
    console.log('Open Iventory!')
  }

  private openEquiment(): void {
    console.log('Open Equipment!')
  }
}
