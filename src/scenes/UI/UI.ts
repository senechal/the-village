import Phaser from 'phaser'
import { merge } from 'lodash-es'
import * as lockr from 'lockr'
import * as EventEmitter from '../../Utils/EventEmitter'
import { UI_LOCAL_STORAGE } from '../typedef'

export class UI extends Phaser.Scene {
  private state: PlayerState
  private bodyCounter: Phaser.GameObjects.Group
  private mindConter: Phaser.GameObjects.Group
  private inventoryButton: any
  private equipmentButton: any
  private battleIndicator: any

  private readonly mindCouter: any

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
    this.updateBodyCount()
    this.updateMindCount()
    this.createActionBar()
    this.eventListeners()
  }

  private updateBodyCount(): void {
    if (this.bodyCounter) {
      this.bodyCounter.getChildren().forEach(child => {
        child.destroy()
      })
      this.bodyCounter.destroy()
    }
    this.bodyCounter = this.add.group()
    this.bodyCounter.createMultiple({ key: 'body-mind', frame: 0, frameQuantity: this.state.body })
    Phaser.Actions.GridAlign(this.bodyCounter.getChildren(), {
      width: this.state.body,
      height: 1,
      cellWidth: 16,
      cellHeight: 24,
      x: 32,
      y: 16
    })
  }

  private updateMindCount(): void {
    if (this.mindConter) {
      this.mindConter.getChildren().forEach(child => {
        child.destroy()
      })
      this.mindConter.destroy()
    }
    this.mindConter = this.add.group()
    this.mindConter.createMultiple({ key: 'body-mind', frame: 1, frameQuantity: this.state.mind })
    Phaser.Actions.GridAlign(this.mindConter.getChildren(), {
      width: this.state.mind,
      height: 1,
      cellWidth: 16,
      cellHeight: 24,
      x: 32,
      y: 16 + 24
    })
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
