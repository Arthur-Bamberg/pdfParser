const fs = require("fs");
const ExcelJS = require("exceljs");

async function xlsxToCSV(input, output, separator = ";", excludeHeaders = []) {
    return new Promise((resolve, reject) => {
        const workbook = new ExcelJS.Workbook();
        workbook.xlsx
            .readFile(input)
            .then(() => {
                const worksheet = workbook.getWorksheet(1);

                const csvStream = fs.createWriteStream(output);

                // Find the maximum number of columns
                let maxColumns = 0;
                worksheet.eachRow((row) => {
                    maxColumns = Math.max(maxColumns, row.actualCellCount);
                });

                let columnsToIgnore = [];
                for (const index in worksheet.columns) {
                    const column = worksheet.columns[index];
                    if (column.values) {
                        for (const value of column.values) {
                            if (excludeHeaders.includes(value)) {
                                // Add one because ExcelJS uses 1 indexed rows
                                columnsToIgnore.push((parseInt(index) + 1).toString());
                                break;
                            }
                        }
                    }
                }

                worksheet.eachRow((row) => {
                    const values = [];
                    // Pad rows with empty values to ensure consistent number of columns
                    for (let i = 1; i <= maxColumns; i++) {
                        if (columnsToIgnore.includes(i.toString())) {
                            continue;
                        }

                        const cellValue = row.getCell(i).value;
                        if (cellValue) {
                            values.push(cellValue);
                        } else {
                            values.push('');
                        }
                    }
                    csvStream.write(values.join(separator) + "\n");
                });

                csvStream.end();
                console.info(`XLSX to CSV conversion completed. Written to ${output}`);
                resolve();
            })
            .catch((error) => {
                console.error("Error converting XLSX to CSV:", error);
                reject();
            });
    });
}

module.exports = xlsxToCSV;