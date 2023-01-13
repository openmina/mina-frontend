import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebNodeDemoService } from '@app/features/web-node-demo/web-node-demo.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-demo-active-web-node',
  templateUrl: './web-node-demo-active-web-node.component.html',
  styleUrls: ['./web-node-demo-active-web-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebNodeDemoActiveWebNodeComponent extends ManualDetection implements OnInit, AfterViewInit {

  network: string = 'Berkeley Testnet';
  height: number = 312423;

  @ViewChild('timeRef') private timeRef: ElementRef<HTMLDivElement>;

  private time: number;

  constructor(private webNodeDemoService: WebNodeDemoService) { super(); }

  ngOnInit(): void {
    this.webNodeDemoService.webNode$
      .pipe(untilDestroyed(this))
      .subscribe(webNode => {
        this.network = webNode.network;
        this.height = webNode.height;
        this.time = webNode.runningSince;
        this.detect();
      });
  }

  ngAfterViewInit(): void {
    const incrementSeconds = () => {
      this.timeRef.nativeElement.innerText = WebNodeDemoActiveWebNodeComponent.getFormattedTimeToDisplay((Date.now() - this.time) / 1000);
    };
    incrementSeconds();

    setInterval(incrementSeconds, 1000);
  }

  private static getFormattedTimeToDisplay(next: number): string {
    const twoDigit = (val: number) => val < 10 ? `0${val}` : val;
    let time = '';
    if (next <= 3599) {
      const min = Math.floor(next / 60);
      const sec = Math.floor(next % 60);
      time += twoDigit(min) + 'm ' + twoDigit(sec) + 's';
    } else {
      const hour = Math.floor(next / 3600);
      const min = Math.floor(next / 60 % 60);
      time += twoDigit(hour) + 'h ' + twoDigit(min) + 'm';
    }
    return 'Running ' + time;
  }

}
