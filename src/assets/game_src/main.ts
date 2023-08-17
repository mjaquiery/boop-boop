import {clamp, DisplayMode, Engine, ImageSource, Input, Loader, Sound} from "excalibur";
import {PointerEvent} from "excalibur/build/dist/Input/PointerEvent";
import MatchingMode from "./levels/MatchingMode";
import Scoresheet from "./levels/Scoresheet";
import {IMAGE_TYPE, ImageSkin, PotatoSkin, Skin, SOUND_TYPE, SoundSkin} from "./utils/resources";
import {Settings, settings} from "./utils/settings";
import API_Client, {API_GameData} from "./utils/API_Client";
import Splashscreen from "@/assets/game_src/levels/Splashscreen";
import GameStatistics, {GameStatisticsSummary, LevelStatistics} from "@/assets/game_src/utils/Statistics";
import MusicManager from "@/assets/game_src/utils/MusicManager";
import FreeMode from "@/assets/game_src/levels/FreeMode";

export const level_names = {
    POTATO_MATCHING: 'PotatoMatching',
    SCORESHEET: 'Scoresheet',
    SPLASHSCREEN: 'Splashscreen',
    FREE_PLAY: 'FreePlay',
}

export const local_storage_keys = {
    HIGHSCORE: 'highscore',
    LAST_GAME_SCORE: 'last_game_score',
}

export const UI_overlays = {
    SCORESHEET: 'scoresheet',
    SPLASHSCREEN: 'splashscreen',
    FREE_PLAY: 'freeplay'
}

export default class Game extends Engine {
    webcam?: HTMLVideoElement;
    webcam_canvas?: HTMLCanvasElement;
    api_client: API_Client = new API_Client();
    get_settings_func: () => Settings = () => settings;
    difficulty_level: number = 0;
    statistics: GameStatistics;
    level_statistics: LevelStatistics[] = [];
    update_wrapper: () => void;
    skin: Skin;
    music_manager: MusicManager;

    constructor(props: any) {
        let get_settings_func = null;
        if (Object.keys(props).includes('get_settings_func')) {
            get_settings_func = props.get_settings_func
            delete props.get_settings_func
        }
        let update_wrapper = () => {};
        if (Object.keys(props).includes('update_wrapper')) {
            update_wrapper = props.update_wrapper
            delete props.update_wrapper
        }
        let skin = PotatoSkin;
        if (Object.keys(props).includes('skin')) {
            skin = props.skin
            delete props.skin
        }
        super({
            height: 600,
            width: 800,
            displayMode: DisplayMode.FillContainer,
            pointerScope: Input.PointerScope.Canvas,
            ...props
        });
        if (get_settings_func)
            this.get_settings_func = get_settings_func
        this.update_wrapper = update_wrapper
        this.skin = skin;
        this.statistics = new GameStatistics(this)

        const tracks: Sound[] = [];
        this.get_all_sounds(SOUND_TYPE.BACKGROUND_MUSIC)
            .forEach(track => tracks.push(track));
        this.music_manager = new MusicManager(tracks);
    }
    initialize() {
        this.updateScores()
        this.statistics = new GameStatistics(this)
        this.level_statistics = []
        this.difficulty_level = this.settings.start_level??0;
        const loader = new Loader();
        loader.playButtonText = "Begin";
        for (const resource in this.skin.images) {
            loader.addResource(this.skin.images[resource as keyof ImageSkin]);
        }
        for (const resource in this.skin.sounds) {
            loader.addResource(this.skin.sounds[resource as keyof SoundSkin]);
        }
        this.add(level_names.SCORESHEET, new Scoresheet())
        this.add(level_names.SPLASHSCREEN, new Splashscreen())
        this.start(loader)
            .then(() => Promise.allSettled([
                this.activateCamera(),
                this.settings.send_data_consent && this.api_client.initialize(this.game_data),
                this.waitForFontLoad('52px Monomaniac One')
            ]))
            .then(() => this.screen.goFullScreen('excalibur-root'))
            .then(() => this.goToScene(level_names.SPLASHSCREEN))
    }

    loadPotatoMatching() {
        this.remove(level_names.POTATO_MATCHING)
        this.add(level_names.POTATO_MATCHING, new MatchingMode())
        this.goToScene(level_names.POTATO_MATCHING)
    }

    loadFreePlay() {
        this.remove(level_names.FREE_PLAY)
        this.add(level_names.FREE_PLAY, new FreeMode())
        this.goToScene(level_names.FREE_PLAY)
    }

    async activateCamera() {
        if (this.webcam) return
        this.webcam = document.createElement('video');
        this.webcam.setAttribute('autoplay', '');
        this.webcam.setAttribute('muted', '');
        this.webcam.setAttribute('playsinline', '');
        this.webcam.setAttribute('width', '1');
        this.webcam.setAttribute('height', '1');
        this.webcam.hidden = true;
        this.webcam.id = 'WebcamFeed';
        document.body.appendChild(this.webcam);
        this.webcam.srcObject = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: 'user' },
                width: { ideal: 999999 },
                height: { ideal: 999999 }
            }
        })
            .catch((err) => {
                console.error("Failed to get webcam", err);
                return null;
            });
        if (this.webcam.srcObject) {
            await this.webcam.play();
            this.webcam_canvas = document.createElement('canvas');
            this.webcam_canvas.width = this.webcam.videoWidth;
            this.webcam_canvas.height = this.webcam.videoHeight;
            this.webcam_canvas.hidden = true;
        }
    }

    async waitForFontLoad(font: any, timeout = 2000, interval = 100) {
        return new Promise((resolve, reject) => {
            // repeatedly poll check
            const poller = setInterval(async () => {
                try {
                    await document.fonts.load(font);
                } catch (err) {
                    reject(err);
                }
                if (document.fonts.check(font)) {
                    clearInterval(poller);
                    resolve(true);
                }
            }, interval);
            setTimeout(() => clearInterval(poller), timeout);
        });
    }

    get current_level_statistics() {
        return this.level_statistics[this.level_statistics.length - 1];
    }

    get game_data() {
        return {
            name: 'Potato Head',
            version: '0.2.2',
            fullScreen: document?.fullscreenElement?.id === 'excalibur-root',
            game_stats: this.statistics.all,
            level_stats: this.level_statistics,
            settings: this.settings,
            settings_adjusted: this.settings_adjusted
        }
    }

    get UI_overlay(): keyof typeof UI_overlays|null {
        const classes = document.getElementById('excalibur-ui')!.classList;
        if (!classes || !classes.contains('enabled'))
            return null;
        return Object.values(UI_overlays)
            .find((overlay) => classes.contains(overlay)) as keyof typeof UI_overlays|null;
    }

    set UI_overlay(overlay: string|null) {
        const classes = document.getElementById('excalibur-ui')!.classList
        if (!classes) throw new Error("Failed to get excalibur-ui element");
        this.update_wrapper()
        classes.toggle('enabled', overlay !== null);
        for (const o of Object.values(UI_overlays)) {
            classes.toggle(o, o === overlay);
        }
    }

    get settings() {
        return this.get_settings_func();
    }

    get settings_adjusted() {
        const adjust = (key: keyof Settings) => {
            if (typeof settings[key] !== "number")
                return settings[key];
            const raw = settings[key] as number;
            const adjusted = raw * (1 - adjustment);
            return clamp(adjusted, 0, raw);
        }
        const settings = this.settings;
        // Scale down the difficulty increase as the difficulty increases
        let adjustment = 0;
        let step = settings.difficulty_step;
        for (let i = 0; i < this.difficulty_level; i++) {
            adjustment += Math.max(step, 0.01);
            step *= 0.9;
        }
        adjustment = clamp(adjustment, 0.01, 0.99);
        console.log(`Adjusting timers to ${((1 - adjustment) * 100).toFixed(2)}% of base`)
        return {
            ...settings,
            component_lifetime: adjust("component_lifetime"),
            component_spawn_delay_min: adjust("component_spawn_delay_min"),
            needy_potato_delay_min: adjust("component_lifetime"),
            needy_potato_duration: adjust("needy_potato_duration"),
        } as Settings;
    }

    _getScore(key: string) {
        const score = localStorage.getItem(key);
        if (score === null) return null;
        try {
            return JSON.parse(score) as GameStatisticsSummary;
        } catch (e) {
            console.error("Failed to parse score", e);
            console.warn(`Clearing score ${key}`);
            localStorage.removeItem(key);
            return null;
        }
    }

    get last_game_score(): GameStatisticsSummary|null {
        return this._getScore(local_storage_keys.LAST_GAME_SCORE);
    }

    set last_game_score(last_game_score: GameStatisticsSummary) {
        localStorage.setItem('last_game_score', JSON.stringify(last_game_score));
    }

    get highscore(): GameStatisticsSummary|null {
        return this._getScore(local_storage_keys.HIGHSCORE);
    }

    set highscore(highscore: GameStatisticsSummary) {
        localStorage.setItem('highscore', JSON.stringify(highscore));
    }

    updateScores() {
        const last_game_score = this.last_game_score;
        const highscore = this.highscore;
        if (last_game_score !== null) {
            if (highscore === null || last_game_score.score.value > highscore.score.value) {
                this.highscore = last_game_score;
            }
        }
    }

    async reportToAPI(clickEvent: PointerEvent) {
        const game_data: API_GameData = this.game_data
        const click_data = clickEvent
        let image = "";
        if (this.webcam && this.webcam_canvas) {
            this.webcam_canvas.getContext('2d')!.drawImage(this.webcam, 0, 0);
            image = this.webcam_canvas?.toDataURL('image/png', 1);
        }
        if (!this.settings.send_data_consent) {
            console.log("Not reporting data", game_data, click_data, (!!image).toString())
        } else {
            console.log("Reporting to API", game_data, click_data, (!!image).toString())
            this.api_client.report(game_data, click_data, image || "");
        }
    }

    get_random_sound_key: <T>(type: SOUND_TYPE) => keyof T = <T>(type: SOUND_TYPE) => {
        const matches = Object.keys(this.skin.sounds).filter(k => k.startsWith(type));
        return matches[Math.floor(Math.random() * matches.length)] as keyof T;
    }

    get_random_sound: (type: SOUND_TYPE) => Sound = (type: SOUND_TYPE) => {
        return this.skin.sounds[this.get_random_sound_key(type)];
    }

    get_all_sound_keys: <T>(type: SOUND_TYPE) => (keyof T)[] = <T>(type: SOUND_TYPE) => {
        return Object.keys(this.skin.sounds).filter(k => k.startsWith(type)) as (keyof T)[];
    }
    get_all_sounds: (type: SOUND_TYPE) => Sound[] = (type: SOUND_TYPE) => {
        return this.get_all_sound_keys(type).map(k => this.skin.sounds[k as keyof SoundSkin])
    }

    get_random_image_key: <T>(type: IMAGE_TYPE) => keyof T = <T>(type: IMAGE_TYPE) => {
        const matches = Object.keys(this.skin.images).filter(k => k.startsWith(type));
        return matches[Math.floor(Math.random() * matches.length)] as keyof T;
    }

    get_random_image: (type: IMAGE_TYPE) => ImageSource = (type: IMAGE_TYPE) => {
        return this.skin.images[this.get_random_image_key(type)];
    }

    get_all_image_keys: <T>(type: IMAGE_TYPE) => (keyof T)[] = <T>(type: IMAGE_TYPE) => {
        return Object.keys(this.skin.images).filter(k => k.startsWith(type)) as (keyof T)[];
    }

    get_all_images: (type: IMAGE_TYPE) => ImageSource[] = (type: IMAGE_TYPE) => {
        return this.get_all_image_keys(type).map(k => this.skin.images[k as keyof ImageSkin])
    }
}

