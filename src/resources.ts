import {ImageSource, Sound} from "excalibur";
// Load all images and sounds here so vite can bundle them
const eye_images: string[] = await Promise.all([
  import('../images/eyes/eyes_01.png'),
  import('../images/eyes/eyes_02.png'),
  import('../images/eyes/eyes_03.png'),
  import('../images/eyes/eyes_04.png'),
  import('../images/eyes/eyes_05.png'),
  import('../images/eyes/eyes_06.png'),
  import('../images/eyes/eyes_07.png'),
  import('../images/eyes/eyes_08.png'),
  import('../images/eyes/eyes_09.png'),
  import('../images/eyes/eyes_10.png'),
  import('../images/eyes/eyes_11.png'),
  import('../images/eyes/eyes_12.png'),
  import('../images/eyes/eyes_13.png'),
  import('../images/eyes/eyes_14.png'),
  import('../images/eyes/eyes_15.png'),
  import('../images/eyes/eyes_16.png'),
  import('../images/eyes/eyes_17.png'),
  import('../images/eyes/eyes_18.png'),
  import('../images/eyes/eyes_19.png'),
  import('../images/eyes/eyes_20.png')
]);

const mouth_images: string[] = await Promise.all([
  import('../images/mouth/mouth_01.png'),
  import('../images/mouth/mouth_02.png'),
  import('../images/mouth/mouth_03.png'),
  import('../images/mouth/mouth_04.png'),
  import('../images/mouth/mouth_05.png'),
  import('../images/mouth/mouth_06.png'),
  import('../images/mouth/mouth_07.png'),
  import('../images/mouth/mouth_08.png'),
  import('../images/mouth/mouth_09.png'),
  import('../images/mouth/mouth_10.png'),
  import('../images/mouth/mouth_11.png'),
  import('../images/mouth/mouth_12.png'),
  import('../images/mouth/mouth_13.png'),
  import('../images/mouth/mouth_14.png'),
  import('../images/mouth/mouth_15.png'),
  import('../images/mouth/mouth_16.png'),
  import('../images/mouth/mouth_17.png'),
  import('../images/mouth/mouth_18.png'),
  import('../images/mouth/mouth_19.png'),
  import('../images/mouth/mouth_20.png'),
  import('../images/mouth/mouth_21.png'),
  import('../images/mouth/mouth_22.png'),
  import('../images/mouth/mouth_23.png'),
  import('../images/mouth/mouth_24.png')
]);

const potato_images: string[] = await Promise.all([
  import('../images/potato_01.png'),
  import('../images/potato_02.png'),
  import('../images/potato_03.png'),
  import('../images/potato_04.png')
]);

let eyes: {[key: string]: ImageSource} = {}
const eye_count = 20;
for (let i = 1; i <= eye_count; i++) {
  const name = `eyes_${i >= 10? i.toString() : "0" + i.toString()}`;
  eyes[name] = new ImageSource(eye_images[i-1]);
}

let mouth: {[key: string]: ImageSource} = {}
const mouth_count = 24;
for (let i = 1; i <= mouth_count; i++) {
  const name = `mouth_${i >= 10? i.toString() : "0" + i.toString()}`;
  mouth[name] = new ImageSource(mouth_images[i-1]);
}

let potato: {[key: string]: ImageSource} = {}
const potato_count = 4;
for (let i = 1; i <= potato_count; i++) {
  const name = `potato_${i >= 10? i.toString() : "0" + i.toString()}`;
  potato[name] = new ImageSource(potato_images[i-1]);
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

const sounds: Awaited<{ readonly default: string }>[] = await Promise.all([
  import('../sounds/click.mp3'),
  import('../sounds/chime.mp3'),
  import('../sounds/fanfare.mp3'),
  import('../sounds/bubble_01.wav'),
  import('../sounds/bubble_02.wav'),
  import('../sounds/bubble_03.wav'),
  import('../sounds/bubble_04.wav'),
  import('../sounds/bubble_05.wav'),
  import('../sounds/bubble_06.wav'),
  import('../sounds/music_01.mp3'),
  import('../sounds/music_02.wav'),
  import('../sounds/music_03.mp3'),
]);

const SoundResources = {
  click: new Sound(sounds[0].default),
  chime: new Sound(sounds[1].default),
  fanfare: new Sound(sounds[2].default),
  bubble_01: new Sound(sounds[3].default),
  bubble_02: new Sound(sounds[4].default),
  bubble_03: new Sound(sounds[5].default),
  bubble_04: new Sound(sounds[6].default),
  bubble_05: new Sound(sounds[7].default),
  bubble_06: new Sound(sounds[8].default),
  music_01: new Sound(sounds[9].default),
  music_02: new Sound(sounds[10].default),
  music_03: new Sound(sounds[11].default),
}

export { ImageResources, SoundResources };