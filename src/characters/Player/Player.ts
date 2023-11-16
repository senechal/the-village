const directions: Direction = {
  topleft: { offset: 0, x: -2, y: -1, opposite: 'bottomright' },
  topright: { offset: 11, x: 2, y: -1, opposite: 'bottomleft' },
  bottomright: { offset: 22, x: 2, y: 1, opposite: 'topleft' },
  bottomleft: { offset: 33, x: -2, y: 1, opposite: 'topright' }
}

const anims: Anim = {
  idle: {
    startFrame: 0,
    endFrame: 1,
    speed: 0.2
  },
  walk: {
    startFrame: 0,
    endFrame: 10,
    speed: 0.06
  }
}

export class Player extends Phaser.GameObjects.Image {
  Scene: Phaser.Scene
  startX: number
  startY: number
  distance: number
  motion: string
  anim: AnimRecord
  direction: DirectionRecord
  speed: number
  f: number
  depth: number

  constructor(
    scene: any,
    name: string,
    x: number,
    y: number,
    motion: string,
    direction: string,
    distance: number
  ) {
    super(scene, x, y, name, directions[direction].offset)

    this.scene = scene
    this.startX = x
    this.startY = y
    this.distance = distance

    this.motion = motion
    this.anim = anims[motion]
    this.direction = directions[direction]
    this.speed = 0.5
    this.f = this.anim.startFrame

    this.depth = y + 256

    scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this)
  }

  changeFrame(): void {
    this.f++

    let delay = this.anim.speed
    if (this.f === this.anim.endFrame) {
      switch (this.motion) {
        case 'walk':
          this.f = this.anim.startFrame
          this.frame = this.texture.get(this.direction.offset + this.f)
          this.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this)
          break

        case 'idle':
          delay = 0.5 + Math.random()
          this.scene.time.delayedCall(
            delay * 1000,
            this.resetAnimation,
            [],
            this
          )
          break
      }
    } else {
      this.frame = this.texture.get(this.direction.offset + this.f)

      this.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this)
    }
  }

  resetAnimation(): void {
    this.f = this.anim.startFrame

    this.frame = this.texture.get(this.direction.offset + this.f)

    this.scene.time.delayedCall(
      this.anim.speed * 1000,
      this.changeFrame,
      [],
      this
    )
  }

  update(): void {
    if (this.motion === 'walk') {
      this.x += this.direction.x * this.speed

      if (this.direction.y !== 0) {
        this.y += this.direction.y * this.speed
        this.depth = this.y + 256
      }

      //  Walked far enough?
      if (
        Phaser.Math.Distance.Between(
          this.startX,
          this.startY,
          this.x,
          this.y
        ) >= this.distance
      ) {
        this.direction = directions[this.direction.opposite]
        this.f = this.anim.startFrame
        this.frame = this.texture.get(this.direction.offset + this.f)
        this.startX = this.x
        this.startY = this.y
      }
    }
  }
}
