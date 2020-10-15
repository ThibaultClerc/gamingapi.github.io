import "../sass/styles.scss";
import 'bootstrap';
import { Home } from "./Home";
import { PageList } from "./PageList";
import { PageDetail } from "./PageDetail";
import { routes } from "./routes";

let pageArgument;

const setRoute = () => {
  let path = window.location.hash.substring(1).split("/");
  pageArgument = path[1] || "";

  var pageContent = document.getElementById("pageContent");
  pageContent.style.opacity = 0;
  pageContent.style.transition = "opacity 3s"
  pageContent.style.opacity = 1;
  routes[path[0]](pageArgument);
  window.scrollTo(0, 0);
  return true;
};



window.addEventListener("hashchange", () => setRoute());
window.addEventListener("DOMContentLoaded", () => setRoute());