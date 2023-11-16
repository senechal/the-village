declare module '*.png'

interface Window {
  fx: any
}

interface MapAsset {
  config: {
    playerCharacter: {
      initPos: {
        x: number
        y: number
      }
    }
  }
  tileset: string
}

interface SpriteAsset {
  config: Record<string, unknown>
  sprite: {
    directions: Record<string, { offset: numbe, size: number }>
    animations: [
      {
        name: string
        startFrame: number
        endframe: number
        speed: number
      }
    ]
  }
  spritesheet: string
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

interface DirectionRecord {
  offset: number
  x: number
  y: number
  opposite: string
}

type Direction = Record<string, DirectionRecord>
