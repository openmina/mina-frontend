import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { selectAppDebuggerStatus, selectAppNodeStatus } from '@app/app.state';
import { BehaviorSubject, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { DebuggerStatus } from '@shared/types/app/debugger-status.type';
import { WebNodeStatus } from '@shared/types/app/web-node-status.type';
import { selectWebNodeLogs, selectWebNodePeers } from '@web-node/web-node.state';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { CONFIG } from '@shared/constants/config';

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

  readonly enabledDebugger: boolean = !!CONFIG.debugger;
  debuggerStatus: DebuggerStatus;
  debuggerTooltip: string;

  readonly enabledWebNode: boolean = !!CONFIG.features.includes('web-node');
  webNodeStatus: WebNodeStatus;
  webNodeTooltip: string;

  private interval: number;
  private secondsPassed: number = 0;
  private timeReference: number = 0;

  constructor(private store: Store<MinaState>,
              private zone: NgZone) { super(); }

  ngOnInit(): void {
    this.createTimer();
    this.listenToNodeStatusChange();
    this.listenToDebuggerStatusChange();
    this.listenToWebNodeStatusChange();
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
        filter(node => this.blockLevel !== node.blockLevel
          || this.status.toLowerCase() !== node.status.toLowerCase()
          || this.timeReference !== node.timestamp,
        ),
      )
      .subscribe((node: NodeStatus) => {
        this.timeIsPresent = !!node.timestamp;
        if (this.blockLevel !== node.blockLevel) {
          this.timeReference = node.timestamp;
          this.secondsPassed = (Date.now() - this.timeReference) / 1000;
          this.elapsedTime$.next(ServerStatusComponent.getFormattedTimeToDisplay(this.secondsPassed));
        }

        this.blockLevel = node.blockLevel;
        this.status = node.status.toLowerCase();
        this.nodeTooltip = TOOLTIP_MESSAGES[this.status];
        this.detect();
      });
  }

  private listenToDebuggerStatusChange(): void {
    if (!this.enabledDebugger) {
      return;
    }
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

    this.store.select(selectWebNodePeers)
      .pipe(filter(Boolean))
      .subscribe((peers: WebNodeLog[]) => {
        this.webNodeStatus = {
          ...this.webNodeStatus,
          peers: peers.length,
        };
        getTooltip();
        this.detect();
      });

    this.store.select(selectWebNodeLogs)
      .pipe(filter(Boolean))
      .subscribe((logs: WebNodeLog[]) => {
        this.webNodeStatus = {
          ...this.webNodeStatus,
          messages: logs.length,
        };
        getTooltip();
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
}
