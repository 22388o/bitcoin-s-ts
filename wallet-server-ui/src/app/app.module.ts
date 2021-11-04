import { HttpClient, HttpClientModule } from '@angular/common/http'
import { APP_INITIALIZER, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

import { MaterialModule } from './shared/modules/material/material.module'

import { AppComponent } from './app.component'
import { SplashComponent } from './component/splash/splash.component'
import { ErrorDialogComponent } from './dialog/error/error.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { WalletBalanceComponent } from './component/wallet-balance/wallet-balance.component';
import { ContractsComponent } from './component/contracts/contracts.component';
import { EventsComponent } from './component/events/events.component';
import { ContractDetailComponent } from './component/contract-detail/contract-detail.component';
import { EventDetailComponent } from './component/event-detail/event-detail.component';
import { NewOfferComponent } from './component/new-offer/new-offer.component';
import { BuildAcceptOfferComponent } from './component/build-accept-offer/build-accept-offer.component'

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

// Load English translations before rendering app
export function appInitializerFactory(translate: TranslateService) {
  return () => {
    translate.setDefaultLang('en')
    return translate.use('en').toPromise()
  };
}

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,

    ErrorDialogComponent,
     ConfigurationComponent,
     WalletBalanceComponent,
     ContractsComponent,
     EventsComponent,
     ContractDetailComponent,
     EventDetailComponent,
     NewOfferComponent,
     BuildAcceptOfferComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
    MaterialModule,
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [TranslateService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }