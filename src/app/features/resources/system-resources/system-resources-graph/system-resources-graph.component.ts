import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'mina-system-resources-graph',
  templateUrl: './system-resources-graph.component.html',
  styleUrls: ['./system-resources-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemResourcesGraphComponent implements OnChanges {

  @Input() title: string;
  @Input() seriesNames: any[];
  @Input() chartData: any[];

  @ViewChild('graphDiv', { static: true }) private graphDiv: ElementRef<HTMLDivElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private zone: NgZone) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'].isFirstChange() && changes['chartData'].currentValue) {
    }
  }

}
