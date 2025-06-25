import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios'
import { initRequest } from './LoginAction';

export function showInstitutionDepartmentAddScreen (userInfo, ncontrolcode){
    return function(dispatch){
        dispatch(initRequest(true));
        rsapi.post('institutiondepartment/getInstitutionDepartment',{"userinfo":userInfo}) 
        .then(response=> { 
            dispatch({
                type: DEFAULT_RETURN, payload:{
                    openModal:true,
                    operation:"create",
                    selectedRecord:{}
                    , ncontrolcode,loading:false
                }
            });         
        })
        .catch(error => {
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


export function fetchinstituiondeptTypeById (editParam){  
    return function(dispatch){
        const URL1=rsapi.post("institutiondepartment/getActiveInstitutionDepartmentById", { [editParam.primaryKeyField] :editParam.primaryKeyValue , "userinfo": editParam.userInfo} )
        dispatch(initRequest(true));
        Axios.all([URL1])
        .then(response=> { 
            let selectedRecord={}
            let selectedId = editParam.primaryKeyValue;         
            selectedRecord=response[0].data
            dispatch({
                type: DEFAULT_RETURN, payload:{
                    selectedRecord: { ...response[0].data},
                operation:editParam.operation,
                openModal: true,
                screenName:editParam.screenName,
                ncontrolcode:editParam.ncontrolCode,
                loading:false,selectedId
            }
            }); 
            
        })
        .catch(error => {
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