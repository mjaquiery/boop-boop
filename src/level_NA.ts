import {CollisionType, Scene} from "excalibur";
import {GremlinFactory} from "./actors";

export default class Level_NA extends Scene {
  constructor() {
    super();
  }

  onInitialize() {
    const gremlin_count = 10;
    for (let i = 0; i < gremlin_count; i++) {
      const x = Math.random() * (this.engine.drawWidth * .8) + this.engine.drawWidth * .1;
      const y = Math.random() * (this.engine.drawHeight * .8) + this.engine.drawHeight * .1;
      const gremlin = GremlinFactory({x, y});
      gremlin.body.collisionType = CollisionType.Active;
      this.add(gremlin);
    }
  }
}
