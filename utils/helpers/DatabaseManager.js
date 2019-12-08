
import constants from '../constants';

import SQLite from 'react-native-sqlite-2';

export default class DatabaseManager{

    static init(successCallback,failureCallback){
        return SQLite.openDatabase(
            "../../assets/databases/"+constants.database.name, 
            constants.database.version, 
            '', 
            1024, 
            successCallback
        );
    }

    databaseOpenFailure= (error) => { 
        alert(error)
    }

    databaseOpenSuccess= (db) => { 
        console.log(db) 
        alert("OK")
    }
}