queue()
    .defer(d3.csv, "crime-statistics.csv")
    .await(makeGraphs);

function makeGraphs(error, offenceData) {

    var ndx = crossfilter(offenceData);


    var parseDate = d3.time.format("%d/%m/%Y").parse; // parsing the date key from text to a time in day, month and year.

    offenceData.forEach(function(d) {
        d.OffenceCount = parseInt(d.OffenceCount); // parsing the offence count key from text to a number.
        d.date = parseDate(d.date);
        d.PostcodeIncident = parseInt(d.PostcodeIncident); // parsing the postcode key from text into a number.
    });


    suburb_selector(ndx);
    offenceCount(ndx);
    offence_level_1(ndx);
    offence_level_2(ndx);
    offence_level_3(ndx);
    count_per_suburb(ndx);
    Top_ten(ndx);
    offences_time_linechart(ndx);
    offences_time_barchart(ndx);
    percentage_of_offences(ndx, "Fri", "#percentFri");
    percentage_of_offences(ndx, "Mon", "#percentMon");
    percentage_of_offences(ndx, "Sat", "#percentSat");
    percentage_of_offences(ndx, "Sun", "#percentSun");
    percentage_of_offences(ndx, "Thu", "#percentThu");
    percentage_of_offences(ndx, "Tue", "#percentTue");
    percentage_of_offences(ndx, "Wed", "#percentWed");

    dc.renderAll();

    setTimeout(function() { // Once the charts are fully loaded the loading screen will disappear. 
        document.getElementById("load_screen").style.display = "none"
    }, 1000);

}


/*---------------------#1 Suburb Selector--------------------------------------------------------------------------------------------------------------*/

function suburb_selector(ndx) {

    var dim = ndx.dimension(dc.pluck('SuburbIncident'));
    var group = dim.group();

    dc.selectMenu("#suburb-selector-1")
        .dimension(dim)
        .group(group)
        .promptText('All suburbs')

}

/*---------------------#1 Suburb Selector--------------------------------------------------------------------------------------------------------------*/

/*---------------------#2 Number Display Total Offences-------------------------------------------------------------------------------*/
function offenceCount(ndx) {

    var offenceCount = ndx.groupAll().reduce(

        function(p, v) {
            if (v.OffenceCount > 0) {
                p.total += v.OffenceCount;
            }

            return p;
        },
        function(p, v) {
            if (v.OffenceCount > 0) {
                p.total -= v.OffenceCount;
            }

            return p;
        },

        function() {
            return { total: 0 };
        }

    );

    dc.numberDisplay("#offence-count-2")

        .transitionDuration(2500)
        .group(offenceCount)
        .formatNumber(d3.format("f"))

        .valueAccessor(function(d) { return d.total; });


}

/*---------------------#2 Number Display Total Offences-------------------------------------------------------------------------------*/


/*---------------------#3 pie Chart offence number to property or person-------------------------------------------------------------------------------*/

function offence_level_1(ndx) {
    var dim = ndx.dimension(dc.pluck('offenceDescription1'));

    var property_or_person = dim.group().reduce(

        function(p, v) {
            if (v.offenceDescription1 === "OFFENCES AGAINST THE PERSON" || v.offenceDescription1 === "OFFENCES AGAINST PROPERTY") {
                p.total += v.OffenceCount;
            }
            return p;
        },
        function(p, v) {
            if (v.offenceDescription1 === "OFFENCES AGAINST THE PERSON" || v.offenceDescription1 === "OFFENCES AGAINST PROPERTY") {
                p.total -= v.OffenceCount;
            }
            return p;
        },
        function() {
            return { total: 0 };
        }
    );

    dc.pieChart("#pie-chart-3")

        .dimension(dim)
        .group(property_or_person)
        .title(function(d) { return ((d.value.total / 76997) * 100).toFixed(2) + "% - " + d.value.total + " Reported Offences"; })
        .radius(200)
        .height(220)
        .width(350)
        .innerRadius(20)

        .transitionDuration(1700)
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return (d.value.total);
            }
            else {
                return 0;
            }
        });

    /*.legend(dc.legend().x(0).y(20).itemHeight(15).gap(5))*/
}

/*---------------------#3 pie Chart offence number to property or person-------------------------------------------------------------------------------*/

/*---------------------#4 Pie Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/

function offence_level_2(ndx) {
    var dim = ndx.dimension(dc.pluck("offenceDescription2"));

    var total_offence_to_description2 = dim.group().reduce(
        function(p, v) {
            p.total += v.OffenceCount;
            return p;
        },
        function(p, v) {
            p.total -= v.OffenceCount;

            return p;
        },
        function() {
            return { total: 0 };
        }
    );
     
    dc.pieChart("#piechart-4")
        .dimension(dim)
        .group(total_offence_to_description2)

        .innerRadius(20)
        .radius(200)
        .height(220)
        .width(370)

        .transitionDuration(1700)
        .title(function(d) { return d.key + " " + ((d.value.total / 8) / 100).toFixed(2) + "% - " + d.value.total + " Reported Offences"; })
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return d.value.total;
            }
            else {
                return 0;
            }
        });
        
        dc.pieChart("#test")
        .dimension(dim)
        .group(total_offence_to_description2)
        
        
        
        .legend(dc.legend().x(0).y(0).itemHeight(15).gap(5));


}


/*---------------------#4 Pie Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/


/*---------------------#5 Bar Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/
function offence_level_3(ndx) {
    var type_of_offence = ndx.dimension(dc.pluck('offenceDescription3'));
    var offence_count = type_of_offence.group().reduceSum(dc.pluck("OffenceCount"));


    dc.barChart("#bar-chart-5")

        .dimension(type_of_offence)
        .group(offence_count)

        .width(800)
        .height(380)
        .margins({
            top: 10,
            right: 50,
            bottom: 200,
            left: 90
        })
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .elasticY(true)
        .transitionDuration(1700)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .yAxisLabel("Offence Count")
        .xAxisLabel("Offences")
        .title(function(d) { return ((d.value / 76997) * 100).toFixed(2) + "% - " + d.value + " Reported Offences" + " by: " + d.key; })
        .yAxis().ticks(10);
}

/*---------------------#5 Bar Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/

/*---------------------#6 row chart--------------------------------------------------------------------------------*/
function Top_ten(ndx) {
    var dim = ndx.dimension(dc.pluck("SuburbIncident"));
    var group = dim.group().reduceSum(dc.pluck("OffenceCount"));

    dc.rowChart("#row-chart-6")
        .dimension(dim)
        .group(group)

        .width(400)
        .height(380)
        .transitionDuration(1700)
        .elasticX(true)
        .cap(10)
        .gap(0)
        .title(function(d) { return d.key; })
        .othersGrouper(false)
}
/*---------------------#6 row chart--------------------------------------------------------------------------------*/
/*---------------------#7 Bar Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/
function count_per_suburb(ndx) {
    var type_of_offence = ndx.dimension(dc.pluck('SuburbIncident'));
    var offence_count = type_of_offence.group().reduceSum(dc.pluck("OffenceCount"));


    dc.barChart("#bar-chart-7")

        .dimension(type_of_offence)
        .group(offence_count)
        .margins({ top: 10, right: 50, bottom: 120, left: 50 })
        .width(18000)
        .height(400)
        .elasticY(false)
        .title(function(d) { return ((d.value / 76997) * 100).toFixed(2) + "% - " + d.value + " Reported Offences in " + d.key; })
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .transitionDuration(1700)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .y(d3.scale.linear().domain([0, 800]))
        .yAxisLabel("Total reported offences")
        .gap(0)
        .yAxis().ticks(10);
}

/*---------------------#7 Bar Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/
/*---------------------#8 line Chart Offences over the year--------------------------------------------------------------------------------*/
function offences_time_linechart(ndx) {

    var dateDim = ndx.dimension(dc.pluck("date"));
    var offences_over_2018 = dateDim.group().reduceSum(dc.pluck("OffenceCount"));

    var timeFormat = d3.time.format("%a/%e/%b/%Y");


    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    dc.lineChart("#line-chart-8")
        .dimension(dateDim)
        .group(offences_over_2018)

        .width(1100)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 50, left: 50 })
        .mouseZoomable(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .brushOn(false)
        .renderTitle(true)
        .title(function(d) { return timeFormat(d.key) + " - " + d.value + " reported offences"; })
        .dotRadius(10)
        .renderArea(false)
        .transitionDuration(1500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xAxisLabel("Date from march 2017 to July 2018")
        .yAxisLabel("Offence Count")
        .elasticY(true)
        .renderDataPoints(true)
        .yAxis().ticks(10);

}
/*---------------------#8 line Chart Offences over the year--------------------------------------------------------------------------------*/
/*---------------------#9 bar Chart Offences over the year--------------------------------------------------------------------------------*/

function offences_time_barchart(ndx) {

    var dateDim = ndx.dimension(dc.pluck("date"));
    var offences_over_2018 = dateDim.group().reduceSum(dc.pluck("OffenceCount"));

    var timeFormat = d3.time.format("%a/%e/%b/%Y");
    var dayFormat = d3.time.format("%a");
    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    dc.barChart("#bar-chart-9")
        .dimension(dateDim)
        .group(offences_over_2018)

        .width(900)
        .height(400)
        .margins({ top: 10, right: 0, bottom: 50, left: 50 })
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .mouseZoomable(true)
        .brushOn(false)
        .title(function(d) { return timeFormat(d.key) + " - " + d.value + " reported offences"; })
        .renderTitle(true)
        .transitionDuration(1500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .gap(-3)
        .xAxisLabel("Date from march 2017 to July 2018")
        .yAxisLabel("Offence Count")

        .colors(d3.scale.ordinal().domain(["MondayColor", "tuesdayColor", "wednesdayColor", "thursdayColor", "fridayColor", "saturdayColor", "sundayColor"])
            .range(["blue", "red", "green", "purple", "black", "brown", "orange"]))

        .colorAccessor(function(d) { // If the date is equal to a particular day than that day will be that color.
            if (dayFormat(d.key) === "Mon") {
                return "mondayColor";
            }
            if (dayFormat(d.key) === "Tue") {
                return "tuesdayColor";
            }
            if (dayFormat(d.key) === "Wed") {
                return "wednesdayColor";
            }
            if (dayFormat(d.key) === "Thu") {
                return "thursdayColor";
            }
            if (dayFormat(d.key) === "Fri") {
                return "fridayColor";
            }
            if (dayFormat(d.key) === "Sat") {
                return "saturdayColor";
            }
            else {
                return "sundayColor";
            }
        })
        .yAxis().ticks(10);
}

/*---------------------#9 bar Chart Offences over the year--------------------------------------------------------------------------------*/

/*---------------------#10 percent--------------------------------------------------------------------------------*/
function percentage_of_offences(ndx, day, dayOfPercentage) {

    var dayFormat = d3.time.format("%a");
    var percentage = ndx.groupAll().reduce(

        function(p, v) {
            p.totalOffenceCount += v.OffenceCount; // Add all the offence count values to totalOffenceCount
            if (dayFormat(v.date) === day) { // If the date is a particular day
                p.dayOffenceCount += v.OffenceCount; //then add that days offence count values to dayOffenceCount
            }
            return p;
        },
        function(p, v) {
            p.totalOffenceCount -= v.OffenceCount;
            if (dayFormat(v.date) === day) {
                p.dayOffenceCount -= v.OffenceCount;

            }
            return p;
        },
        function() {
            return { totalOffenceCount: 0, dayOffenceCount: 0 };
        }
    );

    dc.numberDisplay(dayOfPercentage)

        .group(percentage)

        .transitionDuration(2000)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function(d) {
            if (d.totalOffenceCount == 0) { //If the count is 0 than return no value
                return 0;
            }
            else {
                return (d.dayOffenceCount / d.totalOffenceCount); //return the day offence count divided by the total of all the offence counts
            }
        });

}
/*---------------------#10 percent--------------------------------------------------------------------------------*/







/*

function average(ndx) {
    var dim = ndx.dimension(dc.pluck('offenceDescription3'));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.OffenceCount;
        p.average = p.total / p.count;
        return p;
    }
    function remove_item(p, v) {
        p.count--;
        if(p.count == 0) {
            p.total = 0;
        p.average = 0;
        
        }else {
            p.total -= v.OffenceCount;
            p.average = p.total / p.count;
        }
        return p;
    }
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }
    
    var test = dim.group().reduceSum(dc.pluck("OffenceCount"));
    var percent_of_each_offence_type = dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#chart-here8")
    
        .dimension(type_of_offence)
        .group(percent_of_each_offence_type)
        .valueAccessor(function(d) {
            return d.value.average.toFixed(2);
        })
        
        .width(1200)
        .height(600)
        .margins({
            top: 10,
            right: 50,
            bottom: 200,
            left: 50
        })
        .elasticY(true)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .yAxisLabel("How many times Offence was commited")
        .xAxisLabel("Offence")
        .yAxis().ticks(20);
    
}
*/



/*.y(d3.scale.linear().domain([0, 1500]))*/




/*
function percentage_of_offences(ndx) {
    var percentage = ndx.groupAll().reduce(
        function(p, v) {
            p.total++;
            if (v.offenceDescription3 === "Other property damage and environmental") {
                p.offence1Count+= v.OffenceCount;
            }
            return p;
        },
        function(p, v) {
            p.total--;
            if(v.offenceDescription3 === "Other property damage and environmental") {
                p.offence1Count-= v.OffenceCount;
                
            }
            return p;
        },
        function() {
            return {total: 0, offence1Count: 0}
        }
    )
    
    dc.numberDisplay("#test")
    .formatNumber(d3.format(".2%"))
    .valueAccessor(function(d) {
        if (d.count == 0 ) {
            return 0;
        } else {
            return (d.offence1Count / 25  ) / 10000
        }
    })
    .group(percentage);
}

*/
/*---------------------#5 Stack Chart offence description 2 compared to whether against a person or property---------------------------------------------

function offence_to_property_or_person(ndx) {

    function offenceToPropertyOrPerson(dimension, rank) {
        return dimension.group().reduce(

            function(p, v) {
                p.total++;
                if (v.offenceDescription2 == rank) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.offenceDescription2 == rank) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );
    }
    var dim = ndx.dimension(dc.pluck("offenceDescription1"));
    var offence1 = offenceToPropertyOrPerson(dim, "THEFT AND RELATED OFFENCES");
    var offence2 = offenceToPropertyOrPerson(dim, "ACTS INTENDED TO CAUSE INJURY");
    var offence3 = offenceToPropertyOrPerson(dim, "FRAUD DECEPTION AND RELATED OFFENCES");
    var offence4 = offenceToPropertyOrPerson(dim, "PROPERTY DAMAGE AND ENVIRONMENTAL");
    var offence5 = offenceToPropertyOrPerson(dim, "SERIOUS CRIMINAL TRESPASS");
    var offence6 = offenceToPropertyOrPerson(dim, "HOMICIDE AND RELATED OFFENCES");
    var offence7 = offenceToPropertyOrPerson(dim, "OTHER OFFENCES AGAINST THE PERSON");
    var offence8 = offenceToPropertyOrPerson(dim, "ROBBERY AND RELATED OFFENCES");

    dc.barChart("#stack-chart-4")

        .dimension(dim)
        .group(offence1, "THEFT AND RELATED OFFENCES")
        .stack(offence2, "ACTS INTENDED TO CAUSE INJURY")
        .stack(offence3, "FRAUD DECEPTION AND RELATED OFFENCES")
        .stack(offence4, "PROPERTY DAMAGE AND ENVIRONMENTAL")
        .stack(offence5, "SERIOUS CRIMINAL TRESPASS")
        .stack(offence6, "HOMICIDE AND RELATED OFFENCES")
        .stack(offence7, "OTHER OFFENCES AGAINST THE PERSON")
        .stack(offence8, "ROBBERY AND RELATED OFFENCES")

        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return (d.value.match / d.value.total) * 100
            }
            else {
                return 0;
            }
        })
        .width(500)
        .height(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({ top: 10, right: 200, bottom: 200, left: 30 });

}

---------------------#5 Stack Chart offence description 2 compared to whether against a person or property---------------------------------------------*/
