import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ThemeDataService } from 'app/services/theme-data.service';
import { ReroutingService } from 'app/services/rerouting.service';
import { Router } from '@angular/router';
// Import of d3
import * as d3 from 'd3';
import { getQueryPredicate } from '@angular/compiler/src/render3/view/util';


@Component({
  selector: 'app-theme-visual',
  templateUrl: './theme-visual.component.html',
  styleUrls: ['./theme-visual.component.scss']
})

export class ThemeVisualComponent implements OnInit {
  // Width variable
  width: number;
  // Height depends on end node count
  height: any;
  heightParam: any;
  // Margins and svg
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  svg: any;
  g: any;
  // Variables relating to the tree
  tree: any;
  root: any;
  link: any;
  node: any;
  // Params for getting the data
  data: any;
  p_id: number;
  response: any;
  // X and Y coordinates of the page
  pageX: any;
  pageY: any;

  constructor(private themeDataService: ThemeDataService, private router: Router) {
    // Width with margins
    this.width = 900 - this.margin.left - this.margin.right;
    // Get the project id
    this.p_id = Number(new ReroutingService().getProjectID(this.router.url));
  }

  /**
   * Function that gets the data and intializes the svg
   */
  async ngOnInit() {
    // Gets correct data
    await this.getData();
    // Initialise visualisation svg
    this.initSvg();
  }

  /**
   * Function that gets the data for the visualization
   */
  async getData() {
    // Call the service to get the theme visualization data
    this.response = await this.themeDataService.themeVisData(this.p_id);
  }

  /**
   * Function that renders the svg of the hierarchy
   */
  initSvg() {
    // Assigns data to variable
    this.data = this.response;
    this.data.name = "Current Project";

    // Define the div for the tooltip
    let div = d3.select("#treeChart").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Initialise svg
    this.svg = d3.select('#treeChart')
      .append('svg')
      .attr('width', '100vw')
      .attr('height', '200vh')

    // Initialise g
    this.g = this.svg.append('g')
      .attr('transform', 'translate(90,0)');

    // Sets the root of the tree
    this.root = d3.hierarchy(this.data);
    // Get leaf count to have correct height
    let node_count: number = this.root.count().value;

    // Changes spacing based on how many nodes are there
    if (node_count < 10) {
      this.heightParam = 55;
    } else if (node_count >= 10 && node_count < 50) {
      this.heightParam = 22;
    } else {
      this.heightParam = 5;
    }

    // Sets height of tree
    this.height = node_count * this.heightParam;

    // Sets tree
    this.tree = d3.tree()
      .size([this.height, this.width]);
    this.tree(this.root);

    // Colors nodes based on node type
    var myColour = d3.scaleOrdinal()
      .domain(["Project", "Theme", "Label"])
      .range(["blue", "orange", "red"])

    // Adds legend to top left
    this.g.append("circle").attr("cx", -60).attr("cy", 20).attr("r", 2.5).style("fill", "blue").style("opcacity", 0.7)
    this.g.append("circle").attr("cx", -60).attr("cy", 35).attr("r", 2.5).style("fill", "orange").style("opcacity", 0.7)
    this.g.append("circle").attr("cx", -60).attr("cy", 50).attr("r", 2.5).style("fill", "red").style("opcacity", 0.7)
    this.g.append("circle").attr("cx", -60).attr("cy", 65).attr("r", 2.5).style("fill", "grey").style("opcacity", 0.7)
    this.g.append("text").attr("dx", -55).attr("dy", 20).text("Project").style("font-size", "11px").attr("alignment-baseline", "middle")
    this.g.append("text").attr("dx", -55).attr("dy", 35).text("Theme").style("font-size", "11px").attr("alignment-baseline", "middle")
    this.g.append("text").attr("dx", -55).attr("dy", 50).text("Label").style("font-size", "11px").attr("alignment-baseline", "middle")
    this.g.append("text").attr("dx", -55).attr("dy", 65).text("Deleted").style("font-size", "11px").attr("alignment-baseline", "middle")
    this.g.append("rect").attr('x', -65).attr('y', 10).attr('width', 60).attr('height', 65).attr('stroke', 'grey').attr('fill', 'none').style("opcacity", 0.4);

    // Gets the links between nodes
    this.link = this.g.selectAll(".link")
      .data(this.tree(this.root).links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
        .x(function (d: any) { return d.y; })
        .y(function (d: any) { return d.x; }));

    // Gets the tree nodes
    this.node = this.g.selectAll(".node")
      .data(this.root.descendants())
      .enter().append("g")
      .attr("class", function (d: any) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function (d: any) { return "translate(" + d.y + "," + d.x + ")"; })

    // Appends the circles for each node
    this.node.append("circle")
      .attr("r", 2.5)
      .attr("fill", function (d: any) {
        // Check if it is deleted
        if (d.data.deleted) {
          return "grey";
        } else { //else colour
          return myColour(d.data.type);
        }
      })
      // Tooltip mouse hover added
      .on("mouseover", function (event: any, d: any) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        // Text shown in the box when you hover over a node with your mouse
        div.html("id: " + d.data.id + "<br/>" + "type: " + d.data.type + "<br/> deleted: " + d.data.deleted )
          .style("left", (d.y + 100) + "px")
          .style("top", (d.x - 25) + "px");
      })
      .on("mouseout", function (d: any) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Appends text for each node
    this.node.append("text")
      .attr("dy", 3)
      .attr("x", function (d: any) { return d.children ? -8 : 8; })
      .style("text-anchor", function (d: any) { return d.children ? "end" : "start"; })
      .text(function (d: any) { return d.data.name });
  }
}
