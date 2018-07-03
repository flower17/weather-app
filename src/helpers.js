// remove duplicates from CityLog array:
export const removeDuplicates = (objectsArray) => {
    return objectsArray.filter( (item, index, self) => 
                        self.findIndex( t => t.id === item.id ) === index);
}


// convert sunrise and sunset time to local time string according to city timezone, example:
// sunrise: 1529486686, gmtOffset: -14400
// should return: '05:24'
export const convertToDayTime = (time, gmtOffset) => {
    const date = new Date((time + gmtOffset) * 1000);
    
    let hours = '00' + date.getUTCHours();
    hours = hours.substr(hours.length-2, 2);

    let minutes = '00' + date.getUTCMinutes();
    minutes = minutes.substr(minutes.length-2, 2);

    return `${hours}:${minutes}`;
}

const padEnd = (number) => {
    const str = number.toString();
    const pos = str.indexOf('.');
    if (pos === -1){
        return str + '.00';
    }
    else{
        if (str.length - 1 - pos < 2){
            return str + '0';
        }
        else{
            return str;
        }
    }
}


// convert geo coordinates from decimal format to degrees minutes seconds format, example:
// lat: 21.129598, lon: -77.729594
// should return: 21° 7′ 46.55″ N, 77° 43′ 46.54″ W
export const convertCoords = (lat, lon) => {
    const letterLat = lat > 0
                        ? `N`
                        : `S`;
    const letterLon = lon > 0
                        ? `E`
                        : `W`;
    
    const latABS = Math.abs(lat);
    const lonABS = Math.abs(lon);

    const degreesLat = Math.floor(latABS); 
    const degreesLon = Math.floor(lonABS); 

    const minLat = Math.floor((latABS - degreesLat) * 60);
    const minLon = Math.floor((lonABS - degreesLon) * 60);
    
    const secLat = Math.floor( ((latABS - degreesLat) * 60 - minLat) * 60 * 100 ) / 100;
    const secLon = Math.floor( ((lonABS - degreesLon) * 60 - minLon) * 60 * 100 ) / 100;

    return `${degreesLat}° ${minLat}′ ${padEnd(secLat)}″ ${letterLat},
            \u00A0${degreesLon}° ${minLon}′ ${padEnd(secLon)}″ ${letterLon}`;
}


// convert number of seconds to string date format, example:
// seconds: 1530527400
// should return: "Monday, Jul 2"
export const getDateString = (seconds, locale = 'en-US', keepComma = true) => {

    //console.log('keepComma', keepComma);
    const date = new Date(seconds*1000);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateString = keepComma
                        ?  date.toLocaleDateString(locale, options)
                        :  date.toLocaleDateString(locale, options).replace(',', '\n');
    return dateString;
}



const getMaxTemp = (list) => {
    return list.sort((a, b) => b.tempMax-a.tempMax )[0].tempMax;
}
const getMinTemp = (list) => {
    return list.sort((a, b) => a.tempMin-b.tempMin )[0].tempMin;
}

const getNoonValues = (list, hours = 12) => {
    //console.log('getNoonValues', list);
    return list.find(item => {
        const date = new Date(item.date*1000);
        if (date.getHours() === hours){
            return item;
        }
    });
}

// parse long forecast list (5 days forecast returnes 40 weather items - 1 item for every 3 hour interval)
// define daily max and min temp, weather icon and wind at noon time
// returns array of 5 weather objects to be used in ForecastDay component
export const parseForecastData = (data) => {
    //console.log('parseForecastData', data);
    if(data.length === 0){
        return null;
    }
    
    const parsedData = [];
    let day = 1;
    while (day <= 5){
        const nextDay = new Date( Date.now() + 24*60*60*1000*day );

        const index = data.findIndex(item => { 
            const date = new Date(item.date*1000);
            return (date.getMonth() === nextDay.getMonth() && date.getDate() === nextDay.getDate())
        });

        const dayValues = [];
        for (let i = 0; i < 8; i++){
            if (i < index) {
                data.shift();
            }
            else{
                dayValues.push (data.shift());
            }
        }
        const tempMax = getMaxTemp(dayValues);
        const tempMin = getMinTemp(dayValues);

        const item = getNoonValues(dayValues);
        //console.log('AFTER getNoonValues', item);
        parsedData.push({ 
            date: Math.floor(nextDay/1000),
            icon: item.icon,
            tempMax,
            tempMin,
            windDir: item.windDir,
            windSpeed: item.windSpeed,
            description: item.description,
        });

        day++;
    }
    return parsedData;
}
