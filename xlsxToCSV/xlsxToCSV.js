const xlsxToCSV = require('./module');

const xlsxFilePath = `${process.argv[2]}`;
const csvFilePath = `filesDone/${process.argv[3]}`;
const separator = process.argv[4] ? process.argv[4] : ";";

xlsxToCSV(xlsxFilePath, csvFilePath, separator);