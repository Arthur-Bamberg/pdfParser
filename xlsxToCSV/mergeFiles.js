const fs = require('fs').promises;
const path = require('path');

async function mergeCSVFiles(folderPath, outputFilePath) {
    try {
        const files = await fs.readdir(folderPath);

        let textArray;
        let isFirstFile = true;

        for (const file of files) {
            const data = (await fs.readFile(`${folderPath}/${file}`, 'utf-8')).split('\n');

            if (data[data.length - 1].trim() === '') {
                data.pop();
            }


            if (isFirstFile) {
                isFirstFile = false;

                textArray = data;

            } else {
                data.shift();

                textArray = [...textArray, ...data];
            }
        }


        const text = textArray.join('\n');

        await fs.writeFile(outputFilePath, text);

        console.log(`${outputFilePath} was successfully created and written!`);

    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = mergeCSVFiles;