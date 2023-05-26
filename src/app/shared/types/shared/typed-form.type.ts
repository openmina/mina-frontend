import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export class TypedFormArray<T extends AbstractControl> extends FormArray {
  override controls: T[];
}

export class TypedFormGroup<T extends { [K in keyof T]: AbstractControl<any, any>; } = any> extends FormGroup<T> {
  override get(path: Array<string | number> | string): FormControl | null {
    return super.get(path) as FormControl;
  }
}

export interface FormDefinitions {
  [key: string]: AbstractControl;
}
