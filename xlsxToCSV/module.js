const fs = require("fs");
const ExcelJS = require("exceljs");

function xlsxToCSV(input, output, separator = ";") {
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx
        .readFile(input)
        .then(() => {
            const worksheet = workbook.getWorksheet(1);

            const csvStream = fs.createWriteStream(output);

            worksheet.eachRow((row) => {
                const values = row.values;
                // Shifting because row.values is 1 indexed instead of 0 indexed
                values.shift();
                csvStream.write(values.join(separator) + "\n");
            });

            csvStream.end();
            console.log(`XLSX to CSV conversion completed. Written to ${output}`);
        })
        .catch((error) => {
            console.error("Error converting XLSX to CSV:", error);
        });
};

module.exports = xlsxToCSV;