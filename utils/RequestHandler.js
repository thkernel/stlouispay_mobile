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
  
  

  

  static signInWithUrl(login, password, successCallBack, failureCallback) {
    fetch(constants.api.signIn + "/" + login + "/" + password, {
      method: "POST",
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }
/*
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
*/
  static signIn(email, password, successCallBack, failureCallback) {
    fetch(constants.api.signIn, {
      method: "POST",
      headers: {
       'Content-Type': 'application/json',
       },
      mode:'cors',
      body:JSON.stringify({
        email: email,
        password: password,
      })
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }




  


  static newOpinion(poll_item_id, content, user_token, successCallBack, failureCallback) {
    fetch(constants.api.newOpinion, {
      method: "POST",
      headers: {
       'Content-Type': 'application/json',
       },
      mode:'cors',
      body:JSON.stringify({
        poll_item_id: poll_item_id,
        content: content,
        user_token: user_token,
      })

    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static newVoting(poll_item_id, user_token, successCallBack, failureCallback) {
    fetch(constants.api.newVoting, {
      method: "POST",
      headers: {
       'Content-Type': 'application/json',
       },
      mode:'cors',
      body:JSON.stringify({
        poll_item_id: poll_item_id,
        user_token: user_token,
      })

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

  static listRadiologies(successCallBack, failureCallback) {
    fetch(constants.api.listRadiologies, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static searchPharmacyByName(search,successCallBack, failureCallback) {
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

  static listAvailableAnalyses(successCallBack, failureCallback) {
    fetch(constants.api.availableAnalyses, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static listCountries(successCallBack, failureCallback) {
    fetch(constants.api.listCountries, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static listLocalities(successCallBack, failureCallback) {
    fetch(constants.api.listLocalities, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static searchProduct(name,successCallBack, failureCallback) {
    fetch(constants.api.searchProduct.replace("{name}", name), {
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

  static requestAnalysis(name,successCallBack, failureCallback) {
    fetch(constants.api.requestAnalysis.replace("{name}", name), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static myOpinions(user_token,successCallBack, failureCallback) {
    fetch(constants.api.myOpinions.replace("{user_token}", user_token), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static myVotes(user_token,successCallBack, failureCallback) {
    fetch(constants.api.myVotes.replace("{user_token}", user_token), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static listHealthWorkers(successCallBack, failureCallback) {
    fetch(constants.api.listHealthWorkers, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getOrders(successCallBack, failureCallback) {
    fetch(constants.api.getOrders, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getOrganizations(successCallBack, failureCallback) {
    fetch(constants.api.getOrganizations, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getLatestCards(successCallBack, failureCallback) {
    fetch(constants.api.getLatestCards, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static async getCardByUID(uid,successCallBack, failureCallback) {
    fetch(constants.api.getCardByUID.replace("{uid}", uid), {
        mode:'cors'
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static getActivePolls(successCallBack, failureCallback) {
    fetch(constants.api.getActivePolls, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getCompletedPolls(successCallBack, failureCallback) {
    fetch(constants.api.getCompletedPolls, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getPollOpinions(successCallBack, failureCallback) {
    fetch(constants.api.getPolls, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static async getTotalOpinions(poll_item_id,successCallBack, failureCallback) {
    fetch(constants.api.getTotalOpinions.replace("{poll_item_id}", poll_item_id), {
        mode:'cors'
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  

  static listKosanteDoctors(successCallBack, failureCallback) {
    fetch(constants.api.listKosanteDoctors, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static listKosanteGeneralDoctors(successCallBack, failureCallback) {
    fetch(constants.api.listKosanteGeneralDoctors, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static listKosanteSpecialDoctors(successCallBack, failureCallback) {
    fetch(constants.api.listKosanteSpecialDoctors, {
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

  static getHealthWorkerPlannings(structure_id,successCallBack, failureCallback) {
    fetch(constants.api.getHealthWorkerPlannings.replace("{structure_id}", structure_id), {
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

  static getHealthWorkerPlaceItems(work_place_id,successCallBack, failureCallback) {
    fetch(constants.api.healthWorkerPlaceItems.replace("{work_place_id}",work_place_id), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getDoctorLocality(workerId,successCallBack, failureCallback) {
    fetch(constants.api.doctorLocality.replace("{healthWorkerId}",workerId), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getLocalityByID(localityId,successCallBack, failureCallback) {
    fetch(constants.api.getLocalityByID.replace("{id}",localityId), {
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

  static getCanVotingAndCommenting(user_token,poll_item_id,successCallBack, failureCallback) {
    fetch(constants.api.canVotingAndCommenting.replace("{user_token}",user_token).replace("{poll_item_id}",poll_item_id), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getAnalysesResults(access_key,successCallBack, failureCallback) {
    fetch(constants.api.analysesResults.replace("{access_key}",access_key), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getHealthWorkerPlannings(successCallBack, failureCallback) {
    fetch(constants.api.healthWorkerPlannings, {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static getConversations(user_token,recipient_id,successCallBack, failureCallback) {
    fetch(constants.api.getConversations.replace("{user_token}",user_token).replace("{recipient_id}",recipient_id), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }
  static async postMessage(message,successCallBack, failureCallback) {
    fetch(constants.api.postMessage, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        mode:'cors',
        body:JSON.stringify({
        user_token: message.user_token,
        recipient_id: params.recipient_id,
        content: params.content,
        conversation_id: params.conversation_id
        
      })
        })
      
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async sendFile(params,successCallBack, failureCallback) {
    fetch(constants.api.sendFile, {
        method: "POST",
        headers: {
            'Content-Type': 'multipart/form-data',
          },
        mode:'cors',
        body:JSON.stringify({
        user_token: params.user_token,
        structure_id: params.structure_id,
        content: params.content,
        file: params.file
        
      })
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

/*
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
  */

  static async scheduleRendezvous(params,successCallBack, failureCallback) {
    fetch(constants.api.scheduleRdv, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        mode:'cors',
        body:JSON.stringify({
        doctor_id: params.doctor_id,
        structure_id: params.structure_id,
        patient_id: params.patient_id,
        day: params.date_rdv,
        reason: params.rdv_reason,
        content: params.content
      })
        })
      
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async saveCardInPortfolio(params,successCallBack, failureCallback) {
    fetch(constants.api.saveCardInPortfolio, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        mode:'cors',
        body:JSON.stringify({
        user_token: params.user_token,
        portfolio_id: params.portfolio_id,
        card_id: params.card_id,
      })
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

  static async signUp(params,successCallBack, failureCallback) {
    //alert(constants.api.scheduleRendezvous);
    fetch(constants.api.signUp, {
        method: "POST",
        headers: {
       'Content-Type': 'application/json',
       },
        mode:'cors',
        body:JSON.stringify(params)
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

/* by me
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
*/
  static searchStructure(structure_name,successCallBack, failureCallback) {
    fetch(constants.api.searchStructures.replace("{name}",structure_name), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static searchHospitals(structure_name,successCallBack, failureCallback) {
    fetch(constants.api.searchHospitals.replace("{name}",structure_name), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static searchLaboratories(structure_name,successCallBack, failureCallback) {
    fetch(constants.api.searchLaboratories.replace("{name}",structure_name), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }

  static searchPharmacies(structure_name,successCallBack, failureCallback) {
    fetch(constants.api.searchPharmacies.replace("{name}",structure_name), {
      mode:'cors'
    })
    .then(response => response.json())
    .then(successCallBack)
    .catch(failureCallback);
  }


  static searchRadiologies(structure_name,successCallBack, failureCallback) {
    fetch(constants.api.searchRadiologies.replace("{name}",structure_name), {
      mode:'cors'
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

  static async listLaboratories(successCallBack, failureCallback) {
    fetch(constants.api.listLaboratories, {
        mode:'cors'
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }


  static async listHospitals(successCallBack, failureCallback) {
    fetch(constants.api.listHospitals, {
        mode:'cors'
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async listConsultationTypes(successCallBack, failureCallback) {
    fetch(constants.api.listConsultationTypes, {
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

  static async getStructureAnalyses(id,successCallBack, failureCallback) {
    fetch(constants.api.listStructureAnalyses.replace("{structure_id}",id), {
        mode:'cors'
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async getStructureWorkDays(structure_id,successCallBack, failureCallback) {
    fetch(constants.api.listStructureWorkDays.replace("{structure_id}",structure_id), {
        mode:'cors'
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async getWorkPlaceItemsByStructureId(structure_id,successCallBack, failureCallback) {
    fetch(constants.api.getWorkPlaceItemsByStructureId.replace("{structure_id}",structure_id), {
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

  static async getStructure(structure_id,successCallBack, failureCallback) {
    fetch(constants.api.getStructure.replace("{id}",structure_id), {
        mode:'cors'
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }

  static async getOpinions(poll_item_id,successCallBack, failureCallback) {
    fetch(constants.api.getOpinions.replace("{poll_item_id}", poll_item_id), {
        mode:'cors'
      })
      .then(response => response.json())
      .then(successCallBack)
      .catch(failureCallback);
  }
}
