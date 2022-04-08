import { createReadStream, mkdirSync, readFile, writeFile } from 'fs';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { join } from 'path';
import readline from 'readline';

// =================== GOOGLE AUTHENTICATION: START ===================

const OAuth2 = google.auth.OAuth2;
// If modifying these scopes, delete your previously saved credentials
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const TOKEN_DIR = join(__dirname, '..', '..', '..', 'credentials');
const TOKEN_PATH = join(TOKEN_DIR, 'client_oauth_token.json');
const CLIENT_SECRET_PATH = join(TOKEN_DIR, 'client_secret.json');

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials: any, callback: (auth: OAuth2Client) => void) {
  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectUrl = credentials.web.redirect_uris?.[0];
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token.toString());
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client: OAuth2Client, callback: (auth: OAuth2Client) => void) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err || !token) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token: Credentials) {
  try {
    mkdirSync(TOKEN_DIR);
  } catch (err: any) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

// =================== GOOGLE AUTHENTICATION: END ===================

// video category IDs for YouTube:
const categoryIds = {
  Entertainment: '24',
  Education: '27',
  ScienceTechnology: '28',
};

interface YoutubeUploadOptions {
  title: string;
  description: string;
  tags: string[];
  videoFilePath: string;
  thumbFilePath: string;
}

interface UploadOptions extends YoutubeUploadOptions {
  auth: OAuth2Client;
}

function upload({ auth, title, description, tags, videoFilePath, thumbFilePath }: UploadOptions) {
  const service = google.youtube('v3');
  return new Promise((resolve, reject) => {
    // https://developers.google.com/youtube/v3/docs/videos#resource
    service.videos.insert(
      {
        auth: auth,
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: title.toUpperCase(),
            description,
            tags,
            categoryId: categoryIds.Entertainment,
            defaultLanguage: 'vi',
            defaultAudioLanguage: 'vi',
          },
          status: { privacyStatus: 'private', madeForKids: false },
        },
        media: { body: createReadStream(videoFilePath) },
      },
      function (err, response) {
        if (err || !response?.data.id) {
          return reject(new Error('The API returned an error: ' + err));
        }
        console.log('Video uploaded. Uploading the thumbnail now.');
        service.thumbnails.set(
          { auth: auth, videoId: response.data.id, media: { body: createReadStream(thumbFilePath) } },
          function (err: any, response: any) {
            if (err) {
              reject(new Error('The API returned an error: ' + err));
            }
            resolve(response?.data);
          }
        );
      }
    );
  });
}

export const uploadToYoutube = ({ title, description, tags, thumbFilePath, videoFilePath }: YoutubeUploadOptions) => {
  return new Promise((resolve, reject) => {
    readFile(CLIENT_SECRET_PATH, (err, content) => {
      if (err) {
        return reject(err);
      }
      // Authorize a client with the loaded credentials, then call the YouTube API.
      authorize(JSON.parse(content.toString()), async (auth) => {
        try {
          const response = await upload({ auth, title, description, tags, thumbFilePath, videoFilePath });
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });
  });
};
