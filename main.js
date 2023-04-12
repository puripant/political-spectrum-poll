const width = 400;
const height = 300;

let axis = d3.select("#axis")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height]);

axis.append("line")
  .attr("stroke", "black")
  .attr("stroke-width", 5)
  .attr("x1", 0)
  .attr("y1", height/2)
  .attr("x2", width)
  .attr("y2", height/2)
axis.append("line")
  .attr("stroke", "black")
  .attr("stroke-width", 5)
  .attr("x1", width/2)
  .attr("y1", 0)
  .attr("x2", width/2)
  .attr("y2", height)

const data = [
  { "x":  0   , "y":  0   , "name": "ภูมิใจไทย", "color": "blue" },
  { "x": -0.3 , "y":  0   , "name": "ชาติพัฒนากล้า", "color": "url(#blue-yellow)" },
  { "x": -0.6 , "y":  0.5 , "name": "เพื่อไทย", "color": "red" },
  { "x": -0.55, "y": -0.15, "name": "ก้าวไกล", "color": "darkorange" }
]

const blue_yellow = [
  { offset: "0%", color: "blue" },
  { offset: "50%", color: "blue" },
  { offset: "50%", color: "gold" },
  { offset: "100%", color: "gold" },
]

let xScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([0, width]);
let yScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([height, 0]);

let chart = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height]);

chart.append("defs")
  .append("linearGradient")
    .attr("id", "blue-yellow")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 1)
    .attr("y2", 1)
  .selectAll("stop")
  .data(blue_yellow)
    .join("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

chart.append("g")
    .attr("stroke", "white")
    .attr("stroke-width", 1)
  .selectAll("circle")
  .data(data)
  .join("circle")
    .attr("fill", d => d.color)
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 10)
    .append("title")
      .text(d => d.name);
