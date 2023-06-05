import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CompanyDatum } from 'src/core/models/company-datum';
import { JsonPipe, ViewportScroller } from '@angular/common';
import { DataProviderService } from 'src/core/services/data-provider.service';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { BehaviorSubject, lastValueFrom, Observable, of } from 'rxjs';
import { DxDataGridComponent } from 'devextreme-angular';
import { DataHelper } from 'src/core/helpers/data-helper';
import { ChangeEvent } from 'devextreme/ui/drop_down_box';
import { SelectionChangedEvent } from 'devextreme/ui/select_box';
import { Company } from 'src/core/models/company';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public isExpanded = false;

  constructor(
    private scroller: ViewportScroller,
  ) {
  }

  public scrollTo(name: string) {
    this.scroller.scrollToAnchor(name);
  }

  public toggleHamburger() {
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit(): void {
  }
}
