// Static mock weather card, structured so a live API (e.g. PAGASA or
// OpenWeather) can be swapped in later: replace MOCK with fetched data.
import { CloudSun, Droplets, Wind } from "lucide-react";

type Weather = {
  location: string;
  tempC: number;
  condition: string;
  humidity: number;
  windKph: number;
  updated: string;
};

const MOCK: Weather = {
  location: "Batangas City",
  tempC: 31,
  condition: "Partly cloudy",
  humidity: 74,
  windKph: 12,
  updated: "as of 8:00 AM",
};

export default function WeatherWidget() {
  const w = MOCK;
  return (
    <div className="card flex items-center gap-4 border border-sky/60 bg-gradient-to-br from-sky/40 to-white p-5">
      <CloudSun className="h-12 w-12 shrink-0 text-royal" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy">{w.location}</p>
        <p className="text-3xl font-bold text-navy">
          {w.tempC}°C{" "}
          <span className="text-sm font-medium text-slate-600">{w.condition}</span>
        </p>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Droplets className="h-3.5 w-3.5" /> {w.humidity}% humidity
          </span>
          <span className="inline-flex items-center gap-1">
            <Wind className="h-3.5 w-3.5" /> {w.windKph} km/h
          </span>
          <span>{w.updated}</span>
        </div>
      </div>
    </div>
  );
}
