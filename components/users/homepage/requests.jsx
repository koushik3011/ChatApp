import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function Requests() {
  const { id } = useParams();
  const [user, setUser] = useState({ requests: [] }); // Ensure requests is always an array
  const [error, setError] = useState(null); // state for error

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/user/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      console.log("data", data);
      setUser(data.user);
    } catch (error) {
      setError('Error fetching user');
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]); // Adding id as a dependency to ensure it runs when id changes

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Requests</h2>
      {user.requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul className="space-y-4">
          {user.requests.map((request) => (
            <li key={request._id} className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
              <p className="text-gray-800 mb-1"><strong>Name:</strong> {request.expertname}</p>
              <p className="text-gray-800 mb-2">{new Date(request.timeStamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
