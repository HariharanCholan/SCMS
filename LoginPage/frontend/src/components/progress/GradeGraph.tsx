import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function GradeGraph({
  type,
  studentId,
  subject,
}: {
  type: "overall" | "individual";
  studentId: string;
  subject?: string;
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url =
      type === "overall"
        ? `/api/students/${studentId}/grades`
        : `/api/students/${studentId}/grades?subject=${subject}`;
    axios.get(url).then((res) => setData(res.data));
  }, [type, studentId, subject]);

  return (
    <div className="mt-4">
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="term" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="grade" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
