import Phaser from 'phaser'
import { GridEngine } from 'grid-engine'

import { ModalPlugin } from './plugins'
import { Game, Preloader, UI } from './scenes'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  parent: 'phaser-container',
  pixelArt: true,
  backgroundColor: '#f1f1f1',
  // scale: {
  //   mode: Phaser.Scale.ScaleModes.RESIZE,
  //   width: window.innerWidth,
  //   height: window.innerHeight
  // },
  plugins: {
    scene: [
      {
        key: 'ModalPlugin',
        plugin: ModalPlugin,
        mapping: 'modal',
        start: false
      },
      {
        key: 'gridEngine',
        plugin: GridEngine,
        mapping: 'gridEngine'
      }
    ]
  },
  width: 800,
  height: 608,
  // backgroundColor: '#000',
  physics: {
    default: 'arcade'
  },
  dom: {
    createContainer: true
  },
  scene: [Preloader, Game, UI]
}

export default new Phaser.Game(config)
