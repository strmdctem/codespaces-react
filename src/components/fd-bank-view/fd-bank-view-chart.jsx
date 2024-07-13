import { Suspense, lazy, useState } from 'react';

const AgChartsReact = lazy(() =>
  import('ag-charts-react').then((module) => ({
    default: module.AgChartsReact
  }))
);

export function FDBankViewChart({ data }) {
  let convertedData = [];
  for (let i = 0; i < data.length; i++) {
    // Convert the current item
    const currentItem = {
      ...data[i],
      end: Number(data[i].end),
      start: Number(data[i].start),
      general: Number(data[i].general),
      senior: Number(data[i].senior)
    };

    // If it's the first item, or the general or senior value has changed, push the item
    if (
      i === 0 ||
      i === data.length - 1 ||
      convertedData[convertedData.length - 1].general !== currentItem.general ||
      convertedData[convertedData.length - 1].senior !== currentItem.senior
    ) {
      convertedData.push(currentItem);
    }
  }

  const [options] = useState({
    theme: 'ag-material',
    data: convertedData,
    series: [
      {
        type: 'line',
        xKey: 'end',
        yKey: 'general',
        yName: 'General',
        strokeWidth: 4,
        stroke: '#fd6285',
        marker: {
          enabled: true, // Enable markers
          size: 10,
          fill: '#fd6285'
        }
      },
      {
        type: 'line',
        xKey: 'end',
        yKey: 'senior',
        yName: 'Senior',
        strokeWidth: 4,
        stroke: '#3ca3e9',
        marker: {
          enabled: true, // Enable markers
          size: 10,
          fill: '#3ca3e9'
        }
      }
    ],
    axes: [
      {
        type: 'number',
        position: 'bottom',
        nice: false,
        min: 0,
        max: 1825,
        tick: {
          values: [0, 365, 730, 1095, 1460, 1825]
        },
        label: {
          formatter: function (params) {
            if (params.value == 0) {
              return '';
            }
            const years = params.value / 365;
            return years === 1 ? `${years} year` : `${years} years`;
          }
        },
        crossLines: [
          {
            type: 'range',
            range: [400, 1095],
            strokeWidth: 0,
            fill: '#7290C4',
            fillOpacity: 0.2
          }
        ]
      },
      {
        type: 'number',
        position: 'left',
        nice: false,
        min: 3,
        max: 10,
        tick: {
          values: [3, 4, 5, 6, 7, 8, 9, 10]
        }
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
