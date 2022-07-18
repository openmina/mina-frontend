import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemeType } from '@shared/types/core/theme/theme-types.type';

@Component({
  selector: 'app-theming-testing',
  templateUrl: './theming-testing.component.html',
  styleUrls: ['./theming-testing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemingTestingComponent implements OnInit {

  toggleControl = new FormControl(localStorage.getItem('theme') === ThemeType.DARK);

  constructor() { }

  ngOnInit(): void {
    this.toggleControl.valueChanges.subscribe(() => {
      const theme: ThemeType = document.body.classList.contains('theme-light') ? ThemeType.DARK : ThemeType.LIGHT;
      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add('theme-' + theme);
      localStorage.setItem('theme', theme);
    });
  }

}
