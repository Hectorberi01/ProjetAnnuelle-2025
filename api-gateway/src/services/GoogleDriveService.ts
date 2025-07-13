import { drive_v3, google } from 'googleapis';
import * as stream from "stream";
import dotenv from 'dotenv';



dotenv.config();
export class GoogleDriveService {

    private drive: drive_v3.Drive;

    constructor() {
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

    if (!file || !file.buffer || !file.originalname || !file.mimetype) {
        throw new Error('Invalid file object');
    }

    console.log('Uploading file to Google Drive:', file.originalname);
    console.log('File MIME type:', file.mimetype);
    console.log('File size:', file.size, 'bytes');
    console.log('Folder ID:', folderId);

    const mimeType = 'application/pdf';

    try {
        // Create a pass-through stream for the file buffer
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);

        // Upload the file to Google Drive
        const response = await this.drive.files.create({
            // Paramètres principaux
            requestBody: {
                name: file.originalname,
                mimeType,
                parents: [folderId],
            },
            media: {
                mimeType,
                body: bufferStream,
            },
            // Options supplémentaires (comme supportsAllDrives) doivent être au niveau racine
            supportsAllDrives: true,
            fields: 'id,name,webViewLink',
        } as any); // "as any" pour éviter les erreurs TypeScript si nécessaire


        console.log('File uploaded successfully:', response.data);

        const fileId = response.data.id;
        if (!fileId) {
            throw new Error("File ID is missing after upload");
        }

        // Make the file publicly readable
        await this.drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
            supportsAllDrives: true, // Nécessaire pour les Shared Drives
            fields: 'id'
        });

        console.log('Permissions set for file:', fileId);

        return `https://drive.google.com/file/d/${fileId}/view`;
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        throw new Error(`Failed to upload file: ${error}`);
    }
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
