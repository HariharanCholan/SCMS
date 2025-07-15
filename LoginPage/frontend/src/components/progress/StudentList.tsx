import React, { useEffect, useState } from "react";
import { fetchStudents, Student } from "../../services/studentService";

export default function StudentList({ onSelect }: { onSelect: (id: string) => void }) {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    loadStudents();
  }, []);

  return (
    <div className="w-1/4 p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Students</h2>
      {students.map((student) => (
        <div
          key={student._id}
          onClick={() => onSelect(student._id)}
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
        >
          {student.name}
        </div>
      ))}
    </div>
  );
}
