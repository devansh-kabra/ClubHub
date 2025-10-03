import express from "express";
import { allEventsBasic, getEvent, newEvent, getClubEvents, editEvent, deleteEvent } from "../routeController/eventsController.js";

const router = express.Router();

router.get("/", allEventsBasic); //calendar events
router.get('/:club_slug/:event_slug', getEvent); //event page
router.get('/:club_slug', getClubEvents); //get all club events
router.post('/:club_slug/new', newEvent); //adding new event
router.put('/:club_slug/:event_slug/edit', editEvent); //editing the event
router.delete('/:club_slug/:event_slug', deleteEvent);


export default router;