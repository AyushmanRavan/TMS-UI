import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "../material/material.module";
import { SummaryContentComponent } from '../components/summary-content/summary-content.component';
import { ConfigurationService } from '../configuration/configuration.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ReportFormComponent } from '../reports/report-form/report-form.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [ReportFormComponent, SummaryContentComponent],
  exports: [ReportFormComponent, SummaryContentComponent],
  providers: [ConfigurationService]
})
export class SharedComponentModule { }
