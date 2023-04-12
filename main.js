const width = 400;
const height = 300;

const data = [
  { "name": "ภูมิใจไทย", "x": 0, "y": 0 },
  { "name": "ชาติพัฒนากล้า", "x": -0.3, "y": 0 },
  { "name": "เพื่อไทย", "x": -0.6, "y": 0.5 },
  { "name": "ก้าวไกล", "x": -0.55, "y": -0.15 },
]

let xScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([0, width]);
let yScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([height, 0]);

let svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height]);

// svg.append("g")
//   .attr("transform", `translate(0,${height - marginBottom})`)
//   .call(xAxis)
//   .call(g => g.select(".domain").remove())
//   .call(g => g.selectAll(".tick line").clone()
//       .attr("y2", marginTop + marginBottom - height)
//       .attr("stroke-opacity", 0.1))
//   .call(g => g.append("text")
//       .attr("x", width)
//       .attr("y", marginBottom - 4)
//       .attr("fill", "currentColor")
//       .attr("text-anchor", "end")
//       .text(xLabel));
// svg.append("g")
//   .attr("transform", `translate(${marginLeft},0)`)
//   .call(yAxis)
//   .call(g => g.select(".domain").remove())
//   .call(g => g.selectAll(".tick line").clone()
//       .attr("x2", width - marginLeft - marginRight)
//       .attr("stroke-opacity", 0.1))
//   .call(g => g.append("text")
//       .attr("x", -marginLeft)
//       .attr("y", 10)
//       .attr("fill", "currentColor")
//       .attr("text-anchor", "start")
//       .text(yLabel));

// svg.append("rect")
//   .attr("fill", "white")
//   .attr("stroke", "black")
//   .attr("stroke-width", 5)
//   .attr("width", width)
//   .attr("height", height)
svg.append("line")
  .attr("stroke", "black")
  .attr("stroke-width", 5)
  .attr("x1", 0)
  .attr("y1", height/2)
  .attr("x2", width)
  .attr("y2", height/2)
svg.append("line")
  .attr("stroke", "black")
  .attr("stroke-width", 5)
  .attr("x1", width/2)
  .attr("y1", 0)
  .attr("x2", width/2)
  .attr("y2", height)

svg.append("g")
    .attr("fill", "black")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
  .selectAll("circle")
  .data(data)
  .join("circle")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 10);
