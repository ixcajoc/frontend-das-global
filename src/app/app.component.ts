import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50">
      <header class="bg-primary-800 text-white shadow-md">
        <div
          class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6"
        >
          <a routerLink="/" class="flex items-center gap-3">
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-white/30"
            >
            <img class="w-7 h-7" src="../assets/das_global.jpg" alt="logo das global">
            </span>
            <div>
              <h1 class="text-lg font-bold leading-tight sm:text-xl">
                DAS Global
              </h1>
              <p class="text-xs text-blue-100">Gestión de Sucursales</p>
            </div>
          </a>
        </div>
      </header>
      <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent {}
