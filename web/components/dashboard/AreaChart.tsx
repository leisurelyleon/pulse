interface AreaChartProps {
  data: number[];
  color: string;
}

/**
 * A streaming area + line chart drawn as hand-built SVG paths — no charting
 * library. The path is rebuilt from the data window on every snapshot.
 */
export function AreaChart({ data, color }: AreaChartProps) {
  const width = 600;
  const height = 220;

  if (data.length < 2) {
    return <div className="h-full w-full" />;
  }

  const pad = 10;
  const innerHeight = height - pad * 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const coords = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = pad + (innerHeight - ((value - min) / range) * innerHeight);
    return [x, y] as const;
  });

  const line = coords
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  const gradientId = `area-${color.replace("#", "")}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}
