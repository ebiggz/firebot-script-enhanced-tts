# Enhanced TTS Effect for Firebot
Adds a new effect that utilizes the Streamlabs API to generate TTS (Streamlabs uses Amazon Polly)

> **Note**: Becuase this uses an undocumented Streamlabs API endpoint, there is no telling when or if this will stop working.
> Additionally, Streamlabs appears to rate limit this endpoint if used too fequently from the same IP. If you run into this issue, 
> you may want to use the Amazon Polly TTS integration built into Firebot instead.

## How to use
1. Download the latest **enhancedTts.js** file from [Releases](https://github.com/ebiggz/firebot-script-enhanced-tts/releases)
2. Add the **enhancedTts.js** as a startup script in Firebot (Settings > Advanced > Startup Scripts)
3. Restart Firebot and enjoy the new "Enhanced Text-To-Speech" effect!

## Developers
### Setup
1. Clone or fork repo
2. `npm install`

### Building
1. `npm run build`
2. Copy the `.js` file in `/dist` to Firebot's `scripts` folder
