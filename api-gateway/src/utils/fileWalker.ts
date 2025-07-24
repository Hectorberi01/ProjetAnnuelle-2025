import fs from 'fs';
import path from 'path';

export function walkFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...walkFiles(fullPath, extensions));
    } else if (extensions.includes(path.extname(fullPath).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}
