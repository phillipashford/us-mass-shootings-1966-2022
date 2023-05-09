
(function () {

    'use strict';

    ////////////////////
    ////////// TOC /////
    ////////////////////
    // I know this is a lot of code. I aim to prioritize refactoring before final version. I learned soooo much from this project! Particularly regarding function sequence/data flow. I went crossed eyed trying to make sense of things until I finally mapped it all out on paper and 'went with the flow'.

    // LINE 28 INITIALIZATION
    // LINE 91 MAP INSTANTIATION
    // LINE 143 FETCH AND PARSE DATA
    // LINE 169 DATA PROCESSING
        // LINE 174 GUN DATA LOGIC
        // LINE 220 DATA BREAKS LOGIC
    // LINE 246 RENDERING THE LEAFLET GEOJSON
    // LINE 302 DRAWING THE CIRCLE MARKERS 
    // LINE 387 DRAWING THE STATE LAYERS 
    // LINE 456 LEAFLET CONTROLS 
        // LINE 459 CREATE LEGEND
        // LINE 551 CREATE SLIDER UI




    ////////////////////////////////////////
    ////////// INITIALIZATION //////////////
    ////////////////////////////////////////

    // create a function with a short name to select elements
    const $ = function (x) {
        return document.querySelector(x);
    };

    // get page elements
    const modal = $("#modal");
    const button = $("#modal-button");
    const title = $("#title");
    const modalFooter = document.getElementById("modal-footer");

    // Update date
    setDate();

    function setDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' });
        modalFooter.textContent = `Phillip Ashford | ${month}, ${year}`;
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
        center: [39.8283, -98.5795],
        zoom: 5,
        minZoom: 4,
        maxZoom: 9,
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

        // Find the min and max of the solarRange array
        const hfrRangeMax = Math.max.apply(null, hfrBreaksRange);
        const hfrRangeMin = Math.min.apply(null, hfrBreaksRange);

        // I created the breaks manually because chroma.js's k-means only created 2 breaks whenever I ran it, despite asking for 5. So I just manually inserted my own breaks between the max and min values.
        var breaks = [hfrRangeMin, 0.4, 0.5, 0.6, 0.7, hfrRangeMax];

        // FOR INSPECTION
        // console.log(hfrBreaksRange);
        // console.log(hfrRangeMax);
        // console.log(hfrRangeMin);

        // Create color generator function 
        var colorize = chroma.scale(scaleColors).domain([hfrRangeMin, hfrRangeMax])
            .classes(breaks)
            .mode('lab');

        renderLeafletGeojson(stateGunData, states, colorize, breaks);

    } // End processData()

    ////////////////////////////////////////
    ///// RENDERING THE LEAFLET GEOJSON ////
    ////////////////////////////////////////

    function renderLeafletGeojson(stateGunData, states, colorize, breaks) {

        //////////////////// RENDER LEAFLET LAYER ////////////////////

        const leafletGeojsonObject = L.geoJson(states, {
            style: function (feature) {
                return {
                    color: defaultStateLineColor, //
                    weight: 0.25,
                    fillOpacity: 0.75,
                    opacity: 1
                };
            },
            //////////////////// ADD EVENT LISTENERS ////////////////////

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

    } // End renderLeafletGeojson()

    function calcRadius(val) {
        const radius = Math.sqrt(val / Math.PI);
        // The conditional logic here sizes the largest datum differently from the others in order to facilitate perception of scale between smaller values
        return (val > 900) ? radius * 3 : radius * 5;
    }

    ////////////////////////////////////////
    ///// DRAWING THE CIRCLE MARKERS ///////
    ////////////////////////////////////////

    function drawCircleMarkers(stateGunData) {

        // remove all circle markers from the map before updating
        map.eachLayer(layer => layer instanceof L.CircleMarker ? map.removeLayer(layer) : null);

        shootings.forEach(shooting => {
            const date = new Date(shooting['date']).getFullYear();
            var circleMarker;
            // I'm using the logic immediately below to add a class name to the markers whose incidents include a summary. Initially I was going to change the color of these markers to offer the user an affordance but I think the user might confuse it with a data measurement. I played around with animations but they were not subtle enough.
            var className = (shooting['summary']) ? "summary " : null;

            // Default options for all circle markers
            var options = {
                radius: calcRadius(shooting['total_victims']),
                color: "#840000",
                fillColor: "#9c3131",
                fillOpacity: 0.5,
                weight: 1,
                pane: 'circlesPane',
                className: className
            }

            // if the user has requested shootings from all years...
            if (toggleAllShootings == true) {
                $("#all-shootings-toggle").style.background = scaleColors[0];

                // Create a circle marker and add it to the map
                circleMarker = L.circleMarker([shooting['coordinates'][0], shooting['coordinates'][1]], options).addTo(map);
            } else { // Otherwise add only the shootings whose dates match the currentYear value
                $("#all-shootings-toggle").style.background = "#ddd";
                if (date == currentYear) {
                    // Create a circle marker and add it to the map
                    circleMarker = L.circleMarker([shooting['coordinates'][0], shooting['coordinates'][1]], options).addTo(map);
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

    } // END drawCircleMarkers

    ////////////////////////////////////////
    ///// DRAWING THE STATE LAYERS /////////
    ////////////////////////////////////////

    function drawLayers(stateGunData, leafletGeojsonObject, colorize) {

        //////////////////// JOIN GEOJSON FEATURES TO GUN DATA & STYLE ACCORDINGLY ////////////////////

        leafletGeojsonObject.eachLayer(function (layer) {
            // Instantiation of variables + default colors for any layers without data
            var fillColor = noDataColor;
            var stateLineColor = defaultStateLineColor;
            var props = layer.feature.properties;
            // Default popup for instances of no data
            var popup = `<h1>${currentLayer} in ${props.NAME}</h1>
            <h2>${currentYear}: No data</h2>`;

            // if the currentLayer is 'Gun Ownership'
            if (currentLayer == 'Gun Ownership') {
                // and if there is gun data for the geojson feature during the selected year
                if (stateGunData[props.NAME] && stateGunData[props.NAME][currentYear]) {
                    // and if there is HFR data for the geojson feature 
                    if (stateGunData[props.NAME][currentYear].HFR) {
                        // then style as...
                        fillColor = colorize(Number(stateGunData[props.NAME][currentYear].HFR))
                        // and configure popup
                        popup =
                            `<h1>${currentLayer} in ${props.NAME}</h1>
                            <h2>${currentYear} | ${((stateGunData[props.NAME][currentYear].HFR) * 100).toFixed()}%  *</h2>
                    <h5>* Estimate of the proportion of adult, non-institutionalized residents who live in a household with a firearm. <a href="">Learn more</a></h5>`;
                    }
                }

            } else { // if the currentLayer is not 'Gun Ownership'

                // and if there is gun law data for the geojson feature during the selected year
                if (stateGunData[props.NAME] && stateGunData[props.NAME][currentYear]) {
                    // and if the state has a 'permit-to-purchase' law... 
                    if (stateGunData[props.NAME][currentYear].PERMIT != undefined) {
                        if (stateGunData[props.NAME][currentYear].PERMIT == true) {
                            // then style as...
                            fillColor = scaleColors[0];

                        } else {
                            // else PERMIT must be false -> style as...
                            fillColor = scaleColors[1];
                        }
                        // and configure popup
                        popup =
                            `<h1>${currentLayer} in ${props.NAME}</h1>
                            <h2>Has Permit-to-Purchase law: 
                            ${(stateGunData[props.NAME][currentYear].PERMIT == true) ? `Yes` : `No`}
                            </h2>`;
                    }
                }
            }

            // Send options to Leaflet's setStyle function
            layer.setStyle({
                fillColor: fillColor,
                stateLineColor: stateLineColor
            });

            // Add a popup to the layer with additional information
            layer.bindPopup(popup);
        });

    } // end drawLayers()

    ////////////////////////////////////////
    ////////// LEAFLET CONTROLS ////////////
    ////////////////////////////////////////

    //////////////////// LEGEND //////////////////// 
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
            const legend = $(".legend");
            legend.innerHTML = `<div class="button-container"><button id="ownership">Gun Ownership</button><button id="permit">Permit Law</button></div><h3><span>2020</span>Residents living in a<br> household with a firearm</h3>`;

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

            // creates the unordered list and adds the list items to it
            const unorderedList = `<ul>${listItems}</ul>`;

            // adds the unordered list to the legend
            legend.innerHTML += unorderedList;

            // Changes bg color of selected layer button to indicate selection
            $("#ownership").style.background = scaleColors[0];

        } else { // current layers is gun permits layer
            // select div and create legend title
            const legend = $(".legend");
            legend.innerHTML = `<div class="button-container"><button id="ownership">Gun Ownership</button><button id="permit">Permit Law</button></div><h3><span>1989</span>States with a<br> Permit-to-Purchase Law</h3>`;

            let unorderedList = `<ul><li><span style="background:${noDataColor}"></span> No Data </li>
            <li><span style="background:${scaleColors[0]}"></span>Has P-to-P Law</li>
            <li><span style="background:${scaleColors[1]}"></span>No P-to-P Law</li>`;

            // adds the unordered list to the legend
            legend.innerHTML += unorderedList;

            // Changes bg color of selected layer button to indicate selection
            $("#permit").style.background = scaleColors[0];

        }

        // References and stores gun ownership button
        var gunOwnershipButton = $("#ownership");

        // References and stores Permit Law button
        var permitButton = $("#permit");

        function updateGunDataLayer() {
            //updates state layers
            drawLayers(stateGunData, leafletGeojsonObject, colorize, currentYear);
            // Removes pre-existing legend
            map.removeControl(legendControl);
            // draws new legend
            drawLegend(breaks, colorize, leafletGeojsonObject);
        }

        gunOwnershipButton.addEventListener("click", function () {
            currentLayer = "Gun Ownership";
            updateGunDataLayer();
        });

        permitButton.addEventListener("click", function () {
            currentLayer = "Permit Law";
            updateGunDataLayer();
        });

    } // end drawLegend()

    //////////////////// SLIDER UI //////////////////// 

    function createSliderUI(stateGunData, leafletGeojsonObject, breaks, colorize) {

        // create Leaflet control for the slider
        const sliderControl = L.control({ position: "bottomleft" });

        // update the year
        const year = $("#current-year");

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
        const slider = $(".year-slider");

        // listen for changes on input element
        slider.addEventListener("input", function (e) {
            // get the value of the selected option
            currentYear = e.target.value;
            // update the state layers with selected year
            drawLayers(stateGunData, leafletGeojsonObject, colorize, currentYear);
            // update the circle markers with selected year
            drawCircleMarkers(stateGunData, leafletGeojsonObject, colorize, currentYear);
            // update timestamp in legend heading
            $(".legend h3 span").innerHTML = currentYear;
            // update the year
            year.innerHTML = currentYear;
        });

        // Store 'See All Shootings' toggle button
        var allShootingsToggleButton = $("#all-shootings-toggle");

        // Toggles all circle markers back on after slider changes
        allShootingsToggleButton.addEventListener("click", function () {
            toggleAllShootings = true;
            drawCircleMarkers(stateGunData, leafletGeojsonObject, colorize, currentYear);
        });
    } // end createSliderUI()

})();