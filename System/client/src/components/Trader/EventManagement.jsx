import React from 'react';
import { useState } from 'react';

const EventManagement = () => {

    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        eventStartDate: '',
        eventEndDate: '',
        startTime: '',
        endTime: '',
        location: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/trader/event-schedule",{
                method : 'POST',
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(eventForm)
            })
            const data = await res.json();
            alert(data.message);
            setEventForm({
                title: '',
                description: '',
                eventStartDate: '',
                eventEndDate: '',
                startTime: '',
                endTime: '',
                location: '',
            })
        }
        catch (error) {
            console.error("Error submitting event form", error);
        } 
    }   

    const handleChange = (e) => {
        setEventForm({...eventForm, [e.target.name]:e.target.value})
    }

    return (
        <div>
            <h1>Event Management</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <ul>
                        <li>
                            <label>Title:</label>
                            <input type="text" name="title" value={eventForm.title} onChange={handleChange} required />
                        </li>
                        <li>
                            <label>Description:</label>
                            <input className='text-black' type="text" name='description' value={eventForm.description} onChange={handleChange} required />
                        </li>
                        <li>
                            <label>Event Start Date</label>
                            <input type="date" name='eventStartDate' value={eventForm.eventStartDate} onChange={handleChange} required />
                        </li>
                        <li>
                            <label>Event End date</label>
                            <input type="date" name='eventEndDate' value={eventForm.eventEndDate} onChange={handleChange} required />
                        </li>
                        <li>
                            <label>Location</label>
                            <input type="text" name='location' value={eventForm.location} onChange={handleChange} required />
                        </li>
                        <li>
                            <label>Start Time</label>
                            <input type="time" name='startTime' value={eventForm.startTime} onChange={handleChange} required />
                        </li>
                        <li>
                            <label>End Time</label>
                            <input type="time" name='endTime' value={eventForm.endTime} onChange={handleChange} required />
                        </li>
                        <button type='submit'>Submit</button>
                    </ul>
                </div>
            </form>
        </div>
    );
};

export default EventManagement;