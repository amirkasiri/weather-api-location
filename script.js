const form = document.getElementById('form')
const search = document.getElementById('search')
const container = document.querySelector('#container')

const apiKey = "94af51e2fcd0f6e8ee5a865ad9ad911e"
function getWeatherByLocation(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
        .then(res => res.json())
        .then(result => {
            addWeatherInfoToPage(result)

        })
}


function addWeatherInfoToPage(data) {
    console.log(data);
    const temperature = KtoC(data.main.temp)
    const feelslike = KtoC(data.main.feels_like)
    const maxTemp = KtoC(data.main.temp_max)
    const minTemp = KtoC(data.main.temp_min)
    const weather = document.createElement('div');
    weather.classList.add('weather')
    weather.innerHTML = `
    <div class= "temp">
    <p>دما:${temperature}C°</p>
    <p>دما:${feelslike}C°</p>
    <p>حداکثر دما:${maxTemp}</p>
    <p>حداقل دما:${minTemp}</p>
    <p>سرعت باد:${data.wind.speed}متر/ ثانیه</p>
    <p>رطوبت:${data.main.humidity}%</p>
    </div>
    `

    container.innerHTML = ''
    container.appendChild(weather)





    mapboxgl.accessToken = 'pk.eyJ1IjoibWFoZGloYXNhbnphZGVoOCIsImEiOiJja21idms4cTMxdG01MnBtejgzaTE4bW82In0.RpjSN_MZtRzqtFFtVgvFeA';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [data.coord.lon, data.coord.lat],
        zoom: 5,
        maxZoom: 6
    });

    map.on('load', () => {
      
        map.loadImage(
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            (error, image) => {
                if (error) throw error;

               
                map.addImage('cat', image);

                map.addSource('point', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [data.coord.lon, data.coord.lat]
                                }
                            }
                        ]
                    }
                });

                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'point', 
                    'layout': {
                        'icon-image': 'cat',
                        'icon-size': 0.8
                    }
                });
            }
        );
    });

}


function KtoC(temp) {
    return parseInt(temp - 273.15)
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = search.value;
    if (location) {
        getWeatherByLocation(location)
    }
})

