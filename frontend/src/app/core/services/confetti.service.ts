// src/app/core/services/confetti.service.ts
import { Injectable } from '@angular/core';

type ConfettiFn = (opts: {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  [key: string]: any;
}) => boolean;

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  private launcher?: ConfettiFn;

  async launch(): Promise<void> {
    if (!this.launcher) {
      // dynamic import traz o módulo
      const mod = await import('canvas-confetti');
      // padrão ou named export
      this.launcher = (mod.default ?? mod) as ConfettiFn;
    }
    // duas rajadas de confete
    this.launcher({ particleCount: 120, spread: 60, origin: { y: 0.6 } });
    this.launcher({ particleCount: 60, spread: 120, origin: { y: 0.6 } });
  }
}
