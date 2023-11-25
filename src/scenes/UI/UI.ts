import Phaser from 'phaser'
import { merge } from 'lodash-es'
import * as EventEmitter from '../../Utils/EventEmitter'

export class UI extends Phaser.Scene {
  private readonly state: PlayerState
  constructor() {
    super('UI')
    this.state = {
      body: 8,
      mind: 2,
      attack: 2,
      defence: 2,
      equipment: {},
      inventory: {
        gold: 2500,
        items: []
      }
    }
  }

  setState(newState: PlayerStateSetter): void {
    merge(this.state, newState)
  }

  create(): void {
    this.modal.create({}, this)

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
  }
}
