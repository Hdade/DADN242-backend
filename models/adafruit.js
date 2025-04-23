require("dotenv").config({path:"../config.env"})

User_key = process.env.ADAFRUIT_USER_KEY;
Light_feed = process.env.ADAFRUIT_LIGHT_FEED;
Soil_moisture_feed = process.env.ADAFRUIT_SOIL_MOISTURE_FEED;
ADAFRUIT_ACTIVE_KEY = process.env.ADAFRUIT_ACTIVE_KEY;
Mode_feed = process.env.ADAFRUIT_MODE;
Light= process.env.ADAFRUIT_LIGHT;
Water_pump = process.env.ADAFRUIT_PUMP;

class Adafruit{
  static changeLightLimt = async (data)=> {
  
    try {
      const response = await fetch(
        `https://io.adafruit.com/api/v2/${User_key}/feeds/${Light_feed}/data`,{
          method: `POST`,
          headers:{
            'Content-Type':'application/json',
            'X-AIO-Key':ADAFRUIT_ACTIVE_KEY
          },
          body: JSON.stringify({"value": data})
        }
      );

      if (!response.ok) throw response;
      else
      return response;

    }
    catch (e) {
      throw e;
    }
  }

  static changeSoilMoistureLimit = async (data)=> {
  
    try {
      const response = await fetch(
        `https://io.adafruit.com/api/v2/${User_key}/feeds/${Soil_moisture_feed}/data`,{
          method: `POST`,
          headers:{
            'Content-Type':'application/json',
            'X-AIO-Key':ADAFRUIT_ACTIVE_KEY
          },
          body: JSON.stringify({"value": data})
        }
      );

      if (!response.ok) throw response;
      else
      return response;

    }
    catch (e) {
      throw e;
    }
  }

  static changeMode = async (data) =>{
    try {
      const res = await fetch(`https://io.adafruit.com/api/v2/${User_key}/feeds/${Mode_feed}/data`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'X-AIO-Key':ADAFRUIT_ACTIVE_KEY
        },
        body:JSON.stringify({"value": data})
      })
      if (!res.ok) throw res;
      else return res;
    }catch (e){
      throw e;
    }
  }

  static changeLightActivation = async (data) =>{
    try {
      const res = await fetch(`https://io.adafruit.com/api/v2/${User_key}/feeds/${Light}/data`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'X-AIO-Key':ADAFRUIT_ACTIVE_KEY
        },
        body:JSON.stringify({"value": data})
      })
      if (!res.ok) throw res;
      else return res;
    }catch (e){
      throw e;
    }
  }

  static changePumpActivation = async (data) =>{
    try {
      const res = await fetch(`https://io.adafruit.com/api/v2/${User_key}/feeds/${Water_pump}/data`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'X-AIO-Key':ADAFRUIT_ACTIVE_KEY
        },
        body:JSON.stringify({"value": data})
      })
      if (!res.ok) throw res;
      else return res;
    }catch (e){
      throw e;
    }
  }
  
}

module.exports = {
  Adafruit
};