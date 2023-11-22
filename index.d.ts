declare module '*.png'

declare namespace Phaser {
  interface Scene {
    gridEngine: IGridEngine
    modal: DialogPlugin
    load: Record<string>
  }
}

interface DialogConfig {
  animateText?: boolean
  textColor?: string
  lineSpacing?: number
  font?: string
  frame?: string
  frameOffset?: number
  padding?: number
  margin?: number
  textSpeed?: number
  width?: number
  height?: number
  x?: number
  y?: number
}

interface PlayerCharacterConfig {
  id: string
  initPos: {
    x: number
    y: number
  }
}

interface CharactersConfig {
  id: string
  name: string
  initPos: {
    x: number
    y: number
  }
  side: string
  dialogs: string[]
}

interface MapConfig {
  playerCharacter: PlayerCharacterConfig
  npcs: CharactersConfig[]
  monsters: CharactersConfig[]
  animals: CharactersConfig[]
}

interface AnimsConfig {
  type: string
  size: number
  frameRate?: number
}

interface CharConfig {
  origin: [number, number]
  offset: [number, number]
  speed: number
  random: boolean | number
  anims: AnimsConfig[]
}

interface Directions {
  charId: string
  direction: string
}
