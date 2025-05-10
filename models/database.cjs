const { MongoClient, Double, Db } = require("mongodb");
require("dotenv").config({path:"../config.env"})

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);


class MongoDB{
  static getSensor = async (User_ID)=> {

    try {
      await client.connect();

      const database = client.db("SmartPlant");
      const sensorsCollection = database.collection("Sensor");

      const sensors = await sensorsCollection.find({"User_ID":User_ID}).toArray();
      const ans = sensors.map(({User_ID, ...rest})=>rest);
      return ans;
    } catch(e){
      throw e;
    }finally {
      await client.close();
    }
  }

  static getOutputDevice = async (User_ID)=> {

    try {
      await client.connect();

      const database = client.db("SmartPlant");
      const outputCollection = database.collection("Output_Device");

      const Output = await outputCollection.find({"User_ID":User_ID}).toArray();
      const ans = Output.map(({User_ID,Activation, ...rest})=>rest);
      return ans;
    } catch(e){
      throw e;
    }finally {
      await client.close();
    }
  }

  static getCurrentStat = async (Sensor_ID)=> {

    try {
      await client.connect();
      const database = client.db("SmartPlant");
      const logCollection = database.collection("Environment_Condition");
      const stat = await logCollection.find({"Sensor_ID":Sensor_ID}).sort({Measured_Time:-1}).limit(1).toArray();
      const ans = stat[0]||null;
      return ans;
    } catch(e){
      throw e;
    }finally {
      await client.close();
    }
  }

  static getActionLog = async (Output_ID)=> {

    try {
      await client.connect();
      const database = client.db("SmartPlant");
      const logCollection = database.collection("Action_Log");
      const log = await logCollection.find({"Output_ID":Output_ID}).toArray();
      return log;
    } catch(e){
      throw e;
    }finally {
      await client.close();
    }
  }

  static getEnvironmentCondition = async (Sensor_ID)=> {

    try {
      await client.connect();
      const database = client.db("SmartPlant");
      const logCollection = database.collection("Environment_Condition");
      const log = await logCollection.find({"Sensor_ID":Sensor_ID}).toArray();
      return log;
    } catch(e){
      throw e;
    }finally {
      await client.close();
    }
  }

  static getSetting = async (Output_ID)=> {

    try {
      await client.connect();
      const database = client.db("SmartPlant");
      
      const deviceCollection = database.collection("Output_Device");
      const devices = await deviceCollection.find({"Output_ID":Output_ID}).toArray();
      const device = devices[0] || null;
      
      const sensorsCollection = database.collection("Sensor");
      const sensors = await sensorsCollection.find({"Output_ID":Output_ID}).toArray();
      const sensor = sensors[0] || null;

      const ans = {Mode:device.Mode, Activation: device.Activation? 'on': 'off', Limit: sensor.Limit};
      console.log (ans);
      return ans;
    } catch(e){
      throw e;
    }finally {
      await client.close();
    }
  }

  static changeActivation = async (Output_ID, Activation,Mode)=> {

    try {
      await client.connect();
      const database = client.db("SmartPlant");
      const deviceCollection = database.collection("Output_Device");
      const device = await deviceCollection.updateOne({Output_ID:Output_ID}, {$set:{Activation:Activation,Mode:Mode}});
      return device;
    } catch(e){
      throw e;
    }finally {
      await client.close();
    }
  };

  static insertActionLog = async (Action_Time, Output_ID, Action)=> {

    try {
      await client.connect();
      const database = client.db("SmartPlant");
      const logCollection = database.collection("Action_Log");
      const latestLog = await logCollection.findOne({"Output_ID":Output_ID}, {sort:{"Action_Time":-1}});
      // console.log(latestLog);
      // console.log(Action)
      if (latestLog && latestLog.Action === Action){
        return latestLog
      }
      const Log = await logCollection.insertOne({Action_Time:Action_Time, Action:Action, Output_ID:Output_ID});
      return Log;
    } catch(e){
      throw e;
    }finally {
      await client.close();
    }
  };

  static insertEnvironmentCondition = async (Measured_Time, Sensor_ID, Measured_Stat)=> {

    try {
      await client.connect();
      const database = client.db("SmartPlant");
      const logCollection = database.collection("Environment_Condition");
      const Log = await logCollection.insertOne({Measured_Time:Measured_Time,Sensor_ID:Sensor_ID, Measured_Stat:Measured_Stat});
      return Log;
    } catch(e){
      throw e;
    }finally {
      await client.close();
    }
  };

  static getAuthentication = async (User_ID, Password)=> {

    try {
      await client.connect();
      const database = client.db("SmartPlant");
      const logCollection = database.collection("Farmer");
      const Log = await logCollection.find({User_ID:User_ID,Password:Password}).toArray();
      //console.log(Log[0]? true : false);
      return Log[0]? true : false;
    } catch(e){
      throw e;
    }finally {
      await client.close();
    }
  };

  static changeLimit = async (Sensor_ID,Limit) =>{
    try{
      await client.connect();
      const database = client.db("SmartPlant");
      const sensorCollection = database.collection("Sensor");
      const change = await sensorCollection.updateOne({Sensor_ID:Sensor_ID},{$set:{Limit:new Double(Limit)}});
      return change;
    }catch(e){
      throw(e);
    } finally {
      await client.close();
    }
  }

  static changeMode = async (User_ID, Mode) =>{
    try{
      await client.connect();
      const database = client.db("SmartPlant");
      const outputCollection = database.collection("Output_Device");
      const change = await outputCollection.updateMany({User_ID:User_ID}, {$set:{Mode:Mode}});
      return change;
    } catch(e){
      throw (e);
    } finally {
      await client.close();
    }
  }

  static changeActivation = async (Output_ID,Activation) =>{
    try{
      await client.connect();
      const database = client.db("SmartPlant");
      const outputCollection = database.collection("Output_Device");
      const change = await outputCollection.updateOne({Output_ID:Output_ID}, {$set:{Activation:Activation}});
      return change;
    }catch(e){
      throw e;
    }finally{
      await client.close();
    }
  }

  static getAverageStat = async (Sensor_ID,date)=>{
    try{
      await client.connect();
      const database = client.db("SmartPlant");
      const statCollection = database.collection("Environment_Condition");
      let averageStat = [];
      for (let i = 0; i < 12; i++) {
        const dayStat = await statCollection.find({Sensor_ID:Sensor_ID,Measured_Time:{
        $gte: new Date(date + "T"+(i*2).toString().padStart(2, "0")+":00:00+07:00"), $lte: new Date(date + "T"+((i*2)+1).toString().padStart(2, "0")+":59:59+07:00")}},{sort:{Measured_Time:1}}).toArray();
        // console.log(dayStat);
        // console.log(new Date(date + "T"+(i*2).toString()+":00:00+07:00"));
        // console.log(date + "T"+(i*2).toString()+":00:00+07:00");
        // console.log(new Date(date + "T"+((i*2)+1).toString()+":59:59+07:00"));
        // console.log(date + "T"+((i*2)+1).toString()+":59:59+07:00");

        if (dayStat.length == 0) {
          averageStat[i] = 0;
          continue;
        }
        const sum = dayStat.reduce((a,b)=>a + b.Measured_Stat,0);
        averageStat[i] = sum / dayStat.length;
      }
      
      return averageStat;
    }catch (e){
      // console.log(e)
      throw e;
    }finally{
      await client.close();
    }
  }
}



// const getCurrentStat = async (User_ID)=> {

//   try {
//     await client.connect();

//     const database = client.db("SmartPlant");
//     const sensorsCollection = database.collection("Sensor");
//     const sensors = await sensorsCollection.find({"User_ID":User_ID}).toArray();
//     const sensor_IDs = sensors.map(({Sensor_ID, ...rest})=>Sensor_ID)

//     const logCollection = database.collection("Environment_Condition");
//     const latestLogs = await logCollection.aggregate([
//       {$match: { Sensor_ID: { $in: sensor_IDs } }},
//       {$sort: { Measured_Time: -1 } },
//       {$group: { _id: "$Sensor_ID", latestLog: { $first: "$$ROOT" }}},
//       {$replaceRoot: { newRoot: "$latestLog" }},
//       {$sort: { Measured_Time: -1 }}
//     ]).toArray();
//     return latestLogs;
//   } catch(e){
//     console.error(e);
//   }finally {
//     await client.close();
//   }
// }



module.exports = {
  MongoDB
};