export class AppConstants {
  public static readonly JSON_DATA_PATH: string = '/src/core/data/data.json';
  public static readonly D3_DATE_FORMAT: string = "%d/%m/%Y";
  public static readonly DATE_FORMAT: string = "dd/MMM/yyyy";
  public static readonly BAR_CHART_MAX_UNITS = 30;
  public static readonly COUNTRY_CODES: Map<string, string> = new Map<string, string>([
    ["United States", "USA"],
    ["Australia", "AUS"],
    ["India", "IND"],
    ["Germany", "DEU"],
    ["France", "FRA"],
    ["United Kingdom", "GBR"],
    ["Chile", "CHL"],
    ["Spain", "ESP"],
    ["Ireland", "IRL"],
    ["Canada", "CAN"],
    ["New Zealand", "NZL"],
    ["Brazil", "BRA"],
    ["Sweden", "SWE"],
    ["South Korea", "KOR"],
    ["Israel", "ISR"],
    ["Indonesia", "IDN"],
    ["Estonia", "EST"],
    ["Singapore", "SGP"],
    ["China", "CHN"],
    ["Argentina", "ARG"],
    ["Nigeria", "NGA"],
    ["Kenya", "KEN"],
    ["Norway", "NOR"],
    ["Denmark", "DNK"],
    ["Thailand", "THA"],
    ["Senegal", "SEN"],
    ["Hong Kong", "HKG"],
    ["United Arab Emirates", "ARE"],
    ["Austria", "AUT"],
    ["Finland", "FIN"],
    ["Malaysia", "MYS"],
    ["Mexico", "MEX"],
    ["Russia", "RUS"],
    ["Seychelles", "SYC"],
    ["Netherlands", "NLD"],
    ["Switzerland", "CHE"],
    ["Portugal", "PRT"]
  ]);

  public static readonly PRIMARY_COLOR = "#1f77b4";
  public static readonly COLOR_RANGE: [string, string] = ["#4D82B8", "#E94C4C"];
}
