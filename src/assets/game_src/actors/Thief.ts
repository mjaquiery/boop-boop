import {Actor, Animation, AnimationStrategy, range, SpriteSheet} from "excalibur";
import {IMAGE_TYPE} from "@/assets/game_src/utils/resources";
import Game from "@/assets/game_src/main";

export default class Thief extends Actor {
  duration: number;
  spriteSheet: SpriteSheet|null = null;
  needyAnimation: Animation|null = null;
  unneedyAnimation: Animation|null = null;

  click_buffer_scale: number = 0.8;

  constructor(props?: any) {
    const defaults = {
      x: 150,
      y: 150,
      width: 26,
      height: 34,
      duration: 1000,
      z: 10,
    }
    const duration = props?.duration;
    delete props.duration;
    super({...defaults, ...props});
    this.duration = duration || 1000;
  }

  makeUnneedyAnimation(duration: number = 1000) {
    if (this.spriteSheet === null)
      throw new Error('Thief spriteSheet is null when making unneedy animation');
    if (this.unneedyAnimation === null) {
      this.unneedyAnimation = Animation.fromSpriteSheet(
        this.spriteSheet,
        range(0, (this.needyAnimation?.currentFrameIndex || 0) + 1),
        duration / this.needyAnimation!.frames.length || 1,
        AnimationStrategy.Freeze
      )
      this.unneedyAnimation.frames.reverse()
    }
    return this.unneedyAnimation;
  }

  onInitialize() {
    const engine = this.scene.engine as Game;
    this.spriteSheet = SpriteSheet.fromImageSource({
    image: engine.get_random_image(IMAGE_TYPE.THIEF),
    grid: {
      rows: 2,
      columns: 3,
      spriteWidth: 100,
      spriteHeight: 100
    }
  });

    const sprite = this.spriteSheet.getSprite(0, 0);
    if (sprite) {
      this.spriteSheet.sprites.forEach(
        (sprite) => sprite.destSize = {
          width: this.width * this.click_buffer_scale,
          height: this.height * this.click_buffer_scale
        }
      );
      this.graphics.use(sprite)
    }
    this.needyAnimation = Animation.fromSpriteSheet(
      this.spriteSheet,
      range(1, 5),
      this.duration / 5,
      AnimationStrategy.Freeze
    );
    // this.needyAnimation.scale = vec(this.spriteSheet.grid.spriteWidth / this.width, this.spriteSheet.grid.spriteHeight / this.height);
  }
}
