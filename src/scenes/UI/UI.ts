import Phaser from 'phaser'
import { gameEvents, TEXT_DIALOG } from '../../Utils/EventEmitter'

export class UI extends Phaser.Scene {
  constructor() {
    super('UI')
  }

  create(): void {
    this.modal.create({}, this)

    gameEvents.on(TEXT_DIALOG, (dialogs: string[]) => {
      console.log(dialogs)
      this.modal.showDialog(dialogs[0])
    })
  }
}
