import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BatchStatusComponent } from './batch-status.component';

const routes: Routes = [
  { path: "", redirectTo: "batchStatus", pathMatch: "full" },
  { path: "batchStatus", component: BatchStatusComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchStatusRoutingModule { }
