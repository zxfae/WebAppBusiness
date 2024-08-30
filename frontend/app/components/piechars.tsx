import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, ChartEvent, LegendItem } from 'chart.js/auto';

export default function ChartsNmensuel() {
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
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const data = {
                    labels: ['Production - CA', 'Gestion clientele - Devis', 'Interprofession', 'formation'],
                    datasets: [{
                        label: 'N jours',
                        data: [25, 3, 1, 5],
                        borderWidth: 1,
                        backgroundColor: ['#27AE60', '#CB4335','#CB4335','#CB4335'],
                    }]
                };

                const config: ChartConfiguration = {
                    type: 'pie',
                    data: data,
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
    }, []);

    return <canvas ref={chartRef} />;
}