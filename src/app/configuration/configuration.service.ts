import { Injectable } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { findIndex, map } from "lodash";
import * as moment from "moment";
import { GlobalErrorHandler } from "../core/services/error-handler";
import { MODE } from "./shared/config/mode";
import { NotificationService } from "../core/services/notification.service";
import { RestService } from "../core/services/rest.service";
import { HttpClient } from "@angular/common/http";
import { Shift } from "./shared/shift";
/**
 * @author Hardik Pithva
 */
@Injectable()
export class ConfigurationService {
  dialogData: any;
  constructor(
    private http: HttpClient,
    private error: GlobalErrorHandler,
    private notification: NotificationService,
    private rest: RestService
  ) { }


  addBatch = (tempData) => this.rest.post('batch', tempData);
  updateBatch = (tempData) => this.rest.put('batch', tempData);
  deleteBatch = (tempData) => this.rest.del('batch', tempData.batch_id);
  getAllBatches = () => this.rest.get('batch');
  getAllUniqueBatches = (data) => this.rest.post('unique-batches', data);

  getShiftDetails = (limit, offset) => this.rest.get(`shifts/breaks/?limit=${limit}&offset=${offset}`);

  addShiftOrBreak = (req, mode, type, details) => {
    switch (type) {
      case 'shifts':
        req.shiftFrom = this.formatDate(req.shiftFrom);
        req.shiftTo = this.formatDate(req.shiftTo);
        return this.rest.post('shifts/create', req);
      case 'breaks':
        const reqBody = {
          shiftid: details.shiftid,
          breaks: req
        };
        return this.rest.post('breaks/createMultipleBreaks', reqBody);

    }
  }

  updateShiftOrBreak = (req, mode, type) => {
    switch (type) {
      case 'shifts':
        req.shiftFrom = this.formatDate(req.shiftFrom);
        req.shiftTo = this.formatDate(req.shiftTo);
        return this.rest.put('shifts/update', req);
      case 'breaks':
        req.breakFrom = this.formatDate(req.breakFrom);
        req.breakTo = this.formatDate(req.breakTo);
        return this.rest.put('breaks/update', req);
    }
  }


  deleteShiftOrBreak(req, type) {
    if (type === 'shifts') {
      return this.rest.del(`shifts/${req.shiftid}`, "");
    } else {
      return this.rest.del(`breaks/${req.breakid}`, "");
    }
  }


  updateShiftDataset = (mode, dataSet: any, resp) => {
    let tempData: any = {},
      msg;
    const { shift, type, id, newId } = resp;
    switch (mode) {
      case MODE.ADD:
        {
          if (type == MODE.BREAK) {
            tempData = dataSet[id];
            const { data } = tempData.data;
            let tempShifts = [];
            shift.breaks.forEach(item => {
              tempShifts.push({
                shiftName: shift.shiftName,
                shiftid: shift.shiftid,
                breakFrom: item.breakFrom,
                breakTo: item.breakTo,
                breakType: item.breakType,
                breakid: newId
              });
            });
            dataSet[id].data = new MatTableDataSource(tempShifts.concat(data));
          } else {
            shift.shiftid = newId;
            dataSet.push({
              open: false,
              type: this.getShiftLabel(shift),
              data: new MatTableDataSource(
                this.getBreaks(shift.breaks, newId, shift.shiftName)
              )
            });
          }
          msg = "Record saved.";
        }
        break;

      case MODE.UPDATE:
        {
          if (type == MODE.BREAK) {
            Object.assign(tempData, dataSet[id]);
            const { data } = tempData.data;
            let i = this.getBreakIndex(data, shift.breaks[0]);
            data[i] = {
              shiftid: shift.shiftid,
              breakFrom: shift.breaks[0].breakFrom,
              breakTo: shift.breaks[0].breakTo,
              breakType: shift.breaks[0].breakType
            };
            dataSet[id].data = new MatTableDataSource(data);
          } else {
            dataSet[id].type = this.getShiftLabel(shift);
          }

          msg = "Record updated.";
        }
        break;

      case MODE.DELETE:
        {
          if (type === MODE.BREAK) {
            tempData = dataSet[id];
            const { data } = tempData.data;
            data.splice(this.getBreakIndex(data, shift), 1);
            dataSet[id].data = new MatTableDataSource(data);
          } else {
            dataSet.splice(id, 1);
          }
          msg = "Record deleted.";
        }
        break;
    }
    this.notify(msg, "Close");
    return dataSet;
  };
  private getBreakIndex = (data, item) =>
    findIndex(data, (tempItem: any) => item.breakid === tempItem.breakid);

  private getIndex = (data, item) =>
    findIndex(
      data,
      (tempItem: any) => parseInt(item.id) === parseInt(tempItem.id)
    );

  private getBreaks = (breaks: any[], id: number, name: string = "") => {
    breaks.forEach(item => (item.shiftid = id));
    if (breaks.length == 0) {
      breaks.push({
        shiftid: id,
        breakid: 0,
        shiftName: name,
        shiftFrom: "",
        shiftTo: "",
        breakType: "",
        breakFrom: "",
        breakTo: ""
      });
    }
    return breaks;
  };


  private getShiftLabel = shift =>
    `From: ${this.getTime(shift.shiftFrom)} To: ${this.getTime(
      shift.shiftTo
    )} | ${shift.shiftName.toUpperCase()}`;

  private getBreaksAndCount = (shift: Shift[] | any) => {
    let count = shift.length;
    let data = shift;

    if (count === 1) {
      const [{ breakid }] = shift;
      if (breakid === 0) {
        count = 0;
        data = [];
      }
    }
    return { count, data, oneShift: shift[0] };
  };

  formatShiftAndBreaks = (shift: Shift) => {
    let newShift = { ...shift };

    const { breaks } = shift;
    newShift.breaks = breaks.map(({ breakid, breakFrom, breakTo, breakType }) => {
      return {
        breakid,
        breakType,
        breakFrom: this.formatDate(breakFrom),
        breakTo: this.formatDate(breakTo)
      };
    });
    return newShift;
  };

  // get machine specific Parameter
  getMachineParameter = (machine_name) => this.rest.get(`getMachineParameter/${machine_name}`);
  //
  // update machine specific Parameter
  updateMachineParameter = (data) => this.rest.put('updateMachineParameter', data);

  // get all machineTypes
  getMachineType = () => this.rest.get('config/machine/filter/machineType/all');

  // get password string
  getPasswordPolicyString = () => this.rest.get('passwordPolicyString');
  // Get users
  getUserDetails = (limit, offset) => this.rest.get(`config/user/?limit=${limit}&offset=${offset}`);

  //validate Password
  validatePassword = (passwordObj) => this.rest.post('validateUserPassword', passwordObj);

  // Update Password
  changePassword = (changePasswordObj) => this.rest.put('config/updatePassword', changePasswordObj);

  // Add password policy
  addPasswordPolicy = (passPolicyObj) => this.rest.post('passwordPolicy', passPolicyObj);

  // Get latest password Policy
  getLatestPasswordPolicy = () => this.rest.get('LatestpasswordPolicy');

  //Get users
  getUsersDetails = () => this.rest.get("config/sms/user");

  //Get Role
  getRole = () => this.rest.get(`config/roles`);

  //Add User
  addUser = user => this.rest.post("config/user", user);

  //Get Emails
  getEmailDetails = (limit, offset) => this.rest.get(`config/email/?limit=${limit}&offset=${offset}`);



  //Add Asscociated Machine
  addAssociatedMachine = requestData =>
    this.rest.post("thingconfig/associatedMachines", requestData);


  //Add Parameters
  addParameter = parameter =>
    this.rest.post(`config/parameters`, parameter);

  //Get parameters Details
  getParameterDetails = (limit, offset) => this.rest.get(`config/parameters/?limit=${limit}&offset=${offset}`);

  //Get parameters Details
  getReportParameterDetails = (type) => this.rest.get(`config/reportParameters/${type}`);

  addMachines = data => {
    return this.rest.post(`thingconfig`, data);
  }

  //Get Machine ID
  getMachineWithID = newMachineID =>
    this.rest.get("config/machine/" + newMachineID);

  //Get Machine Details
  OldgetMachineDetails = (limit, offset) => this.rest.get(`config/machine/?limit=${limit}&offset=${offset}`);

  getMachineDetails = (type) => this.rest.get(`thingconfig/${type}`);

  //get all machines
  getMahines = id => this.rest.get(`config/sms/machine/${id}`);

  // get all attachment

  getAttachment = () => this.rest.get('attachments');

  //Get ParameterGroup ID
  getParameterGroupWithID = id => this.rest.get(`config/parametergroups/` + id);

  //Get MachinWiseGroupID
  getMachineGroupWithID = id => this.rest.get(`config/machine/` + id);

  //Get ParametersGroup Details
  getParameterGroup = () => this.rest.get("config/parametergroups");

  //Get AssociatedMachineName
  getAssocitiveMachine = (type) => this.rest.get(`thingconfig/associated_machines/${type}`);

  //Get ImportedParameters Group Wise
  getimportedParameter = group =>
    this.rest.get(`config/parametergroups` + group.id);

  //Add Group Wise Parameter
  addgropuParameter = (pg_name, imported_parameters) =>
    this.rest.post(`config/parametergroups`, { pg_name, imported_parameters });

  //Add Plant Configuration
  addPlants = plant =>
    this.rest.post(`config/plants`, plant);

  //Add Dept Configuration
  addDepts = (plantId, deptName) =>
    this.rest.post(`config/departments`, { plantId, deptName });

  addDept = data => this.rest.post(`config/departments`, data);

  getDeptWithID = newDeptID =>
    this.rest.get(`config/departments/` + newDeptID);

  //Add Assebly Configuartion
  addAssembly = data =>
    this.rest
      .post(`config/assemblys`, data);

  getAssemblyWithID = newAssemblyID => this.rest.get(`config/assemblys/` + newAssemblyID);

  //Add DataTypes
  getDatatypes = () => this.rest.get(`config/dataTypes`);

  //Get Plants
  getPlants = (limit, offset) => this.rest.get(`config/plants/?limit=${limit}&offset=${offset}`);

  //Get Dept
  getDepts = (limit, offset) => this.rest.get(`config/departments/?limit=${limit}&offset=${offset}`);

  getDept = id => this.rest.get(`config/department/filter/${id}`);

  //Get Assembyes
  getAssembly = (limit, offset) => this.rest.get(`config/assemblys/?limit=${limit}&offset=${offset}`);
  getAssemblys = id => this.rest.get(`config/assembly/filter/${id}`);


  getAllUsers = () => this.rest.get(`config/sms/user`);

  //Delete User
  deleteUser = deleteUserObj => this.rest.post(`config/delete/user`, deleteUserObj);


  //Delete Associated machine
  deleteAssociatedMachine = id => this.rest.del("config/associatedMachine", id);

  //Delete Parameters
  deleteParameter = id => this.rest.del(`config/parameters/` + id, "");

  //Delete Groups
  deleteGroup = id => this.rest.del(`config/parametergroups/` + id, "");

  //Delete Plants
  deletePlant = id => this.rest.del(`config/plants/` + id, "");

  //Delete Depts
  deleteDept = id => this.rest.del(`config/departments/${id}`, "");

  //Delete Assembyes
  deleteassemblys = id => this.rest.del(`config/assemblys/${id}`, "");

  //Delete ParameterGroup
  deleteParamGroup = id => this.rest.del(`config/parametergroups/` + id, "");

  // Delete Machines
  //deleteMachine = id => this.rest.del(`thingconfig/machine/${id}`);

  deleteMachine = (machineId, type) => this.rest.del(`thingconfig/${type}/${machineId}`, '');

  getAssociatedMachineDetails = (limit, offset) => this.rest.get(`config/associatedMachine/?limit=${limit}&offset=${offset}`);

  getOperatorDetails = (limit, offset) => this.rest.get(`config/operatorMonitoring/?limit=${limit}&offset=${offset}`);

  getErrorMessage = errorId => this.error.getErrorMessage(errorId);

  getParameterGroupDetails = (limit, offset) => this.rest.get(`config/parametergroups/?limit=${limit}&offset=${offset}`);


  getTime = time => time;

  notify = (msg: string, act?: string) => this.notification.notify(msg, act);

  throwError = (error: any) => this.error.handleError(error);

  updateUser = user => this.rest.put("config/user", user);


  updateDataset = (mode, data, item) => {
    let tempData = [],
      msg;
    switch (mode) {
      case MODE.ADD:
        tempData = data;
        tempData.push(item);
        msg = "Record saved.";
        break;

      case MODE.UPDATE:
        let i = this.getIndex(data, item);
        Object.assign(tempData, data);
        tempData[i] = item;
        msg = "Record updated.";
        break;

      case MODE.DELETE:
        tempData = data;
        tempData.splice(this.getIndex(data, item), 1);
        msg = "Record deleted.";
        break;
    }
    this.notify(msg, "Close");
    return tempData;
  };

  updateMachines = data => {
    return this.rest.put(`thingconfig`, data);
  }

  //Update Group
  updateGroup = (group, pg_name, imported_parameters) =>
    this.rest
      .put("config/parametergroups/" + group.id, {
        pg_name,
        imported_parameters
      });

  //Update Parameters
  updateParameter = (id, parameter) =>
    this.rest.put(`config/parameters/${id}`, parameter);

  //UpdatePlant
  updatePlant = plant =>
    this.rest.put(`config/plants/` + plant.id, plant);

  //Update Dept
  updateDept = (dept, plantId, deptName) =>
    this.rest.put(`config/departments/` + dept.id, { dept, plantId, deptName });
  //Update Dept

  updateDepart = (dept, deptName, plantId) =>
    this.rest.put(`config/departments/${dept}`, { plantId, deptName });

  //Update Assemblys
  updateAssembly = data => this.rest.put(`config/assemblys/${data.id}`, data);





  public formatTime = dt => moment(dt).format("HH:mm:ss.SSS");





  public formatDate = dt => moment(dt).format("HH:mm:00");
  // public formatDate = dt => moment(dt).format("YYYY-MM-DD HH:mm:ss.SSS");
  formatDateOperator = dt => moment(dt).format("YYYY-MM-DD");

  formatDateTime = dt => moment(dt).format("YYYY-MM-DD HH:mm:00");







  //report Configuration
  getTableReportWise = (reportId) => this.rest.get(`config/reportWithTableAndHeadings/${reportId}`);
  getmachineType = () => this.rest.get(`filter/machineMapping`);
  getreportDetails = (limit, offset) => this.rest.get(`config/report/?limit=${limit}&offset=${offset}`);



  //For Calender
  getDate = (today?: boolean) => {
    let _today = this._getDate(true),
      _yesterday = this._getDate();
    return this.toDate(`${today ? _today : _yesterday} 12:00`);
  };

  private _getDate = (today?: boolean) =>
    today
      ? moment().format("YYYY-MM-DD")
      : moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD");

  toDate = (datetime: string) => moment(datetime).toDate();


  getPlant = () => this.rest.get('config/plants');

  getIdWiseDepartment = (id) => this.rest.get(`config/department/filter/${id}`);

  getIdWiseAssembly = (id) => this.rest.get(`config/assembly/filter/${id}`);

  getMachineNames(plant, department, assembly, reportType) {
    return this.rest.post('config/machine/filter', { plant, department, assembly, reportType })
  }

  getSlotData = (req, limit, offset) => {
    let body = Object(req);
    delete body.assembly;
    delete body.department;
    delete body.plant;
    body.from = this.formatDateTime(req.from);
    body.to = this.formatDateTime(req.to);
    body.limit = limit;
    body.offset = offset;
    return this.rest.post(`config/timeslot`, body);
  }
  updateSlotData = (req) => this.rest.put('config/timeslot', req);

  convertUtcToDataTime(data) {
    let dataSource = [];
    map(data, (item: any) => {
      let ob = Object(item);
      ob.start_time = this.formatDateForTimeSlot(new Date(item.start_time));
      ob.end_time = this.formatDateForTimeSlot(new Date(item.end_time));
      dataSource.push(ob);
    }); //for label
    return dataSource;
  }

  public formatDateForTimeSlot = dt => moment(dt).format("YYYY-MM-DD HH:mm:ss");


  getTimeData(time: string, date: boolean = true) {
    const [hh, mm, ss] = time.split(":");
    let t = moment().set({
      hour: parseInt(hh),
      minute: parseInt(mm),
      second: 0,
      millisecond: 0
    });
    return date ? t.toDate() : t;
  }
}
