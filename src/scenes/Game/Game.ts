import Phaser from 'phaser'
import { Player } from '../../characters/Player'
import { maps, sprites } from './assets'

export class Game extends Phaser.Scene {
  assets: GameAssets
  player: any
  gridSize: number
  currentMap: MapAsset
  controls: Phaser.Cameras.Controls.SmoothedKeyControl

  constructor() {
    super('SceneMain')

    this.gridSize = 32

    this.assets = {
      maps: {},
      sprites: {}
    }
  }

  preload(): void {
    this.loadAssets()
  }

  sqrToIso(x: number, y: number): [number, number] {
    const tX = x * this.gridSize
    const tY = y * this.gridSize
    return [tX - tY, (tY + tX) / 2]
  }

  isoToSqr(x: number, y: number): [number, number] {
    return [(2 * y + x) / 2, (2 * y - x) / 2]
  }

  create(): void {
    this.renderMap('poc', 'grass', 'field')
    this.addPlayer('knight')
    this.initCamera()
  }

  update(time: number, delta: number): void {
    this.player.update()
    this.controls.update(delta)
  }

  loadAssets(): void {
    for (const [key, value] of Object.entries(maps)) {
      this.assets.maps[key] = value
      this.load.image(`${key}-tiles`, value.tileset)
      this.load.tilemapTiledJSON(key, `/assets/maps/${key}/map.json`)
    }

    for (const [key, value] of Object.entries(sprites)) {
      this.assets.sprites[key] = value
      this.load.spritesheet('knight', value.spritesheet, {
        frameWidth: 256,
        frameHeight: 256
      })
    }
  }

  renderMap(map: string, tileset: string, layer: string): void {
    this.currentMap = this.assets.maps[map]
    const tilemap = this.make.tilemap({
      key: map,
      tileWidth: 64,
      tileHeight: 32
    })
    const tilesetImage = tilemap.addTilesetImage(tileset, `${map}-tiles`)
    tilemap.createLayer(layer, tilesetImage, 0, 0)
  }

  addPlayer(sprite: string): void {
    const { playerCharacter } = this.currentMap.config
    const {
      initPos: { x: sqrX, y: sqrY }
    } = playerCharacter
    const [xIso, yIso] = this.sqrToIso(sqrX, sqrY)

    const player = new Player(
      this,
      'knight',
      xIso,
      yIso,
      'walk',
      'topright',
      7 * this.gridSize + this.gridSize / 2
    ).setOrigin(0, 0)
    this.player = this.add.existing(player).setScale(0.25)
  }

  initCamera(): void {
    const cursors = this.input.keyboard.createCursorKeys()

    this.cameras.main.setZoom(1.5)
    this.cameras.main.setBounds(-400, 0, 800, 0)
    this.cameras.main.centerOn(32, 0)

    const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      acceleration: 0.04,
      drag: 0.0005,
      maxSpeed: 0.7
    }

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(
      controlConfig
    )
  }

  renderGrid(): void {
    this.add
      .grid(0, 0, 800, 600, 256, 256)
      .setAltFillStyle()
      .setOutlineStyle(0x000000)
      .setOrigin(0, 0)
  }
}
