import {ImageSource, Sound} from "excalibur";

let eyes: {[key: string]: ImageSource} = {}
const eye_count = 20;
for (let i = 1; i <= eye_count; i++) {
  const name = `eyes_${i >= 10? i.toString() : "0" + i.toString()}`;
  eyes[name] = new ImageSource(`/images/eyes/${name}.png`);
}

let mouth: {[key: string]: ImageSource} = {}
const mouth_count = 24;
for (let i = 1; i <= mouth_count; i++) {
  const name = `mouth_${i >= 10? i.toString() : "0" + i.toString()}`;
  mouth[name] = new ImageSource(`/images/mouth/${name}.png`);
}

let potato: {[key: string]: ImageSource} = {}
const potato_count = 4;
for (let i = 1; i <= potato_count; i++) {
  const name = `potato_${i >= 10? i.toString() : "0" + i.toString()}`;
  potato[name] = new ImageSource(`/images/${name}.png`);
}

let ImageResources: {[key: string]: ImageSource} = {
  ...eyes,
  ...mouth,
  ...potato,
};

export const random_resource_key_by_type: (type: string) => string = (type: string) => {
  const matches = Object.keys(ImageResources).filter(k => k.startsWith(type));
  return matches[Math.floor(Math.random() * matches.length)];
}
export const random_resource_by_type: (type: string) => ImageSource = (type: string) => ImageResources[random_resource_key_by_type(type)]

const SoundResources = {
  click: new Sound("/sounds/click.mp3"),
  chime: new Sound("/sounds/chime.mp3"),
  fanfare: new Sound("/sounds/fanfare.mp3"),
  bubble_01: new Sound("/sounds/bubble_01.wav"),
  bubble_02: new Sound("/sounds/bubble_02.wav"),
  bubble_03: new Sound("/sounds/bubble_03.wav"),
  bubble_04: new Sound("/sounds/bubble_04.wav"),
  bubble_05: new Sound("/sounds/bubble_05.wav"),
  bubble_06: new Sound("/sounds/bubble_06.wav"),
  music_01: new Sound("/sounds/music_01.mp3"),
  music_02: new Sound("/sounds/music_02.wav"),
  music_03: new Sound("/sounds/music_03.mp3"),
}

export { ImageResources, SoundResources };