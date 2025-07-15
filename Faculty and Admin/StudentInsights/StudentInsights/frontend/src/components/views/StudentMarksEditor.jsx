import React, { useEffect, useState } from 'react';

export default function StudentMarksEditor({ onBack }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [department, setDepartment] = useState('');
  const [className, setClassName] = useState('');
  const [subjects, setSubjects] = useState([]);

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    department: '',
    className: '',
    subjects: [{ name: '', marks: 0 }],
  });

  useEffect(() => {
    fetch('http://localhost:8002/api/student')
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  const handleSelectStudent = (e) => {
    const student = students.find(s => s._id === e.target.value);
    setSelectedStudent(student);
    setDepartment(student.department || '');
    setClassName(student.className || '');
    setSubjects(student.subjects || []);
  };

  const handleSubjectChange = (index, value) => {
    const updated = [...subjects];
    updated[index].name = value;
    setSubjects(updated);
  };

  const handleMarksChange = (index, value) => {
    const updated = [...subjects];
    updated[index].marks = Number(value);
    setSubjects(updated);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: '', marks: 0 }]);
  };

  const handleSave = async () => {
    const res = await fetch(`http://localhost:8002/api/student/${selectedStudent._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...selectedStudent, subjects, department, className }),
    });
    if (res.ok) alert('✅ Marks updated successfully!');
    else alert('❌ Update failed.');
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg text-white max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl text-white font-bold mb-4">Update Student Marks</h2>

      <select onChange={handleSelectStudent} className="text-black mb-4 p-2 rounded w-full">
        <option value="">Select Student</option>
        {students.map((s) => (
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
      </select>

      {selectedStudent && (
        <div>
          <h3 className="text-lg mb-2">Editing: {selectedStudent.name}</h3>
          <div className="mb-4">
            <input
              type="text"
              className="p-2 mb-2 w-full rounded text-black"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <input
              type="text"
              className="p-2 w-full rounded text-black"
              placeholder="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          {subjects.map((subj, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="p-1 text-black flex-1"
                placeholder="Subject Name"
                value={subj.name}
                onChange={(e) => handleSubjectChange(i, e.target.value)}
              />
              <input
                type="number"
                className="p-1 text-black w-20"
                placeholder="Marks"
                value={subj.marks}
                onChange={(e) => handleMarksChange(i, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleAddSubject} className="bg-green-600 px-3 py-1 rounded mt-2 mr-2">+ Add Subject</button>
          <button onClick={handleSave} className="bg-blue-600 px-3 py-1 rounded mt-2">💾 Save Marks</button>
        </div>
      )}

      {/* Add New Student Section */}
      <button
        onClick={() => setShowAddStudent(!showAddStudent)}
        className="bg-green-500 px-3 py-1 rounded mt-6 flex items-center justify-center"
      >
        + Add New Student
      </button>

      {showAddStudent && (
        <div className="mt-6 border-t border-slate-600 pt-4">
          <h3 className="text-lg font-semibold mb-2">Add New Student</h3>
          <input
            className="p-2 rounded mb-2 w-full text-black"
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          />
          <input
            className="p-2 rounded mb-2 w-full text-black"
            placeholder="Department"
            value={newStudent.department}
            onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
          />
          <input
            className="p-2 rounded mb-2 w-full text-black"
            placeholder="Class Name"
            value={newStudent.className}
            onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
          />

          {newStudent.subjects.map((subj, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                className="p-1 text-black flex-1"
                placeholder="Subject"
                value={subj.name}
                onChange={(e) => {
                  const updated = [...newStudent.subjects];
                  updated[idx].name = e.target.value;
                  setNewStudent({ ...newStudent, subjects: updated });
                }}
              />
              <input
                type="number"
                className="p-1 text-black w-20"
                placeholder="Marks"
                value={subj.marks}
                onChange={(e) => {
                  const updated = [...newStudent.subjects];
                  updated[idx].marks = Number(e.target.value);
                  setNewStudent({ ...newStudent, subjects: updated });
                }}
              />
            </div>
          ))}

          <button
            onClick={() =>
              setNewStudent({ ...newStudent, subjects: [...newStudent.subjects, { name: '', marks: 0 }] })
            }
            className="bg-green-600 px-3 py-1 rounded mt-2 mr-2"
          >
            + Add Subject
          </button>
          <button
            onClick={async () => {
              const res = await fetch('http://localhost:8002/api/student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudent),
              });
              if (res.ok) {
                alert('✅ Student added successfully!');
                setShowAddStudent(false);
                setNewStudent({
                  name: '',
                  department: '',
                  className: '',
                  subjects: [{ name: '', marks: 0 }],
                });
                const refreshed = await fetch('http://localhost:8002/api/student').then((r) => r.json());
                setStudents(refreshed);
              } else {
                alert('❌ Failed to add student');
              }
            }}
            className="bg-blue-600 px-3 py-1 rounded mt-2"
          >
            💾 Save New Student
          </button>
        </div>
      )}
    </div>
  );
}
