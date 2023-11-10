const fs = require('fs').promises;

const main = async () => {
    const directoryPath = './enrollmentsDone';
    const destinationFile = './filesDone/enrollments.csv';

    try {
        const files = await fs.readdir(directoryPath);

        let textArray;
        let isFirstFile = true;

        for (const file of files) {
            const data = (await fs.readFile(`${directoryPath}/${file}`, 'utf-8')).split('\n');

            if(data[data.length - 1].trim() === '') {
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

        await fs.writeFile(destinationFile, text);

        console.log(`${destinationFile} was successfully created and written!`);

    } catch (error) {
        console.error('Error:', error);
    }
};

main();