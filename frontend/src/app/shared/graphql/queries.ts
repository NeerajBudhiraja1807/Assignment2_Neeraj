import { gql } from 'apollo-angular';

export const GET_EMPLOYEES_QUERY = gql`
  query GetEmployees {
    getEmployees {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

export const GET_EMPLOYEE_QUERY = gql`
  query GetEmployee($id: ID!) {
    searchEmployee(id: $id) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

export const SEARCH_EMPLOYEES_QUERY = gql`
  query SearchEmployees($designation: String, $department: String) {
    searchEmployeeByDesignationOrDept(designation: $designation, department: $department) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;
