// src/services/studentService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/students'; // Replace with your actual backend endpoint

// Types
export interface Student {
  _id: string;
  name: string;
  class: string;
  email: string;
}

export interface Grade {
  subject: string;
  score: number;
  date: string;
}

// Fetch list of all students
export const fetchStudents = async (): Promise<Student[]> => {
  const response = await axios.get<Student[]>(`${API_BASE_URL}`);
  return response.data;
};

// Fetch details of a single student
export const fetchStudentDetails = async (studentId: string): Promise<Student> => {
  const response = await axios.get<Student>(`${API_BASE_URL}/${studentId}`);
  return response.data;
};

// Fetch grades of a single student
export const fetchStudentGrades = async (studentId: string): Promise<Grade[]> => {
  const response = await axios.get<Grade[]>(`${API_BASE_URL}/${studentId}/grades`);
  return response.data;
};
