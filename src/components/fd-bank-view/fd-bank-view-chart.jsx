import { Suspense, lazy, useEffect, useState } from 'react';

const AgChartsReact = lazy(() =>
  import('ag-charts-react').then((module) => ({
    default: module.AgChartsReact
  }))
);

export function FDBankViewChart({ data }) {
  const isDark = document.querySelector('.app-dark');
  const [options, setOptions] = useState({
    theme: isDark ? 'ag-material-dark' : 'ag-material',
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
        },
        innerLabels: [
          {
            text: data && data?.principal + data?.interest + ''
          }
        ]
      }
    ]
  });

  useEffect(() => {
    setOptions((currentOptions) => ({
      ...currentOptions,
      data: [
        { asset: 'Principal', amount: data?.principal },
        { asset: 'Interest', amount: data?.interest }
      ],
      series: [
        {
          ...currentOptions.series[0],
          innerLabels: [
            {
              text: data && data?.principal + data?.interest + '',
              fontSize: 16
            },
            {
              text: data && data?.interest + '',
              fontSize: 16
            }
          ]
        }
      ]
    }));
  }, [data]);

  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <div style={{ width: '100%', marginLeft: '-5px' }}>
        <AgChartsReact options={options} />
      </div>
    </Suspense>
  );
}
