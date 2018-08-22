references

Jquery
<script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

D3
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js"></script>
Crossfilter
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.12/crossfilter.min.js"></script>
DC
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/dc/2.1.8/dc.min.js"></script>
<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dc/2.1.8/dc.min.css" />
Queue
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/queue-async/1.0.7/queue.min.js"></script>

BootStrap
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

Font Awesome
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">

google fonts
<link href="https://fonts.googleapis.com/css?family=Titillium+Web" rel="stylesheet">

github image:
https://pixabay.com/en/logo-icon-github-2582757/

The database for the crime statistices used was obtained from the South Australia Government website
licensed under a Creative Commons Attribution 4.0 License. © Copyright 2018 
https://creativecommons.org/licenses/by/4.0/legalcode#s3a1
https://creativecommons.org/licenses/by/4.0/
https://data.sa.gov.au/copyright

South Australia Police, Government of South Australia, Crime statistics 2017-18 Q1 - Q3, Sourced on 16 August 2018
https://data.sa.gov.au/data/dataset/860126f7-eeb5-4fbc-be44-069aa0467d11/resource/bf604730-9ec8-44dd-88a3-f024b387e0e4/download/crime-statistics-2017-18-q1-q3.xlsx

I have used this dataset in a csv format and the only changes made was to the headings in line 1  

from:
Reported Date	Suburb - Incident	Postcode - Incident	Offence Level 1  Description	Offence Level 2 Description	Offence Level 3 Description	Offence Count

to:date,SuburbIncident,PostcodeIncident,offenceDescription1,offenceDescription2,offenceDescription3,OffenceCount



reset button
"javascript:chart.filterAll();dc.redrawAll();" found from
https://stackoverflow.com/questions/21550270/dc-js-unable-to-redraw-charts