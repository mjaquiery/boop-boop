import {Scene} from "excalibur";
import Game, {UI_overlays} from "../main";

export default class Scoresheet extends Scene {
  declare engine: Game
  onActivate() {
    this.engine.last_game_score = this.engine.statistics.all
    this.engine.UI_overlay = UI_overlays.SCORESHEET
  }
  onDeactivate() {
    this.engine.UI_overlay = null
  }
}
