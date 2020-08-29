const { program } = require('commander');
const dayjs = require('dayjs');
const _ = require('lodash');

function list(val) {
  return val.split(',');
}

function range(val) {
  let valArray = val.split('..');
  valArray[0] = dayjs(valArray[0]).startOf('date');
  valArray[1] = dayjs(valArray[1]).endOf('date');
  return valArray;
}

program
  .version('v1.9')
  .usage('[options] [file [worksheet]]')
  .option('-o, --output <file>', 'output file name')
  .option('-w, --worksheet <sheet>', 'output worksheet name')
  .option('-l, --list', 'list missing codes json and exit')
  .option('-d, --delete', 'delete exported data from json file')
  .option('-t, --trading-partner <list>', 'trading partner list')
  .option('-r, --date-range <mm/dd/yy>..<mm/dd/yy>', 'date range', range)
  .option('-s, --sort <list>', 'sorting columnes', list); // not implemented

program.parse(process.argv);

var ml = require('../testdata/ml');
const xlsxWrite = require("excel4node");

var fileName = '', sheetName = ''; 
var dateRange = [], tpArray = '';
var sortArray = [];

if (program.args[0]) {
  fileName = program.args[0];
  if (program.args[1]) sheetName = program.args[1];
}

if(program.worksheet) sheetName = program.worksheet;
if(program.output) fileName = program.output;

if (!fileName) fileName = 'ml';
if (!sheetName) sheetName = 'Sheet1';

var mlExport = ml;
var mlKeep = [];
if(program.tradingPartner) {
  tpArray = (program.tradingPartner.toUpperCase()).split(",");
  mlExport = ml.filter(x=>tpArray.includes(x.tradingPartner));
}

if(program.dateRange) {
  dateRange = program.dateRange;
  mlExport = mlExport.filter(x=>(dayjs(x.dateTime) >= dateRange[0]) && (dayjs(x.dateTime) <= dateRange[1]));
}

console.log(program.sort);
if(program.sort) {
  sortArray = program.sort.map(x=>_.camelCase(x));
  console.log(mlExport);
  _.sortBy(mlExport, sortArray);
  console.log(mlExport);
}

if(program.list) {
  console.log(mlExport);
  process.exit(0);
}

var wb = new xlsxWrite.Workbook();
var ws = wb.addWorksheet(sheetName);
const styleHeader = wb.createStyle({
  alignment: {
    wrapText: true
  },
  font: {
    color: "#145A32",
    bold: true,
    wrapText: true,
  },
});
  
const styleMissingCode = wb.createStyle({
  font: {
    color: "#FF0000",
    bold: true,
  },
});

const addHeader = () => {
  ws.column(1).setWidth(17);
  ws.column(2).setWidth(17);
  ws.column(3).setWidth(17);
  ws.column(4).setWidth(17);
  ws.column(5).setWidth(25);
  ws.cell(1, 1).string("TRADING PARTNER").style(styleHeader);
  ws.cell(1, 2).string("MISSING LOCATIONS").style(styleHeader);
  ws.cell(1, 3).string("FILE").style(styleHeader);
  ws.cell(1, 4).string("SHEET").style(styleHeader);
  ws.cell(1, 5).string("DATE TIME").style(styleHeader);
};

addHeader();

var k = 2;
for (let i=0; i < mlExport.length; i++) {
  for (let j=0; j < mlExport[i].missingLocations.length; j++) {
    if (mlExport[i].tradingPartner) ws.cell(k, 1).string(mlExport[i].tradingPartner);
    ws.cell(k, 2).string(mlExport[i].missingLocations[j]).style(styleMissingCode);
    ws.cell(k, 3).string(mlExport[i].file);
    ws.cell(k, 4).string(mlExport[i].sheet);
    ws.cell(k, 5).string(mlExport[i].dateTime);
    k++;
  }
}
// wb.write("./testdata/".concat(fileName).concat('.xlsx'));
console.log(process.cwd());
console.log()

if (program.delete) {
  // const fs = require('fs');
  mlKeep = ml.filter(x=>!mlExport.includes(x));

  console.log('remained in json file:')
  console.log(mlKeep);
  // fs.writeFile("./testdata/ml.json", JSON.stringify(mlKeep, null, 4), (err) => {
  //   if (err) {
  //       console.error(err);
  //       return;
  //   }
  //   console.log("json objects have been exported and deleted from json file:");
  //   console.log(mlExport);
  // }); 
}