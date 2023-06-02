import {
  ActionSequence,
  CollisionType, Color, EmitterType,
  Font, FontUnit,
  GraphicsGroup,
  Label,
  ParallelActions, ParticleEmitter,
  Scene, Sound,
  Sprite,
  TextAlign,
  vec,
  Vector
} from "excalibur";
import {Component, type ComponentType, Eyes, Mouth, Potato} from "./actors";
import {random_resource_key_by_type, ImageResources, SoundResources} from "./resources";
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
const component_size = {width: potato_size.width * .8, height: potato_size.height / 5}

const offsets: {[type in ComponentType]: Vector} = {
  eyes: vec(0, -20),
  mouth: vec(0, 40),
}

const max_components = 20;
const component_spawn_delay_min = 500;
const component_spawn_variation = 200;
const component_lifetime = 2000;
const target_frequency = 1 / 5;
const music_change_frequency = 60000;

class MusicManager {
  tracks: Sound[];
  current_track: number;
  will_change_track: boolean;

  constructor(tracks: Sound[]) {
    this.tracks = tracks;
    this.current_track = this.get_random_track();
    this.will_change_track = false;
  }

  get_random_track() {
    let next_track = this.current_track;
    if (this.tracks.length === 1) return next_track;
    while(next_track === this.current_track) {
      next_track = Math.floor(Math.random() * this.tracks.length) | 0;
    }
    return next_track;
  }

  play() {
    if(this.will_change_track) {
      this.current_track = this.get_random_track();
      console.log(`Changing track to ${this.current_track}`);
      this.will_change_track = false;
    }
    this.tracks[this.current_track].play().then(() => this.play());
  }
}

export default class Level_01 extends Scene {
  declare engine: Game;
  target_face: Face | null = null;
  current_face_components: Partial<{ [type in ComponentType]: Component }> = {};
  potato: Potato | null = null;
  target_potato: Potato | null = null;
  max_components = max_components;
  components: Component[] = [];
  component_spawn_delay_min = component_spawn_delay_min;
  component_spawn_delay_variation = component_spawn_variation;
  component_spawn_enabled = true;
  celebration_text: Label | null = null;
  buckets: {targets: string[], distractors: string[]} = {targets: [], distractors: []};

  music_change_frequency = music_change_frequency;
  music_manager: MusicManager;

  constructor() {
    super();
    const tracks: Sound[] = [];
    Object.keys(SoundResources)
      .filter(k => k.startsWith('music_'))
      .forEach(k => tracks.push(SoundResources[k as keyof typeof SoundResources]));
    this.music_manager = new MusicManager(tracks);
    this.music_manager.will_change_track = true;
  }

  onActivate() {
    this.component_spawn_enabled = true;
    this.createTarget();

    const potato = new Potato({
      x: this.engine.halfDrawWidth, y: this.engine.halfDrawHeight,
      width: potato_size.width, height: potato_size.height,
    });
    this.add(potato)
    this.potato = potato;

    this.music_manager.play();
    this.engine.clock.schedule(() => this.changeMusic(), this.music_change_frequency)
    this.engine.clock.schedule(this.spawnComponent.bind(this), this.component_spawn_delay_min);
  }

  createTarget() {
    function getOffset(type: ComponentType) {
      return vec(
        (potato_size.width - component_size.width) / 2 + offsets[type].x,
        (potato_size.height - component_size.height) / 2 + offsets[type].y,
      )
    }

    this.target_face = {
      eyes: random_resource_key_by_type('eyes'),
      mouth: random_resource_key_by_type('mouth'),
      hair: Math.random() < .2? random_resource_key_by_type('hair') : undefined,
      nose: Math.random() < .2? random_resource_key_by_type('nose') : undefined,
      ears: Math.random() < .2? random_resource_key_by_type('ears') : undefined,
      glasses: Math.random() < .2? random_resource_key_by_type('glasses') : undefined,
      mustache: Math.random() < .2? random_resource_key_by_type('mustache') : undefined,
    }

    // Sort component keys into buckets
    for (const s of Object.keys(this.target_face)) {
      const k = s as ComponentType;
      const key = this.target_face[k];
      let resources = Object.keys(ImageResources);
      if (key) {
        this.buckets.targets.push(key);
        resources = resources.filter(k => k !== key)
      }
      const matches = resources.filter(k => k.startsWith(s));
      this.buckets.distractors.push(...matches);
    }

    // Create the target
    this.target_potato = new Potato({key: random_resource_key_by_type('potato')});
    this.target_potato.onInitialize = () => {};
    this.add(this.target_potato);

    const graphicsGroup = new GraphicsGroup({
      members: [
        {graphic: new Sprite({image: ImageResources[this.target_potato.key], destSize: potato_size}), pos: vec(0, 0)},
      ],
      ...potato_size
    });
    for (const s of Object.keys(this.target_face)) {
      const k = s as ComponentType;
      if (!this.target_face[k]) continue;
      graphicsGroup.members.push({
        graphic: new Sprite({image: ImageResources[this.target_face[k]], destSize: component_size}),
        pos: getOffset(k)
      })
    }
    this.target_potato.graphics.add('graphicsGroup', graphicsGroup);
    this.target_potato.scale = vec(target_scale, target_scale);
    this.target_potato.pos = vec(this.engine.halfDrawWidth, potato_size.height * target_scale);
    this.target_potato.graphics.use('graphicsGroup');
  }

  getComponentKey(max_iterations = 1000) {
    let key = '';
    let target = Math.random() < target_frequency;
    for (let i = 0; i < max_iterations; i++) {
      if (target) {
        key = this.buckets.targets[Math.floor(Math.random() * this.buckets.targets.length)];
        if (i > max_iterations / 2) target = false;
      }
      else
        key = this.buckets.distractors[Math.floor(Math.random() * this.buckets.distractors.length)];
      if (this.components.find(c => c.key === key)) continue;
      const current_face_component = this.current_face_components[key.split('_')[0] as ComponentType];
      if (current_face_component?.key === key) continue;
      return key;
    }
    console.error(`Failed to get component key after ${max_iterations} iterations`);
    return '';
  }

  getComponentByKey(key: string, props: any): Component | null {
    const type = key.split('_')[0] as ComponentType;
    props = {key, ...props}
    switch(type) {
      case 'eyes':
        return new Eyes(props);
      case 'mouth':
        return new Mouth(props);
      default:
        console.error(`Component key ${key} does not map to a component type (${type})`);
        return null;
    }
  }

  spawnComponent() {
    this.components = this.components.filter(component => !component.isKilled());
    if (this.components.length < this.max_components && this.component_spawn_enabled) {
      const component_key = this.getComponentKey();
      if (component_key) {
        const third = (this.engine.drawWidth - component_size.width) / 3;
        const x = Math.random() * third + (Math.random() < .5? 0 : third * 2) + component_size.width / 2;
        const height = this.engine.drawHeight - component_size.height;
        const y = Math.random() * height + component_size.height / 2;
        const props = {x, y, width: 1, height: 1};
        const component = this.getComponentByKey(component_key, props);
        if (!component) return;
        component.body.collisionType = CollisionType.Active;
        component.on('pointerdown', () => this.addComponentToFace(component));
        this.components.push(component);
        this.add(component);
        const sound_matches = Object.keys(SoundResources).filter(k => k.startsWith('bubble_'));
        const sound_key = sound_matches[Math.floor(Math.random() * sound_matches.length)] as keyof typeof SoundResources;
        SoundResources[sound_key].play();
        const scale_speed = vec(
          100 * component_size.width / (component_size.width + component_size.height),
          100 * component_size.height / (component_size.width + component_size.height)
        )
        component.actions.scaleTo(vec(component_size.width, component_size.height), scale_speed);
        this.engine.clock.schedule(() => this.killComponent(component, scale_speed), component_lifetime)
      }
    }
    this.engine.clock.schedule(
      this.spawnComponent.bind(this),
      this.component_spawn_delay_min + Math.random() * this.component_spawn_delay_variation
    );
  }

  killComponent(component: Component, scale_speed: Vector) {
    component.actions.clearActions()
    component.actions.scaleTo(vec(0, 0), scale_speed).die()
  }

  addComponentToFace(component: Component) {
    SoundResources.click.play();
    let copy: Component | null = null;
    const props = {
      x: component.center.x, y: component.center.y, ...component_size, key: component.key
    }
    if (component.type === 'eyes') {
      copy = new Eyes(props);
    }
    if (component.type === 'mouth') {
      copy = new Mouth(props);
    }
    if (!copy) return;
    component.kill();
    // destroy old component if it exists
    this.current_face_components[component.type]?.actions.scaleTo(vec(0, 0), vec(10, 10)).die();
    this.current_face_components[component.type] = copy;

    this.add(copy);
    copy.actions.moveTo(this.potato!.pos.add(offsets[copy.type]), 1000).toPromise().then(() => {
      if (copy?.type && this.target_face && copy.type in this.target_face)
        if (this.target_face[copy.type] === copy.key)
          SoundResources.chime.play();
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

    this.component_spawn_enabled = false;

    this.playWinAnimation()
      .then(() => this.engine.initialize());
  }

  playWinAnimation(duration: number = 500) {
    SoundResources.fanfare.play();
    this.components.forEach(component => this.killComponent(component, vec(1000, 1000)))
    // Get target_potato to potato offset
    const offset = vec(this.potato!.width, this.potato!.pos.y - this.target_potato!.pos.y);
    this.target_potato!.z = 10;
    // Move target_face_components to offset position
    const parallel = new ParallelActions([
      new ActionSequence(
        this.target_potato!,
        ctx => ctx.scaleTo(vec(1, 1), vec(1000 / duration, 1000 / duration))
      ),
      new ActionSequence(
        this.target_potato!,
        ctx => ctx.moveBy(offset, offset.y * 1000 / duration)
      ),
    ])
    this.target_potato?.actions.runAction(parallel)

    // Move potato and current_face_components to offset position
    this.potato?.actions.moveBy(-this.potato!.width, 0, duration)
    for (const s of Object.keys(this.current_face_components)) {
      const k = s as ComponentType;
      const component = this.current_face_components[k];
      if (!component) continue;
      component.actions.moveBy(-this.potato!.width, 0, duration)
    }

    // Play celebration effects
    this.celebration_text = new Label({
      text: "It's a match!",
      font: new Font({
        family: 'Monomaniac One',
        size: 52,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center
      }),
      pos: vec(this.engine.halfDrawWidth, this.engine.drawHeight / 5),
      z: 5
    });
    this.add(this.celebration_text);
    const emitter = new ParticleEmitter({});
    emitter.pos = vec(this.engine.halfDrawWidth - 5, this.celebration_text.pos.y);
    emitter.emitterType = EmitterType.Circle;
    emitter.radius = 235;
    emitter.minVel = 10;
    emitter.maxVel = 200;
    emitter.minAngle = 0;
    emitter.maxAngle = 6.2;
    emitter.isEmitting = true;
    emitter.emitRate = 300;
    emitter.opacity = 1;
    emitter.fadeFlag = true;
    emitter.particleLife = 1000;
    emitter.maxSize = 6;
    emitter.minSize = 1;
    emitter.startSize = 3;
    emitter.endSize = 13;
    emitter.acceleration = vec(-8, 800);
    emitter.beginColor = Color.Red;
    emitter.endColor = Color.Transparent;
    emitter.isEmitting = true;  // should the emitter be emitting
    // add the emitter as a child actor, it will draw on top of the parent actor
    // and move with the parent
    this.add(emitter);
    const orange_emitter = new ParticleEmitter({});
    orange_emitter.pos = vec(this.engine.halfDrawWidth + 5, this.celebration_text.pos.y);
    orange_emitter.emitterType = EmitterType.Circle;
    orange_emitter.radius = 229;
    orange_emitter.minVel = 10;
    orange_emitter.maxVel = 200;
    orange_emitter.minAngle = 0;
    orange_emitter.maxAngle = 6.2;
    orange_emitter.isEmitting = true;
    orange_emitter.emitRate = 300;
    orange_emitter.opacity = 1;
    orange_emitter.fadeFlag = true;
    orange_emitter.particleLife = 1000;
    orange_emitter.maxSize = 6;
    orange_emitter.minSize = 1;
    orange_emitter.startSize = 3;
    orange_emitter.endSize = 13;
    orange_emitter.acceleration = vec(-8, 800);
    orange_emitter.beginColor = Color.Orange;
    orange_emitter.endColor = Color.Transparent;
    orange_emitter.isEmitting = true;  // should the emitter be emitting
    // add the emitter as a child actor, it will draw on top of the parent actor
    // and move with the parent
    this.add(orange_emitter);

    // Return a timeout promise for the duration
    return new Promise<void>(resolve => this.engine.clock.schedule(resolve, duration));
  }

  changeMusic() {
    this.music_manager.will_change_track = true;
    this.engine.clock.schedule(() => this.changeMusic(), this.music_change_frequency);
  }
}
