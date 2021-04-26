import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-plant-details',
  templateUrl: './plant-details.component.html',
  styleUrls: ['./plant-details.component.scss']
})
export class PlantDetailsComponent implements OnInit {
  // public formattedDate = this.date.toLocaleDateString();
  // public hours = this.date.getHours();
  // public minutes: any = this .date.getMinutes();
  // public ampm = this .hours >= 12 ? 'pm' : 'am';
  // public strTime;

  @Input() plantDetails: any;
  // public localPlantDetails = this.plantDetails.from;
  public options1 = { year: 'numeric', month: 'long', day: 'numeric' };
  public formattedFromDate;
  public formattedFromTime;
  public formattedToDate;
  public formattedToTime;

  constructor() { }

  ngOnInit() {
    this.formattedFromDate = this.plantDetails.fromValue.toLocaleDateString('en-US', this.options1);
    this.formattedFromTime = this.plantDetails.fromValue.toLocaleTimeString('en-US');
    this.formattedToDate = this.plantDetails.toValue.toLocaleDateString('en-US', this.options1);
    this.formattedToTime = this.plantDetails.toValue.toLocaleTimeString('en-US');
  }

}
