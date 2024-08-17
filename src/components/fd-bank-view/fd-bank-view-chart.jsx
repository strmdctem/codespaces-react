import { useTheme } from '@mui/material';
import { AgChartsReact } from 'ag-charts-react';
import { Suspense, useEffect, useState } from 'react';
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
              text:
                data &&
                'Total: ₹' + rupeeFormat(data?.principal + data?.interest),
              fontSize: 16,
              fontFamily: 'sans-serif',
              fontWeight: 'bold'
            },
            {
              text: data && 'Interest: ₹' + rupeeFormat(data?.interest),
              fontSize: 16,
              fontFamily: 'sans-serif',
              fontWeight: 'bold'
            }
          ]
        }
      ]
    }));
  }, [data, isDark]);

  return (
    <Suspense fallback={<div>Loading chart...</div>}>
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
