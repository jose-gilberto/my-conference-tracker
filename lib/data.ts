import fs from 'fs';
import path from 'path';

export type Deadline = {
  type: string;
  date: string;
};

export type Conference = {
  id: string;
  title: string;
  acronym: string;
  website: string;
  tags: string[];
  deadlines: Deadline[];
};

export async function getConferences(): Promise<Conference[]> {
  const filePath = path.join(process.cwd(), 'public', 'conferences.json');

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("conferences.json not found. Run python script!", error);
    return [];
  }
}