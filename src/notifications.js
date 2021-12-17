import { formatStringFor } from './utils'

export const sendFileVersionUpdate = async (data, webhookUrl) => {
    try {
        const {
            description,
            label,
            file_key,
            file_name,
            triggered_by,
            timestamp,
            version_id,
        } = data

        const username = (triggered_by && triggered_by.handle) || 'Someone'
        const file_url = `https://figma.com/file/${file_key}/`
        const fields = [{ name: `✅ ${label}`, value: description || 'No description' }]

        const params = {
            embeds: [
                {
                    title: `__${file_name}__ was just published!`,
                    color: 5039945, // A green color
                    timestamp: timestamp,
                    url: file_url,
                    fields: fields,
                    footer: {
                        text: `Published by: ${username} • v${version_id}`,
                    },
                },
            ],
        }

        return await sentNotification(params, webhookUrl)
    } catch (err) {
        console.log(err.message)
        return new Response('Missing Data', { status: 400 })
    }
}

export const sendLibraryUpdate = async (data, webhookUrl) => {
    try {
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
        } = data

        const username = (triggered_by && triggered_by.handle) || 'Someone'
        const file_url = `https://figma.com/file/${file_key}/`

        // Build Field, Process Strings
        const updates = { name: 'Updates', value: '' }
        const created = formatStringFor(created_components, created_styles)
        const modified = formatStringFor(modified_components, modified_styles)
        const deleted = formatStringFor(deleted_components, deleted_styles)

        // Process string
        if (created) updates.value += `\n✅ Added ${created}`
        if (modified) updates.value += `\n✏️ Modified ${modified}`
        if (deleted) updates.value += `\n❌ Deleted ${deleted}`

        updates.value = updates.value.trim()

        const params = {
            embeds: [
                {
                    title: `A new version of ${file_name} was just published!`,
                    color: 5039945, // A green color
                    description: description,
                    timestamp: timestamp,
                    url: file_url,
                    fields: [updates],
                    footer: {
                        text: `Published by: ${username}`,
                    },
                },
            ],
        }

        return await sentNotification(params, webhookUrl)
    } catch (err) {
        console.log(err.message)
        return new Response('Missing Data', { status: 400 })
    }
}

const sentNotification = async (params, webhookUrl) => {
    const result = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    })

    if (result.status === 204) {
        return new Response('Notification sent to Discord', { status: 200 })
    } else {
        return new Response('Error sending notification to Discord', {
            status: 400,
        })
    }
}
