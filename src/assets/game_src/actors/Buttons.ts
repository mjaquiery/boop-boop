import {ActorArgs, ImageSource, ScreenElement, Sprite} from 'excalibur'

type CallbackDefinition = {event_name: string, callback: () => void}

type ButtonProps = ActorArgs & {
      idle_img: ImageSource;
      hover_img: ImageSource,
      callbacks: CallbackDefinition[]
}

export const BUTTON_HEIGHT = 50
export const BUTTON_WIDTH = 200

export default class Button extends ScreenElement {
  idle_img: ImageSource
  hover_img: ImageSource
  callbacks: CallbackDefinition[]

  constructor(props: ButtonProps) {
    const defaults = {
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
    }
    const idle = props.idle_img
    const hover = props.hover_img
    const callbacks = props.callbacks

    const args: Partial<ButtonProps> = {...defaults, ...props}
    delete args.idle_img
    delete args.hover_img
    delete args.callbacks

    super(args)

    this.idle_img = idle
    this.hover_img = hover
    this.callbacks = callbacks
  }

  onInitialize() {
    const idle_sprite = new Sprite({
      image: this.idle_img,
      destSize: {height: this.height, width: this.width}
    })
    const hover_sprite = new Sprite({
      image: this.hover_img,
      destSize: {height: this.height, width: this.width}
    })
    this.graphics.add('idle', idle_sprite)
    this.graphics.add('hover', hover_sprite)
    this.graphics.show('idle')

    for (const callback of this.callbacks) {
      this.on(callback.event_name, callback.callback)
    }

    this.on('pointerenter', () => {
      this.graphics.show('hover')
    })

    this.on('pointerleave', () => {
      this.graphics.show('idle')
    })
  }

  onDeactivate() {
    for (const callback of this.callbacks) {
      this.off(callback.event_name)
    }
    this.off('pointerenter')
    this.off('pointerleave')
  }
}
