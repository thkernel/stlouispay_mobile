import constants from "./constants";

import {Alert} from 'react-native'
//import axios from 'axios'
//import * as axios from 'axios';

const formObject = (data) =>{
    let formData = new FormData();
    for(let property in data){
      formData.append(property,data[property])
    }
    return formData;
};



export default class RequestHandler {
  
  static fetchInstantFeeds(userId,successCallBack, failureCallback) {
    fetch(constants.api.listInstantNews.replace("{userId}",userId), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static searchInstantNews(query,successCallBack, failureCallback) {
    fetch(constants.api.searchInstantNews.replace("{query}",query), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static signInWithUrl(login, password, successCallBack, failureCallback) {
    fetch(constants.api.signIn + "/" + login + "/" + password, {
      method: "POST",
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static signIn(params, successCallBack, failureCallback) {
    fetch(constants.api.signIn, {
      method: "POST",
      mode:'cors',
      body:formObject(params)
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static listPharmacies(successCallBack, failureCallback) {
    fetch(constants.api.listPharmacies, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static searchPharmacyByNameOrAddress(search,successCallBack, failureCallback) {
    fetch(constants.api.searchPharmacy.replace("{pharmacy}",search), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static listAvailableProducts(successCallBack, failureCallback) {
    fetch(constants.api.availableProducts, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static searchProduct(product,successCallBack, failureCallback) {
    fetch(constants.api.searchProduct.replace("{product}",product), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static requestProducts(medicine,successCallBack, failureCallback) {
    fetch(constants.api.requestMedicine.replace("{medicine}",medicine), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static listHealthWorkers(successCallBack, failureCallback) {
    fetch(constants.api.listHealthWorkersRoute, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static searchHealthWorker(query,successCallBack, failureCallback) {
    fetch(constants.api.searchHealthWorker.replace("{query}",query), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getHealthWorkerPlaces(workerId,successCallBack, failureCallback) {
    fetch(constants.api.healthWorkerPlaces.replace("{healthWorkerId}",workerId), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getHealthWorkerMainPlace(workerId,successCallBack, failureCallback) {
    fetch(constants.api.healthWorkerMainPlace.replace("{healthWorkerId}",workerId), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getHealthWorkerAvailability(workerId,placeId,successCallBack, failureCallback) {
    fetch(constants.api.healthWorkerAvailability.replace("{healthWorkerId}",workerId).replace("{healthWorkerPlaceId}",placeId), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getHealthWorkerSpecialities(workerId,successCallBack, failureCallback) {
    fetch(constants.api.healthWorkerSpecialities.replace("{healthWorkerId}",workerId), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static async scheduleRendezvousForStructure(params,successCallBack, failureCallback) {
    fetch(constants.api.scheduleRdvForStructure, {
        method: "POST",
        mode:'cors',
        body:formObject(params)
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async scheduleRendezvous(params,successCallBack, failureCallback) {
    fetch(constants.api.scheduleRdv, {
        method: "POST",
        mode:'cors',
        body:formObject(params)
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async signUpStep1(params,successCallBack, failureCallback) {
    //alert(constants.api.scheduleRendezvous);
    fetch(constants.api.signUpStep1, {
        method: "POST",
        mode:'cors',
        body:formObject(params)
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }
  

  static async signUpLastStep(id,params,successCallBack, failureCallback) {
    //alert(constants.api.scheduleRendezvous);
    fetch(constants.api.signUpLastStep.replace("{id}",id), {
        method: "POST",
        mode:'cors',
        body:formObject(params)
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async searchStructure(params,successCallBack, failureCallback) {
    //alert(constants.api.scheduleRendezvous);
    fetch(constants.api.searchStructures, {
        method: "POST",
        mode:'cors',
        body:formObject(params)
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async listStructures(category,successCallBack, failureCallback) {
    fetch(constants.api.listStructures.replace("{category}",category), {
        mode:'cors'
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async getStructureActivities(id,successCallBack, failureCallback) {
    fetch(constants.api.listStructureActivities.replace("{structureId}",id), {
        mode:'cors'
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async getStructureWorkDays(id,successCallBack, failureCallback) {
    fetch(constants.api.listStructureWorkDays.replace("{structureId}",id), {
        mode:'cors'
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async getWorkersForDay(params,successCallBack, failureCallback) {
    fetch(constants.api.getWorkersForDay, {
        method: "POST",
        mode:'cors',
        body:formObject(params)
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }
}
