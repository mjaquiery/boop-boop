import {Actor, Sprite} from "excalibur";
import {PotatoImage} from "@/assets/game_src/utils/resources";
import Game from "@/assets/game_src/main";

export default class Potato extends Actor {
  key: keyof PotatoImage;

  constructor(props?: any) {
    if (!props || !props.key)
      throw new Error('Potato must be initialized with a key');
    const key = props.key;
    delete props.key;
    const defaults = {
      x: 300,
      y: 150,
      width: 100,
      height: 150,
    }
    super({...defaults, ...props});
    this.key = key;
  }

  onInitialize() {
    const engine = this.scene.engine as Game;
    this.graphics.use(
      new Sprite({
        image: engine.skin[this.key],
        destSize: {width: this.width, height: this.height}
      })
    );
  }
}
