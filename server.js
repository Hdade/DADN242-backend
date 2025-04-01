const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

require("dotenv").config({path:"./config.env"})
const{
  getSensor,
  getOutputDevice,
  getInfo,
  getCurrentStat,
  getActionLog,
  getEnvironmentCondition,
  getSetting,
  changeActivation,
  insertActionLog,
  insertEnvironmentCondition,
  getAuthentication
} = require("./models/database.cjs")
const {getSheetStat} = require("./models/ggsheet.js")

// Initialize express app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Request logging

// API routes

app.get("/getSensor", async (req, res) => {
  const {User_ID} = req.query;
  try {
    const sensors = await getSensor(User_ID);
    res.status(200).json(sensors);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getOutputDevice", async (req, res) => {
  const {User_ID} = req.query;
  try {
    const devices = await getOutputDevice(User_ID);
    res.status(200).json(devices);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getInfo", async (req, res) => {
  const {User_ID} = req.query;
  try {
    const info = await getInfo(User_ID);
    res.status(200).json(info);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.get("/getCurrentStat", async (req, res) => {
//   const {User_ID} = req.query;
//   try {
//     const stat = await getCurrentStat(User_ID);
//     res.status(200).json(stat);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/getAuthentication", async (req, res) => {
  const {User_ID, Password} = req.query;
  try {
    const auth = await getAuthentication(User_ID, Password);
    if (auth){
      res.status(200).json({Authentication:auth});
    }
    else{
      res.status(404).json({Authentication:auth});
    }
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getCurrentStat", async (req, res) => {
  const {Sensor_ID} = req.query;
  try {
    const stat = await getCurrentStat(Sensor_ID);
    res.status(200).json(stat);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getSheetStat", async (req, res) => {
  const {Sensor_ID} = req.query;
  try {
    const stat = await getSheetStat(Sensor_ID);
    console.log(stat);
    res.status(200).json(stat);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getActionLog", async (req, res) => {
  const {Output_ID} = req.query;
  try {
    const log = await getActionLog(Output_ID);
    res.status(200).json(log);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getEnvironmentCondition", async (req, res) => {
  const {Sensor_ID} = req.query;
  try {
    const log = await getEnvironmentCondition(Sensor_ID);
    res.status(200).json(log);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//#region circuit apis

app.get("/getSetting", async (req, res) => {
  const {Output_ID} = req.body;
  try {
    const setting = await getSetting(Output_ID);
    res.status(200).json(setting);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/changeActivation", async (req, res) => {
  const {Output_ID, Activation, Mode} = req.body;
  try {
    const device = await changeActivation(Output_ID, Activation,Mode);
    res.status(200).json(device);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/insertActionLog", async (req, res) => {
  const {Output_ID, Action} = req.body;
  const Action_Time = new Date()
  try {
    const log = await insertActionLog(Action_Time, Output_ID, Action);
    res.status(201).json(log);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/insertEnvironmentCondition", async (req, res) => {
  const {Sensor_ID, Measured_Stat} = req.body;
  const Measured_Time = new Date()
  try {
    const log = await insertEnvironmentCondition(Measured_Time, Sensor_ID, Measured_Stat);
    res.status(201).json(log);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//#endregion

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});