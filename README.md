# Patterns of Mass Shootings in the US
## A Data-Driven Approach to Understanding the Impacts of Gun Laws and Gun Ownership on Mass Shooting Incidents 
## TOC
- [Data Sources](#Data-Sources)
    - [Gun Law Data](#Gun-Law-Data)
    - [Gun Ownership Data](#Gun-Ownership-Data)
    - [Mass Shooting Data](#Mass-Shooting-Data)
    - [Supplement Data](#Supplement-Data)
- [Topic and Geographic Phenomena The Map Will explore](#Topic-and-geographic-phenomena-the-map-will-explore)
- [Map Objectives and User Needs](#Map-objectives-and-user-needs)
- [The Technology Stack](#The-technology-stack)

>My deepest sympathy goes out to the families of those slain in these senseless tragedies. I'm saddened to consider this subject as regularly as I have been for the sake of this project. And I am slack-jawed to see just how out of date the content has become just in the brief time I've been working on it 😢
>
Though it is a sorrowful subject to apply oneself to, a consideration of the data on the matter may lead to insights that could prevent such crimes in the future. Data analysis and visualization of this sort could have a direct utility in informing public opinion of legislative measures on gun control. 
>
>While the data can be usefully visualized and has its merit, there is no doubt that the regular exposure to this subject in the media takes a toll on all of us.
>
> Thank you

## Data Sources ✅ 
[^](#TOC)

### Gun Law Data ✅ 
I found a directory of perfectly relevant data at [Gifford's Law Center](https://giffords.org/lawcenter/gun-laws/browse-state-gun-laws/?filter0=,264). Although the group has a detailed repository of a number of very relevant laws by state, the data is not conglomerated and would require building a web scraper, which sounds fun but I don't know if I have time given my limited experience with web scraping.

However, barring finding an appropriate dataset, I may just choose one key law and tabulate the data by hand for the 50 states. Possibilities include:
- background check laws
- waiting period laws

~~I'm still searching for more suitable data~~
___
### Gun Ownership Data ✅ 

Graphic two: "Household Gun Ownership in the United States, 1973 TO 2021" on page 2 of the Violence Policy Center's report entitled [Gun Ownership in America: 1973 to 2021](https://www.vpc.org/studies/ownership.pdf) contains data that I can use to generate a graph of US gun ownership levels for the supplemental section of my webpage (as shown in my mockup). Unfortunately It's not broken down by states so I cannot visualize this data on the map in the way I'd anticipated.

~~I'm still searching for more suitable data. Ideally data which is broken down by state over time.~~

UPDATE: I came across a [great data source from the Rand Corporation](https://www.rand.org/pubs/tools/TL354.html) that will satisfy my needs for gun law data and gun ownership data in one fell swoop! The [CSV database (local file)](data/TL-354-State-Level%20Estimates%20of%20Household%20Firearm%20Ownership.csv) is entitled *"State-Level Estimates of Household Firearm Ownership"* yet also contains data on background check laws and permit to purchase laws. And it's all by state and by year from 1980 to 2015 🙌 
___
### Mass Shooting Data ✅ 

Initially I was certain that I could easily gather data for this subject, but I actually had trouble finding anything comprehensive until just last week.

The Violence Policy Center has a [pdf of shootings involving 'large capacity ammunition magazines'](https://vpc.org/fact_sht/VPCshootinglist.pdf). Useful but not as comprehensive as I'd like. And I dread parsing a pdf.

I found data from the [Gun Violence Archive](https://www.gunviolencearchive.org/reports) on mass shootings. In my opinion their definition for what constitutes a mass shooting (*"shooting incidents in which four or more people are shot"*) is not culturally accurate, i.e. the average person wouldn't consider all situations that fell within those parameters to be mass shootings. Using their definition, they claim there were 648 mass shootings in the US in 2022 alone. Tragedies no doubt, and worthy of reporting on and preventing, but not mass shootings each and every one. 

Also, the database only runs from 2014 to the present and has much fewer variables than other data I've come across. The data is also not geocoded and would require manually joining several CSVs, all in all making this poor data for my needs. I've stored a report [locally if you'd like to see their dataset](data/GVA-mass-shooting-database.csv).

![A Screenshot of the homepage of The Violence Project's website](graphics/violence-project-homepage.png)


 Luckily I found extremely suitable data through [The Violence Project (TVP)](https://www.theviolenceproject.org/) - though not directly. While their database is undoubtedly just that, it's presented (appropriately enough) through [visualizations](https://www.theviolenceproject.org/mass-shooter-database/) on their website.

![A Screenshot of the visualizations on The Violence Project's website](graphics/violence-project-map.png)


 May I add, they're very impressive visualizations at that - something to aspire to! [They](https://www.theviolenceproject.org/about-us/people/) produced the database in-house.
 
 Nonetheless, I need the *raw data* for my own visualizations! I searched through their site but failed to find a repository of the data in its raw form. 
 
 Luckily they have a [contact form](https://www.theviolenceproject.org/contact-us/) for folks to request the full data set in excel. ~~I submitted a request but am still awaiting a response.~~
___

In the meantime I poked around the site inspecting the html with no luck. I navigated away from their site when I clicked on a link to a [VOA (Voice of America) Special Report](https://projects.voanews.com/mass-shootings/). The report uses the data from TVP to make visualizations.

On that site I hit pay dirt when I found a script containing two variables holding JSON's that contain very clean, detailed data for all of the shootings as well as the shooters from 1966 to 2021! 👇 

![A screenshot of the data found on the VOA website](graphics/raw-json.png "18,748 lines! 😮")

You can view the data [here (local JS file)](data/violence-project-data.js)!

Though the content is lamentable, the quality and format of the data is perfect. There's so much that can be done with it. It will certainly satisfy the needs for my project.

> ##### **Note**: This is copyrighted data. Since TVP requires a request to share the data, I presume that the ease of access to the raw data over at VOA may have been an oversight. I let them know about this - but I'm still going to use it for my assignment 😉

> ##### ~~I'm certainly not going to use it commercially and if I decide to include it in my portfolio I will only make that public after receiving the official data I requested from them.~~

UPDATE: The violence Project got back to me via email with a link to [the official data (CSV)](https://dfjbiei.r.af.d.sendibt2.com/tr/cl/62k-xUjYRP-l-B52EEFHKtvQsPn7jGU7TvV79n-RYyGDhyrmzGaZc5iqiHWGBebdzWtPl5taTvAn1M989uhtmsD-oT1BIiUsJYCxqRvIbKdA_GrIQgOPLsECxjQw1IDaW2CkkSy5IUU_f6UFgKQYPgR3eMAJAY8GKjjz_Y_hFJKabM860N9tLA9p9mdDH-ZorKu8xiNoVjoT1tYgQU9IDRatGL9h3pb2GxniuFkeRvF6Xr94X_5nZbLFZLThlTBPwIiVz_hDKqctsDJwN9Ru4Y9SCtaaj778_1YTmOgvvr2nkXEaUjmqknWeyvH4PP34OtqEm-fmYi7dMyD416QNo45BGW0QvudSUaaZ1MQarcBhCBASYRAXfsbhvqVZrIEHoeV_)! After reviewing it I see that the data I captured from the console is already well formatted to my needs (though the CSV is most up-to-date and most human-understandable). [Local CSV](data/Violence%20Project%20Mass%20Shooter%20Database%20-%20Version%206.1.csv)

### Supplement Data ✅ 

In my hunt for gun law and gun ownership data I've come across data that I want to include in the supplement modal of my project. 

- [This resource at the CDC](https://www.cdc.gov/nchs/pressroom/sosmap/firearm_mortality/firearm.htm) that shows firearm mortality for each state by year (2005-2021). I'm considering adding this as a supplemental web map within the modal. The information is relevant, though I don't want to run the risk of busying my project. [Direct data download (CSV)](blob:https://www.cdc.gov/296d6b38-39ad-4d32-9ddc-b88467ea3bcc)
![Screenshot of firearm mortality data at the CDC website](graphics/cdc-firearm-mortality-data.png)
- [This data from Gallup](https://news.gallup.com/poll/1645/guns.aspx) on public satisfaction with US gun policy over time could prove a useful line graph showing changes in public opinion
![Screenshot of Gallup poll results of public satisfaction with US gun policy](graphics/gallup-satisfaction-data.png)
___

## Topic and Geographic Phenomena The Map Will Explore
[^](#TOC)
___
### What?
My intent is to...
- Offer the opportunity to visualize potential patterns in the data
- Build awareness of increases in mass shootings over time
- Provide a reference to the history of gun ownership as well as gun laws in the viewer's area of interest
- Explore any potential correlation between shootings and gun ownership/gun laws

...as well as to...

- Refrain from giving strong opinions
- Refrain from leading my audience
- Refrain from compromising data integrity for the sake of a tidy message

___
### Where?
I'm mapping the US. Easy enough. I haven't explored the data enough to see if it includes incidents from non-state administrative units. If it does, I will be mapping those as well.
___
### When?
The shooting data runs from 1966-2021. I will likely be visualizing this entire range in my map unless I can not find matching gun law and gun ownership data from the same period and want to make the map cohesive.
___
### Tentative Titles

- **Title:** "Guns, Laws, and Lives: A Geospatial Perspective on Mass Shootings"<br>
**Subtitle:** "Investigating the Geographic Patterns and Relationships Between Gun Laws, Gun Ownership, and Mass Shooting Incidents"

- **Title:** "Shots Fired: Mapping the Patterns of Mass Shootings in the US"<br>
**Subtitle:** "A Data-Driven Approach to Understanding the Impacts of Gun Laws and Gun Ownership on Mass Shooting Incidents"

- **Title:** "Trigger Happy Nation? A Geospatial Foray into Mass Shootings"<br>
**Subtitle:** "Mapping the Foggy Relationships Between Gun Laws, Gun Ownership, and Violent Incidents in the United States"

- **Title:** "Bulletproof Data: A Cartographic Quest for Mass Shooting Patterns"<br>
**Subtitle:** "A Deeper Look at the Links Between Gun Laws, Gun Ownership, and Mass Shootings Across America"

> Full disclosure: I used chatGPT for generating and brainstorming title ideas. It came in handy. The titles above are an amalgamation of my ideas and input, the AI's output, and my subsequent editing of that output. I'm admittedly not a marketer at heart!

I will be using prop symbols for visualizing shooting incidents and choropleth layers for visualizing gun laws as well as gun ownership rates. I may use an icon for calling out a handful of featured incidents.

![Desktop mockup of the webmap](graphics/mockup.png)

The user will land on the page and be presented with a web map already populated with mass shooting data. It will be cycling through the years and new shootings will appear and their color will fade as the year advances (though all will still be visible at the maximum end of the year range).

Supplemental text (with accompanying graphs) will be available via a button which opens a modal.

![Mobile mockup of the webmap](graphics/mobile-mockup.png)

The state layer will be cycling through the rate of gun ownership as the year advances. the user can toggle between this and the gun law data. The user can pause or play, as well as select a given year, at anytime via the UI slider.

Affordances will alert the user that the featured shootings are dynamic. When the user clicks or taps on one, a popup or info box will be displayed with supplemental information.

## Map Objectives and User Needs
[^](#TOC)

### This map needs to be made because I need to learn how to make maps well...
...and this is a great opportunity for that. Not only am I learning the technical aspects of web map programming, but perhaps more importantly I am learning web map design and design in general. 

- I have no expertise in the content area. So **I don't have a particular claim to making this map.** I think we all have an interest in this issue as concerned Americans in public spaces. That is my only claim to appropriate the position of a designer of such a map.

- As far as outside parties are concerned, **I'm not sure that the map needs to be made**. It's hard for me to tell how derivative it is from my perspective. Of course something doesn't need to be (nor can it totally be) original to have merit. 

**I think my particular combination** of the data (shootings, laws, and ownership) **is original**, especially with the temporal aspect included. **I** do genuinely **believe that insights can be made** once the data is all together and visualized.

>I anticipate my map being a tool **for the general public** which will inform themselves about the patterns that they see in their areas of interest. 
>
>It's possible that it could be a useful model for those who want to take the examination of the data to a larger scale, or those who may want to make the same analysis but with an alternative law or other alternative but related data.
___
## The Technology Stack
[^](#TOC)

### The Data
- JSON data (shooting data)
- CSV (gun ownership data, gun laws data)
- geoJSON (state polygons)
- Leaflet tiles

### The Tools
- web browser
- VS Code IDE

### The Packages
- Leaflet
- chroma.js
- Google fonts
