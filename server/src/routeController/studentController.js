import pool from "../pool.js";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

const saltRounds = 10;
const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);

export async function Register(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const check = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
        if (check.rows.length !== 0) {return res.status(409).json({
            code: "USER_ALREADY_EXISTS",
        });}
            
        const hashed = await bcrypt.hash(password, saltRounds);
        const result = await pool.query("INSERT INTO students (email, password) VALUES ($1, $2) RETURNING id", [email, hashed]);

        req.session.user = {
            userType: "student",
            userId: result.rows[0].id,
            username: email,
        };

        return res.status(201).json({ 
            userType: "student",
            username: email,
            code: "S",
        });

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ISSUE",
        });
    }
}

export async function Login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const check = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
        if (check.rows.length === 0) {return res.status(404).json({
            code: "USER_NOT_FOUND"
        });}
            
        const userData = check.rows[0];
        if (userData.isgooglelogin) {
            res.status(500).json({
                code: "NO_MANUAL_LOGIN",
            });
            return;
        }
        const compare = await bcrypt.compare(password, userData.password);

        if (!compare) {
            return res.status(401).json({
                code: "INCORRECT_PASSWORD",
            });
        } else {
            req.session.user = {
                userType: "student",
                userId: userData.id,
                username: email,
            }

            return res.status(201).json({ 
                userType: "student",
                username: email,
                code: "S",
            });
        }
    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ISSUE",
        });
    }
}

export async function GoogleLogin(req, res) {
    const token = req.body.token;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENTID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        let user = await pool.query("SELECT * FROM students WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            user = await pool.query("INSERT INTO students (email, isgooglelogin) VALUES ($1, $2) RETURNING *", [email, true]);
        }

        const userData = user.rows[0];
        if (!userData.isgooglelogin) {
            res.status(500).json({
                code: "NO_GOOGLE_LOGIN",
            });
            return;
        }

        req.session.user = {
            userType: "student",
            userId: userData.id,
            username: userData.email,
        };

        res.status(201).json({
            userType: "student",
            username: userData.email,
            code: "S"
        });
    } catch (err) {
        res.status(500).json({
            code: "UNKNOWN_ERROR",
        })
    }
}

export async function getBookmarks(req, res) {
    const student_id = req.session?.user?.userId || 0;
    try {
        const result = await pool.query(`SELECT events.*, clubs.club_slug FROM events 
            JOIN student_bookmarks ON events.id = student_bookmarks.event_id
            JOIN clubs ON events.club_id = clubs.id
            WHERE student_bookmarks.student_id = $1 ORDER BY date ASC, start_time, end_time ASC NULLS LAST`, [student_id]);
        const data = result.rows;

        res.status(200).json({
            bookmarks: data.map(event => {
                return {
                    id: event.id,
                    name: event.name,
                    event_slug: event.event_slug,
                    club_slug: event.club_slug,
                    date: event.date,
                    startTime: event.start_time,
                    endTime: event.end_time,
                    venue: event.venue
                }
            }),
            code: "SUCCESS",
        });
    } catch (err) {
        res.status(500).json({
            code: "SERVER_ISSUE"
        })
    }
}

export async function ToggleBookmark(req, res) {
    const bookmarkState = Boolean(req.body.bookmark);
    const eventId = Number(req.body.eventId);
    try {
        if (bookmarkState) {await pool.query("INSERT INTO student_bookmarks (student_id, event_id) VALUES ($1, $2)", [req.session.user.userId, eventId]);}
        else {await pool.query("DELETE FROM student_bookmarks WHERE student_id = $1 AND event_id = $2", [req.session.user.userId, eventId]);}
        
        res.status(200).json({
            code: "UPDATED",
        });
    } catch (err) {
        res.status(500).json({
            code: "SERVER_ISSUE",
        });
    }
}