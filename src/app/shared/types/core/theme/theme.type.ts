import { ThemeType } from '@shared/types/core/theme/theme-types.type';

export interface Theme {
  name: ThemeType;
  cssVariables: { [p: string]: string };
}
