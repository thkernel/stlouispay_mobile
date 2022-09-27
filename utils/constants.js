//let remoteUrl = "http://192.168.1.3/web.kosante";
//let remoteUrl = "http://192.168.1.4/web.kosante";
//let remoteUrl = "http://192.168.1.5/web.kosante";
//let remoteUrl = "http://192.168.1.2/web.kosante";
//let remoteUrl = "http://192.168.1.24/web.kosante";
//let remoteUrl = "http://192.168.43.103/web.kosante"; #previous
//let remoteUrl = "http://18.216.203.216";
//let remoteUrl = "http://192.168.1.103:3000";
let remoteUrl = "https://lesaintlouis.ml";
//let apiUrl = remoteUrl + "/api";
let apiUrl = remoteUrl + "/api/v1";


export default constants = {
  remote : {
    url:remoteUrl,
    shared:remoteUrl+"/assets/shared"
  },
  api       : {
    root: apiUrl,
    signIn: apiUrl + "/auth/login",
    newConsultation: apiUrl + "/advices/new",
    newOpinion: apiUrl + "/comments/new",
    newVoting: apiUrl + "/votings/new",
    //getTotalOpinions: apiUrl + "/poll_items/comments/{poll_item_id}",
    getPollItems: apiUrl + "/poll_items/search/by/poll/{poll_id}",
    getUser: apiUrl + "/users/{user_id}",
    getOpinions: apiUrl + "/comments/by/poll_item/{poll_item_id}",

    listInstantNews: apiUrl + "/user/{userId}/news/list",
    searchInstantNews: apiUrl + "/user/{userId}/news/search/{query}",
    listPharmacies: apiUrl + "/structures/pharmacies",
    //listStructures: apiUrl + "/structure/{category}/list",
    listStructures: apiUrl + "/structures/{category}",
    listLaboratories: apiUrl + "/structures/laboratories",
    listRadiologies: apiUrl + "/structures/radiologies",

    listHospitals: apiUrl + "/structures/hospitals",
    listConsultationTypes: apiUrl + "/consultation_types",
    




    listStructureWorkDays: apiUrl + "/schedules/{structure_id}",
    //listStructureActivities: apiUrl + "/structure/{structureId}/activities",
    listStructureActivities: apiUrl + "/analyses/search/{structure_id}",
    listStructureAnalyses: apiUrl + "/analyses/search/{structure_id}",
    listCountries: apiUrl + "/countries/",
    listLocalities: apiUrl + "/localities/",




    //searchStructures: apiUrl + "/structures/search",
    searchStructures: apiUrl + "/structures/search/{name}",
    searchHospitals: apiUrl + "/structures/hospitals/search/{name}",
    searchPharmacies: apiUrl + "/structures/pharmacies/search/{name}",
    searchLaboratories: apiUrl + "/structures/laboratories/search/{name}",
    searchRadiologies: apiUrl + "/structures/radiologies/search/{name}",
    getHealthWorkerPlannings:apiUrl+"/plannings/{structure_id}",
    searchProduct:apiUrl+"/medicaments/search/{name}",
    requestMedicine:apiUrl+"/medicaments/search/{name}",
    //searchHealthWorker:apiUrl+"/healthworker/search/{query}/",
    searchPharmacy:apiUrl+"/pharmacy/search/{pharmacy}",
    searchHealthWorker:apiUrl+"/users/search/{query}/",
    getWorkPlaceItemsByStructureId:apiUrl+"/workplace_items/structure/{structure_id}",




    getWorkersForDay:apiUrl+"/structure/workers",
    //searchProduct:apiUrl+"/pharmacy/search-medicine/{product}",

    //requestMedicine:apiUrl+"/medicines/search/{medicine}",
    requestAnalysis:apiUrl+"/analyses/search_name/{name}",
    myOpinions:apiUrl+"/comments/user/{user_token}",
    myVotes:apiUrl+"/votings/user/{user_token}",

   

    canVotingAndCommenting:apiUrl+"/poll_items/can_commenting_and_voting/{user_token}/{poll_item_id}",
    healthWorkerPlannings:apiUrl+"/plannings",
    getConversations:apiUrl+"/conversations/{sender_id}/{recipient_id}",
    sendFile:apiUrl+"/filesents/new",
    postMessage:apiUrl+"/messages/new",


    

    
    getOrders:apiUrl+"/orders",
   
    getLatestCards:apiUrl+"/cards/latest_cards",
    getCardByUID:apiUrl+"/fidelity_cards/by/{uid}",

    //getPortfolios:apiUrl+"/portfolios/token/{user_token}",
    getPolls:apiUrl+"/polls",
    getCompletedPolls:apiUrl+"/polls/completed",
    getActivePolls:apiUrl+"/polls/active/status",


    //searchPharmacy:apiUrl+"/pharmacy/search/{pharmacy}",

    signUpStep1:apiUrl+"/user/sign-up/step1",
    signUpLastStep:apiUrl+"/user/sign-up/last/{id}",
    signUp:apiUrl+"/user/signup",

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
    toolBar:'#912455',
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
    version:'1.0.O',
    poweredBy:'Amonce DEMBELE',
    developers:[],
    policyAgreement:'https://lesaintlouis.ml/private/privacy'
  }
};