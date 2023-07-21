import Component, {ComponentType} from "@/assets/game_src/actors/Component";

export default class Mouth extends Component {
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
