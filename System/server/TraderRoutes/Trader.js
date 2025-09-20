import { sql } from "../NeonSetup.js";
import express from "express";
const router = express.Router();

router.post("/api/schedule-events", async(req,res) => {
    try{
        const {title, description, eventStartDate, eventEndDate, startTime, endTime, location} = req.body;
        const result = await sql`
        INSERT INTO events (title, description, event_start_date, event_end_date, start_time, end_time, location)
        VALUES(${title}, ${description}, ${eventStartDate}, ${eventEndDate}, ${startTime}, ${endTime}, ${location})`;

        console.log(result);
        res.json().send({message : "Event Scheduled Successfully"})
    }catch(error){
        console.log("Error scheduling events shedule")
        res.json(400).send({message: "Error in scheduling events"})
    }
});

export default router;