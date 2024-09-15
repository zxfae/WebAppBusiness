import React, { useState, useEffect } from 'react';

interface UserData {
  firstname: string;
  lastname: string;
}

async function fetchCurrentUser(): Promise<UserData | null> {
  try {
    const userId = 'user-id-example'; 
const response = await fetch(`http://localhost:8080/api/getuser?userid=${userId}`, {
  credentials: 'include',
});
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem fetching the current user:", error);
    return null;
  }
}

export default function DashBoard() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchCurrentUser()
    .then(data => {
      if (data) {
        setUserData(data);
      } else {
        setError('Failed to load user data');
      }
    })
    .catch(() => setError('Failed to fetch user data'))
    .finally(() => setLoading(false));
}, []);

const cardData = [
  { title: 'Card 1', content: 'a' },
  { title: 'N jours travaillés par mois.', content: 'Content for card 4' },
  { 
    title: 'User Info', 
    content: loading ? 'Loading...' : error ? error : `${userData?.lastname} ${userData?.firstname}`
  },
  { title: 'Card 4', content: 'Content for card 4' },
  { title: 'Card 5', content: 'a' },
  { title: 'Card 6', content: 'A' },
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