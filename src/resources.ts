import { ImageSource } from "excalibur";

let eyes: {[key: string]: ImageSource} = {}
const eye_count = 20;
for (let i = 1; i <= eye_count; i++) {
  const name = `eyes_${i >= 10? i.toString() : "0" + i.toString()}`;
  eyes[name] = new ImageSource(`/images/eyes/${name}.png`);
}

let mouth: {[key: string]: ImageSource} = {}
const mouth_count = 24;
for (let i = 1; i <= mouth_count; i++) {
  const name = `mouth_${i >= 10? i.toString() : "0" + i.toString()}`;
  mouth[name] = new ImageSource(`/images/mouth/${name}.png`);
}

let potato: {[key: string]: ImageSource} = {}
const potato_count = 4;
for (let i = 1; i <= potato_count; i++) {
  const name = `potato_${i >= 10? i.toString() : "0" + i.toString()}`;
  potato[name] = new ImageSource(`/images/${name}.png`);
}

let Resources: {[key: string]: ImageSource} = {
  ...eyes,
  ...mouth,
  ...potato,
};

export const random_resource_key_by_type: (type: string) => string = (type: string) => {
  const matches = Object.keys(Resources).filter(k => k.startsWith(type));
  return matches[Math.floor(Math.random() * matches.length)];
}
export const random_resource_by_type: (type: string) => ImageSource = (type: string) => Resources[random_resource_key_by_type(type)]

export { Resources };