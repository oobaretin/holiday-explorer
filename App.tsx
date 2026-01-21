
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { HOLIDAYS_BY_YEAR, MONTHS, WEEKDAYS, REGION_COORDINATES } from './constants';
import { Holiday, HolidayType, ViewMode, HolidayWithDate, HolidayMap } from './types';

// --- API Utility ---
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Leaflet Custom Icons ---
const getMarkerIcon = (type: HolidayType) => {
  const color = type === 'federal' ? '#f43f5e' : type === 'religious' ? '#10b981' : '#f59e0b';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 20px ${color};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

// --- Sub-components ---

const Badge: React.FC<{ type: HolidayType; className?: string }> = ({ type, className = '' }) => {
  const colors = {
    federal: 'bg-rose-100 text-rose-700 border-rose-200',
    religious: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cultural: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[type]} ${className}`}>
      {type}
    </span>
  );
};

const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const handleStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);
  if (!isOffline) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
      Offline Mode (Cached Data)
    </div>
  );
};

const HolidayDetailModal: React.FC<{
  holiday: HolidayWithDate | null;
  onClose: () => void;
}> = ({ holiday, onClose }) => {
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (holiday) fetchExplanation(holiday);
  }, [holiday]);

  const fetchExplanation = async (h: HolidayWithDate) => {
    setIsLoading(true);
    try {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain the significance of ${h.name} in ${h.region} on ${h.date}. Describe its cultural impact and global relevance. 3 sentences max. Output MUST be in English.`,
        config: { 
          systemInstruction: "You are an informative cultural guide. You must provide all explanations in English, regardless of the holiday's origin or name." 
        }
      });
      setDescription(response.text || "No details available.");
    } catch (error) {
      setDescription("AI insights require internet. This holiday marks an important cultural observance.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!holiday) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className={`h-3 w-full ${holiday.type === 'federal' ? 'bg-rose-500' : holiday.type === 'religious' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <div className="p-10">
          <div className="flex justify-between items-start mb-6">
            <Badge type={holiday.type} className="text-xs px-4 py-1" />
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">{holiday.name}</h2>
          <p className="text-base font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">{holiday.region} • {new Date(holiday.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 min-h-[120px]">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
            ) : <p className="text-slate-700 text-lg leading-relaxed font-medium">{description}</p>}
          </div>
          <button onClick={onClose} className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl">Close</button>
        </div>
      </div>
    </div>
  );
};

const CalendarMonth: React.FC<{ 
  monthIdx: number; 
  year: number; 
  holidaysMap: HolidayMap;
  onHolidayClick: (holiday: HolidayWithDate) => void;
}> = ({ monthIdx, year, holidaysMap, onHolidayClick }) => {
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const days = useMemo(() => [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)], [firstDay, daysInMonth]);

  return (
    <div className="glass rounded-[2rem] shadow-lg overflow-hidden flex flex-col h-full border border-white/40">
      <div className="bg-white/40 px-5 py-5 flex justify-between items-center border-b border-slate-100">
        <h3 className="text-xl font-black text-slate-900">{MONTHS[monthIdx]}</h3>
      </div>
      <div className="p-2 grid grid-cols-7 gap-0.5 flex-1">
        {WEEKDAYS.map(d => <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase py-1">{d[0]}</div>)}
        {days.map((day, idx) => {
          const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hs = day ? holidaysMap[dateStr] || [] : [];
          const hasHolidays = hs.length > 0;
          return (
            <div 
              key={idx} 
              onClick={() => hasHolidays && onHolidayClick({ ...hs[0], date: dateStr })}
              className={`h-10 sm:h-16 p-1 border-slate-100 border transition-all cursor-pointer relative rounded-lg m-0.5 ${day ? (hasHolidays ? (hs[0].type === 'federal' ? 'bg-rose-500 text-white shadow-rose-200' : hs[0].type === 'religious' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-amber-500 text-white shadow-amber-200') : 'bg-white text-slate-400 hover:bg-slate-50') : ''}`}
            >
              <span className="text-[10px] sm:text-xs font-black">{day}</span>
              {hasHolidays && (
                <div className="absolute top-1 right-1 flex gap-0.5">
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse border border-slate-200" />
                   {hs.length > 1 && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75 border border-slate-200" />}
                   {hs.length > 2 && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150 border border-slate-200" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const availableYears = useMemo(() => Object.keys(HOLIDAYS_BY_YEAR).map(Number).sort(), []);
  
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const currentYear = new Date().getFullYear();
    return availableYears.includes(currentYear) ? currentYear : availableYears[0];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypes, setActiveTypes] = useState<HolidayType[]>(['federal', 'religious', 'cultural']);
  const [activeRegions, setActiveRegions] = useState<string[]>([]);
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayWithDate | null>(null);

  const currentYearHolidays = useMemo(() => {
    const list: HolidayWithDate[] = [];
    const holidayMap = HOLIDAYS_BY_YEAR[selectedYear] || {};
    (Object.entries(holidayMap) as [string, Holiday[]][]).forEach(([date, hs]) => {
      hs.forEach(h => list.push({ ...h, date }));
    });
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedYear]);

  const allRegions = useMemo<string[]>(() => {
    const s = new Set<string>();
    (Object.values(HOLIDAYS_BY_YEAR) as HolidayMap[]).forEach(ym => {
      (Object.values(ym) as Holiday[][]).forEach(hs => hs.forEach(h => s.add(h.region)));
    });
    return Array.from(s).sort();
  }, []);

  const filteredHolidays = useMemo(() => {
    return currentYearHolidays.filter(h => {
      const mT = activeTypes.includes(h.type);
      const mR = activeRegions.length === 0 || activeRegions.includes(h.region);
      const mS = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 h.region.toLowerCase().includes(searchQuery.toLowerCase());
      return mT && mR && mS;
    });
  }, [currentYearHolidays, activeTypes, activeRegions, searchQuery]);

  const groupedByMonth = useMemo(() => {
    const map: { [month: number]: HolidayWithDate[] } = {};
    filteredHolidays.forEach(h => {
      const m = new Date(h.date).getMonth();
      if (!map[m]) map[m] = [];
      map[m].push(h);
    });
    return map;
  }, [filteredHolidays]);

  return (
    <div className="min-h-screen pb-20 bg-[#f8fafc]">
      <OfflineIndicator />
      <HolidayDetailModal holiday={selectedHoliday} onClose={() => setSelectedHoliday(null)} />

      <header className="sticky top-0 z-50 glass border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Holiday Explorer</h1>
              <div className="flex items-center gap-1.5 mt-1 overflow-x-auto custom-scrollbar no-scrollbar py-0.5">
                {availableYears.map(y => (
                  <button 
                    key={y} 
                    onClick={() => setSelectedYear(y)} 
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${selectedYear === y ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <nav className="flex bg-slate-100/60 p-1.5 rounded-2xl border border-slate-200/50">
            {[ViewMode.LIST, ViewMode.CALENDAR, ViewMode.MAP].map(m => (
              <button key={m} onClick={() => setViewMode(m)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === m ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{m}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {viewMode === ViewMode.CALENDAR && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MONTHS.map((_, i) => <CalendarMonth key={`${selectedYear}-${i}`} monthIdx={i} year={selectedYear} holidaysMap={HOLIDAYS_BY_YEAR[selectedYear] || {}} onHolidayClick={setSelectedHoliday} />)}
          </div>
        )}

        {viewMode === ViewMode.MAP && (
          <div className="h-[75vh] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200">
            <MapContainer center={[20, 0]} zoom={2} className="h-full w-full">
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              {(Object.entries(REGION_COORDINATES) as [string, [number, number]][]).map(([region, coords]) => {
                const regionHolidays = filteredHolidays.filter(h => h.region === region);
                if (regionHolidays.length === 0) return null;
                return (
                  <Marker key={region} position={coords} icon={getMarkerIcon(regionHolidays[0].type)}>
                    <Popup>
                      <div className="p-1 max-w-[180px]">
                        <h4 className="font-black text-slate-900 border-b pb-1 mb-2 uppercase text-[10px]">{region}</h4>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                          {regionHolidays.map((h, idx) => (
                            <div key={idx} className="group cursor-pointer" onClick={() => setSelectedHoliday(h)}>
                              <p className="text-[9px] font-bold text-indigo-500">{new Date(h.date).toLocaleDateString()}</p>
                              <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{h.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}

        {viewMode === ViewMode.LIST && (
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="lg:w-72 space-y-8">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 sticky top-32">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Quick Search</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Diwali, Eid, Lunar..." 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    className="w-full bg-slate-50 pl-10 pr-4 py-3 rounded-xl border border-slate-100 focus:border-indigo-500 focus:bg-white transition-all font-bold text-sm mb-6"
                  />
                  <svg className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>

                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Holiday Types</h3>
                <div className="space-y-2">
                  {(['federal', 'religious', 'cultural'] as HolidayType[]).map(t => (
                    <button 
                      key={t} 
                      onClick={() => setActiveTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])} 
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${activeTypes.includes(t) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{t}</span>
                    </button>
                  ))}
                </div>

                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 mb-4">Regions</h3>
                <div className="flex flex-wrap gap-1.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {allRegions.map(r => (
                    <button 
                      key={r} 
                      onClick={() => setActiveRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])} 
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border ${activeRegions.includes(r) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <div className="flex-1 space-y-12">
              {filteredHolidays.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                  <h3 className="text-xl font-black text-slate-900">No celebrations found</h3>
                  <p className="text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
                </div>
              ) : MONTHS.map((name, i) => groupedByMonth[i] && (
                <section key={name} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-slate-900 whitespace-nowrap">{name}</h2>
                    <div className="h-0.5 flex-1 bg-slate-100 rounded-full" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{groupedByMonth[i].length} Celebrations</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupedByMonth[i].map((h, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedHoliday(h)} 
                        className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-6">
                          <div className="text-center w-10">
                            <p className="text-[9px] font-black text-indigo-400 uppercase leading-none">{new Date(h.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                            <p className="text-xl font-black text-slate-900">{new Date(h.date).getDate()}</p>
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{h.name}</h4>
                            <div className="flex items-center gap-3 mt-1.5">
                              <Badge type={h.type} />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{h.region}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
