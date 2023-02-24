import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { WebNodePeersService } from '@web-node/web-node-peers/web-node-peers.service';
import { Routes } from '@shared/enums/routes.enum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';
import { isStringAValidJson } from '@shared/helpers/user-input.helper';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-peers-listen',
  templateUrl: './web-node-peers-listen.component.html',
  styleUrls: ['./web-node-peers-listen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class WebNodePeersListenComponent extends ManualDetection {

  activeStep: number = 0;
  copiedPeerId: boolean;
  pastedOffer: boolean;
  copiedAnswer: boolean;
  peerId: string;
  offer: any;
  answer: any;

  constructor(private router: Router,
              private clipboard: Clipboard,
              private webNodePeersService: WebNodePeersService) { super(); }

  ngOnInit(): void {
    this.getPeerId();
    this.listenToPasteEvent();
  }

  private listenToPasteEvent(): void {
    fromEvent<KeyboardEvent>(window, 'keyup')
      .pipe(untilDestroyed(this))
      .subscribe((event: KeyboardEvent) => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if (this.activeStep === 1 && event.ctrlKey && charCode === 'v') {
          this.onOfferPaste();
          this.activeStep++;
        }
      });
  }

  nextStep(): void {
    if (this.activeStep === 0 && !this.copiedPeerId) {
      this.clipboard.copy(this.peerId);
      this.copiedPeerId = true;
      return;
    } else if (this.activeStep === 1 && !this.pastedOffer) {
      this.onOfferPaste();
    } else if (this.activeStep === 2) {
      this.getAnswer();
    } else if (this.activeStep === 3 && !this.copiedAnswer) {
      this.clipboard.copy(JSON.stringify(this.answer));
      this.copiedAnswer = true;
      return;
    } else if (this.activeStep === 3) {
      this.finishListener();
    }
    this.activeStep++;
    this.detect();
  }

  private onOfferPaste(): void {
    navigator.clipboard.readText().then(content => {
      if (isStringAValidJson(content)) {
        this.offer = JSON.parse(content);
        this.pastedOffer = true;
        this.detect();
      } else {
        this.activeStep--;
      }
    });
  }

  prevStep(): void {
    this.activeStep--;
  }

  private getPeerId(): void {
    this.webNodePeersService.getPeerId()
      .pipe(untilDestroyed(this))
      .subscribe((peerId: string) => {
        this.peerId = peerId;
        this.detect();
      });
  }

  private getAnswer(): void {
    this.webNodePeersService.getAnswer(this.offer)
      .pipe(untilDestroyed(this))
      .subscribe((answer: string) => {
        this.answer = answer;
        this.detect();
      });
  }

  private finishListener(): void {
    this.webNodePeersService.finishListener()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.router.navigate([Routes.WEB_NODE, Routes.PEERS], { queryParamsHandling: 'merge' });
      });
  }
}
