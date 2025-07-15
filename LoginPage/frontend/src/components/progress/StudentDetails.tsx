import React, { useEffect, useState } from "react";
import axios from "axios";
import GradeGraph from "./GradeGraph";

export default function StudentDetails({ studentId }: { studentId: string }) {
  const [studentData, setStudentData] = useState<any>(null);
  const [graphType, setGraphType] = useState<"overall" | "individual">("overall");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  useEffect(() => {
    axios.get(`/api/students/${studentId}`).then((res) => setStudentData(res.data));
  }, [studentId]);

  if (!studentData) return <div className="p-4">Loading...</div>;

  return (
    <div className="w-3/4 p-4">
      <h2 className="text-xl font-bold">{studentData.name}'s Performance</h2>
      <div className="mt-4">
        <button onClick={() => setGraphType("overall")}>Overall</button>
        <button onClick={() => setGraphType("individual")}>Individual</button>
        {graphType === "individual" && (
          <select onChange={(e) => setSelectedSubject(e.target.value)}>
            {studentData.grades.map((g: any) => (
              <option key={g.subject} value={g.subject}>{g.subject}</option>
            ))}
          </select>
        )}
      </div>
      <GradeGraph type={graphType} studentId={studentId} subject={selectedSubject} />
    </div>
  );
}
