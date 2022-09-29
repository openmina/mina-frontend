import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged } from 'rxjs';
import { NetworkTimestampInterval } from '@shared/types/network/network-timestamp-interval.type';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';

const PRESET_INTERVALS = [
  { name: '1m', value: 1 },
  { name: '5m', value: 5 },
  { name: '30m', value: 30 },
  { name: '1h', value: 60 },
  { name: '12h', value: 720 },
  { name: '1d', value: 1440 },
  { name: '2d', value: 2880 },
  { name: '7d', value: 10080 },
  { name: '30d', value: 43200 },
];

@UntilDestroy()
@Component({
  selector: 'mina-network-interval-select',
  templateUrl: './network-interval-select.component.html',
  styleUrls: ['./network-interval-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkIntervalSelectComponent extends ManualDetection implements OnInit, AfterViewInit {

  @Input() from: number;
  @Input() to: number;
  @Input() animate: boolean;

  @Output() onConfirm: EventEmitter<NetworkTimestampInterval> = new EventEmitter<NetworkTimestampInterval>();

  readonly presetIntervals = PRESET_INTERVALS;

  fromFormGroup: FormGroup;
  toFormGroup: FormGroup;
  invalidInterval: boolean;
  disabledBtn: boolean = true;

  @ViewChild('firstInput')
  private firstInput: ElementRef<HTMLInputElement>;

  constructor(private builder: FormBuilder) { super(); }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.firstInput.nativeElement.focus();
  }

  private initForm(): void {
    const getFormGroup = (timestamp: number): FormGroup => {
      const date = timestamp ? new Date(timestamp) : new Date();
      const formGroup = this.builder.group({
        hour: new FormControl(timestamp ? date.getHours() : null, Validators.required),
        minute: new FormControl(timestamp ? date.getMinutes() : null, Validators.required),
        second: new FormControl(timestamp ? date.getSeconds() : null, Validators.required),
        year: new FormControl(date.getFullYear(), Validators.required),
        month: new FormControl(date.getMonth() + 1, Validators.required),
        day: new FormControl(date.getDate(), Validators.required),
      });
      formGroup.valueChanges
        .pipe(
          untilDestroyed(this),
          distinctUntilChanged(),
        )
        .subscribe(value => {
          formGroup.get('hour').setValue(value.hour > 23 ? 23 : value.hour, { emitEvent: false });
          formGroup.get('minute').setValue(value.minute > 59 ? 59 : value.minute, { emitEvent: false });
          formGroup.get('second').setValue(value.second > 59 ? 59 : value.second, { emitEvent: false });
          formGroup.get('month').setValue(value.month > 12 ? 12 : value.month, { emitEvent: false });
          formGroup.get('day').setValue(value.day > 31 ? 31 : value.day, { emitEvent: false });
        });
      return formGroup;
    };
    this.fromFormGroup = getFormGroup(this.from * 1000);
    this.toFormGroup = getFormGroup(this.to * 1000);
  }

  presetInterval(value: number): void {
    const date = new Date(Date.now() - (value * 60000));
    NetworkIntervalSelectComponent.addDateToForm(this.toFormGroup, new Date());
    NetworkIntervalSelectComponent.addDateToForm(this.fromFormGroup, date);
  }

  onNowClick(formGroup: FormGroup): void {
    const date = new Date();
    NetworkIntervalSelectComponent.addDateToForm(formGroup, date);
  }

  private static addDateToForm(formGroup: FormGroup, date: Date): void {
    formGroup.get('hour').setValue(date.getHours());
    formGroup.get('minute').setValue(date.getMinutes());
    formGroup.get('second').setValue(date.getSeconds());
    formGroup.get('year').setValue(date.getFullYear());
    formGroup.get('month').setValue(date.getMonth() + 1);
    formGroup.get('day').setValue(date.getDate());
  }

  confirm(): void {
    if (this.fromFormGroup.invalid || this.toFormGroup.invalid) {
      this.fromFormGroup.markAllAsTouched();
      this.toFormGroup.markAllAsTouched();
      return;
    }
    const fromDate = new Date(
      this.fromFormGroup.get('year').value,
      this.fromFormGroup.get('month').value - 1,
      this.fromFormGroup.get('day').value,
      this.fromFormGroup.get('hour').value,
      this.fromFormGroup.get('minute').value,
      this.fromFormGroup.get('second').value,
    );
    const toDate = new Date(
      this.toFormGroup.get('year').value,
      this.toFormGroup.get('month').value - 1,
      this.toFormGroup.get('day').value,
      this.toFormGroup.get('hour').value,
      this.toFormGroup.get('minute').value,
      this.toFormGroup.get('second').value,
    );

    if (fromDate.getTime() > toDate.getTime()) {
      this.invalidInterval = true;
      return;
    }

    this.onConfirm.emit({
      from: fromDate.getTime() / 1000,
      to: toDate.getTime() / 1000,
    });
  }

  cancel(): void {
    this.onConfirm.emit();
  }
}
