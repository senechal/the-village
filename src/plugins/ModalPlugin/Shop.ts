/* eslint-disable @typescript-eslint/member-delimiter-style */
import Phaser from 'phaser'
import BBCodeText from 'phaser3-rex-plugins/plugins/bbcodetext'
import { type ModalPlugin } from './ModalPlugin'
import * as EventEmitter from '../../Utils/EventEmitter'
import { Dialog } from './Dialog'

class DisplayItem extends Phaser.GameObjects.Sprite {
  private config: ItemConfig
  private procedence: string
  private q: Phaser.GameObjects.Text
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)
    this.scene.input.enableDebug(this)
    this.setInteractive({ useHandCursor: true })
    this.scene.input.setDraggable(this)
  }

  setShowQuantity(showQuantity: boolean): this {
    if (showQuantity) {
      if (this.q) this.q.destroy()
      this.q = this.scene.add.text(this.x + 12, this.y + 12, `${this.config.quantity}`, {
        color: '#fff',
        backgroundColor: '#000',
        font: '10px monospace'
      })
      this.q.setOrigin(1, 1)
    }
    return this
  }

  getProcedence(): string {
    return this.procedence
  }

  setProcedence(procedence: string): this {
    this.procedence = procedence
    return this
  }

  setConfig(item: ItemConfig): this {
    this.config = item
    return this
  }

  getConfig(): ItemConfig {
    return this.config
  }

  destroy(fromScene?: boolean): void {
    this.off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP)
    if (this.q) this.q.destroy()
    super.destroy(fromScene)
  }
}

export class Shop extends Dialog {
  private gold: number
  private goldText: Phaser.GameObjects.Text
  private inventory: Phaser.GameObjects.NineSlice
  private inventoryGrid: Phaser.GameObjects.Grid
  private readonly inventoryPos: { x: number; y: number; width: number; height: number }
  private inventoryItemGroup: Phaser.GameObjects.Group
  private inventoryDropZone: Phaser.GameObjects.Zone

  private shop: Phaser.GameObjects.NineSlice
  private shopGrid: Phaser.GameObjects.Grid
  private readonly shopPos: { x: number; y: number; width: number; height: number }
  private shopItemGroup: Phaser.GameObjects.Group
  private shopDropZone: Phaser.GameObjects.Zone

  private description: Phaser.GameObjects.NineSlice
  private readonly descriptionPos: { x: number; y: number; width: number; height: number }
  private descriptionText: BBCodeText

  private closeButton: Phaser.GameObjects.Sprite
  private selector: Phaser.GameObjects.Sprite
  private clickedTime: number = 0
  private dragOriginalPosition: { x: number; y: number }

  private dropdown: Phaser.GameObjects.DOMElement
  private acceptButton: Phaser.GameObjects.Sprite
  private rejectButton: Phaser.GameObjects.Sprite

  private initialMessage: string

  private playerItems: ItemConfig[]

  constructor(plugin: ModalPlugin, config: DialogConfig) {
    super(plugin, config)
    this.inventoryPos = {
      x: 32,
      y: 2 * 32,
      width: 7 * 32,
      height: 11 * 32
    }
    this.descriptionPos = {
      x: 18 * 32,
      y: 8 * 32,
      width: 6 * 32,
      height: 5 * 32
    }
    this.shopPos = {
      x: 18 * 32,
      y: 2 * 32,
      width: 6 * 32,
      height: 6 * 32
    }
  }

  eventListeners(): void {
    this.plugin.scene.input.on(
      Phaser.Input.Events.GAMEOBJECT_DROP,
      (pointer: any, GameObject: DisplayItem, zone: Phaser.GameObjects.Zone) => {
        const procedence = GameObject.getProcedence()
        if (zone.name === 'inventory' && procedence === 'shop') {
          this.buyItem(GameObject.getConfig())
        }

        if (zone.name === 'shop' && procedence === 'inventory') {
          this.sellItem(GameObject.getConfig())
        }
      }
    )
  }

  showShop(
    playerItems: ItemConfig[],
    shopItems: ItemConfig[],
    gold: number,
    message = 'How can I help you today?'
  ): void {
    EventEmitter.gameEvents.emit(EventEmitter.OPEN_DIALOG)
    this.initialMessage = message
    this.gold = gold
    this.createInventory(playerItems, true)
    this.createShopDialog(message)
    this.createShop(shopItems)
    this.createDescription()
    this.showGold()
  }

  private showGold(): void {
    if (this.goldText) this.goldText.destroy()
    this.goldText = this.plugin.scene.add.text(
      this.inventoryPos.x + 32,
      this.inventoryPos.y + 16,
      `Gold: ${this.gold}`,
      {
        color: '#cc613d',
        font: '16px monospace'
      }
    )
  }

  private createInventory(items: ItemConfig[], creating = false): void {
    this.playerItems = items
    if (creating && this.inventory) {
      this.inventory.destroy()
      this.inventory = this.createDialog({ ...this.config, ...this.inventoryPos })
    }
    if (!this.inventory) {
      this.inventory = this.createDialog({ ...this.config, ...this.inventoryPos })
    }

    if (this.selector) this.selector.destroy()
    if (this.descriptionText) this.descriptionText.destroy()
    if (this.inventoryGrid) this.inventoryGrid.destroy()
    if (this.inventoryItemGroup) {
      if (this.inventoryItemGroup.children) {
        for (const child of [...this.inventoryItemGroup.getChildren()]) {
          child.destroy()
        }
      }
      this.inventoryItemGroup.destroy()
    }
    if (this.inventoryDropZone) this.inventoryDropZone.destroy()

    const [grid, group, dropZone] = this.createGrid(
      this.inventoryPos,
      this.playerItems,
      'inventory',
      true,
      (item, isDoubleClick) => {
        if (isDoubleClick) {
          this.sellItem(item)
        }
      }
    )

    this.inventoryGrid = grid
    this.inventoryItemGroup = group
    this.inventoryDropZone = dropZone
  }

  private createShopDialog(message: string): void {
    this.showDialog([message], { animateText: false })
  }

  private createShop(items: ItemConfig[]): void {
    this.shop = this.createDialog({ ...this.config, ...this.shopPos })
    this.closeButton = this.plugin.scene.add.sprite(
      this.shopPos.x + 5 * 32,
      this.shopPos.y - 32,
      'dialog-extras',
      2
    )
    this.closeButton.setOrigin(0, 0)

    this.closeButton
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        this.closeShop()
      })

    const [grid, group, dropZone] = this.createGrid(
      this.shopPos,
      items,
      'shop',
      false,
      (item, isDoubleClick) => {
        if (isDoubleClick) {
          this.buyItem(item)
        }
      }
    )

    if (this.shopGrid) this.shopGrid.destroy()
    this.shopGrid = grid

    if (this.shopItemGroup) this.shopItemGroup.destroy()
    this.shopItemGroup = group

    if (this.shopDropZone) this.shopDropZone.destroy()
    this.shopDropZone = dropZone
  }

  private createGrid(
    pos: { x: number; y: number; width: number; height: number },
    items: ItemConfig[],
    zoneName: string,
    showQuantity: boolean,
    click: (item: ItemConfig, isDoubleClick: boolean) => void
  ): [Phaser.GameObjects.Grid, Phaser.GameObjects.Group, Phaser.GameObjects.Zone] {
    const grid = this.plugin.scene.add.grid(
      pos.x + 32,
      pos.y + 32,
      pos.width - 64,
      pos.height - 64,
      32,
      32,
      0xcc613d,
      0.3
    )
    const dropZOne = this.plugin.scene.add
      .zone(pos.x, pos.y, pos.width, pos.height)
      .setOrigin(0, 0)
      .setRectangleDropZone(pos.width, pos.height)
      .setName(zoneName)
    grid.setOrigin(0, 0)
    const group = this.plugin.scene.add.group({
      classType: DisplayItem
    })

    const sprites: DisplayItem[] = []
    items.forEach((item, index) => {
      const itemSprite: DisplayItem = group
        .get(0, index, item.spritesheet, item.frame)
        .setConfig(item)
        .setProcedence(zoneName)
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
          const clickDelay = this.plugin.scene.time.now - this.clickedTime
          this.clickedTime = this.plugin.scene.time.now

          click(item, clickDelay < 350)

          if (clickDelay < 350) {
            this.clickedTime = 0
          }
          this.setDescriptionText(
            `[size=13][b]${item.name}[/b][/size]: \n${item.description}(Buy:${item.buy}/Sell: ${item.sell})`
          )
          if (this.selector) this.selector.destroy()
          this.selector = this.plugin.scene.add.sprite(
            itemSprite.x,
            itemSprite.y,
            'dialog-extras',
            6
          )
        })
        .on(Phaser.Input.Events.GAMEOBJECT_DRAG_START, () => {
          this.dragOriginalPosition = { x: itemSprite.x, y: itemSprite.y }
        })
        .on(Phaser.Input.Events.GAMEOBJECT_DRAG, (pointer: any, dragX: number, dragY: number) => {
          if (this.selector) this.selector.destroy()

          itemSprite.x = dragX
          itemSprite.y = dragY
        })
        .on(Phaser.Input.Events.GAMEOBJECT_DRAG_END, () => {
          itemSprite.x = this.dragOriginalPosition.x
          itemSprite.y = this.dragOriginalPosition.y
          this.dragOriginalPosition = undefined
        })
      sprites.push(itemSprite)
    })
    Phaser.Actions.GridAlign(group.getChildren(), {
      width: (pos.width - 64) / 32,
      height: (pos.height - 64) / 32,
      cellWidth: 32,
      cellHeight: 32,
      x: pos.x + 32,
      y: pos.y + 32
    })

    sprites.forEach(item => item.setShowQuantity(showQuantity))

    return [grid, group, dropZOne]
  }

  private setDescriptionText(text: string): void {
    if (this.descriptionText) this.descriptionText.destroy()
    const style = {
      wordWrap: { width: this.descriptionPos?.width - this.config?.padding },
      color: this.config?.textColor,
      fontFamily: 'monospace',
      fontSize: '12px',
      lineSpacing: this.config?.lineSpacing,
      delimeters: '[]'
    }
    this.descriptionText = new BBCodeText(
      this.plugin.scene,
      this.descriptionPos.x + 16,
      this.descriptionPos.y + 16,
      text,
      {
        delimiters: '[]',
        ...style
      }
    )

    this.plugin.scene.add.existing(this.descriptionText)
  }

  private createDescription(): void {
    this.description = this.createDialog({ ...this.config, ...this.descriptionPos })
  }

  private createIteractiveDialog(message: string, func: (value: number) => void): void {
    this.setText(message, {
      ...this.config,
      animateText: false
    })
    if (this.dropdown) this.dropdown.destroy()
    const { x, y } = this.config
    this.dropdown = this.plugin.scene.add
      .dom(x + this.getText().width + 16, y + 14)
      .createFromCache('dropdown')
    this.dropdown.setOrigin(0, 0)
    this.dropdown.addListener('click')
    this.dropdown.on('click', (event: any) => {
      const selected = this.dropdown.getChildByID('default-option')
      if (event.target.dataset.option === 'true') {
        selected.innerHTML = event.target.innerHTML

        func(parseInt(event.target.innerHTML, 10))
      }
    })
  }

  private buyItem(item: any): void {
    let quantity: number = 1
    this.createIteractiveDialog(
      `Buy ${item.name} for ${item.buy} each? How many?`,
      (q: number): void => {
        quantity = q
      }
    )

    this.createActionButtons(
      () => {
        const owned = this.playerItems.findIndex(({ id }) => id === item.id)
        const total = quantity * item.buy
        if (total > this.gold) {
          this.setText('Sorry, not enough gold! Anything else I can help you with?', {
            ...this.config,
            animateText: false
          })
        } else {
          if (owned >= 0) {
            this.playerItems[owned].quantity += quantity
          } else {
            this.playerItems.push({ ...item, quantity })
          }
          this.gold -= total
          EventEmitter.gameEvents.emit(EventEmitter.BUY_ITEM, this.playerItems, this.gold)
          this.createInventory(this.playerItems)
          this.showGold()
          this.setText('Done! Anything Else?', {
            ...this.config,
            animateText: false
          })
        }
      },
      () => {
        this.setText(this.initialMessage, {
          ...this.config,
          animateText: false
        })
      }
    )
  }

  private sellItem(item: any): void {
    let quantity = 1
    this.createIteractiveDialog(
      `Sell ${item.name} for ${item.sell} each? How many?`,
      (q: number): void => {
        quantity = q
      }
    )

    this.createActionButtons(
      () => {
        const owned = this.playerItems.findIndex(({ id }) => id === item.id)
        if (this.playerItems[owned].quantity <= quantity) {
          this.gold += this.playerItems[owned].quantity * item.sell
          this.playerItems = this.playerItems.filter(({ id }) => id !== item.id)
          EventEmitter.gameEvents.emit(EventEmitter.SELL_ITEM, this.playerItems, this.gold)
        } else {
          this.gold += quantity * item.sell
          this.playerItems[owned].quantity -= quantity
          EventEmitter.gameEvents.emit(EventEmitter.SELL_ITEM, this.playerItems, this.gold)
        }

        this.createInventory(this.playerItems)
        this.showGold()
        this.setText('Done! Anything Else?', {
          ...this.config,
          animateText: false
        })
      },
      () => {
        this.setText(this.initialMessage, {
          ...this.config,
          animateText: false
        })
      }
    )
  }

  private createActionButtons(accept: () => void, reject: () => void): void {
    if (this.acceptButton) this.acceptButton.destroy()
    this.acceptButton = this.plugin.scene.add
      .sprite(
        this.config.x + this.config.width - this.config.padding - this.config.margin,
        this.config.y + this.config.height - this.config.padding - this.config.margin,
        'dialog-extras',
        1
      )
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        accept()
        if (this.dropdown) this.dropdown.destroy()
        if (this.acceptButton) this.acceptButton.destroy()
        if (this.rejectButton) this.rejectButton.destroy()
      })
    if (this.rejectButton) this.rejectButton.destroy()
    this.rejectButton = this.plugin.scene.add
      .sprite(
        this.config.x + this.config.width - this.config.padding - this.config.margin * 2,
        this.config.y + this.config.height - this.config.padding - this.config.margin,
        'dialog-extras',
        2
      )
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        reject()
        if (this.dropdown) this.dropdown.destroy()
        if (this.acceptButton) this.acceptButton.destroy()
        if (this.rejectButton) this.rejectButton.destroy()
      })
  }

  private closeShop(): void {
    if (this.inventory) this.inventory.destroy()
    if (this.inventoryGrid) this.inventoryGrid.destroy()
    if (this.inventoryItemGroup) {
      for (const child of [...this.inventoryItemGroup.getChildren()]) {
        if (child) child.destroy()
      }
      this.inventoryItemGroup.destroy()
    }
    if (this.inventoryDropZone) this.inventoryDropZone.destroy()

    if (this.shop) this.shop.destroy()
    if (this.shopGrid) this.shopGrid.destroy()
    if (this.shopItemGroup) {
      for (const child of [...this.shopItemGroup.getChildren()]) {
        if (child) child.destroy()
      }
      this.shopItemGroup.destroy()
    }
    if (this.shopDropZone) this.shopDropZone.destroy()

    if (this.description) this.description.destroy()
    if (this.descriptionText) this.descriptionText.destroy()

    if (this.closeButton) this.closeButton.destroy()
    if (this.selector) this.selector.destroy()
    if (this.dropdown) this.dropdown.destroy()
    if (this.acceptButton) this.acceptButton.destroy()
    if (this.rejectButton) this.rejectButton.destroy()
    if (this.goldText) this.goldText.destroy()

    this.clickedTime = 0

    super.closeDialog()
  }
}
