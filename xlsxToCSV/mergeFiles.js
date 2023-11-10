const fs = require('fs').promises;
const path = require('path');

async function mergeCSVFiles(folderPath, outputFilePath) {
    try {
        // Read the list of files in the folder
        const files = await fs.readdir(folderPath);

        // Initialize an empty string to store concatenated content
        let concatenatedContent = '';

        // Iterate through each file and read its content
        let index = 0;
        for (const file of files) {
            const filePath = path.join(folderPath, file);

            // Read the content of the file
            let fileContent = await fs.readFile(filePath, 'utf-8');

            if (index != 0) {
                const lines = fileContent.split('\n');
                lines.shift();
                fileContent = lines.join('\n');
            }

            // Concatenate the content
            concatenatedContent += fileContent;
            index++;
        }

        fs.writeFile(outputFilePath, concatenatedContent);
    } catch (error) {
        console.error('Error reading files:', error);
    }
}

module.exports = mergeCSVFiles;