import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as DATA from "../../core/data/data.json";
import * as WORLD_GEO_DATA from "../../core/data/world_geo.json";
import { AppConstants } from '../AppConstants';
import { DataHelper } from '../helpers/data-helper';
import { Company } from '../models/company';
import { CompanyDatum } from '../models/company-datum';

/** GeoJson provided from: https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson
 *
 */
@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  private _data: Array<CompanyDatum> = [];
  private _companies: Array<Company> = [];

  private _worldGeo: any;

  public get companies() {
    return this._companies;
  }

  public get data() {
    return this._data;
  }

  public get worldGeo() {
    return this._worldGeo;
  }

  constructor(
    private jsonPipe: JsonPipe
  ) {
    this._worldGeo = JSON.parse(this.jsonPipe.transform(WORLD_GEO_DATA));

    var id = -1;
    const rawData: CompanyDatum[] = Array.from(JSON.parse(this.jsonPipe.transform(DATA)));
    this._data = rawData.map((x: CompanyDatum) => {
      id += 1;
      return {
        ...x,
        id: id,
        country_code: AppConstants.COUNTRY_CODES.get(x.country) ?? ""
      }
    });

    id = -1;
    this._companies = DataHelper.unifyCompanyData(rawData).map(x => {
      id += 1;
      return {
        ...x,
        id: id,
        country_code: AppConstants.COUNTRY_CODES.get(x.country) ?? ""
      }
    })
  }
}
