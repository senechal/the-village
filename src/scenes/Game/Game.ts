import Phaser from 'phaser'
import tiles from './assets/tiles.png'

export class Game extends Phaser.Scene {
  constructor() {
    super('SceneMain')
  }

  preload(): void {
    this.load.image('tiles', tiles)
    this.load.tilemapTiledJSON('map', '/assets/tileMaps/map.json')
  }

  create(): void {
    const map = this.make.tilemap({
      key: 'map',
      tileWidth: 64,
      tileHeight: 32
    })
    const tileset = map.addTilesetImage('map', 'tiles')
    map.createLayer('field', tileset, window.innerWidth / 2 - 32, 0)
  }
}
