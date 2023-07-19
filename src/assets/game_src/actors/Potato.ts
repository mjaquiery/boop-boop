import {Actor, Sprite} from "excalibur";
import {random_resource_key_by_type, ImageResources} from "../utils/resources";

export default class Potato extends Actor {
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



//
// const canvas = new Canvas({
//   opacity: 0,
//   cache: true,  // If true draw once until flagged dirty again, otherwise draw to Canvas every frame
//   draw: (ctx) => {
//     const videoelement: HTMLVideoElement|null = document.getElementById("WebcamFeed") as HTMLVideoElement;
//     if (videoelement) {
//       ctx.canvas.height = videoelement.videoHeight;
//       ctx.canvas.width = videoelement.videoWidth;
//       ctx.drawImage(videoelement, 0, 0);
//       console.log("snapshot", ctx.canvas.toDataURL())
//     }
//   }
// })
//
// class WebcamFrame extends Actor {
//   declare canvas: Canvas;
//
//   constructor(props: any, canvas: Canvas) {
//     super(props);
//     this.canvas = canvas;
//   }
// }
//
// export const get_camera = (props: any) => {
//   const camera = new WebcamFrame(props, canvas)
//   camera.graphics.use(canvas)
//   return camera
// };
