import { Router } from 'itty-router'

import { withValidate } from './middlewares'
import { sendFileVersionUpdate, sendLibraryUpdate } from './notifications'

const router = Router()

router.post(
    '/file_version_update',
    withValidate,
    async ({ data, webhookUrl }) => {
        if (data.event_type === 'FILE_VERSION_UPDATE') {
            return await sendFileVersionUpdate(data, webhookUrl)
        } else {
            return new Response('Invalid Event Type', { status: 401 })
        }
    }
)

router.post(
    '/library_publish',
    withValidate,
    async ({ data, webhookUrl }) => {
        if (data.event_type === 'LIBRARY_PUBLISH') {
            return await sendLibraryUpdate(data, webhookUrl)
        } else {
            return new Response('Invalid Event Type', { status: 401 })
        }
    }
)

router.all('*', () => new Response('Not Found', { status: 404 }))

addEventListener('fetch', event => {
    event.respondWith(router.handle(event.request))
})
