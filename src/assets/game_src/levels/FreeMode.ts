import {
  ActionSequence,
  CollisionType,
  Color,
  EmitterType,
  Font,
  FontUnit,
  Label, MoveTo, ParallelActions,
  ParticleEmitter, RepeatForever, RotationType, ScaleTo,
  Scene,
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
import Game, {level_names} from "../main";
import {Settings} from "@/assets/game_src/utils/settings";
import {
  COMPONENT_TYPE,
  ComponentImages,
  EyesImages,
  IMAGE_TYPE,
  MouthImages,
  PotatoImages,
  SOUND_TYPE, UI_IMAGE
} from "@/assets/game_src/utils/resources";
import ComponentSlot from "@/assets/game_src/actors/ComponentSlot";
import Button, {BUTTON_HEIGHT, BUTTON_WIDTH} from "@/assets/game_src/actors/Buttons";

const potato_size = {width: 150, height: 200};
const component_size = {width: potato_size.width * .8, height: potato_size.height / 5}

const offsets: Vector[] = [
  vec(0, -80),
  vec(0, -40),
  vec(0, 0),
  vec(0, 40),
  vec(0, 80),
]
export default class FreeMode extends Scene {
  declare engine: Game;
  complete: boolean = false;
  spawn_timers: {[key: string]: Timer} = {}
  potato: Potato | null = null;
  components: Component[] = [];
  celebration_text: Label | null = null;
  particle_emitters: ParticleEmitter[] = [];
  component_slots: ComponentSlot[] = [];
  selected_component: Component | null = null;

  _start_time: number = 0;
  _settings_cache: Settings|null = null;

  restartButton: Button|null = null;
  danceButton: Button|null = null;
  quitButton: Button|null = null;

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
    this.components.forEach(c => c.kill())
    this.components = []
    this.component_slots.forEach(s => {
      s.component?.kill()
      s.component = null
    })
    this.celebration_text?.kill()
    this.celebration_text = null
    this.particle_emitters?.forEach(e => e.kill())
    this.particle_emitters = []
    Object.values(this.spawn_timers).forEach(t => t.cancel())
    this.spawn_timers = {}
    this._settings_cache = null;
    this.killButtons();
  }

  onActivate() {
    this.clean();
    this.spawnButtons();

    this.component_slots = offsets.map((v) => {
      return new ComponentSlot({
        x: this.engine.halfDrawWidth + v.x,
        y: this.engine.halfDrawHeight + v.y
      });
    })

    this.complete = false;
    this._start_time = this.engine.clock.now();

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
      checkDanceShake: new Timer({
        fcn: () => {
          if (this.complete)
            this.camera.shake(
                Math.random() * 10 - 5,
                Math.random() * 10 - 5,
                1000
            )
        },
        interval: 1000,
        repeats: true,
      })
    }
    Object.values(this.spawn_timers).forEach(t => {
      this.add(t)
      t.start()
    })
  }

  onDeactivate() {
    this.clean();
  }

  createButtons() {
    this.restartButton = null;
    this.danceButton = null;
    this.quitButton = null;

    const width = this.engine.drawWidth;
    const button_spacing = (width - 3 * BUTTON_WIDTH) / 4;
    const y = this.engine.drawHeight - BUTTON_HEIGHT * 2;

    this.restartButton = new Button({
      hover_img: this.engine.skin.ui[UI_IMAGE.RESTART_BUTTON_HOVER],
      idle_img: this.engine.skin.ui[UI_IMAGE.RESTART_BUTTON_IDLE],
      callbacks: [
        {
          event_name: 'pointerdown',
          callback: () => {
            this.engine.goToScene(level_names.SPLASHSCREEN)
          }
        }
      ],
      x: button_spacing,
      y
    })

    this.danceButton = new Button({
      hover_img: this.engine.skin.ui[UI_IMAGE.DANCE_BUTTON_HOVER],
      idle_img: this.engine.skin.ui[UI_IMAGE.DANCE_BUTTON_IDLE],
      callbacks: [
        {
          event_name: 'pointerdown',
          callback: () => {
            this.toggleDance()
          }
        }
      ],
      x: button_spacing * 2 + BUTTON_WIDTH,
      y
    })

    this.quitButton = new Button({
      hover_img: this.engine.skin.ui[UI_IMAGE.QUIT_BUTTON_HOVER],
      idle_img: this.engine.skin.ui[UI_IMAGE.QUIT_BUTTON_IDLE],
      callbacks: [
        {
          event_name: 'pointerdown',
          callback: () => {
            window.location.reload()
          }
        }
      ],
      x: button_spacing * 3 + BUTTON_WIDTH * 2,
      y
    })
  }

  spawnButtons() {
    if (!this.restartButton || !this.danceButton || !this.quitButton)
      this.createButtons();
    this.add(this.restartButton!)
    this.add(this.danceButton!)
    this.add(this.quitButton!)
  }

  killButtons() {
    this.restartButton?.kill()
    this.danceButton?.kill()
    this.quitButton?.kill()
  }

  getComponentKey() {
    const components: (keyof ComponentImages)[] = [
      ...this.engine.get_all_image_keys<EyesImages>(IMAGE_TYPE.EYES),
      ...this.engine.get_all_image_keys<MouthImages>(IMAGE_TYPE.MOUTH)
    ]
    if (!components.length) throw new Error('No components found');
    return components[Math.floor(Math.random() * components.length)];
  }

  getComponentByKey(key: keyof ComponentImages, props: any): Component | null {
    const type = key.split('_')[0] as ComponentType;
    props = {key, ...props}
    switch(type) {
      case COMPONENT_TYPE.EYES:
        return new Eyes(props);
      case COMPONENT_TYPE.MOUTH:
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
        const height = this.engine.drawHeight - component_size.height - BUTTON_HEIGHT * 2;
        const y = Math.random() * height + component_size.height / 2 - BUTTON_HEIGHT * 2;
        const props = {x, y, width: 10, height: 10};
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
        component.actions.scaleTo(vec(component_size.width/10, component_size.height/10), scale_speed);
        this.engine.clock.schedule(
            () => {
              if (this.selected_component !== component)
                this.killComponent(component, scale_speed)
            },
            this.settings.component_lifetime
        )
      }
    }
  }

  killComponent(component: Component, scale_speed: Vector) {
    component.actions.clearActions()
    component.actions.scaleTo(vec(0, 0), scale_speed).die()
  }

  enableComponentSlots() {
    this.component_slots.forEach(slot => {
      this.add(slot);
      slot.on('pointerdown', (clickEvent) => this.handleFaceClick(slot, clickEvent))
    })
  }

  disableComponentSlots() {
    this.component_slots.forEach(slot => {
      slot.off('pointerdown');
      slot.kill();
    })
  }

  deselectComponent() {
    if (this.selected_component) {
      this.selected_component.actions.clearActions();
      const lifetime = this.settings.component_lifetime;
      const inflation_duration = lifetime / 3;
      const inflation_speed = Math.max(component_size.width, component_size.height) / inflation_duration * 1000
      const scale_speed = vec(
          inflation_speed * component_size.width / (component_size.width + component_size.height),
          inflation_speed * component_size.height / (component_size.width + component_size.height)
      )
      this.killComponent(this.selected_component, scale_speed);
    }
  }

  selectComponent(component: Component) {
    if (this.selected_component !== component) {
      this.deselectComponent();
      component.actions.clearActions();
      this.selected_component = component;
    }
  }

  handleComponentClick(component: Component, clickEvent: PointerEvent) {
    this.engine.reportToAPI(clickEvent);
    this.enableComponentSlots();
    this.selectComponent(component);
  }

  handleFaceClick(slot: ComponentSlot, clickEvent: PointerEvent) {
    this.engine.reportToAPI(clickEvent);
    this.disableComponentSlots();
    if (!this.selected_component) throw new Error('No component selected while adding to face');
    this.addComponentToFace(this.selected_component, slot);
  }

  addComponentToFace(component: Component, slot: ComponentSlot) {
    this.engine.get_random_sound(SOUND_TYPE.COMPONENT_CLICKED)?.play();
    // this.camera_display?.canvas.flagDirty();
    let copy: Component | null = null;
    const props = {
      x: component.center.x, y: component.center.y, ...component_size, key: component.key
    }
    if (component.type === COMPONENT_TYPE.EYES) {
      copy = new Eyes(props);
    }
    if (component.type === COMPONENT_TYPE.MOUTH) {
      copy = new Mouth(props);
    }
    if (!copy) return;
    component.kill();
    // destroy old component if it exists
    if (slot.component)
      slot.component.actions.scaleTo(vec(0, 0), vec(10, 10)).die();
    slot.component = copy;

    this.add(copy);
    copy.actions.moveTo(slot.pos, 1000)
    copy.on('pointerdown', () => this.removeComponentFromFace(copy))
  }

  removeComponentFromFace(component: Component|null) {
    if (!component) return;
    this.engine.get_random_sound(SOUND_TYPE.COMPONENT_CLICKED)?.play();
    const destination = vec(this.engine.drawWidth, this.engine.drawHeight)
        .rotate(Math.random() * Math.PI * 2)
    component.off('pointerdown')
    const a = Math.PI * Math.random() * (Math.random() > 0.5 ? 1 : -1) * 0.5
    let rotate_speed = Math.random() * 25 + 10
    component.actions.runAction(new ParallelActions([
      new RepeatForever(component, (ctx) => {
        rotate_speed *= 0.8
        ctx.rotateBy(a, rotate_speed, a > 0? RotationType.Clockwise : RotationType.CounterClockwise)
      }),
      new MoveTo(component, destination.x, destination.y, Math.random() * 50 + 200),
      new ActionSequence(component, (ctx) => {
        ctx.scaleTo(0, 0, destination.normalize().x, destination.normalize().y)
            .die()
      })
    ]))
  }

  toggleDance() {
    if (this.complete) {
      this.stopDance();
    } else {
      this.dance();
    }
  }

  // TODO: Dance is a bit crap.
  //  We could do better by spawning limbs and animating properly.
  //  Celebration music would be nice too.
  //  And the Dance button should look cooler when it's active.
  dance() {
    this.complete = true;
    this.engine.music_manager.stop();
    this.engine.get_random_sound(SOUND_TYPE.VICTORY_STINGER)?.play();
    this.components.forEach(component => this.killComponent(component, vec(1000, 1000)))

    // Play celebration effects
    this.engine.currentScene.camera.shake(5, 5, 2000);
    this.celebration_text = new Label({
      text: "Party time!",
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
  }

  stopDance() {
    this.complete = false
    this.engine.music_manager.play()
    this.celebration_text?.kill()
    this.particle_emitters.forEach(e => e.kill())
  }
}
