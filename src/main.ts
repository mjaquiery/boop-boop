import {Engine, Loader} from "excalibur";
import Level_01 from "./level_01";
import {ImageResources, SoundResources} from "./resources";

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

export class Game extends Engine {
  webcam?: HTMLVideoElement;

  constructor() {
    super({width: 800, height: 600});
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
      .then(() => this.activateCamera())
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
    this.webcam.style.opacity = '0';
    this.webcam.id = 'WebcamFeed';
    document.body.appendChild(this.webcam);
    this.webcam.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
    await this.webcam.play();
  }
}
const game = new Game();
waitForFontLoad('52px Monomaniac One')
  .then(() => game.initialize());