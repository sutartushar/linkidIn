import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchCandidates = async () => {
      const response = await axios.get('/api/candidates', { params: filters });
      setCandidates(response.data);
    };
    fetchCandidates();
  }, [filters]);

  return (
    <div>
      <input 
        placeholder="Filter by skills" 
        onChange={e => setFilters({...filters, skills: e.target.value})}
      />
      <div>
        {candidates.map(candidate => (
          <div key={candidate._id}>
            <h3>{candidate.firstName} {candidate.lastName}</h3>
            <p>{candidate.headline}</p>
            <a href={candidate.profileUrl}>LinkedIn Profile</a>
          </div>
        ))}
      </div>
    </div>
  );
}