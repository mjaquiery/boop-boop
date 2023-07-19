import {Scene} from "excalibur";
import Game from "../main";

export default class Scoresheet extends Scene {
  declare engine: Game
  onActivate() {
    document.getElementById('excalibur-ui')!.classList.add('scoresheet')
    this.engine.update_wrapper()
  }
  onDeactivate() {
    document.getElementById('excalibur-ui')!.classList.remove('scoresheet')
  }
}
