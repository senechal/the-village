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
  anim?: string
  initPos: {
    x: number
    y: number
  }
  side: string
  dialogs: string[]
  shop: string[]
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

interface CharRendeConfig {
  origin: [number, number]
  offset: [number, number]
  speed: number
  random: boolean | number
  anims: AnimsConfig[]
  hitArea?: [number, number, number, number]
  pin?: string
}

interface Directions {
  charId: string
  direction: string
}

interface ItemConfig {
  id: string
  name: string
  description: string
  spritesheet: string
  frame: number
  buy?: number
  sell?: number
  quantity?: number
}

interface PlayerState {
  body: number
  mind: number
  attack: number
  defence: number
  equipment: {
    head?: string
    body?: string
    rightHand?: string
    leftHand?: string
    legs?: string
  }
  inventory: {
    gold: number
    items: ItemConfig[]
  }
}

interface PlayerStateSetter {
  body?: number
  mind?: number
  attack?: number
  defence?: number
  equipment?: {
    head?: string
    body?: string
    rightHand?: string
    leftHand?: string
    legs?: string
  }
  inventory?: {
    gold?: number
    items?: ItemConfig[]
  }
}
