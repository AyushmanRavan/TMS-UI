import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { ConfigurationRoutingModule } from "./configuration-routing.module";
import { ErrorModule } from "../components/error/error.module";
import { MaterialModule } from "../material/material.module";
import { SpinnerModule } from "../components/spinner/spinner.module";
import { ConfigurationService } from "./configuration.service";
import { UserComponent } from "./user/user.component";
import { ParamGroupViewComponent } from "./Parameter-Configuration/param-group-view/param-group-view.component";
import { ParamViewComponent } from "./Parameter-Configuration/param-view/param-view.component";
import { ParamGroupAddComponent } from "./Parameter-Configuration/param-group-view/param-group-add/param-group-add.component";
import { ParamViewAddComponent } from "./Parameter-Configuration/param-view/param-view-add/param-view-add.component";
import { DepartmentComponent } from './Machine-Configuration/department/department.component';
import { DeptDialogComponent } from './Machine-Configuration/department/dept-dialog/dept-dialog.component';
import { PlantComponent } from './Machine-Configuration/plant/plant.component';
import { PlantDialogComponent } from './Machine-Configuration/plant/plant-dialog/plant-dialog.component';
import { AssemblyComponent } from './Machine-Configuration/assembly/assembly.component';
import { AssemblyDialogComponent } from './Machine-Configuration/assembly/assembly-dialog/assembly-dialog.component';
import { MachineComponent } from './Machine-Configuration/machine/machine.component';
import { MachineDialogComponent } from './Machine-Configuration/machine/machine-dialog/machine-dialog.component';
import { AssociatedMachineComponent } from './associated-machine/associated-machine.component';
import { AssociatedMachineDialogComponent } from './associated-machine/associated-machine-dialog/associated-machine-dialog.component';
import { ChartsModule } from 'ng2-charts';
import { TimeSlotComponent } from './time-slot/time-slot.component';
import { TimeSlotDialogComponent } from './time-slot/time-slot-dialog/time-slot-dialog.component';
import { ConfigFilterFormComponent } from './config-filter-form/config-filter-form.component';

import { PipesModule } from "../shared/pipes/pipe.module";
import { PasswordPolicyComponent } from './password-policy/password-policy.component';
import { PasswordPolicyDialogComponent } from './password-policy/password-policy-dialog/password-policy-dialog.component';
import { MachineParameterConfigComponent } from './machine-parameter-config/machine-parameter-config.component';
import { MachineParameterConfigDialogComponent } from './machine-parameter-config/machine-parameter-config-dialog/machine-parameter-config-dialog.component';
import { MatPaginatorModule } from "@angular/material/paginator";
import { ShiftsDialogComponent } from "./shifts/shifts-dialog/shifts-dialog.component";
import { ShiftsComponent } from "./shifts/shifts.component";
import { BatchComponent } from './batch/batch.component';
import { BatchDialogComponent } from './batch/batch-dialog/batch-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    ErrorModule,
    FormsModule,
    MaterialModule, 
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
    SpinnerModule,
    ChartsModule,
    MatPaginatorModule,
    PipesModule
  ], 
  declarations: [
    UserComponent,
    ParamGroupViewComponent,
    ParamViewComponent,
    ParamGroupAddComponent,
    ParamViewAddComponent,
    DepartmentComponent,
    DeptDialogComponent,
    PlantComponent,
    PlantDialogComponent,
    AssemblyComponent,
    AssemblyDialogComponent,
    MachineComponent,
    MachineDialogComponent,
    AssociatedMachineComponent,
    AssociatedMachineDialogComponent,
    TimeSlotComponent,
    TimeSlotDialogComponent,
    ConfigFilterFormComponent,
    PasswordPolicyComponent,
    PasswordPolicyDialogComponent,
    MachineParameterConfigComponent,
    ShiftsComponent,
    MachineParameterConfigDialogComponent,
    ShiftsDialogComponent,
    BatchComponent,
    BatchDialogComponent
  ],
  entryComponents: [
    ParamGroupAddComponent,
    ParamViewAddComponent,
    DeptDialogComponent,
    PlantDialogComponent,
    AssemblyDialogComponent,
    MachineDialogComponent,
    AssociatedMachineDialogComponent,
    TimeSlotDialogComponent,
    PasswordPolicyDialogComponent,
    ShiftsDialogComponent,
    MachineParameterConfigDialogComponent,
    BatchDialogComponent
  ],
  providers: [ConfigurationService]
})
export class ConfigurationModule { }
