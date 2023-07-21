import {ImageSource, Sound} from "excalibur";

const eyes: {[key: string]: ImageSource} = {}
const eye_count = 20;
for (let i = 1; i <= eye_count; i++) {
  const name = `eyes_${i >= 10? i.toString() : "0" + i.toString()}`;
  eyes[name] = new ImageSource(`${import.meta.env.BASE_URL}images/eyes/${name}.png`);
}

const mouth: {[key: string]: ImageSource} = {}
const mouth_count = 24;
for (let i = 1; i <= mouth_count; i++) {
  const name = `mouth_${i >= 10? i.toString() : "0" + i.toString()}`;
  mouth[name] = new ImageSource(`${import.meta.env.BASE_URL}images/mouth/${name}.png`);
}

const potato: {[key: string]: ImageSource} = {}
const potato_count = 4;
for (let i = 1; i <= potato_count; i++) {
  const name = `potato_${i >= 10? i.toString() : "0" + i.toString()}`;
  potato[name] = new ImageSource(`${import.meta.env.BASE_URL}images/${name}.png`);
}

const ImageResources: {[key: string]: ImageSource} = {
  ...eyes,
  ...mouth,
  ...potato,
  thief: new ImageSource(`${import.meta.env.BASE_URL}images/rocket/saucer_sheet.png`),
};

export const random_resource_key_by_type: (type: string) => string = (type: string) => {
  const matches = Object.keys(ImageResources).filter(k => k.startsWith(type));
  return matches[Math.floor(Math.random() * matches.length)];
}
export const random_resource_by_type: (type: string) => ImageSource = (type: string) => ImageResources[random_resource_key_by_type(type)]

const SoundResources = {
  annoyed_01: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_01.mp3`),
  annoyed_02: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_02.mp3`),
  annoyed_03: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_03.wav`),
  annoyed_04: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_04.wav`),
  annoyed_05: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_05.wav`),
  annoyed_06: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_06.wav`),
  bubble_01: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_01.wav`),
  bubble_02: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_02.wav`),
  bubble_03: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_03.wav`),
  bubble_04: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_04.wav`),
  bubble_05: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_05.wav`),
  bubble_06: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_06.wav`),
  chime: new Sound(`${import.meta.env.BASE_URL}sounds/chime.mp3`),
  click: new Sound(`${import.meta.env.BASE_URL}sounds/click.mp3`),
  fanfare: new Sound(`${import.meta.env.BASE_URL}sounds/fanfare.mp3`),
  failure: new Sound(`${import.meta.env.BASE_URL}sounds/failure.wav`),
  laugh_01: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_01.mp3`),
  laugh_02: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_02.wav`),
  laugh_03: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_03.wav`),
  laugh_04: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_04.wav`),
  laugh_05: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_05.wav`),
  laugh_06: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_06.ogg`),
  laugh_07: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_07.mp3`),
  laugh_08: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_08.mp3`),
  mumble_01: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_01.ogg`),
  mumble_02: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_02.ogg`),
  mumble_03: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_03.ogg`),
  mumble_04: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_04.ogg`),
  mumble_05: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_05.ogg`),
  mumble_06: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_06.mp3`),
  mumble_07: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_07.wav`),
  mumble_08: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_08.wav`),
  mumble_09: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_09.wav`),
  mumble_10: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_10.wav`),
  mumble_11: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_11.wav`),
  mumble_12: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_12.wav`),
  mumble_13: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_13.wav`),
  mumble_14: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_14.wav`),
  mumble_15: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_15.wav`),
  mumble_16: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_16.wav`),
  mumble_17: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_17.mp3`),
  music_01: new Sound(`${import.meta.env.BASE_URL}sounds/music_01.mp3`),
  music_02: new Sound(`${import.meta.env.BASE_URL}sounds/music_02.wav`),
  music_03: new Sound(`${import.meta.env.BASE_URL}sounds/music_03.mp3`),
}

export { ImageResources, SoundResources };
