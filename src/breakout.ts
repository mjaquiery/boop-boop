import {Actor, CollisionType, Color} from "excalibur";

export const ball = new Actor({
  x: 100,
  y: 300,
  // Use a circle collider with radius 10
  radius: 10,
  // Set the color
  color: Color.Red,
});

// Padding between bricks
const padding = 20; // px
const xoffset = 65; // x-offset
const yoffset = 20; // y-offset
const columns = 5;
const rows = 3;

const brickColor = [Color.Violet, Color.Orange, Color.Yellow];

// Individual brick width with padding factored in
export const get_bricks = (game) => {
  const brickWidth = game.drawWidth / columns - padding - padding / columns; // px
  const brickHeight = 30; // px
  const bricks: Actor[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      bricks.push(
        new Actor({
          x: xoffset + i * (brickWidth + padding) + padding,
          y: yoffset + j * (brickHeight + padding) + padding,
          width: brickWidth,
          height: brickHeight,
          color: brickColor[j % brickColor.length],
        })
      );
    }
  }
  bricks.forEach(b => b.body.collisionType = CollisionType.Active)
  return bricks;
}

import {CollisionType, Engine, Loader, vec} from "excalibur";
import { Player } from "./player";
import {ball, get_bricks} from "./breakout";
import { Resources } from "./resources";

class Game extends Engine {
  constructor() {
    super({width: 800, height: 600});
  }
  initialize() {

    const player = new Player(this);
    this.add(player);
    this.input.pointers.primary.on("move", (evt) => {
      player.pos.x = evt.worldPos.x;
    });

    this.add(ball);
    const ballSpeed = vec(150, 150);
    setTimeout(() => {
      // Set the velocity in pixels per second
      ball.vel = ballSpeed;
    }, 1000);
    ball.body.collisionType = CollisionType.Passive;

    ball.on("postupdate", () => {
      // If the ball collides with the left side
      // of the screen reverse the x velocity
      if (ball.pos.x < ball.width / 2) {
        ball.vel.x *= -1;
      }

      // If the ball collides with the right side
      // of the screen reverse the x velocity
      if (ball.pos.x + ball.width / 2 > game.drawWidth) {
        ball.vel.x *= -1;
      }

      // If the ball collides with the top
      // of the screen reverse the y velocity
      if (ball.pos.y < ball.height / 2) {
        ball.vel.y *= -1;
      }
    });

    const bricks = get_bricks(this);
    bricks.forEach(b => this.add(b));

    // On collision remove the brick, bounce the ball
    let colliding = false;
    ball.on("collisionstart", function (ev) {
      if (bricks.indexOf(ev.other) > -1) {
        // kill removes an actor from the current scene
        // therefore it will no longer be drawn or updated
        ev.other.kill();
      }

      // reverse course after any collision
      // intersections are the direction body A has to move to not be clipping body B
      // `ev.content.mtv` "minimum translation vector" is a vector `normalize()` will make the length of it 1
      // `negate()` flips the direction of the vector
      let intersection = ev.contact.mtv.normalize();

      // Only reverse direction when the collision starts
      // Object could be colliding for multiple frames
      if (!colliding) {
        colliding = true;
        // The largest component of intersection is our axis to flip
        if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
          ball.vel.x *= -1.2;
        } else {
          ball.vel.y *= -1.2;
        }
      }
    });

    ball.on("collisionend", () => {
      // ball has separated from whatever object it was colliding with
      colliding = false;
    });

    // Loss condition
    ball.on("exitviewport", () => {
      alert("You lose!");
    });

    const loader = new Loader([Resources.Sword]);
    this.start(loader);
  }
}

export const game = new Game();
// game.initialize();