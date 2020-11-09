import {Tap} from "./tap";
import {tag} from "./elements";

const message = new Tap("Hello World");
const MESSAGE = message.to(v => v.toUpperCase());

let el = document.createElement('div');
el.innerText = "Hello World!!!";
document.getElementById('app').appendChild(el)

MESSAGE.subscribe( val => el.innerText = val)

console.log(tag("div"))