import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';

//Interface to use
interface ChartsNmensuelProps {
    decompteMensuel: {
        janvier: string;
        fevrier: string;
        mars: string;
        avril: string;
        mai: string;
        juin: string;
        juillet: string;
        aout: string;
        septembre: string;
        octobre: string;
        novembre: string;
        decembre: string;
    };
}

//Charts.js
export default function ChartsNmensuel({ decompteMensuel }: ChartsNmensuelProps) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                //Data Configuration
                const data = {
                    labels: ['Jan', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Jui', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'N jours travaillés par mois.',
                            data: Object.values(decompteMensuel).map(value => parseInt(value, 10)),
                            borderColor: 'rgb(75,119,190, 1)',
                            backgroundColor: 'rgba(15,10,222,1)',
                            fill: false,
                            stepped: true,
                        }
                    ]
                };
                //ChartsConfiguration
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
    }, [decompteMensuel]);

    return <canvas ref={chartRef} />;
}
