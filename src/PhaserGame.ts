import Phaser from 'phaser'

import { Game } from './scenes'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  // backgroundColor: '#f1f1f1',
  // scale: {
  //   mode: Phaser.Scale.ScaleModes.RESIZE,
  //   width: window.innerWidth,
  //   height: window.innerHeight
  // },
  width: 800,
  height: 600,
  backgroundColor: '#000',
  // physics: {
  //   default: 'arcade',
  //   arcade: {
  //     gravity: { y: 0 },
  //     debug: true,
  //   },
  // },
  scene: [Game]
}

export default new Phaser.Game(config)
