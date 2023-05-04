(function () {

    'use strict';

      function adjustHeight() {
    const mapSize = document.querySelector("#map"),
      contentSize = document.querySelector("#content"),
      removeHeight = document.querySelector('#footer').offsetHeight,
      resize = window.innerHeight - removeHeight;

    mapSize.style.height = `${resize}px`

    if (window.innerWidth >= 768) {
      contentSize.style.height = `${resize}px`
      mapSize.style.height = `${resize}px`
    } else {
      contentSize.style.height = `${resize * 0.25}px`
      mapSize.style.height = `${resize * 0.75}px`
    }
  }

  
//   const button = document.querySelector("#legend button")
//   button.addEventListener('click', function () {
//     const legend = document.querySelector(".leaflet-legend")
//     legend.classList.toggle('show-legend')
//   })

      // get page elements
      const modal = document.querySelector("#modal");
      const button = document.querySelector("#button");
      const h1 = document.querySelector("h1");
      const modalFooter = document.getElementById("modal-footer");
  
      // Update date
    //   setDate();
  
      function setDate() {
          const date = new Date();
          const year = date.getFullYear();
          const month = date.toLocaleString('default', { month: 'long' });
          modalFooter.textContent = ` Phillip Ashford | ${month}, ${year}`;
      }
  
    //   // display modal when button is clicked
    //   button.addEventListener("click", function () {
    //       modal.style.display = "block";
    //   });
  
    //   // close modal when user clicks anywhere on the page
    //   modal.addEventListener("click", function () {
    //       modal.style.display = "none";
    //   });
  
      // Set button UI
    //   buttonUI();
  
    //   function buttonUI() {
    //       button.style.top = h1.offsetHeight + 20 + "px";
    //   }
  
    //   // Add event listener for window resize
    //   // When page rotates or is resized, reset page UI
    //   window.addEventListener("resize", buttonUI);


//   var map = L.map('map', {
//     zoomSnap: .1,
//     center: [-.23, 37.8],
//     zoom: 7,
//     minZoom: 6,
//     maxZoom: 9,
//     maxBounds: L.latLngBounds([-6.22, 27.72], [5.76, 47.83])
//   });

    // // Initialize the map
    // const map = L.map('map').setView([37.8, -96], 4);

    // var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    //     subdomains: 'abcd',
    //     maxZoom: 20,
    //     pane: 'geojsonPane'
    // });

    // var CartoDB_PositronOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    //     subdomains: 'abcd',
    //     maxZoom: 20,
    //     pane: 'labelsPane'
    // });

    // // CartoDB_PositronNoLabels.addTo(map);

    // // Add a tile layer to the map
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);

    // // Create data object for states' gun data
    // const stateGunData = [];
    // // Create array to store all HFR values
    // const hfrBreaksRange = [];
    // var currentYear = 1990
    // var currentLayer = 'gun-ownership';

////////////////////////////////////////
////////// FETCH AND PARSE DATA ////////
////////////////////////////////////////

// Promise.all([
//     fetch('data/gun-laws-and-ownership.csv').then((response) => response.text()),
//     fetch('data/us-states.geojson').then((response) => response.json())
// ])
//     .then(function (responses) {
//         const [gunCSVData, states] = responses;

//         const parsedGunData = Papa.parse(gunCSVData, {
//             header: true,
//             dynamicTyping: true,
//             skipEmptyLines: true,
//         });

//         console.log("The gun data CSV parsed: ", parsedGunData,
//                     "\nThe geojson data: ", states);

//         processData(parsedGunData.data, states);
//     })
//     .catch(function (error) {
//         console.log(`Ruh roh! An error has occurred`, error);
//     });


        ////////////////////////////////////////
        ////////// DATA PROCESSING /////////////
        ////////////////////////////////////////

    // function processData(gunData, states) {

    //     ///////// Iterates over and sorts the parsed gun data array and stores the sorted data in the empty array defined as the constant "stateGunData" in the initialization section.

    //         // Iterate over all objects in the gunData array
    //         for (let i = 0; i < gunData.length; i++) {

    //             // Push HFR data to array
    //             hfrBreaksRange.push(gunData[i].HFR);

    //             const state = gunData[i].STATE;

    //             // check if state object is present in stateGunData object (defined above)
    //             if (!stateGunData[state]) {

    //                 // if not, add the state object
    //                 stateGunData[state] = {};

    //             } else { }; // Otherwise do nothing

    //             // check if year object exists...
    //             if (!stateGunData[state][gunData[i].YEAR]) {

    //                 //if not, create year object and assign key value pairs
    //                 stateGunData[state][gunData[i].YEAR] = {

    //                     // HFR is an ESTIMATE of the proportion of adult, noninstitutionalized residents who live in a household with a firearm ("Factor score for household firearm ownership latent factor")
    //                     HFR: gunData[i].HFR,

    //                     // State has permit-to-purchase law (boolean)
    //                     PERMIT: gunData[i].PERMIT,

    //                     // State has universal background checks law (boolean)
    //                     UNIVERSAL: gunData[i].UNIVERSAL

    //                 };
    //             } else { }; // if year object exists, do nothing

    //         }

    //         console.log(`stateGunData - Derived from the gunData array, this array contains gunData's gun ownership and gun law data sorted into corresponding state and nested year objects necessary for joining it to the geojson layer and styling said layer by stateGunData's key values: 
    //             \n \u2193 stateGunData's State objects' Year objects' Keys \u2193
    //             \n HFR: HFR is an ESTIMATE of the proportion of adult, noninstitutionalized residents who live in a household with a firearm ("Factor score for household firearm ownership latent factor")
    //             \n PERMIT: State has permit-to-purchase law (boolean)
    //             \n UNIVERSAL: State has universal background checks law (boolean)`, stateGunData);

    //     // Create data breaks
    //     var breaks = [0.034,0.4, 0.5, 0.6, 0.7, 0.8];

    //     // Find the min and max of the solarRange array
    //     const hfrRangeMax = Math.max.apply(null, hfrBreaksRange);
    //     const hfrRangeMin = Math.min.apply(null, hfrBreaksRange);
    //     console.log(hfrBreaksRange);
    //     console.log(hfrRangeMax);
    //     console.log(hfrRangeMin);
    //     console.log(breaks);

    //     // create color generator function
    //     var colorize = chroma.scale(['blue', '#red']).domain([hfrRangeMin, hfrRangeMax])
    //         .classes(breaks)
    //         .mode('lab');

    //         // Send processed data along with the geojson to the stateStyle function where it will be added to the map and styled
    //         drawMap(stateGunData, states, colorize);
    //         // drawLegend(breaks, colorize);
                
    // } // End drawMap()

        ////////////////////////////////////////
        ////////// GEOJSON STYLING LOGIC ///////
        ////////////////////////////////////////

    // function drawMap(stateGunData, states, colorize) {

    //     const leafletGeojsonObject = L.geoJson(states, {
    //         style: function (feature) {
    //             return {
    //                 color: "#fff",
    //                 weight: 0.75,
    //                 fillOpacity: 0.9,
    //                 // pane: 'geojsonPane'
    //             };
    //         },
    //         // add hover/touch functionality to each feature layer
    //         onEachFeature: function (feature, layer) {

    //             // when mousing over a layer
    //             layer.on("mouseover", function () {
    //                 // change the style
    //                 layer
    //                     .setStyle({
    //                         weight: 2,
    //                         fillOpacity: 1
    //                     })
    //                     .bringToFront();
    //             });

    //             // on mousing off layer
    //             layer.on("mouseout", function () {
    //                 // reset the layer style
    //                 layer.setStyle({
    //                     weight: 0.75,
    //                     fillOpacity: 0.9
    //                 });
    //             });
    //         }
    //     }).addTo(map);
    

    //     leafletGeojsonObject.eachLayer(function(layer) {
    //         // var feature = layer.feature;
    //         var fillColor;
    //         var props = layer.feature.properties;
    
    //         // if the currentLayer is 'gun-ownership'
    //         if (currentLayer == 'gun-ownership') {
    //             // and if there is gun law data for the geojson feature
    //             if (stateGunData[props.NAME]) {
    //                 // and if there is HFR data for the geojson feature 
    //                 if (stateGunData[props.NAME][currentYear].HFR) {
    //                     // then style as...
    //                     fillColor = colorize(Number(stateGunData[props.NAME][currentYear].HFR))

    //             } else { } // do nothing if no HFR data
    //           } else { // if no gun law data (DC, Puerto Rico, etc)

    //           }

    //         } else { // if the currentLayer is not 'gun-ownership' it must be 'gun-laws'

    //                 // and if there is gun law data for the geojson feature
    //                 if (stateGunData[props.NAME]) {
    //                     // and if the state has a 'permit-to-purchase' law... 
    //                     if (stateGunData[props.NAME][currentYear].PERMIT) {
    //                         if (stateGunData[props.NAME][currentYear].PERMIT == true) {
    //                             // then style as...
    //                             fillColor = "#ccc";
    //                         } else {
    //                             // else PERMIT must be false -> style as...
    //                             fillColor = "grey";
    //                         }
    //                     } else {} // if no permit law do nothing
    //             } else { } // do nothing if no data (DC, Puerto Rico, etc)
    //         }
            
    //         console.log(fillColor);
    //         layer.setStyle({
    //             weight: .75,
    //             opacity: 1,
    //             color: 'white',
    //             fillColor: fillColor
    //         });

    //     });
    // }; // End drawMap()
    

    // function createShootingMarkers(shootings) {
    //     shootings.forEach(shooting => {
    //         const date = new Date(shooting['date']).getFullYear();
    //         const recency = (new Date().getFullYear() - date);

    //         // Create a circle marker and add it to the map
    //         const circleMarker = L.circleMarker([shooting['coordinates'][0], shooting['coordinates'][1]], {
    //             radius: calcRadius(shooting['total_victims']),
    //             color: 'red',
    //             weight: recency < 30 ? 1 : 0.5,
    //             fillOpacity: 0.5 - (recency / 100),
    //         }).addTo(map);

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

    //         circleMarker.bindPopup(popup);
    //     });
    // }



    // // Event listeners for buttons and slider
    // document.getElementById('toggle-layer').addEventListener('click', toggleLayer(currentLayer));
    // document.getElementById('year-slider').addEventListener('input', updateYear);
    // document.getElementById('supplemental-module').addEventListener('click', openSupplementalModule);



    // function toggleLayer(geojsonLayer, currentLayer, currentYear) {
    //     // Add logic to toggle between gun laws and gun ownership layers

    //     if (currentLayer == 'gun-ownership') {
    //         currentLayer = 'gun-laws';
    //     } else {
    //         currentLayer = 'gun-ownership';
    //     }
    //     console.log(currentLayer)
    //     stateStyle(geojsonLayer, currentLayer, currentYear)
    // }

    // function updateYear() {
    //     // Add logic to update data based on the selected year
    //     currentYear = // year from slider
    //         stateStyle(currentLayer, currentYear)
    // }

    // function openSupplementalModule() {
    //     // Add logic to open the supplemental module
    // }

    // function calcRadius(val) {
    //     const radius = Math.sqrt(val / Math.PI);
    //     return radius * 5; // adjust .5 as a scale factor
    // }


})();



// (function () {

//     'use strict';
  
//     adjustHeight();
//     window.addEventListener('resize', adjustHeight)
  
//     function adjustHeight() {
//       const mapSize = document.querySelector("#map"),
//         contentSize = document.querySelector("#content"),
//         removeHeight = document.querySelector('#footer').offsetHeight,
//         resize = window.innerHeight - removeHeight;
  
//       mapSize.style.height = `${resize}px`
  
//       if (window.innerWidth >= 768) {
//         contentSize.style.height = `${resize}px`
//         mapSize.style.height = `${resize}px`
//       } else {
//         contentSize.style.height = `${resize * 0.25}px`
//         mapSize.style.height = `${resize * 0.75}px`
//       }
//     }
  
//     const button = document.querySelector("#legend button")
//     button.addEventListener('click', function () {
//       const legend = document.querySelector(".leaflet-legend")
//       legend.classList.toggle('show-legend')
//     })
  
  
//     var map = L.map('map', {
//       zoomSnap: .1,
//       center: [-.23, 37.8],
//       zoom: 7,
//       minZoom: 6,
//       maxZoom: 9,
//       maxBounds: L.latLngBounds([-6.22, 27.72], [5.76, 47.83])
//     });
  
//     // request a leaflet raster tile layer and add to map
//     var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
//       maxZoom: 20,
//       attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
//     });
  
//     Stadia_AlidadeSmoothDark.addTo(map);
  
//     omnivore
//       .csv("data/kenya_education_2014.csv")
//       .on("ready", function (e) {
//         drawMap(e.target.toGeoJSON());
//         drawLegend(e.target.toGeoJSON()); // add this statement
//       })
//       .on("error", function (e) {
//         console.log(e.error[0].message);
//       });
  
  
//     function drawMap(data) {
//       const options = {
//         pointToLayer: function (feature, ll) {
//           return L.circleMarker(ll, {
//             opacity: 1,
//             weight: 2,
//             fillOpacity: 0,
//           });
//         },
//       };
//       // create 2 separate layers from GeoJSON data
//       const girlsLayer = L.geoJson(data, options).addTo(map),
//         boysLayer = L.geoJson(data, options).addTo(map);
  
//       // fit the bounds of the map to one of the layers
//       map.fitBounds(girlsLayer.getBounds(), {
//         padding: [50, 50],
//       });
  
//       // color the layers different colors
//       girlsLayer.setStyle({
//         color: getColor("girls"),
//       });
//       boysLayer.setStyle({
//         color: getColor("boys"),
//         dashArray: "5,5",
//         dashOffset: 0,
//       });
  
//       resizeCircles(girlsLayer, boysLayer, 1);
  
//       sequenceUI(girlsLayer, boysLayer);
//     } // end drawMap()
  
//     function sequenceUI(girlsLayer, boysLayer) {
//       // create Leaflet control for the slider
//       const sliderControl = L.control({
//         position: 'bottomleft'
//       });
  
//       sliderControl.onAdd = function () {
  
//         const controls = L.DomUtil.get("slider");
  
//         L.DomEvent.disableScrollPropagation(controls);
//         L.DomEvent.disableClickPropagation(controls);
  
//         return controls;
  
//       }
  
//       sliderControl.addTo(map);
  
//       // update the grade level output
//       const grade = document.querySelector("#grade-level span");
//       grade.innerHTML = "Grade 1";
  
//       //select the slider's input and listen for change
//       const slider = document.querySelector("#slider input");
//       //select the slider's input and listen for change
//       slider.addEventListener("input", function (e) {
//         // current value of slider is current grade level
//         var currentGrade = e.target.value;
  
//         // updateGradeLevel(currentGrade);
//         grade.innerHTML = "Grade " + currentGrade;
  
//         // resize the circles with updated grade level
//         resizeCircles(girlsLayer, boysLayer, currentGrade);
  
//       });
//     } // end sequenceUI()
  
//     function getColor(x) {
//       // Access the fourth stylesheet referenced in the HTML head element
//       const stylesheet = document.styleSheets[3];
//       const colors = [];
  
//       // Loop through the rules in the stylesheet
//       for (let i of stylesheet.cssRules) {
//         // When we find girls, add it's color to an array
//         if (i.selectorText === ".girls") {
//           colors[0] = i.style.backgroundColor;
//         }
//         if (i.selectorText === ".boys") {
//           colors[1] = i.style.backgroundColor;
//         }
//       }
  
//       // If function was given 'girls' return that color
//       if (x == "girls") {
//         return colors[0];
//       } else {
//         return colors[1];
//       }
//     } // end getColor()
  
//     function resizeCircles(girlsLayer, boysLayer, currentGrade) {
//       girlsLayer.eachLayer(function (layer) {
//         const radius = calcRadius(
//           Number(layer.feature.properties["G" + currentGrade])
//         );
//         layer.setRadius(radius);
//       });
//       boysLayer.eachLayer(function (layer) {
//         const radius = calcRadius(
//           Number(layer.feature.properties["B" + currentGrade])
//         );
//         layer.setRadius(radius);
//       });
//       // update the hover window with current grade's
//       retrieveInfo(boysLayer, currentGrade);
//     } //end resizeCircles()
  
//     function calcRadius(val) {
//       const radius = Math.sqrt(val / Math.PI);
//       return radius * 0.5; // adjust .5 as a scale factor
//     }
  
//     function drawLegend(data) {
  
//       // empty array to hold values
//       const dataValues = [];
  
//       // loop through all features (i.e., the schools)
//       data.features.forEach(function (school) {
//         // for each grade in a school
//         for (let grade in school.properties) {
//           // shorthand to each value
//           const value = school.properties[grade];
//           // if the value can be converted to a number
//           // the + operator in front of a number returns a number
//           if (+value) {
//             //return the value to the array
//             dataValues.push(+value);
//           }
//         }
//       });
  
//       // sort our array
//       const sortedValues = dataValues.sort(function (a, b) {
//         return b - a;
//       });
  
//       // round the highest number and use as our large circle diameter
//       const maxValue = Math.round(sortedValues[0] / 1000) * 1000;
  
//       // calc the diameters
//       const largeDiameter = calcRadius(maxValue) * 2,
//         smallDiameter = largeDiameter / 2;
  
//       // create a function with a short name to select elements
//       const $ = function (x) {
//         return document.querySelector(x);
//       };
  
//       // select spans and set background color and font color
//       $(".leaflet-legend .girls").style.color = getColor("girls");
//       $(".leaflet-legend .girls").style.backgroundColor = "#333";
//       $(".leaflet-legend .boys").style.color = getColor("boys");
//       $(".leaflet-legend .boys").style.backgroundColor = "#333";
  
//       // select our circles container and set the height
//       $(".legend-circles").style.height = `${largeDiameter.toFixed()}px`;
  
//       // set width and height for large circle
//       $(".legend-large").style.width = `${largeDiameter.toFixed()}px`;
//       $(".legend-large").style.height = `${largeDiameter.toFixed()}px`;
  
//       // set width and height for small circle and position
//       $(".legend-small").style.width = `${smallDiameter.toFixed()}px`;
//       $(".legend-small").style.height = `${smallDiameter.toFixed()}px`;
//       $(".legend-small").style.top = `${largeDiameter - smallDiameter - 2}px`;
//       $(".legend-small").style.left = `${smallDiameter / 2}px`;
  
//       // label the max and half values
//       $(".legend-large-label").innerHTML = `${maxValue.toLocaleString()}`;
//       $(".legend-small-label").innerHTML = (maxValue / 2).toLocaleString();
  
//       // adjust the position of the label based on size of circle
//       $(".legend-large-label").style.top = `${-11}px`;
//       $(".legend-large-label").style.left = `${largeDiameter + 30}px`;
  
//       // adjust the position of the label based on size of circle
//       $(".legend-small-label").style.top = `${smallDiameter - 13}px`;
//       $(".legend-small-label").style.left = `${largeDiameter + 30}px`;
  
//       // insert a couple hr elements and use to connect value label to top of each circle
//       $("hr.small").style.top = `${largeDiameter - smallDiameter - 10}px`;
  
//       // create Leaflet control for the legend
//       const legendControl = L.control({
//         position: 'bottomright'
//       });
  
//       legendControl.onAdd = function () {
  
//         const legend = L.DomUtil.get("legend");
  
//         L.DomEvent.disableScrollPropagation(legend);
//         L.DomEvent.disableClickPropagation(legend);
  
//         return legend;
  
//       }
  
//       legendControl.addTo(map);
//     } // end drawLegend()
  
//     function retrieveInfo(boysLayer, currentGrade) {
//       // select the element and reference with variable
//       const info = document.querySelector("#info");
  
//       // since boysLayer is on top, use to detect mouseover events
//       boysLayer.on("mouseover", function (e) {
//         // replace the the display property with block and show
//         info.style.display = "block";
  
//         // access properties of target layer
//         const props = e.layer.feature.properties;
  
//         // create a function with a short name to select elements
//         const $ = function (x) {
//           return document.querySelector(x);
//         };
  
//         // populate HTML elements with relevant info
//         $("#info span").innerHTML = props.COUNTY;
//         $(".girls span:first-child").innerHTML = `(grade ${currentGrade})`;
//         $(".boys span:first-child").innerHTML = `(grade ${currentGrade})`;
//         $(".girls span:last-child").innerHTML = Number(
//           props[`G${currentGrade}`]
//         ).toLocaleString();
//         $(".boys span:last-child").innerHTML = Number(
//           props[`B${currentGrade}`]
//         ).toLocaleString();
  
//         // raise opacity level as visual affordance
//         e.layer.setStyle({
//           fillColor: "white",
//           fillOpacity: 0.2,
  
//         });
  
//         // empty arrays for boys and girls values
//         const girlsValues = [],
//           boysValues = [];
  
//         // loop through the grade levels and push values into those arrays
//         for (let i = 1; i <= 8; i++) {
//           girlsValues.push(props["G" + i]);
//           boysValues.push(props["B" + i]);
//         }
//         const girlsOptions = {
//           id: "girlspark",
//           width: 280, // No need for units; D3 will use pixels.
//           height: 50,
//           color: getColor("girls"),
//           lineWidth: 3,
//         };
  
//         const boysOptions = {
//           id: "boyspark",
//           width: 280,
//           height: 50,
//           color: getColor("boys"),
//           lineWidth: 3,
//         };
  
//         sparkLine(girlsValues, girlsOptions, currentGrade);
//         sparkLine(boysValues, boysOptions, currentGrade);
//       });
//       // hide the info panel when mousing off layergroup and remove affordance opacity
//       boysLayer.on("mouseout", function (e) {
//         // hide the info panel
//         info.style.display = "none";
  
//         // reset the layer style
//         e.layer.setStyle({
//           fillOpacity: 0,
//         });
//       });
//       // when the mouse moves on the document
//       document.addEventListener("mousemove", function (e) {
//         // If the page is on the small screen, calculate the position of the info window
//         if (window.innerWidth < 768) {
//           info.style.right = "10px";
//           info.style.top = `${window.innerHeight * 0.25 + 5}px`;
//         } else {
//           // Console the page coordinates to understand positioning
//           // console.log(e.pageX, e.pageY);
  
//           // offset info window position from the mouse position
//           (info.style.left = `${e.pageX + 6}px`),
//             (info.style.top = `${e.pageY - info.offsetHeight - 25}px`);
  
//           // if it crashes into the right, flip it to the left
//           if (e.pageX + info.offsetWidth > window.innerWidth) {
//             info.style.left = `${e.pageX - info.offsetWidth - 6}px`;
//           }
//           // if it crashes into the top, flip it lower right
//           if (e.pageY - info.offsetHeight - 25 < 0) {
//             info.style.top = `${e.pageY + 6}px`;
//           }
//         }
//       });
//     }
  
//     function sparkLine(data, options, currentGrade) {
//       d3.select(`#${options.id} svg`).remove();
  
//       const w = options.width,
//         h = options.height,
//         m = {
//           top: 5,
//           right: 5,
//           bottom: 5,
//           left: 5,
//         },
//         iw = w - m.left - m.right,
//         ih = h - m.top - m.bottom,
//         x = d3.scaleLinear().domain([0, data.length]).range([0, iw]),
//         y = d3
//           .scaleLinear()
//           .domain([d3.min(data), d3.max(data)])
//           .range([ih, 0]);
  
//       const svg = d3
//         .select(`#${options.id}`)
//         .append("svg")
//         .attr("width", w)
//         .attr("height", h)
//         .append("g")
//         .attr("transform", `translate(${m.left},${m.top})`);
  
//       const line = d3
//         .line()
//         .x((d, i) => x(i))
//         .y((d) => y(d));
  
//       const area = d3
//         .area()
//         .x((d, i) => x(i))
//         .y0(d3.min(data))
//         .y1((d) => y(d));
  
//       svg
//         .append("path")
//         .datum(data)
//         .attr("stroke-width", 0)
//         .attr("fill", options.color)
//         .attr("opacity", 0.5)
//         .attr("d", area);
  
//       svg
//         .append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", options.color)
//         .attr("stroke-width", options.lineWidth)
//         .attr("d", line);
  
//       svg
//         .append("circle")
//         .attr("cx", x(Number(currentGrade) - 1))
//         .attr("cy", y(data[Number(currentGrade) - 1]))
//         .attr("r", "4px")
//         .attr("fill", "white")
//         .attr("stroke", options.color)
//         .attr("stroke-width", options.lineWidth / 2);
//     }
  
  
//   })();