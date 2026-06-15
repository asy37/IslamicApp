export type HijriDate = {
  date: string;
  format: string;
  day: string;

  weekday: {
    en: string;
    ar: string;
  };

  month: {
    number: number;
    en: string;
    ar: string;
    days: number;
  };

  year: string;

  designation: {
    abbreviated: string;
    expanded: string;
  };

  holidays: string[];
  adjustedHolidays: string[];
  method: string;
};
export type GregorianDate = {
  date: string;
  format: string;
  day: string;

  weekday: {
    en: string;
  };

  month: {
    number: number;
    en: string;
  };

  year: string;

  designation: {
    abbreviated: string;
    expanded: string;
  };

  lunarSighting: boolean;
};
export type PrayerDate = {
  readable: string;
  timestamp: string;

  hijri: HijriDate;
  gregorian: GregorianDate;
};
