import {Actor, Engine, Sprite} from "excalibur";
import {random_resource_key_by_type, ImageResources} from "./resources";

export type ComponentType = 'eyes' | 'mouth';

export class Potato extends Actor {
  key: string;

  constructor(props?: any) {
    const key = props?.key;
    delete props.key;
    const defaults = {
      x: 300,
      y: 150,
      width: 100,
      height: 150,
    }
    super({...defaults, ...props});
    this.key = key || random_resource_key_by_type('potato');
  }

  onInitialize() {
    this.graphics.use(
      new Sprite({
        image: ImageResources[this.key],
        destSize: {width: this.width, height: this.height}
      })
    );
  }
}

export class Component extends Actor {
  type: ComponentType;
  key: string;

  constructor(props: any) {
    if (!props.type) throw new Error('Component objects must have a type');
    const type = props.type;
    delete props.type;
    const key = props.key;
    delete props.key;

    const defaults = {
      x: 150,
      y: 150,
      width: 40,
      height: 60,
    }
    super({...defaults, ...props});
    this.type = type;
    this.key = key || random_resource_key_by_type(type);
  }

  onInitialize() {
    this.graphics.use(
      new Sprite({
        image: ImageResources[this.key],
        destSize: {width: this.width, height: this.height}
      })
    );
  }

  onPostUpdate(_engine: Engine, _delta: number) {
    super.onPostUpdate(_engine, _delta);
    if (this.pos.y > _engine.drawHeight) {
      this.kill();
    }
  }
}

export class Eyes extends Component {
  constructor(props?: any) {
    const defaults = {
      x: 150,
      y: 150,
      width: 40,
      height: 60,
    }
    if (!props?.type) props.type = 'eyes' as ComponentType;
    super({...defaults, ...props});
  }
}

export class Mouth extends Component {
  constructor(props?: any) {
    const defaults = {
      x: 150,
      y: 150,
      width: 40,
      height: 60,
    }
    if (!props?.type) props.type = 'mouth' as ComponentType;
    super({...defaults, ...props});
  }
}
