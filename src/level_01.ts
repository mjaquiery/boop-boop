import {Actor, CollisionType, Scene, vec, Vector} from "excalibur";
import {Component, type ComponentType, Eyes, Mouth, Potato} from "./actors";
import {random_resource_key_by_type} from "./resources";
import {Game} from "./main";

type Face = {
  eyes: string;
  mouth: string;
  hair?: string;
  nose?: string;
  ears?: string;
  glasses?: string;
  mustache?: string;
}

const target_scale = 0.5;
const potato_size = {width: 150, height: 200};

const offsets: {[type in ComponentType]: Vector} = {
  eyes: vec(0, -20),
  mouth: vec(0, 40),
}

const max_components = 20;
const component_spawn_delay = 500;

export default class Level_01 extends Scene {
  declare engine: Game;
  target_face: Face | null = null;
  target_face_components: Actor[] = [];
  current_face_components: Partial<{ [type in ComponentType]: Component }> = {};
  potato: Potato | null = null;
  max_components = max_components;
  components: Component[] = [];
  selected_component: Component | null = null;
  component_spawn_delay = component_spawn_delay;

  constructor() {
    super();
  }

  onActivate() {
    this.createTarget();

    const potato = new Potato({
      x: this.engine.halfDrawWidth, y: this.engine.halfDrawHeight,
      width: potato_size.width, height: potato_size.height,
    });
    this.add(potato)
    this.potato = potato;

    this.engine.clock.schedule(this.spawnComponent.bind(this), this.component_spawn_delay);
  }

  createTarget() {
    this.target_face = {
      eyes: random_resource_key_by_type('eyes'),
      mouth: random_resource_key_by_type('mouth'),
      hair: Math.random() < .2? random_resource_key_by_type('hair') : undefined,
      nose: Math.random() < .2? random_resource_key_by_type('nose') : undefined,
      ears: Math.random() < .2? random_resource_key_by_type('ears') : undefined,
      glasses: Math.random() < .2? random_resource_key_by_type('glasses') : undefined,
      mustache: Math.random() < .2? random_resource_key_by_type('mustache') : undefined,
    }

    // Create the target
    const target = new Potato({
      x: this.engine.halfDrawWidth,
      width: potato_size.width * target_scale,
      height: potato_size.height * target_scale,
    });
    target.pos = vec(this.engine.halfDrawWidth, potato_size.height * target_scale);
    this.add(target);
    this.target_face_components.push(target);
    if ('eyes' in this.target_face) {
      const component = new Eyes({
        x: target.center.x + offsets.eyes.x * target_scale,
        y: target.center.y + offsets.eyes.y * target_scale,
        width: target.width * .8,
        height: target.height / 5,
        key: this.target_face.eyes
      });
      this.add(component);
      this.target_face_components.push(component);
    }
    if ('mouth' in this.target_face) {
      const component = new Mouth({
        x: target.center.x + offsets.mouth.x * target_scale,
        y: target.center.y + offsets.mouth.y * target_scale,
        width: target.width * .8,
        height: target.height / 5,
        key: this.target_face.mouth
      });
      this.add(component);
      this.target_face_components.push(component);
    }

  }

  spawnComponent() {
    this.components = this.components.filter(component => !component.isKilled());
    if (this.components.length < this.max_components) {
      const third = this.engine.drawWidth / 3;
      const x = Math.random() * third + (Math.random() < .5? 0 : third * 2);
      const props = {
        x,
        y: 0,
        width: this.potato? this.potato.width * .8 : 0,
        height: this.potato? this.potato.height / 5 : 0
      };
      const component = Math.random() < .5? new Eyes(props) : new Mouth(props);
      component.body.collisionType = CollisionType.Active;
      component.body.vel.addEqual(vec(0, 100));
      component.on('pointerdown', () => this.addComponentToFace(component));
      this.components.push(component);
      this.add(component);
    }
    this.engine.clock.schedule(this.spawnComponent.bind(this), this.component_spawn_delay);
  }

  addComponentToFace(component: Component) {
    console.log('adding component to face', component);
    let copy: Component | null = null;
    if (component.type === 'eyes') {
      copy = new Eyes({
        x: component.center.x, y: component.center.y,
        width: component.width, height: component.height,
        key: component.key
      });
    }
    if (component.type === 'mouth') {
      copy = new Mouth({
        x: component.center.x, y: component.center.y,
        width: component.width, height: component.height,
        key: component.key
      });
    }
    if (!copy) return;
    component.kill();
    // destroy old component if it exists
    this.current_face_components[component.type]?.actions.scaleTo(vec(0, 0), vec(10, 10)).die();
    this.current_face_components[component.type] = copy;

    this.add(copy);
    copy.actions.moveTo(this.potato!.pos.add(offsets[copy.type]), 1000).toPromise().then(() => {
      this.checkWinCondition();
    });
  }

  checkWinCondition() {
    const target = this.target_face!;
    const current = this.current_face_components;
    const target_keys = Object.keys(target) as ComponentType[];
    const current_keys = Object.keys(current) as ComponentType[];
    for (const key of target_keys) {
      if (!target[key]) continue;
      if (!current_keys.includes(key)) return;
      if (target[key] !== current[key]?.key) return;
    }

    alert('You win!');
    this.engine.initialize();
  }
}
