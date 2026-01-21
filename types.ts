
export type HolidayType = 'federal' | 'religious' | 'cultural';

export interface Holiday {
  name: string;
  type: HolidayType;
  region: string;
}

export interface HolidayWithDate extends Holiday {
  date: string;
}

export interface HolidayMap {
  [date: string]: Holiday[];
}

export interface YearlyHolidayData {
  [year: number]: HolidayMap;
}

export enum ViewMode {
  CALENDAR = 'calendar',
  LIST = 'list',
  SEARCH = 'search',
  MAP = 'map'
}
