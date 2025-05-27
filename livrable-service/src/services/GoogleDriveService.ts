import { drive_v3, google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
export class GoogleDriveService {

    private drive: drive_v3.Drive;

    constructor() {
        //   const auth = new google.auth.GoogleAuth({
        //     keyFile: path.join(__dirname, '..', 'google-drive-credentials.json'),
        //     scopes: ['https://www.googleapis.com/auth/drive'],
        //   });

        const auth = new google.auth.JWT({
            email: process.env.GOOGLE_CLIENT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });

      this.drive = google.drive({ version: 'v3', auth });
    }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const folderId = process.env.GDRIVE_FOLDER_ID;

    if (!folderId) {
      throw new Error('GDRIVE_FOLDER_ID is not defined in environment variables');
    }

    const response = await this.drive.files.create({
        requestBody: {
            name: file.originalname,
            mimeType: file.mimetype,
            parents: [folderId],
        },
        media: {
            mimeType: file.mimetype,
            body: fs.createReadStream(file.path),
        },
    });

    const fileId = response.data.id;
    return `https://drive.google.com/file/d/${fileId}/view`;
  }

  
  async downloadFile(fileId: string): Promise<NodeJS.ReadableStream> {
    const response = await this.drive.files.get(
      {
        fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    );

    return response.data;
  }

  async getFileMetadata(fileId: string): Promise<string> {
    const res = await this.drive.files.get({
      fileId,
      fields: 'name',
    });

    return res.data.name || 'downloaded-file';
  }

}
