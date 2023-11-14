import Phaser from 'phaser'
import { assetsPath, maps } from './assets'
import join from 'url-join'

export class Game extends Phaser.Scene {
  constructor() {
    super('SceneMain')
  }

  preload(): void {
    this.load.image('tiles', join(assetsPath, maps.poc.tiles))
    this.load.tilemapTiledJSON('map', join(assetsPath, maps.poc.tileMap))
  }

  create(): void {
    const poc = this.make.tilemap({
      key: maps.poc.name,
      tileWidth: 64,
      tileHeight: 32
    })
    const tileset = poc.addTilesetImage('map', 'tiles')
    poc.createLayer(maps.poc.layers[0], tileset, window.innerWidth / 2 - 32, 0)
  }
}
