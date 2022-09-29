import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export class TypedFormArray<T extends AbstractControl> extends FormArray {
  override controls: T[];
}

export class TypedFormGroup extends FormGroup {
  override get(path: Array<string | number> | string): FormControl | null {
    return super.get(path) as FormControl;
  }
}
