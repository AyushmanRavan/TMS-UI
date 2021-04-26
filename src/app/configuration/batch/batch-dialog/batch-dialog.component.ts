import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';

@Component({
  selector: 'app-batch-dialog',
  templateUrl: './batch-dialog.component.html',
  styleUrls: ['./batch-dialog.component.scss']
})
export class BatchDialogComponent implements OnInit {
  batch: FormGroup;
  loading: boolean;
  fromStartAt;
  toStartAt;
  showTime: string;
  max: Date;
  min: Date;
  rackNameOptions = ["rack1", "rack2", "rack3", "rack4", "rack5", "rack6"];

  constructor(private _dialogRef: MatDialogRef<BatchDialogComponent>,
    private _fb: FormBuilder, private _user: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {

    this.batch = this._fb.group({
      batch_id: ['', Validators.required],
      product_name: ['', Validators.required],
      rackName: ['', Validators.required],
      quantity: ['', Validators.required],
      start_time: [this.getDate(), Validators.required],
      // end_time: ['', Validators.required],
    });
    // this.fromStartAt = this.getDate();
    // this.toStartAt = this.getDate(true);
  }

  getTime(time: string) {
    const [hh, mm, ss] = time.split(":");
    let t = moment().set({
      hour: parseInt(hh),
      minute: parseInt(mm),
      second: parseInt(ss),
      millisecond: 0
    });
    return t.toDate();
  }

  ngOnInit(): void {
    this.showTime = "both";
    console.log("=====backend=======>", this.dialog.details)
    if (this.dialog.mode === MODE.UPDATE) {
      this.batch.controls['batch_id'].setValue(this.dialog.details.batch_id);
      this.batch.controls['product_name'].setValue(this.dialog.details.product_name);
      this.batch.controls['rackName'].setValue(this.dialog.details.rackName);
      this.batch.controls['quantity'].setValue(this.dialog.details.quantity);
      this.batch.controls['start_time'].setValue(new Date(this.dialog.details.start_time));
      this.batch.get('start_time').disable();
      // this.batch.controls['end_time'].setValue(new Date(this.dialog.details.end_time));
    } if (this.dialog.mode !== MODE.DELETE) {

    }
  }


  onSubmit() {
    if (this.batch.valid) {
      console.log("============>", this.batch.value)
      this.updateBatch(this.batch.value, this.dialog.mode);
    }
  }

  setMinToDate() {
    const { start_time } = this.batch.value;
    this.min = start_time;
  }

  formatDate = dt => moment(dt).format("YYYY-MM-DD HH:mm:ss.SSS");
  formatDateOee = dt => moment(dt).format("YYYY-MM-DD 00:00:00.000");

  updateBatch(user, mode) {
    let tempData = Object.assign({}, user);


    // tempData.end_time = this.formatDate(tempData.end_time);

    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        tempData.start_time = this.formatDate(tempData.start_time);
        this._user
          .addBatch(tempData)
          .subscribe(
            res => {

              this._dialogRef.close(user);
              this.loading = false;
            },
            err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:
        tempData.start_time = this.dialog.details.start_time;

        this._user
          .updateBatch(tempData)
          .subscribe(
            res => {
              this._dialogRef.close(res);
              this.loading = false;
            },
            err => this.handleError(err)
          );

        break;

      case MODE.DELETE:

        this._user
          .deleteBatch(tempData)
          .subscribe(
            res => {
              this._dialogRef.close(user);
              this.loading = false;
            },
            err => this.handleError(err)
          );

        break;

    }
  }

  private handleError(err) {
    this._user.throwError(err);
    this.batch.enable();
    this.loading = false;
  }

  toDate = (datetime: string) => moment(datetime).toDate();

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

}
