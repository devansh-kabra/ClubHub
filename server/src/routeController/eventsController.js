import pool from "../pool.js";
import slugify from "../util/slugify.js";

export async function allEventsBasic(req, res) {
    try {
        const result = await pool.query("SELECT events.id, events.name, events.event_slug, events.date, events.start_time, events.end_time, clubs.club_slug as club_slug, clubs.color as color FROM events JOIN clubs ON clubs.id = events.club_id");
        res.json(result.rows);
    } catch (err) {
        console.error(err.stack);
        res.status(502).send("Cannot connect to database");
    }
}

export async function getClubEvents(req, res) {
    const club_slug = req.params.club_slug;

    try {
        const result = await pool.query(`SELECT events.* FROM events JOIN clubs ON events.club_id = clubs.id 
            WHERE clubs.club_slug = $1 ORDER BY date ASC, start_time, end_time ASC NULLS LAST`, [club_slug]);
        const data = result.rows;

        res.status(200).json({
            clubEvents: data.map(event => {
                return {
                    id: event.id,
                    name: event.name,
                    event_slug: event.event_slug,
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

//returns a object of a specific event based on the param: event_slug. Also gives its club basic details like id and name.
export async function getEvent(req, res) {
    const event_slug = req.params.event_slug;
    const club_slug = req.params.club_slug;
    try {
        const result = await pool.query(`SELECT events.*, clubs.id AS clubId, clubs.name AS club_name, 
            COUNT(student_bookmarks.event_id) AS bookmark,
            MAX(CASE WHEN student_bookmarks.student_id = $1 THEN 1 ELSE 0 END) AS bookmarked
            FROM events 
            INNER JOIN clubs ON events.club_id = clubs.id 
            LEFT JOIN student_bookmarks ON events.id = student_bookmarks.event_id
            WHERE events.event_slug = $2 AND clubs.club_slug = $3
            GROUP BY events.id, clubs.id;`, 
                [req.session?.user?.userId || 0, event_slug, club_slug]);

        console.log(result);

        if (result.rows.length === 0) {
            res.status(404).json({
                code: "EVENT_REMOVED"
            });
            return;
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(502).json({
            code: "SERVER_ISSUE"
        });
    }
}

export async function newEvent(req, res) {

    const club_slug = `${req.params.club_slug}`;
    const event_name = req.body.name;
    const event_about = req.body.about;
    const venue = (req.body.venue) ? req.body.venue:null;
    const date = req.body.date;

    const start_time = (req.body.startTime) ? req.body.startTime:null;
    const end_time = (req.body.endTime) ? req.body.endTime:null;

    const registration = (req.body.registration) ? req.body.registration:null;
    const registration_deadline = (req.body.registration_deadline) ? req.body.registration_deadline:null;
    

    try {
        
        const event_slug = await slugify(club_slug, event_name);
        const get_club_id = await pool.query("SELECT id FROM clubs WHERE club_slug = $1", [club_slug]);
        const club_id = await get_club_id.rows[0].id;
        await pool.query(`INSERT INTO events (club_id, name, event_slug, date, start_time, end_time, venue, about, registration, registration_deadline)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, 
            [club_id, event_name, event_slug, date, start_time, end_time, venue, event_about, registration, registration_deadline]);

        res.status(200).json({
            event_slug: event_slug,
            code: "SUCCESS"
        });

        return;
    } catch (error) {
        res.status(500).json({
            code: "SERVER_ISSUE"
        });
        return;
    }
    
}

export async function editEvent(req, res) {
    const club_slug = `${req.params.club_slug}`;
    const event_slug = `${req.params.event_slug}`;
    const event_about = req.body.about;
    const venue = (req.body.venue) ? req.body.venue:null;
    const date = req.body.date;

    const start_time = (req.body.startTime) ? req.body.startTime:null;
    const end_time = (req.body.endTime) ? req.body.endTime:null;

    const registration = (req.body.registration) ? req.body.registration:null;
    const registration_deadline = (req.body.registration_deadline) ? req.body.registration_deadline:null;

    if (!req.session || !req.session.user || req.session.user.userType != "club" || club_slug !== req.session.user.user_slug) {
        res.status(401).json({
            code: "UNAUTHORIZED"
        });
        return;
    }

    try {
        const get_club_id = await pool.query("SELECT id FROM clubs WHERE club_slug = $1", [club_slug]);
        const club_id = await get_club_id.rows[0].id;

        await pool.query(`UPDATE events SET 
            date = $1,
            start_time = $2,
            end_time = $3,
            venue = $4,
            about = $5,
            registration = $6,
            registration_deadline = $7

            WHERE club_id = $8 AND event_slug = $9`, 
        [date, start_time, end_time, venue, event_about, registration, registration_deadline, club_id, event_slug]);

        res.status(200).json({
            code: "UPDATED"
        });

        return;

    } catch (err) {
        res.status(500).json({
            code: "SERVER_ISSUE"
        });
    }

}

export async function deleteEvent(req, res) {
    
    const club_slug = req.params.club_slug;
    const event_slug = req.params.event_slug;

    if (!req.session || !req.session.user || req.session.user.userType != "club" || club_slug !== req.session.user.user_slug) {
        res.status(401).json({
            code: "UNAUTHORIZED"
        });
        return;
    }

    try {
        await pool.query('DELETE FROM events USING clubs WHERE events.club_id = clubs.id AND clubs.club_slug = $1 AND events.event_slug = $2',
            [club_slug, event_slug]
        );

        res.status(200).json({
            code: "DELETED"
        });

        return;

    } catch (err) {
        res.status(500).json({
            code: "SERVER_ISSUE"
        });
    }
}

