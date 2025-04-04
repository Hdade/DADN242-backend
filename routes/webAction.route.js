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
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
});

// router.put("/setSoilMoistureLimit", async (req,res) =>{
//   const {Limit } = req.body;
//   try{
//     const adafruitRes = await Adafruit.changeLightLimt(Limit);
//     const databaseRes = await MongoDB.changeLimit("SMS01",Limit);
//     res.status(200).json({...adafruitRes,...databaseRes});
//   } catch(e){
//     console.log(e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
  
// });

module.exports = router;