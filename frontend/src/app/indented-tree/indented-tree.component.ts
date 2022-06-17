import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from "d3";
import *  as  dataJson from '../data.json';

@Component({
  selector: 'app-indented-tree',
  templateUrl: './indented-tree.component.html',
  styleUrls: ['./indented-tree.component.scss']
})
export class IndentedTreeComponent implements OnInit {

 // @ViewChild('chart2', { static: true }) private chartContainer: ElementRef; 
 //TODO: launch and see if it runs without the comment
  data: any = (dataJson as any).default;
  chartContainer: any;
  source: any;
  root: any;
  diagonal: any;

  constructor() { }

  ngOnInit() {
    this.renderTreeChart();
  }

  renderTreeChart() {

    let margin = { top: 30, right: 10, bottom: 30, left: 20 };
    let width = 960;
    let barHeight = 20;
    let barWidth = (width - margin.left - margin.right) * 0.8;
    let element: any = this.chartContainer.nativeElement;

    let i = 0, duration = 400, root: d3.HierarchyNode<any>;
    this.diagonal = d3.linkHorizontal()
      .x((d: any) => { return d.y; })
      .y((d: any) => { return d.x; });

    let svg = d3.select(element).append("svg")
      .attr("width", element.offsetWidth) //+ margin.left + margin.right)
      .attr('height', element.offsetHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    this.root = d3.hierarchy(this.data);
    this.root.x0 = 0;
    this.root.y0 = 0;
    moveChildren(this.root);
    //update(this.root);
  
    const update = (source: any) => {

      // Compute the flattened node list.
      let nodes = root.descendants();

      let height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

      d3.select("svg").transition()
        .duration(duration)
        .attr("height", height);

      d3.select(self.frameElement).transition()
        .duration(duration)
        .style("height", height + "px");

      // Compute the "layout". TODO https://github.com/d3/d3-hierarchy/issues/67
      let index = -1;
      this.root.eachBefore(function (n:any) {
        n.x = ++index * barHeight;
        n.y = n.depth * 20;
      });

      // Update the nodes…
      let node = svg.selectAll(".node")
        .data(nodes, function (d: any) { return d.id || (d.id = ++i); });

      let nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .style("opacity", 0);


      // Enter any new nodes at the parent's previous position.
      nodeEnter.append("rect")
        .attr("y", -barHeight / 2)
        .attr("height", barHeight)
        .attr("width", barWidth)
        .style("fill", color)
        .on("click", click);

      nodeEnter.append("text")
        .attr("dy", 5)
        .attr("dx", 5.5)
        .text(function (d: any) { return d.data.name; });

      // Transition nodes to their new position.
      nodeEnter.transition()
        .duration(duration)
        .attr("transform", function (d: any) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1);

      node.transition()
        .duration(duration)
        .attr("transform", function (d: any) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1)
        .select("rect")
        .style("fill", color);

      // Transition exiting nodes to the parent's new position.
      node.exit().transition()
        .duration(duration)
        .attr("transform", function (d: any) { return "translate(" + source.y + "," + source.x + ")"; })
        .style("opacity", 0)
        .remove();

      // Update the links…
      var link = svg.selectAll(".link")
        .data(root.links(), function (d: any) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
        .attr("class", "link")
        .style('fill', 'none')
        .style('stroke', '#ccc')
        .style('stroke-width', '2px')
        .attr("d", function (d) {
          var o = { x: source.x0, y: source.y0 };
          return diagonal(<any>{ source: o, target: o });
        })
        .transition()
        .duration(duration)
        .attr("d", this.diagonal);

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr("d", this.diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
          var o = { x: source.x, y: source.y };
          return diagonal(<any>{ source: o, target: o });
        })
        .remove();


      // Stash the old positions for transition.
      this.root.each(function (d: any) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      update(this.root);
    }


    // Toggle children on click.
    function click(d: any) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

    function color(d: any) {
      return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
    }

    function moveChildren(node: any) { // https://stackoverflow.com/questions/19423396/d3-js-how-to-make-all-the-nodes-collapsed-in-collapsible-indented-tree
      if (node.children) {
        node.children.forEach(function (c: any) { moveChildren(c); });
        node._children = node.children;
        node.children = null;
      }
    }

  }

}
function diagonal(arg0: any): string | number | boolean | null {
  throw new Error('Function not implemented.');
}

