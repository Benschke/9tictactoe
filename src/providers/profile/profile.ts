import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FirebaseProvider } from '../firebase/firebase';
import { AuthProvider } from '../auth/auth';
import 'rxjs/add/operator/map';

@Injectable()
export class ProfileProvider {

  constructor(public camera: Camera, public db: FirebaseProvider, public auth: AuthProvider) {}

  getProfileName(){
    return this.auth.getdisplayName();
  }

  deleteProfilePicture(){
    this.db.deleteProfilePicture(this.auth.getUserUid()).then(()=>{;}).catch((err)=>{
      if(err=!'storage/object-not-found') alert(err);
    });    
  }

  updateProfilePicture(){
    let uid = this.auth.getUserUid();
    return new Promise((reject,resolve)=>{
        this.takePicture().then((captureDataUrl)=>{
          this.db.updateProfilePicture(captureDataUrl,uid).then(()=>{
            resolve(true);
          });
        })
        .catch((err)=>{
          reject(err);
        });
    });    
  }

  takePicture(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      targetHeight: 200,
      targetWidth: 200
    }
    return new Promise((resolve,reject)=>{
      this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let captureDataUrl = 'data:image/jpeg;base64,' + imageData;
        resolve(captureDataUrl);
      }, (err) => {
        reject(err);
      });
    });    
  }
  getThisProfilePicture(){
    return new Promise((resolve,reject)=>{
      this.getProfilePicture(this.auth.getUserUid()).then((url)=>resolve(url))
      .catch((err)=>reject(err));
    });
    
  }
  getProfilePicture(uid){
    return new Promise((resolve,reject)=>{
      this.db.getProfilePicture(uid).then((url)=>resolve(url))
      .catch((err)=>{
        reject(err);
      });
    });    
  }
  getProfile(){
    let uid = this.auth.getUserUid();
    return new Promise((resolve,reject)=>{
      this.db.getProfile(uid).then((snap)=>resolve(snap)).catch(()=>reject(false));
    });  
  }
  updateName(name:string){
    this.db.updateName(name);   
  }

}
