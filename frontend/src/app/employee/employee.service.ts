import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { 
  GET_EMPLOYEES_QUERY, 
  GET_EMPLOYEE_QUERY, 
  SEARCH_EMPLOYEES_QUERY, 
} from '../shared/graphql/queries';
import {
  ADD_EMPLOYEE_MUTATION, 
  UPDATE_EMPLOYEE_MUTATION, 
  DELETE_EMPLOYEE_MUTATION 
} from '../shared/graphql/mutations'
import { Employee } from '../shared/models/employee.model';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getEmployees() {
    return this.apollo.watchQuery({
      query: GET_EMPLOYEES_QUERY,
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  getEmployee(id: string) {
    return this.apollo.query({
      query: GET_EMPLOYEE_QUERY,
      variables: { id }
    });
  }

  searchEmployees(designation?: string, department?: string) {
    return this.apollo.query({
      query: SEARCH_EMPLOYEES_QUERY,
      variables: { designation, department }
    });
  }

  addEmployee(employee: Employee) {
    return this.apollo.mutate({
      mutation: ADD_EMPLOYEE_MUTATION,
      variables: { ...employee }
    });
  }

  updateEmployee(employee: Employee) {
    return this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE_MUTATION,
      variables: { ...employee }
    });
  }

  deleteEmployee(id: string) {
    return this.apollo.mutate({
      mutation: DELETE_EMPLOYEE_MUTATION,
      variables: { id }
    });
  }
}