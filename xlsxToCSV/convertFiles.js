// Script used to convert the files in the files folder that contains the importation data

const fs = require('fs');
const path = require('path');
const xlsxToCSV = require('./module');

function ensureFolderExists(folderPath) {
    try {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
            console.log(`Folder '${folderPath}' created.`);
        } else {
            console.log(`Folder '${folderPath}' already exists.`);
        }
    } catch (error) {
        console.error(`Error ensuring folder exists: ${error.message}`);
    }
}

function getFoldersInDirectory(directoryPath, skipFolders = []) {
    try {
        const contents = fs.readdirSync(directoryPath);

        const folders = contents.filter(item => {
            const fullPath = path.join(directoryPath, item);

            return fs.statSync(fullPath).isDirectory() && !skipFolders.includes(item);
        });

        return folders;
    } catch (error) {
        console.error(`Error reading directory: ${error.message}`);
        return [];
    }
}

const directoryPath = './files';
const foldersToSkip = ['Matrículas', 'Matrícula EJA', 'Ano Sala', 'Equipe', 'P2A S1', 'P2B S1'];

const folders = getFoldersInDirectory(directoryPath, foldersToSkip);

const outputFolder = './filesDone/csv';
ensureFolderExists(outputFolder);

const excludeHeaders = ["Nome", "Sexo", "Ficha"];
const separator = ";";

for (const folder of folders) {
    const realpath = `${directoryPath}/${folder}`;
    xlsxToCSV(`${realpath}/${folder}.xlsx`, `${outputFolder}/${folder}.csv`, separator, excludeHeaders);
}

// These two escape the pattern of folder name, xlsx name
xlsxToCSV(`${directoryPath}/P2A S1/Pré 2A S1.xlsx`, `${outputFolder}/PSA S1.csv`, separator, excludeHeaders);
xlsxToCSV(`${directoryPath}/P2B S1/Pré 2B S1.xlsx`, `${outputFolder}/PSB S1.csv`, separator, excludeHeaders);