import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeDashes'
})
export class RemoveDashesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
