import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; 
import * as fs from 'fs';
import path from 'path';
import dotenv from "dotenv";
import { Readable } from "stream";
dotenv.config();



const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


export interface S3DownloadResponse {
  fileName: string;
  fileStream: NodeJS.ReadableStream;
}

export async function uploadPDFToR2(file: Express.Multer.File): Promise<string> {
  const key = encodeURIComponent(file.originalname);

  console.log('Uploading file to R2:', key);
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  console.log('Command to upload:', command);

    try {
        const result = await s3.send(command);
        console.log('✅ File uploaded successfully to R2:', key);
        console.log('✅ Result:', result);
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
        console.error('Error uploading file to R2:', error);
        throw error;
    }

}


export async function downloadFromS3(url : string): Promise<Buffer | void> {

    const parsedUrl = new URL(url);

    const bucketName = parsedUrl.hostname.split('.')[0];
    const key = decodeURIComponent(parsedUrl.pathname.slice(1));

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    try {
      const response = await s3.send(command);
      const stream = response.Body as Readable;
      
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
    } catch (error) {
        console.error("Erreur lors du téléchargement depuis S3:", error);
        throw error;
    }
}

export async function downloadFromS3ForCheck(url : string): Promise<S3DownloadResponse> {

    const parsedUrl = new URL(url);

    console.log("Parsed URL:", parsedUrl);

    const bucketName = parsedUrl.hostname.split('.')[0];
    console.log("Bucket Name:", bucketName);
    const key = parsedUrl.pathname.slice(1);
    console.log("Key:", key);

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    try {
      const response = await s3.send(command);
      if (!response.Body) throw new Error('Le fichier n\'a pas pu être téléchargé depuis S3');

      return {
        fileName: path.basename(key),
        fileStream: response.Body as NodeJS.ReadableStream,
      };
      
    } catch (error) {
        console.error("Erreur lors du téléchargement depuis S3:", error);
        throw error;
    }
}

export async function getSignedPdfUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1h
}

export function extractKeyFromS3Url(url: string): string {
  const { pathname } = new URL(url);
  return decodeURIComponent(pathname.slice(1));
}