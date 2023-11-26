// import Phaser from 'phaser'
import { type ModalPlugin } from './ModalPlugin'

export class BaseDialog {
  plugin: ModalPlugin
  readonly config: DialogConfig

  constructor(plugin: ModalPlugin, config: DialogConfig) {
    this.plugin = plugin
    this.config = {
      textColor: '#cc613d',
      frame: 'frame',
      frameOffset: 32,
      lineSpacing: 8,
      font: '16px monospace',
      padding: 16,
      margin: 32,
      animateText: true,
      textSpeed: 3,
      width: 738,
      height: 160,
      ...config
    }
    this.config.x = this.config.x ?? this.getGameWidth() / 2 - this.config.width / 2
    this.config.y =
      this.config.y ?? this.getGameHeight() - (this.config.height + this.config.margin)
  }

  getGameWidth(): number {
    return this.plugin.scene.scale.width
  }

  getGameHeight(): number {
    return this.plugin.scene.scale.height
  }

  createDialog(config: DialogConfig): Phaser.GameObjects.NineSlice {
    const frame = this.plugin.scene.add.nineslice(
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
    frame.setOrigin(0, 0)
    return frame
  }

  createNextIcon(config: DialogConfig): Phaser.GameObjects.Sprite {
    return this.plugin.scene.add
      .sprite(
        config.x + config?.width - config?.padding * 2,
        config.y + config?.height - config?.padding,
        'dialog-extras',
        0
      )
      .setScale(2)
  }
}
