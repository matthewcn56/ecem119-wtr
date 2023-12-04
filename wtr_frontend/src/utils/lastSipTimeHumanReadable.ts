export default function lastSipTimeHumanReadable(lastSipTime: number, short: boolean = false): [string, string] {
    const lastSip = new Date(lastSipTime).getTime();
    const now = new Date().getTime();
    const timeDifference = (now - lastSip) / 1000 / 60; // Time since last sip in minutes

    let timeString = "";
    let badgeColor = "red";

    // Less than a minute
    if (timeDifference < 1) {
        timeString = short ? "<1 min ago" : "<1 minute ago";
        badgeColor = "green"
    }
    // Less than an hour
    else if (timeDifference < 60) {
        const minuteDifference = Math.round(timeDifference);

        if (minuteDifference == 1)
            timeString = short ? "1 min ago" : "1 minute ago";
        else
            timeString = short ? `${minuteDifference} mins ago` : `${minuteDifference} minutes ago`;

        badgeColor = "yellow"
    }
    // Less than a day
    else if (timeDifference < 60 * 24) {
        const hourDifference = Math.round(timeDifference / 60);

        if (hourDifference == 1)
            timeString = short ? "1 hr ago" : "1 hour ago";
        else
            timeString = short ? `${hourDifference} hrs ago` : `${hourDifference} hrs ago`;
    }
    // Less than a week
    else if (timeDifference < 60 * 24 * 7) {
        const dayDifference = Math.round(timeDifference / 60 / 24);
        
        if (dayDifference == 1)
            timeString = short ? "1 hr ago" : "1 hour ago";
        else
            timeString = short ? `${dayDifference} hrs ago` : `${dayDifference} hrs ago`;
    }
    // More than that
    else {
        if (!short)
            timeString = 'on ';
        timeString += `${new Date(lastSipTime).toLocaleDateString('en-ZA')}`
    }

    return [timeString, badgeColor];
}