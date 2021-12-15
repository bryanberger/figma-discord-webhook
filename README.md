## Development

Local dev with wrangler

### 1. Add file_key / discord webhook pairs to config.js

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
