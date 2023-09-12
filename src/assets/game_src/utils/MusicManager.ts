import {Sound} from "excalibur";

export default class MusicManager {
  tracks: Sound[];
  current_track: number;
  will_change_track: boolean;
  iteration: number = 0;
  sequential_play_count: number = 0;
  playing: boolean = false;
  // callbacks: boolean[] = [];

  constructor(tracks: Sound[]) {
    this.tracks = tracks;
    this.current_track = this.get_random_track();
    this.will_change_track = false;
  }

  get_random_track() {
    let next_track = this.current_track;
    if (this.tracks.length === 1) return next_track;
    while(next_track === this.current_track) {
      next_track = Math.floor(Math.random() * this.tracks.length) || 0;
    }
    return next_track;
  }

  get branchToNewTrack() {
    const track_change_chance = 0.1;
    return Math.random() < (this.sequential_play_count * track_change_chance);
  }

  play() {
    this.stop();
    if(this.will_change_track || this.branchToNewTrack) {
      this.current_track = this.get_random_track();
      console.log(`Changing track to ${this.current_track}`);
      this.will_change_track = false;
      this.sequential_play_count = 0;
    } else
      this.sequential_play_count++;

    this.playing = true;
    this.tracks[this.current_track].play(0.05).then(() => {
      this.keep_playing();
    });
    this.iteration++;
  }

  keep_playing() {
    if (!this.playing) return;
    this.play();
  }

  stop() {
    this.tracks[this.current_track].stop();
    this.playing = false;
  }
}
