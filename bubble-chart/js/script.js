function animatedBubbleChart() {
    const width = 1000;
    const height = 600;

    // location to centre the bubbles
    const centre = { x: width / 2, y: height / 2 };

    let xCenter = [100, 300, 500];

    // strength to apply to the position forces
    const forceStrength = 0.03;

    let svg = null;
    let bubbles = null;
    let labels = null;
    let nodes = [];
    
    // charge is dependent on size of the bubble, so bigger towards the middle
    function charge(d) {
        return Math.pow(d.radius, 2.0) * 0.01;
    }

    // create a force simulation and add forces to it
    const simulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(charge))
        .force('center', d3.forceCenter(centre.x, centre.y))
        // .force('x', d3.forceX().strength(forceStrength).x(centre.x))
        .force('y', d3.forceY().strength(forceStrength).y(centre.y))
        .force('collision', d3.forceCollide().radius(d => d.radius))

    simulation.stop();

    const fillColour = d3
        .scaleLinear()
        // .domain(["1", "2", "3", "5", "99"])
        // .range(["#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#AAAAAA"]);
        .domain([1, 10])
        .range(["#EAECEE", "black"]);

    // data manipulation function takes raw data from csv and converts it into an array of node objects
    // each node will store data and visualisation values to draw a bubble
    // function returns the new node array, with a node for each element in the rawData input
    function createNodes(rawData) {
        // use max size in the data as the max in the scale's domain
        // note we have to ensure that size is a number
        const maxSize = d3.max(rawData, (d) => +d.occurrence);

        // size bubbles based on area
        const radiusScale = d3.scaleSqrt().domain([0, maxSize]).range([0, 80]);

        // use map() to convert raw data into node data
        const myNodes = rawData.map((d) => ({
        ...d,
        radius: radiusScale(+d.occurrence),
        x: Math.random() * 900,
        y: Math.random() * 800
        }));

        return myNodes;
    }

    let chart = function chart(selector, rawData) {
        // convert raw data into nodes data
        nodes = createNodes(rawData);

        // create svg element inside provided selector
        svg = d3
        .select(selector)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

        // bind nodes data to circle elements
        const elements = svg
        .selectAll(".bubble")
        .data(nodes, (d) => d.occurrence)
        .enter()
        .append("g");

        bubbles = elements
        .append("circle")
        .classed("bubble", true)
        .attr("r", (d) => d.occurrence + 5)
        // .attr("fill", (d) => fillColour(d.occurrence));
        .style("fill", "DCECFF")
        .style("stroke-width", 1)
        .style("stroke", "black")
        .style("filter", "url(#squiggle)");

        // labels
        labels = elements
        .append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("font-size", function(d) {
            let len = d.word.substring(0, d.radius / 3).length;
            let size = d.radius / 3;
            size *= 10 / len;
            size += 1;

            return Math.round(size) + "px";
        })
        .style("font-family", "Open Sans, sans-serif")
        .text(function(d) {
            let text = d.word.substring(0, d.radius / 3);

            return text;
        });

        // set simulation's nodes to our newly created nodes array
        // simulation starts running automatically once nodes are set
        simulation.nodes(nodes).on("tick", ticked).restart();
        
        // add filter css property
        let filter = svg.append("filter").attr("id", "squiggle")
            
        filter.append("feTurbulence")
            .attr("baseFrequency", 0.01)
            .attr("numOctaves", 3)
            .attr("seed", 0)
        
        filter.append("feDisplacementMap")
            .attr("in", "SourceGraphic")
            .attr("in2", "noise")
            .attr("scale", 4);

        // select highlight top three counts
        svg.selectAll("circle")
            .style("fill", function(d) {
                if(d.emotion == "positive") {
                    return "#91ccf7"
                } else {
                    return "#e7f2ff"
                }
            });
    };
    
    // callback function called after every tick of the force simulation
    // here we do the actual repositioning of the circles based on current x and y value of their bound node data
    // x and y values are modified by the force simulation
    function ticked() {
        bubbles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    }

    return chart;
}

try {

    let myBubbleChart = animatedBubbleChart();
    
    function display(data) {
        myBubbleChart("#visual", data);
    }

    d3.csv("data/survey_count.csv").then(display);

    // logging
    console.log("JS file ran without errors")
}

catch (err){

    console.log(err)
}

"-----------------------------------------------------------------------------------"
