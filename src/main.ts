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

async function activateCamera() {
  const video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('width', '1');
  video.setAttribute('height', '1');
  video.style.opacity = '0';
  video.id = 'videoelement';
  document.body.appendChild(video);
  video.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
  await video.play();
}

export class Game extends Engine {
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
      .then(() => activateCamera())
      .then(() => this.screen.goFullScreen())
      .then(() => this.goToScene('level_01'))
  }
}
const game = new Game();
waitForFontLoad('52px Monomaniac One')
  .then(() => game.initialize());