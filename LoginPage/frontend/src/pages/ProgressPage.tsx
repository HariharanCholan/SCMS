import React, { useState } from "react";
import StudentList from "../components/progress/StudentList";
import StudentDetails from "../components/progress/StudentDetails";

export default function ProgressPage() {
  const [selectedId, setSelectedId] = useState<string>("");

  return (
    <div className="flex h-screen">
      <StudentList onSelect={setSelectedId} />
      {selectedId && <StudentDetails studentId={selectedId} />}
    </div>
  );
}
