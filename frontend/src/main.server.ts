import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server'; // ✅ use the correct name 'config'
import { provideServerRendering } from '@angular/platform-server'; // ✅ no withDisabledInitialNavigation

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    ...config,
    providers: [
      ...config.providers,
      provideServerRendering() // ✅ no argument
    ]
  });

export default bootstrap;
