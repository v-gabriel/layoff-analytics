import * as d3 from "d3";
import { AppConstants } from "../AppConstants";
import { Company } from "../models/company";
import { CompanyDatum } from "../models/company-datum";
import { Country } from "../models/country";
import { IDateLayoff } from "../models/date-layoff";
import { IDateStringLayoff } from "../models/date-string-layoff";
import { IMonthLayoff } from "../models/month-layoff";

export class DataHelper {

  /**
* Filters company data by selected time difference.
* @param data Dataset object
* @returns
*/
  public static filterCompanyDataByTime(data: Array<CompanyDatum>, dateFrom: Date, dateTo: Date) {

    return data.filter(x => {
      const date = this.getDate(x.date);
      return date.getTime() <= dateTo.getTime() && date.getTime() >= dateFrom.getTime();
    })
  }

  /**
  * Unifies companies
  * @param data Dataset object
  * @returns
  */
  public static unifyCompanyData(data: Array<CompanyDatum>): Company[] {
    var output: Company[] = [];
    data.forEach(function (item: CompanyDatum) {
      var existing = output.filter(function (v, i) {
        return v.company == item.company;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].total_laid_off = output[existingIndex].total_laid_off + item.total_laid_off;
        output[existingIndex].funds_raised = output[existingIndex].funds_raised + item.funds_raised;
      } else {
        output.push({ ...item as Company });
      }
    });
    return output;
  }

  public static getMaxObjectBy(data: Array<any>, propertyName: string): any {
    const result = data.reduce(function (p, c) {
      var prev = p as any;
      var current = c as any;
      return (prev[propertyName]! > current[propertyName]!) ? prev : current
    })

    return result;
  }

  public static getMinDate(dates: Array<string>): Date | null {
    const data = dates.map(x => DataHelper.getDate(x));
    const result = d3.min(data, d => d) ?? null;

    return result;
  }

  public static getMaxDate(dates: Array<string>): Date | null {
    const data = dates.map(x => DataHelper.getDate(x));
    const result = d3.max(data, d => d) ?? null;

    return result;
  }

  public static getMonthLayoffDataset(data: Array<CompanyDatum>): IMonthLayoff[] {
    const timelineValues = this.unifyMonthLayoffs(data);

    return timelineValues;
  }

  /**
* Unifies layoff values recorded in the same month
* @param data Dataset object
* @returns
*/
  private static unifyMonthLayoffs(data: Array<CompanyDatum>): IMonthLayoff[] {
    var output: IMonthLayoff[] = [];
    data.forEach((item: CompanyDatum) => {
      const date = DataHelper.getDate(item.date);
      var existing = output.filter(function (v, i) {
        return v.month == date.getMonth() + 1 && v.year == date.getFullYear();
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].layoff = output[existingIndex].layoff + item.total_laid_off;
      } else {
        output.push(...[{
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          layoff: item.total_laid_off
        }]);
      }
    });
    return output;
  }

  public static getDateLayoffDataset(data: Array<CompanyDatum>): IDateLayoff[] {
    const timelineValues = this.unifyDateLayoffs(data);

    const result = timelineValues.map(x => {
      return { date: this.getDate(x.date), layoff: x.value }
    });

    return result;
  }

  /**
  * Unifies layoff values recorded on the same day but with different company
  * @param data Dataset object
  * @returns
  */
  private static unifyDateLayoffs(data: Array<CompanyDatum>): IDateStringLayoff[] {
    var output: IDateStringLayoff[] = [];
    data.forEach((item: CompanyDatum) => {
      var existing = output.filter(function (v, i) {
        return v.date == item.date;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].value = output[existingIndex].value + item.total_laid_off;
      } else {
        output.push(...[{
          date: item.date,
          value: item.total_laid_off
        }]);
      }
    });

    return output;
  }

  /**
* Unifies companies per country
* @param data Dataset object
* @returns
*/
  public static unifyCountryLayoffs(data: Array<Company>): Country[] {
    const output: Array<Country> = [];
    data.forEach((item: Company) => {
      var existing = output.filter(function (v, i) {
        return v.country_code == item.country_code;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].total_laid_off = output[existingIndex].total_laid_off + item.total_laid_off;
        output[existingIndex].funds_raised = output[existingIndex].funds_raised + item.funds_raised;
      } else {
        output.push({ ...item });
      }
    });

    return output;
  }

  public static getDate(value: string) {
    return d3.timeParse(AppConstants.D3_DATE_FORMAT)(value)!;
  }
}
