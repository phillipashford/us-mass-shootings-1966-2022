
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
    var currentYear = 1990
    // var currentLayer = 'Permit-to-Purchase';
    var currentLayer = 'Gun Ownership';

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
        var breaks = [0.034,0.4, 0.5, 0.6, 0.7, 0.8];

        // Find the min and max of the solarRange array
        const hfrRangeMax = Math.max.apply(null, hfrBreaksRange);
        const hfrRangeMin = Math.min.apply(null, hfrBreaksRange);

        // FOR INSPECTION
        // console.log(hfrBreaksRange);
        // console.log(hfrRangeMax);
        // console.log(hfrRangeMin);

        // Create color generator function @COLOR
        var colorize = chroma.scale(['#777', '#222']).domain([hfrRangeMin, hfrRangeMax])
            .classes(breaks)
            .mode('lab');

        //////////////////// FUNCTION CALLS ////////////////////    

            // Send processed data along with the geojson to the drawMap function where it will be added to the map and styled
            drawMap(stateGunData, states, colorize);
            // drawLegend(breaks, colorize);
                
    } // End processData()

    ////////////////////////////////////////
    ////// DRAWING/UPDATING THE MAP ////////
    ////////////////////////////////////////

    function drawMap(stateGunData, states, colorize) {

    //////////////////// ADD GEOJSON LAYER ////////////////////

        const leafletGeojsonObject = L.geoJson(states, {
            style: function (feature) {
                return {
                    color: "#fff", //@COLOR
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
    
    //////////////////// JOIN GEOJSON FEATURES TO GUN DATA & STYLE ACCORDINGLY ////////////////////

        leafletGeojsonObject.eachLayer(function(layer) {
            // var feature = layer.feature;
            var fillColor;
            var stateLineColor;
            var props = layer.feature.properties;
            var popup = `<h1>${props.NAME}'s ${currentLayer}</h1>
            <h2>${currentYear} | `;
    
            // if the currentLayer is 'Gun Ownership'
            if (currentLayer == 'Gun Ownership') {
                // and if there is gun law data for the geojson feature
                if (stateGunData[props.NAME]) {
                    // and if there is HFR data for the geojson feature 
                    if (stateGunData[props.NAME][currentYear].HFR) {
                        // then style as...
                        fillColor = colorize(Number(stateGunData[props.NAME][currentYear].HFR)) // @COLOR
                        stateLineColor = '#555'; // @COLOR
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

                    // and if there is gun law data for the geojson feature
                    if (stateGunData[props.NAME]) {
                        // and if the state has a 'permit-to-purchase' law... 
                        if (stateGunData[props.NAME][currentYear].PERMIT != undefined) {
                            stateLineColor = 'black';
                            if (stateGunData[props.NAME][currentYear].PERMIT == true) {
                                // then style as...
                                fillColor = "#ccc"; //@COLOR
                            } else {
                                // else PERMIT must be false -> style as...
                                fillColor = "grey"; // @COLOR
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
                weight: .75,
                opacity: 1,
                color: stateLineColor || "tan", // @COLOR
                fillColor: fillColor || "tan" // @COLOR
            });

            // Add a popup to the layer with additional information
            layer.bindPopup(popup);

        });

        // shootings.forEach(shooting => {
        //     const date = new Date(shooting['date']).getFullYear();
        //     const recency = (new Date().getFullYear() - date);

        //     if (shooting['summary']) {
        //         var circleColor = "#840000"; // @COLOR
        //     } else {
        //         var circleColor = "#9c3131"; // @COLOR
        //     }

        //     // Create a circle marker and add it to the map
        //     const circleMarker = L.circleMarker([shooting['coordinates'][0], shooting['coordinates'][1]], {
        //         radius: calcRadius(shooting['total_victims']),
        //         color: circleColor,
        //         weight: recency < 30 ? 1 : 0.5,
        //         fillOpacity: 0.5 - (recency / 100),
        //         pane: 'circlesPane'
        //     }).addTo(map);

        //     //////////////////// CIRCLE MARKERS EVENT LISTENERS ////////////////////

        //     // when mousing over a layer
        //     circleMarker.on("mouseover", function () {
        //         // change the style
        //         circleMarker
        //             .setStyle({
        //                 weight: 2
        //             })
        //             // .bringToFront();
        //     });

        //     // on mousing off layer
        //     circleMarker.on("mouseout", function () {
        //         // reset the layer style
        //         circleMarker.setStyle({
        //             weight: recency < 30 ? 1 : 0.5
        //         });
        //     });

        //     // Add a popup to the marker with additional information
        //     var popup =
        //         `<h3>${shooting['location']}</h3>
        //     <p>${shooting['dateString']}</p><hr>`;

        //     if (shooting['summary'] != "") {
        //         popup += `<p>${shooting['summary']}</p>`;
        //     } else {
        //         popup +=
        //             `<p>${shooting['fatalities']} deaths</p>
        //      <p>${shooting['injured']} injuries</p>`;
        //     }

        //     circleMarker.bindPopup(popup);
                        
        // });

//////////////////// CIRCLE MARKERS  ////////////////////

        shootings.forEach(shooting => {
            const date = new Date(shooting['date']).getFullYear();
            const recency = (new Date().getFullYear() - date);
        
            if (shooting['summary']) {
                var circleColor = "#840000"; // @COLOR
            } else {
                var circleColor = "#9c3131"; // @COLOR
            }
        
            // Create a custom icon for the crosshair marker
            const crosshairIcon = L.icon({
                iconUrl: 'img/icon.svg', // Replace with your icon URL
                iconSize: [calcRadius(shooting['total_victims']) * 2, calcRadius(shooting['total_victims']) * 2], // Adjust size based on victims
                iconAnchor: [calcRadius(shooting['total_victims']), calcRadius(shooting['total_victims'])], // Center the icon
            });
        
            // Create a crosshair marker and add it to the map
            const crosshairMarker = L.marker([shooting['coordinates'][0], shooting['coordinates'][1]], {
                icon: crosshairIcon,
                pane: 'circlesPane'
            }).addTo(map);
        
            //////////////////// CIRCLE MARKERS EVENT LISTENERS ////////////////////
        
            // when mousing over a layer
            crosshairMarker.on("mouseover", function () {
                // change the style
                crosshairMarker.getElement().style.border = '2px solid ' + circleColor;
            });
        
            // on mousing off layer
            crosshairMarker.on("mouseout", function () {
                // reset the layer style
                crosshairMarker.getElement().style.border = '1px solid ' + circleColor;
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
        
            crosshairMarker.bindPopup(popup);
        });
        

        // Add labels layer 
        CartoDB_DarkMatterOnlyLabels.addTo(map);
    
        //////////////////// FUNCTION CALLS ////////////////////    

        // updateMap(dataLayer, solarPercentage, colorize, "1989");
        // createSliderUI(dataLayer, solarPercentage, colorize);

    } // End drawMap()

    function calcRadius(val) {
        const radius = Math.sqrt(val / Math.PI);
        return radius * 5; // adjust .5 as a scale factor
    }
    

    // function updateMap(dataLayer, solarPercentage, colorize, currentYear) {

    //     const sparkOptions = {
    //         id: "spark",
    //         width: 280,
    //         height: 50,
    //         color: "green",
    //         lineWidth: 3
    //     };

    //     dataLayer.eachLayer(function (layer) {

    //         // This feature is broken and I'm at a loss as to how to fix it. I know the answer must lie in the D3 logic inside sparkLine() but I don't see it.
    //         sparkLine(layer, sparkOptions, currentYear);

    //         const solarProp = layer.feature.properties.solarPercentage;

    //         ///////// Determine Layer fill color and popup logic

    //         // If solarPercentage is present in layer...
    //         if (solarProp) {
    //             layer.setStyle({
    //                 // Set fill color based on currentYear's solarPercentage
    //                 fillColor: colorize(Number(solarProp[currentYear]))
    //             });

    //             // If the given layer(state)'s currentYear value is within valid range...
    //             if (solarProp[currentYear] &&
    //                 solarProp[currentYear] > 0 &&
    //                 solarProp[currentYear] <= 100) {

    //                 if (solarProp[currentYear] > 0 &&
    //                     solarProp[currentYear] < 0.01) {

    //                     var popup = `<span id="spark"></span><h3>In <b>${currentYear} less than 0.01%</b> of <b>${layer.feature.properties.NAME}'s</b> Residential Electricity came from Solar<b/></h3>`;
    //                 } else {

    //                     var popup = `<span id="spark"></span><h3>In <b>${currentYear} ${solarProp[currentYear].toFixed(2)}%</b> of <b>${layer.feature.properties.NAME}'s</b> Residential Electricity came from Solar<b/></h3>`;
    //                 }
    //             } else { // Otherwise if value is outside of valid range (see Alaska 1997-2008)
    //                 layer.setStyle({
    //                     fillColor: "white"
    //                 });
    //                 var popup = `<h3><b>${layer.feature.properties.NAME}</b><br>${currentYear} Data Unavailable</h3>`;
    //             }
    //         } else { // Otherwise if solarPercentage is NOT present in layer (see Puerto Rico)
    //             layer.setStyle({
    //                 fillColor: "white"
    //             });
    //             var popup = `<h3><b>${layer.feature.properties.NAME}</b><br>${currentYear} Data Unavailable</h3>`;
    //         }
    //         layer.bindPopup(popup);
    //     });

    //     //Ensure proper layering of Labels on each map update
    //     CartoDB_PositronOnlyLabels.addTo(map);

    // } // end updateMap()

    // function sparkLine(data, options, currentYear) {

    //     // console.log("Data = geoJSON feature: ", data);

    //     // Clear previous svg
    //     d3.select(`#${options.id} svg`).remove();

    //     // Create array to store full range of data being passed in
    //     var stateRange = [];

    //     // Loop through data object and push values to stateRange array
    //     var stateProps = data.feature.properties;
    //     for (var year in stateProps.solarPercentage) {
    //         stateRange.push(stateProps.solarPercentage[year]);
    //     }

    //     // console.log("stateRange array (data given to D3): ", stateRange);

    //     const w = options.width,
    //         h = options.height,
    //         m = {
    //             top: 5,
    //             right: 5,
    //             bottom: 5,
    //             left: 5,
    //         },
    //         iw = w - m.left - m.right,
    //         ih = h - m.top - m.bottom,
    //         x = d3.scaleLinear().domain([1989, 2020]).range([0, iw]),
    //         y = d3
    //             .scaleLinear()
    //             .domain([d3.min(stateRange), d3.max(stateRange)])
    //             .range([ih, 0]);

    //     const svg = d3
    //         .select(`#${options.id}`)
    //         .append("svg")
    //         .attr("width", w)
    //         .attr("height", h)
    //         .append("g")
    //         .attr("transform", `translate(${m.left},${m.top})`);

    //     const line = d3
    //         .line()
    //         .x((d, i) => x(i))
    //         .y((d) => y(d));

    //     const area = d3
    //         .area()
    //         .x((d, i) => x(i))
    //         .y0(d3.min(stateRange))
    //         .y1((d) => y(d));

    //     svg
    //         .append("path")
    //         .datum(stateRange)
    //         .attr("stroke-width", 0)
    //         .attr("fill", options.color)
    //         .attr("opacity", 0.5)
    //         .attr("d", area);

    //     svg
    //         .append("path")
    //         .datum(stateRange)
    //         .attr("fill", "none")
    //         .attr("stroke", options.color)
    //         .attr("stroke-width", options.lineWidth)
    //         .attr("d", line);

    //     svg
    //         .append("circle")
    //         .attr("cx", x(Number(currentYear) - 1))
    //         .attr("cy", y(Number(stateProps[currentYear]) - 1))
    //         .attr("r", "4px")
    //         .attr("fill", "white")
    //         .attr("stroke", options.color)
    //         .attr("stroke-width", options.lineWidth / 2);
    // }

    ////////////////////////////////////////
    ////////// LEAFLET CONTROLS //////////
    ////////////////////////////////////////

    // function drawLegend(breaks, colorize) {
    //     // create a Leaflet control for the legend
    //     const legendControl = L.control({
    //         position: "topright",
    //     });

    //     // when the control is added to the map
    //     legendControl.onAdd = function (map) {
    //         // create a new division element with class of 'legend' and return
    //         const legend = L.DomUtil.create("div", "legend");
    //         return legend;
    //     };

    //     // add the legend control to the map
    //     legendControl.addTo(map);

    //     // select div and create legend title
    //     const legend = document.querySelector(".legend");
    //     legend.innerHTML = `<h3><span>1989</span>Percent of Residential<br>Power from Solar</h3>`;

    //     // I changed the structure here because the browser was closing the ul tag early for some reason (before the loop ran) and it was offsetting the spans in the legend.
    //     let listItems = `<li><span style="background:white"></span> No Data </li>`;

    //     // loop through the break values and concatenate listItems string
    //     for (let i = 0; i < breaks.length - 1; i++) {

    //         const color = colorize(breaks[i], breaks);

    //         // create legend item
    //         const classRange = `<li><span style="background:${color}"></span>
    //     ${breaks[i].toFixed(2)}% &mdash;
    //     ${breaks[i + 1].toFixed(2)}% </li>`;

    //         // append to legend unordered list item
    //         listItems += classRange;
    //     }

    //     // creates the unordered list and adds the list items to it
    //     const unorderedList = `<ul>${listItems}<li><a href = "" id="see-hawaii">Special Focus on Hawaii</a></li></ul>`;
  
    //     // adds the unordered list to the legend
    //     legend.innerHTML += unorderedList;

    //     ////////// MY MAKESHIFT SOLUTION TO THE HAWAII PROBLEM //////////
        
    //     // // Select link
    //     // var seeHawaii = document.querySelector("#see-hawaii");

    //     // //Set toggle state
    //     // var viewHawaii = false;

    //     // // Set event listener on Link
    //     // seeHawaii.addEventListener("click", function(event) {
    //     //     // Prevent rerender
    //     //     event.preventDefault();
    //     //     if (viewHawaii == false) {
    //     //         // Change the center and zoom level of the map to focus on Hawaii
    //     //         map.setView([19.8968, -155.5828], 7);
    //     //         // Update Legend
    //     //         seeHawaii.innerHTML = "Return to full scope";
    //     //         viewHawaii = true;
    //     //     } else {
    //     //         // Change the center and zoom level of the map to focus on Hawaii
    //     //         map.setView([52, -122], 3.75);
    //     //         // Update Legend
    //     //         seeHawaii.innerHTML = "Special Focus on Hawaii";
    //     //         viewHawaii = false;
    //     //     }
            
    //     // });


    // } // end drawLegend()

    // function createSliderUI(dataLayer, solarPercentage, colorize) {

    //     // create Leaflet control for the slider
    //     const sliderControl = L.control({ position: "bottomleft" });

    //     // update the year
    //     const year = document.querySelector("#current-year");

    //     // when added to the map
    //     sliderControl.onAdd = function (map) {
    //         // select an existing DOM element with an id of "ui-controls"
    //         const slider = L.DomUtil.get("ui-controls");

    //         // disable scrolling of map while using controls
    //         L.DomEvent.disableScrollPropagation(slider);

    //         // disable click events while using controls
    //         L.DomEvent.disableClickPropagation(slider);

    //         // return the slider from the onAdd method
    //         return slider;
    //     };

    //     // add the control to the map
    //     sliderControl.addTo(map);
    //     // select the form element
    //     const slider = document.querySelector(".year-slider");

    //     // listen for changes on input element
    //     slider.addEventListener("input", function (e) {
    //         // get the value of the selected option
    //         const currentYear = e.target.value;
    //         // update the map with current timestamp
    //         updateMap(dataLayer, solarPercentage, colorize, currentYear);
    //         // update timestamp in legend heading
    //         document.querySelector(".legend h3 span").innerHTML = currentYear;
    //         // update the year
    //         year.innerHTML = currentYear;
    //     });

    //     // Store play/pause button
    //     var autoplayToggle = document.querySelector("#autoplay-toggle");

    //     // Initiate autoplay state
    //     var autoplay;

    //     // Assign interval actions to autoplay
    //     autoplay = setInterval(function () {
    //         // Store currently selected value from slider
    //         let currentValue = Number(slider.value);
    //         // Store target value
    //         let nextValue = currentValue + 1;
    //         // Validate target value
    //         if (nextValue > Number(slider.max)) {
    //             //if invalid, reset slider value to min value
    //             slider.value = 1989;
    //         } else {
    //             // Otherwise assign new target value
    //             slider.value = nextValue;
    //         }
    //         // Update map and legend with new values
    //         updateMap(dataLayer, solarPercentage, colorize, slider.value);
    //         document.querySelector(".legend h3 span").innerHTML = slider.value;
    //         // Update the year in the slider
    //         year.innerHTML = slider.value;
    //     }, 500);
    //     // Set button text to 'pause'
    //     autoplayToggle.textContent = "Pause";

    //     // Event handler listens for clicks on th eplay/pause button, and when clicked calls the handleAutoplayToggle callback function
    //     autoplayToggle.addEventListener("click", handleAutoplayToggle);

    //     // Handles autoplay state logic
    //     function handleAutoplayToggle() {
    //         // If autoplay is 'on', clears interval (pasues) and resets button text to 'Play'
    //         if (autoplay) {
    //             clearInterval(autoplay);
    //             autoplay = null;
    //             autoplayToggle.textContent = "Play";
    //         } else {
    //             // If autoplay is 'off' sets interval (plays), auto advances slider, and updates map accordingly
    //             autoplay = setInterval(() => {
    //                 let currentValue = parseInt(slider.value);
    //                 let nextValue = currentValue + 1;
    //                 // Logic to advance slider value or reset value when the slider max is reached (2020)
    //                 if (nextValue > parseInt(slider.max)) {
    //                     slider.value = 1989;
    //                 } else {
    //                     slider.value = nextValue;
    //                 }
    //                 // Updates map based on slider's current value
    //                 updateMap(dataLayer, solarPercentage, colorize, slider.value);
    //                 // Updates legend year
    //                 document.querySelector(".legend h3 span").innerHTML = slider.value;
    //                 // Updates slider year
    //                 year.innerHTML = slider.value;
    //             }, 500);
    //             autoplayToggle.textContent = "Pause";
    //         }
    //     } // end handleAutoplayToggle()

   // } // end createSliderUI()

})();