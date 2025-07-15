export const mockClasses = [
  { id: 1, name: 'Class A', grade: '10th Grade' },
  { id: 2, name: 'Class B', grade: '10th Grade' },
  { id: 3, name: 'Class C', grade: '11th Grade' },
];

export const mockStudents = [
  { id: 1, name: 'Alice Smith', classId: 1, quizzes: [{ quizId: 1, score: 85 }, { quizId: 2, score: 92 }] },
  { id: 2, name: 'Bob Johnson', classId: 1, quizzes: [{ quizId: 1, score: 70 }, { quizId: 2, score: 88 }] },
  { id: 3, name: 'Charlie Brown', classId: 2, quizzes: [{ quizId: 1, score: 95 }, { quizId: 3, score: 91 }] },
  { id: 4, name: 'Diana Prince', classId: 2, quizzes: [{ quizId: 1, score: 60 }, { quizId: 3, score: 68 }] },
  { id: 5, name: 'Edward Scissorhands', classId: 3, quizzes: [{ quizId: 2, score: 45 }, { quizId: 3, score: 40 }] },
  { id: 6, name: 'Fiona Apple', classId: 3, quizzes: [{ quizId: 2, score: 98 }, { quizId: 3, score: 93 }] },
  { id: 7, name: 'George Harrison', classId: 1, quizzes: [{ quizId: 1, score: 30 }, { quizId: 2, score: 45 }] },
  { id: 8, name: 'Harriet Tubman', classId: 2, quizzes: [{ quizId: 1, score: 88 }, { quizId: 3, score: 82 }] },
];

export const mockQuizzes = [
  { id: 1, name: 'Math Quiz 1', subject: 'Mathematics', date: '2025-05-10', classId: 1 },
  { id: 2, name: 'Science Quiz 1', subject: 'Science', date: '2025-05-15', classId: 1 },
  { id: 3, name: 'History Quiz 1', subject: 'History', date: '2025-05-20', classId: 2 },
  { id: 4, name: 'English Lit Quiz', subject: 'English', date: '2025-05-25', classId: 3 },
];


export const calculateStudentAverage = (student) => {
  if (!student || !student.quizzes || student.quizzes.length === 0) return 0;
  const totalScore = student.quizzes.reduce((sum, quiz) => sum + quiz.score, 0);
  return Math.round(totalScore / student.quizzes.length);
};

export const getTopPerformersByClass = (classId, students, threshold = 80) => {
  return students
    .filter(student => student.classId === classId)
    .filter(student => calculateStudentAverage(student) >= threshold)
    .sort((a, b) => calculateStudentAverage(b) - calculateStudentAverage(a));
};

export const getLowPerformers = (students, threshold = 50) => {
  return students
    .filter(student => calculateStudentAverage(student) < threshold)
    .sort((a, b) => calculateStudentAverage(a) - calculateStudentAverage(b));
};

export const getLowPerformersByClass = (classId, students, threshold = 50) => {
  return students
    .filter(student => student.classId === classId)
    .filter(student => calculateStudentAverage(student) < threshold)
    .sort((a, b) => calculateStudentAverage(a) - calculateStudentAverage(b));
};


export const calculateClassAverage = (studentsInClass, classId, quizzesForClass) => {
    const relevantStudents = studentsInClass.filter(s => s.classId === classId);
    if (relevantStudents.length === 0) return 0;
    
    const totalAverageScore = relevantStudents.reduce((sum, student) => {
        return sum + calculateStudentAverage(student);
    }, 0);
    
    return Math.round(totalAverageScore / relevantStudents.length);
};
