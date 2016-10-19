   // global vars
var dragging = false, drawing = false, startPoint;
var svg = d3.select('#plan').append('svg')
    .attr('height', 1000)
    .attr('width', 1000);
var points = [], g;
// behaviors
var dragger = d3.behavior.drag()
    .on('drag', handleDrag)
    .on('dragend', function(d){
        dragging = false;
    });
svg.on("contextmenu", function (d, i) {
      d3.event.preventDefault();
  })
    .on('mouseup', function(){
    if(dragging) return;
    drawing = true;
    startPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
    if(svg.select('g.drawPoly').empty()) g = svg.append('g').attr('class', 'drawPoly');
    if(d3.event.target.hasAttribute('is-handle')) {
        closePolygon();
        return;
    };
    points.push(d3.mouse(this));
    g.select('polyline').remove();
    var polyline = g.append('polyline').attr('points', points)
                    .style('fill', 'none')
                    .attr('stroke', '#000');
    for(var i = 0; i < points.length; i++) {
        g.append('circle')
        .attr('cx', points[i][0])
        .attr('cy', points[i][1])
        .attr('r', 4)
        .attr('fill', 'yellow')
        .attr('stroke', '#000')
        .attr('is-handle', 'true')
        .style({cursor: 'pointer'});
    }
})

function closePolygon() {
    svg.select('g.drawPoly').remove();
    var g = svg.append('g')
    .attr('class', 'readyPoly');

    g.append('polygon')
    .attr('points', points)    
    .style('fill', getRandomColor())
    .on("click", function(d){
       // svg.on('mouseup', null);
        
    });
    for(var i = 0; i < points.length; i++) {
        var circle = g.selectAll('circles')
        .data([points[i]])
        .enter()
        .append('circle')
        .attr('cx', points[i][0])
        .attr('cy', points[i][1])
        .attr('r', 4)
        .attr('fill', '#FDBC07')
        .attr('stroke', '#000')
        .attr('is-handle', 'true')
        .style({cursor: 'move'})
        .call(dragger);
    }
    points.splice(0);
    drawing = false;
}
svg.on('mousemove', function() {
    if(!drawing) return;
    var g = d3.select('g.drawPoly');
    g.select('line').remove();
    var line = g.append('line')
                .attr('x1', startPoint[0])
                .attr('y1', startPoint[1])
                .attr('x2', d3.mouse(this)[0] + 2)
                .attr('y2', d3.mouse(this)[1])
                .attr('stroke', '#53DBF3')
                .attr('stroke-width', 1);
})
function handleDrag() {
    if(drawing) return;
    var dragCircle = d3.select(this), newPoints = [], circle;
    dragging = true;
    var poly = d3.select(this.parentNode).select('polygon');
    var circles = d3.select(this.parentNode).selectAll('circle');
    dragCircle
    .attr('cx', d3.event.x)
    .attr('cy', d3.event.y);
    for (var i = 0; i < circles[0].length; i++) {
        circle = d3.select(circles[0][i]);
        newPoints.push([circle.attr('cx'), circle.attr('cy')]);
    }
    poly.attr('points', newPoints);
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}