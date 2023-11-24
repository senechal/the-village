/* eslint-disable @typescript-eslint/member-delimiter-style */
import Phaser from 'phaser'
import BBCodeText from 'phaser3-rex-plugins/plugins/bbcodetext'
import { type ModalPlugin } from './ModalPlugin'
import * as EventEmitter from '../../Utils/EventEmitter'
import { Dialog } from './Dialog'

class DisplayItem extends Phaser.GameObjects.Sprite {
  private config: ItemConfig
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

  setConfig(item: ItemConfig): Phaser.GameObjects.Sprite {
    this.config = item
    return this
  }

  getConfig(): ItemConfig {
    return this.config
  }

  destroy(fromScene?: boolean): void {
    this.off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP)
    super.destroy(fromScene)
  }
}

export class Shop extends Dialog {
  private inventory: Phaser.GameObjects.NineSlice
  private inventoryGrid: Phaser.GameObjects.Grid
  private readonly dialog: Phaser.GameObjects.NineSlice
  private shop: Phaser.GameObjects.NineSlice
  private shopGrid: Phaser.GameObjects.Grid
  private description: Phaser.GameObjects.NineSlice

  private readonly inventoryPos: { x: number; y: number; width: number; height: number }
  private readonly shopPos: { x: number; y: number; width: number; height: number }
  private readonly descriptionPos: { x: number; y: number; width: number; height: number }

  private closeButton: Phaser.GameObjects.Sprite

  private shopItemGroup: Phaser.GameObjects.Group
  private readonly inventoryItemGroup: Phaser.GameObjects.Group

  private descriptionText: any
  private selector: Phaser.GameObjects.Sprite

  private clickedTime: number = 0
  private dragOriginalPosition: { x: number; y: number }
  private dropZone: Phaser.GameObjects.Zone

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

  clickEvent(): void {
    // this.plugin.scene.input.on(Phaser.Input.Events.POINTER_UP, () => {
    //   if (this.open) {
    //   }
    // })
  }

  showShop(
    playerItems: ItemConfig[],
    shopItems: ItemConfig[],
    message = 'How can I help you today?'
  ): void {
    EventEmitter.gameEvents.emit(EventEmitter.OPEN_DIALOG)

    this.createInventory(playerItems)
    this.createShopDialog(message)
    this.createShop(shopItems)
    this.createDescription()
  }

  private createInventory(items: ItemConfig[]): void {
    this.inventory = this.createDialog({ ...this.config, ...this.inventoryPos })
    this.inventoryGrid = this.plugin.scene.add.grid(
      this.inventoryPos.x + 32,
      this.inventoryPos.y + 32,
      this.inventoryPos.width - 64,
      this.inventoryPos.height - 64,
      32,
      32,
      0xcc613d,
      0.3
    )
    this.inventoryGrid.setOrigin(0, 0)
    if (this.dropZone) this.dropZone.destroy()
    this.dropZone = this.plugin.scene.add
      .zone(
        this.inventoryPos.x,
        this.inventoryPos.y,
        this.inventoryPos.width,
        this.inventoryPos.height
      )
      .setOrigin(0, 0)
      .setRectangleDropZone(this.inventoryPos.width, this.inventoryPos.height)
    this.plugin.scene.input.on(
      Phaser.Input.Events.GAMEOBJECT_DROP,
      (pointer: any, GameObject: DisplayItem) => {
        this.buyItem(GameObject.getConfig())
      }
    )
  }

  private createShopDialog(message: string): void {
    this.showDialog([message])
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

    this.shopGrid = this.plugin.scene.add.grid(
      this.shopPos.x + 32,
      this.shopPos.y + 32,
      4 * 32,
      4 * 32,
      32,
      32,
      0xcc613d,
      0.3
    )
    this.shopGrid.setOrigin(0, 0)
    this.shopItemGroup = this.plugin.scene.add.group({
      classType: DisplayItem
    })

    items.forEach((item, index) => {
      const itemSprite: DisplayItem = this.shopItemGroup
        .get(0, index, item.spritesheet, item.frame)
        .setConfig(item)
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
          const clickDelay = this.plugin.scene.time.now - this.clickedTime
          this.clickedTime = this.plugin.scene.time.now

          if (clickDelay < 350) {
            this.buyItem(item)
            this.clickedTime = 0
          }
          this.setDescriptionText(`[size=13][b]${item.name}[/b][/size]: \n${item.description}`)
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
    })
    console.log(this.shopItemGroup.getChildren())
    Phaser.Actions.GridAlign(this.shopItemGroup.getChildren(), {
      width: 3,
      height: 4,
      cellWidth: 32,
      cellHeight: 32,
      x: this.shopPos.x + 32,
      y: this.shopPos.y + 32
    })
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

  private buyItem(item: any): void {
    this.setText(`Buy ${item.name} for ${item.buy}?`, { ...this.config, animateText: false })
    // TODO: show buttons
  }

  private closeShop(): void {
    if (this.closeButton) this.closeButton.destroy()
    if (this.inventory) this.inventory.destroy()
    if (this.dropZone) this.dropZone.destroy()
    if (this.shop) this.shop.destroy()
    if (this.description) this.description.destroy()
    if (this.descriptionText) this.descriptionText.destroy()
    if (this.inventoryGrid) this.inventoryGrid.destroy()
    if (this.shopGrid) this.shopGrid.destroy()
    if (this.shopItemGroup) {
      for (const child of [...this.shopItemGroup.getChildren()]) {
        child.destroy()
      }
      this.shopItemGroup.destroy()
    }
    if (this.selector) this.selector.destroy()
    this.clickedTime = 0

    super.closeDialog()
  }
}
