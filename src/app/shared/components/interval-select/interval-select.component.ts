import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged } from 'rxjs';
import { TimestampInterval } from '@shared/types/shared/timestamp-interval.type';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { ONE_THOUSAND, TEN_BILLIONS } from '@shared/constants/unit-measurements';

type PresetIntervals = { name: string, value: number }[];

const PRESET_INTERVALS: PresetIntervals = [
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

interface TimeForm {
  hour: FormControl<number>;
  minute: FormControl<number>;
  second: FormControl<number>;
  year: FormControl<number>;
  month: FormControl<number>;
  day: FormControl<number>;
}
const hourStr = 'hour';
const minuteStr = 'minute';
const secondStr = 'second';
const dayStr = 'day';
const monthStr = 'month';
const yearStr = 'year';

@UntilDestroy()
@Component({
  selector: 'mina-interval-select',
  templateUrl: './interval-select.component.html',
  styleUrls: ['./interval-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntervalSelectComponent extends ManualDetection implements OnInit, AfterViewInit {

  @Input() from: number;
  @Input() to: number;
  @Input() animate: boolean;

  @Output() onConfirm: EventEmitter<TimestampInterval> = new EventEmitter<TimestampInterval>();

  readonly presetIntervals: PresetIntervals = PRESET_INTERVALS;

  fromFormGroup: FormGroup<TimeForm>;
  toFormGroup: FormGroup<TimeForm>;
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
    const getFormGroup = (timestamp: number): FormGroup<TimeForm> => {
      const date = timestamp ? new Date(timestamp) : new Date();
      const formGroup = this.builder.group<TimeForm>({
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
          formGroup.get(hourStr).setValue(value.hour > 23 ? 23 : value.hour, { emitEvent: false });
          formGroup.get(minuteStr).setValue(value.minute > 59 ? 59 : value.minute, { emitEvent: false });
          formGroup.get(secondStr).setValue(value.second > 59 ? 59 : value.second, { emitEvent: false });
          formGroup.get(monthStr).setValue(value.month > 12 ? 12 : value.month, { emitEvent: false });
          formGroup.get(dayStr).setValue(value.day > 31 ? 31 : value.day, { emitEvent: false });
        });
      return formGroup;
    };
    this.fromFormGroup = getFormGroup(this.from < TEN_BILLIONS ? (this.from * ONE_THOUSAND) : this.from);
    this.toFormGroup = getFormGroup(this.to < TEN_BILLIONS ? (this.to * ONE_THOUSAND) : this.to);
  }

  presetInterval(value: number): void {
    const date = new Date(Date.now() - (value * 60000));
    IntervalSelectComponent.addDateToForm(this.toFormGroup, new Date());
    IntervalSelectComponent.addDateToForm(this.fromFormGroup, date);
  }

  onNowClick(formGroup: FormGroup): void {
    const date = new Date();
    IntervalSelectComponent.addDateToForm(formGroup, date);
  }

  private static addDateToForm(formGroup: FormGroup, date: Date): void {
    formGroup.get(hourStr).setValue(date.getHours());
    formGroup.get(minuteStr).setValue(date.getMinutes());
    formGroup.get(secondStr).setValue(date.getSeconds());
    formGroup.get(yearStr).setValue(date.getFullYear());
    formGroup.get(monthStr).setValue(date.getMonth() + 1);
    formGroup.get(dayStr).setValue(date.getDate());
  }

  confirm(): void {
    if (this.fromFormGroup.invalid || this.toFormGroup.invalid) {
      this.fromFormGroup.markAllAsTouched();
      this.toFormGroup.markAllAsTouched();
      return;
    }
    const fromDate = new Date(
      this.fromFormGroup.get(yearStr).value,
      this.fromFormGroup.get(monthStr).value - 1,
      this.fromFormGroup.get(dayStr).value,
      this.fromFormGroup.get(hourStr).value,
      this.fromFormGroup.get(minuteStr).value,
      this.fromFormGroup.get(secondStr).value,
    );
    const toDate = new Date(
      this.toFormGroup.get(yearStr).value,
      this.toFormGroup.get(monthStr).value - 1,
      this.toFormGroup.get(dayStr).value,
      this.toFormGroup.get(hourStr).value,
      this.toFormGroup.get(minuteStr).value,
      this.toFormGroup.get(secondStr).value,
    );

    if (fromDate.getTime() > toDate.getTime()) {
      this.invalidInterval = true;
      return;
    }

    this.onConfirm.emit({
      from: fromDate.getTime() / ONE_THOUSAND,
      to: toDate.getTime() / ONE_THOUSAND,
    });
  }

  cancel(): void {
    this.onConfirm.emit();
  }
}
