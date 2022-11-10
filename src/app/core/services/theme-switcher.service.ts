import { APP_INITIALIZER, Inject, Injectable, Provider, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Theme } from '@shared/types/core/theme/theme.type';
import { ThemeType } from '@shared/types/core/theme/theme-types.type';
import {
  AWARE_CSS_PREFIX,
  BASE_CSS_PREFIX,
  CHART_CSS_PREFIX,
  CODE_CSS_PREFIX,
  SELECTED_CSS_PREFIX,
  SPECIAL_CSS_PREFIX,
  SUCCESS_CSS_PREFIX,
  WARN_CSS_PREFIX,
} from '@shared/types/core/theme/theme-css-category.type';

const DARK_THEME: Theme = {
  name: ThemeType.DARK,
  categories: {
    base: {
      [`${BASE_CSS_PREFIX}primary`]: 'rgba(255,255,255,0.8)',
      [`${BASE_CSS_PREFIX}secondary`]: 'rgba(255,255,255,0.65)',
      [`${BASE_CSS_PREFIX}tertiary`]: 'rgba(255,255,255,0.4)',
      [`${BASE_CSS_PREFIX}divider`]: 'rgba(255,255,255,0.07)',
      [`${BASE_CSS_PREFIX}container`]: 'rgba(255,255,255,0.05)',
      [`${BASE_CSS_PREFIX}surface`]: '#141414',
      [`${BASE_CSS_PREFIX}background`]: '#0d0d0d',
      [`${BASE_CSS_PREFIX}surface-top`]: '#202020',
    },
    success: {
      [`${SUCCESS_CSS_PREFIX}primary`]: '#81e06c',
      [`${SUCCESS_CSS_PREFIX}secondary`]: 'rgba(129,224,108,0.6)',
      [`${SUCCESS_CSS_PREFIX}tertiary`]: 'rgba(129,224,108,0.4)',
      [`${SUCCESS_CSS_PREFIX}divider`]: 'rgba(129,224,108,0.2)',
      [`${SUCCESS_CSS_PREFIX}container`]: 'rgba(129,224,108,0.05)',
    },
    aware: {
      [`${AWARE_CSS_PREFIX}primary`]: '#ffcc00',
      [`${AWARE_CSS_PREFIX}secondary`]: 'rgba(255,204,0,0.6)',
      [`${AWARE_CSS_PREFIX}tertiary`]: 'rgba(255,204,0,0.4)',
      [`${AWARE_CSS_PREFIX}container`]: 'rgba(255,204,0,0.1)',
    },
    warn: {
      [`${WARN_CSS_PREFIX}primary`]: '#ea4646',
      [`${WARN_CSS_PREFIX}secondary`]: 'rgba(234,70,70,0.6)',
      [`${WARN_CSS_PREFIX}tertiary`]: 'rgba(234,70,70,0.4)',
      [`${WARN_CSS_PREFIX}container`]: 'rgba(234,70,70,0.1)',
    },
    selected: {
      [`${SELECTED_CSS_PREFIX}primary`]: '#61aeee',
      [`${SELECTED_CSS_PREFIX}secondary`]: 'rgba(97,174,238,0.6)',
      [`${SELECTED_CSS_PREFIX}tertiary`]: 'rgba(97,174,238,0.07)',
      [`${SELECTED_CSS_PREFIX}container`]: 'rgba(97,174,238,0.1)',
    },
    special: {
      [`${SPECIAL_CSS_PREFIX}surface`]: '#000000',
    },
    chart: {
      [`${CHART_CSS_PREFIX}yellow-red-5`]: '#b10026',
      [`${CHART_CSS_PREFIX}yellow-red-4`]: '#e31a1c',
      [`${CHART_CSS_PREFIX}yellow-red-3`]: '#fc4e2a',
      [`${CHART_CSS_PREFIX}yellow-red-2`]: '#fd8d3c',
      [`${CHART_CSS_PREFIX}yellow-red-1`]: '#feb24c',
      [`${CHART_CSS_PREFIX}yellow-red-0`]: '#fed976',
      [`${CHART_CSS_PREFIX}yellow-red-grey`]: '#b9ae90',
      [`${CHART_CSS_PREFIX}green-blue-5`]: '#08589e',
      [`${CHART_CSS_PREFIX}green-blue-4`]: '#2b8cbe',
      [`${CHART_CSS_PREFIX}green-blue-3`]: '#4eb3d3',
      [`${CHART_CSS_PREFIX}green-blue-2`]: '#7bccc4',
      [`${CHART_CSS_PREFIX}green-blue-1`]: '#a8ddb5',
      [`${CHART_CSS_PREFIX}green-blue-0`]: '#ccebc5',
      [`${CHART_CSS_PREFIX}classic-yellow`]: '#ffcc00',
      [`${CHART_CSS_PREFIX}classic-yellow-light`]: '#ffeda3',
      [`${CHART_CSS_PREFIX}classic-purple`]: '#927fb9',
      [`${CHART_CSS_PREFIX}classic-purple-light`]: '#bba4d1',
      [`${CHART_CSS_PREFIX}classic-blue`]: '#3399cc',
      [`${CHART_CSS_PREFIX}classic-blue-light`]: '#99cce5',
    },
    code: {
      [`${CODE_CSS_PREFIX}red`]: '#f0766d',
      [`${CODE_CSS_PREFIX}green`]: '#85f297',
      [`${CODE_CSS_PREFIX}yellow`]: '#f5f8a8',
      [`${CODE_CSS_PREFIX}blue`]: '#abc4f6',
      [`${CODE_CSS_PREFIX}magenta`]: '#f299ce',
      [`${CODE_CSS_PREFIX}teal`]: '#abebfc',
    },
  },
};

const LIGHT_THEME: Theme = {
  name: ThemeType.LIGHT,
  categories: {
    base: {
      [`${BASE_CSS_PREFIX}primary`]: '#252726',
      [`${BASE_CSS_PREFIX}secondary`]: 'rgba(0, 0, 0, 0.65)',
      [`${BASE_CSS_PREFIX}tertiary`]: 'rgba(0, 0, 0, 0.4)',
      [`${BASE_CSS_PREFIX}divider`]: 'rgba(0, 0, 0, 0.07)',
      [`${BASE_CSS_PREFIX}container`]: 'rgba(0, 0, 0, 0.04)',
      [`${BASE_CSS_PREFIX}surface`]: '#ffffff',
      [`${BASE_CSS_PREFIX}background`]: '#eeeeee',
      [`${BASE_CSS_PREFIX}surface-top`]: '#f5f5f5',
    },
    success: {
      [`${SUCCESS_CSS_PREFIX}primary`]: '#81e06c',
      [`${SUCCESS_CSS_PREFIX}secondary`]: 'rgba(129,224,108,0.6)',
      [`${SUCCESS_CSS_PREFIX}tertiary`]: 'rgba(129,224,108,0.4)',
      [`${SUCCESS_CSS_PREFIX}divider`]: 'rgba(129,224,108,0.2)',
      [`${SUCCESS_CSS_PREFIX}container`]: 'rgba(129,224,108,0.05)',
    },
    aware: {
      [`${AWARE_CSS_PREFIX}primary`]: '#252726',
      [`${AWARE_CSS_PREFIX}secondary`]: 'rgba(37,39,38,0.6)',
      [`${AWARE_CSS_PREFIX}tertiary`]: 'rgba(37,39,38,0.4)',
      [`${AWARE_CSS_PREFIX}container`]: 'rgba(255,184,0,0.3)',
    },
    warn: {
      [`${WARN_CSS_PREFIX}primary`]: '#bb1515',
      [`${WARN_CSS_PREFIX}secondary`]: 'rgba(187,21,21,0.6)',
      [`${WARN_CSS_PREFIX}tertiary`]: 'rgba(187,21,21,0.4)',
      [`${WARN_CSS_PREFIX}container`]: 'rgba(187,21,21,0.1)',
    },
    selected: {
      [`${SELECTED_CSS_PREFIX}primary`]: '#0c8ae4',
      [`${SELECTED_CSS_PREFIX}secondary`]: 'rgba(12, 138, 228, 0.6)',
      [`${SELECTED_CSS_PREFIX}tertiary`]: 'rgba(12, 138, 228, 0.45)',
      [`${SELECTED_CSS_PREFIX}container`]: 'rgba(12, 138, 228, 0.07)',
    },
    special: {
      [`${SPECIAL_CSS_PREFIX}surface`]: '#0d0d0d',
    },
    chart: {
      [`${CHART_CSS_PREFIX}yellow-red-5`]: '#b10026',
      [`${CHART_CSS_PREFIX}yellow-red-4`]: '#e31a1c',
      [`${CHART_CSS_PREFIX}yellow-red-3`]: '#fc4e2a',
      [`${CHART_CSS_PREFIX}yellow-red-2`]: '#fd8d3c',
      [`${CHART_CSS_PREFIX}yellow-red-1`]: '#feb24c',
      [`${CHART_CSS_PREFIX}yellow-red-0`]: '#fed976',
      [`${CHART_CSS_PREFIX}yellow-red-grey`]: '#b9ae90',
      [`${CHART_CSS_PREFIX}green-blue-5`]: '#064479',
      [`${CHART_CSS_PREFIX}green-blue-4`]: '#216b92',
      [`${CHART_CSS_PREFIX}green-blue-3`]: '#2e97b8',
      [`${CHART_CSS_PREFIX}green-blue-2`]: '#59bfb5',
      [`${CHART_CSS_PREFIX}green-blue-1`]: '#7fcd92',
      [`${CHART_CSS_PREFIX}green-blue-0`]: '#acdea0',
      [`${CHART_CSS_PREFIX}classic-yellow`]: '#ffcc00',
      [`${CHART_CSS_PREFIX}classic-yellow-light`]: '#ffeda3',
      [`${CHART_CSS_PREFIX}classic-purple`]: '#927fb9',
      [`${CHART_CSS_PREFIX}classic-purple-light`]: '#bba4d1',
      [`${CHART_CSS_PREFIX}classic-blue`]: '#3399cc',
      [`${CHART_CSS_PREFIX}classic-blue-light`]: '#99cce5',
    },
    code: {
      [`${CODE_CSS_PREFIX}red`]: '#cc4a41',
      [`${CODE_CSS_PREFIX}green`]: '#3f8e6e',
      [`${CODE_CSS_PREFIX}yellow`]: '#dab03c',
      [`${CODE_CSS_PREFIX}blue`]: '#488dd2',
      [`${CODE_CSS_PREFIX}magenta`]: '#c64f87',
      [`${CODE_CSS_PREFIX}teal`]: '#529f99',
    },
  },
};


@Injectable({
  providedIn: 'root',
})
export class ThemeSwitcherService {

  private readonly renderer: Renderer2;

  constructor(@Inject(DOCUMENT) private document: Document,
              rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  getThemeConfiguration(): Theme {
    return this.document.body.classList.contains(ThemeType.LIGHT) ? LIGHT_THEME : DARK_THEME;
  }

  loadThemes(): Promise<void> {
    const activeTheme = localStorage.getItem('theme') ?? ThemeType.DARK;
    localStorage.setItem('theme', activeTheme);
    this.document.body.classList.add(activeTheme);
    return new Promise<void>((resolve) => {
      const style = this.renderer.createElement('style');
      style.type = 'text/css';
      style.textContent = this.buildThemesCss();
      style.onload = () => resolve();
      this.renderer.appendChild(this.document.head, style);
    });
  }

  private buildThemesCss(): string {
    const THEMES = [DARK_THEME, LIGHT_THEME];
    let css = '';

    THEMES.forEach((theme: Theme) => {
      css += `.${theme.name}{`;
      Object.keys(theme.categories).forEach((key: string) => {
        Object.keys(theme.categories[key]).forEach((name: string) => {
          css += `${name}:${theme.categories[key][name]};`;
        });
      });
      css += '}';
    });

    return css;
  }
}

function loadThemes(themeService: ThemeSwitcherService): Function {
  return () => themeService.loadThemes();
}

export const THEME_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: loadThemes,
  deps: [ThemeSwitcherService],
  multi: true,
};
