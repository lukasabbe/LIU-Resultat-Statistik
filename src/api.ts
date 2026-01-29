import axios from 'axios';


export interface Grade {
  grade: string;
  gradeOrder: number;
  quantity: number;
}

export interface CourseModule {
  moduleCode: string;
  date: string;
  grades: Grade[];
}

export interface CourseData {
  courseCode: string;
  courseNameSwe: string;
  courseNameEng: string;
  lastUpdatedTimestamp: string;
  modules: CourseModule[];
}

const API_URL = 'https://liutentor.lukasabbe.com';

export const fetchGradeStats = async (courseCode: string): Promise<CourseData> => {
  const { data } = await axios.get<CourseData>(`${API_URL}/api/courses/${courseCode}`);
  return data;
};

export const fetchAllCourses = async (): Promise<string[]> => {
  const { data } = await axios.get<string[]>(`${API_URL}/api/courses/`);
  return data;
};