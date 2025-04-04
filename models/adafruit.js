require("dotenv").config({path:"../config.env"})

User_key = process.env.ADAFRUIT_USER_KEY;
Light_feed = process.env.ADAFRUIT_LIGHT_FEED;
Soil_moisture_feed = process.env.ADAFRUIT_SOIL_MOISTURE_FEED;
ADAFRUIT_ACTIVE_KEY = process.env.ADAFRUIT_ACTIVE_KEY;

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
  
}

module.exports = {
  Adafruit
};