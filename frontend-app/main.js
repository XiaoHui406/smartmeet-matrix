import App from './App.vue'

// #ifndef VUE3
import Vue from 'vue'
// main.js
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif
// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import * as Pinia from 'pinia'
import persist from 'pinia-plugin-persistedstate'

export function createApp() {
	const app = createSSRApp(App)
	const pinia = Pinia.createPinia()
	app.use(pinia)
	pinia.use(persist)
	// app.use(Pinia.createPinia())
	// Pinia.createPinia().use(persist())

	return {
		app,
		Pinia
	}
}
// #endif