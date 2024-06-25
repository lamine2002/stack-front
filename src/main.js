import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App);
// Ajoute le router à l'application
app.use(router);

app.mount('#app');
