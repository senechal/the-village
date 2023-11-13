import Phaser from 'phaser'
import logoImg from './assets/logo.png'

export class Game extends Phaser.Scene {
  preload (): void {
    this.load.image('logo', logoImg)
    this.load.image('background', 'assets/bg.jpg')
  }

  create (): void {
    this.add.image(400, 300, 'background')
    const logo = this.add.image(400, 150, 'logo')

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1
    })
  }
}
