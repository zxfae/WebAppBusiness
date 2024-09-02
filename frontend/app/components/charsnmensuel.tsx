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
            numbers: ({ count, min, max }: { count: number; min: number; max: number }) => {
              return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
            },
          };
  
          const data = {
            labels: ['Jan', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Jui', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: 'N jours travaillés par mois.',
                data: Utils.numbers({ count: 12, min: 0, max: 40 }),
                borderColor: Utils.CHART_COLORS.Orange,
                fill: false,
                stepped: true,
              }
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