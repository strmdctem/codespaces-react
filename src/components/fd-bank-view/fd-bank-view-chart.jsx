import { Suspense, lazy, useState } from 'react';

const AgChartsReact = lazy(() =>
  import('ag-charts-react').then((module) => ({
    default: module.AgChartsReact
  }))
);

export function FDBankViewChart() {
  const [options] = useState({
    data: [
      { asset: 'Principal', amount: 500000 },
      { asset: 'Interest', amount: 229884 }
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
            text: '₹ 7,29,884',
            fontSize: 18,
            fontFamily: 'Roboto',
            spacing: 10,
            fontWeight: 'bold'
          },
          {
            text: 'Total',
            fontSize: 16,
            fontFamily: 'Roboto',
            spacing: 10
          }
        ]
      }
    ]
  });

  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <div style={{ width: '100%', marginLeft: '-5px' }}>
        <AgChartsReact options={options} />
      </div>
    </Suspense>
  );
}
