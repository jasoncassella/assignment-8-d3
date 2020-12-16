var url = 'data_homeruns.csv'

d3.csv(url, function(error, data){
    data.forEach(function (d) {
      d.homeruns = +d.homeruns;
    });

    var margin = {top: 65, bottom: 50, left:60, right: 30}, axisPadding = 10;
    var Width = 500, Height = 300;
    var svgWidth = Width + margin.left + margin.right,
        svgHeight = Height + margin.top + margin.bottom;
    var maxHR = d3.max(data, function(d){ return d.homeruns; });
    
    var xScale = d3.scale.ordinal()
        .domain(data.map(function(d){ return d.year; }))
        .rangeBands([0, Width], 0.1);
    var yScale = d3.scale.linear()
        .domain([0, maxHR])
        .range([0, Height]);
    
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSize(0,0)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(yScale.copy().domain([maxHR, 0]))
        .tickSize(6,0)
        .ticks(5)
        .orient('left');
    
    var svg = d3.select('#container')
        .append('svg')
        .attr({width: svgWidth, height: svgHeight})
    
    var xGroup = svg.append('g')
        .attr('class', 'xGroup')
        .attr('transform', 'translate(' + [margin.left, margin.top + Height + axisPadding] + ')');
    xGroup.call(xAxis);
    styleAxis(xGroup);
    var yGroup = svg.append('g')
        .attr('class', 'yGroup')
        .attr('transform', 'translate(' + [margin.left - axisPadding, margin.top] + ')');
    yGroup.call(yAxis);
    styleAxis(yGroup);

    var label = svg.append('g')
        .attr('transform', 'translate(' + [margin.left - axisPadding, margin.top] + ')');
    label.append('text')
        .text('Homeruns')
        .attr('transform', 'rotate(-90)')
        .attr({
            'text-anchor': 'start',
            x: -60,
            y: 15,
        })
    label.append('text')
        .text('MLB Homerun Totals 2009-2019')
        .attr('transform', 'translate(' + [Width / 2, - margin.top / 2] + ')')
        .attr({
            'text-anchor': 'middle',
            'font-size': '1.5em',
            fill: 'steelblue',
        });

    var graph = svg.append('g')
        .attr('class', 'graph')
        .attr('transform', 'translate(' + [margin.left, margin.top + Height] + ')');
    var bars = graph.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function(d,i){ return 'translate(' + [xScale(d.year), -1 * yScale(d.homeruns)] + ')'; });
    bars.append('rect')
        .each(function(d,i){
            d3.select(this).attr({
                fill: 'steelblue',
                width: xScale.rangeBand(),
                height: yScale(d.homeruns),
            })
        })
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
    
    bars.append('text')
    .text(function(d){ return d.homeruns; })
    .each(function(d,i){
        d3.select(this).attr({
            fill: 'none',
            stroke: 'none',
            x: xScale.rangeBand() / 2,
            y: -5,
            'text-anchor': 'middle',
        });
    })
    var div = d3.select('#container').append('div')
        .attr('class', 'tooltip')
        .style('display', 'none');
    function mouseover(){
        div.style('display', 'inline');
    }
    function mousemove(){
        var d = d3.select(this).data()[0]
        div
            .html(d.year + '<hr/>' + d.homeruns + ' homeruns')
            .style('left', (d3.event.pageX - 34) + 'px')
            .style('top', (d3.event.pageY - 12) + 'px');
    }
    function mouseout(){
        div.style('display', 'none');
    }
})


function styleAxis(axis){
    axis.select('.domain').attr({
        fill: 'none',
        stroke: '#888',
        'stroke-width': 1
    });
    axis.selectAll('.tick line').attr({
        stroke: '#000',
        'stroke-width': 1,
    })
}