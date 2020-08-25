const {
  schemaTierData,
  schemaMissingCode,
  schemaMissingCodeData,
} = require("../common/schema");

const processingTier1 = async (fileMissingCode, fileRuleData, dataSheetName) => {
  let mExcel = [];
  let rExcel = [];
  let nExcel = [];
  let result;

  const xlsxRead = require("read-excel-file/node");

  await xlsxRead(fileMissingCode, { schema: schemaMissingCodeData }).then(
    ({ rows }) => {
      mExcel = rows;
      // console.log(mExcel);
    }
  );

  await xlsxRead(fileRuleData, {schema: schemaTierData, sheet: dataSheetName}).then(({ rows }) => {
    rExcel = rows;
    // console.log(rExcel);
    // console.log(rExcel.length);
  });

  for (let i = 0; i < rExcel.length; i++) {
    result = mExcel.find(
      ({ oldLocationCode }) => oldLocationCode == rExcel[i].shipper
    );
    if (result != undefined) {
      console.log(i);
      console.log(result);
      console.log(rExcel[i]);
      console.log("===============");
      // replace old code with new ones

      if (result.newLocationCode != "NOT FOUND") {
        let newShippers = result.newLocationCode.split(" ").join("").split(",");
        for (let j = 0; j < newShippers.length; j++) {
          nExcel.push({
            code: rExcel[i].code,
            shipper: newShippers[j],
            newShipper: true,
            receiver: rExcel[i].receiver
          });
        }
      }
    } else {
      nExcel.push(rExcel[i]);
    }
  }
  return { mExcel, nExcel };
};

const processingTier2 = async (
  fileMissingCode,
  fileRuleData,
  dataSheetName
) => {
  let tier1Result = await processingTier1(
    fileMissingCode,
    fileRuleData,
    dataSheetName
  );

  let mExcel = tier1Result.mExcel;
  let rExcel = tier1Result.nExcel;
  let nExcel = [];
  let result;

  for (let i = 0; i < rExcel.length; i++) {
    result = mExcel.find(
      ({ oldLocationCode }) => oldLocationCode == rExcel[i].receiver
    );
    if (result != undefined) {
      console.log(i);
      console.log(result);
      console.log(rExcel[i]);
      console.log("===============");

      if (result.newLocationCode != "NOT FOUND") {
        let newReceivers = result.newLocationCode
          .split(" ")
          .join("")
          .split(",");
        for (let j = 0; j < newReceivers.length; j++) {
          nExcel.push({
            code: rExcel[i].code,
            shipper: rExcel[i].shipper,
            receiver: newReceivers[j],
            newShipper: rExcel[i].newShipper,
            newReceiver: true,
          });
        }
      }
    } else {
      nExcel.push(rExcel[i]);
    }
  }
  return nExcel;
};

const processingAll = async () => {
  const xlsxRead = require("read-excel-file/node");
  const xlsxWrite = require("excel4node");
  var input = {};

  await xlsxRead("testdata/settings.xlsx", {
    schema: schemaMissingCode,
    sheet: "missingCode",
  }).then(({ rows }) => {
    input = rows[0];
    // console.log(input);
  });

  const { program } = require('commander');

  program
    .version('v1.9')
    .option('-m, --missing-codes <file>', 'missing codes file name')
    .option('-r, --rules-data <file>', 'rules data file name')
    .option('-o, --output <file>', 'output file name')
    .option('-l, --list', 'list parameters and exit');

  program.parse(process.argv);

  if (program.missingCodes) input.missingCodeFileName = program.missingCodes;
  if (program.rulesData) input.ruleDataFileName = program.rulesData;
  if (program.output) input.newRulesDataFileName = program.output;

  if (program.list) {
    console.log('*************');
    console.log(input);
    console.log('***************');
    process.exit(0);
  }

  let fileFullName1 = "testdata/" + input.missingCodeFileName + ".xlsx";
  let fileFullName2 = "testdata/" + input.ruleDataFileName + ".xlsx";
  let newFileName = "testdata/" + input.newRulesDataFileName + ".xlsx";

  var wb = new xlsxWrite.Workbook();

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
  
  const styleNewCode = wb.createStyle({
    font: {
      color: "#154360",
      bold: true,
    },
  });
  
  const addHeader = (ws) => {
    ws.column(1).setWidth(19);
    ws.column(2).setWidth(17);
    ws.column(3).setWidth(17);
    ws.column(4).setWidth(8);
    ws.cell(1, 1)
      .string("PARENT(Bill To, Fleet, Service Offering)")
      .style(styleHeader);
    ws.cell(1, 2).string("SHIPPER").style(styleHeader);
    ws.cell(1, 3).string("RECEIVER").style(styleHeader);
    ws.cell(1, 4).string("SCAC").style(styleHeader);
  };

  if (input.t1bt != undefined) {
    console.log("processing " + input.t1bt + " tab...");
    var newT1bt = (
      await processingTier1(fileFullName1, fileFullName2, input.t1bt)
    ).nExcel;
    // console.log(newT1bt);

    var wst1bt = wb.addWorksheet(input.t1bt);
    addHeader(wst1bt);
    for (let i = 0; i < newT1bt.length; i++) {
      wst1bt.cell(i + 2, 1).string(newT1bt[i].code);
      wst1bt.cell(i + 2, 2).string(newT1bt[i].shipper);
      if (newT1bt[i].newShipper) wst1bt.cell(i + 2, 2).style(styleNewCode);
    }
  }

  if (input.t2bt != undefined) {
    console.log("processing " + input.t2bt + " tab...");
    var newT2bt = await processingTier2(fileFullName1, fileFullName2, input.t2bt);
    // console.log(newT2bt);
    var wst2bt = wb.addWorksheet(input.t2bt);
    addHeader(wst2bt);
    for (let i = 0; i < newT2bt.length; i++) {
      wst2bt.cell(i + 2, 1).string(newT2bt[i].code);
      wst2bt.cell(i + 2, 2).string(newT2bt[i].shipper);
      wst2bt.cell(i + 2, 3).string(newT2bt[i].receiver);
      if (newT2bt[i].newShipper) wst2bt.cell(i + 2, 2).style(styleNewCode);
      if (newT2bt[i].newReceiver) wst2bt.cell(i + 2, 3).style(styleNewCode);
    }
  }

  if (input.t1bu != undefined) {
    console.log("processing " + input.t1bu + " tab...");
    var newT1bu = (
      await processingTier1(fileFullName1, fileFullName2, input.t1bu)
    ).nExcel;
    var wst1bu = wb.addWorksheet(input.t1bu);
    addHeader(wst1bu);
    for (let i = 0; i < newT1bu.length; i++) {
      wst1bu.cell(i + 2, 1).string(newT1bu[i].code);
      wst1bu.cell(i + 2, 2).string(newT1bu[i].shipper);
      if (newT1bu[i].newShipper) wst1bu.cell(i + 2, 2).style(styleNewCode);
    }
  }

  if (input.t2bu != undefined) {
    console.log("processing " + input.t2bu + " tab...");
    var newT2bu = await processingTier2(fileFullName1, fileFullName2, input.t2bu);
    var wst2bu = wb.addWorksheet(input.t2bu);
    addHeader(wst2bu);
    for (let i = 0; i < newT2bu.length; i++) {
      wst2bu.cell(i + 2, 1).string(newT2bu[i].code);
      wst2bu.cell(i + 2, 2).string(newT2bu[i].shipper);
      wst2bu.cell(i + 2, 3).string(newT2bu[i].receiver);
      if (newT2bu[i].newShipper) wst2bu.cell(i + 2, 2).style(styleNewCode);
      if (newT2bu[i].newReceiver) wst2bu.cell(i + 2, 3).style(styleNewCode);
    }
  }

  if (input.t1so != undefined) {
    console.log("processing " + input.t1so + " tab...");
    let newT1so = (
      await processingTier1(fileFullName1, fileFullName2, input.t1so)
    ).nExcel;
    var wst1so = wb.addWorksheet(input.t1so);
    addHeader(wst1so);
    for (let i = 0; i < newT1so.length; i++) {
      wst1so.cell(i + 2, 1).string(newT1so[i].code);
      wst1so.cell(i + 2, 2).string(newT1so[i].shipper);
      if (newT1so[i].newShipper) wst1so.cell(i + 2, 2).style(styleNewCode);
    }
  }

  if (input.t2so != undefined) {
    console.log("processing " + input.t2so + " tab...");
    let newT2so = await processingTier2(fileFullName1, fileFullName2, input.t2so);
    var wst2so = wb.addWorksheet(input.t2so);
    addHeader(wst2so);
    for (let i = 0; i < newT2so.length; i++) {
      wst2so.cell(i + 2, 1).string(newT2so[i].code);
      wst2so.cell(i + 2, 2).string(newT2so[i].shipper);
      wst2so.cell(i + 2, 3).string(newT2so[i].receiver);
      if (newT2so[i].newShipper) wst2so.cell(i + 2, 2).style(styleNewCode);
      if (newT2so[i].newReceiver) wst2so.cell(i + 2, 3).style(styleNewCode);
    }
  }

  if (input.t1fl != undefined) {
    console.log("processing " + input.t1fl + " tab...");
    let newT1fl = (
      await processingTier1(fileFullName1, fileFullName2, input.t1fl)
    ).nExcel;
    var wst1fl = wb.addWorksheet(input.t1fl);
    addHeader(wst1fl);
    for (let i = 0; i < newT1fl.length; i++) {
      wst1fl.cell(i + 2, 1).string(newT1fl[i].code);
      wst1fl.cell(i + 2, 2).string(newT1fl[i].shipper);
      if (newT1fl[i].newShipper) wst1fl.cell(i + 2, 2).style(styleNewCode);
    }
  }

  if (input.t2fl != undefined) {
    console.log("processing " + input.t2fl + " tab...");
    let newT2fl = await processingTier2(fileFullName1, fileFullName2, input.t2fl);
    var wst2fl = wb.addWorksheet(input.t2fl);
    addHeader(wst2fl);
    for (let i = 0; i < newT2fl.length; i++) {
      wst2fl.cell(i + 2, 1).string(onewT2fl[i].code);
      wst2fl.cell(i + 2, 2).string(newT2fl[i].shipper);
      wst2fl.cell(i + 2, 3).string(newT2fl[i].receiver);
      if (newT2fl[i].newShipper) wst2fl.cell(i + 2, 2).style(styleNewCode);
      if (newT2fl[i].newReceiver) wst2fl.cell(i + 2, 3).style(styleNewCode);
    }
  }

  wb.write(newFileName);
};

processingAll();
