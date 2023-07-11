import {Actor, CollisionType, Color, Engine} from "excalibur";

export class Player extends Actor {
  constructor(game: Engine) {
    super({
      x: 150,
      y: game.drawHeight - 40,
      width: 200,
      height: 20,
      // Let's give it some color with one of the predefined
      // color constants
      color: Color.Chartreuse
    });
  }

  onInitialize() {
    this.body.collisionType = CollisionType.Fixed;
  }
}
