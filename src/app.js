const express = require('express');
const path = require('path');
const hbs = require('hbs');
const chalk = require('chalk');
const coordinateFinder = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;
const path_publicDirectory = path.join(__dirname, '../public');
const path_publicDirectoryStyles = path.join(__dirname, '../public/css');
const path_helpPage = path.join(path_publicDirectory, '/help.html');
const path_aboutPage = path.join(path_publicDirectory, '/about.html');
const path_hbsTemplates = path.join(path_publicDirectory, '../templates/views');
const path_hbsPartials = path.join(path_hbsTemplates, '../partials');

//for static assets
app.use(express.static(path_publicDirectoryStyles));
//for dynamic assets 
app.set('view engine', 'hbs')
app.set('views', path_hbsTemplates);
hbs.registerPartials(path_hbsPartials);

app.get('', (req, res) => {
    res.render('index',{
        'description': 'Weather forecast application',
        'version': '1.0.0'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        'description': 'Just enter your city name and we find the weather forecast of your city for you...',
        'version': '1.0.0'
    })
});

app.get('/about', (req, res) => {
    res.render('about', {
        'description': 'Weather app is a training project which is free to use for everybody in the world',
        'version': '1.0.0'
    })
})

app.get('/products', (req, res) =>{
    console.log(req.query);
    res.send({
        product: []
    });
});

app.get('/weather', (req, res) =>{
    if(!req.query.location){
        return res.send({
            error: 'Location is required. It\'s still empty...'
        });
    }

    coordinateFinder(req.query.location, (err, coordinateResponse = ' ') => {
        const {latitude, longitude} = coordinateResponse;
        if(latitude.length == 0 | longitude.length == 0){
            res.send('No city coordinate recieved as response. Entered city name may not be valid...');
        } else if(err){
            res.send('Something went wrong. We think your internet connection may have problem...');
        }else if(coordinateResponse.err){
            res.send('Something went wrong. check parameters...');
        } else{
            forecast(latitude, longitude, (err, placeForecast) =>{
                if(err){
                    res.send('Something went wrong. check parameters...');
                } else if(placeForecast.err){
                    res.send('Something went wrong. check parameters...');
                } else{
                    
                    res.send(placeForecast);
                    
                }
            });
        }

    });

});

app.get('*', (req, res) => {
    res.render('notFound', {
        'description': '404 Error. Requested page not found...',
        'version': '1.0.0'
    });
});

// app.use('/help', express.static(path_helpPage));
// app.use('/about', express.static(path_aboutPage));




app.listen(prot, () => {
    console.log('Your app is listening on port ' + port);
});