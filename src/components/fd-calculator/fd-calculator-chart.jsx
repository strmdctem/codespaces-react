import { useTheme } from '@mui/material';
import { AgChartsReact } from 'ag-charts-react';
import { Suspense, useEffect, useState } from 'react';
import Loading from '../loading/loading';

export function FDCalculatorChart({ data }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [options, setOptions] = useState({
    data: data,
    series: [
      {
        type: 'bar',
        xKey: 'name',
        yKey: 'general_value',
        yName: 'General Citizen',
        fill: '#0F52BA',
        direction: 'horizontal',
        minBarLength: 100,
        label: {
          formatter: (params) => params.datum.general_interest,
          placement: 'inside',
          fontFamily: 'sans-serif',
          fontSize: 14,
          color: '#fff'
        },
        tooltip: {
          renderer: function ({ datum }) {
            return {
              content: `${datum.name}: ${datum.general_interest}`
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
        minBarLength: 100,
        label: {
          formatter: (params) => params.datum.senior_interest,
          placement: 'inside',
          fontFamily: 'sans-serif',
          fontSize: 14,
          color: '#fff'
        },
        tooltip: {
          renderer: function ({ datum }) {
            return {
              content: `${datum.name}: ${datum.senior_interest}`
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
          fontFamily: 'sans-serif'
        }
      },
      {
        type: 'number',
        position: 'bottom',
        label: {
          fontSize: 12,
          fontFamily: 'sans-serif'
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
      theme: isDark ? 'ag-material-dark' : 'ag-material',
      background: {
        fill: isDark ? '#1b1b1b' : '#fff'
      },
      data: data
    }));
  }, [data, isDark]);

  return (
    <Suspense fallback={<Loading />}>
      <div style={{ width: '100%', position: 'relative' }}>
        <AgChartsReact options={options} data={data} />
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
