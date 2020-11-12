window.addEventListener('DOMContentLoaded',initializeApp);

const baseUrlEndpoint = `https://corona.lmao.ninja/v2/countries`

let coronoDetailsContainer;
let countrySelectDropdown;
let coronaWorldDetailsContainer;

const coronaData ={
    latest:{},
    locations:[]
}

const countriesWithCountryCodes = {
    "TH": "Thailand",
    "JP": "Japan",
    "SG": "Singapore",
    "NP": "Nepal",
    "MY": "Malaysia",
    "CA": "Canada",
    "AU": "Australia",
    "KH": "Cambodia",
    "LK": "Sri Lanka",
    "DE": "Germany",
    "FI": "Finland",
    "AE": "United Arab Emirates",
    "PH": "Philippines",
    "IN": "India",
    "IT": "Italy",
    "SE": "Sweden",
    "ES": "Spain",
    "BE": "Belgium",
    "EG": "Egypt",
    "LB": "Lebanon",
    "IQ": "Iraq",
    "OM": "Oman",
    "AF": "Afghanistan",
    "BH": "Bahrain",
    "KW": "Kuwait",
    "DZ": "Algeria",
    "HR": "Croatia",
    "CH": "Switzerland",
    "AT": "Austria",
    "IL": "Israel",
    "PK": "Pakistan",
    "BR": "Brazil",
    "GE": "Georgia",
    "GR": "Greece",
    "MK": "North Macedonia",
    "NO": "Norway",
    "RO": "Romania",
    "EE": "Estonia",
    "SM": "San Marino",
    "BY": "Belarus",
    "IS": "Iceland",
    "LT": "Lithuania",
    "MX": "Mexico",
    "NZ": "New Zealand",
    "NG": "Nigeria",
    "IE": "Ireland",
    "LU": "Luxembourg",
    "MC": "Monaco",
    "QA": "Qatar",
    "EC": "Ecuador",
    "AZ": "Azerbaijan",
    "AM": "Armenia",
    "DO": "Dominican Republic",
    "ID": "Indonesia",
    "PT": "Portugal",
    "AD": "Andorra",
    "LV": "Latvia",
    "MA": "Morocco",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "AR": "Argentina",
    "CL": "Chile",
    "JO": "Jordan",
    "UA": "Ukraine",
    "HU": "Hungary",
    "LI": "Liechtenstein",
    "PL": "Poland",
    "TN": "Tunisia",
    "BA": "Bosnia and Herzegovina",
    "SI": "Slovenia",
    "ZA": "South Africa",
    "BT": "Bhutan",
    "CM": "Cameroon",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "PE": "Peru",
    "RS": "Serbia",
    "SK": "Slovakia",
    "TG": "Togo",
    "MT": "Malta",
    "MQ": "Martinique",
    "BG": "Bulgaria",
    "MV": "Maldives",
    "BD": "Bangladesh",
    "PY": "Paraguay",
    "AL": "Albania",
    "CY": "Cyprus",
    "BN": "Brunei",
    "US": "US",
    "BF": "Burkina Faso",
    "VA": "Holy See",
    "MN": "Mongolia",
    "PA": "Panama",
    "CN": "China",
    "IR": "Iran",
    "KR": "Korea, South",
    "FR": "France",
    "XX": "Cruise Ship",
    "DK": "Denmark",
    "CZ": "Czechia",
    "TW": "Taiwan*",
    "VN": "Vietnam",
    "RU": "Russia",
    "MD": "Moldova",
    "BO": "Bolivia",
    "HN": "Honduras",
    "GB": "United Kingdom",
    "CD": "Congo (Kinshasa)",
    "CI": "Cote d'Ivoire",
    "JM": "Jamaica",
    "TR": "Turkey",
    "CU": "Cuba",
    "GY": "Guyana",
    "KZ": "Kazakhstan",
    "ET": "Ethiopia",
    "SD": "Sudan",
    "GN": "Guinea",
    "KE": "Kenya",
    "AG": "Antigua and Barbuda",
    "UY": "Uruguay",
    "GH": "Ghana",
    "NA": "Namibia",
    "SC": "Seychelles",
    "TT": "Trinidad and Tobago",
    "VE": "Venezuela",
    "SZ": "Eswatini",
    "GA": "Gabon",
    "GT": "Guatemala",
    "MR": "Mauritania",
    "RW": "Rwanda",
    "LC": "Saint Lucia",
    "VC": "Saint Vincent and the Grenadines",
    "SR": "Suriname",
    "XK": "Kosovo",
    "CF": "Central African Republic",
    "CG": "Congo (Brazzaville)",
    "GQ": "Equatorial Guinea",
    "UZ": "Uzbekistan",
    "NL": "Netherlands",
    "BJ": "Benin",
    "LR": "Liberia",
    "SO": "Somalia",
    "TZ": "Tanzania",
    "BB": "Barbados",
    "ME": "Montenegro",
    "KG": "Kyrgyzstan",
    "MU": "Mauritius",
    "ZM": "Zambia",
    "DJ": "Djibouti",
    "GM": "Gambia, The",
    "BS": "Bahamas, The",
    "TD": "Chad",
    "SV": "El Salvador",
    "FJ": "Fiji",
    "NI": "Nicaragua",
    "MG": "Madagascar",
    "HT": "Haiti",
    "AO": "Angola",
    "CV": "Cape Verde",
    "NE": "Niger",
    "PG": "Papua New Guinea",
    "ZW": "Zimbabwe",
    "TL": "Timor-Leste",
    "ER": "Eritrea",
    "UG": "Uganda",
    "DM": "Dominica",
    "GD": "Grenada",
    "MZ": "Mozambique",
    "SY": "Syria"
  }

async function initializeApp(){
    console.log('initialize the app')
    setReferences();
    doEventBindings();
    NProgress.start();
    populateLocations();
    await performAsyncCall();
    renderUI(coronaData.latest,world=true)
    // console.log(`Corona prone loacations ${coronaData.locations}`)
    renderMap();
    NProgress.done();

}
function populateLocation(country,country_code){
    const countryOption = document.createElement('option')
    countryOption.value = country;
    countryOption.textContent = `${country_code}-${country}`
    // console.log(countryOption)
    countrySelectDropdown.appendChild(countryOption)
}
mapboxgl.accessToken='pk.eyJ1Ijoic2hyZXlhZ2FsYW5pIiwiYSI6ImNraGFnNnlhOTFmNzEyeG56ajN6Nmw0MGUifQ.aZWwc9_cZ4NsvoCC9gylSA'


let geocoder;
async function geocodeReverseFromLatLngToPlace(lat,lng){
    return new Promise((resolve,reject)=>{
        geocoder.mapboxClient.geocodeReverse({
            latitude:parseFloat(lat),
            longitude:parseFloat(lng)

        },
        function(error,response){
            if(error){
                reject(error)
            }
            resolve(response.features[0] && response.features[0].place_name)
        }
        )
    })
}



function renderMap(){
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-103.59179687498357, 40.66995747013945],
        zoom: 3
        });
        geocoder = new MapboxGeocoder({
            accessToken:mapboxgl.accessToken
        });
        map.addControl(geocoder);
        map.addControl(new mapboxgl.NavigationControl());
         
        map.on('load', async function () {
        // Add a new source from our GeoJSON data and
        // set the 'cluster' option to true. GL-JS will
        // add the point_count property to your source data.
        map.addSource('places', {
        type: 'geojson',
        data:{
            type:"FeatureCollection",
            crs:{ "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            features: await Promise.all(coronaData.locations.map( async (location)=>{
                const placeName = await geocodeReverseFromLatLngToPlace(
                    location.countryInfo.lat,
                    location.countryInfo.long
                )
                return {
                    type:'Feature',
                    properties:{
                        description:`
                        <table>
                        <thead>
                            <tr>${placeName}</tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>Confirmed Cases: </td>
                            <td>${location.cases}</td>
                            </tr>
                            <tr>
                            <td>Deaths: </td>
                            <td>${location.deaths}</td>
                            </tr>
                            <tr>
                            <td>Latitude: </td>
                            <td>${location.countryInfo.lat}</td>
                            </tr>
                            <tr>
                            <td>Longitude: </td>
                            <td>${location.countryInfo.long}</td>
                            </tr>
                        </tbody>
                        </table>
                        `,
                        icon:'rocket'
                    },
                    geometry:{
                        type:"Point",
                        coordinates:[
                            `${location.countryInfo.long}`,
                            `${location.countryInfo.lat}`
                        ]
                    }
                }
            }))
        },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });
         
        map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'places',
        filter: ['has', 'point_count'],
        paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
        ],
        'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
        ]
        }
        });
         
        map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'places',
        filter: ['has', 'point_count'],
        layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
        }
        });
         
        map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'places',
        filter: ['!', ['has', 'point_count']],
        paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
        }
        });
         
        // inspect a cluster on click
        map.on('click', 'clusters', function (event) {
        const features = map.queryRenderedFeatures(event.point, {
        layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('places').getClusterExpansionZoom(
        clusterId,
        function (error, zoom) {
        if (error) return;
         
        map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
        });
        }
        );
        });
         
        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', function (event) {
        const coordinates = event.features[0].geometry.coordinates.slice();
        const {description} = event.features[0].properties;
        
        
         
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
        });
         
        map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
        });
        });
}

function populateLocations(){
    Object.entries(countriesWithCountryCodes).forEach(([country_code,country])=>populateLocation(country,country_code))
}
async function performAsyncCall(){
    const response = await fetch(`${baseUrlEndpoint}`)
    const data = await response.json();
    const latest = data.reduce((accumlator,currentLocation)=>{
        accumlator['confirmed']+=currentLocation.cases;
        accumlator['deaths']+=currentLocation.deaths;
        return accumlator
    },{
        confirmed:0,
        deaths:0
    })
    coronaData.latest=latest
    coronaData.locations.push(...data)
}

function renderUI(details, world = false){
    let html ='';
    html=`
    <table class="table">
    <thead>
   ${world ? '<h1>World Details</h1>' : `<tr>${details.country} ${details.country_code}</tr>`}
    <thead>
    <tbody>
        <tr>
            <td class="cases">Reported Cases:</td>
            <td>${world ? details.confirmed : details.latest.confirmed}</td>
        </tr>
        <tr>
        <td class="deaths">Deaths: </td>
        <td>${world ? details.deaths : details.latest.deaths}</td>
        </tr>
    </tbody>
    </table>
    `;
    if(world){
        coronaWorldDetailsContainer.innerHTML = html;

    }else{
        coronoDetailsContainer.innerHTML=html;
    }
}
function renderDetailsForSelectedLocation(event){
    const countrySelected = event.target.value;
    const country = coronaData.locations.find((currentLocation)=>currentLocation.country.toLowerCase()===countrySelected.toLowerCase());
    const locationCoronaDetails = {
        country:country.country,
        country_code:country.countryInfo.iso2,
        latest:{
            confirmed:country.cases,
            deaths:country.deaths
        }

    }
    renderUI(locationCoronaDetails);
}
function setReferences(){
    coronoDetailsContainer = document.querySelector('#corona-details');
    countrySelectDropdown = document.querySelector('[name="select-country"]')
    coronaWorldDetailsContainer = document.querySelector('#corona-world-details')

}
function doEventBindings(){
    countrySelectDropdown.addEventListener('change', renderDetailsForSelectedLocation);
}