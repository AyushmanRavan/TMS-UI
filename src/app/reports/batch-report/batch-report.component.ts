import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { GlobalErrorHandler } from 'src/app/core/services/error-handler';
import { ReportsService } from '../reports.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { MatButton } from '@angular/material/button';
import { NewPdfComponent } from 'src/app/new-pdf/new-pdf.component';

interface GraphData {
  data: number[],
  label: string
}


@Component({
  selector: 'app-batch-report',
  templateUrl: './batch-report.component.html',
  styleUrls: ['./batch-report.component.scss']
})
export class BatchReportComponent implements OnInit {
  collection = { data: [] };
  pdfData = {
    REPORT_TYPE: 'simpleReport',
    reportFileName: 'batchReport',
    reportPaperSize: 'A2',
    reportLandscap: false,
    isChart: true
  };
 
  gridColumns = 3;
  batch_id: string;
  from: string;
  to: string;
  interval: number;
  datasetLength: number;
  loaded: boolean = true;
  loadedspinner: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;
  data: any[] = [];
  reportVal: any;


  displayedColumns: string[];
  parameters: any[];

  dataSource = new MatTableDataSource();
  btnRef: MatButton;

  @ViewChild('pdfContainer', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  summary: any[] = [];
  lineChartLabels = [];
  lineChartData: GraphData[] = [];
  lineChartLegend = true;
  lineChartType = 'line';
  lineChartPlugins = [];
  lineChartColors: Color[] = [
    {
      backgroundColor: "transparent",
      borderColor: "#FFCA28",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#FFCA28"
    },
    {
      backgroundColor: "transparent",
      borderColor: "#16A085",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#16A085"
    },
    {
      backgroundColor: "transparent",
      borderColor: "#2471A3",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#2471A3"
    },
    {
      backgroundColor: "transparent",
      borderColor: "#A93226",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#A93226"
    },////////////////////////
    {
      backgroundColor: "transparent",
      borderColor: "#FF00FF",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#FF00FF"
    }, {
      backgroundColor: "transparent",
      borderColor: "#9932CC",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#9932CC"
    }
  ];

  lineChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Date & Time'
          }
        }
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }
      ]
    },
    elements: {
      line: {
        tension: 0,
        fill: false
      }
    }
  }

  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 3 ? 4 : 3;
  }

  constructor(
    private error: GlobalErrorHandler,
    private reportsService: ReportsService,
    // private _intl: MatPaginatorIntl,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

 

  ngOnInit() {
    this.collection.data = [];
  }


  formatDate = dt => moment(dt).format("YYYY-MM-DD HH:mm:ss");
  formatDateOee = dt => moment(dt).format("YYYY-MM-DD 00:00:00.000");


  onSelect(event) {
    console.log("event====>", event)
    if (this.btnRef === undefined) {
      this.btnRef = event.downloadPdfBtnRef;
      this.btnRef._elementRef.nativeElement.addEventListener('click', this.createComponent.bind(this));
    }

    this.loadedspinner = true;
    this.loaded = true;
    this.Errormsg = true;

    const temObj = event.reportValue["batch_id"];

    console.log(temObj['start_time'])
    console.log(temObj['end_time'])

    this.pdfData['plantDetails'] = {
      machineKey: "Batch Id",
      machineValue: temObj['batch_id'],

      fromKey: "From",
      fromValue: temObj['start_time'],

      toKey: "To",
      toValue: temObj['end_time'],

      reportKey: "Report Type",
      reportValue: "Batch Report",
    };
    console.log(this.pdfData['plantDetails'])

    this.batch_id = event.reportValue["batch_id"]['batch_id'];
    this.from = this.formatDate(event.reportValue["from"]);
    this.to = this.formatDate(event.reportValue["to"]);
    this.interval = event.reportValue["interval"];

    const payload = {
      batch_id: event.reportValue["batch_id"]['batch_id'],
      from: this.formatDate(event.reportValue["from"]),
      to: this.formatDate(event.reportValue["to"]),
      interval: event.reportValue["interval"]
    }

    this.getBatchReportSummery(payload);

  }


  getBatchReportSummery(payload) {
    this.reportsService.getBatchReportSummery(payload).
      subscribe(data => {
        this.summary = data;
        this.pdfData['summaryData'] = this.generatePdfSummaryData();
        // console.log(this.summary, "summary")
        if (this.summary.length) {
          this.getBatchReportHeaders();
          this.getBatchReport(payload);
          this.loaded = false;
          this.loadedspinner = false;
        } else {
          this.loadedspinner = false;
          this.Errormsg = false;
          this.errMessage = this.error.getErrorMessage(1);
        }

      }, err => {

      });
  }


  generatePdfSummaryData() {
    const summaryData = []
    const tempData = []
    for (let user of this.summary) {
      const temp = {
        TITLE: user.header_name,
        boxdata: {
          'Max Alarm Count': user.max_alarm_count === 0 ? "0" : user.max_alarm_count,
          'Min Alarm Count': user.min_alarm_count === 0 ? "0" : user.min_alarm_count,
          'Batch Ending Temperature': user.current_temperature === 0 ? "0" : user.current_temperature,
        }
      }
      tempData.push(temp);
    }
    summaryData.push(tempData)
    return summaryData;
  }


  getBatchReportHeaders() {

    this.reportsService.getBatchReportHeaders().subscribe(data => {
      this.parameters = data;
      console.log("  call getBatchReportHeaders data ==> ", data);
      this.displayedColumns = this.parameters.map(item => item.column_name);
      // console.log("  monitoringDataColumn ==> ", this.displayedColumns);
      this.pdfData['monitoringDataColumn'] = this.displayedColumns;
    },
      err => {

      })
  }

  getBatchReport(payload) {

    this.reportsService.getBatchReport(payload).
      subscribe(data => {
        // console.log("  call getBatchReport  data ==>", data);
        this.setData(data);
      }, err => {

      });
  }




  setData(data) {
    if (data != null) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.setUpChart(this.parameters, data);

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
      this.btnRef.disabled = false;

      // this.loaded = false;
      // this.loadedspinner = false;
    } else {
      // this.loadedspinner = false;
      // this.Errormsg = false;
      // this.errMessage = this.error.getErrorMessage(1);
    }
  }

  private handleError(err, id = 0) {
    this.loaded = true;
    this.loadedspinner = false;
    this.Errormsg = false;
    this.errMessage = this.error.getErrorMessage(id);
    this.reportsService.throwError(err);
  }

  setUpChart(parameters, collection) {
    this.lineChartLabels = [];
    this.lineChartData = [];
    // this.lineChartColors = [];
    let flag: boolean = true;
    for (let item of collection) {
      for (let parameter of parameters) {
        if (parameter.column_name == "start_time") {
          this.lineChartLabels.push(item[parameter.column_name]);
        } else {
          if (flag) {
            // first time.
            this.lineChartData.push(
              {
                label: parameter.header_name, data: [item[parameter.column_name]]
              });
          } else {
            //second time.
            let objectIndex = this.lineChartData.findIndex((obj => obj.label == parameter.header_name));
            let objectData = this.lineChartData[objectIndex];
            objectData['data'] = [...objectData['data'], item[parameter.column_name]];
          }
        }
      }
      flag = false;
    }
  
  }
 

  //==========================================

  createComponent() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(NewPdfComponent);
    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(factory);
    this.pdfData['chart'] = document.getElementsByTagName('canvas')[0].toDataURL();
    componentRef.instance.getPdfData(this.pdfData);
    setTimeout(() => {
      componentRef.destroy();
    }, 2000);
  }



}
