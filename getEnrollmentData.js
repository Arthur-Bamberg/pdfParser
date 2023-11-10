const fs = require('fs').promises;
const pdf = require('pdf-parse');

const validateFolderExists = async (folder) => {
	try {
		await fs.access(folder);
	} catch (error) {
		await fs.mkdir(folder, { recursive: true });
	}
}

const cleanString = (string) => {
	const words = ['(P)', '(M)', 'Masculino', 'Feminino', 'TRANSFERENCIA', 'AVANCO', /\([^)]*\)/g, '(', ')'];

	for (const word of words) {
		string = string.replace(word, '');
	}

	return string.trim();
}

const generateCSV = async (fileName, folder, data) => {
	const lines = data.text.split('\n');
	let lineNumber = 1;

	const classData = {};

	let text = 'course;level;class;studentName;birthDate;responsibleName;StudentSex;CPF;MECId;enrollNumber\n';

	for (const line of lines) {
		if (line.trim() !== '') {
			switch (lineNumber) {
				case 7:
					classData.course = line.replace('Curso:', '').trim()
					break;

				case 8:
					classData.level = line.replace('Etapa/Fase:', '').trim()
					break;

				case 9:
					classData.class = line.replace('Turma:', '').trim()
					break;

				default:
					if (lineNumber > 10) {
						const lineSplitted = line.split(/(\d{2}\/\d{2}\/\d{4})/);

						const lineData = {
							studentName: lineSplitted[0],
							birth: lineSplitted[1],
							responsibleName: '',
							sex: '',
							cpf: '',
							mecId: '',
							enrollNumber: ''
						};

						text += `${classData.course};${classData.level};${classData.class};`;

						if (lineSplitted[2]) {
							const sexMatch = lineSplitted[2].match(/Feminino|Masculino/);

							lineData.sex = sexMatch ? sexMatch[0] : '';

							const restSplitted = cleanString(lineSplitted[2]);

							if (restSplitted) {
								lineData.responsibleName = restSplitted.replace(/\d/g, '').trim();

								lineData.enrollNumber = restSplitted.slice(-4);

								const enrollNumberSize = lineData.enrollNumber.slice(0, 1) > 5 ? 4 : 5;

								if (enrollNumberSize == 5) {
									lineData.enrollNumber = restSplitted.slice(-5);
								}

								const withoutEnrollNumber = restSplitted.replace(/[^\d]+/g, '').slice(0, -enrollNumberSize);

								switch (withoutEnrollNumber.length) {
									case 11:
										lineData.cpf = withoutEnrollNumber;
										break;

									case 12:
										lineData.mecId = withoutEnrollNumber;
										break;

									case 23:
										lineData.cpf = withoutEnrollNumber.slice(0, 11);
										lineData.mecId = withoutEnrollNumber.slice(-12);
										break;
								}

								text += `${lineData.studentName};${lineData.birth};${lineData.responsibleName};${lineData.sex};${lineData.cpf};${lineData.mecId};${lineData.enrollNumber}\n`;

							} else {
								text += `${lineData.studentName};${lineData.birth};${lineSplitted[2]} + ARRUMAR 2\n`;
							}

						} else {
							if (lineData.birth) {
								text += `${lineData.name ?? line};${lineData.birth}; + ARRUMAR 1\n`;
							} else {
								text += `${line} + ARRUMAR 1\n`;
							}
						}
					}
					break;
			}

			lineNumber++;
		}
	}

	await fs.writeFile(`${folder}/${fileName}.csv`, text);

	console.log(`${fileName} was successfully created and written!`);
}

const main = async () => {
	const directoryPath = './files/Matrícula EJA';
	const destinationPath = './enrollments';

	await validateFolderExists(destinationPath);

	try {
		const files = await fs.readdir(directoryPath);

		for (const file of files) {
			const dataBuffer = await fs.readFile(`${directoryPath}/${file}`);
			const data = await pdf(dataBuffer);

			await generateCSV(file.replace('.pdf', ''), destinationPath, data);
		}

	} catch (error) {
		console.error('Error:', error);
	}
}

main();
