## Setup Figma Webhook

Replace the variables with real ones

```
curl -X POST -H 'X-FIGMA-TOKEN: YOUR_FIGMA_TOKEN' -H "Content-Type: application/json" 'https://api.figma.com/v2/webhooks' -d '{"event_type":"LIBRARY_PUBLISH","team_id":"YOUR_TEAM_ID","endpoint":"YOUR_ENDPOINT_URL","passcode":"YOUR_PASSCODE","description":"Design System Library Publish Events"}'
```

## Development

Local dev with wrangler

### 1. Add file_key / Discord webhook pairs to the map in config.js

Move the sample config and update it with your key/value pairs

```
mv config.sample.js config.js
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
