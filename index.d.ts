declare module '*.png'

declare namespace Phaser {
  interface Scene {
    gridEngine: IGridEngine
  }
}

interface MapConfig {
  playerCharacter: {
    initPos: {
      x: number
      y: number
    }
  }
}

interface CharConfig {
  origin: [number, number]
  offset: [number, number]
  speed: number
  random: boolean | number
}

interface GameAssets {
  maps: Record<string, MapAsset>
  sprites: Record<string>
}

interface AnimRecord {
  startFrame: number
  endFrame: number
  speed: number
}

type Anim = Record<string, AnimRecord>

interface Directions {
  charId: string
  direction: string
}
