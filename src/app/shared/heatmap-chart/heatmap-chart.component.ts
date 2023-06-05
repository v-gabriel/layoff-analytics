import { Component } from '@angular/core';
import * as d3 from 'd3';
import { AppConstants } from 'src/core/AppConstants';
import { ChartBuilderHelper } from 'src/core/helpers/chart-builder-helper';
import { DataHelper } from 'src/core/helpers/data-helper';
import { CompanyDatum } from 'src/core/models/company-datum';
import { DataProviderService } from 'src/core/services/data-provider.service';

@Component({
  selector: 'app-heatmap-chart',
  templateUrl: './heatmap-chart.component.html',
  styleUrls: ['./heatmap-chart.component.scss']
})
export class HeatmapChartComponent {

  private id = 'heatmap-chart';
  private unfilteredData: CompanyDatum[];

  constructor(
    private dataProviderService: DataProviderService
  ) {
    this.unfilteredData = dataProviderService.data;
  }

  private initChart() {
    const margin = ChartBuilderHelper.margin;
    const space = ChartBuilderHelper.space;
    const svg = ChartBuilderHelper.GetBase(this.id);

    const data = DataHelper.getMonthLayoffDataset(this.unfilteredData).map(x => {
      return {
        variable: `${x.year}`,
        group: `${x.month}`,
        value: x.layoff
      }
    });
    const maxLayoff = DataHelper.getMaxObjectBy(data, "value").value;
    const myGroups = [...Array.from(Array(12).keys()).map(x => `${x = x + 1}`)];
    const myVars = [...new Set(data.map(x => { return `${x.variable}` }))];

    const x = d3.scaleBand()
      .range([0, space.width])
      .domain(myGroups)
      .padding(0.01);
    svg.append("g")
      .attr("transform", `translate(0, ${space.height})`)
      .call(d3.axisBottom(x))

    const y = d3.scaleBand()
      .range([space.height, 0])
      .domain(myVars)
      .padding(0.01);
    svg.append("g")
      .call(d3.axisLeft(y));

    const dataRange: [number, number] = [0, maxLayoff];
    const colorScale = d3.scalePow()
      .exponent(0.5)
      .domain(dataRange)
      .range([0, 1]);

    const colorInterpolator = d3.interpolateHsl(d3.hsl(AppConstants.COLOR_RANGE[0]), d3.hsl(AppConstants.COLOR_RANGE[1]));
    const getColor = (value: number) => colorInterpolator(colorScale(value)) as string;

    const tooltip = d3.select("#heatmap-chart")
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
        .html(`${d.value} layoffs`)
        .style("position", "absolute")
        .style("left", (d3.pointer(event, d)[0] + 10) + "px")
        .style("top", (d3.pointer(event, d)[1] + -40) + "px")
    }

    const mouseleave = function (d: any) {
      tooltip.style("display", "none")
    }

    svg.selectAll()
      .data(data, function (d: any) { return d.group ?? "" + ':' + d.variable ?? ""; })
      .enter()
      .append("rect")
      .attr("x", function (d: any) { return x(d.group) ?? "" })
      .attr("y", function (d: any) { return y(d.variable) ?? "" })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d: any) { return getColor(d.value) ?? "" })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

    ChartBuilderHelper.addLegend(svg, dataRange, [getColor(dataRange[0]), getColor(dataRange[1])]);

    ChartBuilderHelper.xAxisLabel(svg, "Month");
    ChartBuilderHelper.yAxisLabel(svg, "Year");
    ChartBuilderHelper.label(svg, "Monthly layoffs");
  }

  ngOnInit() {
    this.initChart();
  }
}
