
(function () {

    'use strict';

    ////////////////////////////////////////
    ////////// INDEX ///////////////////////
    ////////////////////////////////////////

    ////////// COLOR MODIFICATIONS
    // Ctrl + f >> "@COLOR"

    ////////////////////////////////////////
    ////////// INITIALIZATION //////////////
    ////////////////////////////////////////

    // get page elements
    const modal = document.querySelector("#modal");
    const button = document.querySelector("#modal-button");
    const title = document.querySelector("#title");
    const modalFooter = document.getElementById("modal-footer");
      // create a function with a short name to select elements
  const $ = function (x) {
    return document.querySelector(x);
  };

    // Update date
    setDate();

    function setDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' });
        modalFooter.textContent = ` Phillip Ashford | ${month}, ${year}`;
    }

    // display modal when button is clicked
    button.addEventListener("click", function () {
        modal.style.display = "block";
    });

    // close modal when user clicks anywhere on the page
    modal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Set button UI
    buttonUI();

    function buttonUI() {
        button.style.top = title.offsetHeight + 20 + "px";
    }

    // Add event listener for window resize
    // When page rotates or is resized, reset page UI
    window.addEventListener("resize", buttonUI);

    // Create data object for states' gun data
    const stateGunData = [];
    // Create array to store all HFR values
    const hfrBreaksRange = [];
    // Define variables to draw the initial map
    var currentYear = 2020;

    var currentLayer = 'Gun Ownership';

    var toggleAllShootings = true;

    var scaleColors = ['#bbb', '#555']; // min to max >>>

    var noDataColor = "#222";

    var defaultStateLineColor = "white";

    ////////////////////////////////////////
    ////////// MAP INSTANTIATION ///////////
    ////////////////////////////////////////

    // map options
    const options = {
        center: [52, -122],
        zoom: 3.75,
        scrollWheelZoom: true,
        zoomSnap: 0.1,
        dragging: true,
        zoomControl: false
    };

    // create the Leaflet map
    const map = L.map("map", options);

    // Add a new zoom control to the bottom right
    L.control.zoom({
        position: 'bottomright',
    }).addTo(map);

    // Create a pane for the GeoJSON layer
    map.createPane('geojsonPane');
    map.getPane('geojsonPane').style.zIndex = 300;

    // Create a pane for the labels layer
    map.createPane('labelsPane');
    map.getPane('labelsPane').style.zIndex = 400;

    // Create a pane for the circle markers layer
    map.createPane('circlesPane');
    map.getPane('circlesPane').style.zIndex = 500;

    var CartoDB_DarkMatterNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        pane: 'geojsonPane'
    });

    var CartoDB_DarkMatterOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        pane: 'labelsPane'
    });

    CartoDB_DarkMatterNoLabels.addTo(map);
    CartoDB_DarkMatterOnlyLabels.addTo(map);


    ////////////////////////////////////////
    ////////// FETCH AND PARSE DATA ////////
    ////////////////////////////////////////

    Promise.all([
        fetch('data/gun-laws-and-ownership.csv').then((response) => response.text()),
        fetch('data/us-states.geojson').then((response) => response.json())
    ])
        .then(function (responses) {
            const [gunCSVData, states] = responses;

            const parsedGunData = Papa.parse(gunCSVData, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
            });

            console.log("The gun data CSV parsed: ", parsedGunData,
                "\nThe geojson data: ", states);

            processData(parsedGunData.data, states);
        })
        .catch(function (error) {
            console.log(`Ruh roh! An error has occurred`, error);
        });

    ////////////////////////////////////////
    ////////// DATA PROCESSING /////////////
    ////////////////////////////////////////

    function processData(gunData, states) {

        //////////////////// GUN DATA LOGIC ////////////////////

        // Iterates over and sorts the parsed gun data array and stores the sorted data in the empty array defined as the constant "stateGunData" in the initialization section.

        // Iterate over all objects in the gunData array
        for (let i = 0; i < gunData.length; i++) {

            // Push HFR data to array
            hfrBreaksRange.push(gunData[i].HFR);

            const state = gunData[i].STATE;

            // check if state object is present in stateGunData object (defined above)
            if (!stateGunData[state]) {

                // if not, add the state object
                stateGunData[state] = {};

            } else { }; // Otherwise do nothing

            // check if year object exists...
            if (!stateGunData[state][gunData[i].YEAR]) {

                //if not, create year object and assign key value pairs
                stateGunData[state][gunData[i].YEAR] = {

                    // HFR is an ESTIMATE of the proportion of adult, noninstitutionalized residents who live in a household with a firearm ("Factor score for household firearm ownership latent factor")
                    HFR: gunData[i].HFR,

                    // State has permit-to-purchase law (boolean)
                    PERMIT: gunData[i].PERMIT,

                    // State has universal background checks law (boolean)
                    UNIVERSAL: gunData[i].UNIVERSAL

                };
            } else { }; // if year object exists, do nothing

        }

        console.log(`stateGunData - Derived from the gunData array, this array contains gunData's gun ownership and gun law data sorted into corresponding state and nested year objects necessary for joining it to the geojson layer and styling said layer by stateGunData's key values: 
                \n \u2193 stateGunData's State objects' Year objects' Keys \u2193
                \n HFR: HFR is an ESTIMATE of the proportion of adult, noninstitutionalized residents who live in a household with a firearm ("Factor score for household firearm ownership latent factor")
                \n PERMIT: State has permit-to-purchase law (boolean)
                \n UNIVERSAL: State has universal background checks law (boolean)`, stateGunData);

        //////////////////// DATA BREAKS LOGIC ////////////////////

        // Create data breaks
        var breaks = [0.034, 0.4, 0.5, 0.6, 0.7, 0.8];

        // Find the min and max of the solarRange array
        const hfrRangeMax = Math.max.apply(null, hfrBreaksRange);
        const hfrRangeMin = Math.min.apply(null, hfrBreaksRange);

        // FOR INSPECTION
        // console.log(hfrBreaksRange);
        // console.log(hfrRangeMax);
        // console.log(hfrRangeMin);

        // Create color generator function @COLOR
        var colorize = chroma.scale(scaleColors).domain([hfrRangeMin, hfrRangeMax])
            .classes(breaks)
            .mode('lab');

        //////////////////// FUNCTION CALLS ////////////////////    

        // Send processed data along with the geojson to the renderGeojson function where it will be added to the map and styled
        renderGeojson(stateGunData, states, colorize, breaks);

    } // End processData()

    ////////////////////////////////////////
    ////// DRAWING THE MAP ////////
    ////////////////////////////////////////

    function renderGeojson(stateGunData, states, colorize, breaks) {

        //////////////////// ADD GEOJSON LAYER ////////////////////

        const leafletGeojsonObject = L.geoJson(states, {
            style: function (feature) {
                return {
                    color: defaultStateLineColor, //@COLOR
                    weight: 0.25,
                    fillOpacity: 0.75,
                };
            },
            //////////////////// GEOJSON EVENT LISTENERS ////////////////////

            // add hover/touch functionality to each feature layer
            onEachFeature: function (feature, layer) {

                // when mousing over a layer
                layer.on("mouseover", function () {
                    // change the style
                    layer
                        .setStyle({
                            weight: 0.5,
                            fillOpacity: 0.9
                        })
                    // .bringToFront();
                });

                // on mousing off layer
                layer.on("mouseout", function () {
                    // reset the layer style
                    layer.setStyle({
                        weight: 0.25,
                        fillOpacity: 0.75
                    });
                });
            }
        }).addTo(map);

        drawLayers(stateGunData, leafletGeojsonObject, colorize);
        createSliderUI(stateGunData, leafletGeojsonObject, breaks, colorize);
        drawCircleMarkers(stateGunData);
        drawLegend(breaks, colorize, leafletGeojsonObject, stateGunData);

    } // End renderGeojson()

    function calcRadius(val) {
        const radius = Math.sqrt(val / Math.PI);
        return (val > 900) ? radius * 2: radius * 3; // adjust .25 as a scale factor
    }

    function drawCircleMarkers(stateGunData) {
           // remove all circle markers from the map
           map.eachLayer(function (layer) {
            if (layer instanceof L.CircleMarker) {
                map.removeLayer(layer);
            }
        });
        
        shootings.forEach(shooting => {
            const date = new Date(shooting['date']).getFullYear();
            const recency = (new Date().getFullYear() - date);
            var circleMarker;
            var options = {
                radius: calcRadius(shooting['total_victims']),
                color: "#840000",
                fillColor: "#9c3131",
                fillOpacity: 0.5,
                weight: 1,
                pane: 'circlesPane' 
        }

            // I'm going to use the logic immediately below to add a small animation to shooting markers that have a summary attached to them. Initially I was going to change its color, but I don't think that would offer enough of an affordance and I think the user might confuse it with a data measurement.

            // if (shooting['summary']) {
            //     var circleColor = "#840000"; // @COLOR
            // } else {
            //     var circleColor = "#9c3131"; // @COLOR
            // }


            // if the user has requested shootings from all years...
            if (toggleAllShootings == true) {

                // Create a circle marker and add it to the map
                circleMarker = L.circleMarker([shooting['coordinates'][0], shooting['coordinates'][1]], options).addTo(map);
            } else { // Otherwise add only the shootings whose dates match the currentYear value
                if (date == currentYear) {
                    // Create a circle marker and add it to the map
                    circleMarker = L.circleMarker([shooting['coordinates'][0], shooting['coordinates'][1]], options).addTo(map);
                } else {

                }
            }

            //////////////////// CIRCLE MARKERS EVENT LISTENERS ////////////////////

            if (circleMarker) {
                            // when mousing over a layer
            circleMarker.on("mouseover", function () {
                // change the style
                circleMarker
                    .setStyle({
                        fillOpacity: 0.75

                    })
                // .bringToFront();
            });

            // on mousing off layer
            circleMarker.on("mouseout", function () {
                // reset the layer style
                circleMarker.setStyle({
                    // weight: recency < 30 ? 1 : 0.5
                    fillOpacity: 0.5
                });
            });

            // Add a popup to the marker with additional information
            var popup =
                `<h3>${shooting['location']}</h3>
                <p>${shooting['dateString']}</p><hr>`;

            if (shooting['summary'] != "") {
                popup += `<p>${shooting['summary']}</p>`;
            } else {
                popup +=
                    `<p>${shooting['fatalities']} deaths</p>
                 <p>${shooting['injured']} injuries</p>`;
            }

            circleMarker.bindPopup(popup);
            }

        });

        toggleAllShootings = false;

        // EXPERIMENTAL ICON CODE - not working right but still going to play with it
        //     (async () => {
        //         shootings.forEach(async (shooting) => {
        //           const date = new Date(shooting["date"]).getFullYear();
        //           const recency = new Date().getFullYear() - date;
        //           const radius = calcRadius(shooting['total_victims']);

        //           // If the shooting instance has a summary x else y
        //           const circleColor = shooting["summary"] ? "#840000" : "#9c3131"; // @COLOR

        //           const defaultIconUrl = await loadAndStyleSVG("img/crosshairs.svg", circleColor, 0.5); // Set opacity to 1, change if needed

        //           const crosshairDefaultIcon = L.icon({
        //             iconUrl: defaultIconUrl,
        //             iconSize: [radius, radius],
        //             iconAnchor: [radius/2, radius/2],
        //           });

        //           const hoverIconUrl = await loadAndStyleSVG("img/crosshairs.svg", circleColor, 0.75); // Set opacity to 1, change if needed

        //           const crosshairHoverIcon = L.icon({
        //             iconUrl: hoverIconUrl,
        //             iconSize: [radius, radius],
        //             iconAnchor: [radius/2, radius/2],
        //           });

        //           const crosshairMarker = L.marker([shooting["coordinates"][0], shooting["coordinates"][1]], {
        //             icon: crosshairDefaultIcon,
        //             pane: "markersPane",
        //           }).addTo(map);

        //         //////////////////// CROSSHAIR MARKERS EVENT LISTENERS ////////////////////

        //         // when mousing over a marker
        //         crosshairMarker.on('mouseover', () => {
        //             // change the icon
        //             marker.setIcon(hoverIcon);
        //           });

        //         // on mousing off a marker
        //         crosshairMarker.on('mouseout', () => {
        //             // reset to default icon
        //             marker.setIcon(defaultIcon);
        //           });

        //         // Add a popup to the marker with additional information
        //         var popup =
        //             `<h3>${shooting['location']}</h3>
        //         <p>${shooting['dateString']}</p><hr>`;

        //         if (shooting['summary'] != "") {
        //             popup += `<p>${shooting['summary']}</p>`;
        //         } else {
        //             popup +=
        //                 `<p>${shooting['fatalities']} deaths</p>
        //          <p>${shooting['injured']} injuries</p>`;
        //         }

        //         crosshairMarker.bindPopup(popup);
        //     }); // End of forEach
        // })(); // End of anon async func

        ////// WORKING WITH THE SVG ICON ///////

        // Full disclosure - After explaining the logic and feeding it the svg, this entire function was written by the Github Copilot AI. I wasn't sure how to approach this problem. Now that I've been 'shown' by Copilot, I understand how to approach it in the future. Regex's are not yet my forte.

        // async function loadAndStyleSVG(svgPath, color, opacity) {
        //     const response = await fetch(svgPath);
        //     const svgText = await response.text();

        //     // Replace or add the fill, stroke, fill-opacity, and stroke-opacity attributes with !important
        //     const styledSVG = svgText
        //     //   .replace(/<path([^>]*)>/, `<path$1 fill="${color} !important" stroke="${color} !important" fill-opacity="${opacity} !important" stroke-opacity="${opacity} !important">`)
        //       .replace(/fill="[^"]*"/g, `fill="${color} !important"`)
        //       .replace(/stroke="[^"]*"/g, `stroke="${color} !important"`)
        //       .replace(/fill-opacity="[^"]*"/g, `fill-opacity="${opacity} !important"`)
        //       .replace(/stroke-opacity="[^"]*"/g, `stroke-opacity="${opacity} !important"`);

        //     // Convert the styled SVG string to a data URL
        //     const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(styledSVG);

        //     return dataUrl;
        //   }
        // END EXPERIMENTAL ICON CODE

    }

    function drawLayers(stateGunData, leafletGeojsonObject, colorize) {

        //////////////////// JOIN GEOJSON FEATURES TO GUN DATA & STYLE ACCORDINGLY ////////////////////

        leafletGeojsonObject.eachLayer(function (layer) {
            // var feature = layer.feature;
            var fillColor = noDataColor;
            var stateLineColor = defaultStateLineColor;
            var props = layer.feature.properties;
            var popup = `<h1>${props.NAME}'s ${currentLayer}</h1>
        <h2>${currentYear} | `;

            // if the currentLayer is 'Gun Ownership'
            if (currentLayer == 'Gun Ownership') {
                // and if there is gun law data for the geojson feature during the selected year
                if (stateGunData[props.NAME] && stateGunData[props.NAME][currentYear]) {
                    // and if there is HFR data for the geojson feature 
                    if (stateGunData[props.NAME][currentYear].HFR) {
                        // then style as...
                        fillColor = colorize(Number(stateGunData[props.NAME][currentYear].HFR)) // @COLOR
                        // and configure popup
                        popup +=
                            `${((stateGunData[props.NAME][currentYear].HFR) * 100).toFixed()}%  *</h2>
                    <h5>* Estimate of the proportion of adult, non-institutionalized residents who live in a household with a firearm. <a href="">Learn more</a></h5>`;

                    } else { // if no HFR data
                        popup += `No data`;
                    }
                } else { // if no gun law data (DC, Puerto Rico, etc)
                    popup += `No data`;
                }

            } else { // if the currentLayer is not 'Gun Ownership' it must be 'Permit-to-Purchase Law'

                // and if there is gun law data for the geojson feature during the selected year
                if (stateGunData[props.NAME] && stateGunData[props.NAME][currentYear]) {
                    // and if the state has a 'permit-to-purchase' law... 
                    if (stateGunData[props.NAME][currentYear].PERMIT != undefined) {
                        // stateLineColor = 'black';
                        if (stateGunData[props.NAME][currentYear].PERMIT == true) {
                            // then style as...
                            fillColor = scaleColors[0]; //@COLOR

                        } else {
                            // else PERMIT must be false -> style as...
                            fillColor = scaleColors[1]; // @COLOR
                        }
                        // and configure popup
                        popup +=
                            `<p>Permit-to-Purchase law: ${stateGunData[props.NAME][currentYear].PERMIT}</p>`;
                    } else { // if no permit law data
                        popup += `No data`;
                    }
                } else { // if no gun law data (DC, Puerto Rico, etc)
                    popup += `No data`;
                }
            }

            layer.setStyle({
                weight: .25,
                opacity: 1,
                fillColor: fillColor,
                stateLineColor: stateLineColor

            });

            // Add a popup to the layer with additional information
            layer.bindPopup(popup);
        });

    } // end updateMap()

    ////////////////////////////////////////
    ////////// LEAFLET CONTROLS //////////
    ////////////////////////////////////////

    function drawLegend(breaks, colorize, leafletGeojsonObject) {
    
        // create a Leaflet control for the legend
        const legendControl = L.control({
            position: "topright",
        });

        // when the control is added to the map
        legendControl.onAdd = function (map) {
            // create a new division element with class of 'legend' and return
            const legend = L.DomUtil.create("div", "legend");
            return legend;
        };

        // add the legend control to the map
        legendControl.addTo(map);

if (currentLayer == "Gun Ownership") {
            // select div and create legend title
            const legend = document.querySelector(".legend");
            legend.innerHTML = `<div class="button-container"><button id="ownership">Gun Ownership</button><button id="permit">Permit Laws</button></div><h3><span>1989</span>Residents living in a<br> household with a firearm</h3>`;
    
            // I changed the structure here because the browser was closing the ul tag early for some reason (before the loop ran) and it was offsetting the spans in the legend.
            let listItems = `<li><span style="background:${noDataColor}"></span> No Data </li>`;
    
            // loop through the break values and concatenate listItems string
            for (let i = 0; i < breaks.length - 1; i++) {
    
                const color = colorize(breaks[i], breaks);
    
                // create legend item
                const classRange = `<li><span style="background:${color}"></span>
            ${(breaks[i] * 100).toFixed()}% &mdash;
            ${(breaks[i + 1] * 100).toFixed()}%</li>`;
    
                // append to legend unordered list item
                listItems += classRange;
            }
    
            // creates the unordered list and adds the list items to i
            const unorderedList = `<ul>${listItems}</ul>`;
    
            // adds the unordered list to the legend
            legend.innerHTML += unorderedList;

            $("#ownership").style.background = scaleColors[0];

} else {
            // select div and create legend title
            const legend = document.querySelector(".legend");
            legend.innerHTML = `<div class="button-container"><button id="ownership">Gun Ownership</button><button id="permit">Permit Laws</button></div><h3><span>1989</span>States with a<br> Permit-to-Purchase Law</h3>`;
    
            // I changed the structure here because the browser was closing the ul tag early for some reason (before the loop ran) and it was offsetting the spans in the legend.
            let unorderedList = `<ul><li><span style="background:${noDataColor}"></span> No Data </li>
            <li><span style="background:${scaleColors[0]}"></span>Has P-to-P Law</li>
            <li><span style="background:${scaleColors[1]}"></span>No P-to-P Law</li>`;
    
            // adds the unordered list to the legend
            legend.innerHTML += unorderedList;

            $("#permit").style.background = scaleColors[0];

}

        // References and stores gun ownership button
        var gunOwnershipButton = document.querySelector("#ownership");

        // References and stores permit laws button
        var permitButton = document.querySelector("#permit");

        // Toggles all shooting circle markers on after slider changes
        gunOwnershipButton.addEventListener("click", function() {
            currentLayer = "Gun Ownership";
            drawLayers(stateGunData, leafletGeojsonObject, colorize, currentYear);
                    // Removes pre-existing legends
        map.removeControl(legendControl);
            drawLegend(breaks, colorize, leafletGeojsonObject);
            $("#ownership").style.background = scaleColors[0];
        });

        permitButton.addEventListener("click", function() {
            currentLayer = "Permit Laws";
            drawLayers(stateGunData, leafletGeojsonObject, colorize, currentYear);
                    // Removes pre-existing legends
        map.removeControl(legendControl);
            drawLegend(breaks, colorize, leafletGeojsonObject);
            $("#permit").style.background = scaleColors[0];
        });

    } // end drawLegend()

    function createSliderUI(stateGunData, leafletGeojsonObject, breaks, colorize) {

        // create Leaflet control for the slider
        const sliderControl = L.control({ position: "bottomleft" });

        // update the year
        const year = document.querySelector("#current-year");

        // when added to the map
        sliderControl.onAdd = function (map) {
            // select an existing DOM element with an id of "ui-controls"
            const slider = L.DomUtil.get("ui-controls");

            // disable scrolling of map while using controls
            L.DomEvent.disableScrollPropagation(slider);

            // disable click events while using controls
            L.DomEvent.disableClickPropagation(slider);

            // return the slider from the onAdd method
            return slider;
        };

        // add the control to the map
        sliderControl.addTo(map);
        // select the form element
        const slider = document.querySelector(".year-slider");

    // var victimCountArray = [];
    // for (var i = 0; i < shootings.length; i++) {
    //     victimCountArray.push(shootings[i]['total_victims'])
    // }
 
    // var maxVictims = Math.max.apply(null, victimCountArray);
    //     // calc the diameters
    // const largeDiameter = calcRadius(maxVictims) * 2;
    // const smallDiameter = Number((largeDiameter / 2).toFixed(0));

//   // select our circles container and set the height
//   $(".slider-circles").style.height = `${largeDiameter.toFixed()}px`;

//   // set width and height for large circle
//   $(".slider-large").style.width = `${largeDiameter.toFixed()}px`;
//   $(".slider-large").style.height = `${largeDiameter.toFixed()}px`;

//   // set width and height for small circle and position
//   $(".slider-small").style.width = `${smallDiameter.toFixed()}px`;
//   $(".slider-small").style.height = `${smallDiameter.toFixed()}px`;
//   $(".slider-small").style.top = `${largeDiameter - smallDiameter - 2}px`;
//   $(".slider-small").style.left = `${smallDiameter / 2}px`;

// $("#ui-controls").style.width = $(".slider-large").offsetWidth + $("hr.large").offsetWidth + $(".slider-large-label").offsetWidth + 10 +'px';

// $("#ui-controls").style.minWidth = $("#all-shootings-toggle").offsetWidth + 100 +'px';

//   // label the max and half values
//   $(".slider-large-label").innerHTML = `${maxVictims.toLocaleString()}`;
//   $(".slider-small-label").innerHTML = (maxVictims / 2).toLocaleString();

//   // adjust the position of the label based on size of circle
//   $(".slider-large-label").style.top = `${-11}px`;
//   $(".slider-large-label").style.left = `${largeDiameter + 30}px`;

//   // adjust the position of the label based on size of circle
//   $(".slider-small-label").style.top = `${smallDiameter - 13}px`;
//   $(".slider-small-label").style.left = `${largeDiameter + 30}px`;

//   // insert a couple hr elements and use to connect value label to top of each circle
//   $("hr.small").style.top = `${largeDiameter - smallDiameter - 10}px`;


        // listen for changes on input element
        slider.addEventListener("input", function (e) {
            // get the value of the selected option
            currentYear = e.target.value;
            // update the layers with current timestamp
            drawLayers(stateGunData, leafletGeojsonObject, colorize, currentYear);
            // update the circle markers with current timestamp
            drawCircleMarkers(stateGunData, leafletGeojsonObject, colorize, currentYear);
            // update timestamp in legend heading
            document.querySelector(".legend h3 span").innerHTML = currentYear;
            // update the year
            year.innerHTML = currentYear;
        });

        // Store 'See All Shootings' toggle button
        var allShootingsToggleButton = document.querySelector("#all-shootings-toggle");

        // Toggles all shooting circle markers on after slider changes
        allShootingsToggleButton.addEventListener("click", function() {
            toggleAllShootings = true;
            drawCircleMarkers(stateGunData, leafletGeojsonObject, colorize, currentYear);
        });

        // // References and stores gun ownership button
        // var gunOwnershipButton = document.querySelector("#ownership");

        // // References and stores permit laws button
        // var permitButton = document.querySelector("#permit");

        // // Toggles all shooting circle markers on after slider changes
        // gunOwnershipButton.addEventListener("click", function() {
        //     currentLayer = "Gun Ownership";
        //     updateMap(stateGunData, leafletGeojsonObject, colorize, currentYear);
        // });

        // permitButton.addEventListener("click", function() {
        //     currentLayer = "Permit Laws";
        //     updateMap(stateGunData, leafletGeojsonObject, colorize, currentYear);
        // });

        // // Initiate autoplay state
        // var autoplay;

        // // Assign interval actions to autoplay
        // autoplay = setInterval(function () {
        //     // Store currently selected value from slider
        //     let currentValue = Number(slider.value);
        //     // Store target value
        //     let nextValue = currentValue + 1;
        //     // Validate target value
        //     if (nextValue > Number(slider.max)) {
        //         //if invalid, reset slider value to min value
        //         slider.value = 1989;
        //     } else {
        //         // Otherwise assign new target value
        //         slider.value = nextValue;
        //     }
        //     // Update map and legend with new values
        //     updateMap(dataLayer, solarPercentage, colorize, slider.value);
        //     document.querySelector(".legend h3 span").innerHTML = slider.value;
        //     // Update the year in the slider
        //     year.innerHTML = slider.value;
        // }, 500);
        // // Set button text to 'pause'
        // autoplayToggle.textContent = "Pause";

        // // Event handler listens for clicks on th eplay/pause button, and when clicked calls the handleAutoplayToggle callback function
        // autoplayToggle.addEventListener("click", handleAutoplayToggle);

        // Handles autoplay state logic
        // function handleAutoplayToggle() {
        //     // If autoplay is 'on', clears interval (pasues) and resets button text to 'Play'
        //     if (autoplay) {
        //         clearInterval(autoplay);
        //         autoplay = null;
        //         autoplayToggle.textContent = "Play";
        //     } else {
        //         // If autoplay is 'off' sets interval (plays), auto advances slider, and updates map accordingly
        //         autoplay = setInterval(() => {
        //             let currentValue = parseInt(slider.value);
        //             let nextValue = currentValue + 1;
        //             // Logic to advance slider value or reset value when the slider max is reached (2020)
        //             if (nextValue > parseInt(slider.max)) {
        //                 slider.value = 1989;
        //             } else {
        //                 slider.value = nextValue;
        //             }
        //             // Updates map based on slider's current value
        //             updateMap(dataLayer, solarPercentage, colorize, slider.value);
        //             // Updates legend year
        //             document.querySelector(".legend h3 span").innerHTML = slider.value;
        //             // Updates slider year
        //             year.innerHTML = slider.value;
        //         }, 500);
        //         autoplayToggle.textContent = "Pause";
        //     }
        // } // end handleAutoplayToggle()

    } // end createSliderUI()

})();