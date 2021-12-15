import { Router } from 'itty-router'
import config from './config'

const router = Router()

const formatField = field => field.map(f => f.name).join(', ')

const notify = async body => {
    const {
        description,
        file_key,
        file_name,
        triggered_by,
        timestamp,
        created_components,
        created_styles,
        modified_components,
        modified_styles,
        deleted_components,
        deleted_styles,
    } = body

    // Prep data
    const username = triggered_by.handle || 'Someone'
    const file_url = `https://figma.com/file/${file_key}/`

    // Build fileds
    const fields = []

    if (created_components.length > 0)
        fields.push({
            name: 'Added Components',
            value: formatField(created_components),
        })
    if (created_styles.length > 0)
        fields.push({
            name: 'Added Styles',
            value: formatField(created_styles),
        })
    if (modified_components.length > 0)
        fields.push({
            name: 'Modified Components',
            value: formatField(modified_components),
        })
    if (modified_styles.length > 0)
        fields.push({
            name: 'Modified Styles',
            value: formatField(modified_styles),
        })
    if (deleted_components.length > 0)
        fields.push({
            name: 'Deleted Components',
            value: formatField(deleted_components),
        })
    if (deleted_styles.length > 0)
        fields.push({
            name: 'Deleted Styles',
            value: formatField(deleted_styles),
            inline: true,
        })

    const params = {
        embeds: [
            {
                title: `A new version of ${file_name} was just published!`,
                color: 5039945,
                description: description,
                timestamp: timestamp,
                url: file_url,
                fields: fields,
                footer: {
                    text: `Published by: ${username}`,
                },
            },
        ],
    }

    try {
        await fetch(config[file_key], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        })
        console.log(`Sent notification to Discord for ${file_name}:${file_key}`)
    } catch (err) {
        console.log(err.message)
    }
}

router.post('/', async request => {
    const body = await request.json()
    if (
        body.passcode === FIGMA_PASSCODE &&
        body.event_type === 'LIBRARY_PUBLISH' &&
        config[body.file_key]
    ) {
        await notify(body)
        return new Response('success', { status: 200 })
    } else {
        return new Response('Not Authenticated', { status: 401 })
    }
})

router.all('*', () => new Response('404, not found!', { status: 404 }))

addEventListener('fetch', e => {
    e.respondWith(router.handle(e.request))
})
