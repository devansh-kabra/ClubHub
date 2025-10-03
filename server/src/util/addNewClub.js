
import bcrypt from "bcryptjs";
import pool from "../pool.js";

const saltRounds = 10;

async function addNewClub(name, about, slug, color, password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const update = await pool.query(`INSERT INTO clubs (name, club_slug, about, color, password)
            VALUES ($1, $2, $3, $4, $5)`, [name, slug, about, color, hashedPassword]);
        console.log("Success");
    } catch (err) {
        console.log(err);
    }
}

addNewClub("New Club", "This is a new Club", "new-club", "#00ff00", "NewClub");


//run using: node -r dotenv/config src/util/addNewClub.js