import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(`ws://${process.env.REACT_APP_SEVER_HOST}`);

    socket.onopen = () => {
      console.log('WS connected');
    };

    socket.onmessage = (event) => {
      const { data } = JSON.parse(event.data);
      const teamCounts = data.slice(1).reduce((acc, row) => {
        const team = row[3];
        if (team) {
          acc[team] = (acc[team] || 0) + 1;
        }
        return acc;
      }, {});

      const chartData = Object.keys(teamCounts)
        .map((team, index) => ({
          name: `Team ${index + 1}`,
          numsOfvote: teamCounts[team],
        }))
        .sort((a, b) => b.numsOfvote - a.numsOfvote);

      setData(chartData);
    };

    socket.onclose = () => {
      console.log('WS disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div style={{ marginTop: 40 }} className='App'>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout='vertical' data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis type='number' />
          <YAxis type='category' dataKey='name' />
          <Tooltip />
          <Legend />
          <Bar dataKey='numsOfvote' fill='#8884d8' isAnimationActive={true}>
            {data.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey='numsOfvote' fill='#8884d8' />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
