import type Phaser from 'phaser'

export const createDefaultAnims = (
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
