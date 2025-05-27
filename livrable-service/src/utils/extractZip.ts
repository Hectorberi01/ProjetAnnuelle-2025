import unzipper from 'unzipper';
import { google } from 'googleapis';

import fs from 'fs';
import path from 'path';
import axios from 'axios';

import dotenv from 'dotenv';
import { promisify } from 'util';
import stream from 'stream';
const pipeline = promisify(stream.pipeline);

dotenv.config();

export async function extractZip(fileUrl: string, dest: string): Promise<void> {
    const fileIdMatch = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    const fileId = fileIdMatch?.[1];
    console.log(`Extracting file from URL: ${fileUrl}`);
    console.log(`Extracting file ID: ${fileId}`);
    if (!fileId) {
        throw new Error('Invalid file URL: Unable to extract file ID');
    }

    // const auth = new google.auth.GoogleAuth({
    //     keyFile: path.join(process.env.GDRIVE_CREDENTIALS_PATH ||'google-drive-credentials.json'),
    //     scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    // });

    const auth = new google.auth.JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const metadata = await drive.files.get({
        fileId,
        fields: 'name, mimeType',
    });

    const fileName = metadata.data.name || `fichier_${fileId}`;
    const isZip = fileName.toLowerCase().endsWith('.zip');
    const filePath = path.join(dest, fileName);

    const res = await drive.files.get(
        {
        fileId,
        alt: 'media',
        },
        { responseType: 'stream' }
    );

    await fs.promises.mkdir(dest, { recursive: true });
    if (isZip) {
        // extraire directement
        await res.data.pipe(unzipper.Extract({ path: dest })).promise();
    } else {
        // enregistrer le fichier brut
        const writeStream = fs.createWriteStream(filePath);
        await pipeline(res.data, writeStream);
    }
  //const res = await axios.get(fileUrl, { responseType: 'stream' });
  //await res.data.pipe(unzipper.Extract({ path: dest })).promise();
}
