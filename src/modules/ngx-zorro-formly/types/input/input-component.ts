import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'nz-input-component',
    templateUrl: './input-component.html'

})
export class NzInputComponent extends FieldType {
    get type() {
        return this.to.type || 'text';
    }

    ngOnInit() {
        // console.log(this)
    }
}
