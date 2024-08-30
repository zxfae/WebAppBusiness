import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import ChartsNmensuel from './components/charsnmensuel';
import PieChars from './components/piechars';
import ChartsEncDec from './components/encDecCharts';
import Image from 'next/image';


export default function DashBoard() {

  const cardData = [
    {
        title: 'Card 1',
        content: 'a'
      },
    { 
      title: 'N jours travaillés par mois.', 
      content: 'Content for card 4'
    },
    { title: 'Card 3', content: <PieChars/> },
    { title: 'Card 4', content: 'Content for card 4' },
    { title: 'Card 5', content: <ChartsNmensuel /> },
    { title: 'Card 6', content: <ChartsEncDec/> },
  ];

  return (
    <div className='grid gap-4 grid-cols-3 grid-rows-auto p-4'>
      {cardData.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-2">{card.title}</h2>
          <div className="text-gray-600">
            {typeof card.content === 'string' ? <p>{card.content}</p> : card.content}
          </div>
        </div>
      ))}
    </div>
  );
}