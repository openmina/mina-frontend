import { ChangeDetectorRef, inject } from '@angular/core';

export abstract class ManualDetection {

  private changeDetectorRef = inject(ChangeDetectorRef);

  detect(): void {
    this.changeDetectorRef.detectChanges();
  };
}
