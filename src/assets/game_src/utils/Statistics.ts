import Game from "../main";

export type StatisticProperties = {
  name: string;
  description: string;
  value: number;
  advanced?: boolean;
}

export class Statistic {
  name: string;
  description: string;
  value: number = 0;
  advanced?: boolean;

  constructor(properties: StatisticProperties) {
    if (!properties.name) throw new Error('Statistic must have a name');
    this.name = properties.name;
    this.description = properties.description || '';
    this.value = properties.value || 0;
    this.advanced = properties.advanced || false;
  }
}

export class TimeTakenStatistic extends Statistic {
  constructor(value: number = 0) {
    super({
      name: 'Time taken',
      description: 'Time taken to complete level',
      value,
    });
  }
}

export class ClicksStatistic extends Statistic {
  constructor(value: number = 0) {
    super({
      name: 'Clicks',
      description: 'Total clicks',
      value,
    });
  }
}

export class MisclicksStatistic extends Statistic {
  constructor(value: number = 0) {
    super({
      name: 'Misclicks',
      description: 'Total misclicks',
      value,
      advanced: true
    });
  }
}

export class ThievesShooedStatistic extends Statistic {
  constructor(value: number = 0) {
    super({
      name: 'Thieves shooed',
      description: 'Total thieves shooed',
      value,
      advanced: true
    });
  }
}

type LevelStatisticsProperties = {
  time_taken?: number;
  clicks?: number;
  misclicks?: number;
  thieves_shooed?: number;
}

export class LevelStatistics {
  time_taken = new TimeTakenStatistic()
  clicks = new ClicksStatistic()
  misclicks = new MisclicksStatistic()
  thieves_shooed = new ThievesShooedStatistic()

  constructor(stats: LevelStatisticsProperties = {}) {
    for (let [key, value] of Object.entries(stats)) {
      if (this[key as keyof LevelStatisticsProperties])
        this[key as keyof LevelStatisticsProperties].value = value;
    }
  }
}

export default class GameStatistics {
  owner: Game;

  constructor(game: Game) {
    this.owner = game;
  }

  get time_taken() {
    return new Statistic({
      name: 'Playing time',
      description: 'Total time spent playing',
      value: this.owner.level_statistics.map(stat => stat.time_taken.value).reduce((a, b) => a + b, 0),
    })
  }

  get clicks() {
    return new Statistic({
      name: 'Clicks',
      description: 'Total clicks',
      value: this.owner.level_statistics.map(stat => stat.clicks.value).reduce((a, b) => a + b, 0),
    })
  }

  get misclicks() {
    return new Statistic({
      name: 'Misclicks',
      description: 'Total misclicks',
      value: this.owner.level_statistics.map(stat => stat.misclicks.value).reduce((a, b) => a + b, 0),
      advanced: true
    })
  }

  get thieves_shooed() {
    return new Statistic({
      name: 'Thieves shooed',
      description: 'Total thieves shooed',
      value: this.owner.level_statistics.map(stat => stat.thieves_shooed.value).reduce((a, b) => a + b, 0),
      advanced: true
    })
  }

  get level() {
    return new Statistic({
      name: 'Level',
      description: 'Highest level completed',
      value: (this.owner.difficulty_level + 1) - 1,
    })
  }

  get score() {
    return new Statistic({
      name: 'Score',
      description: 'Points scored',
      value: this.level.value * 1000 - this.misclicks.value * 100 - this.time_taken.value / 1000,
    });
  }

  get advanced_score() {
    const score = this.level.value * 1000 - this.misclicks.value * 100 - this.time_taken.value / 1000 * (1 + this.owner.difficulty_level * this.owner.settings.difficulty_step);
    return new Statistic({
      name: 'Weighted score',
      description: 'Points scored adjusted for game difficulty',
      value: score,
      advanced: true
    })
  }

  get all() {
    return {
      time_taken: this.time_taken,
      clicks: this.clicks,
      misclicks: this.misclicks,
      thieves_shooed: this.thieves_shooed,
      level: this.level,
      score: this.score,
      advanced_score: this.advanced_score
    }
  }
}
