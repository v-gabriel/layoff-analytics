import * as d3 from "d3";
import { IMargin } from "../models/margin";
import { ISpace } from "../models/space";

export class ChartBuilderHelper {

  public static readonly margin: IMargin = { top: 70, right: 100, bottom: 110, left: 100 };
  public static readonly space: ISpace = {
    width: 550,
    height: 350
  }

  public static readonly legendSpace = {
    width: 20,
    height: this.space.height / 2
  }
  public static readonly legendMargin: IMargin = { top: 40, right: 10, bottom: 40, left: 10 };

  public static GetBase(elementId: string, space: ISpace = this.space, margin: IMargin = this.margin) {
    const svg = d3.select(`#${elementId}`)
      .append("svg")
      .attr("width", space.width + margin.left + margin.right)
      .attr("height", space.height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    return svg;
  }

  public static yAxisLabel(svg: any, label: string, space: ISpace = this.space, margin: IMargin = this.margin, rightOffset = 0) {

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - space.height / 2)
      .attr("y", 0 - margin.left + 40 - rightOffset)
      .style("text-anchor", "middle")
      .text(label);
  }

  public static xAxisLabel(svg: any, label: string, space: ISpace = this.space, margin: IMargin = this.margin, topOffset = 0) {

    svg
      .append("text")
      .attr("x", space.width / 2)
      .attr("y", space.height + margin.top + topOffset - 20)
      .style("text-anchor", "middle")
      .text(label);
  }

  public static label(svg: any, label: string, space: ISpace = this.space, margin: IMargin = this.margin) {
    const title = svg.select(".chart-title");
    if (!title.empty()) {
      title.text(label);
      return;
    }

    svg.append("text")
      .attr("class", "chart-title")
      .attr("text-anchor", "middle")
      .attr("x", space.width / 2)
      .attr("y", -margin.top + 40)
      .text(label);
  }

  public static getTooltipStructure(elementId: string, displayExpression: (event: any, d: any) => string) {
    const tooltip = d3.select(`#${elementId}`)
      .append("div")
      .style("display", "none")
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "1px solid rgb(92 92 92 / 42%)")
      .style("opacity", 1)
      .style("padding", "5px")

    const mouseover = function (event: any, d: any) {
      tooltip.style("display", "block")
    }

    const mousemove = function (event: any, d: any) {
      tooltip
        .html(displayExpression(event, d))
        .style("position", "absolute")
        .style("left", (d3.pointer(event, d)[0] + 20) + "px")
        .style("top", (d3.pointer(event, d)[1] + -30) + "px")
    }

    const mouseleave = function (d: any) {
      tooltip.style("display", "none")
    }

    return {
      element: tooltip,
      mouseover: mouseover,
      mousemove: mousemove,
      mouseleave: mouseleave
    }
  }

  public static addLegend(
    svg: any,
    dataRange: [number, number],
    colorRange: [string, string],
    legendSpace: ISpace = this.legendSpace,
    legendMargin: IMargin = this.legendMargin,
  ) {

    var legendSvg = svg.append("svg")
      .attr("width", legendSpace.width + legendMargin.right + legendMargin.left)
      .attr("height", legendSpace.height + legendMargin.bottom + legendMargin.top)
      .attr("x", svg.node().getBoundingClientRect().width)
      .append("g")
      .attr("transform", `translate(${legendMargin.left}, ${legendMargin.top})`);

    var gradient = legendSvg.append("defs")
      .append("linearGradient")
      .attr("id", "color-gradient")
      .attr("gradientTransform", "rotate(90)");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", colorRange[1]);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colorRange[0]);

    legendSvg.append("rect")
      .attr("width", legendSpace.width)
      .attr("height", legendSpace.height - 20)
      .attr("transform", `translate(0, 10)`)
      .style("fill", "url(#color-gradient)");

    var legendText = legendSvg.selectAll(null)
      .data(dataRange)
      .enter()
      .append("text")
      .attr("x", (legendSpace.width / 2))
      .attr("y", function (d: any) { return (1 - (d - dataRange[0]) / (dataRange[1] - dataRange[0])) * legendSpace.height + 5 })
      .style("text-anchor", "middle")
      .style("fill", "#000")
      .text(function (d: any) { return d; });
  }
}
