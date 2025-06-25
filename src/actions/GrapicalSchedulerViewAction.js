import { toast } from 'react-toastify';
import Axios from 'axios';
import rsapi from '../rsapi';
import { initRequest } from './LoginAction';
import {DEFAULT_RETURN} from './LoginTypes';
import {sortData, getComboLabelValue, constructOptionList,formatInputDate, rearrangeDateFormat, formatDate} from '../components/CommonScript';
import { intl } from '../components/App';
import {transactionStatus} from '../components/Enumeration';

export function getGrapicalSchedulerViewDetail (scheduler,userInfo, masterData,sscheduletype) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("graphicalschedulerview/getGraphicalSchedulerView", {nschedulecode:scheduler.nschedulecode, userinfo:userInfo,sscheduletype:sscheduletype})
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
}
}

export function changeGrapicalScheduleTypeFilter (inputParam, filterScheduleType)  {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/graphicalschedulerview/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                const masterData = response.data
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData,
                            filterScheduleType,
                            nfilterScheduleType: inputParam.inputData.nfilterScheduleType
                        }
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                toast.error(error.message);
            });
    }
}