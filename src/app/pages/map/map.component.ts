import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { AppConstants } from 'src/core/AppConstants';
import { ChartBuilderHelper } from 'src/core/helpers/chart-builder-helper';
import { DataHelper } from 'src/core/helpers/data-helper';
import { CompanyDatum } from 'src/core/models/company-datum';
import { Country } from 'src/core/models/country';
import { DataProviderService } from 'src/core/services/data-provider.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private id = 'map-chart';
  private data: CompanyDatum[];
  private countryData: Country[] = [];

  public dateFormat = AppConstants.DATE_FORMAT;
  public isPopupVisible: boolean = false;
  public dateFromFilter!: any;
  public dateToFilter!: any;

  private worldGeo: Array<any>;

  constructor(
    private dataProviderService: DataProviderService
  ) {
    this.worldGeo = this.dataProviderService.worldGeo;
    this.data = this.dataProviderService.data;
    this.dateFromFilter = DataHelper.getMinDate(this.data.map(x => x.date));
    this.dateToFilter = DataHelper.getMaxDate(this.data.map(x => x.date));
  }

  public togglePopup(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  private areFiltersValid() {
    return this.dateFromFilter &&
      this.dateToFilter
  }

  public applyFilter() {
    this.initChart();
  }

  private initChart() {
    if (!this.areFiltersValid()) {
      return;
    }
    d3.select(`#${this.id}`).selectChildren().remove();

    const filteredCompanyData = DataHelper.filterCompanyDataByTime(this.data, this.dateFromFilter, this.dateToFilter) ?? [];
    const companies = DataHelper.unifyCompanyData(filteredCompanyData) ?? [];
    this.countryData = DataHelper.unifyCountryLayoffs(companies) ?? [];

    const maxLayoff = DataHelper.getMaxObjectBy(this.countryData, Country.total_laid_off).total_laid_off;

    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    var projection = d3.geoMercator()
      .center([0, 40])
      .scale(100)
      .translate([width / 2, height / 2])

    var path = d3.geoPath()
      .projection(projection);

    const colorScale = d3.scalePow()
      .exponent(0.5)
      .domain([0, maxLayoff])
      .range([0, 1]);

    const colorInterpolator = d3.interpolateHsl(d3.hsl("white"), d3.hsl("black"));
    const getColor = (value: number) => colorInterpolator(colorScale(value)) as string;

    const data: any = this.worldGeo;

    const svg = d3.select("#map-chart").append("svg")
      .attr("viewBox", [0, 0, width, height])
      .on("click", reset)

    if (this.countryData.length < 1) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("No data");
      return;
    }

    const zoom = d3.zoom()
      .scaleExtent([1, 4])
      .translateExtent([[0, 0], [width, height]])
      .on("zoom", zoomed);

    const tooltipStructure =
      ChartBuilderHelper.getTooltipStructure(
        this.id,
        (event: any, d: any) => {
          const item = this.countryData.filter(x => x.country_code == d.id)[0];
          if (!item) {
            return `
              <div>
              <span><b>${d.properties.name}</b></span><br>
              <span>No data</span>
              </div>
            `;
          }
          return `
            <div>
            <span><b>${item.country}</b></span><br>
            <span>${item.total_laid_off} layoffs</span>
            </div>
            `;
        }
      )

    const g = svg.append("g");

    const states = g.append("g")
      .attr("cursor", "pointer")
      .selectAll("path")
      .data(data.features)
      .join("path")
      .attr("d", d3.geoPath()
        .projection(projection) as any
      )
      .attr("fill", (d: any) => {
        var total = 0;
        var temp = this.countryData.filter(x => x.country_code == d.id)[0];
        if (temp) {
          total = temp.total_laid_off;
        }
        return getColor(total);
      })
      .style("stroke", "black")
      .style("stroke-width", 0.5)
      .on("click", clicked)
      .on("mouseover", tooltipStructure.mouseover)
      .on("mousemove", tooltipStructure.mousemove)
      .on("mouseleave", tooltipStructure.mouseleave)

    svg.call(zoom as any);

    var inactive = 0;
    const countyNameEl = d3.select("body").append("div");

    function reset() {
      states.transition().style("fill", null);
      svg.transition().duration(750).call(
        zoom.transform as any,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node() as any).invert([width / 2, height / 2])
      );
      countyNameEl.html("");
    }

    function clicked(event: any, d: any) {
      countyNameEl.html(d.properties.gn_name);

      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      states.transition().style("fill", null);
      d3.select(event.currentTarget).transition().style("fill", AppConstants.PRIMARY_COLOR);
      svg.transition().duration(500).call(
        zoom.transform as any,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(4, 1 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
      );

      inactive = inactive + 1;

      setTimeout(() => {
        resetIfInactive();
      }, (10000));
    }

    function resetIfInactive() {
      inactive--
      if (inactive == 0) {
        reset()
      }
    }

    function zoomed(event: any) {

      var transform = event.transform;

      g.attr("transform", transform);
    }
  }

  ngOnInit(): void {
    this.initChart();
  }
}
