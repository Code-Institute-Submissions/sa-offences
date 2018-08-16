queue()
    .defer(d3.csv, "crime-statistics.csv")
    .await(makeGraphs);

function makeGraphs(error, offenceData) {
    var ndx = crossfilter(offenceData);

    offenceData.forEach(function(d) {
        d.OffenceCount = parseInt(d.OffenceCount);
    })

    suburb_selector(ndx)
    person_or_property_offences(ndx)
    type_of_offence(ndx)
    offence_to_property_or_person(ndx)
    count_per_offence(ndx)
    count_per_suburb(ndx)
    offence_to_property_or_person_piechart(ndx)




    dc.renderAll();
}


/*---------------------#1 Suburb Selector--------------------------------------------------------------------------------------------------------------*/

function suburb_selector(ndx) {
    
    var dim = ndx.dimension(dc.pluck('SuburbIncident'));
    group = dim.group()

    dc.selectMenu("#suburb-selector-1")
        .dimension(dim)
        .group(group);
}

/*---------------------#1 Suburb Selector--------------------------------------------------------------------------------------------------------------*/



/*---------------------#2 Bar Chart offence number to property or person-------------------------------------------------------------------------------*/

function person_or_property_offences(ndx) {
    var type_of_offence = ndx.dimension(dc.pluck('offenceDescription1'));
    var offence_count = type_of_offence.group().reduceSum(dc.pluck("OffenceCount"));


    dc.barChart("#bar-chart-2")

        .dimension(type_of_offence)
        .group(offence_count)

        .width(400)
        .height(400)
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
        .yAxis().ticks(6);
}

/*---------------------#2 Bar Chart offence number to property or person-------------------------------------------------------------------------------*/

/*---------------------#3 Pie Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/

function offence_to_property_or_person_piechart(ndx) {
    var dim = ndx.dimension(dc.pluck("offenceDescription3"));





    var total_offence_to_description3 = dim.group().reduce(
        function (p, v) {
            p.total += v.OffenceCount;
            return p;
        },

        function (p, v) {
            p.total -= v.OffenceCount;

            return p;
        },

        function () {
            return { total: 0 };
        },

    );

    dc.pieChart("#chart-7")


        .radius(500)
        .height(500)
        .width(900)
        .transitionDuration(500)
        .legend(dc.legend().x(0).y(20).itemHeight(15).gap(5))
        .dimension(dim)
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return ((d.value.total / 25) / 100).toFixed(2);
            }
            else {
                return 0;
            }
        })
        .group(total_offence_to_description3);

}





/*---------------------#3 Pie Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/



/*---------------------#4 Bar Chart offence Number per level 2 offence description-----------------------------------------------------------------------*/

function type_of_offence(ndx) {
    var type_of_offence = ndx.dimension(dc.pluck('offenceDescription2'));
    var offence_count = type_of_offence.group().reduceSum(dc.pluck("OffenceCount"));


    dc.barChart("#bar-chart-3")

        .dimension(type_of_offence)
        .group(offence_count)

        .width(400)
        .height(400)
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
        .yAxis().ticks(6);
}

/*---------------------#4 Bar Chart offence Number per level 2 offence description-----------------------------------------------------------------------*/

/*---------------------#5 Stack Chart offence description 2 compared to whether against a person or property---------------------------------------------*/

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

/*---------------------#5 Stack Chart offence description 2 compared to whether against a person or property---------------------------------------------*/

/*---------------------#6 Bar Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/
function count_per_offence(ndx) {
    var type_of_offence = ndx.dimension(dc.pluck('offenceDescription3'));
    var offence_count = type_of_offence.group().reduceSum(dc.pluck("OffenceCount"));


    dc.barChart("#bar-chart-5")

        .dimension(type_of_offence)
        .group(offence_count)

        .width(1300)
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
        .yAxis().ticks(10);
}

/*---------------------#6 Bar Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/

/*---------------------#7 Bar Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/
function count_per_suburb(ndx) {
    var type_of_offence = ndx.dimension(dc.pluck('SuburbIncident'));
    var offence_count = type_of_offence.group().reduceSum(dc.pluck("OffenceCount"));


    dc.barChart("#bar-chart-6")

        .dimension(type_of_offence)
        .group(offence_count)

        .width(30000)
        .height(600)
        .margins({
            top: 10,
            right: 50,
            bottom: 200,
            left: 50
        })


        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .y(d3.scale.linear().domain([0, 1500]))
        .yAxisLabel("How many times Offence was commited")
        .xAxisLabel("Offence")
        .yAxis().ticks(10);
}

/*---------------------#7 Bar Chart offence Number of offences per suburb--------------------------------------------------------------------------------*/






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


console.log("hello");

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