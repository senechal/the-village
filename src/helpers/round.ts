import Phaser from 'phaser'
export const round = (pos: Phaser.Math.Vector2): Phaser.Math.Vector2 => {
  return new Phaser.Math.Vector2(Math.round(pos.x), Math.round(pos.y))
}
