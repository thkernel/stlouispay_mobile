import constants from "./constants";

export default class FetchData {

	static posts(successCallBack, failureCallback) {
	    fetch(constants.api.listPolls, {
	      mode:'cors'
	    })
	    .then(response => response.json())
	    .then(successCallBack)
	    .catch(failureCallback);
	}
}
