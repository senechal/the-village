import Phaser from 'phaser'
import registry from './registry.json'

export class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload(): void {
    const { maps, characters } = registry
    for (const [key, value] of Object.entries(maps)) {
      this.load.image(`${key}-tiles`, value.tileset)
      this.load.tilemapTiledJSON(`${key}-map`, value.map)
      this.load.json(`${key}-map-config`, value.config)
    }

    for (const [key, value] of Object.entries(characters)) {
      this.load.atlas(key, value.texture, value.atlas)
      this.load.json(`${key}-char-config`, value.config)
    }
  }

  create(): void {
    this.scene.start('game')
  }
}
