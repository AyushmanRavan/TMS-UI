import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfigurationService } from '../configuration.service';
import { ADD_UPDATE_DIALOG_OPTIONS, DELETE_DIALOG_OPTIONS, DIALOG_BUTTONS, DIALOG_HEADER, DIALOG_OPTIONS, MODE } from '../shared/config';
import { BatchDialogComponent } from './batch-dialog/batch-dialog.component';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss']
})
export class BatchComponent implements OnInit {
  dialogRef;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  actionMode: string;
  errMessage: string;
  loaded: boolean;
  subscriber: Subscription;
  hiddenData: boolean;
  errhidden: boolean;
  datasetLength: number = 0;;
  currentPage = 0;
  pageSize = 10;
  array: any;


  displayedColumns: string[] = [
    "batch_id",
    "product_name",
    "rackName",
    "quantity",
    "start_time",
    "end_time",
    "action"
  ];


  constructor(private _intl: MatPaginatorIntl, public dialog: MatDialog, private config: ConfigurationService) {
    this.getAllBatchData();//private config: ConfigurationService
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  private getAllBatchData() {
    this.subscriber = this.config.getAllBatches().subscribe(
      data => {
       
        if (data == null) {
          this.handleErrorOFNoMoreData();
          this.hiddenData = true;
        } else {
          this.setTableData(data);
          this.hiddenData = false;
          this.errhidden = true;
        }
      },
      err => this.handleError(err)
    );
  }


  addBatch(mode = 'add') {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS, mode, {});
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  updateBatch(row, mode) {
    this._dialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS : DELETE_DIALOG_OPTIONS,
      mode,
      Object.assign({}, row)
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(BatchDialogComponent, {
      ...options,
      data: {
        mode: mode,
        details: data,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode),
        isOpenFromConfig: true
      },
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe((data: any) => {
      if (typeof data != 'string') {
        this.subscriber = this.config.getAllBatches().subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              this.getAllBatchData();
            } else {
              this.setTableData(data);
              this.loaded = true;
              this.hiddenData = false;
              this.errhidden = true;
            }
          },
          err => this.handleError(err)
        );
      }
    });
  }

  updateDataset(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  private setTableData(data) {
    if (data && data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(this.config.convertUtcToDataTime(data));
      this.dataSource.paginator = this.paginator;
      this.array = data;
      this.datasetLength = this.array.length;
      this.iterator();
    } else {
      this.errMessage = this.config.getErrorMessage(1);
    }
    this.reset();
  }


  private handleError(err) {
    this.reset();
    this.errMessage = this.config.getErrorMessage(0);
    this.config.throwError(err);
  }

  private handleErrorOFNoMoreData() {
    this.reset();
    this.errMessage = this.config.getErrorMessage(1);
  }

  private reset() {
    this.loaded = true;
  }

}
