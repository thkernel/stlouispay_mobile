//let remoteUrl = "http://192.168.1.3/web.kosante";
//let remoteUrl = "http://192.168.1.4/web.kosante";
//let remoteUrl = "http://192.168.1.5/web.kosante";
//let remoteUrl = "http://192.168.1.2/web.kosante";
//let remoteUrl = "http://192.168.1.24/web.kosante";
let remoteUrl = "http://192.168.43.103/web.kosante";
//let remoteUrl = "http://kosante.org";
let apiUrl = remoteUrl + "/api";

export default constants = {
  remote : {
    url:remoteUrl,
    shared:remoteUrl+"/assets/shared"
  },
  api       : {
    root: apiUrl,
    signIn: apiUrl + "/user/login/",
    listInstantNews: apiUrl + "/user/{userId}/news/list",
    searchInstantNews: apiUrl + "/user/{userId}/news/search/{query}",
    listPharmacies: apiUrl + "/pharmacy/list/",
    listStructures: apiUrl + "/structure/{category}/list",
    listStructureWorkDays: apiUrl + "/structure/{structureId}/work-days",
    listStructureActivities: apiUrl + "/structure/{structureId}/activities",
    searchStructures: apiUrl + "/structure/search",
    getWorkersForDay:apiUrl+"/structure/workers",
    searchProduct:apiUrl+"/pharmacy/search-medicine/{product}",
    requestMedicine:apiUrl+"/medicines/search/{medicine}",
    availableProducts:apiUrl+"/medicines/available",
    listHealthWorkersRoute:apiUrl+"/healthworker/list",
    searchHealthWorker:apiUrl+"/healthworker/search/{query}/",
    healthWorkerAvailability:apiUrl+"/healthworker/{healthWorkerId}/{healthWorkerPlaceId}/availability",
    healthWorkerSpecialities:apiUrl+"/healthworker/{healthWorkerId}/specialities",
    healthWorkerPlaces:apiUrl+"/healthworker/{healthWorkerId}/work-places",
    healthWorkerMainPlace:apiUrl+"/healthworker/{healthWorkerId}/work-place/main",
    showHealthWorkerInfo:apiUrl+"/healthworker/{param}/info",
    scheduleRdv:apiUrl+"/rendezvous/add",
    scheduleRdvForStructure:apiUrl+"/structure/add-rendezvous",
    searchPharmacy:apiUrl+"/pharmacy/search/{pharmacy}",
    signUpStep1:apiUrl+"/user/sign-up/step1",
    signUpLastStep:apiUrl+"/user/sign-up/last/{id}",
  },
  database: {
    name:"ko-sante.app.db",
    location:"",
    version:3
  },
  fonts:{
    primary:"candara",
    secondary:"bookmanoldstyle"
  },
  colors:{
    statusBar:'#003D33',
    toolBar:'#00695C',
    fabColor:'#FF4081',

    blue:{
      light:'#304FFE',
      dark:'#303F9F',
      primary:'#3F51B5',
      share:'#1565C0'
    },
    white:"#fff"
  },

  app:{
    version:'1.0.1',
    poweredBy:'Frédérick KOLANE',
    developers:[
      {
        fullName:"Napo BONAGNIME",
        email:"emma@gmail.com",
        aboutMe:"",
      }
      ,{
        fullName:"Serge TALAKI",
        email:"tech@devstudio.com",
        aboutMe:"https://devstudio.com/about",
      }      
    ],
    policyAgreement:'http://kosante.org/private/privacy'
  }
};
