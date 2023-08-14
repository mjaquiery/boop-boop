import {ImageSource, Sound} from "excalibur";

type integer = number;

export type EyesImage = { [key: `eyes_${integer}`]: ImageSource }
export type MouthImage = { [key: `mouth_${integer}`]: ImageSource }
export type PotatoImage = { [key: `potato_${integer}`]: ImageSource }
export type ThiefImage = { [key: `thief_${integer}`]: ImageSource }

export type ImageSkin = EyesImage & MouthImage & PotatoImage & ThiefImage;

export type BackgroundMusic = { [key: `background_music_${integer}`]: Sound }

export type ThiefFleeSound = { [key: `thief_flee_${integer}`]: Sound }
export type ThiefHitSound = { [key: `thief_hit_${integer}`]: Sound }
export type ThiefAppearSound = { [key: `thief_appear_${integer}`]: Sound }
export type ThiefWorkSound = { [key: `thief_work_${integer}`]: Sound }
export type ThiefVictorySound = { [key: `thief_victory_${integer}`]: Sound }
export type ThiefSound = ThiefFleeSound & ThiefHitSound & ThiefAppearSound & ThiefWorkSound & ThiefVictorySound;

export type ComponentSpawnSound = { [key: `component_spawn_${integer}`]: Sound }
export type ComponetClickedSound = { [key: `component_clicked_${integer}`]: Sound }
export type ComponentCorrectSound = { [key: `component_correct_${integer}`]: Sound }
export type ComponentIncorrectSound = { [key: `component_incorrect_${integer}`]: Sound }
export type ComponentSound = ComponentSpawnSound & ComponetClickedSound & ComponentCorrectSound & ComponentIncorrectSound;

export type VictoryStingerSound = { [key: `victory_stinger_${integer}`]: Sound }
export type FailureStingerSound = { [key: `failure_stinger_${integer}`]: Sound }
export type StingerSound = VictoryStingerSound & FailureStingerSound;

export type SoundSkin = ThiefSound & ComponentSound & StingerSound & BackgroundMusic;

export type Skin = ImageSkin & SoundSkin;

const zeroPad = (num: integer, places: integer = 2) => String(num).padStart(places, '0')

const eyes: EyesImage = {}
const eye_count = 20;
for (let i = 1; i <= eye_count; i++) {
  const key = `eyes_${i}` as keyof EyesImage;
  const name = `eyes_${zeroPad(i)}`;
  eyes[key] = new ImageSource(`${import.meta.env.BASE_URL}images/eyes/${name}.png`);
}

const mouth: MouthImage = {}
const mouth_count = 24;
for (let i = 1; i <= mouth_count; i++) {
  const key = `mouth_${i}` as keyof MouthImage;
  const name = `mouth_${zeroPad(i)}`;
  mouth[key] = new ImageSource(`${import.meta.env.BASE_URL}images/mouth/${name}.png`);
}

const potato: PotatoImage = {}
const potato_count = 4;
for (let i = 1; i <= potato_count; i++) {
  const key = `potato_${i}` as keyof PotatoImage;
  const name = `potato_${zeroPad(i)}`;
  potato[key] = new ImageSource(`${import.meta.env.BASE_URL}images/${name}.png`);
}

const thief: ThiefImage = {
  thief_1: new ImageSource(`${import.meta.env.BASE_URL}images/rocket/saucer_sheet.png`)
}

export const ImageResources: ImageSkin = {
  ...eyes,
  ...mouth,
  ...potato,
  ...thief
};


const background_music: BackgroundMusic = {}
const background_music_count = 32
const background_music_ids: number[] = []
for (let i = 1; i <= background_music_count; i++)
  background_music_ids.push(i);
background_music_ids.forEach(i => {
  if ([4, 5, 23, 27, 28, 29, 30, 31].includes(i))
    return;
  const key = `background_music_${i}` as keyof BackgroundMusic;
  const name = `bgm_${i}`;
  background_music[key] = new Sound(`${import.meta.env.BASE_URL}sounds/under-restricted-license/${name}.wav`);
});

const thief_hit_sound: ThiefHitSound = {
  thief_hit_1: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_01.mp3`),
  thief_hit_2: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_02.mp3`),
  thief_hit_3: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_03.wav`),
  thief_hit_4: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_04.wav`),
  thief_hit_5: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_05.wav`),
  thief_hit_6: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_06.wav`)
}

const thief_flee_sound: ThiefFleeSound = {}

const thief_appear_sound: ThiefAppearSound = {}

const thief_work_sound: ThiefWorkSound = {
  thief_work_1: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_01.ogg`),
  thief_work_2: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_02.ogg`),
  thief_work_3: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_03.ogg`),
  thief_work_4: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_04.ogg`),
  thief_work_5: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_05.ogg`),
  thief_work_6: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_06.mp3`),
  thief_work_7: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_07.wav`),
  thief_work_8: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_08.wav`),
  thief_work_9: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_09.wav`),
  thief_work_0: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_10.wav`),
  thief_work_11: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_11.wav`),
  thief_work_12: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_12.wav`),
  thief_work_13: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_13.wav`),
  thief_work_14: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_14.wav`),
  thief_work_15: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_15.wav`),
  thief_work_16: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_16.wav`),
  thief_work_17: new Sound(`${import.meta.env.BASE_URL}sounds/mumble_17.mp3`)
}

const thief_victory_sound: ThiefVictorySound = {
  thief_victory_1: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_01.mp3`),
  thief_victory_2: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_02.wav`),
  thief_victory_3: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_03.wav`),
  thief_victory_4: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_04.wav`),
  thief_victory_5: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_05.wav`),
  thief_victory_6: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_06.ogg`),
  thief_victory_7: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_07.mp3`),
  thief_victory_8: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_08.mp3`)
}

const component_spawn_sound: ComponentSpawnSound = {
  component_spawn_1: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_01.wav`),
  component_spawn_2: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_02.wav`),
  component_spawn_3: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_03.wav`),
  component_spawn_4: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_04.wav`),
  component_spawn_5: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_05.wav`),
  component_spawn_6: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_06.wav`)
}

const component_clicked_sound: ComponetClickedSound = {
  component_clicked_1: new Sound(`${import.meta.env.BASE_URL}sounds/click.mp3`),
}

const component_correct_sound: ComponentCorrectSound = {
  component_correct_1: new Sound(`${import.meta.env.BASE_URL}sounds/chime.mp3`),
}

const component_incorrect_sound: ComponentIncorrectSound = {}

const victory_stinger_sound: VictoryStingerSound = {
  victory_stinger_1: new Sound(`${import.meta.env.BASE_URL}sounds/fanfare.mp3`),
}

const failure_stinger_sound: FailureStingerSound = {
  failure_stinger_1: new Sound(`${import.meta.env.BASE_URL}sounds/failure.wav`),
}

export const SoundResources: SoundSkin = {
  ...background_music,
  ...thief_hit_sound,
  ...thief_flee_sound,
  ...thief_appear_sound,
  ...thief_work_sound,
  ...thief_victory_sound,
  ...component_spawn_sound,
  ...component_clicked_sound,
  ...component_correct_sound,
  ...component_incorrect_sound,
  ...victory_stinger_sound,
  ...failure_stinger_sound
}

export const PotatoSkin: Skin = {
  ...ImageResources,
  ...SoundResources
}
