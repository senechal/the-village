import type Phaser from 'phaser'
import { Character } from '../Character'

export class Player extends Character {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)
    scene.physics.add.existing(this)
    this.scene.add.existing(this)
  }
}
