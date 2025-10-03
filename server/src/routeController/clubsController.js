import pool from "../pool.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export async function allClubs(req, res) {
    try {
        const result = await pool.query("SELECT id,name,club_slug,color FROM clubs ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            code: "SERVER_ISSUE"
        });
    }
} 

export async function getClub(req, res) {
    const club_slug = req.params.club_slug;
    try {
        const result = await pool.query("SELECT * FROM clubs WHERE club_slug = $1", [`${club_slug}`]);
        res.status(200).json({
            data: result.rows[0],
            code: "SUCCESS",
        });
    } catch (err) {
        res.status(500).json({
            code: "sERVER_ISSUE"
        });
    }
}

export async function changeColor(req, res) {
    const newColor = `${req.body.color}`;
    const club_slug = req.session.user.user_slug;
    
    try {
        await pool.query("UPDATE clubs SET color = $1 WHERE club_slug = $2", [newColor, club_slug]);
        req.session.user.user_color = newColor;
        res.status(204).end();
    } catch (err) {
        res.status(500).json({
            code: "SERVER_ISSUE"
        });
    }
}

export async function newClub(req, res) {
    const name = req.body.name;
    const about = req.body.about;
    const genSec = req.body.genSec;
    const genSecEmail = req.body.genSecEmail;

    //for time being
    res.status(200).json({
        code: "SUCCESS",
    });

    return;

    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "ernest29@ethereal.email",
        pass: "A9HU4UjV7pPZnYTJE1",
    },
    });

    const info = await transporter.sendMail({
        from: '"Ernest VonRueden" <ernest29@ethereal.email>',
        to: "devanshforjee@gmail.com",
        subject: "Club Creation Request",
        text: `${name}\n${about}\n${genSec}\n${genSecEmail}`, // plain‑text body
        html: `<p>Name:${name}<br>About:${about}<br>Gen Sec Name:${genSec}<br>Gen Sec Email:${genSecEmail}</p>`, // HTML body
    });

    res.status(200).json({
        code: "SUCCESS",
    });

}

export async function Login(req, res) {
    const password = req.body.password;
    const club_slug = req.body.club_slug;

    try {
        const result = await pool.query("SELECT * FROM clubs WHERE club_slug = $1", [club_slug]);
        const result_data = result.rows[0];
        const compare = await bcrypt.compare(password, result_data.password);

        if (compare) {
            req.session.user = {
                userType: "club",
                username: result_data.name,
                user_slug: result_data.club_slug,
                user_color: result_data.color,
            }
            
            res.status(201).json({
                userType: "club",
                username: result_data.name,
                user_slug: result_data.club_slug,
                user_color: result_data.color,
                code: "C",
            });
        } else {
            res.status(401).json({
                code: "INCORRECT_PASSWORD",
            });
        } 
    } catch (err) {
        res.status(500).json({
            code: "SERVER_ISSUE",
        });
    }
}

