import type Phaser from 'phaser'

export const createPlayerAnims = (
  anims: Phaser.Animations.AnimationManager,
  character: string
): void => {
  anims.create({
    key: `${character}-idle-bottomright`,
    frames: [
      {
        key: character,
        frame: 'bottomright_22.png'
      }
    ]
  })

  anims.create({
    key: `${character}-idle-bottomleft`,
    frames: [
      {
        key: character,
        frame: 'bottomleft_33.png'
      }
    ]
  })

  anims.create({
    key: `${character}-idle-topright`,
    frames: [
      {
        key: character,
        frame: 'topright_11.png'
      }
    ]
  })

  anims.create({
    key: `${character}-idle-topleft`,
    frames: [
      {
        key: character,
        frame: 'topleft_0.png'
      }
    ]
  })

  anims.create({
    key: `${character}-walk-bottomright`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(character, {
      start: 22,
      end: 32,
      prefix: 'bottomright_',
      suffix: '.png'
    })
  })

  anims.create({
    key: `${character}-walk-bottomleft`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(character, {
      start: 33,
      end: 43,
      prefix: 'bottomleft_',
      suffix: '.png'
    })
  })

  anims.create({
    key: `${character}-walk-topright`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(character, {
      start: 11,
      end: 21,
      prefix: 'topright_',
      suffix: '.png'
    })
  })

  anims.create({
    key: `${character}-walk-topleft`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(character, {
      start: 0,
      end: 10,
      prefix: 'topleft_',
      suffix: '.png'
    })
  })
}
