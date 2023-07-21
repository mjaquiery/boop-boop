import Game from "../main";

export type StatisticProperties = {
  name: string;
  description: string;
  value: number;
  unit?: string;
  advanced?: boolean;
}

export class Statistic {
  name: string;
  description: string;
  value: number = 0;
  unit?: string;
  advanced?: boolean;

  constructor(properties: StatisticProperties) {
    if (!properties.name) throw new Error('Statistic must have a name');
    this.name = properties.name;
    this.description = properties.description || '';
    this.unit = properties.unit;
    this.value = properties.value || 0;
    this.advanced = properties.advanced || false;
  }
}

export class TimeTakenStatistic extends Statistic {
  constructor(value: number = 0, props: Partial<StatisticProperties> = {}) {
    super({
      name: 'Playing time',
      description: 'Time taken to complete level',
      unit: 's',
      value,
      ...props
    });
  }
}

export class ClicksStatistic extends Statistic {
  constructor(value: number = 0, props: Partial<StatisticProperties> = {}) {
    super({
      name: 'Clicks',
      description: 'Helpful pieces clicked',
      value,
      ...props
    });
  }
}

export class MisclicksStatistic extends Statistic {
  constructor(value: number = 0, props: Partial<StatisticProperties> = {}) {
    super({
      name: 'Misclicks',
      description: 'Unhelpful pieces clicked',
      value,
      advanced: true,
      ...props
    });
  }
}

export class ThievesShooedStatistic extends Statistic {
  constructor(value: number = 0, props: Partial<StatisticProperties> = {}) {
    super({
      name: 'Thieves shooed',
      description: 'Total thieves shooed',
      value,
      advanced: true,
      ...props
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

export type GameStatisticsSummary = {
  time_taken: TimeTakenStatistic;
  clicks: ClicksStatistic;
  misclicks: MisclicksStatistic;
  thieves_shooed: ThievesShooedStatistic;
  level: Statistic;
  score: Statistic;
}

export default class GameStatistics {
  owner: Game;

  constructor(game: Game) {
    this.owner = game;
  }

  get time_taken() {
    return new TimeTakenStatistic(
      this.owner.level_statistics
        .map(stat => stat.time_taken.value)
        .reduce((a, b) => a + b, 0) / 1000,
      {
        description: 'Total time spent playing',
      }
    )
  }

  get clicks() {
    return new ClicksStatistic(
      this.owner.level_statistics.map(stat => stat.clicks.value).reduce((a, b) => a + b, 0)
    )
  }

  get misclicks() {
    return new MisclicksStatistic(
      this.owner.level_statistics.map(stat => stat.misclicks.value).reduce((a, b) => a + b, 0)
    )
  }

  get thieves_shooed() {
    return new ThievesShooedStatistic(
      this.owner.level_statistics.map(stat => stat.thieves_shooed.value).reduce((a, b) => a + b, 0)
    )
  }

  get level() {
    return new Statistic({
      name: 'Level',
      description: 'Highest level completed',
      value: (this.owner.difficulty_level + 1) - 1,
    })
  }

  get score() {
    const score = Math.round(
      this.level.value * 1000
      - this.misclicks.value * 100
      - this.time_taken.value / 1000
      * (1 + this.owner.difficulty_level * this.owner.settings.difficulty_step)
    );
    return new Statistic({
      name: 'Total score',
      description: 'Points scored',
      value: score
    })
  }

  get all(): GameStatisticsSummary {
    return {
      time_taken: this.time_taken,
      clicks: this.clicks,
      misclicks: this.misclicks,
      thieves_shooed: this.thieves_shooed,
      level: this.level,
      score: this.score
    }
  }
}
