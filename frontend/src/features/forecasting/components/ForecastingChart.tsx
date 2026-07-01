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
        label: 'Data Aktual',
        data: actualData,
        borderColor: '#3b82f6', // Blue 500 (Biru / Netral)
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.3,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Hasil Ramalan (Trend Moment)',
        data: forecastData,
        borderColor: '#f59e0b', // Amber 500 (Oranye Aksentuasi)
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        borderWidth: 3,
        borderDash: [5, 5],
        tension: 0.3,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
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
          color: '#64748b', // Slate 500
          font: {
            family: 'Outfit, Inter, sans-serif',
            size: 12,
            weight: 500,
          },
          boxWidth: 24,
          padding: 20,
        }
      },
      tooltip: {
        padding: 12,
        backgroundColor: '#0f172a', // Slate 900
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1', // Slate 300
        titleFont: {
          family: 'Outfit, Inter, sans-serif',
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          family: 'Outfit, Inter, sans-serif',
          size: 12
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
          color: '#94a3b8', // Slate 400
          font: {
            family: 'Outfit, Inter, sans-serif',
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.08)', // Light slate grid
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Outfit, Inter, sans-serif',
            size: 11
          }
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="relative w-full h-[360px] md:h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
}
export default ForecastingChart;
