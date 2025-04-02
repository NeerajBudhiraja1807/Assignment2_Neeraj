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
  DELETE_EMPLOYEE_MUTATION,
} from '../shared/graphql/mutations';
import { Employee } from '../shared/models/employee.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getEmployees() {
    return this.apollo
      .watchQuery<{ getEmployees: Employee[] }>({
        query: GET_EMPLOYEES_QUERY,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result) => result.data.getEmployees),
        catchError((error) =>
          throwError(() => new Error('Failed to load employees'))
        )
      );
  }

  getEmployee(id: string) {
    return this.apollo
      .query({
        query: GET_EMPLOYEE_QUERY,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result: any) => result.data.searchEmployee),
        catchError((error) =>
          throwError(() => new Error('Failed to load employee'))
        )
      );
  }

  searchEmployees(designation?: string, department?: string) {
    return this.apollo
      .query({
        query: SEARCH_EMPLOYEES_QUERY,
        variables: { designation, department },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result: any) => result.data.searchEmployeeByDesignationOrDept),
        catchError((error) =>
          throwError(() => new Error('Failed to search employees'))
        )
      );
  }

  addEmployee(employee: Employee) {
    return this.apollo
      .mutate({
        mutation: ADD_EMPLOYEE_MUTATION,
        variables: { ...employee },
      })
      .pipe(
        map((result: any) => result.data.addEmployee),
        catchError((error) =>
          throwError(() => new Error('Failed to add employee'))
        )
      );
  }

  updateEmployee(employee: Employee) {
    return this.apollo
      .mutate({
        mutation: UPDATE_EMPLOYEE_MUTATION,
        variables: { ...employee },
      })
      .pipe(
        map((result: any) => result.data.updateEmployee),
        catchError((error) =>
          throwError(() => new Error('Failed to update employee'))
        )
      );
  }

  deleteEmployee(id: string) {
    return this.apollo
      .mutate({
        mutation: DELETE_EMPLOYEE_MUTATION,
        variables: { id },
      })
      .pipe(
        map((result: any) => result.data.deleteEmployee),
        catchError((error) =>
          throwError(() => new Error('Failed to delete employee'))
        )
      );
  }
}
