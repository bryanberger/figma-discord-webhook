export const withPasscodeAndFileKey = async request => {
    const data = await request.json()

    if (data === null) {
        return new Response('Invalid Request', { status: 401 })
    }

    const { passcode, file_key, event_type } = data

    console.log(event_type)

    if (passcode !== FIGMA_PASSCODE) {
        return new Response('Invalid Passcode', { status: 401 })
    }

    if (file_key === undefined) {
        return new Response('Missing File Key', { status: 401 })
    }

    if (event_type === undefined) {
        return new Response('Missing Event Type', { status: 401 })
    }

    const webhookUrl = await FIGMA_DISCORD_WEBHOOK.get(file_key)

    if (webhookUrl === null) {
        return new Response('File Key Not Found', { status: 404 })
    }

    request.webhookUrl = webhookUrl
    request.data = data
}
