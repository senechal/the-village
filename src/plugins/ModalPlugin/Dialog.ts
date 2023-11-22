import Phaser from 'phaser'
import * as EventEmitter from '../../Utils/EventEmitter'
import { type ModalPlugin } from './ModalPlugin'

export class Dialog {
  private plugin: ModalPlugin
  private readonly config: DialogConfig
  private fullText: string
  private text: Phaser.GameObjects.Text

  private content: string[]
  private timerEvent: Phaser.Time.TimerEvent
  private animating: boolean
  private open: boolean

  //   private graphics: Phaser.GameObjects.Graphics
  private frame: Phaser.GameObjects.NineSlice
  constructor(plugin: ModalPlugin, config: DialogConfig) {
    this.plugin = plugin
    this.config = {
      textColor: '#cc613d',
      frame: 'frame',
      frameOffset: 32,
      lineSpacing: 8,
      font: '16px monospace',
      padding: 32,
      margin: 32,
      animateText: true,
      textSpeed: 3,
      width: 738,
      height: 150,
      ...config
    }
    this.config.x = this.config.x ?? this.getGameWidth() / 2 - this.config.width / 2
    this.config.y =
      this.config.y ?? this.getGameHeight() - (this.config.height + this.config.margin)
    this.open = false

    this.clickEvent()
  }

  private clickEvent(): void {
    this.plugin.scene.input.on(Phaser.Input.Events.POINTER_UP, () => {
      if (this.open) {
        if (this.animating) {
          this.showAllText()
        } else {
          this.closeDialog() // TODO: be able to go to next panel
        }
      }
    })
  }

  private getGameWidth(): number {
    return this.plugin.scene.scale.width
  }

  private getGameHeight(): number {
    return this.plugin.scene.scale.height
  }

  private createDialog(config: DialogConfig): void {
    if (this.frame) this.frame.destroy()
    this.open = true
    this.frame = this.plugin.scene.add.nineslice(
      config.x,
      config.y,
      config.frame,
      0,
      config.width,
      config.height,
      config.frameOffset,
      config.frameOffset,
      config.frameOffset,
      config.frameOffset
    )
    this.frame.setOrigin(0, 0)
  }

  private setText(text: string, config: DialogConfig): void {
    const x = config?.x + config?.padding
    const y = config?.y + config?.padding
    const style = {
      wordWrap: { width: config?.width - config?.padding * 2 },
      color: config?.textColor,
      font: config?.font,
      lineSpacing: config?.lineSpacing
    }
    if (this.text) {
      this.text.destroy()
    }
    this.text = this.plugin.scene.make.text({ x, y, text, style })
  }

  private setupAnimation(config: DialogConfig): void {
    const delay = 150 - config?.textSpeed * 30
    if (this.timerEvent) this.timerEvent.destroy()
    this.animating = true
    this.timerEvent = this.plugin.scene.time.delayedCall(delay, this.animeteText, [delay, 0], this)
  }

  private animeteText(delay: number, counter: number): void {
    this.text.setText(this.text.text + this.content[counter])
    if (counter < this.content.length - 1) {
      this.timerEvent = this.plugin.scene.time.delayedCall(
        delay,
        this.animeteText,
        [delay, counter + 1],
        this
      )
    } else {
      this.animating = false
    }
  }

  private showAllText(): void {
    this.timerEvent.destroy()
    this.text.setText(this.fullText)
    this.animating = false
  }

  private closeDialog(): void {
    if (this.text) this.text.destroy()
    if (this.frame) this.frame.destroy()
    if (this.timerEvent) this.timerEvent.destroy()
    this.open = false
    this.timerEvent = this.plugin.scene.time.delayedCall(
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
  destory(): any {
    this.shutdown()
    this.plugin = undefined
    if (this.text) this.text.destroy()
    if (this.frame) this.frame.destroy()
    if (this.timerEvent) this.timerEvent.destroy()
  }

  showDialog(text: string, newConfig: DialogConfig): void {
    EventEmitter.gameEvents.emit(EventEmitter.OPEN_DIALOG)

    const { animateText, ...config } = { ...this.config, ...newConfig }

    this.fullText = text
    if (animateText) {
      this.content = undefined
      this.content = text.split('')
    }
    this.createDialog(config)
    this.setText(animateText ? '' : text, config)
    if (animateText) this.setupAnimation(config)
  }
}
