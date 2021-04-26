import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { SharedComponentModule } from "../shared-component/shared-component.module";
import { ReportsService } from "./reports.service";
import { MaterialModule } from "../material/material.module";
import { NgxGaugeModule } from 'ngx-gauge';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { SharedModule } from "../shared/modules/shared.module";
import { PdfModule } from "./shared/pdf/pdf.module";
import { ConfigurationService } from '../configuration/configuration.service';
import { NewPdfService } from "./shared/new-pdf/new-pdf.service";
import { NewPdfModule } from "./shared/new-pdf/new-pdf.module";
import { BatchReportComponent } from './batch-report/batch-report.component';

const reportRoutes: Routes = [
  { path: "batch-report", component: BatchReportComponent },
  // { path: "batch-dashboard", component: BatchDashboardComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(reportRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedModule,
    PdfModule, 
    NewPdfModule, 
    NgxGaugeModule,
    SharedComponentModule,
    NewPdfModule
  ],
  exports: [RouterModule],
  declarations: [
    BatchReportComponent,
    // BatchDashboardComponent
  ],
  entryComponents: [],
  providers: [ReportsService, ConfigurationService, NewPdfService]
})
export class ReportsModule { }
