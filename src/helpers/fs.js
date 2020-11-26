import * as fs from 'fs';

export async function writeFile(filepath, data) {
    try {
        await fs.promises.writeFile(filepath, data);
    } catch (error) {
        console.error(`Got an error trying to write to a file: ${error.message}`);
    }
}
