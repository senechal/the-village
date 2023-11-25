/* eslint-disable @typescript-eslint/member-delimiter-style */
import Phaser from 'phaser'
import { type GridEngineConfig } from 'grid-engine'
import * as lockr from 'lockr'
import { createDefaultAnims, createDefaultAnimsv2 } from '../../anims'
import { Monster } from '../../entities/Monster'
import { Player } from '../../entities/Player'
import { NPC } from '../../entities/NPC'
import { type Character } from '../../entities/Character'
import { GAME_LOCAL_STORAGE } from '../typedef'

export class Game extends Phaser.Scene {
  private player: Character
  private groundLayer: Phaser.Tilemaps.TilemapLayer
  private monsters: Phaser.Physics.Arcade.Group
  private npcs: Phaser.Physics.Arcade.Group

  constructor() {
    super('game')
  }

  init(): void {
    window.addEventListener('beforeunload', e => {
      this.shutdown()
    })
  }

  shutdown(): void {
    console.log('here')
    const { x, y } = this.gridEngine.getPosition(this.getPlayerId())
    lockr.set(GAME_LOCAL_STORAGE, { x, y })
  }

  private renderMap(
    map: string,
    tileset: string,
    layers: string[],
    ground: string
  ): Phaser.Tilemaps.Tilemap {
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

  private initCamera(): void {
    this.cameras.main.setZoom(1.5)
    this.cameras.main.startFollow(this.player, true)
  }

  private initMap(name: string): void {
    const { id, tileset, layers, groundLayer, playerCharacter, npcs, monsters, animals } =
      this.cache.json.get(`${name}-map-config`)
    const gridEngineConfig: GridEngineConfig = {
      characters: []
    }

    const tilemap = this.renderMap(id, tileset, layers, groundLayer)
    this.gridEngine.create(tilemap, gridEngineConfig)

    this.initPlayer(playerCharacter)
    this.initNpcs(npcs)
    this.initMonsters(monsters)
    this.initAnimals(animals)
  }

  private initPlayer({ id, initPos }: PlayerCharacterConfig): void {
    const pos = lockr.get(GAME_LOCAL_STORAGE)
    createDefaultAnims(this.anims, id) // TODO: change texture and atlas to use v2
    this.player = new Player(this, pos?.x || initPos.x, pos?.y || initPos.y, id)
  }

  private initNpcs(npcs: CharactersConfig[]): void {
    this.npcs = this.physics.add.group({
      classType: NPC
    })
    npcs.forEach(({ id, name, initPos, dialogs, side, shop }) => {
      this.createAnims(id)
      this.npcs
        .get(initPos.x, initPos.y, id)
        .setAnim('idle', side)
        .setCharcterName(name)
        .setDialogs(dialogs)
        .setShop(shop)
    })
  }

  private initMonsters(monsters: CharactersConfig[]): void {
    this.monsters = this.physics.add.group({
      classType: Monster
    })
    monsters.forEach(({ id, name, initPos, side }) => {
      this.createAnims(id)
      this.monsters.get(initPos.x, initPos.y, id).setAnim('idle', side).setCharcterName(name)
    })
  }

  private initAnimals(animals: any): void {}

  private createAnims(character: string): void {
    const { anims } = this.cache.json.get(`${character}-char-config`)
    createDefaultAnimsv2(this.anims, character, anims)
  }

  getplayer(): Character {
    return this.player
  }

  getPlayerId(): string {
    return this.player.getId()
  }

  getPlayerDirection(): string {
    const splited = this.player.anims.currentAnim.key.split('-')
    return splited.pop()
  }

  getGroundLayer(): Phaser.Tilemaps.TilemapLayer {
    return this.groundLayer
  }

  create(): void {
    // this.input.setDefaultCursor('pointer')
    this.initMap('village')
    this.initCamera()
  }
}
