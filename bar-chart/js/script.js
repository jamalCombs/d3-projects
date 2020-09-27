function animatedBarChart() {
    let x, y, svg;
    let index = d3.range(30);
    const COLORS = {
        positive: "#EF9772",
        negative: "#002e72"
    };
    // set the dimensions and margins of the graph
    let margin = {top: 150, right: 30, bottom: 90, left: 40},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    let chart = function chart(selector, rawData) {

        svg = d3.select(selector)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // create x axis
        x = d3.scaleBand()
            .range([0, width + 1])
            .domain(rawData.map(function (d) {return d.words;}))
            .padding(0.2);
        
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-family", "Open Sans, sans-serif")
            .style("font-size", "14px")
            .style("color", "#002E72")
            .style("text-transform", "capitalize")
            .style("font-weight", "400");

        // create y axis
        y = d3.scaleLinear()
            .domain([0, 8])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", "translate(${margin.left},0)")
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .style("font-size", "14px");

        // add filter css property
        let filter = svg.append("filter").attr("id", "squiggle");
            
        filter.append("feTurbulence")
            .attr("baseFrequency", 0.01)
            .attr("numOctaves", 3)
            .attr("seed", 0)
        
        filter.append("feDisplacementMap")
            .attr("in", "SourceGraphic")
            .attr("in2", "noise")
            .attr("scale", 4);

        // add bars
        svg.selectAll("mybar")
            .data(rawData)
            .enter()
            .append("rect")
            .attr("x", function (d) {return x(d.words);})
            .attr("width", x.bandwidth())
            .style("stroke-width", 1.5)
            .style("stroke", "black")
            .style("fill", "DCECFF")
            .style("filter", "url(#squiggle)")
            .attr("height", function (d) {return height - y(0);});
            // .attr("y", function(d) { return y(0); });
        
        // add animation
        svg.selectAll("rect")
            .transition()
            .duration(1000)
            .attr("y", function (d) {return y(d.count);})
            .attr("height", function(d) {return height - y(d.count);})
            .delay(function (d, i) {return (i * 100);});

        // add chart title
        svg.append("text")
            .attr("class", "title")
            .attr("x", 80)             
            .attr("y", -60)
            .attr("text-anchor", "middle")  
            .style("font-size", "14px")
            .style("font-family", "Open Sans, sans-serif")
            .style("font-weight", "800")
            .style("fill", "#002E72")
            .text("Emotional Word Frequency");

        // select highlight top three counts
        svg.selectAll("rect")
            .style("fill", function (d) {
                if(d.emotion == "positive") {
                    return COLORS.positive;
                } else {
                    return COLORS.negative;
                }
            });

        // create legend
        let chartList = ["Positive", "Negative"];
        let color = d3.scaleOrdinal(d3.schemeCategory10);
        let dataLength = 0;
        let offset = 80;

        let svgLegend = d3.select(".legend").append("svg")
            .attr("width", 200)
            .attr("height", 30)
            .style("position", "absolute")
            .style("left", width/2)
            .style("top", "20px");
        
        let legend = svgLegend.selectAll(".legend")
            .data(chartList)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                if (i === 0) {
                    dataLength = d.length + offset 
                    return "translate(0,10)"
                } else { 
                    let newDataLength = dataLength
                    dataLength +=  d.length + offset
                    return "translate(" + (newDataLength) + ",10)"
                }
            });
        
        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function (d, i) {
                if (d == "Positive") {
                    return COLORS.positive;
                }
                else {
                    return COLORS.negative;
                }
            })
            .style("stroke", "#000000");
        
        legend.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text(function (d, i) {return d;})
            .attr("class", "textselected")
            .style("text-anchor", "start")
            .style("font-size", 14)
            .style("font-weight", "400")
            .style("fill", "#002E72")
            .style("font-family", "Open Sans, sans-serif");

    } // end braket to chart callback

    return chart;
}

try {
    // new bubble chart instance
    let myBarChart = animatedBarChart();

    // calls chart function to display inside #visual div
    function display(data) {
        myBarChart("#visual", data);
    }
    
    // load data
    d3.csv("data/emotion_words_all.csv").then(display);

    // logging
    console.log("JS file loaded");
} 

catch(err) {
    console.log(err);
}

"-----------------------------------------------------------------------------------"
