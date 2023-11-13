import Phaser from 'phaser'

import { Game } from './scenes'

const config: Phaser.Types.Core.GameConfig = {
  // type: Phaser.AUTO,
  // parent: 'phaser-container',
  // backgroundColor: '#282c34',
  // scale: {
  //   mode: Phaser.Scale.ScaleModes.RESIZE,
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // },
  // physics: {
  //   default: 'arcade',
  //   arcade: {
  //     gravity: { y: 0 },
  //     debug: true,
  //   },
  // },
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: [Game]
}

export default new Phaser.Game(config)
