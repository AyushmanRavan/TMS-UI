import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BatchStatusRoutingModule } from './batch-status-routing.module';
import { BatchStatusComponent } from './batch-status.component';
import { ErrorModule } from '../components/error/error.module';
import { PipesModule } from '../shared/pipes/pipe.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SpinnerModule } from '../components/spinner/spinner.module';
import { ReportsService } from '../reports/reports.service';
import { SharedComponentModule } from '../shared-component/shared-component.module';
import { SharedModule } from '../shared/modules/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [BatchStatusComponent,],
  imports: [
    CommonModule,
    BatchStatusRoutingModule,
    ErrorModule,
    SpinnerModule,
    MatPaginatorModule,
    PipesModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedModule,
    
    SharedComponentModule,
  ],
  providers: [ReportsService]
})
export class BatchStatusModule { }
