const mapValueThroughStops = (value, valueMap) => {
  if (!valueMap || !valueMap.stops || valueMap.stops.length === 0) return value;

  const stops = valueMap.stops; // Assume stops are already sorted
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  // Invert the input value if needed
  const v = clamp(valueMap.invert ? Math.abs(1 - value) : value, 0, 1);

  // Handle before first stop
  if (v <= stops[0].x) {
    value = stops[0].y;
  }
  // Handle after last stop
  else if (v >= stops[stops.length - 1].x) {
    value = stops[stops.length - 1].y;
  }
  // Interpolate or snap between stops
  else {
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i];
      const b = stops[i + 1];

      if (v >= a.x && v <= b.x) {
        const t = (v - a.x) / (b.x - a.x);
        value = valueMap.interpolate ? a.y + t * (b.y - a.y) : a.y; // stepped mode holds previous y
        break;
      }
    }
  }

  // Round to 2 decimal points
  return Math.round(value * 100) / 100;
};

export default mapValueThroughStops;
