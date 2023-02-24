import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Log } from '@shared/types/logs/log.type';

@Injectable({
  providedIn: 'root',
})
export class LogsService {

  constructor(private http: HttpClient) { }

  getLogs(): Observable<Log[]> {
    return of(mock).pipe(delay(400))
      .pipe(
        map((logs: any[]) => this.mapLogs(logs)),
      );
  }

  private mapLogs(logs: any[]): Log[] {
    return logs.map((log: any) => {
      return {
        timestamp: Date.parse(log.timestamp),
        date: log.timestamp.slice(0, -4),
        level: log.level,
        source: log.source,
        message: log.message.replace('$slot', log.metadata.slot).replace('$epoch', log.metadata.epoch),
        metadata: log.metadata,
        location: log.source.location,
        sourceModule: log.source.module,
      };
    });
  }
}

const mock = [
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '52',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 234,
      'slot': '53',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Debug',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '32',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 634,
      'slot': '57',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Warning',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Error',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Error',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Warning',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Warning',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Debug',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Debug',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Debug',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
  {
    'timestamp': '2023-02-13 14:45:20.926308Z',
    'level': 'Info',
    'source': {
      'module': 'Block_producer',
      'location': 'File "src/lib/block_producer/block_producer.ml", line 1117, characters 23-34',
    },
    'message': 'Block producer won slot $slot in epoch $epoch',
    'metadata': {
      'epoch': '0',
      'host': '135.181.136.108',
      'peer_id': '12D3KooWNRKmcZGvtytUkgJvujXWCBNpxx1zvhsgjHvHXCiKGdiE',
      'port': 10909,
      'slot': '886',
    },
  },
];
