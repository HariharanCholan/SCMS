import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function getGrade(score, maxScore) {
  if (typeof score !== 'number' || typeof maxScore !== 'number' || maxScore <= 0) return 'N/A';
  const percentage = (score / maxScore) * 100;

  if (percentage >= 90) return 'O';
  if (percentage >= 80) return 'A+';
  if (percentage >= 70) return 'A';
  if (percentage >= 60) return 'B+';
  if (percentage >= 50) return 'B';
  return 'F';
}
