/* eslint-disable @typescript-eslint/member-delimiter-style */
import Phaser from 'phaser'
import * as EventEmitter from '../../Utils/EventEmitter'
import { type ModalPlugin } from './ModalPlugin'
import { BaseDialog } from './BaseDialog'

export class Dialog extends BaseDialog {
  private currentText: string
  private text: Phaser.GameObjects.Text
  private dialogList: Array<{ text: string; config: DialogConfig }>
  private content: string[]
  private timerEvent: Phaser.Time.TimerEvent
  private animating: boolean
  private open: boolean
  private next: Phaser.GameObjects.Sprite
  private frame: Phaser.GameObjects.NineSlice

  constructor(plugin: ModalPlugin, config: DialogConfig) {
    super(plugin, config)
    this.open = false
    this.clickEvent()
  }

  clickEvent(): void {
    this.plugin.scene.input.on(Phaser.Input.Events.POINTER_UP, () => {
      if (this.open) {
        if (this.animating) {
          this.showAllText()
        } else if (this.dialogList.length !== 0) {
          const { text, config } = this.dialogList.pop()
          if (!this.dialogList.length) this.next.destroy()
          this.setText(text, config)
        } else {
          this.closeDialog()
        }
      }
    })
  }

  setText(text: string, config: DialogConfig): void {
    const x = config?.x + config?.padding
    const y = config?.y + config?.padding

    this.currentText = text
    if (config.animateText) {
      this.content = undefined
      this.content = text.split('')
    }
    const style = {
      wordWrap: { width: config?.width - config?.padding * 2 },
      color: config?.textColor,
      font: config?.font,
      lineSpacing: config?.lineSpacing
    }
    if (this.text) {
      this.text.destroy()
    }
    this.text = this.plugin.scene.make.text({ x, y, text: config.animateText ? '' : text, style })
    if (config.animateText) this.setupAnimation(config)
  }

  private setupAnimation(config: DialogConfig): void {
    const delay = 150 - config?.textSpeed * 30
    if (this.timerEvent) this.timerEvent.destroy()
    this.animating = true
    this.timerEvent = this.plugin.scene.time.delayedCall(delay, this.animateText, [delay, 0], this)
  }

  private animateText(delay: number, counter: number): void {
    this.text.setText(this.text.text + this.content[counter])
    if (counter < this.content.length - 1) {
      this.timerEvent = this.plugin.scene.time.delayedCall(
        delay,
        this.animateText,
        [delay, counter + 1],
        this
      )
    } else {
      this.animating = false
    }
  }

  private showAllText(): void {
    this.timerEvent.destroy()
    this.text.setText(this.currentText)
    this.animating = false
  }

  closeDialog(): void {
    if (this.text) this.text.destroy()
    if (this.timerEvent) this.timerEvent.destroy()
    if (this.frame) this.frame.destroy()
    if (this.next) this.next.destroy()
    this.plugin.scene.time.delayedCall(
      0,
      EventEmitter.gameEvents.emit,
      [EventEmitter.CLOSE_DIALOG],
      EventEmitter.gameEvents
    )
  }

  boot(): any {
    EventEmitter.gameEvents.on(EventEmitter.SHUTDOWN, this.shutdown, this)
    EventEmitter.gameEvents.on(EventEmitter.DESTROY, this.shutdown, this)
  }

  shutdown(): any {}

  destroy(): any {
    this.shutdown()
    this.plugin = undefined
    if (this.text) this.text.destroy()
    if (this.timerEvent) this.timerEvent.destroy()
    if (this.frame) this.frame.destroy()
    if (this.next) this.next.destroy()
  }

  showDialog(textList: string[], localConfig: DialogConfig = {}): void {
    EventEmitter.gameEvents.emit(EventEmitter.OPEN_DIALOG)
    if (this.frame) this.frame.destroy()
    if (this.next) this.next.destroy()
    this.dialogList = textList
      .reverse()
      .map(text => ({ text, config: { ...this.config, localConfig } }))

    const { text, config } = this.dialogList.pop()
    this.frame = this.createDialog(config)
    if (this.dialogList.length) {
      this.next = this.createNextIcon(config)
    }
    this.open = true
    this.setText(text, config)
  }
}
