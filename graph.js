const margin = { top: 20, right: 20, bottom: 50, left: 100 };
const graphWidth = 1200 - margin.right - margin.left;
const graphHeight = 360 - margin.top - margin.bottom;

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', graphWidth + margin.left + margin.right)
    .attr('height', graphHeight + margin.top + margin.bottom);

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// scales
var current = new Date()

currentHour = current.getHours()
currentMinute = current.getMinutes()
currentTime = JSON.stringify(currentHour) + JSON.stringify(currentMinute)
console.log(currentTime)

const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

// axes groups
const xAxisGroup = graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', "translate(0," + graphHeight + ")");

const yAxisGroup = graph.append('g')
    .attr('class', 'y-axis');

// d3 line path generator
const line = d3.line()
    //.curve(d3.curveCardinal)
    .x(function (d) { return x(new Date(d.TimeStamp)) })
    .y(function (d) { return y(d.LastPrice) });

console.log(line)

// line path element
const path = graph.append('path');

// update function
const update = (data) => {

    // filter data based on current activity
    // data = data.filter(item => item.activity == activity);

    // sort the data based on date objects
    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    // set scale domains
    x.domain(d3.extent(data, d => new Date(d.TimeStamp)));
    // x.domain(d3.extent(data, d => new Date(d.date)));
    y.domain([d3.min(data, d => d.LastPrice) - 1000, d3.max(data, d => d.LastPrice) + 1000]);

    // update path data
    path.data([data])
        .attr('fill', 'none')
        .attr('stroke', '#00bfa5')
        .attr('stroke-width', '2')
        .attr('d', line);

    // create circles for points
    const circles = graph.selectAll('circle')
        .data(data);

    // remove unwanted points
    circles.exit().remove();

    // update current points
    circles.attr('r', '4')
        .attr('cx', d => x(new Date(d.TimeStamp)))
        .attr('cy', d => y(d.LastPrice));

    // add new points
    circles.enter()
        .append('circle')
        .attr('r', '4')
        .attr('cx', d => x(new Date(d.TimeStamp)))
        .attr('cy', d => y(d.LastPrice))
        .attr('fill', '#ccc');

    // create axes
    const xAxis = d3.axisBottom(x)
        .ticks(d3.timeHour.every(1))
        // .tickFormat(currentTime)
      



    const yAxis = d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d => d + 'm');

    // call axes
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // rotate axis text
    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end');

};

// data and firestore
var data = [];

db.collection('trends').onSnapshot(res => {

    res.docChanges().forEach(change => {

        const doc = { ...change.doc.data(), id: change.doc.id };

        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }

    });

    update(data);

});