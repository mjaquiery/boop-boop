import {Loader} from "excalibur";

export type BoopLoaderProps = {
  startButtonElement?: HTMLButtonElement
}

export default class BoopLoader extends Loader {
  startButtonElement?: HTMLButtonElement;
  constructor(props?: BoopLoaderProps) {
    super();
    if (props?.startButtonElement !== undefined) {
      this.startButtonElement = props.startButtonElement;
    }
  }

  startButtonFactory = () => {
    if (this.startButtonElement === undefined) {
      return super.startButtonFactory();
    }
    return this.startButtonElement;
  }
}
