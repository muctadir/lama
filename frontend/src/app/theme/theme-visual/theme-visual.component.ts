import { Component, OnInit } from '@angular/core';
import { ThemeDataService } from 'app/services/theme-data.service';
import { ReroutingService } from 'app/services/rerouting.service';
import { Router } from '@angular/router';
//import of d3
import * as d3 from 'd3';


@Component({
  selector: 'app-theme-visual',
  templateUrl: './theme-visual.component.html',
  styleUrls: ['./theme-visual.component.scss']
})

export class ThemeVisualComponent implements OnInit {
  // Declaring a lot off attributes
  width: number;
  // Height depends on end node count
  height: any;
  heightParam: any;
  // Margins and svg
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  svg: any;
  g: any;
  // Relating to the tree
  tree: any;
  root: any;
  link: any;
  node: any;
  // Params for getting the data
  data: any;
  p_id: number;
  response: any;

  constructor(private themeDataService: ThemeDataService, private router: Router) {
    // Width with margins
    this.width = 900 - this.margin.left - this.margin.right;
    // Get the project id
    this.p_id = Number(new ReroutingService().getProjectID(this.router.url));
  }

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
    this.response = await this.themeDataService.themeVisData(this.p_id)
  }

  /**
   * Function that renders the svg of the hierarchy
   */
  initSvg() {
    // Assigns data to variable
    this.data = this.response
    // Initialise svg
    this.svg = d3.select('#treeChart')
      .append('svg')
      .attr('width', '100vw')
      .attr('height', '100vh')

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
    this.height = node_count *  this.heightParam;

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
    this.g.append("text").attr("dx", -55).attr("dy", 20).text("Project").style("font-size", "11px").attr("alignment-baseline", "middle")
    this.g.append("text").attr("dx", -55).attr("dy", 35).text("Theme").style("font-size", "11px").attr("alignment-baseline", "middle")
    this.g.append("text").attr("dx", -55).attr("dy", 50).text("Label").style("font-size", "11px").attr("alignment-baseline", "middle")
    
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
      .attr("fill", function (d: any) { console.log(d.data.type); return myColour(d.data.type) });

    // Appends text for each node
    this.node.append("text")
      .attr("dy", 3)
      .attr("x", function (d: any) { return d.children ? -8 : 8; })
      .style("text-anchor", function (d: any) { return d.children ? "end" : "start"; })
      .text(function (d: any) { return d.data.name });
  }
}