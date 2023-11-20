import type Phaser from 'phaser'

export const createAnims = (
  anims: Phaser.Animations.AnimationManager,
  character: string
): void => {
  anims.create({
    key: `${character}-idle-right`,
    frames: [
      {
        key: character,
        frame: 'right_0.png'
      }
    ]
  })

  anims.create({
    key: `${character}-idle-left`,
    frames: [
      {
        key: character,
        frame: 'left_0.png'
      }
    ]
  })

  anims.create({
    key: `${character}-up-right`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(character, {
      start: 0,
      end: 8,
      prefix: 'right_',
      suffix: '.png'
    })
  })

  anims.create({
    key: `${character}-down-right`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(character, {
      start: 0,
      end: 8,
      prefix: 'right_',
      suffix: '.png'
    })
  })

  anims.create({
    key: `${character}-up-left`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(character, {
      start: 0,
      end: 8,
      prefix: 'left_',
      suffix: '.png'
    })
  })

  anims.create({
    key: `${character}-down-left`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(character, {
      start: 0,
      end: 8,
      prefix: 'left_',
      suffix: '.png'
    })
  })
}
