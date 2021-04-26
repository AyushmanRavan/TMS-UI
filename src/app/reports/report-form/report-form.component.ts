import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigurationService } from './../../configuration/configuration.service';
import { ReportsService } from "../reports.service";
import { GlobalErrorHandler } from "../../core/services/error-handler";
import * as moment from "moment";

@Component({
  selector: "report-form",
  templateUrl: "./report-form.component.html",
  styleUrls: ["./report-form.component.scss"]
})
export class ReportFormComponent implements OnInit {
  @Output() select = new EventEmitter();
  @Input() type: String;
  // @ViewChild('downloadPdfBtn') downloadPdfBtn: ElementRef;
  interval: boolean = false;

  report: FormGroup;
  show: boolean;
  fromStartAt;
  toStartAt;
  startDate: Date = new Date();
  max: Date = new Date();
  min: Date = new Date();
  batchReport: boolean = false;
  batchReportOptions = [];
  batchStatus: boolean = false;
  batchStatusOptions = [
    { name: "Complete", value: true }, { name: "Incomplete", value: false }
  ];
  showTime: string;

  constructor(
    private error: GlobalErrorHandler,
    private fb: FormBuilder,
    private selection: ReportsService,
    private matSnackBar: MatSnackBar,
    private configurationService: ConfigurationService,
  ) {



    this.report = this.fb.group({
      from: [this.selection.getDate(), Validators.required],
      to: ["", Validators.required],
      batch_id: ["", Validators.required],
      status: ["", Validators.required],
      interval: '1',
    });

    this.showTime = "both";
    this.fromStartAt = this.selection.getDate();
    this.toStartAt = this.selection.getDate(true);
  }

  ngOnInit() {
    if (this.type == "batch_report") {
      this.batchReport = true;
      this.report.get('status').setValidators(null);
      this.report.get('status').updateValueAndValidity();
    }
    else if (this.type == "batch_status") {
      this.batchStatus = true;
      this.startDate.setHours(0);
      this.startDate.setMinutes(40);
      this.startDate.setSeconds(0);

      this.report.get('from').setValue(this.startDate);
      this.report.get('to').setValue(new Date());
      this.report.get('status').setValue(this.batchStatusOptions[1]);

      // this.select.emit({ ...this.report.value });
      this.passFormValues(this.report.value, null);
      this.report.get('batch_id').setValidators(null);
      this.report.get('batch_id').updateValueAndValidity();
    }
  }


  getAllUniqueBatches(data) {
    this.configurationService.getAllUniqueBatches(data).subscribe(data => {
      if (data != null) {
        this.batchReportOptions = data;
      } else {
        this.batchReportOptions = null;
        this.matSnackBar.open('No batches available', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));
  }


  onChangeBatch(batch_id: string) {

  }

  onChangeStatus(event) {
    console.log("======>")
  }


  onGenerate(downloadPdfBtnRef) {
    if (this.report.valid) {
      this.passFormValues(this.report.value, downloadPdfBtnRef);
    }
  }

  passFormValues(reportValue, downloadPdfBtnRef) {
    this.select.emit({ reportValue, downloadPdfBtnRef });
  }


  formatDate = dt => moment(dt).format("YYYY-MM-DD HH:mm:ss.SSS");

  onChange(data) {
    if (this.type == "batch_report") {
      let from = this.formatDate(this.report.get("from").value);
      let to = this.formatDate(this.report.get("to").value);
      this.batchReportOptions = [];
      this.getAllUniqueBatches({ from, to });
    }
  }

  // private getValue = (collection: string[], id): any =>
  //   collection.find((opt: any) => opt.id === id);

  ondatechange() {
    if (this.report.get("from").value && this.report.get("to").value) {
      var date1 = this.report.get("from").value;
      var date2 = this.report.get("to").value;
      var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      var diffDays = Math.round(
        Math.abs((date1.getTime() - date2.getTime()) / oneDay)
      );
      if (diffDays > 1) {
        this.show = false;
      } else {
        this.show = true;
      }
    }
  }

  setMinToDate() {
    const { from } = this.report.value;
    this.min = from;
  }

  private handleError(err) {
    this.error.handleError(err);
  }

}

