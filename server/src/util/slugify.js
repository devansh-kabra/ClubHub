import pool from "../pool.js"

async function slugify(club_slug, event_name) {
    let slug = `${event_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${new Date().getFullYear()}`;

    try {
        const check = await pool.query("SELECT events.event_slug FROM events JOIN clubs ON events.club_id = clubs.id WHERE clubs.club_slug = $1 AND events.event_slug LIKE $2", [club_slug, `${slug}%`]);
        let maxNum = 0;

        for (const row of check.rows) {
            const match = row.event_slug.match(new RegExp(`^${slug}-(\\d+)$`));
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxNum) maxNum = num;
            } 
        }

        if (check.rows.length === 0) {return slug;}
        else {return `${slug}-${maxNum+1}`;}
        
    } catch (err) {throw new Error("Unknown Error Occured");}
}

export default slugify