import {
    ActionSequence,
    canonicalizeAngle,
    CollisionType,
    Color,
    EmitterType,
    Font,
    FontUnit,
    GraphicsGroup,
    Label,
    MoveTo,
    ParallelActions,
    ParticleEmitter,
    RepeatForever,
    RotationType,
    Scene,
    Sound,
    Sprite,
    TextAlign,
    Timer,
    vec,
    Vector
} from "excalibur";
import {PointerEvent} from "excalibur/build/dist/Input/PointerEvent";
import Component, {type ComponentType} from "../actors/Component";
import Eyes from "../actors/Eyes";
import Mouth from "../actors/Mouth";
import Potato from "../actors/Potato";
import Thief from "../actors/Thief";
import Game, {level_names} from "../main";
import {LevelStatistics} from "@/assets/game_src/utils/Statistics";
import {Settings} from "@/assets/game_src/utils/settings";
import {EyesImages, IMAGE_TYPE, MouthImages, PotatoImages, SOUND_TYPE} from "@/assets/game_src/utils/resources";

type Face = {
  eyes: keyof EyesImages;
  mouth: keyof MouthImages;
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

export default class MatchingMode extends Scene {
  declare engine: Game;
  spawn_timers: {[key: string]: Timer} = {}
  complete: boolean = false;
  target_face: Face | null = null;
  current_face_components: Partial<{ [type in ComponentType]: Component }> = {};
  potato: Potato | null = null;
  target_potato: Potato | null = null;
  components: Component[] = [];
  celebration_text: Label | null = null;
  particle_emitters: ParticleEmitter[] = [];
  buckets: {targets: string[], distractors: string[]} = {targets: [], distractors: []};
  potato_thief: Thief | null = null;

  _potato_thief_spawn_point: Vector = vec(0, 0);
  _potato_thief_leaving: boolean = false;
  _rotation_adjustment: number = - Math.PI / 2;
  _game_over_delay: number = 5000;
  _start_time: number = 0;
  _settings_cache: Settings|null = null;

  get stats() {
    return this.engine.current_level_statistics;
  }

  get settings() {
    if (!this._settings_cache)
      this._settings_cache = this.engine.settings_adjusted;
    return this._settings_cache;
  }

  clean() {
    this.engine.music_manager.stop();
    this.potato?.kill()
    this.potato = null;
    this.target_potato?.kill()
    this.target_potato = null;
    this.potato_thief?.kill()
    this.potato_thief = null;
    this.components.forEach(c => c.kill())
    this.components = []
    Object.values(this.current_face_components).forEach(c => c.kill())
    this.current_face_components = {}
    this.celebration_text?.kill()
    this.celebration_text = null
    this.particle_emitters?.forEach(e => e.kill())
    this.particle_emitters = []
    Object.values(this.spawn_timers).forEach(t => t.cancel())
    this.spawn_timers = {}
    this.buckets = {targets: [], distractors: []};
    this._settings_cache = null;
  }

  onActivate() {
    this.complete = false;
    this.clean();
    this.engine.level_statistics.push(new LevelStatistics());
    this._start_time = this.engine.clock.now();

    this.createTarget();

    const potato = new Potato({
      key: this.engine.get_random_image_key<PotatoImages>(IMAGE_TYPE.POTATO),
      x: this.engine.halfDrawWidth, y: this.engine.halfDrawHeight,
      width: potato_size.width, height: potato_size.height,
    });
    this.add(potato)
    this.potato = potato;

    this.engine.music_manager.will_change_track = true;
    this.engine.music_manager.play();

    // Set up timers
    this.spawn_timers = {
      spawnComponent: new Timer({
        fcn: this.spawnComponent.bind(this),
        interval: this.settings.component_spawn_delay_min,
        randomRange: [0, this.settings.component_spawn_delay_variation],
        repeats: true,
      }),
      spawnThief: new Timer({
        fcn: this.spawnThief.bind(this),
        interval: this.settings.needy_potato_delay_min,
        randomRange: [0, this.settings.needy_potato_delay_variation],
        repeats: true,
      })
    }
    Object.values(this.spawn_timers).forEach(t => {
      this.add(t)
      t.start()
    })

    // if (!this.camera_display) {
    //   this.camera_display = get_camera({x: this.engine.halfDrawWidth, y: 40});
    //   this.add(this.camera_display);
    // }
  }

  onDeactivate() {
    this.clean();
  }

  createTarget() {
    function getOffset(type: ComponentType) {
      return vec(
        (potato_size.width - component_size.width) / 2 + offsets[type].x,
        (potato_size.height - component_size.height) / 2 + offsets[type].y,
      )
    }

    this.target_face = {
      eyes: this.engine.get_random_image_key<EyesImages>(IMAGE_TYPE.EYES),
      mouth: this.engine.get_random_image_key<MouthImages>(IMAGE_TYPE.MOUTH),
      // hair: Math.random() < .2? random_resource_key_by_type('hair') : undefined,
      // nose: Math.random() < .2? random_resource_key_by_type('nose') : undefined,
      // ears: Math.random() < .2? random_resource_key_by_type('ears') : undefined,
      // glasses: Math.random() < .2? random_resource_key_by_type('glasses') : undefined,
      // mustache: Math.random() < .2? random_resource_key_by_type('mustache') : undefined,
    }

    // Sort component keys into buckets
    for (const s of Object.keys(this.target_face)) {
      const k = s as ComponentType;
      const key = this.target_face[k];
      let resources = [
        ...this.engine.get_all_image_keys<EyesImages>(IMAGE_TYPE.EYES),
        ...this.engine.get_all_image_keys<MouthImages>(IMAGE_TYPE.MOUTH),
      ];
      if (key) {
        this.buckets.targets.push(key);
        resources = resources.filter(k => (k as string) !== key)
      }
      const matches = resources.filter(k => k.startsWith(s));
      this.buckets.distractors.push(...matches);
    }

    // Create the target
    this.target_potato = new Potato({
        key: this.engine.get_random_image_key<PotatoImages>(IMAGE_TYPE.POTATO)
    });
    this.target_potato.onInitialize = () => {};
    this.add(this.target_potato);

    const graphicsGroup = new GraphicsGroup({
      members: [
        {
          graphic: new Sprite(
            {image: this.engine.skin.images[this.target_potato.key], destSize: potato_size}),
          pos: vec(0, 0)
        },
      ],
      ...potato_size
    });
    for (const s of Object.keys(this.target_face)) {
      const k = s as ComponentType;
      if (!this.target_face[k]) continue;
      const component_key = this.target_face[k];
      graphicsGroup.members.push({
        graphic: new Sprite({image: this.engine.skin.images[this.target_face[k]], destSize: component_size}),
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
    let target = Math.random() < this.settings.target_frequency;
    for (let i = 0; i < max_iterations; i++) {
      if (target) {
        key = this.buckets.targets[Math.floor(Math.random() * this.buckets.targets.length)];
        if (i > max_iterations / 2) target = false;
      } else
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
    if (this.components.length < this.settings.max_components && !this.complete) {
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
        component.on(
          'pointerdown',
          (clickEvent) => this.handleComponentClick(component, clickEvent)
        );
        this.components.push(component);
        this.add(component);
        this.engine.get_random_sound(SOUND_TYPE.COMPONENT_SPAWN)?.play();
        const lifetime = this.settings.component_lifetime;
        const inflation_duration = lifetime / 3;
        const inflation_speed = Math.max(component_size.width, component_size.height) / inflation_duration * 1000
        const scale_speed = vec(
          inflation_speed * component_size.width / (component_size.width + component_size.height),
          inflation_speed * component_size.height / (component_size.width + component_size.height)
        )
        component.actions.scaleTo(vec(component_size.width, component_size.height), scale_speed);
        this.engine.clock.schedule(
          () => this.killComponent(component, scale_speed),
          this.settings.component_lifetime
        )
      }
    }
  }

  killComponent(component: Component, scale_speed: Vector) {
    component.actions.clearActions()
    component.actions.scaleTo(vec(0, 0), scale_speed).die()
  }

  handleComponentClick(component: Component, clickEvent: PointerEvent) {
    this.engine.reportToAPI(clickEvent);
    this.addComponentToFace(component);
  }

  addComponentToFace(component: Component) {
    this.engine.get_random_sound(SOUND_TYPE.COMPONENT_CLICKED)?.play();
    // this.camera_display?.canvas.flagDirty();
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
        if (this.target_face[copy.type] === copy.key) {
          this.engine.get_random_sound(SOUND_TYPE.COMPONENT_CORRECT)?.play();
          this.checkWinCondition();
          this.stats.clicks.value++;
        } else
          this.stats.misclicks.value++;
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

    this.complete = true;
    this.engine.difficulty_level += 1;

    this.playWinAnimation()
      .then(() => this.engine.goToScene(level_names.SPLASHSCREEN))
  }

  playWinAnimation(duration: number = 1000, complete_after: number = 0) {
    this.stats.time_taken.value = this.engine.clock.now() - this._start_time;
    if (complete_after === 0) complete_after = Math.max(this._game_over_delay, duration);
    this.engine.music_manager.stop();
    this.engine.get_random_sound(SOUND_TYPE.VICTORY_STINGER)?.play();
    this.stopNeediness(true);
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
    this.engine.currentScene.camera.shake(5, 5, Math.max(1000, duration));
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
    const blue_emitter = new ParticleEmitter({});
    blue_emitter.pos = vec(this.engine.halfDrawWidth - 5, this.celebration_text.pos.y);
    blue_emitter.emitterType = EmitterType.Circle;
    blue_emitter.radius = 235;
    blue_emitter.minVel = 10;
    blue_emitter.maxVel = 200;
    blue_emitter.minAngle = 0;
    blue_emitter.maxAngle = 6.2;
    blue_emitter.isEmitting = true;
    blue_emitter.emitRate = 300;
    blue_emitter.opacity = 1;
    blue_emitter.fadeFlag = true;
    blue_emitter.particleLife = 1000;
    blue_emitter.maxSize = 6;
    blue_emitter.minSize = 1;
    blue_emitter.startSize = 3;
    blue_emitter.endSize = 13;
    blue_emitter.acceleration = vec(-8, 800);
    blue_emitter.beginColor = Color.Red;
    blue_emitter.endColor = Color.Transparent;
    blue_emitter.isEmitting = true;  // should the emitter be emitting
    // add the emitter as a child actor, it will draw on top of the parent actor
    // and move with the parent
    this.add(blue_emitter);
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
    this.particle_emitters = [blue_emitter, orange_emitter];

    // Return a timeout promise for the duration
    return new Promise<void>(resolve => {
      const t = new Timer({
        fcn: resolve.bind(this),
        interval: complete_after,
        repeats: false
      })
      this.add(t);
      t.start();
    });
  }

  spawnThief() {
    if (this.complete) return;
    if (!this.potato_thief?.active) {
      this.startNeediness();
    }
  }

  startNeediness() {
    // The player's potato gets a thief component
    if (this.potato_thief?.active) return;
    this._potato_thief_leaving = false;
    this.potato_thief = new Thief({height: 50, width: 50, duration: this.settings.needy_potato_duration});
    this._potato_thief_spawn_point = vec(
      Math.random() * this.engine.drawWidth,
      Math.random() * this.engine.drawWidth
    );
    const target_point = this.potato!.pos
      .add(vec(Math.random() * 25, Math.random() * 25))
      .sub(vec(Math.random() * 25, Math.random() * 25));
    this.potato_thief.pos = this._potato_thief_spawn_point;
    this.potato_thief.rotation = this.potato_thief.pos.sub(target_point).toAngle() + this._rotation_adjustment;
    this.potato_thief.actions.moveTo(
      target_point.x,
      target_point.y,
      1000
    )
      .toPromise()
      .then(() => {
        const anim = this.potato_thief!.needyAnimation;
        if (anim !== null) {
          this.potato_thief!.graphics.use(anim)
          anim.events.on('end', this.needsUnmet.bind(this))
          anim.events.on('frame', () => {
            this.engine.get_random_sound(SOUND_TYPE.THIEF_WORK)?.play();
          })
          this.potato_thief!.on('pointerdown', () => {
            this.stats.thieves_shooed.value++;
            this.stopNeediness()
          })
        }
      })
    this.add(this.potato_thief)
  }

  stopNeediness(fast = false) {
    // The thief component is removed from the player's potato
    if (!this.potato_thief?.active || this._potato_thief_leaving) return;
    this._potato_thief_leaving = true;
    this.potato_thief.actions.clearActions();
    this.potato_thief.needyAnimation!.pause();
    this.potato_thief.makeUnneedyAnimation(fast? 250 : 1000);
    this.potato_thief.graphics.use(this.potato_thief.unneedyAnimation!);
    this.potato_thief.off('pointerdown')
    this.potato_thief.unneedyAnimation?.events.on('end', () => this.shooThief());

    if (!fast) {
      this.camera.shake(10, 10, 200)
      this.engine.get_random_sound(SOUND_TYPE.THIEF_HIT)!
          .play()
          .then(() => this.engine.get_random_sound(SOUND_TYPE.THIEF_FLEE)?.play());
    }
  }

  shooThief() {
    if (!this.potato_thief?.active) return;
    const v = this.potato_thief.pos
      .sub(this._potato_thief_spawn_point!)
      .normalize()
      .scale(this.engine.drawWidth * 2);
    this.potato_thief.actions.moveTo(v.x, v.y, 1000)
      .callMethod(() => {
        this.potato_thief!.kill();
        this.potato_thief = null;
      })
  }

  needsUnmet() {
    // The thief steals the potato -> game over
    this.complete = true;
    this.potato_thief!.off('pointerdown')

    this.engine.music_manager.stop();
    this.engine.get_random_sound(SOUND_TYPE.FAILURE_STINGER)?.play()
      .then(() => this.engine.get_random_sound(SOUND_TYPE.THIEF_VICTORY)?.play());

    this.components.forEach(component => this.killComponent(component, vec(1000, 1000)))
    this.target_potato!.kill()

    const angle = this.potato_thief!.rotation - this._rotation_adjustment + Math.PI
    const v = Vector.fromAngle(canonicalizeAngle(angle))
    const potato_destination = v.scale(this.engine.drawWidth).add(this.potato!.pos)
    const thief_offset = this.potato_thief!.pos.sub(this.potato!.pos)
    const thief_destination = potato_destination.add(thief_offset)
    this.potato!.actions.moveTo(potato_destination.x, potato_destination.y, 100).die()
    this.potato_thief?.actions.moveTo(thief_destination.x, thief_destination.y, 100).die()

    Object.values(this.current_face_components).forEach(component => {
      const a = angle + (Math.PI * Math.random() * (Math.random() > 0.5 ? 1 : -1) * 0.5)
      const destination = Vector.fromAngle(a).scale(this.engine.drawWidth * 2).add(component.pos)
      let rotate_speed = Math.random() * 25 + 10
      component.actions.runAction(new ParallelActions([
        new RepeatForever(component, (ctx) => {
          rotate_speed *= 0.8
          ctx.rotateBy(a, rotate_speed, a > 0? RotationType.Clockwise : RotationType.CounterClockwise)
        }),
        new MoveTo(component, destination.x, destination.y, Math.random() * 50 + 50),
      ]))
    })

    this.engine.currentScene.camera.shake(5, 5, 1000)

    this.celebration_text = new Label({
      text: "Potato stolen!",
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

    this.engine.clock.schedule(() => this.engine.goToScene(level_names.SCORESHEET), this._game_over_delay)
  }
}
