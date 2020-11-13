
import {a, button, div, node} from "./elements";
import {drop} from "./drop";


const message = drop("Hello World");
const MESSAGE = message.map(v => v.toUpperCase());

let el = document.createElement('div');
el.innerText = "Hello World!!!";
document.getElementById('app').appendChild(el)

MESSAGE.subscribe( val => el.innerText = val)

console.log(node("div"), div(), a(), button())