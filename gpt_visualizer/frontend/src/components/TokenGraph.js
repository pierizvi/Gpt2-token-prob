import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function TokenGraph({ data }) {
  const svgRef = useRef();
  
  const formatTokenDisplay = (text) => {
    // If token starts with Ġ, show a visible space indicator
    if (text.startsWith('Ġ')) {
      return `·${text.slice(1)}`; 
    }
    return text;
  };

  useEffect(() => {
    if (!data.nodes.length) return;


    d3.select(svgRef.current).selectAll("*").remove();

    const width = 600;
    const height = 400;

    // Colors
    const nodeColor = '#4B0082';  // Dark purple
    const nodeBorder = '#663399'; // Lighter purple for border
    const backgroundColor = '#000000';
    const lineColor = 'rgba(147, 112, 219, 0.4)'; // Transparent purple for connections

    const baseRadius = 20;
    const minRadius = 15;
    const maxRadius = 30;

    // Create links array connecting sequential tokens
    const links = data.nodes.slice(1).map((node, i) => ({
      source: i,
      target: i + 1,
    }));

    // Inverse node sizing - longer text = smaller nodes
    const fontSize = d3.scaleLog()
      .domain([1, d3.max(data.nodes, d => d.text.length)])
      .range([30, 15]);  // Larger range for more variation

    data.nodes.forEach(node => {
      node.radius = fontSize(node.text.length);
    });

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("width", "100%")
      .attr("height", "100%")
      .style("background", backgroundColor)
      .style("border-radius", "8px")
      .style("aspect-ratio", "3/2");

    // Add subtle star-like dots
    const starsGroup = svg.append("g").attr("class", "stars");
    for (let i = 0; i < 50; i++) {
      starsGroup.append("circle")
        .attr("cx", Math.random() * width - width/2)
        .attr("cy", Math.random() * height - height/2)
        .attr("r", Math.random() * 1.5)
        .attr("fill", "rgba(147, 112, 219, 0.3)")
        .style("opacity", Math.random());
    }

    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g");

    // Enhanced celestial force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(links)
        .distance(d => (d.source.radius + d.target.radius) * 2))
      .force("charge", d3.forceManyBody()
        .strength(d => -150 * Math.sqrt(d.radius)))
      .force("collide", d3.forceCollide()
        .radius(d => d.radius * 1.5)
        .strength(0.5))
      .force("radial", d3.forceRadial(
        d => 100 + Math.random() * 100,
        0, 0).strength(0.8))
      .force("x", d3.forceX().strength(0.01))
      .force("y", d3.forceY().strength(0.01));

    // Add links first so they appear behind nodes
    const links_g = g.append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(links)
      .join("path")
      .style("stroke", lineColor)
      .style("stroke-width", "1px")
      .style("fill", "none")
      .style("opacity", 0.6)
      .style("filter", "drop-shadow(0 0 2px rgba(147, 112, 219, 0.2))");

    // Drag behavior
    const drag = d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const nodes = g.selectAll("g.node")
      .data(data.nodes)
      .join("g")
      .attr("class", "node")
      .call(drag);

    // Add gradient definition
    const gradient = svg.append("defs")
      .append("radialGradient")
      .attr("id", "nodeGradient");

    gradient.append("stop")
      .attr("offset", "70%")
      .attr("stop-color", nodeColor);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", nodeBorder);

    nodes.append("circle")
      .attr("r", d => d.radius)
      .style("fill", "url(#nodeGradient)")
      .style("stroke", nodeBorder)
      .style("stroke-width", "2px")
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(0 0 4px rgba(147, 112, 219, 0.4))");

    nodes.append("text")
      .text(d => formatTokenDisplay(d.text))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-family", "Space Mono, monospace")
      .style("font-size", d => `${Math.min(11, d.radius/2)}px`)
      .style("fill", "#fff")
      .style("pointer-events", "none")
      .style("text-shadow", "0 0 4px rgba(0,0,0,0.8)");

    // Add index numbers
    nodes.append("text")
      .text((d, i) => i + 1)
      .attr("x", d => -d.radius)
      .attr("y", d => -d.radius)
      .style("font-size", "10px")
      .style("fill", "rgba(147, 112, 219, 0.8)")
      .style("pointer-events", "none");

    // Enhanced tooltips
    nodes.append("title")
      .text(d => `Token: "${d.text}"${d.text.startsWith('Ġ') ? 
        '\n(starts with space)' : ''}`);



    simulation.on("tick", () => {
      // Update node positions
      nodes.attr("transform", d => {
        d.x = Math.max(-width/2 + d.radius, Math.min(width/2 - d.radius, d.x));
        d.y = Math.max(-height/2 + d.radius, Math.min(height/2 - d.radius, d.y));
        return `translate(${d.x},${d.y})`;
      });

      // Update link positions
      links_g.attr("d", d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });
    });

  }, [data]);

  return (
    <div className="token-visualization">
      <div className="graph-container">
        <svg ref={svgRef} />
      </div>
      
      <div className="graph-legend">
        <div className="legend-item">
          <span className="legend-symbol">·</span>
          <span className="legend-text">indicates leading space in token</span>
        </div>
      </div>
    </div>
  );
}

export default TokenGraph;