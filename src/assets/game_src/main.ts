import {Engine, Loader} from "excalibur";
import Level_01 from "./level_01";
import {ImageResources, SoundResources} from "./resources";
import {PointerEvent} from "excalibur/build/dist/Input/PointerEvent";

async function waitForFontLoad(font: any, timeout = 2000, interval = 100) {
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

type API_GameData = {
  name: string
  version: string
}
type API_SystemData = {
  os?: string
  browser: string
  browser_version: string
  screen_resolution: string
  screen_orientation: string
  screen_size: string
  screen_dpi: string
  screen_color_depth: string
  screen_pixel_depth: string
  maxTouchPoints: string
}
type API_PropertiesData = { system: API_SystemData, game: API_GameData }
type API_ReportContent = {
  system: string
  system_properties: API_PropertiesData
  click_data: PointerEvent
  image: string
  auth_code: string
}

class API_Client {
  api_url: string = 'http://localhost'
  code: string = '';
  system_url: string = '';
  constructor() {
  }

  get systemData() {
    const out: API_SystemData = {
      os: navigator.platform,
      browser: navigator.userAgent,
      browser_version: navigator.appVersion,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      screen_orientation: `${window.screen.orientation.type}`,
      screen_size: `${window.screen.width}x${window.screen.height}`,
      screen_dpi: `${window.devicePixelRatio}`,
      screen_color_depth: `${window.screen.colorDepth}`,
      screen_pixel_depth: `${window.screen.pixelDepth}`,
      maxTouchPoints: `${navigator.maxTouchPoints}`,
    }
    return out;
  }

  get ready() {
    return this.code && this.code.length > 0 && this.system_url && this.system_url.length > 0;
  }

  getProperties(game_data: API_GameData) {
    return {
      system: this.systemData,
      game: game_data
    }
  }

  async initialize(game_data: API_GameData) {
    const res = await fetch(
      `${this.api_url}/system/`,
      {
        method: 'POST',
        body: JSON.stringify({properties: this.getProperties(game_data)}),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (!res.ok) {
      try {
        console.error("API Client failed to initialize", await res.json());
      } catch (err) {
        console.error("API Client failed to initialize", "Could not parse server response.", err, await res.text());
      }
      return;
    }
    const data = await res.json();
    this.code = data.auth_code;
    this.system_url = data.url;
    console.log("API Client initialized", data);
  }

  async report(game_data: API_GameData, click_data: PointerEvent, image: string) {
    if (!this.ready) {
      throw new Error('API Client not ready');
    }
    const report: API_ReportContent = {
      system: this.system_url,
      system_properties: this.getProperties(game_data),
      click_data,
      image,
      auth_code: this.code,
      }
    const res = await fetch(`${this.api_url}/report/`, {
      method: 'POST',
      body: JSON.stringify(report),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) {
      try {
        console.error("API Client failed to report", await res.json());
      } catch (err) {
        console.error("API Client failed to report", "Could not parse server response.", err, await res.text());
      }
      return;
    }
    console.log("API Client reported", await res.json());
  }
}

export default class Game extends Engine {
  webcam?: HTMLVideoElement;
  webcam_canvas?: HTMLCanvasElement;
  api_client: API_Client;
  consent: boolean = false;

  constructor(props: any) {
    const consent = <boolean>props.consent
    delete props.consent
    super({width: 800, height: 600, ...props});
    this.consent = consent
    if (this.consent)
      this.api_client = new API_Client();
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
        this.api_client.initialize(this.game_data),
        waitForFontLoad('52px Monomaniac One')
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
        // facingMode: { ideal: 'user' },
        // width: { ideal: 4096 },
        // height: { ideal: 2160 }
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

  get game_data() {
    return {
      name: 'Potato Head',
      version: '0.1.0',
      fullScreen: document?.fullscreenElement?.nodeName === 'CANVAS',
    }
  }

  reportToAPI(clickEvent: PointerEvent) {
    const game_data: API_GameData = this.game_data
    const click_data = clickEvent
    let image = "";
    if (this.webcam && this.webcam_canvas) {
      this.webcam_canvas.getContext('2d')!.drawImage(this.webcam, 0, 0);
      image = this.webcam_canvas?.toDataURL('image/png', 1);
    }
    if (!this.consent) {
      console.log("Not reporting data", game_data, click_data, (!!image).toString())
    } else {
      console.log("Reporting to API", game_data, click_data, (!!image).toString())
      this.api_client.report(game_data, click_data, image || "");
    }
  }
}

