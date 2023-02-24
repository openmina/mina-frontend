import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { WebNodePeersService } from '@web-node/web-node-peers/web-node-peers.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { isStringAValidJson } from '@shared/helpers/user-input.helper';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-peers-connect',
  templateUrl: './web-node-peers-connect.component.html',
  styleUrls: ['./web-node-peers-connect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class WebNodePeersConnectComponent extends ManualDetection implements AfterViewInit {

  activeStep: number = 0;
  pastedPeerId: boolean;
  copiedOffer: boolean;
  pastedAnswer: boolean;
  peerId: string;
  offer: any;
  answer: any;
  peerIdMessage: string;

  formControl: FormControl = new FormControl();

  @ViewChild('firstInput') private firstInput: ElementRef<HTMLInputElement>;

  constructor(private router: Router,
              private clipboard: Clipboard,
              private webNodePeersService: WebNodePeersService) { super(); }

  ngAfterViewInit(): void {
    this.firstInput.nativeElement.focus();
    this.listenToFormChanges();
    this.listenToPasteEvent();
  }

  private listenToPasteEvent(): void {
    fromEvent<KeyboardEvent>(window, 'keyup')
      .pipe(untilDestroyed(this))
      .subscribe((event: KeyboardEvent) => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if (event.ctrlKey && charCode === 'v') {
          if (this.activeStep === 0 && (event.target as HTMLElement).tagName !== 'INPUT') {
            this.onPastePeerId();
          } else if (this.activeStep === 2) {
            this.onAnswerPaste();
            this.activeStep++;
          }
        }
      });
  }

  private listenToFormChanges(): void {
    this.formControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value: string) => {
        this.peerId = value;
        this.pastedPeerId = true;
        this.checkPeerIdValidity();
      });
  }

  nextStep(): void {
    if (this.activeStep === 0 && !this.pastedPeerId) {
      this.onPastePeerId();
      return;
    } else if (this.activeStep === 0 && this.pastedPeerId) {
      this.getOffer();
    } else if (this.activeStep === 1 && !this.copiedOffer) {
      this.clipboard.copy(JSON.stringify(this.offer));
      this.copiedOffer = true;
      return;
    } else if (this.activeStep === 2) {
      this.onAnswerPaste();
    } else if (this.activeStep === 3) {
      this.finishDialer();
    }
    this.activeStep++;
    this.detect();
  }

  private onPastePeerId(): void {
    navigator.clipboard.readText().then(content => {
      this.peerId = content;
      this.pastedPeerId = true;
      this.formControl.setValue(content, { emitEvent: false });
      this.checkPeerIdValidity();
      this.detect();
    });
  }

  private onAnswerPaste(): void {
    navigator.clipboard.readText().then(content => {
      if (isStringAValidJson(content)) {
        this.answer = JSON.parse(content);
        this.pastedAnswer = true;
        this.detect();
      }
    });
  }

  prevStep(): void {
    this.activeStep--;
  }

  private getOffer(): void {
    this.webNodePeersService.getDialerOffer(this.peerId)
      .pipe(untilDestroyed(this))
      .subscribe((offer: any) => {
        this.offer = offer;
        this.detect();
      });
  }

  private finishDialer(): void {
    this.webNodePeersService.finishDialer(this.peerId, this.answer)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.router.navigate([Routes.WEB_NODE, Routes.PEERS], { queryParamsHandling: 'merge' });
      });
  }

  private checkPeerIdValidity(): void {
    this.webNodePeersService.isPeerIdValid(this.peerId)
      .pipe(untilDestroyed(this))
      .subscribe((message: string | null) => {
        if (message) {
          this.peerIdMessage = message[0].toUpperCase() + message.slice(1);
        } else {
          this.peerIdMessage = message;
        }
        this.detect();
      });
  }
}
