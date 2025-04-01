export interface Employee {
    id: string; // Changed from optional to required
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    designation: string;
    salary: number;
    date_of_joining: string;
    department: string;
    employee_photo?: string;
  }