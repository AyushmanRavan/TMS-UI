import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserComponent } from "./user/user.component";
import { ParamGroupViewComponent } from "./Parameter-Configuration/param-group-view/param-group-view.component";
import { ParamViewComponent } from "./Parameter-Configuration/param-view/param-view.component";
import { DepartmentComponent } from "./Machine-Configuration/department/department.component";
import { PlantComponent } from './Machine-Configuration/plant/plant.component';
import { AssemblyComponent } from './Machine-Configuration/assembly/assembly.component';
import { MachineComponent } from './Machine-Configuration/machine/machine.component';
import { AssociatedMachineComponent } from './associated-machine/associated-machine.component';
import { TimeSlotComponent } from './time-slot/time-slot.component';
import { PasswordPolicyComponent } from './password-policy/password-policy.component'
import { MachineParameterConfigComponent } from "./machine-parameter-config/machine-parameter-config.component";
import { ShiftsComponent } from "./shifts/shifts.component";
import { BatchComponent } from "./batch/batch.component";

const configRoutes: Routes = [
  { path: "user", component: UserComponent },
  { path: "password-policy", component: PasswordPolicyComponent },
  { path: "param-view", component: ParamViewComponent },
  { path: "param-group-view", component: ParamGroupViewComponent },
  { path: "department", component: DepartmentComponent },
  { path: "plant", component: PlantComponent },
  { path: "assembly", component: AssemblyComponent },
  { path: "machine", component: MachineComponent },
  { path: "shifts", component: ShiftsComponent },
  { path: "associated-machine", component: AssociatedMachineComponent },
  { path: "time-slot-assign-reason", component: TimeSlotComponent },
  { path: "machine-parameter-config", component: MachineParameterConfigComponent },
  { path: "batch", component: BatchComponent }
];

@NgModule({
  imports: [RouterModule.forChild(configRoutes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
