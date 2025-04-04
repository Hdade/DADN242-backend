const express = require('express');

require("dotenv").config({path:"./config.env"})
const{MongoDB} = require("../models/database.cjs")
const {getSheetStat} = require("../models/ggsheet.js")

const router = express.Router();

router.get("/getSensor", async (req, res) => {
  const {User_ID} = req.query;
  try {
    const sensors = await MongoDB.getSensor(User_ID);
    res.status(200).json(sensors);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getOutputDevice", async (req, res) => {
  const {User_ID} = req.query;
  try {
    const devices = await MongoDB.getOutputDevice(User_ID);
    res.status(200).json(devices);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getInfo", async (req, res) => {
  const {User_ID} = req.query;
  try {
    const info = await MongoDB.getInfo(User_ID);
    res.status(200).json(info);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get("/getCurrentStat", async (req, res) => {
//   const {User_ID} = req.query;
//   try {
//     const stat = await getCurrentStat(User_ID);
//     res.status(200).json(stat);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/getAuthentication", async (req, res) => {
  const {User_ID, Password} = req.query;
  try {
    const auth = await MongoDB.getAuthentication(User_ID, Password);
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

router.get("/getCurrentStat", async (req, res) => {
  const {Sensor_ID} = req.query;
  try {
    const stat = await MongoDB.getCurrentStat(Sensor_ID);
    res.status(200).json(stat);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getSheetStat", async (req, res) => {
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

router.get("/getActionLog", async (req, res) => {
  const {Output_ID} = req.query;
  try {
    const log = await MongoDB.getActionLog(Output_ID);
    res.status(200).json(log);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getEnvironmentCondition", async (req, res) => {
  const {Sensor_ID} = req.query;
  try {
    const log = await MongoDB.getEnvironmentCondition(Sensor_ID);
    res.status(200).json(log);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//#region circuit apis

router.get("/getSetting", async (req, res) => {
  const {Output_ID} = req.query;
  try {
    const setting = await MongoDB.getSetting(Output_ID);
    res.status(200).json(setting);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/changeActivation", async (req, res) => {
  const {Output_ID, Activation, Mode} = req.body;
  try {
    const device = await MongoDB.changeActivation(Output_ID, Activation,Mode);
    res.status(200).json(device);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/insertActionLog", async (req, res) => {
  const {Output_ID, Action} = req.body;
  const Action_Time = new Date()
  try {
    const log = await MongoDB.insertActionLog(Action_Time, Output_ID, Action);
    res.status(201).json(log);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/insertEnvironmentCondition", async (req, res) => {
  const {Sensor_ID, Measured_Stat} = req.body;
  const Measured_Time = new Date()
  try {
    const log = await MongoDB.insertEnvironmentCondition(Measured_Time, Sensor_ID, Measured_Stat);
    res.status(201).json(log);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//#endregion

module.exports = router;