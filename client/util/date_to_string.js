export function convertTime(timing) {
    if (timing) {
        const time = new Date(timing);
        let hours = time.getHours();
        let minutes = time.getMinutes();

        if (hours < 10) {hours = `${hours}${hours}`;}
        else {hours = `${hours}`;}

        if (minutes < 10) {minutes = `${minutes}${minutes}`;}
        else {minutes = `${minutes}`;}

        return `${hours}:${minutes}`;
    }

    return null;
}

export function getTimeOfEvent(start, end) {
    if (start && end) {
        return convertTime(start) + ' to ' + convertTime(end)
    } else if (start) {
        return convertTime(start) + ' to TBA';
    } else if (end) {
        return "TBA to " + convertTime(end);
    } else {return "TBA to TBA";}
}