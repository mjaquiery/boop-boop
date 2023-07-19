import {Engine, Loader} from "excalibur";
import {PointerEvent} from "excalibur/build/dist/Input/PointerEvent";
import Level_01 from "./level_01";
import {ImageResources, SoundResources} from "./resources";
import {Settings, settings} from "./settings";
import API_Client, {API_GameData} from "./API_Client";


export default class Game extends Engine {
  webcam?: HTMLVideoElement;
  webcam_canvas?: HTMLCanvasElement;
  api_client: API_Client = new API_Client();
  get_settings_func: () => Settings = () => settings;

  constructor(props: any) {
    let get_settings_func = null;
    if (Object.keys(props).includes('get_settings_func')) {
      get_settings_func = props.get_settings_func
      console.log('get_settings_func()', get_settings_func())
      delete props.get_settings_func
    }
    super({width: 800, height: 600, ...props});
    if (get_settings_func)
      this.get_settings_func = get_settings_func
  }
  initialize() {
    const loader = new Loader();
    for (const resource in ImageResources) {
      loader.addResource(ImageResources[resource]);
    }
    for (const resource in SoundResources) {
      const r = resource as keyof typeof SoundResources;
      loader.addResource(SoundResources[r])
    }
    this.add('level_01', new Level_01())
    this.start(loader)
      .then(() => Promise.allSettled([
        this.activateCamera(),
        this.settings.send_data_consent && this.api_client.initialize(this.game_data),
        this.waitForFontLoad('52px Monomaniac One')
      ]))
      .then(() => this.screen.goFullScreen())
      .then(() => this.goToScene('level_01'))
  }

  async activateCamera() {
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

  get game_data() {
    return {
      name: 'Potato Head',
      version: '0.1.0',
      fullScreen: document?.fullscreenElement?.nodeName === 'CANVAS',
    }
  }

  get settings() {
    return this.get_settings_func();
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
}

