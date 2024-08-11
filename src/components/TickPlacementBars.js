import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import "./RateChecker.css";

export default function TickPlacementBars({ data }) {
  // Transforming rateData into a dataset suitable for BarChart
  const dataset = Object.keys(data).map((key) => ({
    rate: key,
    count: data[key],
  }));

  const chartSetting = {
    yAxis: [
      {
        label: 'Number of lenders offering rate',
      },
    ],
    series: [
      { dataKey: 'count', label: 'Lenders offering Rate', color: '#108fff' }
    ],
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: 'translateX(-10px)',
      },
    },
  };

  return (
    <div className='tick-container'>
      <BarChart
        className='bar-chart'
        dataset={dataset}
        xAxis={[
          { scaleType: 'band', dataKey: 'rate' },
        ]}
        {...chartSetting}
      />
    </div>
  );
}
