import { Suspense, lazy, useEffect, useState } from 'react';

const AgChartsReact = lazy(() =>
  import('ag-charts-react').then((module) => ({
    default: module.AgChartsReact
  }))
);

export function FDCalculatorChart({ data }) {
  console.log('calc chart', data);
  const [options, setOptions] = useState({
    theme: 'ag-material',
    data: data,
    series: [
      {
        type: 'bar',
        xKey: 'name',
        yKey: 'general_value',
        yName: 'General Citizen',
        fill: '#0F52BA',
        direction: 'horizontal',
        label: {
          formatter: (params) => params.datum.general_interest,
          placement: 'inside',
          fontFamily: 'Roboto'
        },
        tooltip: {
          renderer: function ({ datum }) {
              return {
                  content: `${datum.name}: ${datum.general_interest}`,
              };
          }
        }
      },
      {
        type: 'bar',
        xKey: 'name',
        yKey: 'senior_value',
        yName: 'Senior Citizen',
        fill: '#00b7c7',
        direction: 'horizontal',
        label: {
          formatter: (params) => params.datum.senior_interest,
          placement: 'inside',
          fontFamily: 'Roboto'
        },
        tooltip: {
          renderer: function ({ datum }) {
              return {
                  content: `${datum.name}: ${datum.senior_interest}`,
              };
          }
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'left',
        label: {
          formatter: (params) => {
            if (params.value.length > 10) {
              return `${params.value.substring(0, 8)}...`;
            }
            return params.value;
          },
          fontSize: 12,
          fontWeight: 'bold',
          fontFamily: 'Roboto'
        }
      },
      {
        type: 'number',
        position: 'bottom',
        label: {
          fontSize: 12,
          fontFamily: 'Roboto'
        }
      }
    ],
    legend: {
      position: 'top',
      spacing: 10
    }
  });

  useEffect(() => {
    setOptions((currentOptions) => ({
      ...currentOptions,
      data: data
    }));
  }, [data]);

  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <div style={{ width: '100%', marginLeft: '-10px', marginTop: '0px' }}>
        <AgChartsReact options={options} data={data} />
      </div>
    </Suspense>
  );
}
