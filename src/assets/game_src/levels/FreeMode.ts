import {
    CollisionType,
    Color,
    EmitterType,
    Font,
    FontUnit,
    Label,
    ParticleEmitter,
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
import Game from "../main";
import {Settings} from "@/assets/game_src/utils/settings";
import {
    COMPONENT_TYPE,
    ComponentImages,
    EyesImages,
    IMAGE_TYPE,
    MouthImages,
    PotatoImages,
    SOUND_TYPE
} from "@/assets/game_src/utils/resources";
import ComponentSlot from "@/assets/game_src/actors/ComponentSlot";

const potato_size = {width: 150, height: 200};
const component_size = {width: potato_size.width * .8, height: potato_size.height / 5}

const offsets: {[type in ComponentType]: Vector} = {
    eyes: vec(0, -20),
    mouth: vec(0, 40),
}

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
    }

    onActivate() {
        this.clean();

        this.component_slots = Object.keys(offsets).map((type) => {
            const t = type as ComponentType;
            return new ComponentSlot({
                x: this.engine.halfDrawWidth + offsets[t].x,
                y: this.engine.halfDrawHeight + offsets[t].y
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
            this.killComponent(this.selected_component, vec(10, 10));
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
    }

    dance() {
        this.complete = true;
        this.stats.time_taken.value = this.engine.clock.now() - this._start_time;
        this.engine.music_manager.stop();
        this.engine.get_random_sound(SOUND_TYPE.VICTORY_STINGER)?.play();
        this.components.forEach(component => this.killComponent(component, vec(1000, 1000)))

        // Play celebration effects
        this.engine.currentScene.camera.shake(5, 5, Infinity);
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
}
