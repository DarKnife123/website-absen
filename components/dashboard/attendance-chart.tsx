"use client";

import { useEffect, useRef } from "react";

type ChartData = {
  label: string;
  hadir: number;
  izin: number;
  sakit: number;
  alpha: number;
};

type Props = {
  data: ChartData[];
};

const COLORS = {
  hadir: "#10b981",
  izin: "#3b82f6",
  sakit: "#f59e0b",
  alpha: "#ef4444",
};

export default function AttendanceChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 60, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, width, height);

    if (data.length === 0) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Belum ada data absensi", width / 2, height / 2);
      return;
    }

    // Find max value
    const maxVal = Math.max(
      ...data.map((d) => Math.max(d.hadir + d.izin + d.sakit + d.alpha, 1))
    );
    const roundedMax = Math.ceil(maxVal / 5) * 5 || 5;

    // Draw grid lines
    const gridLines = 5;
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const val = Math.round(roundedMax - (roundedMax / gridLines) * i);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(val.toString(), padding.left - 8, y + 4);
    }
    ctx.setLineDash([]);

    // Draw bars
    const groupWidth = chartWidth / data.length;
    const barWidth = Math.min(groupWidth * 0.15, 20);
    const statuses = ["hadir", "izin", "sakit", "alpha"] as const;
    const barGap = 4;

    data.forEach((d, i) => {
      const groupX = padding.left + groupWidth * i + groupWidth / 2;
      const totalBarsWidth = statuses.length * barWidth + (statuses.length - 1) * barGap;
      const startX = groupX - totalBarsWidth / 2;

      statuses.forEach((status, j) => {
        const val = d[status];
        const barHeight = (val / roundedMax) * chartHeight;
        const x = startX + j * (barWidth + barGap);
        const y = padding.top + chartHeight - barHeight;

        // Bar with rounded top
        const radius = 4;
        ctx.fillStyle = COLORS[status];
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, padding.top + chartHeight);
        ctx.lineTo(x, padding.top + chartHeight);
        ctx.closePath();
        ctx.fill();
      });

      // X-axis label
      ctx.fillStyle = "#64748b";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(d.label, groupX, height - padding.bottom + 20);
    });

    // Legend
    const legendY = height - 15;
    const legendItems = [
      { label: "Hadir", color: COLORS.hadir },
      { label: "Izin", color: COLORS.izin },
      { label: "Sakit", color: COLORS.sakit },
      { label: "Alpha", color: COLORS.alpha },
    ];
    const legendWidth = legendItems.length * 80;
    let legendX = (width - legendWidth) / 2;

    legendItems.forEach((item) => {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.roundRect(legendX, legendY - 8, 12, 12, 3);
      ctx.fill();

      ctx.fillStyle = "#64748b";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(item.label, legendX + 16, legendY + 2);
      legendX += 80;
    });
  }, [data]);

  return (
    <div className="chart-container" style={{ height: "350px" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
