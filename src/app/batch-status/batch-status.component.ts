import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { GlobalErrorHandler } from '../core/services/error-handler';
import { NewPdfComponent } from '../new-pdf/new-pdf.component';
import { ReportsService } from '../reports/reports.service';

@Component({
  selector: 'app-batch-status',
  templateUrl: './batch-status.component.html',
  styleUrls: ['./batch-status.component.scss']
})
export class BatchStatusComponent implements OnInit {
  collection = { data: [] };
  pdfData = {
    REPORT_TYPE: 'simpleReport',
    reportFileName: 'batchStatus',
    reportPaperSize: 'A2',
    reportLandscap: false
  };
  from: string;
  to: string;
  status: boolean;
  datasetLength: number;
  loaded: boolean = true;
  loadedspinner: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;
  data: any[] = [];
  reportVal: any;

  displayedColumns = ["start_time", "end_time",
    "batch_id", "rackName", "completedStatus", "product_name", "quantity",
  ];
  parameters: any[];

  dataSource = new MatTableDataSource();
  btnRef: MatButton;
  @ViewChild('pdfContainer', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private error: GlobalErrorHandler,
    private reportsService: ReportsService,
    private _intl: MatPaginatorIntl,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
    this.pdfData['monitoringDataColumn'] = this.displayedColumns;
  }

  formatDate = dt => moment(dt).format("YYYY-MM-DD HH:mm:ss");
  formatDateOee = dt => moment(dt).format("YYYY-MM-DD 00:00:00.000");

  onSelect(event) {

    if (this.btnRef === undefined) {
      this.btnRef = event.downloadPdfBtnRef;
      if (this.btnRef) {
        this.btnRef._elementRef.nativeElement.addEventListener('click', this.createComponent.bind(this));
      }
    }

    console.log("Event Fired........", event);
    this.loadedspinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.from = this.formatDate(event.reportValue["from"]);
    this.to = this.formatDate(event.reportValue["to"]);
    this.status = event.reportValue["status"].value

    this.pdfData['plantDetails'] = {
      machineKey: "Batch Status",
      machineValue: event.reportValue["status"].value,

      fromKey: "From",
      fromValue: event.reportValue["from"],

      toKey: "To",
      toValue: event.reportValue["to"],

      reportKey: "Report Type",
      reportValue: "Batch Status",
    };
    let payload = {
      from: this.formatDate(event.reportValue["from"]),
      to: this.formatDate(event.reportValue["to"]),
      status: event.reportValue["status"].value
    }
    this.getBatchStatus(payload);
  }

  getBatchStatus(payload) {

    this.reportsService.getBatchStatus(payload).
      subscribe(data => {
        console.log("  call getBatchStatus  ", data);
        this.setData(data);
      }, err => {

      });
  }


  setData(data) {
    if (data != null) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;

      let temp = {};
      this.collection.data = [];
      if (data) {
        data.map((row) => {
          this.displayedColumns.map((col) => {
            for (const key in row) {
              if (row.hasOwnProperty(col)) {
                if (key === col) {
                  temp[key] = row[key];
                }
              } else {
                temp[col] = '';
              }
            }
          });
          this.collection.data.push(temp);
          temp = {};
        });
      }
      this.pdfData['monitoringDataRow'] = this.collection.data;
      if (this.btnRef) {
        this.btnRef.disabled = false;
      }
      this.loaded = false;
      this.loadedspinner = false;
    } else {
      this.loadedspinner = false;
      this.Errormsg = false;
      this.errMessage = this.error.getErrorMessage(1);
    }
  }

  private handleError(err, id = 0) {
    this.loaded = true;
    this.loadedspinner = false;
    this.Errormsg = false;
    this.errMessage = this.error.getErrorMessage(id);
    this.reportsService.throwError(err);
  }

  createComponent() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(NewPdfComponent);
    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(factory);
    componentRef.instance.getPdfData(this.pdfData);
    setTimeout(() => {
      componentRef.destroy();
    }, 2000);
  }


}
