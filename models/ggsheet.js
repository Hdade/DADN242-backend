const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require ('google-auth-library');

require("dotenv").config({path:"../config.env"});

const PRIVATE_KEY = process.env.PRIVATE_KEY
const CLIENT_EMAIL = process.env.CLIENT_EMAIL
const SHEET_ID = process.env.SHEET_ID;

// async function insertStat() {
//   try {
//   const serviceAccountAuth = new JWT({
//     email: CLIENT_EMAIL,
//     key: PRIVATE_KEY,
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//   });

//   const doc = new GoogleSpreadsheet(SHEET_ID,serviceAccountAuth);

//   await doc.loadInfo();
  
//   const sheet = doc.sheetsByIndex[0];
//   const date = new Date();

//   await sheet.addRow(
//   {
//     "Measured_Time": date,
//     "Sensor_ID": 'LS01',
//     "Measured_Stat": 33.0,
//   });

//   return "all good";
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return "dead";
//   }
// }

async function getSheetStat(Sensor_ID) {
  try {
    const serviceAccountAuth = new JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SHEET_ID,serviceAccountAuth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows(); // Fetch all rows

    const filteredRows = rows
      .map(row => {
        return {
          Measured_Time: new Date(row.get("Measured_Time")), // Correct access
          Sensor_ID: row.get("Sensor_ID").trim(), // Trim spaces
          Measured_Stat: parseFloat(row.get("Measured_Stat").replace(",", ".")), // Fix comma issue
        };
      })
      .filter(row => row.Sensor_ID === Sensor_ID) // Now filtering AFTER extracting values
      .sort((a, b) => b.Measured_Time - a.Measured_Time); // Sort by latest time

    //console.log("Filtered rows:", filteredRows);
    // Get the latest entry
    const latestEntry = filteredRows.length > 0 ? filteredRows[0]: null;
    return latestEntry;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "dead";
  }
}


module.exports =  {getSheetStat};
