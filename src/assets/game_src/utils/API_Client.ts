import {PointerEvent} from "excalibur/build/dist/Input/PointerEvent";

export type API_GameData = {
  name: string
  version: string
}
export type API_SystemData = {
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
export type API_PropertiesData = { system: API_SystemData, game: API_GameData }
export type API_ReportContent = {
  system: string
  system_properties: API_PropertiesData
  click_data: PointerEvent
  image: string
  auth_code: string
}

export default class API_Client {
  api_url: string = 'http://localhost'
  code: string = '';
  system_url: string = '';
  initialization_started: boolean = false;
  initialization_complete: boolean = false;

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

  async waitUntilReady(game_data: API_GameData) {
    if (!this.initialization_started || this.initialization_complete && !this.ready)
      await this.initialize(game_data);
    return new Promise((resolve, reject) => {
      const poller = setInterval(() => {
        if (this.ready) {
          clearInterval(poller);
          resolve(true);
        } else if (this.initialization_complete) {
          clearInterval(poller);
          reject("API Client failed to initialize");
        }
      }, 100);
    });
  }

  getProperties(game_data: API_GameData) {
    return {
      system: this.systemData,
      game: game_data
    }
  }

  async initialize(game_data: API_GameData) {
    this.initialization_started = true;
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
    this.initialization_complete = true;
    console.log("API Client initialized", data);
  }

  async report(game_data: API_GameData, click_data: PointerEvent, image: string) {
    if (!this.ready)
      await this.waitUntilReady(game_data);

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
