import Phaser from 'phaser'
import { type GridEngineConfig } from 'grid-engine'
import { createAnims } from '../../anims'
import { Monster } from '../../entities/Monster'
import { Player } from '../../entities/Player'
import { type Character } from '../../entities/Character'
import { toIso, toOrth } from '../../utils/transforms'

export class Game extends Phaser.Scene {
  private player: Character
  private groundLayer!: Phaser.Tilemaps.TilemapLayer
  private currentMap: string
  private pin: Phaser.GameObjects.Ellipse
  private targetPos: string

  constructor() {
    super('game')
  }

  create(): void {
    createAnims(this.anims, 'adventurer')
    createAnims(this.anims, 'skeleton')

    const monsters = this.physics.add.group({
      classType: Monster
    })

    const gridEngineConfig: GridEngineConfig = {
      characters: []
    }

    const village = this.renderMap('village', 'grass', ['field'], 'field')

    this.gridEngine.create(village, gridEngineConfig)

    monsters.get(1, 0, 'skeleton')
    this.player = new Player(this, 5, 5, 'adventurer')

    this.initCamera()
    this.initMouseEvents()
  }

  update(time: number, delta: number): void {
    const isMoving = this.gridEngine.isMoving(this.player.getId())

    const [xx, yy] = toOrth(this.player.x / 32, this.player.y / 32)

    const same = `${xx - 1.5},${yy - 0.5}` === this.targetPos
    if (this.pin && !isMoving && same) {
      this.pin.destroy()
      this.pin = null
      this.targetPos = null
    }
  }

  renderMap(
    map: string,
    tileset: string,
    layers: string[],
    ground: string
  ): Phaser.Tilemaps.Tilemap {
    this.currentMap = map
    const tilemap = this.make.tilemap({
      key: `${map}-map`,
      tileWidth: 32,
      tileHeight: 64
    })

    const tilesetImage = tilemap.addTilesetImage(tileset, `${map}-tiles`)
    layers.forEach(layer => {
      if (layer === ground) {
        this.groundLayer = tilemap.createLayer(layer, tilesetImage, 0, -8)
      } else {
        tilemap.createLayer(layer, tilesetImage, 0, -8)
      }
    })

    return tilemap
  }

  initCamera(): void {
    this.cameras.main.setZoom(1.5)
    this.cameras.main.startFollow(this.player, true)
    this.cameras.main.setFollowOffset(-this.player.width, -this.player.height)
  }

  initMouseEvents(): void {
    this.input.on(
      Phaser.Input.Events.POINTER_UP,
      (pointer: Phaser.Input.Pointer) => {
        const { worldX, worldY } = pointer
        const target = this.groundLayer.worldToTileXY(worldX, worldY)

        const x = Math.round(target.x)
        const y = Math.round(target.y)
        this.targetPos = `${x},${y}`
        this.gridEngine.moveTo(this.player.getId(), { x, y })
        const [xx, yy] = toIso(x * 32, y * 32)

        if (this.groundLayer.hasTileAtWorldXY(worldX, worldY + 12)) {
          this.pin = this.add.ellipse(xx, yy - 4, 16, 8, 0x6666ff, 0.5)
          this.tweens.add({
            targets: this.pin,
            scaleX: 0.6,
            scaleY: 0.6,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 1
          })
        }
      }
    )

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off(Phaser.Input.Events.POINTER_UP)
      this.input.off(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE)
    })
  }
}
