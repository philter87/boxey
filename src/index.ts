import {div, h1} from "./VNodes";
import {dotRender} from "./render-engine";
import {Router} from "./router";

const router = new Router();
const nav = div(
    router.a("/", {}, "Home "),
    router.a("/about", {}, "About "),
    router.a("/contact", {}, "Contact ")
)

const routes = router.routes(
    {path: "/", node: div(nav, h1("Hello World"))},
    {path: "/about", node: div(nav, h1("About"))},
    {path: "/contact", node: div(nav, h1("Contact!!!"))}
)

const node = div(routes);
dotRender(node, document.getElementById('app'))