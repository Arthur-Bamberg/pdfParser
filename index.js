const fs = require('fs').promises;
const pdf = require('pdf-parse');

async function main() {
	try {
		const dataBuffer = await fs.readFile('./files/Matrículas/Matrículas 7A.pdf');
		const data = await pdf(dataBuffer);

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
								const restSplitted = lineSplitted[2].replace('(P)', '').split(/\s+\([^)]+\)/);

								if(restSplitted[1]) {
									lineData.sex = restSplitted[1].replace(/\d+/g, '');

									lineData.enrollNumber = restSplitted[1].slice(-4);
	
									const enrollNumberSize = lineData.enrollNumber.slice(0, 1) > 5 ? 4 : 5;
	
									if (enrollNumberSize == 5) {
										lineData.enrollNumber = restSplitted[1].slice(-5);
									}
	
									const withoutEnrollNumber = restSplitted[1].replace(/[^\d]+/g, '').slice(0, -enrollNumberSize);
	
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
								}

								text += `${lineData.studentName};${lineData.birth};${lineSplitted[2]} + ARRUMAR 2\n`;

							} else {
								if (lineData.birth) {
									text += `${lineData};${lineData.birth}; + ARRUMAR 1\n`;
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


		const filePath = 'Matrículas 7A.csv';

		// await fs.writeFile(filePath, text);

		console.log('File was successfully created and written!');

	} catch (error) {
		console.error('Error:', error);
	}
}

main();
