import { Component, OnInit, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {

  @Input() private carbs: number;
  @Input() private protein: number;
  @Input() private fat: number;

  //Chart properties
  private doughnutChartLabels: string[] = ['Carbs (g)', 'Protein (g)', 'Fats (g)'];
  private doughnutChartData: number[];
  private doughnutChartType: string = 'doughnut';
  private colors: any[] = [{
    backgroundColor: ['#418DFF', '#30AAE8', '#34F0FF']
  }];
  private doughnutChartOptions: any = {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth:10
      },
      layout: {
        padding: {
            left: 50,
            right: 50,
            top: 0,
            bottom: 0
        }
    }
    }
  }

  constructor() { }

  ngOnInit() {
    this.doughnutChartData = [this.carbs, this.protein, this.fat];
  }

  ngOnChanges(){
    this.doughnutChartData = [this.carbs, this.protein, this.fat];
  }

    // Chart events
    public chartClicked(e: any): void {
      console.log(e);
    }
  
    public chartHovered(e: any): void {
      console.log(e);
    }

}
