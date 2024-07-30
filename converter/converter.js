import fs from "node:fs";
import process from "node:process";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { parse } from "csv/sync";
import { parse as dateParse } from "date-fns";
// import xlsx from "node-xlsx";
// import excel from "exceljs";

const SOURCE_DIR = "datasource/";
const DEST_DIR = "../_data/";

const config = [
  {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQY-R1AniodcMLxEDS1KyLOhxfgK3WxFAtifwPWAc28Vsi1j6Am9o9J2sZBMzpfFaEy59TkV0QDokm/pub?gid=0&single=true&output=csv",
    name: "casualties",
    output: "casualties.json",
    process(i) {
      if (i.date) {
        i.date = dateParse(i.date, "M/dd/yyyy", new Date());
      }
      return i;
    },
  },
  {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKKqy1UquMH0eRBtQd5fd_I5PQBClk_oHhAiaDBdMejX0BGrIYczUatme44ranWXNtm2UMtTKbizS_/pub?gid=747837065&single=true&output=csv",
    name: "media",
    output: "media.json",
    process(i) {
      return i;
    },
  },
  {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRI2Cu0M6kt_04FkrcyZZPGMYkVLHIgq56PboP-6gWzLzFI7kk1Ko3W81V_fUhQ8Xi2FmIf1QTfGHgn/pub?gid=0&single=true&output=csv",
    name: "timeline",
    output: "timeline.json",
    process(i) {
      return i;
    },
  },
  {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vStUAzgDyyw1PabWAS7FYsbgHSfRGCvr6MR6svchzBu3NjAm0AClijUjlDIBrP6MLZdXr7m-5cxVLYY/pub?gid=1883226421&single=true&output=csv",
    name: "detainees",
    output: "detainees.json",
    process(i) {
      return i;
    },
  },
];

async function downloadData() {
  const options = {};
  for (const source of config) {
    console.log(`downloading: ${source.name}`);
    const response = await fetch(source.url);
    const dest = path.join(
      import.meta.dirname,
      SOURCE_DIR,
      source.name + ".csv",
    );
    const body = Readable.fromWeb(response.body);
    await writeFile(dest, body);
  }
  return Promise.resolve();
}

function csvConvert() {
  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((i) => i.endsWith("csv"))
    .map((i) => i.split(".")[0]);

  files.forEach((file, index) => {
    const source = path.join(SOURCE_DIR, file + ".csv");
    const destination = path.join(DEST_DIR, file + ".json");

    const f = fs.readFileSync(source, { encoding: "utf-8" });
    const result = parse(f, { columns: true });
    const cc = config.find((i) => i.name == file);
    const data = result.map((i) => cc.process(i));
    try {
      fs.writeFileSync(destination, JSON.stringify(data, null, 2), "utf8");
      console.log("Data successfully saved to disk");
    } catch (error) {
      console.log("An error has occurred ", error);
    }
  });
  process.exit(0);
}

await downloadData();
csvConvert();

// UNUSED

function inspect(object) {
  const isGetter = (x, name) =>
    (Object.getOwnPropertyDescriptor(x, name) || {}).get;
  const isFunction = (x, name) => typeof x[name] === "function";
  const deepFunctions = (x) =>
    x &&
    x !== Object.prototype &&
    Object.getOwnPropertyNames(x)
      .filter((name) => isGetter(x, name) || isFunction(x, name))
      .concat(deepFunctions(Object.getPrototypeOf(x)) || []);
  const distinctDeepFunctions = (x) => Array.from(new Set(deepFunctions(x)));
  const getMethods = (obj) =>
    distinctDeepFunctions(obj).filter(
      (name) => name !== "constructor" && !~name.indexOf("__"),
    );
  return getMethods(object);
}

function xlConvert() {
  const sourceFiles = fs
    .readdirSync(SOURCE_DIR)
    .filter((i) => i.endsWith("xlsx"));

  const files = sourceFiles.map((i) => i.split(".")[0]);

  const destination = files
    .map((i) => i + ".json")
    .map((i) => path.join(import.meta.dirname, DEST_DIR, i));

  // const filepaths = files.map((i) =>
  //   path.join(import.meta.dirname, SOURCE_DIR, i),
  // );

  console.log();

  files.forEach(async (filename, index) => {
    const file = path.join(import.meta.dirname, SOURCE_DIR, filename + ".xlsx");
    const workbook = new excel.Workbook();
    const data = await workbook.xlsx.readFile(file);
    const json = JSON.stringify(workbook.model);

    let headers = [];
    let jsonData = [];

    workbook.worksheets.forEach((sheet) => {
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 0) {
          const rowValues = row.values;
          rowValues.shift(); // first column is always empty
          if (rowNumber === 1) {
            headers = rowValues; // 1 indexed instead of 0 indexed
          } else {
            const rowObject = {};
            for (let i = 0; i < headers.length; i++) {
              const title = headers[i];
              const value = rowValues[i] ? rowValues[i] : "";
              rowObject[title] = value;
            }
            jsonData.push(rowObject);
          }
        }
      });
      console.log(jsonData);
      console.log(filename);
      return;

      try {
        fs.writeFileSync(
          destination[index],
          JSON.stringify(result, null, 2),
          "utf8",
        );
        console.log("Data successfully saved to disk");
      } catch (error) {
        console.log("An error has occurred ", error);
      }
    });
  });
}

//creates the csv string to write it to a file
// for (let i = 0; i < rows.length; i++) {
//   writeStr += rows[i].join(",") + "\n";
// }

//writes to a file, but you will presumably send the csv as a
//response instead
// fs.writeFile(__dirname + "/test.csv", writeStr, function (err) {
//   if (err) {
//     return console.log(err);
//   }
//   console.log("test.csv was saved in the current directory!");
// });
