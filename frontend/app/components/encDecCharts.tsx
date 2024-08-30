import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';

export default function ChartsNmensuel(){
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
  
    useEffect(() => {
      if (chartRef && chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
  
        if (ctx) {
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }
  
          const Utils = {
            CHART_COLORS: {
              red: 'rgb(255, 0, 0)',
              blue: 'rgb(0, 0, 255)',
              Magenta: 'rgb(255, 0, 255)',
              Orange: 'rgb(255, 165, 0)',
              Purple: 'rgb(128, 0, 128)',
              Brown: 'rgb(165, 42, 42)',
              Teal: 'rgb(0, 128, 128)',
              Navy: 'rgb(0, 0, 128)',
              Olive: 'rgb(128, 128, 0)',
              Gold: 'rgb(255, 215, 0)',
              Slate_Blue: 'rgb(106, 90, 205)',
              Light_Sea_Green: 'rgb(32, 178, 170)',
              Dark_Violet: 'rgb(148, 0, 211)',
            },
            months: ['Jan', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Jui', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'],
          };
  
            const DATA_COUNT = 12;
            const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

            const labels = Utils.months.slice(0, DATA_COUNT);
            const data = {
            labels: labels,
            datasets: [
            {
                label: 'Encaissement',
                data: [18, 33, 22, 19, 11, 39, 11, 9, 23, 0, 12, 33],
                borderColor: Utils.CHART_COLORS.blue,
                backgroundColor: Utils.CHART_COLORS.blue,
            },
            {
                label: 'Décaissement',
                data: [10, 30, 39, 20, 25, 34, -10, 33, 12, 44, 32, 10],
                borderColor: Utils.CHART_COLORS.red,
                backgroundColor: Utils.CHART_COLORS.red,
            },
            ]
            };  

              const config: ChartConfiguration<'line', number[], string> = {
            type: 'line',
            data: data,
            options: {
              responsive: true,
              interaction: {
                intersect: false,
                axis: 'x'
              },
              plugins: {
                title: {
                  display: true,
                }
              }
            }
          };
  
          chartInstance.current = new Chart(ctx, config);
        }
      }
    }, []);
    return <canvas ref={chartRef} />;

}