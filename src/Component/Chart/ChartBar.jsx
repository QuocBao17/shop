import { useEffect, useState } from 'react';
import './barChart.scss';
import { BarChart, Bar, AreaChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const ChartBar = () => {
  const [data, setData] = useState([
    {
      name: 'Jan',
      clothes: 12200,
      electronic: 5022,
      food: 5422,
      health: 3910,
      other: 6521
    },
    {
      name: 'Feb',
      clothes: 4200,
      electronic: 12022,
      food: 5032,
      health: 8210,
      other: 6543
    },
    {
      name: 'Mar',
      clothes: 12400,
      electronic: 6022,
      food: 7032,
      health: 7210,
      other: 2313
    },
    {
      name: 'Apr',
      clothes: 10200,
      electronic: 5022,
      food: 8732,
      health: 6210,
      other: 4532
    },
    {
      name: 'May',
      clothes: 4200,
      electronic: 10022,
      food: 7732,
      health: 6210,
      other: 7631
    },
    {
      name: 'Jun',
      clothes: 4200,
      electronic: 14242,
      food: 5532,
      health: 6210,
      other: 4321
    },
    {
      name: 'Jul',
      clothes: 7200,
      electronic: 12022,
      food: 5032,
      health: 7210,
      other: 4213
    },
    {
      name: 'Aug',
      clothes: 7200,
      electronic: 12022,
      food: 6032,
      health: 3210,
      other: 5942
    },
    {
      name: 'Sep',
      clothes: 2200,
      electronic: 8022,
      food: 5632,
      health: 6210,
      other: 5431
    },
    {
      name: 'Oct',
      clothes: 6200,
      electronic: 9022,
      food: 8032,
      health: 5410,
      other: 8932
    },
    {
      name: 'Nov',
      clothes: 5000,
      electronic: 11022,
      food: 6532,
      health: 2432,
      other: 5402
    },
    {
      name: 'Dec',
      clothes: 7200,
      electronic: 12022,
      food: 5032,
      health: 3210,
      other: 8213
    },
  ])
  return (
    // <ResponsiveContainer width={1000}>
      <BarChart
        width={1000}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="food" fill="#0E9F6E" />
        <Bar dataKey="electronic" fill="#3F83F8" />
        <Bar dataKey="health" fill="#0694A2" />
        <Bar dataKey="clothes" fill="#D7A300" />
        <Bar dataKey="other" fill="#9a1a1a" />
      </BarChart>
    // </ResponsiveContainer>
  )
}
export default ChartBar;