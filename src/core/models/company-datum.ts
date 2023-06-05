export class CompanyDatum {
  public id!: number;
  public location!: string;
  public company!: string;
  public total_laid_off!: number;
  public industry!: string;
  public date!: string;
  public percentage_laid_off!: number;
  public country!: string;
  public stage!: string;
  public funds_raised!: number;
  public country_code!: string;

  public static id = "id";
  public static location = "location";
  public static company = "company";
  public static total_laid_off = "total_laid_off";
  public static industry = "industry";
  public static date = "date";
  public static percentage_laid_off = "percentage_laid_off";
  public static country = "country";
  public static stage = "stage";
  public static funds_raised = "funds_raised";
  public static country_code = "country_code";

}
