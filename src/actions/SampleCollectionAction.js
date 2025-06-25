import rsapi from '../rsapi';
import Axios from 'axios';
import { toast } from 'react-toastify';

import {
    constructOptionList, rearrangeDateFormat
} from '../components/CommonScript'
import {
    DEFAULT_RETURN
} from './LoginTypes';
import { initRequest } from './LoginAction';
import {
    intl
} from '../components/App';


export function getComboSampleCollection(addParam) {
    return function (dispatch) {

        let urlArray = [];
        const service1 = rsapi.post("unit/getUnit", { userinfo: addParam.userInfo });
    
        const service2 = rsapi.post("timezone/getLocalTimeByZone", {
            userinfo: addParam.userInfo
        });



        urlArray = [service1, service2]

        dispatch(initRequest(true));

        Axios.all(urlArray).then(response => {


            let selectedId = null;
            let unit;

            const unitMap = constructOptionList(response[0].data || [], "nunitcode",
                "sunitname", undefined, undefined, true);
            unit = unitMap.get("OptionList");

            let date = rearrangeDateFormat(addParam.userInfo, response[1].data);

            let selectedRecord = { ...addParam.selectedRecord, "dcollectiondate": date }

                let masterData={...addParam.masterData,"barcodedata":undefined}

            selectedId = addParam.primaryKeyField;
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    unit,
                    operation: addParam.operation, screenName: addParam.screenName,
                    selectedRecord: selectedRecord,
                    masterData,
                    openModal: true,
					//ALPD-4618--Vignesh R(01-08-2024)
                    ncontrolcode: addParam.ncontrolCode,
                    loading: false, selectedId
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }

}



export function getBarcodeDataCollection(inputParam) {
    return function (dispatch) {
      
            dispatch(initRequest(true));

        rsapi.post("storagesamplecollection/getBarcodeConfigDataCollection", { userinfo: inputParam.userinfo, nprojecttypecode: inputParam.nprojecttypecode, spositionvalue: inputParam.spositionvalue, nbarcodeLength: inputParam.nbarcodeLength, jsondata: inputParam.jsondata }).then(response => {

            let barcodedata = response.data.jsondataBarcodeData;

            let masterData = { ...inputParam.masterData, "barcodedata": barcodedata,"jsondataBarcodeFields":response.data.jsondataBarcodeFields }
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    ...inputParam.selectedRecord,
                    loading: false
                }
            });
        }
        )
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    
    }
}

export function saveCollection(inputParam, masterData) {
    return function (dispatch) {


        dispatch(initRequest(true));
        let urlArray = [];
      

        const service1 = rsapi.post("storagesamplecollection/" + inputParam.operation + "SampleCollection", inputParam.inputData);
        const service2 = rsapi.post("timezone/getLocalTimeByZone", {
            userinfo:inputParam.inputData.userinfo
        });

        urlArray = [service1, service2]

        Axios.all(urlArray).then(response => {
        let openModal=false;
           if(inputParam.saveType===2){
            openModal=true;
           }
           let date = rearrangeDateFormat(inputParam.inputData.userinfo, response[1].data);

            masterData = { ...masterData, "SampleCollection": response[0].data.SampleCollection, "barcodedata":"" }
            let selectedRecord = { ...inputParam.selectedRecord, "sbarcodeid": "", "nsampleqty": "", "nunitcode": "", "scomments": "", "dcollectiondate": date}

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    selectedRecord,
                    openModal: openModal,
                    loading: false,
                    loadEsign:false
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }

}

export function getActiveSampleCollectionById(editParam) {
    return function (dispatch) {

        let selectedId = null;
        dispatch(initRequest(true));

        rsapi.post("storagesamplecollection/getActiveSampleCollectionById", { [editParam.primaryKeyField]: editParam.primaryKeyValue,"nprojecttypecode":editParam.editRow.nprojecttypecode, "userinfo": editParam.userInfo }).then(response => {
            selectedId = editParam.primaryKeyValue;
            let instname = [];
            instname.push({
                "value": response.data.activeSampleColletionByID["nunitcode"],
                "label": response.data.activeSampleColletionByID["sunitname"]
            });
            let date = rearrangeDateFormat(editParam.userInfo, response.data.activeSampleColletionByID['scollectiondate']);

            //let selectedRecord = response.data && response.data.activeSampleColletionByID

            let barcodedata = response.data && response.data.activeSampleColletionByID.jsondata;
            let masterData = { ...editParam.masterData, "barcodedata": barcodedata, "jsondataBarcodeFields":response.data.jsondataBarcodeFields }
            let selectedRecord = {
                ...editParam.selectedRecord, "sbarcodeid": response.data.activeSampleColletionByID['sbarcodeid'], "nsampleqty": response.data.activeSampleColletionByID['nsampleqty'],
                "dcollectiondate": date, "scomments": response.data.activeSampleColletionByID['scomments']
            }
            selectedRecord["nunitcode"] = instname[0];
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    selectedRecord,
                    operation: editParam.operation,
                    ncontrolcode: editParam.ncontrolCode,
                    openModal: true,
                    loading: false,
                    selectedId,
                    dataState:editParam.dataState,
                    screenName: editParam.screenName
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }

}


export function getSampleCollection(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi.post("storagesamplecollection/getSampleCollection", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data }
                let selectedId=null;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false,selectedId
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function validateEsignCredentialSampleCollection(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi.post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data === "Success") {



                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    // if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                    //     inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                    //     delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                    //     delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                    //     delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];
                    //     delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                    // }
                    
	
                        dispatch(saveCollection(inputParam["screenData"]["inputParam"],inputParam["screenData"]["masterData"]))
 
                 
                }
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
            })
    };
}