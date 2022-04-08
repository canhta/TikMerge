# Tiktok Compilation Tool

Scrape and download Tiktok videos by trending keywords then compile them into a single video to be uploaded to YouTube by command line.

Checkout demo Youtube channel: https://www.youtube.com/channel/UC3Ck8QcuaJ0JRUrN39YRbLg

<a href="https://www.buymeacoffee.com/canhtc" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Features

- Download **unlimited** post metadata from the Hashtag and Trends
- Save post metadata to the JSON/CSV files
- Combine videos into a single video with ffmpeg
- Script to upload the video to YouTube directly
- Automatically generate the description, tags and thumbnail to put on YouTube

## Installation

Requirements:

- Node.js (v14.x or later)

```bash
npm install
# or
yarn
```

### Scrape video from tiktok

```bash
 yarn content:pull [...options]
```

Options:

- **type**: `trend` or `hashtag` [default: `hashtag`]
- **hashtag**: tiktok hashtag [default: `xuhuong`]
- **device**: `phone` or `desktop` [default: `phone`]
- **duration**: the duration of the video by minutes [default: `13`]
- **banner**: number of banners to create [default: `30`]
- **batchSize**: number of videos to process [default: `8`]

Example:

```bash
 yarn content:pull --type=trend --hashtag=xuhuong --device=phone --duration=13 --banner=30 --batchSize=8
```

### Publish video to YouTube Channel

**Required**: OAuth 2.0 Client IDs from the [Google Developers Console](https://console.developers.google.com/apis/credentials)

Please follow the instructions in the [Turn on the YouTube Data API](https://developers.google.com/youtube/v3/quickstart/nodejs). After that, move the downloaded file to `/credentials` folder and rename it `client_secret.json`.

```bash
yarn content:upload [...options]
```

Options:

- **title**: title of the video
- **bannerId**: banner id to upload
- **hashtag**: tiktok hashtag, should be the same as the one used in the previous step

Example:

```bash
yarn content:upload --title="Xu Huong" --bannerId="1" --hashtag="xuhuong"
```

### Test scripts

```bash
# Create banner image
npx ts-node src/utils/banner.test.ts

# collector normalization
npx ts-node src/utils/normalization.test.ts

# Scrape tiktok
npx ts-node src/utils/scraper.test.ts
```

## Contributing

Please feel free to open an issue or create a pull request. I would love to see your work!

<a href="https://www.buymeacoffee.com/canhtc" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## License

**MIT**
**Free Software**
