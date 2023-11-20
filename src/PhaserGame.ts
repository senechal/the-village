import Phaser from 'phaser'
import { GridEngine } from 'grid-engine'
import { Game, Preloader } from './scenes'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  // backgroundColor: '#f1f1f1',
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight
  },
  plugins: {
    scene: [
      {
        key: 'gridEngine',
        plugin: GridEngine,
        mapping: 'gridEngine'
      }
    ]
  },
  // width: 800,
  // height: 600,
  backgroundColor: '#000',
  physics: {
    default: 'arcade'
  },
  scene: [Preloader, Game]
}

export default new Phaser.Game(config)
