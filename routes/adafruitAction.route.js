const express = require('express');
const {MongoDB} = require('../models/database.cjs')

require('dotenv').config({path:'../config.env'});

const router = express.Router();

router.post('/toggle',async(req,res)=>{
  const {Output_ID, Action} = req.body;
  try{
    changeLog = await MongoDB.changeActivation(Output_ID, Action === '1'? true:false)
    insertLog = await MongoDB.insertActionLog(new Date(), Output_ID,Action === '1'? 'enable':'disable')
    res.status(201).json(insertLog)
  }catch (e){
    res.status(500).json({ error: "Internal Server Error" });
  }
})

module.exports = router;