import { Component } from '@angular/core';
import * as d3 from 'd3';
import { CompanyDatum } from 'src/core/models/company-datum';
import { ChartBuilderHelper } from 'src/core/helpers/chart-builder-helper';
import { DataHelper } from 'src/core/helpers/data-helper';
import { DatePipe } from '@angular/common';
import { AppConstants } from 'src/core/AppConstants';
import { DataProviderService } from 'src/core/services/data-provider.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {

  private unfilteredData: CompanyDatum[];

  constructor(
    private datePipe: DatePipe,
    private dataProviderService: DataProviderService
  ) {
    this.unfilteredData = dataProviderService.data;
  }

  private initChart() {
    const margin = ChartBuilderHelper.margin;
    const space = ChartBuilderHelper.space;
    const svg = ChartBuilderHelper.GetBase('line-chart');

    const data = DataHelper.getDateLayoffDataset(this.unfilteredData);

    const x = d3.scaleTime()
      .domain(<[Date, Date]>d3.extent(data, function (d) { return d.date; }))
      .range([0, space.width]);
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + space.height + ")")
      .call(d3.axisBottom(x).tickFormat(x => {
        const date = x as Date;
        return this.datePipe.transform(date, AppConstants.DATE_FORMAT) ?? ""
      }).ticks(7));

    xAxis.selectAll("text")
      .attr("transform", "translate(-15,20)rotate(-45)")

    const domain = [0, d3.max(data, function (d) { return +d.layoff; }) ?? 0];
    var y = d3.scaleLinear()
      .domain(domain)
      .range([space.height, 0]);
    var yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    const clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", space.width)
      .attr("height", space.height)
      .attr("x", 0)
      .attr("y", 0);


    var idleTimeout: any = null;
    function idled() { idleTimeout = null; }

    const updateChart = (event: any, d: any) => {

      var extent = event.selection

      if (!extent) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 200);
        x.domain([0, 0])
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])])
        line.select(".brush").call(brush.move as any, null)
      }

      xAxis.call(d3.axisBottom(x).tickFormat(x => {
        const date = x as Date;
        return this.datePipe.transform(date, AppConstants.DATE_FORMAT) ?? "";
      }))

      xAxis.selectAll("text")
        .attr("transform", "translate(-15,20)rotate(-45)")
      line
        .select('.line')
        .transition()
        .duration(500)
        .attr("d", d3.line<any>()
          .x(function (d) { return x(d.date) })
          .y(function (d) { return y(d.layoff) })
        )

      return;
    }

    const brush = d3.brushX()
      .extent([[0, 0], [space.width, space.height]])
      .on("end", updateChart)

    const line: any = svg.append('g')
      .attr("clip-path", "url(#clip)")

    line.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", AppConstants.PRIMARY_COLOR)
      .attr("stroke-width", 1)
      .attr("d", d3.line<any>()
        .x(function (d) { return x(d.date) })
        .y(function (d) { return y(d.layoff) })
      )

    line
      .append("g")
      .attr("class", "brush")
      .call(brush);

    svg.on("dblclick", () => {
      x.domain(<[Date, Date]>d3.extent(data, function (d) { return d.date; }))
      xAxis.call(d3.axisBottom(x).tickFormat(x => {
        const date = x as Date;
        return this.datePipe.transform(date, AppConstants.DATE_FORMAT) ?? "";

      }));

      xAxis.selectAll("text")
        .attr("transform", "translate(-15,20)rotate(-45)")
      line
        .select('.line')
        .transition()
        .attr("d", d3.line<any>()
          .x(function (d) { return x(d.date) })
          .y(function (d) { return y(d.layoff) })
        )
    });

    ChartBuilderHelper.xAxisLabel(svg, "Date", undefined, undefined, 30);
    ChartBuilderHelper.yAxisLabel(svg, "Layoffs");
    ChartBuilderHelper.label(svg, "Layoffs from 2020. - 2023.");
  }

  ngOnInit(): void {
    this.initChart();
  }
}
