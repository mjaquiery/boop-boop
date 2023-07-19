import {Sound} from "excalibur";

export default class MusicManager {
  tracks: Sound[];
  current_track: number;
  will_change_track: boolean;
  iteration: number = 0;
  callbacks: boolean[] = [];

  constructor(tracks: Sound[]) {
    this.tracks = tracks;
    this.current_track = this.get_random_track();
    this.will_change_track = false;
  }

  get_random_track() {
    let next_track = this.current_track;
    if (this.tracks.length === 1) return next_track;
    while(next_track === this.current_track) {
      next_track = Math.floor(Math.random() * this.tracks.length) | 0;
    }
    return next_track;
  }

  play() {
    this.stop();
    if(this.will_change_track) {
      this.current_track = this.get_random_track();
      console.log(`Changing track to ${this.current_track}`);
      this.will_change_track = false;
    }
    this.tracks[this.current_track].play().then(() => {
      if (this.callbacks[this.iteration]) {
        this.play();
      }
    });
    this.iteration++;
  }

  stop() {
    this.tracks[this.current_track].stop();
  }
}
