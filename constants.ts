
import { HolidayMap, YearlyHolidayData, Holiday } from './types';

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const REGION_COORDINATES: { [key: string]: [number, number] } = {
  'Global': [20.0, 0.0],
  'International': [10.0, -20.0],
  'USA': [37.0902, -95.7129],
  'Canada': [56.1304, -106.3468],
  'Mexico': [23.6345, -102.5528],
  'Brazil': [-14.2350, -51.9253],
  'Peru': [-9.1900, -75.0152],
  'UK': [55.3781, -3.4360],
  'France': [46.2276, 2.2137],
  'Germany': [51.1657, 10.4515],
  'Ireland': [53.1424, -7.6921],
  'Spain': [40.4637, -3.7492],
  'Italy': [41.8719, 12.5674],
  'Greece': [39.0742, 21.8243],
  'China': [35.8617, 104.1954],
  'Japan': [36.2048, 138.2529],
  'South Korea': [35.9078, 127.7669],
  'Vietnam': [14.0583, 108.2772],
  'Thailand': [15.8700, 100.9925],
  'India': [21.0, 78.0],
  'Iran': [32.4279, 53.6880],
  'Saudi Arabia': [23.8859, 45.0792],
  'Egypt': [26.8206, 30.8025],
  'Ethiopia': [9.1450, 40.4897],
  'Nigeria': [9.0820, 8.6753],
  'South Africa': [-30.5595, 22.9375],
  'Australia': [-25.2744, 133.7751],
  'New Zealand': [-40.9006, 174.8860],
  'Islamic': [23.0, 45.0],
  'Christian': [41.9, 12.4],
  'Hindu': [20.0, 78.0],
  'Jewish': [31.0, 34.8],
  'East Asia': [34.0, 100.0],
  'Persian': [32.42, 53.68]
};

const getFixedHolidays = (year: number): HolidayMap => {
  const h: HolidayMap = {};
  const add = (date: string, name: string, type: 'federal' | 'religious' | 'cultural', region: string) => {
    const d = `${year}-${date}`;
    if (!h[d]) h[d] = [];
    h[d].push({ name, type, region });
  };

  add('01-01', "New Year's Day", 'federal', 'Global');
  add('01-06', 'Epiphany', 'religious', 'Christian');
  add('01-07', 'Orthodox Christmas', 'religious', 'Global');
  add('01-26', 'Republic Day', 'federal', 'India');
  add('01-26', 'Australia Day', 'federal', 'Australia');
  add('02-02', 'Groundhog Day', 'cultural', 'USA');
  add('02-11', 'National Foundation Day', 'federal', 'Japan');
  add('02-14', "Valentine's Day", 'cultural', 'Global');
  add('02-24', 'Flag Day', 'federal', 'Mexico');
  add('03-01', "St. David's Day", 'cultural', 'UK');
  add('03-08', "International Women's Day", 'cultural', 'International');
  add('03-17', "St. Patrick's Day", 'cultural', 'Ireland');
  add('03-21', 'Nowruz (Persian New Year)', 'cultural', 'Persian');
  add('03-22', 'World Water Day', 'cultural', 'International');
  add('03-25', 'Independence Day', 'federal', 'Greece');
  add('04-01', "April Fool's Day", 'cultural', 'Global');
  add('04-07', 'World Health Day', 'cultural', 'International');
  add('04-13', 'Songkran Festival', 'cultural', 'Thailand');
  add('04-22', 'Earth Day', 'cultural', 'International');
  add('04-23', 'St. George Day', 'cultural', 'UK');
  add('04-25', 'ANZAC Day', 'federal', 'Australia');
  add('04-30', 'Children\'s Day', 'cultural', 'Mexico');
  add('05-01', 'Labour Day / May Day', 'federal', 'Global');
  add('05-03', 'Constitution Memorial Day', 'federal', 'Japan');
  add('05-05', 'Children\'s Day', 'federal', 'Japan');
  add('05-05', 'Cinco de Mayo', 'cultural', 'Mexico');
  add('05-08', 'Victory in Europe Day', 'federal', 'France');
  add('05-09', 'Victory Day', 'federal', 'Global');
  add('05-17', 'Constitution Day', 'federal', 'Norway');
  add('06-01', 'International Children\'s Day', 'cultural', 'Global');
  add('06-02', 'Republic Day', 'federal', 'Italy');
  add('06-05', 'World Environment Day', 'cultural', 'International');
  add('06-12', 'Independence Day', 'federal', 'Philippines');
  add('06-19', 'Juneteenth', 'federal', 'USA');
  add('06-24', 'St. Jean Baptiste Day', 'federal', 'Canada');
  add('07-01', 'Canada Day', 'federal', 'Canada');
  add('07-04', 'Independence Day', 'federal', 'USA');
  add('07-14', 'Bastille Day', 'federal', 'France');
  add('07-18', 'Nelson Mandela Day', 'cultural', 'International');
  add('07-20', 'Independence Day', 'federal', 'Colombia');
  add('08-01', 'Swiss National Day', 'federal', 'Switzerland');
  add('08-12', 'International Youth Day', 'cultural', 'International');
  add('08-15', 'Assumption of Mary', 'religious', 'Global');
  add('08-15', 'Independence Day', 'federal', 'India');
  add('08-17', 'Independence Day', 'federal', 'Indonesia');
  add('08-31', 'National Day', 'federal', 'Malaysia');
  add('09-07', 'Independence Day', 'federal', 'Brazil');
  add('09-11', 'Enkutatash (Ethiopian New Year)', 'cultural', 'Ethiopia');
  add('09-16', 'Grito de Dolores', 'federal', 'Mexico');
  add('09-18', 'Fiestas Patrias', 'federal', 'Chile');
  add('09-21', 'International Day of Peace', 'cultural', 'International');
  add('10-01', 'National Day', 'federal', 'China');
  add('10-03', 'German Unity Day', 'federal', 'Germany');
  add('10-10', 'World Mental Health Day', 'cultural', 'International');
  add('10-12', 'Hispanic Day', 'federal', 'Spain');
  add('10-24', 'United Nations Day', 'cultural', 'International');
  add('10-31', 'Halloween', 'cultural', 'Global');
  add('11-01', 'All Saints Day', 'religious', 'Christian');
  add('11-02', 'Day of the Dead', 'cultural', 'Mexico');
  add('11-11', 'Remembrance Day / Veterans Day', 'federal', 'Global');
  add('11-15', 'Republic Proclamation Day', 'federal', 'Brazil');
  add('11-19', 'International Men\'s Day', 'cultural', 'International');
  add('11-30', "St. Andrew's Day", 'cultural', 'UK');
  add('12-01', 'World AIDS Day', 'cultural', 'International');
  add('12-06', 'Independence Day', 'federal', 'Finland');
  add('12-08', 'Immaculate Conception', 'religious', 'Christian');
  add('12-10', 'Human Rights Day', 'cultural', 'International');
  add('12-24', 'Christmas Eve', 'religious', 'Global');
  add('12-25', 'Christmas Day', 'federal', 'Global');
  add('12-26', 'Boxing Day', 'federal', 'Global');
  add('12-31', "New Year's Eve", 'cultural', 'Global');

  return h;
};

export const HOLIDAYS_BY_YEAR: YearlyHolidayData = {
  2025: {
    ...getFixedHolidays(2025),
    '2025-01-20': [{ name: 'Martin Luther King Jr. Day', type: 'federal', region: 'USA' }],
    '2025-01-29': [{ name: 'Lunar New Year', type: 'cultural', region: 'East Asia' }],
    '2025-02-17': [{ name: 'Presidents\' Day', type: 'federal', region: 'USA' }],
    '2025-03-01': [{ name: 'Ramadan Begins', type: 'religious', region: 'Islamic' }],
    '2025-03-14': [{ name: 'Holi', type: 'religious', region: 'Hindu' }],
    '2025-03-31': [{ name: 'Eid al-Fitr', type: 'religious', region: 'Islamic' }],
    '2025-04-12': [{ name: 'Passover Begins', type: 'religious', region: 'Jewish' }],
    '2025-04-18': [{ name: 'Good Friday', type: 'religious', region: 'Global' }],
    '2025-04-20': [{ name: 'Easter Sunday', type: 'religious', region: 'Global' }],
    '2025-05-26': [{ name: 'Memorial Day', type: 'federal', region: 'USA' }],
    '2025-06-06': [{ name: 'Eid al-Adha', type: 'religious', region: 'Islamic' }],
    '2025-09-01': [{ name: 'Labor Day', type: 'federal', region: 'USA' }],
    '2025-09-22': [{ name: 'Rosh Hashanah', type: 'religious', region: 'Jewish' }],
    '2025-10-13': [{ name: 'Indigenous Peoples\' Day', type: 'federal', region: 'USA' }],
    '2025-10-20': [{ name: 'Diwali', type: 'religious', region: 'Hindu' }],
    '2025-11-27': [{ name: 'Thanksgiving', type: 'federal', region: 'USA' }],
    '2025-12-14': [{ name: 'Hanukkah Begins', type: 'religious', region: 'Jewish' }],
  },
  2026: {
    ...getFixedHolidays(2026),
    '2026-01-19': [{ name: 'Martin Luther King Jr. Day', type: 'federal', region: 'USA' }],
    '2026-02-16': [{ name: 'Presidents\' Day', type: 'federal', region: 'USA' }],
    '2026-02-17': [{ name: 'Lunar New Year', type: 'cultural', region: 'East Asia' }],
    '2026-02-18': [{ name: 'Ramadan Begins', type: 'religious', region: 'Islamic' }],
    '2026-03-03': [{ name: 'Holi', type: 'religious', region: 'Hindu' }],
    '2026-03-20': [{ name: 'Eid al-Fitr', type: 'religious', region: 'Islamic' }],
    '2026-04-02': [{ name: 'Passover Begins', type: 'religious', region: 'Jewish' }],
    '2026-04-03': [{ name: 'Good Friday', type: 'religious', region: 'Global' }],
    '2026-04-05': [{ name: 'Easter Sunday', type: 'religious', region: 'Global' }],
    '2026-05-25': [{ name: 'Memorial Day', type: 'federal', region: 'USA' }],
    '2026-05-27': [{ name: 'Eid al-Adha', type: 'religious', region: 'Islamic' }],
    '2026-09-07': [{ name: 'Labor Day', type: 'federal', region: 'USA' }],
    '2026-09-12': [{ name: 'Rosh Hashanah', type: 'religious', region: 'Jewish' }],
    '2026-10-12': [{ name: 'Indigenous Peoples\' Day', type: 'federal', region: 'USA' }],
    '2026-11-08': [{ name: 'Diwali', type: 'religious', region: 'Hindu' }],
    '2026-11-26': [{ name: 'Thanksgiving', type: 'federal', region: 'USA' }],
    '2026-12-05': [{ name: 'Hanukkah Begins', type: 'religious', region: 'Jewish' }],
  },
  2027: {
    ...getFixedHolidays(2027),
    '2027-01-18': [{ name: 'Martin Luther King Jr. Day', type: 'federal', region: 'USA' }],
    '2027-02-06': [{ name: 'Lunar New Year', type: 'cultural', region: 'East Asia' }],
    '2027-02-08': [{ name: 'Ramadan Begins', type: 'religious', region: 'Islamic' }],
    '2027-02-15': [{ name: 'Presidents\' Day', type: 'federal', region: 'USA' }],
    '2027-03-10': [{ name: 'Eid al-Fitr', type: 'religious', region: 'Islamic' }],
    '2027-03-22': [{ name: 'Holi', type: 'religious', region: 'Hindu' }],
    '2027-03-26': [{ name: 'Good Friday', type: 'religious', region: 'Global' }],
    '2027-03-28': [{ name: 'Easter Sunday', type: 'religious', region: 'Global' }],
    '2027-04-22': [{ name: 'Passover Begins', type: 'religious', region: 'Jewish' }],
    '2027-05-17': [{ name: 'Eid al-Adha', type: 'religious', region: 'Islamic' }],
    '2027-05-31': [{ name: 'Memorial Day', type: 'federal', region: 'USA' }],
    '2027-09-06': [{ name: 'Labor Day', type: 'federal', region: 'USA' }],
    '2027-10-02': [{ name: 'Rosh Hashanah', type: 'religious', region: 'Jewish' }],
    '2027-10-11': [{ name: 'Indigenous Peoples\' Day', type: 'federal', region: 'USA' }],
    '2027-10-29': [{ name: 'Diwali', type: 'religious', region: 'Hindu' }],
    '2027-11-25': [{ name: 'Thanksgiving', type: 'federal', region: 'USA' }],
    '2027-12-24': [{ name: 'Hanukkah Begins', type: 'religious', region: 'Jewish' }],
  },
  2028: {
    ...getFixedHolidays(2028),
    '2028-01-17': [{ name: 'Martin Luther King Jr. Day', type: 'federal', region: 'USA' }],
    '2028-01-26': [{ name: 'Lunar New Year', type: 'cultural', region: 'East Asia' }],
    '2028-01-28': [{ name: 'Ramadan Begins', type: 'religious', region: 'Islamic' }],
    '2028-02-21': [{ name: 'Presidents\' Day', type: 'federal', region: 'USA' }],
    '2028-02-26': [{ name: 'Eid al-Fitr', type: 'religious', region: 'Islamic' }],
    '2028-03-11': [{ name: 'Holi', type: 'religious', region: 'Hindu' }],
    '2028-04-11': [{ name: 'Passover Begins', type: 'religious', region: 'Jewish' }],
    '2028-04-14': [{ name: 'Good Friday', type: 'religious', region: 'Global' }],
    '2028-04-16': [{ name: 'Easter Sunday', type: 'religious', region: 'Global' }],
    '2028-05-05': [{ name: 'Eid al-Adha', type: 'religious', region: 'Islamic' }],
    '2028-05-29': [{ name: 'Memorial Day', type: 'federal', region: 'USA' }],
    '2028-09-04': [{ name: 'Labor Day', type: 'federal', region: 'USA' }],
    '2028-09-21': [{ name: 'Rosh Hashanah', type: 'religious', region: 'Jewish' }],
    '2028-10-09': [{ name: 'Indigenous Peoples\' Day', type: 'federal', region: 'USA' }],
    '2028-10-17': [{ name: 'Diwali', type: 'religious', region: 'Hindu' }],
    '2028-11-23': [{ name: 'Thanksgiving', type: 'federal', region: 'USA' }],
    '2028-12-12': [{ name: 'Hanukkah Begins', type: 'religious', region: 'Jewish' }],
  },
  2029: {
    ...getFixedHolidays(2029),
    '2029-01-15': [{ name: 'Martin Luther King Jr. Day', type: 'federal', region: 'USA' }],
    '2029-02-13': [{ name: 'Lunar New Year', type: 'cultural', region: 'East Asia' }],
    '2029-02-15': [{ name: 'Ramadan Begins', type: 'religious', region: 'Islamic' }],
    '2029-02-19': [{ name: 'Presidents\' Day', type: 'federal', region: 'USA' }],
    '2029-02-28': [{ name: 'Holi', type: 'religious', region: 'Hindu' }],
    '2029-03-16': [{ name: 'Eid al-Fitr', type: 'religious', region: 'Islamic' }],
    '2029-03-30': [{ name: 'Good Friday', type: 'religious', region: 'Global' }],
    '2029-03-31': [{ name: 'Passover Begins', type: 'religious', region: 'Jewish' }],
    '2029-04-01': [{ name: 'Easter Sunday', type: 'religious', region: 'Global' }],
    '2029-05-25': [{ name: 'Eid al-Adha', type: 'religious', region: 'Islamic' }],
    '2029-05-28': [{ name: 'Memorial Day', type: 'federal', region: 'USA' }],
    '2029-09-03': [{ name: 'Labor Day', type: 'federal', region: 'USA' }],
    '2029-09-10': [{ name: 'Rosh Hashanah', type: 'religious', region: 'Jewish' }],
    '2029-10-08': [{ name: 'Indigenous Peoples\' Day', type: 'federal', region: 'USA' }],
    '2029-11-05': [{ name: 'Diwali', type: 'religious', region: 'Hindu' }],
    '2029-11-22': [{ name: 'Thanksgiving', type: 'federal', region: 'USA' }],
    '2029-12-01': [{ name: 'Hanukkah Begins', type: 'religious', region: 'Jewish' }],
  },
  2030: {
    ...getFixedHolidays(2030),
    '2030-01-21': [{ name: 'Martin Luther King Jr. Day', type: 'federal', region: 'USA' }],
    '2030-02-03': [{ name: 'Lunar New Year', type: 'cultural', region: 'East Asia' }],
    '2030-02-05': [{ name: 'Ramadan Begins', type: 'religious', region: 'Islamic' }],
    '2030-02-18': [{ name: 'Presidents\' Day', type: 'federal', region: 'USA' }],
    '2030-03-06': [{ name: 'Eid al-Fitr', type: 'religious', region: 'Islamic' }],
    '2030-03-19': [{ name: 'Holi', type: 'religious', region: 'Hindu' }],
    '2030-04-17': [{ name: 'Passover Begins', type: 'religious', region: 'Jewish' }],
    '2030-04-19': [{ name: 'Good Friday', type: 'religious', region: 'Global' }],
    '2030-04-21': [{ name: 'Easter Sunday', type: 'religious', region: 'Global' }],
    '2030-05-14': [{ name: 'Eid al-Adha', type: 'religious', region: 'Islamic' }],
    '2030-05-27': [{ name: 'Memorial Day', type: 'federal', region: 'USA' }],
    '2030-09-02': [{ name: 'Labor Day', type: 'federal', region: 'USA' }],
    '2030-09-28': [{ name: 'Rosh Hashanah', type: 'religious', region: 'Jewish' }],
    '2030-10-14': [{ name: 'Indigenous Peoples\' Day', type: 'federal', region: 'USA' }],
    '2030-10-26': [{ name: 'Diwali', type: 'religious', region: 'Hindu' }],
    '2030-11-28': [{ name: 'Thanksgiving', type: 'federal', region: 'USA' }],
    '2030-12-20': [{ name: 'Hanukkah Begins', type: 'religious', region: 'Jewish' }],
  }
};
