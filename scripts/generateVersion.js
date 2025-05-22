import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const versionFilePath = join(__dirname, '../public/version.json');

const generateVersionFile = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTime = new Date(now.getTime() + istOffset).toISOString();

  const versionData = {
    timestamp: istTime
  };

  writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));
  console.log('version.json file generated:', versionData);
};

generateVersionFile();
