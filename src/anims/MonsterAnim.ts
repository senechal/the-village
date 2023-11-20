import type Phaser from 'phaser'
export const createMonsterAnims = (
  anims: Phaser.Animations.AnimationManager,
  monster: string
): void => {
  anims.create({
    key: `${monster}-idle-down-right`,
    frames: [
      {
        key: monster,
        frame: 'bottomright_1.png'
      }
    ]
  })

  anims.create({
    key: `${monster}-idle-down-left`,
    frames: [
      {
        key: monster,
        frame: 'bottomleft_1.png'
      }
    ]
  })

  anims.create({
    key: `${monster}-idle-up-right`,
    frames: [
      {
        key: monster,
        frame: 'topright_1.png'
      }
    ]
  })

  anims.create({
    key: `${monster}-idle-up-left`,
    frames: [
      {
        key: monster,
        frame: 'topleft_1.png'
      }
    ]
  })

  anims.create({
    key: `${monster}-down-right`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(monster, {
      start: 0,
      end: 7,
      prefix: 'bottomright_',
      suffix: '.png'
    })
  })

  anims.create({
    key: `${monster}-down-left`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(monster, {
      start: 0,
      end: 7,
      prefix: 'bottomleft_',
      suffix: '.png'
    })
  })

  anims.create({
    key: `${monster}-up-right`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(monster, {
      start: 0,
      end: 7,
      prefix: 'topright_',
      suffix: '.png'
    })
  })

  anims.create({
    key: `${monster}-up-left`,
    repeat: -1,
    frameRate: 10,
    frames: anims.generateFrameNames(monster, {
      start: 0,
      end: 7,
      prefix: 'topleft_',
      suffix: '.png'
    })
  })
}
