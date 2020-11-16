
import {store} from "./store";
import {a, button, div, n} from "./VNodes";

const message = store("Hello World");
const MESSAGE = message.map(v => v.toUpperCase());

let el = document.createElement('div');
el.innerText = "Hello World!!!";
document.getElementById('app').appendChild(el)

MESSAGE.subscribe( val => el.innerText = val)

console.log(n('div'), div(), a(), button());