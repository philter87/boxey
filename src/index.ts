
import {drop} from "./drop";
import {a, button, div} from "./VNodes";
import {n} from "./VNode";

const message = drop("Hello World");
const MESSAGE = message.map(v => v.toUpperCase());

let el = document.createElement('div');
el.innerText = "Hello World!!!";
document.getElementById('app').appendChild(el)

MESSAGE.subscribe( val => el.innerText = val)

console.log(n('div'), div(), a(), button());