import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/main.css"
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import router from "./router";

const app = createApp(App)

app.use(router)

app.mount('#app')
