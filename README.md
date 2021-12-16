## Overview

Cloudflare Worker listening to `LIBRARY_UPDATE` events from Figma and relays them to Discord.

A webhook is sent to this worker as soon as one of the Figma libraries listed in `config.js` is published.
If the correct payload is received, and validated (proper passcode, event, and file_key) then a Discord message is crafted and sent to the webhook url of your choice (per file_key).

![demo](.github/demo.png?raw=true)

## Setup Figma Webhook

To add this webhook you must have `Admin` permissions over the team in which the file you want to track lives. Replace the variables below with real ones and send the curl request.

**Note:** You must be listed as a team admin even if you have Organization admin permissions ([see here](https://forum.figma.com/t/403-access-denied-trying-to-use-the-webhook-api/7638)).

### Add Webhook

```
curl -X POST -H 'X-FIGMA-TOKEN: <personal access token>' -H "Content-Type: application/json" 'https://api.figma.com/v2/webhooks' -d '{"event_type":"LIBRARY_PUBLISH","team_id":"YOUR_TEAM_ID","endpoint":"YOUR_ENDPOINT_URL","passcode":"YOUR_PASSCODE","description":"Design System Library Publish Events"}'
```

### Get All Webhooks for team

```
curl -H 'X-FIGMA-TOKEN: <personal access token>' 'https://api.figma.com/v2/teams/:team_id/webhooks'
```

### Delete Webhook

```
curl -X DELETE -H 'X-FIGMA-TOKEN: <personal access token>' 'https://api.figma.com/v2/webhooks/:webhook_id'
```

## Development

Local dev with wrangler

### 1. Add the KV namespace `FIGMA_DISCORD_WEBHOOK` via wrangler

Add file_key / Discord webhook key-value pairs to it via the web UI or via wrangler

```
wrangler kv:namespace create --preview "FIGMA_DISCORD_WEBHOOK"
wrangler kv:key put --binding="FIGMA_DISCORD_WEBHOOK" "FILE_KEY_HERE" "FULL_DISCORD_WEBHOOK_URL_HERE"
```

### 2. Add Secrets

Add your Figma Webhook passcode

```
wrangler secret put FIGMA_PASSCODE
```

### 3. Run Locally

```
wrangler dev
```

## Publish

Publish to Cloudflare Workers

```
wrangler publish
```
