import Phaser from 'phaser'
import { merge } from 'lodash-es'
import * as lockr from 'lockr'
import * as EventEmitter from '../../Utils/EventEmitter'
import { UI_LOCAL_STORAGE } from '../typedef'

export class UI extends Phaser.Scene {
  private state: PlayerState
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
