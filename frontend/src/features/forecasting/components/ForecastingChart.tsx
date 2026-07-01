import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

export interface ForecastingChartProps {
  labels: string[];
  actualData: (number | null)[];
  forecastData: number[];
  unit: string;
}

export function ForecastingChart({
  labels,
  actualData,
  forecastData,
  unit
}: ForecastingChartProps) {

  const data = {
    labels,
    datasets: [
      {
        label: 'DATA AKTUAL',
        data: actualData,
        borderColor: '#64748b', // Slate 500 (Monochromatic base)
        backgroundColor: 'rgba(100, 116, 139, 0.05)',
        borderWidth: 2,
        tension: 0.1, // Strict industrial line (less curvy)
        pointBackgroundColor: '#64748b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'HASIL RAMALAN (TREND MOMENT)',
        data: forecastData,
        borderColor: '#4f46e5', // Indigo 600 (Single Brand Accent)
        backgroundColor: 'rgba(79, 70, 229, 0.05)',
        borderWidth: 2,
        borderDash: [4, 4], // Dashed indicator for estimation
        tension: 0.1,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#64748b',
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            size: 9,
            weight: 'bold',
          },
          boxWidth: 16,
          padding: 12,
        }
      },
      tooltip: {
        padding: 8,
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        cornerRadius: 0, // Sharp industrial corners
        titleFont: {
          family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          size: 10,
          weight: 'bold'
        },
        bodyFont: {
          family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          size: 10
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y} ${unit}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            size: 9
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.06)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            size: 9
          }
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-none p-4 w-full h-[360px] md:h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
}
export default ForecastingChart;
