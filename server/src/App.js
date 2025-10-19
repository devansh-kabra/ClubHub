import express from "express";
import session from "express-session";
import 'dotenv/config';
import connectPgSimple from "connect-pg-simple";
import myPool from "./pool.js";
import cors from 'cors';

import eventsRouter from "./routes/events.js";
import clubsRouter from "./routes/clubs.js";
import studentRouter from "./routes/student.js"

const app = express();
app.set('trust proxy', 1);
app.use(cors({
    origin: "https://clubhub-steel.vercel.app",
    // origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


const pgSession = connectPgSimple(session);

//session
app.use(session({
    name: "clubhub-sid",
    store: new pgSession({
        pool: myPool,
        schemaName: 'public',
        tableName: 'sessions',
        createTableIfMissing: true,
        pruneSessionInterval: 1000*60*10,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000*60*60*24*7,
    }
}));

//cookie format is user = {userType: , username: (club/email)}
app.get("/api", (req, res) => {
    if (req.session.user) {
        const userType = req.session.user.userType;
        if (userType === "student") {
            return res.json({
                userType: "student",
                username: req.session.user.username,
                code: "S"
            });
        } else {
            return res.json({
                userType: "club",
                username: req.session.user.username,
                user_slug: req.session.user.user_slug,
                user_color: req.session.user.user_color,
                code: "C"
            });
        }
    } else {
        res.status(200).json({
            code: "N",
        });
    }
});

app.get("/api/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).json({
                code: "ERROR",
                message: "Logout request failed"
            });
            return;
        } else {
            res.clearCookie("clubhub-sid");
            res.status(200).json({
                code: "LOGOUT",
                message: "Logout successfull"
            });
            return;
        }
    });
});

app.use("/api/events", eventsRouter)
app.use("/api/clubs", clubsRouter);
app.use("/api/student", studentRouter)


export default app;