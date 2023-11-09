const fs = require('fs').promises;
const pdf = require('pdf-parse');

async function main() {
	try {
		const dataBuffer = await fs.readFile('./files/a.pdf');
		const data = await pdf(dataBuffer);

		const lines = data.text.split('\n');

		let page = 0;
		const pages = [];

		let position;

		for (const line of lines) {
			if (line.trim().replace(/\d+/g, '') !== '' && line.trim() !== 'E.M.E.F DAVID RIEGEL NETO') {
				if (line.includes('SALA')) {
					position = 0;
					page++;
				}

				pages[page] = pages[page] || {};

				switch (position) {
					case 0:
						pages[page].room = line.trim();
						break;

					case 1:
						pages[page].class = line.trim();
						break;

					case 2:
						pages[page].shift = line.trim();
						break;

					default:
						if(line.trim().includes('PROFESSOR')) {
							pages[page].teacher = line.replace('PROFESSORA', '').trim();

						} else {
							pages[page].students = pages[page].students || [];
							pages[page].students.push(line.replace(/\d+/g, '').replace(/\([^)]*\)/g, '').replace('*', '').trim());
						}
						break;
				}

				position++;
			}
		}

		pages.shift();

		let text = 'class;shift;teacher;student\n';

		for (const page of pages) {
			for (const student of page.students) {
				text += `${page.class};${page.shift};${page.teacher ?? null};${student}\n`;
			}
		}

		const filePath = 'student-class.csv';

		await fs.writeFile(filePath, text);

    	console.log('File was successfully created and written!');

	} catch (error) {
		console.error('Error:', error);
	}
}

main();
