import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController  } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
 import { AlertController } from 'ionic-angular';

/**
 * Generated class for the StatsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  profilePic;
  Displayname;
  wins: number =13;
  looses: number=3;
  draws: number=7;


  public doughnutChartLabels:string[] = ['Wins', 'Looses', 'Draws'];
  public doughnutChartData:number[] = [this.wins, this.looses, this.draws];
  public doughnutChartType:string = 'doughnut';
 

  constructor(public navCtrl: NavController, public navParams: NavParams, public profile: ProfileProvider, public loadingCtrl: LoadingController,public zone: NgZone,private alertCtrl: AlertController) {
    this.Displayname = this.profile.getProfileName();
    this.getProfilePicture();
    this.init();
  }
  init(){    
    let p = this.profile.getProfile();
    p.then(()=>{
      // this.zone.run(()=>{

      // });
    })
    .catch(()=>{;}); // Default werte sind schon 0
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }
  changePicture(){
    let alert = this.alertCtrl.create({
      title: 'Profile Picture',
      subTitle: 'Do you want to update your Profile Picture?',
      buttons : [
        {
          text: 'Agree',
          handler: ()=>{
            this.takePicture();
          }
        },
        {
          text: 'Delete',
          handler: ()=>{
            this.deleteProfilePicture();
          }
        },
        {
          text: 'Disagree',
          handler: ()=>{}
        }
      ]
    });
    alert.present();
  }

  deleteProfilePicture(){
    this.profile.deleteProfilePicture();
    this.getProfilePicture();
  }
  takePicture() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Uploading Picture...'
    });
    loading.present();
     this.profile.updateProfilePicture().then(()=>{
        loading.dismiss();
     }).catch((err)=>{
       loading.dismiss();
     });    
  }
  getProfilePicture(){
    this.profile.getThisProfilePicture().then((url)=>this.zone.run(()=>this.profilePic = url))
    .catch((err)=>{

    });
  }
  editName(){
    let alert = this.alertCtrl.create({
      title: 'Displaying Name',
      inputs: [{
        name: 'Name' ,
        placeholder: this.Displayname
      }],
      buttons:[
        {
          text: 'Save',
          handler: data=>{
            this.newName(data.Name);
          }
        },
        {
          text: 'Cancel'
        }
      ]
    });
    alert.present();
  }

  newName(name:string){
    this.zone.run(()=>this.Displayname=name);
    this.profile.updateName(name);
  }


}
