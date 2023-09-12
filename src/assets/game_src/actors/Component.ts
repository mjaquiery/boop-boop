import {Actor, Engine, Sprite} from "excalibur";
import {ComponentImages} from "@/assets/game_src/utils/resources";
import Game from "@/assets/game_src/main";

export type ComponentType = 'eyes' | 'mouth';

export default class Component extends Actor {
  type: ComponentType;
  key: keyof ComponentImages;
  click_buffer_scale: number = 0.8;

  constructor(props: any) {
    if (!props.key) throw new Error('Component objects must have a key');
    if (!props.type) throw new Error('Component objects must have a type');

    const type = props.type;
    delete props.type;
    const key = props.key;
    delete props.key;

    const defaults = {
      x: 150,
      y: 150,
      width: 40,
      height: 60,
    }
    super({...defaults, ...props});
    this.type = type;
    this.key = key;
  }

  onInitialize() {
    const engine = this.scene.engine as Game;
    this.graphics.use(
        new Sprite({
          image: engine.skin.images[this.key],
          destSize: {
            width: this.width * this.click_buffer_scale,
            height: this.height * this.click_buffer_scale
          }
        })
    );
  }

  onPostUpdate(_engine: Engine, _delta: number) {
    super.onPostUpdate(_engine, _delta);
    if (this.pos.y > _engine.drawHeight) {
      this.kill();
    }
  }
}
