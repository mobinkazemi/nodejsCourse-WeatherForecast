const request = require('request');

function forecast(latitude, longitude, callback){
    const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?aggregateHours=24&combinationMethod=aggregate&contentType=json&unitGroup=metric&locationMode=single&key=03QGG3DUG86210W2L89BRUUEI&dataElements=default&locations=' + latitude + ', ' + longitude;
    request({url: url}, (error, response) => {
        if(latitude.length === 0 || longitude.length === 0){
            callback('No place entered. Its field is empty...', undefined);
        } else if (error) {
            callback('We believe that you do not have internet connection. Please check it out and try again...', undefined);
        } else if(response.body.error){
            callback('Something went wrong. Please try again...', undefined);
        } else{
            const bodyParsed = JSON.parse(response.body);
            const currentCondition = bodyParsed.location.currentConditions;
            const todayCondition = bodyParsed.location.values[0];
            const tomorrowCondition = bodyParsed.location.values[1];

            callback(undefined, [{
                Place_name: bodyParsed.location.address
            },{
                current_date: currentCondition.datetime,
                current_temp: currentCondition.temp,
                current_summary: currentCondition.icon
            },{
                today_date: todayCondition.datetimeStr,
                today_temp: todayCondition.temp,
                today_maxTemp: todayCondition.maxt,
                today_summary: todayCondition.conditions
            },{
                tomorrow_date: tomorrowCondition.datetimeStr,
                tomorrow_temp: tomorrowCondition.temp,
                tomorrow_maxTemp: tomorrowCondition.conditions
            }]);
        }
    });

}

module.exports = forecast;