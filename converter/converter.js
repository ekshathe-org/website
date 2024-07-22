import fs from "node:fs";
import path from "node:path";
import { parse } from "csv/sync";
import config from "../datasource.json" assert { type: "json" };
import { parse as dateParse } from "date-fns";
// import xlsx from "node-xlsx";
import excel from "exceljs";

const SOURCE_DIR = "../datasource/";
const DEST_DIR = "../_data/";

function csvConvert() {
  const files = fs.readdirSync(SOURCE_DIR).filter((i) => i.endsWith("csv"));
  const destination = files
    .map((i) => i.split(".")[0] + ".json")
    .map((i) => path.join(DEST_DIR, i));

  const filepaths = files.map((i) => path.join(SOURCE_DIR, i));

  filepaths.forEach((file, index) => {
    const f = fs.readFileSync(file, { encoding: "utf-8" });
    const result = parse(f, { columns: true });
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
}

xlConvert();

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
