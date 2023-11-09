const fs = require('fs').promises;
const pdf = require('pdf-parse');

async function main() {
	try {
		const dataBuffer = await fs.readFile('./files/a.pdf');
		const data = await pdf(dataBuffer);

		const filePath = 'destine.csv';

		await fs.writeFile(filePath, data.text);

    	console.log('File was successfully created and written!');

	} catch (error) {
		console.error('Error:', error);
	}
}

main();
