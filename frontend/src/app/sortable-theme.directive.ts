import { EventEmitter, Directive, Input, Output } from '@angular/core';
import { Theme } from './theme';

export type sortColumn = keyof Theme | '';
export type sortDirection = 'asc' | 'desc' | '';
export interface sortEvent {
  column: sortColumn;
  direction: sortDirection;
}

const rotate: {[key: string]: sortDirection} = {'asc':'desc', 'desc':'', '': 'asc'}

@Directive({
  selector: 'thh[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'directoin === "desc"'
  }
})

export class SortableThemeHeader {
  @Input() sortable: sortColumn = '';
  @Input() direction: sortDirection = '';
  @Output() sort = new EventEmitter<sortEvent>();
  
  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction})
  }

}
