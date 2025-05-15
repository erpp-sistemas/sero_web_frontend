import React from "react";
import {
  EventAvailable,
  CalendarToday,
  CalendarMonth,
  Info,
} from "@mui/icons-material";

const groupBy = (array, keyGetter) => {
  return array.reduce((result, currentItem) => {
    const key = keyGetter(currentItem);
    result[key] = result[key] ? result[key] + 1 : 1;
    return result;
  }, {});
};

const getMaxKey = (obj) =>
  Object.entries(obj).reduce(
    (max, current) => (current[1] > max[1] ? current : max),
    ["", 0]
  );

const getMinKey = (obj) =>
  Object.entries(obj).reduce(
    (min, current) => (current[1] < min[1] ? current : min),
    ["", Infinity]
  );

const StatCard = ({ title, value, icon: Icon, color = "#3b82f6" }) => (
  <div className="flex items-center gap-6 rounded-2xl p-4 shadow-md w-full">
    <Icon sx={{ fontSize: "2rem", color }} />
    <div>
      <h3 className="text-white text-lg font-bold">
        {value?.toLocaleString?.() ?? value}
      </h3>
      <p className="text-base text-gray-300 mt-2">{title}</p>
    </div>
  </div>
);

const StatCards = ({ data }) => {
  if (!data || data.length === 0) return null;

  const dateCounts = groupBy(data, (d) =>
    new Date(d.start).toLocaleDateString("es-MX")
  );
  const optionCounts = groupBy(
    data,
    (d) => d.opcion_regularizacion || "Sin opción"
  );

  const [mostDate, mostDateCount] = getMaxKey(dateCounts);
  const [leastDate, leastDateCount] = getMinKey(dateCounts);
  const [mostOption, mostOptionCount] = getMaxKey(optionCounts);
  const [leastOption, leastOptionCount] = getMinKey(optionCounts);

  return (
    <div className="px-6 py-8 font-[sans-serif]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
        <StatCard
          title="Total de citas"
          value={data.length}
          icon={EventAvailable}
          color="#3b82f6"
        />
        <StatCard
          title="Día con más citas"
          value={`${mostDate} (${mostDateCount})`}
          icon={CalendarToday}
          color="#22c55e"
        />
        <StatCard
          title="Día con menos citas"
          value={`${leastDate} (${leastDateCount})`}
          icon={CalendarMonth}
          color="#facc15"
        />
        <StatCard
          title="Opción con mas citas"
          value={`${mostOption} (${mostOptionCount})`}
          icon={Info}
          color="#a855f7"
        />
        <StatCard
          title="Opción con menos citas"
          value={`${leastOption} (${leastOptionCount})`}
          icon={Info}
          color="#ef4444"
        />
      </div>
    </div>
  );
};

export default StatCards;
