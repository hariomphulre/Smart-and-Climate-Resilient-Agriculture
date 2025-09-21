const { sql } = require("../NeonSetup.js");
const express = require("express");
const router = express.Router();

router.post("/event-schedule", async(req,res) => {
    try{
        const {title, description, eventStartDate, eventEndDate, startTime, endTime, location} = req.body;
        const result = await sql`
        INSERT INTO events (title, description, event_start_date, event_end_date, start_time, end_time, location)
        VALUES(${title}, ${description}, ${eventStartDate}, ${eventEndDate}, ${startTime}, ${endTime}, ${location})`;
        console.log(result);
        res.status(200).json({message : "Event Scheduled Successfully"});
    }catch(error){
        console.log("Error scheduling events:", error);
        res.status(400).json({message: "Error in scheduling events"});
    }
});

module.exports = router;