import {Scene, Timer} from "excalibur";
import Game, {level_names, UI_overlays} from "@/assets/game_src/main";

export type SplashscreenProps = {
  duration?: number;
}

export default class Splashscreen extends Scene {
  declare engine: Game;
  duration: number = 2000;

  constructor(props?: SplashscreenProps) {
    super();
    if (props?.duration) this.duration = props.duration;
  }

  onActivate() {
    this.engine.UI_overlay = UI_overlays.SPLASHSCREEN

    const timer = new Timer({
      interval: this.duration,
      fcn: () => {
        this.engine.loadPotatoMatching();
      }
    })
    this.add(timer);
    timer.start();
  }

  onDeactivate() {
    this.engine.UI_overlay = null
  }
}
