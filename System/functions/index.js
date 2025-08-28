const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const {onValueUpdated} = require("firebase-functions/database");
const {getDatabase}=require("firebase-admin/database");
const logger = require("firebase-functions/logger");
setGlobalOptions({maxInstances: 10});

const admin=require("firebase-admin");
admin.initializeApp();

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.trigger=onValueUpdated("/climate-data/vegetation/", async(event)=>{
  logger.info(" New Data Triggered");
  const db=getDatabase();
  const index=["ndvi","evi","gci","psri","ndre","cri1"];
  for(let i of index){
    const snapshot=await db.ref(`/climate-data/vegetation/${i}`).get();
    if(snapshot.exists()){
      const url=snapshot.val().url;
      // if(i=="ndvi"){

      // }
      // if(i=="evi"){
        
      // }
      // if(i=="gci"){
        
      // }
      // if(i=="psri"){
        
      // }
      // if(i=="ndre"){
        
      // }
      // if(i=="cri1"){
        
      // }
      return db.ref("/climate-data/vegetation/nutrition-data/nitrogen").set("100");
    }
  }

})