import {Engine, Loader} from "excalibur";
import Level_01 from "./level_01";
import {Resources} from "./resources";

export class Game extends Engine {
  constructor() {
    super({width: 800, height: 600});
  }
  initialize() {
    const loader = new Loader();
    for (const resource in Resources) {
      loader.addResource(Resources[resource]);
    }
    this.add('level_01', new Level_01())
    this.start(loader)
      .then(() => this.goToScene('level_01'))
  }
}
const game = new Game();
game.initialize();