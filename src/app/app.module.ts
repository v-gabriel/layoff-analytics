import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LineChartComponent } from './shared/line-chart/line-chart.component';
import { PrettyJsonPipe } from 'src/core/pipes/pretty-json.pipe';
import { DatePipe, JsonPipe } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule, DxPopupModule, DxToastModule, DxTreeViewModule } from 'devextreme-angular';
import { DataProviderService } from 'src/core/services/data-provider.service';
import { BarChartComponent } from './shared/bar-chart/bar-chart.component';
import { HeatmapChartComponent } from './shared/heatmap-chart/heatmap-chart.component';
import { NgbDropdownModule, NgbModule, NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { MapComponent } from './pages/map/map.component';

@NgModule({
  declarations: [
    PrettyJsonPipe,
    AppComponent,
    HomeComponent,
    LineChartComponent,
    BarChartComponent,
    HeatmapChartComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DxDateBoxModule,
    DxTreeViewModule,
    DxDropDownBoxModule,
    DxDataGridModule,
    DxButtonModule,
    NgbModule,
    NgbDropdownModule,
    DxPopupModule,
    DxToastModule,
    NgbNavModule
  ],
  providers: [
    DatePipe,
    JsonPipe,
    DataProviderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
