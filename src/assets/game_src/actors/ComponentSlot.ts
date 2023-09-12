import {Actor, Color} from "excalibur";
import Component from "@/assets/game_src/actors/Component";

export default class ComponentSlot extends Actor {
  component: Component | null = null;

  constructor(props: any) {
    const defaults = {
      x: 150,
      y: 150,
      radius: 10,
      color: Color.Yellow,
      z: 100,
      opacity: 0.25
    }
    super({...defaults, ...props});
  }
}
