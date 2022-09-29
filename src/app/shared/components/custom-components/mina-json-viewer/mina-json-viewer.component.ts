import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgxJsonViewerComponent } from 'ngx-json-viewer';
import { Segment } from 'ngx-json-viewer/src/ngx-json-viewer/ngx-json-viewer.component';

@Component({
  selector: 'mina-json-viewer',
  templateUrl: './mina-json-viewer.component.html',
  styleUrls: ['./mina-json-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinaJsonViewerComponent extends NgxJsonViewerComponent implements OnChanges, OnInit {

  @Input() paddingLimitForNestedElements: number = 1000;
  @Input() internalDepth: number = 0;

  constructor(private cdRef: ChangeDetectorRef) { super(); }

  ngOnInit(): void {
    this.internalDepth++;
  }

  override ngOnChanges(): void {
    this.segments = [];

    this.json = this['decycle'](this.json);

    this['_currentDepth']++;

    if (typeof this.json === 'object') {
      Object.keys(this.json).forEach(key => {
        this.segments.push(this.customParseKeyValue(key, this.json[key]));
      });
    } else {
      this.segments.push(this.customParseKeyValue(`(${typeof this.json})`, this.json));
    }
  }

  private customParseKeyValue(key: any, value: any): Segment {
    const segment: Segment = this['parseKeyValue'](key, value);
    if (typeof segment.value === 'string' && Number(segment.value) >= 10000000000000000) {
      segment.type = 'number';
      segment.description = '' + segment.value;
    }
    return segment;
  }

  toggleAll(expand: boolean): void {
    this.segments.forEach((segment: Segment) => {
      segment.expanded = expand;
    });
    this.expanded = expand;
    this.cdRef.detectChanges();
  }
}
