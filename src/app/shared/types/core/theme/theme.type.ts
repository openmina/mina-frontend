import { ThemeType } from '@shared/types/core/theme/theme-types.type';
import { ThemeCssCategory } from '@shared/types/core/theme/theme-css-category.type';

export interface Theme {
  name: ThemeType;
  categories: ThemeCssCategory;
}
