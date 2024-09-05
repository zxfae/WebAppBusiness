import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface ChartsTresoProps {
  data: number[];
}

export default function ChartsTreso({ data = [] }: ChartsTresoProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {

      const chartData = data.length ? data : Array(12).fill(0);
      
      const chartInstance = new Chart(chartRef.current, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Jui', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'],
            datasets: [
            {
              label: 'Coût Total Rémunération',
              data: chartData,
              fill: false,
              borderColor: 'red',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              pointStyle: 'triangle',
              pointRadius: 6,
            },
            {
              label: 'Coût Total Frais Fixes',
              data: chartData,
              fill: false,
              borderColor: 'blue',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              pointStyle: 'circle',
              pointRadius: 6,
            },
            {
              label: 'Coût Total Frais Variables',
              data: chartData,
              fill: false,
              borderColor: 'green',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              pointStyle: 'star',
              pointRadius: 6,
            },
            {
                label: 'Total charges',
                data: chartData,
                fill: false,
                borderColor: 'orange',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                pointStyle: 'cross',
                pointRadius: 6,
              }
          ]
        },
        options: {
          interaction: {
            mode: 'index',
          },
          plugins: {
            title: {
              display: true,
              text: 'Custom Chart Title',
            },
            tooltip: {
              usePointStyle: true,
            },
          }
        }
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [data]);

  return <canvas ref={chartRef} />;
}
