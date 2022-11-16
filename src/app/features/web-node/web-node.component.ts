import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebNodeService } from '@app/features/web-node/web-node.service';
import { onProgress$, WasmLoadProgressEvent } from '../../../assets/webnode/mina-rust';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { APP_CHANGE_SUB_MENUS, AppChangeSubMenus } from '@app/app.actions';
import { Routes } from '@shared/enums/routes.enum';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { LoadingService } from '@core/services/loading.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { WEB_NODE_SHARED_INIT, WebNodeSharedInit } from '@web-node/web-node.actions';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';


@UntilDestroy()
@Component({
  selector: 'mina-web-node',
  templateUrl: './web-node.component.html',
  styleUrls: ['./web-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebNodeComponent extends ManualDetection implements OnInit, AfterViewInit {

  wasmLoaded: boolean;

  @ViewChild('iconContainer') private iconContainer: ElementRef<HTMLDivElement>;
  @ViewChild('speed') private speedElement: ElementRef<HTMLDivElement>;
  @ViewChild('remainingTime') private remainingTimeElement: ElementRef<HTMLDivElement>;

  constructor(private store: Store<MinaState>,
              private loadingService: LoadingService,
              private webNodeService: WebNodeService) { super(); }

  ngOnInit(): void {
    this.store.dispatch<AppChangeSubMenus>({ type: APP_CHANGE_SUB_MENUS, payload: [Routes.WALLET, Routes.PEERS, Routes.LOGS, Routes.STATE] });
    this.store.dispatch<WebNodeSharedInit>({ type: WEB_NODE_SHARED_INIT });
  };

  ngAfterViewInit(): void {
    this.downloadWasm();
  }

  private downloadWasm(): void {
    if (this.webNodeService.wasmIsAlreadyLoaded) {
      return;
    }
    this.webNodeService.instantiateWasm();
    this.listenToWasmDownloadingProgress();

    this.webNodeService.wasmReady$.subscribe(() => {
      this.wasmLoaded = true;
      this.detect();
    });
  }

  private listenToWasmDownloadingProgress(): void {
    const startTime = Date.now();

    onProgress$
      .pipe(untilDestroyed(this))
      .subscribe((event: WasmLoadProgressEvent) => {

        // Calculate percentage
        const percentComplete = Math.floor((event.loaded / event.total) * 100);

        // Get download speed
        const duration = (new Date().getTime() - startTime) / ONE_THOUSAND;
        const bps = event.loaded / duration;
        const kbps = bps / 1024;
        let speed;
        if (kbps > 1024) {
          speed = Math.floor(kbps / 1024) + 'MB/s';
        } else {
          speed = Math.floor(kbps) + 'KB/s';
        }

        // Get remaining time
        const time = (event.total - event.loaded) / bps;
        const minutes = time / 60;
        let remaining;
        if (minutes >= 1) {
          remaining = Math.ceil(minutes) + 'm';
        } else {
          const seconds = time % 60;
          remaining = Math.ceil(seconds) + 's';
        }

        this.loadingService.setProgress({
          percentage: percentComplete,
          speed,
          remaining,
        });
      });
  }

}
