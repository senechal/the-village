import Phaser from 'phaser'
import registry from './registry.json'

export class Preloader extends Phaser.Scene {
  private progressBar: Phaser.GameObjects.Graphics
  private progressBox: Phaser.GameObjects.Graphics
  private loadingText: Phaser.GameObjects.Text
  private percentText: Phaser.GameObjects.Text
  private assetText: Phaser.GameObjects.Text
  constructor() {
    super('preloader')
  }

  preload(): void {
    this.createProgressBar()
    this.eventListeners()

    const { maps, characters, graphics } = registry
    for (const [key, value] of Object.entries(maps)) {
      this.load.image(`${key}-tiles`, value.tileset)
      this.load.tilemapTiledJSON(`${key}-map`, value.map)
      this.load.json(`${key}-map-config`, value.config)
    }

    for (const [key, value] of Object.entries(characters)) {
      this.load.atlas(key, value.texture, value.atlas)
      this.load.json(`${key}-char-config`, value.config)
    }
    for (const { name, src, type, args } of graphics) {
      this.load?.[type](name, src, args)
    }
  }

  create(): void {
    this.scene.start('game')
    this.scene.start('UI')
  }

  private createProgressBar(): void {
    const { width, height } = this.cameras.main
    this.progressBar = this.add.graphics()
    this.progressBox = this.add.graphics()
    this.progressBox.fillStyle(0x222222, 0.8)
    this.progressBox.fillRect(width / 2 - 160, height / 2, 320, 50) // 240, 270

    this.loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 20,
      text: 'Loading...',
      style: {
        font: '20px monospace'
      }
    })
    this.loadingText.setOrigin(0.5, 0.5)

    this.percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 25,
      text: '0%',
      style: {
        font: '18px monospace'
      }
    })
    this.percentText.setOrigin(0.5, 0.5)

    this.assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 75,
      text: '',
      style: {
        font: '18px monospace'
      }
    })
    this.assetText.setOrigin(0.5, 0.5)
  }

  private eventListeners(): void {
    this.load.on('progress', (value: number): void => {
      const { width, height } = this.cameras.main
      this.progressBar.clear()
      this.progressBar.fillStyle(0xffffff, 1)
      this.progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 30)
      this.percentText.setText(`${100 * value}%`)
    })

    this.load.on('fileprogress', ({ src }: { src: string }): void => {
      this.assetText.setText('Loading asset: ' + src)
    })
    this.load.on('complete', () => {
      this.progressBar.destroy()
      this.progressBox.destroy()
      this.loadingText.destroy()
      this.percentText.destroy()
      this.assetText.destroy()
    })
  }
}
