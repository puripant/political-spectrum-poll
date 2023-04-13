const is_desktop = Math.max(
  document.body.scrollWidth,
  document.documentElement.scrollWidth,
  document.body.offsetWidth,
  document.documentElement.offsetWidth,
  document.documentElement.clientWidth
) >= 1000;
const width = is_desktop ? 800 : 360;
const height = is_desktop ? 600 : 270;
window.addEventListener('resize', () => { location.reload(); });

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
    .classed("result", true)
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("fill-opacity", 0.2)
  .selectAll("path")
  .data(cells)
  .join("path")
    .attr("d", ([_, cell]) => `${cell.map((p, i) => ((i === 0) ? "M" : "L") + p)}`)
    .attr("fill", ([d, _]) => d["color-voronoi"])
    .append("title")
      .text(([d, _]) => `ใกล้${d.name}`);

chart.append("g")
    .classed("result", true)
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

chart
  .on("click", event => {
    [x, y] = d3.pointer(event);
    chart.append("path")
      .attr("fill", "black")
      .attr("d", d3.symbol().size(150).type(d3.symbolStar))
      .attr("transform", d => `translate(${x},${y})`)
      .append("title")
        .text("คุณเลือกตรงนี้");

    let closest_party = null
    for (let [d, cell] of cells) {
      if (d3.polygonContains(cell, [x, y])) {
        closest_party = d.name;
      }
    }

    // save result to Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbxLDCx5auLMQx-212MW5UQgHKVEi6H4ceITDUp6S99jWKWSQ3EgzcP1_uTyUcpTNHll/exec", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "x": x,
        "y": y,
        "spectrum_x": xScale.invert(x),
        "spectrum_y": xScale.invert(y),
        "closest_party": closest_party
      })
    })
    .then(response => console.log('Success:', response))
    .catch(error => console.error('Error:', error));
    
    chart.selectAll(".result").style("display", "unset");
    d3.select("#details1").style("display", "none");
    d3.select("#details2")
      .text(closest_party ? `คุณอยู่ใกล้${closest_party}ที่สุด` : "คุณอยู่ไม่ใกล้พรรคไหนเลย")
      .style("display", "unset");
    d3.select("#details3").style("display", "unset");
    chart.on("click", null);
    d3.select("#chart")
      .style("cursor", "default");
  });