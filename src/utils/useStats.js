import { useState, useEffect } from 'react';

export default function useStats(url,method='GET',body={}) {
  const [stats, setStats] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
   
    async function fetchData() {
      setLoading(true);
      setError(false);
      let options = {
        method
      };
      if(method=='POST'){
        options = {
          method,
          body: JSON.stringify(body) 
        };
      }
      
      const data = await fetch(url,options)
        .then(res => res.json())
        .catch(err => {
          setError(err);
        });
        
      setStats(data);
      setLoading(false);
    }
    fetchData();
  }, [url]);
  return {
    stats,
    loading,
    error,
  };
}