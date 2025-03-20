const { MongoClient } = require("mongodb");
require("dotenv").config({path:"../config.env"})

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);

const getSensor = async (User_ID)=> {

  try {
    await client.connect();

    const database = client.db("SmartPlant");
    const sensorsCollection = database.collection("Sensor");

    const sensors = await sensorsCollection.find({"User_ID":User_ID}).toArray();
    const ans = sensors.map(({User_ID, ...rest})=>rest);
    return ans;
  } catch(e){
    console.error(e);
  }finally {
    await client.close();
  }
}

const getOutputDevice = async (User_ID)=> {

  try {
    await client.connect();

    const database = client.db("SmartPlant");
    const outputCollection = database.collection("Output_Device");

    const Output = await outputCollection.find({"User_ID":User_ID}).toArray();
    const ans = Output.map(({User_ID,Activation, ...rest})=>rest);
    return ans;
  } catch(e){
    console.error(e);
  }finally {
    await client.close();
  }
}

const getInfo = async (User_ID)=> {

  try {
    await client.connect();

    const database = client.db("SmartPlant");
    const userCollection = database.collection("Farmer");

    const user = await userCollection.find({"User_ID":User_ID}).limit(1).toArray();
    const ans = user[0]||null;
    return ans;
  } catch(e){
    console.error(e);
  }finally {
    await client.close();
  }
}

const getCurrentStat = async (User_ID)=> {

  try {
    await client.connect();

    const database = client.db("SmartPlant");
    const sensorsCollection = database.collection("Sensor");
    const sensors = await sensorsCollection.find({"User_ID":User_ID}).toArray();
    const sensor_IDs = sensors.map(({Sensor_ID, ...rest})=>Sensor_ID)

    const logCollection = database.collection("Environment_Condition");
    const latestLogs = await logCollection.aggregate([
      {$match: { Sensor_ID: { $in: sensor_IDs } }},
      {$sort: { Measured_Time: -1 } },
      {$group: { _id: "$Sensor_ID", latestLog: { $first: "$$ROOT" }}},
      {$replaceRoot: { newRoot: "$latestLog" }},
      {$sort: { Measured_Time: -1 }}
    ]).toArray();
    return latestLogs;
  } catch(e){
    console.error(e);
  }finally {
    await client.close();
  }
}

const getActionLog = async (Output_ID)=> {

  try {
    await client.connect();
    const database = client.db("SmartPlant");
    const logCollection = database.collection("Action_Log");
    const log = await logCollection.find({"Output_ID":Output_ID}).toArray();
    return log;
  } catch(e){
    console.error(e);
  }finally {
    await client.close();
  }
}

const getEnvironmentCondition = async (Sensor_ID)=> {

  try {
    await client.connect();
    const database = client.db("SmartPlant");
    const logCollection = database.collection("Environment_Condition");
    const log = await logCollection.find({"Sensor_ID":Sensor_ID}).toArray();
    return log;
  } catch(e){
    console.error(e);
  }finally {
    await client.close();
  }
}

const getSetting = async (Output_ID)=> {

  try {
    await client.connect();
    const database = client.db("SmartPlant");
    
    const deviceCollection = database.collection("Output_Device");
    const devices = await deviceCollection.find({"Output_ID":Output_ID}).toArray();
    const device = devices[0] || null;
    
    const sensorsCollection = database.collection("Sensor");
    const sensors = await sensorsCollection.find({"Output_ID":Output_ID}).toArray();
    const sensor = sensors[0] || null;

    const ans = {Mode:device.Mode, Activation: device.Activation, Limit: sensor.Limit};
    console.log (ans);
    return ans;
  } catch(e){
    console.error(e);
  }finally {
    await client.close();
  }
}

const changeActivation = async (Output_ID, Activation,Mode)=> {

  try {
    await client.connect();
    const database = client.db("SmartPlant");
    const deviceCollection = database.collection("Output_Device");
    const device = await deviceCollection.updateOne({Output_ID:Output_ID}, {$set:{Activation:Activation,Mode:Mode}});
    return device;
  } catch(e){
    console.error(e);
  }finally {
    await client.close();
  }
};

const insertActionLog = async (Action_Time, Output_ID, Action)=> {

  try {
    await client.connect();
    const database = client.db("SmartPlant");
    const logCollection = database.collection("Action_Log");
    const Log = await logCollection.insertOne({Action_Time:Action_Time, Action:Action, Output_ID:Output_ID});
    return Log;
  } catch(e){
    console.error(e);
  }finally {
    await client.close();
  }
};

const insertEnvironmentCondition = async (Measured_Time, Sensor_ID, Measured_Stat)=> {

  try {
    await client.connect();
    const database = client.db("SmartPlant");
    const logCollection = database.collection("Environment_Condition");
    const Log = await logCollection.insertOne({Measured_Time:Measured_Time,Sensor_ID:Sensor_ID, Measured_Stat:Measured_Stat});
    return Log;
  } catch(e){
    console.error(e);
  }finally {
    await client.close();
  }
};

module.exports = {
  getSensor,
  getOutputDevice,
  getInfo,
  getCurrentStat,
  getActionLog,
  getEnvironmentCondition,
  getSetting,
  changeActivation,
  insertActionLog,
  insertEnvironmentCondition
};