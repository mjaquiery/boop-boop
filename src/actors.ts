import {Actor, Engine, ImageSource, Sprite, vec} from "excalibur";
import {random_resource_key_by_type, Resources} from "./resources";

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
        image: Resources[this.key],
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
        image: Resources[this.key],
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

export class Gremlin extends Actor {
  constructor(props: any) {
    const defaults = {
      x: 150,
      y: 150,
      width: 40,
      height: 60,
    }
    super({...defaults, ...props});
  }
}

export function GremlinFactory(props: any, resource?: ImageSource, clickHandler?: (gremlin: Gremlin) => void) {
  if (!resource && !clickHandler) {
    const g = gremlins[Math.floor(Math.random() * gremlins.length)];
    resource = g.resource;
    clickHandler = g.clickHandler;
  }
  const gremlin = new Gremlin(props);
  gremlin.onInitialize = function() {
    this.graphics.use(new Sprite({image: resource as ImageSource, destSize: {width: this.width, height: this.height}}));
    this.on('pointerdown', () => clickHandler? clickHandler(gremlin) : () => {});
  }
  return gremlin;
}

export const gremlins = [
  {
    resource: Resources.FlowerTop,
    clickHandler: function(gremlin: Gremlin) {
      console.log('arrrrrgh')
      gremlin.actions.scaleTo(vec(0, 0), vec(2, 2)).die();
    }
  },
  {
    resource: Resources.EggHead,
    clickHandler: function(gremlin: Gremlin) {
      console.log('RARRGH!')
      gremlin.actions.scaleTo(
        vec(gremlin.scale.x * 2, gremlin.scale.y * 2),
        vec(gremlin.scale.x * 2, gremlin.scale.y * 2)
      );
    }
  },
]


