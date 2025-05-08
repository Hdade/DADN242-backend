const express = require('express');

require("dotenv").config({path:"./config.env"});
const{MongoDB} = require("../models/database.cjs");
const { Adafruit } = require('../models/adafruit');

const router = express.Router();

router.put("/setLightLimit", async (req,res) =>{
  const {Limit } = req.body;
  try{
    const adafruitRes = await Adafruit.changeLightLimt(Limit);
    const databaseRes = await MongoDB.changeLimit("LS01",Limit);
    res.status(200).json({...adafruitRes,...databaseRes});
  } catch(e){
    //console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
});

router.put("/setSoilMoistureLimit", async (req,res) =>{
  const {Limit } = req.body;
  try{
    const adafruitRes = await Adafruit.changeSoilMoistureLimit(Limit);
    const databaseRes = await MongoDB.changeLimit("SMS01",Limit);
    res.status(200).json({...adafruitRes,...databaseRes});
  } catch(e){
    //console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
});

router.put("/changeMode", async (req,res) =>{
  const {Mode} = req.body;
  try{
    const adafruit = await Adafruit.changeMode(Mode === 'auto' ? 1 : 0);
    const databaseRes = await MongoDB.changeMode("farmer1",Mode);
    res.status(200).json({...adafruit,...databaseRes});
  }catch(e){
    //console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/changeLightActivation", async (req,res) =>{
  const {Activation} = req.body;
  try{
    const adafruit = await Adafruit.changeLightActivation(Activation === 'on'? 1:0);
    const databaseRes = await MongoDB.changeActivation("L01", Activation === 'on'? true:false);
    res.status(200).json({...adafruit,...databaseRes});
  }catch(e){
    //console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/changeWaterPumpActivation", async (req,res) =>{
  const {Activation} = req.body;
  try{
    const adafruit = await Adafruit.changePumpActivation(Activation === 'on'? 1:0);
    const databaseRes = await MongoDB.changeActivation("WP01", Activation === 'on'? true:false);
    res.status(200).json({...adafruit,...databaseRes});
  }catch(e){
    //console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getDailyStat", async (req,res)=>{
  const {Sensor_ID,date} = req.query;
  try{
    const dailyStat = await MongoDB.getAverageStat(Sensor_ID,date);
    res.status(200).json(dailyStat)
  }catch(e){
    //console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
})


module.exports = router;