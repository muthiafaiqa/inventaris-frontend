export interface HistoricalPoint {
  id?: string;
  bulan: number;
  tahun: number;
  qty_sold: number;
}

export interface ForecastResult {
  a: number;
  b: number;
  forecasts: number[]; // Forecast values for historical periods
  nextPeriodForecast: number; // Forecast value for next period (n)
  mape: number; // Mean Absolute Percentage Error in %
  points: {
    bulan: number;
    tahun: number;
    actual: number;
    forecast: number;
  }[];
}

/**
 * Calculates peramalan menggunakan Metode Trend Moment.
 * Rumus: Y = a + bX
 * Persamaan:
 * 1) Sum(Y) = n.a + b.Sum(X)
 * 2) Sum(XY) = a.Sum(X) + b.Sum(X^2)
 * 
 * @param data Array of historical sales data, sorted ascending by time
 */
export function calculateTrend(data: HistoricalPoint[]): ForecastResult {
  const n = data.length;
  if (n < 3) {
    throw new Error('Data historis penjualan minimal harus 3 periode untuk melakukan peramalan.');
  }

  // Time index X: [0, 1, 2, ..., n-1]
  let sumX = 0;
  let sumY = 0;
  let sumXX = 0;
  let sumXY = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = data[i].qty_sold;

    sumX += x;
    sumY += y;
    sumXX += x * x;
    sumXY += x * y;
  }

  // Solving the two equations:
  // n*a + sumX*b = sumY
  // sumX*a + sumXX*b = sumXY
  // Using Cramer's Rule:
  const determinant = n * sumXX - sumX * sumX;
  if (determinant === 0) {
    throw new Error('Determinant persamaan bernilai nol. Tidak dapat melakukan kalkulasi peramalan.');
  }

  const detA = sumY * sumXX - sumXY * sumX;
  const detB = n * sumXY - sumX * sumY;

  const a = detA / determinant;
  const b = detB / determinant;

  // Calculate historical forecast values and MAPE
  const forecasts: number[] = [];
  const points = [];
  let absolutePercentageErrorSum = 0;
  let validMapePointsCount = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const actual = data[i].qty_sold;
    // Y_forecast = a + b*X
    const forecastVal = Math.max(0, a + b * x); // Sales cannot be negative
    forecasts.push(forecastVal);

    points.push({
      bulan: data[i].bulan,
      tahun: data[i].tahun,
      actual,
      forecast: forecastVal,
    });

    if (actual > 0) {
      absolutePercentageErrorSum += Math.abs((actual - forecastVal) / actual);
      validMapePointsCount++;
    }
  }

  // Forecast for next period (index X = n)
  const nextPeriodForecast = Math.max(0, a + b * n);

  // Calculate MAPE in percentage
  const mape = validMapePointsCount > 0 
    ? (absolutePercentageErrorSum / validMapePointsCount) * 100 
    : 0;

  return {
    a,
    b,
    forecasts,
    nextPeriodForecast,
    mape,
    points,
  };
}

export const calculateTrendMoment = calculateTrend;
