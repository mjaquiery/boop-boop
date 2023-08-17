import {ImageSource, Sound} from "excalibur";

type integer = number;

export const enum IMAGE_TYPE {
    EYES = 'eyes',
    MOUTH = 'mouth',
    POTATO = 'potato',
    THIEF = 'thief'
}

export type EyesImages = { [key: `${IMAGE_TYPE.EYES}_${integer}`]: ImageSource }
export type MouthImages = { [key: `${IMAGE_TYPE.MOUTH}_${integer}`]: ImageSource }
export type ComponentImages = EyesImages & MouthImages;
export type PotatoImages = { [key: `${IMAGE_TYPE.POTATO}_${integer}`]: ImageSource }
export type ThiefImages = { [key: `${IMAGE_TYPE.THIEF}_${integer}`]: ImageSource }
export type ImageSkin = ComponentImages & PotatoImages & ThiefImages;

export const enum SOUND_TYPE {
    BACKGROUND_MUSIC = 'background_music',
    THIEF_HIT = 'thief_hit',
    THIEF_FLEE = 'thief_flee',
    THIEF_APPEAR = 'thief_appear',
    THIEF_WORK = 'thief_work',
    THIEF_VICTORY = 'thief_victory',
    COMPONENT_SPAWN = 'component_spawn',
    COMPONENT_CLICKED = 'component_clicked',
    COMPONENT_CORRECT = 'component_correct',
    COMPONENT_INCORRECT = 'component_incorrect',
    VICTORY_STINGER = 'victory_stinger',
    FAILURE_STINGER = 'failure_stinger'
}

export type BackgroundMusic = { [key: `${SOUND_TYPE.BACKGROUND_MUSIC}_${integer}`]: Sound }

export type ThiefFleeSounds = { [key: `${SOUND_TYPE.THIEF_FLEE}_${integer}`]: Sound }
export type ThiefHitSounds = { [key: `${SOUND_TYPE.THIEF_HIT}_${integer}`]: Sound }
export type ThiefAppearSounds = { [key: `${SOUND_TYPE.THIEF_APPEAR}_${integer}`]: Sound }
export type ThiefWorkSounds = { [key: `${SOUND_TYPE.THIEF_WORK}_${integer}`]: Sound }
export type ThiefVictorySounds = { [key: `${SOUND_TYPE.THIEF_VICTORY}_${integer}`]: Sound }
export type ThiefSounds = ThiefFleeSounds & ThiefHitSounds & ThiefAppearSounds & ThiefWorkSounds & ThiefVictorySounds;

export type ComponentSpawnSounds = { [key: `${SOUND_TYPE.COMPONENT_SPAWN}_${integer}`]: Sound }
export type ComponetClickedSounds = { [key: `${SOUND_TYPE.COMPONENT_CLICKED}_${integer}`]: Sound }
export type ComponentCorrectSounds = { [key: `${SOUND_TYPE.COMPONENT_CORRECT}_${integer}`]: Sound }
export type ComponentIncorrectSounds = { [key: `${SOUND_TYPE.COMPONENT_INCORRECT}_${integer}`]: Sound }
export type ComponentSounds = ComponentSpawnSounds & ComponetClickedSounds & ComponentCorrectSounds & ComponentIncorrectSounds;

export type VictoryStingerSounds = { [key: `${SOUND_TYPE.VICTORY_STINGER}_${integer}`]: Sound }
export type FailureStingerSounds = { [key: `${SOUND_TYPE.FAILURE_STINGER}_${integer}`]: Sound }
export type StingerSounds = VictoryStingerSounds & FailureStingerSounds;

export type SoundSkin = ThiefSounds & ComponentSounds & StingerSounds & BackgroundMusic;

export type Skin = { images: ImageSkin, sounds: SoundSkin };

const zeroPad = (num: integer, places: integer = 2) => String(num).padStart(places, '0')

const eyes: EyesImages = {}
const eye_count = 20;
for (let i = 1; i <= eye_count; i++) {
  const key = `eyes_${i}` as keyof EyesImages;
  const name = `eyes_${zeroPad(i)}`;
  eyes[key] = new ImageSource(`${import.meta.env.BASE_URL}images/eyes/${name}.png`);
}

const mouth: MouthImages = {}
const mouth_count = 24;
for (let i = 1; i <= mouth_count; i++) {
  const key = `mouth_${i}` as keyof MouthImages;
  const name = `mouth_${zeroPad(i)}`;
  mouth[key] = new ImageSource(`${import.meta.env.BASE_URL}images/mouth/${name}.png`);
}

const potato: PotatoImages = {}
const potato_count = 4;
for (let i = 1; i <= potato_count; i++) {
  const key = `potato_${i}` as keyof PotatoImages;
  const name = `potato_${zeroPad(i)}`;
  potato[key] = new ImageSource(`${import.meta.env.BASE_URL}images/${name}.png`);
}

const thief: ThiefImages = {
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

const thief_hit_sound: ThiefHitSounds = {
  thief_hit_1: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_01.mp3`),
  thief_hit_2: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_02.mp3`),
  thief_hit_3: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_03.wav`),
  thief_hit_4: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_04.wav`),
  thief_hit_5: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_05.wav`),
  thief_hit_6: new Sound(`${import.meta.env.BASE_URL}sounds/annoyed_06.wav`)
}

const thief_flee_sound: ThiefFleeSounds = {}

const thief_appear_sound: ThiefAppearSounds = {}

const thief_work_sound: ThiefWorkSounds = {
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

const thief_victory_sound: ThiefVictorySounds = {
  thief_victory_1: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_01.mp3`),
  thief_victory_2: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_02.wav`),
  thief_victory_3: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_03.wav`),
  thief_victory_4: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_04.wav`),
  thief_victory_5: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_05.wav`),
  thief_victory_6: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_06.ogg`),
  thief_victory_7: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_07.mp3`),
  thief_victory_8: new Sound(`${import.meta.env.BASE_URL}sounds/laugh_08.mp3`)
}

const component_spawn_sound: ComponentSpawnSounds = {
  component_spawn_1: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_01.wav`),
  component_spawn_2: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_02.wav`),
  component_spawn_3: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_03.wav`),
  component_spawn_4: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_04.wav`),
  component_spawn_5: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_05.wav`),
  component_spawn_6: new Sound(`${import.meta.env.BASE_URL}sounds/bubble_06.wav`)
}

const component_clicked_sound: ComponetClickedSounds = {
  component_clicked_1: new Sound(`${import.meta.env.BASE_URL}sounds/click.mp3`),
}

const component_correct_sound: ComponentCorrectSounds = {
  component_correct_1: new Sound(`${import.meta.env.BASE_URL}sounds/chime.mp3`),
}

const component_incorrect_sound: ComponentIncorrectSounds = {}

const victory_stinger_sound: VictoryStingerSounds = {
  victory_stinger_1: new Sound(`${import.meta.env.BASE_URL}sounds/fanfare.mp3`),
}

const failure_stinger_sound: FailureStingerSounds = {
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
  images: ImageResources,
  sounds: SoundResources
}
