import {
  Color,
  Font,
  FontUnit,
  Label,
  Scene,
  TextAlign,
  Timer,
  vec,
} from "excalibur";
import Game, {level_names} from "@/assets/game_src/main";

export type SplashscreenProps = {
  duration?: number;
}

export default class Splashscreen extends Scene {
  declare engine: Game;
  duration: number = 2000;
  text: Label|null = null;

  constructor(props?: SplashscreenProps) {
    super();
    if (props?.duration) this.duration = props.duration;
  }

  clean() {
    this.text?.kill()
    this.text = null;
  }

  onActivate() {
    this.text = new Label({
      text: `Level ${this.engine.difficulty_level + 1}`,
      pos: vec(this.engine.drawWidth / 2, this.engine.drawHeight / 2),
      color: Color.White,
      font: new Font({
        size: 48,
        unit: FontUnit.Px,
        family: "sans-serif",
        textAlign: TextAlign.Center,
      }),
    })
    this.add(this.text);
    const timer = new Timer({
      interval: this.duration,
      fcn: () => {
        this.engine.goToScene(level_names.POTATO_MATCHING);
      }
    })
    this.add(timer);
    timer.start();
  }

  onDeactivate() {
    this.clean();
  }
}
