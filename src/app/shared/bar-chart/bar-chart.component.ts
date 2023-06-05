import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DxoGridComponent } from 'devextreme-angular/ui/nested';
import { SelectionChangedEvent } from 'devextreme/ui/data_grid';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConstants } from 'src/core/AppConstants';
import { ChartBuilderHelper } from 'src/core/helpers/chart-builder-helper';
import { DataHelper } from 'src/core/helpers/data-helper';
import { Company } from 'src/core/models/company';
import { DataProviderService } from 'src/core/services/data-provider.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  private id = "bar-chart";
  private svg: any;
  private selectedCompanies: Array<Company> | null = [];

  public isPopupVisible: boolean = false;
  public isToastVisible: boolean = false;
  public dateFormat = AppConstants.DATE_FORMAT;
  public companiesSubject!: BehaviorSubject<Array<Company> | null>;
  public companies$: Observable<Array<Company> | null>;
  public selectedCompanyIds: number[] = [];
  public selectedRowKeys: any[] = [];
  public dateFromFilter!: any;
  public dateToFilter!: any;

  private data: Array<Company> = [];

  @ViewChild("multiSelectCompanyGrid")
  public companyDataGrid!: DxoGridComponent;

  constructor(
    private dataProviderService: DataProviderService,
    private datePipe: DatePipe
  ) {
    const data = this.dataProviderService.data;
    this.companiesSubject = new BehaviorSubject<Array<Company> | null>(dataProviderService.companies);
    this.companies$ = this.companiesSubject.asObservable();
    this.dateFromFilter = DataHelper.getMinDate(data.map(x => x.date));
    this.dateToFilter = DataHelper.getMaxDate(data.map(x => x.date));
  }

  public applyFilter() {
    this.initChart();
  }

  private activateToast() {
    this.isToastVisible = true;
  }

  public updateCompanies() {
    if (!(this.dateFromFilter && this.dateToFilter)) { return; }

    var filteredCompanyData = DataHelper.filterCompanyDataByTime(this.dataProviderService.data, this.dateFromFilter, this.dateToFilter);
    const data = DataHelper.unifyCompanyData(filteredCompanyData);
    this.data = data;

    this.selectedRowKeys = [];
    this.selectedCompanies = [];
    this.selectedCompanyIds = [];

    this.companiesSubject.next(data);
  }

  public onCompanyChange(event: SelectionChangedEvent<Company, Company>) {
    if (event?.selectedRowKeys && event?.selectedRowKeys.length > AppConstants.BAR_CHART_MAX_UNITS) {
      this.activateToast();
      return;
    }
    this.selectedCompanyIds = event.selectedRowKeys.map(x => x.id);
    this.selectedCompanies = this.data.filter(x => this.selectedCompanyIds.includes(x.id));
  }


  public togglePopup(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  private initChart() {
    var data: Company[] | null = [];

    data = this.selectedCompanies;

    if (this.svg) {
      d3.select(`#${this.id}`).selectChildren().remove();
    }

    const space = ChartBuilderHelper.space;
    this.svg = ChartBuilderHelper.GetBase(this.id);

    if (!data?.length) {
      this.svg.append("text")
        .attr("x", space.width / 2)
        .attr("y", space.height / 2)
        .attr("text-anchor", "middle")
        .text("No data");
      return;
    }

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return +d.total_laid_off; }) ?? 0])
      .range([0, space.width]);

    this.svg.append("g")
      .attr("transform", `translate(0, ${space.height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end");

    const y = d3.scaleBand()
      .range([0, space.height])
      .domain(data.map((d: Company) => { return d.company }))
      .padding(.1);
    this.svg.append("g")
      .call(d3.axisLeft(y))

    this.svg.selectAll("myRect")
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d: Company) => y(d.company) ?? 0)
      .attr("width", (d: Company) => x(d.total_laid_off))
      .attr("height", y.bandwidth())
      .attr("fill", AppConstants.PRIMARY_COLOR)
      .attr("width", (d: Company) => 0)

    this.svg.selectAll("rect")
      .transition()
      .duration(400)
      .attr("width", (d: any) => x(d.total_laid_off))
      .delay((d: any, i: any) => { return i * 40 })

    ChartBuilderHelper.xAxisLabel(this.svg, "Total layoffs", undefined, undefined, 20);
    ChartBuilderHelper.yAxisLabel(this.svg, "Company", undefined, undefined, 20);
    const label = `Total layoffs from ${this.datePipe.transform(this.dateFromFilter as Date)}
        to ${this.datePipe.transform(this.dateToFilter as Date)}`;
    ChartBuilderHelper.label(
      this.svg,
      label
    );
  }

  ngOnInit(): void {
    this.updateCompanies();
    this.initChart();
  }
}
