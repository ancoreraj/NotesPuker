const dateString = () => {
    const dt = new Date();
    let localeDt = dt.toLocaleDateString({timeZone: 'Asia/Kolkata'}).split("/");
    
    let day = localeDt[0], mon = localeDt[1]
    
    if(day.length === 1) {
        localeDt[0] = '0' + day;
    }

    if(mon.length === 1) {
        localeDt[1] = '0' + mon;
    }

    return localeDt.join("/")
}

module.exports = dateString;