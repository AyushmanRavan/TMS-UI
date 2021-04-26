import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/modules/shared.module";
import { PipesModule } from "../shared/pipes/pipe.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { DefaultComponent } from "./default/default.component";
import { MachineService } from "../machine/machine.service";
import { MaterialModule } from "../material/material.module";
import { ReportsService } from "../reports/reports.service";
import { DashboardService } from "./dashboard.service";
import { NewPdfComponent } from "../new-pdf/new-pdf.component";
import { MonitoringDetailsComponent } from "../new-pdf/monitoring-details/monitoring-details.component";
import { PlantDetailsComponent } from "../new-pdf/plant-details/plant-details.component";
import { SummaryTableComponent } from "../new-pdf/summary-table/summary-table.component";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";


@NgModule({
  declarations: [
    DashboardComponent, 
    DefaultComponent,
    NewPdfComponent,
    MonitoringDetailsComponent,
    PlantDetailsComponent,
    SummaryTableComponent],
  imports: [
    CommonModule,
    CoreModule,
    DashboardRoutingModule,
    PipesModule,
    SharedModule,
    MaterialModule,
    PDFExportModule,
  ],
  entryComponents: [NewPdfComponent],
  providers: [ReportsService, DashboardService, MachineService]
})
export class DashboardModule { }
