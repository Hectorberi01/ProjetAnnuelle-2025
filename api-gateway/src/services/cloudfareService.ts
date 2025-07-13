import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; 

import dotenv from "dotenv";
dotenv.config();



const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

export function getPublicPDFUrl(filename: string): string {
    return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${encodeURIComponent(filename)}`;
}