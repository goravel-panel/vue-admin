import type { App } from 'vue'

import router from '@/router'

export default (app: App<Element>) => {
    app.use(router)
}
