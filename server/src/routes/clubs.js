import express from "express";
import { allClubs, getClub, changeColor, newClub, Login } from "../routeController/clubsController.js";

const router = express.Router();

router.get("/", allClubs);
router.get("/:club_slug", getClub);
router.patch("/change-color", changeColor);
router.post("/new", newClub);
router.post("/login", Login);

export default router;