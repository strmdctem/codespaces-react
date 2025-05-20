import { useTheme } from '@mui/material';
import { AgCharts as AgChartsReact } from 'ag-charts-react';
import { Suspense, useEffect, useState } from 'react';
import Loading from '../loading/loading';
import { rupeeFormat } from '../utils';

export function FDBankViewChart({ data }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [options, setOptions] = useState({
    data: [
      { asset: 'Principal', amount: data?.principal },
      { asset: 'Interest', amount: data?.interest }
    ],
    series: [
      {
        type: 'donut',
        calloutLabelKey: 'asset',
        angleKey: 'amount',
        innerRadiusRatio: 0.7,
        fills: ['#283593', '#00c750'],
        calloutLabel: {
          enabled: false
        }
      }
    ]
  });

  useEffect(() => {
    setOptions((currentOptions) => ({
      ...currentOptions,
      theme: isDark ? 'ag-material-dark' : 'ag-material',
      data: [
        { asset: 'Principal', amount: data?.principal },
        { asset: 'Interest', amount: data?.interest }
      ],
      series: [
        {
          ...currentOptions.series[0],
          innerLabels: [
            {
              text: data?.interest
                ? 'Interest: ₹' + rupeeFormat(data?.interest)
                : 'Interest: N/A',
              fontSize: 16,
              fontFamily: 'sans-serif',
              fontWeight: 'bold'
            },
            {
              text: data?.interest
                ? `Total: ₹${rupeeFormat(data?.principal + data?.interest)}`
                : 'Total: N/A',
              fontSize: 16,
              fontFamily: 'sans-serif',
              fontWeight: 'bold'
            }
          ]
        }
      ],
      background: {
        fill: isDark ? '#232323' : '#fff'
      }
    }));
  }, [data, isDark]);

  return (
    <Suspense fallback={<Loading />}>
      <div style={{ width: '100%', position: 'relative' }}>
        {data?.principal ? <AgChartsReact options={options} /> : ''}
        <div
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0
          }}
        ></div>
      </div>
    </Suspense>
  );
}
