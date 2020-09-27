function animatedDonutChart() {
    const COLORS = {
        positive:"#EF9772", 
        negative:"#78C1EE", 
        neutral:"#FFF" 
    };
    let index = d3.range(30);
    let div = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    // set the dimensions and margins of the graph
    let width = 800, 
        height = 600,
        radius = Math.min(width, height) / 2;
    
    // append the svg object to the body of the page
    let chart = function chart(selector, rawData) {
        
        let arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 70);

        let pie = d3.pie()
            .sort(null)
            .startAngle(1.1 * Math.PI)
            .endAngle(3.1 * Math.PI)
            .value(function (d) {return d.score;});

        let svg = d3.select(selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        let g = svg.selectAll(".arc")
            .data(pie(rawData))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .style("fill", function (d) {
                if (d.data.sentiment == "positive") {
                    return COLORS.positive;
                } else if (d.data.sentiment == "negative") {
                    return COLORS.negative;
                } else {
                    return COLORS.neutral;
                }
            })
            .style("stroke-width", 1.5)
            .style("stroke", "black")
            .style("filter", "url(#squiggle)")
            .transition().delay(function (d,i) {
                return i * 500; }).duration(500)
            .attrTween('d', function (d) {
                let i = d3.interpolate(d.startAngle + 0.1, d.endAngle);   
                return function (t) {
                    d.endAngle = i(t); 
                    return arc(d)
                    }
                });
        
        // add chart title
        svg.append("text")
            .attr("class", "title")
            .attr("x", 0)             
            .attr("y", 0)
            .attr("text-anchor", "middle")  
            .style("font-size", "14px")
            .style("font-family", "Open Sans, sans-serif")
            .style("font-weight", "800")
            .style("fill", "#002E72")
            .text("Overall Sentiment of K-12 Teachers");
        
        // add tooltip
        d3.selectAll("path")
            .on("mouseover", function (d) {
                div.style("left", d3.event.pageX + 10 + "px");
                div.style("top", d3.event.pageY - 25 + "px");
                div.style("display", "inline-block");
                div.html((d.data.sentiment) + "<br>" + "<b>" + (d.data.score) + "<b>" + "%");
            })
            .on("mouseout", function (d) {
                div.style("display", "none");
            });

        // add sketchy filter css property
        let filter = svg.append("filter").attr("id", "squiggle");
            
        filter.append("feTurbulence")
            .attr("baseFrequency", 0.01)
            .attr("numOctaves", 3)
            .attr("seed", 0)
        
        filter.append("feDisplacementMap")
            .attr("in", "SourceGraphic")
            .attr("in2", "noise")
            .attr("scale", 4);

    } // end braket to chart callback

    return chart;
}

try {

    let dataset = [
        {sentiment:"neutral", score:29.3},
        {sentiment:"positive", score:54.0},
        {sentiment:"negative", score:16.7}
    ];

    // new bubble chart instance
    let myDonutChart = animatedDonutChart();

    // calls chart function to display inside #visual div
    
    myDonutChart ("#visual", dataset);

    // logging
    console.log("JS file loaded");
} 

catch(err) {
    console.log(err);
}

"-----------------------------------------------------------------------------------"
