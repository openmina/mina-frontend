import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RustNodeService {

  private url: string;

  changeRustNode(node: string): void {
    this.url = node;
  }

  get URL(): string {
    return this.url;
  }
}
