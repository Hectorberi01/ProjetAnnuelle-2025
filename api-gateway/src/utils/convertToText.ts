import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import xlsx from 'xlsx';
import { walkFiles } from './fileWalker';

export async function convertAllToText(folder: string): Promise<string> {
  const supportedExts = ['.txt', '.pdf', '.docx', '.xlsx', '.js', '.ts', '.java', '.py', '.cpp'];
  const files = walkFiles(folder, supportedExts);
  let fullText = '';

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();

    try {
      if (ext === '.pdf') {
        const buffer = await fs.readFile(file);
        const data = await pdfParse(buffer);
        fullText += data.text;
      } else if (ext === '.docx') {
        const buffer = await fs.readFile(file);
        const result = await mammoth.extractRawText({ buffer });
        fullText += result.value;
      } else if (ext === '.xlsx') {
        const workbook = xlsx.readFile(file);
        workbook.SheetNames.forEach(sheet => {
          const data = xlsx.utils.sheet_to_csv(workbook.Sheets[sheet]);
          fullText += data;
        });
      } else {
        const data = await fs.readFile(file, 'utf-8');
        fullText += data;
      }
    } catch (e) {
      console.warn(`⚠️ Impossible de lire ${file}`);
    }
  }

  return fullText;
}
