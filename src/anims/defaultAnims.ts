import type Phaser from 'phaser'

export const createDefaultAnimsv2 = (
  anims: Phaser.Animations.AnimationManager,
  character: string,
  list: AnimsConfig[],
  side: string[] = ['left', 'right']
): void => {
  list.forEach(({ type, size, frameRate }) => {
    side.forEach(side => {
      if (type === 'walk') {
        anims.create({
          key: `${character}-${type}-up-${side}`,
          repeat: -1,
          frameRate: frameRate || 10,
          frames: anims.generateFrameNames(character, {
            start: 0,
            end: size - 1,
            prefix: `${type}_${side}_`,
            suffix: '.png'
          })
        })
        anims.create({
          key: `${character}-${type}-down-${side}`,
          repeat: -1,
          frameRate: frameRate || 10,
          frames: anims.generateFrameNames(character, {
            start: 0,
            end: size - 1,
            prefix: `${type}_${side}_`,
            suffix: '.png'
          })
        })
      } else {
        anims.create({
          key: `${character}-${type}-${side}`,
          repeat: -1,
          frameRate: frameRate || 10,
          frames: anims.generateFrameNames(character, {
            start: 0,
            end: size - 1,
            prefix: `${type}_${side}_`,
            suffix: '.png'
          })
        })
      }
    })
  })
}
export const createDefaultAnims = (
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
    key: `${character}-walk-up-right`,
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
    key: `${character}-walk-down-right`,
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
    key: `${character}-walk-up-left`,
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
    key: `${character}-walk-down-left`,
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
