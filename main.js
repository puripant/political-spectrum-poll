const width = 360;
const height = 270;

const blue_yellow = [
  { offset: "0%", color: "blue" },
  { offset: "50%", color: "blue" },
  { offset: "50%", color: "gold" },
  { offset: "100%", color: "gold" }
]
const blue_yellow_gradient = [
  { offset: "0%", color: "blue" },
  { offset: "100%", color: "gold" }
]
function define_gradient(defs, data, name) {
  defs.append("linearGradient")
      .attr("id", name)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 1)
      .attr("y2", 1)
    .selectAll("stop")
    .data(data)
      .join("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);
}

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
  { "x":  0   , "y":  0   , "name": "พรรคภูมิใจไทย", "color": "blue", "color-voronoi": "blue" },
  { "x": -0.3 , "y":  0   , "name": "พรรคชาติพัฒนากล้า", "color": "url(#blue-yellow)", "color-voronoi": "url(#blue-yellow-gradient)" },
  { "x": -0.6 , "y":  0.5 , "name": "พรรคเพื่อไทย", "color": "red", "color-voronoi": "red" },
  { "x": -0.55, "y": -0.15, "name": "พรรคก้าวไกล", "color": "darkorange", "color-voronoi": "darkorange" }
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

let defs = chart.append("defs")
define_gradient(defs, blue_yellow, "blue-yellow");
define_gradient(defs, blue_yellow_gradient, "blue-yellow-gradient");

let delaunay = d3.Delaunay.from(data.map(d => [xScale(d.x), yScale(d.y)]));
let voronoi = delaunay.voronoi([0, 0, width, height]);
let cells = data.map((d, i) => [d, voronoi.cellPolygon(i)]);

chart.append("g")
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("fill-opacity", 0.2)
  .selectAll("path")
  .data(cells)
  .join("path")
    .attr("d", ([_, cell]) => `${cell.map((p, i) => ((i === 0) ? "M" : "L") + p)}`)
    .attr("fill", ([d, _]) => d["color-voronoi"])
    .append("title")
      .text(([d, _]) => `ใกล้เคียง${d.name}`);

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