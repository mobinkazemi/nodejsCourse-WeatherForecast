const request = require('request');

function coordinateFinder(address, callback){
    const url_City = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1IjoibW9iaW5rYXplbWkiLCJhIjoiY2toaTNrbTk3MGN0ajJzdnMyeGN6b2hoNiJ9.EObyXkHQOG-8ta-zLC13hw&limit=1';

    request({url: url_City, json: true}, (error, response) => {
        if (address.length === 0){
            callback('City field is Empty. Enter something first!', undefined);
        } else if(error){
            callback('We believe that you do not have internet connection. Please check it out and try again...', undefined);
        } else if(response.body.error){
            callback('Something went wrong. Please try again', undefined);
        } else if(response.body.features.length === 0){
            callback('No result found. Please enter another city', undefined);
        } else{
            const resBody = response.body;
            const point = resBody.features[0];
            const placeName = point.context[0].text;
            const latitude = point.geometry.coordinates[1];
            const longitude = point.geometry.coordinates[0];
            callback(undefined, {placeName, latitude, longitude});
        }
    });
}

module.exports = coordinateFinder;