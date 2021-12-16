import { Router } from 'itty-router'
import { sendFileVersionUpdate, sendLibraryUpdate } from './notifications'

const router = Router()

router.post('/file_version_update', async request => {
    const body = await request.json()
    const webhookUrl = await FIGMA_DISCORD_WEBHOOK.get(body.file_key)

    if (webhookUrl === null) {
        return new Response('Not Found', { status: 404 })
    }

    if (
        body.passcode === FIGMA_PASSCODE &&
        body.event_type === 'FILE_VERSION_UPDATE'
    ) {
        return await sendFileVersionUpdate(body, webhookUrl)
    } else {
        return new Response('Bad Request', { status: 400 })
    }
})

router.post('/library_publish', async request => {
    const body = await request.json()
    const webhookUrl = await FIGMA_DISCORD_WEBHOOK.get(body.file_key)

    if (webhookUrl === null) {
        return new Response('Not Found', { status: 404 })
    }

    if (
        body.passcode === FIGMA_PASSCODE &&
        body.event_type === 'LIBRARY_PUBLISH'
    ) {
        return await sendLibraryUpdate(body, webhookUrl)
    } else {
        return new Response('Bad Request', { status: 400 })
    }
})

router.all('*', () => new Response('Not Found', { status: 404 }))

addEventListener('fetch', event => {
    event.respondWith(router.handle(event.request))
})
