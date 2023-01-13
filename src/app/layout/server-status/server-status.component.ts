import { AfterViewInit, ChangeDetectionStrategy, Component, ComponentRef, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { selectActiveNode, selectAppDebuggerStatus, selectAppMenu, selectAppNodeStatus, selectNodes } from '@app/app.state';
import { BehaviorSubject, filter, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { DebuggerStatus } from '@shared/types/app/debugger-status.type';
import { WebNodeStatus } from '@shared/types/app/web-node-status.type';
import { selectWebNodeSummary } from '@web-node/web-node.state';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CONFIG } from '@shared/constants/config';
import { NodePickerComponent } from '@app/layout/node-picker/node-picker.component';

const TOOLTIP_MESSAGES: { [p: string]: string } = {
  [AppNodeStatusTypes.OFFLINE.toLowerCase()]: 'Is when the node has not received any messages for a while',
  [AppNodeStatusTypes.CONNECTING.toLowerCase()]: 'Is when the node has not received any messages for a while',
  [AppNodeStatusTypes.LISTENING.toLowerCase()]: 'Is when the node has already connected to some peers and is waiting to receive messages from them',
  [AppNodeStatusTypes.BOOTSTRAP.toLowerCase()]: 'Means that the node has not yet completed the download of the epoch ledgers',
  [AppNodeStatusTypes.CATCHUP.toLowerCase()]: 'Means that there are pending catchup jobs',
  [AppNodeStatusTypes.SYNCED.toLowerCase()]: 'Online, up to date, with no pending catchup jobs.',
};

@Component({
  selector: 'mina-server-status',
  templateUrl: './server-status.component.html',
  styleUrls: ['./server-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row align-center' },
})
export class ServerStatusComponent extends ManualDetection implements OnInit {

  readonly elapsedTime$: BehaviorSubject<string> = new BehaviorSubject<string>('0s');

  blockLevel: number;
  status: string = AppNodeStatusTypes.CONNECTING.toLowerCase();
  timeIsPresent: boolean;
  nodeTooltip: string = TOOLTIP_MESSAGES[this.status];
  isMobile: boolean;

  activeNode: MinaNode;

  enabledDebugger: boolean = CONFIG.configs.some(n => n.debugger);
  debuggerStatus: DebuggerStatus;
  debuggerTooltip: string;

  enabledWebNode: boolean;
  webNodeStatus: WebNodeStatus;
  webNodeTooltip: string;

  @ViewChild('overlayOpener') private overlayOpener: ElementRef<HTMLDivElement>;

  private nodes: MinaNode[] = [];
  private interval: any;
  private secondsPassed: number = 0;
  private timeReference: number = 0;
  private overlayRef: OverlayRef;
  private nodePickerComponent: ComponentRef<NodePickerComponent>;

  constructor(private zone: NgZone,
              private overlay: Overlay,
              private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.createTimer();
    this.listenToNodeStatusChange();
    this.listenToDebuggerStatusChange();
    this.listenToWebNodeStatusChange();
    this.listenToMenuChange();
    this.listenToNodeChanges();
  }

  private createTimer(): void {
    this.zone.run(() => {
      this.interval = setInterval(() => {
        const next = this.secondsPassed + 1;
        const time = ServerStatusComponent.getFormattedTimeToDisplay(next);

        this.secondsPassed++;
        this.elapsedTime$.next(time);
      }, 1000);
    });
  }

  private listenToNodeStatusChange(): void {
    this.store.select(selectAppNodeStatus)
      .pipe(
        filter(node => this.status.toLowerCase() !== node.status.toLowerCase()
          || this.timeReference !== node.timestamp,
        ),
      )
      .subscribe((node: NodeStatus) => {
        this.timeIsPresent = !!node.timestamp;
        this.timeReference = node.timestamp;
        this.secondsPassed = (Date.now() - this.timeReference) / 1000;
        this.elapsedTime$.next(ServerStatusComponent.getFormattedTimeToDisplay(this.secondsPassed));

        this.blockLevel = node.blockLevel;
        this.status = node.status.toLowerCase();
        this.nodeTooltip = TOOLTIP_MESSAGES[this.status];
        this.detect();
      });
  }

  private listenToDebuggerStatusChange(): void {
    this.store.select(selectAppDebuggerStatus)
      .subscribe((debuggerStatus: DebuggerStatus) => {
        this.debuggerStatus = debuggerStatus;
        this.debuggerTooltip = 'Debugger is ' + (debuggerStatus.isOnline ? 'online' : 'offline');
        this.detect();
      });
  }

  private listenToWebNodeStatusChange(): void {
    if (!this.enabledWebNode) {
      return;
    }

    const getTooltip = (): void => {
      this.webNodeTooltip = 'Web Node is ' + ((this.webNodeStatus.peers || this.webNodeStatus.messages) ? 'online' : 'offline');
    };

    this.store.select(selectWebNodeSummary)
      .pipe(
        filter(Boolean),
        filter(s => s.peers !== this.webNodeStatus?.peers || s.messages !== this.webNodeStatus?.messages),
      )
      .subscribe((status: WebNodeStatus) => {
        this.webNodeStatus = status;
        getTooltip();
        this.detect();
      });
  }

  private listenToMenuChange(): void {
    this.store.select(selectAppMenu)
      .pipe(filter(menu => menu.isMobile !== this.isMobile))
      .subscribe((menu: AppMenu) => {
        this.isMobile = menu.isMobile;
        this.detect();
      });
  }

  private listenToNodeChanges(): void {
    this.store.select(selectNodes)
      .pipe(filter(nodes => nodes.length > 0))
      .subscribe((nodes: MinaNode[]) => {
        this.nodes = nodes;
        if (this.overlayRef?.hasAttached()) {
          this.detachOverlay();
          this.openNodePicker();
        }
        this.detect();
      });
    this.store.select(selectActiveNode)
      .pipe(filter(Boolean))
      .subscribe((activeNode: MinaNode) => {
        this.activeNode = activeNode;
        this.enabledDebugger = !!activeNode.debugger;
        this.enabledWebNode = activeNode.features.includes('web-node');
        this.detect();
      });
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
    return time;
  }

  openNodePicker(event?: MouseEvent): void {
    event?.stopImmediatePropagation();
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
      return;
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      width: 'auto',
      minWidth: '220px',
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.overlayOpener.nativeElement)
        .withPositions([{
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 10,
          offsetX: -10,
        }]),
    });

    const portal = new ComponentPortal(NodePickerComponent);
    this.nodePickerComponent = this.overlayRef.attach<NodePickerComponent>(portal);
    this.nodePickerComponent.instance.nodes = this.nodes;
    this.nodePickerComponent.instance.filteredNodes = this.nodes;
    this.nodePickerComponent.instance.activeNode = this.activeNode;
    this.nodePickerComponent.instance.closeEmitter.pipe(take(1)).subscribe(() => this.detachOverlay());
  }

  detachOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
