import About from "./views/About.svelte";
import Home from "./views/Home.svelte";

export const routes = [
  {
    name: "/",
    component: Home,
  },
  { name: "about", component: About },
];
