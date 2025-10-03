import express from "express";
import {Register, Login, getBookmarks, GoogleLogin, ToggleBookmark} from "../routeController/studentController.js";

const router = express.Router();

router.get("/bookmarks", getBookmarks)
router.post("/register", Register);
router.post("/login", Login);
router.post("/google-login", GoogleLogin);
router.patch("/bookmark", ToggleBookmark);

export default router;