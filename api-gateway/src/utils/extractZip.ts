import unzipper from 'unzipper';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { promisify } from 'util';
import stream from 'stream';
import { downloadFromS3ForCheck } from '../services/cloudfareService';
const pipeline = promisify(stream.pipeline);

dotenv.config();

export async function extractZip(fileUrl: string, dest: string) : Promise<void> {

    //télécharger le fichier depuis AWS S3
    const { fileName, fileStream } = await downloadFromS3ForCheck(fileUrl);

    console.log(`Fichier téléchargé: ${fileName}`);
    console.log(`Flux de fichier: ${fileStream}`);
    if (!fileName || !fileStream) {
        throw new Error('Impossible de télécharger le fichier depuis S3');
    }

    const isZip = fileName.toLowerCase().endsWith('.zip');
    const filePath = path.join(dest, fileName);

    await fs.promises.mkdir(dest, { recursive: true });

    if (isZip) {
        // Extraction directe depuis le stream
        await pipeline(fileStream, unzipper.Extract({ path: dest }));
        console.log(`Fichier ZIP extrait dans ${dest}`);
    } else {
        // Sauvegarde brute
        const writeStream = fs.createWriteStream(filePath);
        await pipeline(fileStream, writeStream);
        console.log(`Fichier enregistré dans ${filePath}`);
    }
}
