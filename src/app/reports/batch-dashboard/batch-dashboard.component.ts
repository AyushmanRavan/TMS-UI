import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Color } from 'ng2-charts';
import { ReportsService } from '../reports.service';

interface GraphData {
  data: number[],
  label: string
}

@Component({
  selector: 'app-batch-dashboard',
  templateUrl: './batch-dashboard.component.html',
  styleUrls: ['./batch-dashboard.component.scss']
})
export class BatchDashboardComponent implements OnInit {
 
  color: string = "#3e6ceb";
  type: string = "card";
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
    }, {
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

  title = 'Card View Demo';
  gridColumns = 3;
  displayedColumns: string[];
  parameters: any[];
  dataSource = new MatTableDataSource();
 @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private reportsService: ReportsService,
   ) {
    this.getBatchReportHeaders();
    this.getBatchDashBoardSummery();
  }

  getBatchReportHeaders() {

    this.reportsService.getBatchReportHeaders().subscribe(data => {
      this.parameters = data;
      this.displayedColumns = this.parameters.map(item => item.column_name);
      this.getBatchDashBoardReport();
    },
      err => {

      }
    )
  }

  getBatchDashBoardSummery() {
    this.reportsService.getBatchDashBoardSummery().
      subscribe(data => {
        this.summary = data;
      }, err => {

      });
  }

  getBatchDashBoardReport() {
    this.reportsService.getBatchDashBoardReport().
      subscribe(data => {
        this.setData(data);
      }, err => {

      });
  }

  ngOnInit(): void {
  }

  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 3 ? 4 : 3;
  }

  setData(data) {
    if (data != null) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      // this.pdfData = this.dataSource;
      // this.pdfReady = true;
      // this.loaded = false;
      // this.loadedspinner = false;

      this.setUpChart(this.parameters, data);
    } else {
      // this.loadedspinner = false;
      // this.Errormsg = false;
      // this.errMessage = this.error.getErrorMessage(1);
    }
  }


  getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
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
            //first colors
            // this.lineChartColors.push(
            //   {
            //     backgroundColor: "transparent",
            //     borderColor: this.getRandomColor(),
            //     pointBackgroundColor: this.getRandomColor(),
            //     pointBorderColor: this.getRandomColor(),
            //     pointHoverBackgroundColor: this.getRandomColor(),
            //     pointHoverBorderColor: this.getRandomColor()
            //   })
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

}
