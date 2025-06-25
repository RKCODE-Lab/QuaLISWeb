import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
import { initRequest } from './LoginAction';
import { toast } from 'react-toastify';
import {sortData} from '../components/CommonScript';

export function SyncRecords (userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/synchronization/syncRecords",
            { 'userinfo': userInfo})
            .then(response => {             

                if(response.data["SyncMessage"])
                {
                    toast.info(response.data["SyncMessage"]);
                }
                //masterData = {...masterData, ...response.data}; 
                const masterData = response.data;      
                sortData(masterData);
                dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:null, modalName:undefined, 
                     loading:false}}); 
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function getSyncHistoryDetail (syncHistory, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    console.log("syncHistory:", syncHistory);
    return rsapi.post("synchistory/getSyncHistory", {nsyncbatchcode:syncHistory.nsyncbatchcode, userinfo:userInfo})
   .then(response=>{     
        masterData = {...masterData, ...response.data};       
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:null, modalName:undefined, 
             loading:false}});   
   })
   .catch(error=>{
        dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
       if (error.response.status === 500){
           toast.error(error.message);
       } 
       else{               
           toast.warn(error.response.data);
       }  
  
   })
}}