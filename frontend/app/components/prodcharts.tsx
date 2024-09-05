import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, ChartEvent, LegendItem } from 'chart.js/auto';

interface ChartsNmensuelProps {
  data: number[];
}

export default function ChartsProd({ data }: ChartsNmensuelProps) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    const handleLeave = (evt: ChartEvent, item: LegendItem, legend: { chart: Chart }) => {
        legend.chart.data.datasets[0].backgroundColor = (legend.chart.data.datasets[0].backgroundColor as string[]).map(color => 
            color.length === 9 ? color.slice(0, -2) : color
        );
        legend.chart.update();
    };

    const handleHover = (evt: ChartEvent, item: LegendItem, legend: { chart: Chart }) => {
        legend.chart.data.datasets[0].backgroundColor = (legend.chart.data.datasets[0].backgroundColor as string[]).map((color, index) => 
            index === item.index || color.length === 9 ? color : color + '4D'
        );
        legend.chart.update();
    };

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const dataConfig = {
                    labels: ['Production - CA', 'Gestion clientele - Devis', 'Interprofession', 'Formation', 'Entretien'],
                    datasets: [{
                        label: 'Jours travaill',
                        data: data,
                        borderWidth: 0.3,
                        backgroundColor: ['#27AE60', '#CB4335','#CB4335','#CB4335', '#CB4335'],
                    }]
                };

                const config: ChartConfiguration = {
                    type: 'pie',
                    data: dataConfig,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                onHover: handleHover,
                                onLeave: handleLeave
                            },
                        }
                    }
                };

                chartInstance.current = new Chart(ctx, config);
            }
        }
    }, [data]);

    return <canvas ref={chartRef} />;
}
