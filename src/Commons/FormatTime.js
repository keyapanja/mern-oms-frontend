
export function FormatTime(val) {
    var time = new Date(val).toLocaleTimeString().split(" ");
    if (!val) {
        time = new Date().toLocaleTimeString().split(" ");
    }
    return time[0].slice(0, -3) + " " + time[1];
}

export function diffTime(start, end) {
    const startTime = start ? new Date(start) : new Date();
    const endTime = new Date(end);

    let difference = endTime.getTime() - startTime.getTime();
    difference = difference / 1000 / 60;
    let hours = parseInt(difference / 60);
    let minutes = parseInt(difference % 60);

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    if (hours < 10) {
        hours = '0' + hours
    }

    if (hours && minutes) {
        return hours + ' : ' + minutes + ' Hours'
    } else {
        return '00 : 00 Hours'
    }
}

export function checkTimeValidity(start, end) {
    const startTime = start ? new Date(start) : new Date();
    const endTime = end ? new Date(end) : new Date();

    let difference = endTime.getTime() - startTime.getTime();
    difference = difference / 1000 / 60;
    let hours = parseInt(difference);
    let minutes = parseInt(difference % 60);

    return hours + minutes;
}

export function formatDate(date) {
    const newDate = new Date(date).toDateString().slice(3);
    const datePart = newDate.split(" ");
    return datePart[1] + " " + datePart[2] + ", " + datePart[3];
}

export function formatCurrency(amount, code) {
    return parseInt(amount).toLocaleString('en-US', {
        style: 'currency',
        currency: code
    })
}

export function diffInTwoTimes(time1, time2) {
    if (time1 && time2) {

        let time1Parts = time1.split(':');
        let time1H = parseInt(time1Parts[0]);
        let time1M = parseInt(time1Parts[1]);
        let first = (time1H * 60) + time1M;

        let time2Parts = time2.split(":");
        let time2H = parseInt(time2Parts[0]);
        let time2M = parseInt(time2Parts[1]);
        let second = (time2H * 60) + time2M;

        var diff = 0;
        if (first === second) {
            return '00:00';
        } else {
            if (first < second) {
                diff = second - first;
            } else {
                diff = first - second;
            }
            let diffH = parseInt(diff / 60);

            if (diffH < 10) {
                diffH = '0' + diffH;
            }

            let diffM = parseInt(diff % 60);

            if (diffM < 10) {
                diffM = '0' + diffM;
            }

            return diffH + ':' + diffM;
        }
    } else {
        return '00:00';
    }
}

export function addTimes(times) {
    if (times.length > 0) {
        var total = 0;
        for (let index = 0; index < times.length; index++) {
            const element = times[index];
            const timeParts = element.toString().split(':');
            const h = parseInt(timeParts[0]);
            const m = parseInt(timeParts[1]);
            const t = (h * 60) + m;
            total += parseInt(t);
        }

        if (total > 0) {
            let totalH = parseInt(total / 60);

            if (totalH < 10) {
                totalH = '0' + totalH;
            }

            let totalM = parseInt(total % 60);

            if (totalM < 10) {
                totalM = '0' + totalM;
            }

            return totalH + ':' + totalM;
        } else {
            return '00:00';
        }
    } else {
        return '00:00';
    }
}

export function diffDates(date1, date2) {
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    var diff = d2.getTime() - d1.getTime();
    var dayDiff = (diff / (1000 * 60 * 60 * 24)) + 1;
    return parseInt(dayDiff);
}

export function CountWorkingDays(date1, date2) {
    var d1 = new Date(date1);
    var d2 = new Date(date2);

    var diff = d2.getTime() - d1.getTime();
    var dayDiff = parseInt((diff / (1000 * 60 * 60 * 24)) + 1);
    const oneday = 1000 * 60 * 60 * 24;

    for (let index = d1.getTime(); index <= d2.getTime(); index += oneday) {
        if (new Date(index).getDay() === 0) {
            dayDiff -= 1;
        }
    }

    return dayDiff;
}