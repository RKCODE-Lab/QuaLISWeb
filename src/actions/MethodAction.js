import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
//import {getComboLabelValue, constructOptionList} from '../components/CommonScript'
import {sortData, getComboLabelValue, constructOptionList, rearrangeDateFormat} from '../components/CommonScript';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl} from '../components/App';
import {
    transactionStatus } from "../components/Enumeration";
//import { intl } from '../components/App';

export function getMethodDetail (method, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi.post("method/getMethod", {nmethodcode:method.nmethodcode, userinfo:userInfo})
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

//export function getMethodComboService (screenName, primaryKeyName, primaryKeyValue, operation, inputParam , userInfo, ncontrolCode) {            
export function getMethodComboService (methodParam) {            
    return function (dispatch) {   
    const methodCategoryService = rsapi.post("methodcategory/getMethodCategory", 
                                    {userinfo:methodParam.userInfo});
    const DateService= rsapi.post("/timezone/getLocalTimeByZone", {
                                        "userinfo": methodParam.userInfo
                                    })
    let urlArray = [];
    let selectedId = null;
    if (methodParam.operation === "create"){
        urlArray = [methodCategoryService,DateService];
    }
    else{           
       // const url = methodParam.inputParam.classUrl+ "/getActive" + methodParam.inputParam.methodUrl + "ById";   //"method/getActiveMethodById"      
       const url = "method/getActiveMethodById";   //"method/getActiveMethodById"      
        const methodById =  rsapi.post(url, { [methodParam.primaryKeyName] :methodParam.masterData.SelectedMethod[methodParam.primaryKeyName], "userinfo": methodParam.userInfo} );
        urlArray = [methodCategoryService, DateService,methodById];
        selectedId = methodParam.primaryKeyValue;
    }
    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response=>{                  
            
            let selectedRecord =  {};

            const methodCatMap = constructOptionList(response[0].data || [], "nmethodcatcode",
                                "smethodcatname", undefined, undefined, true);
            const methodCategoryList = methodCatMap.get("OptionList");
            selectedRecord["dcurrentdate"]= rearrangeDateFormat(methodParam.userInfo, response[1].data);
            selectedRecord["ndefaultstatus"]=transactionStatus.NO;
            selectedRecord["nneedvalidity"]=transactionStatus.NO;
            //selectedRecord["dvaliditystartdate"]= selectedRecord["dvalidityenddate"];
            if (methodParam.operation === "update"){
                selectedRecord = response[2].data;
                selectedRecord["nmethodcatcode"] = getComboLabelValue(selectedRecord, response[0].data, 
                    "nmethodcatcode", "smethodcatname");                   
                selectedRecord["dcurrentdate"]= rearrangeDateFormat(methodParam.userInfo, response[1].data);
            }
           
            dispatch({type: DEFAULT_RETURN, payload:{methodCategoryList,//:response[0].data || [],                               
                        operation:methodParam.operation, screenName:methodParam.screenName, selectedRecord, 
                        openModal : true,
                        ncontrolCode:methodParam.ncontrolcode,
                        loading:false,selectedId
                    }});
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

export function getMethodValidityUTCDate (methodParam) {            
    return function (dispatch) {   
    
    const DateService= rsapi.post("/timezone/getLocalTimeByZone", {
                                        "userinfo": methodParam.userInfo
                                    })
    let urlArray = [];
   //, let selectedId = null;
    
        urlArray = [DateService];
    
    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response=>{                  
            
            let selectedRecord =  {};

            
            selectedRecord["dcurrentdate"]= rearrangeDateFormat(methodParam.userInfo, response[0].data);
            //selectedRecord["dvaliditystartdate"]= selectedRecord["dvalidityenddate"];
                       
            dispatch({type: DEFAULT_RETURN, payload:{          
                        operation:methodParam.operation, screenName:methodParam.screenName, selectedRecord, 
                        openChildModal : true,
                        //ncontrolCode:methodParam.ncontrolcode,
                        loading:false//,selectedId
                    }});
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

export const getAvailableValidityData = (methodItem, url, key, screenName, userInfo, ncontrolCode) => {
    return (dispatch) => {
        const inputParam = {
            "userinfo": userInfo
        }
        dispatch(initRequest(true));
        rsapi.post("method/" + url, inputParam)
            .then(response => {
                const availableDataMap = constructOptionList(response.data, key === "methodvalidity" ? "nmethodvaliditycode" : key === "method" ? "nmethodcode" : key == "instrumentcategory" ?"ninstrumentcatcode" : key == "package" ?"ntestpackagecode" : "ncontainertypecode",
                    key === "section" ? "ssectionname" : key === "method" ? "smethodname" :  key == "instrumentcategory" ? "sinstrumentcatname"  :  key == "package" ? "stestpackagename" : "scontainertype", false, false, true);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,
                        // otherTestData: {
                        //     [key]: availableDataMap.get("OptionList")
                        // },
                        screenName: screenName,
                        selectedRecord: {
                            availableData: ""
                        },
                        operation: "create",
                        ncontrolCode,
                        loading: false
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
                if (error.response.status === 417) {
                    toast.info(error.response.data)
                } else {
                    toast.error(error.message)
                }
            });
    }
}
export function fetchMethodValidityById (editParam){  
    return function(dispatch){
        if (editParam.editRow.ntransactionstatus === transactionStatus.DRAFT) {
           
           let urlArray = [];
        const URL3=rsapi.post("/method/getActiveMethodValidityById", { [editParam.primaryKeyName] :editParam.editRow.nmethodvaliditycode , "userinfo": editParam.userInfo} );
        const DateService= rsapi.post("/timezone/getLocalTimeByZone", {
            "userinfo": editParam.userInfo
        });
        urlArray = [URL3,DateService];
        dispatch(initRequest(true));
        Axios.all(urlArray)
        .then(response=> { 
            let selectedRecord={};
            let selectedId = editParam.editRow.nmethodvaliditycode;
            selectedRecord=response[0].data.MethodValidity[0];
            selectedRecord["dcurrentdate"]= rearrangeDateFormat(editParam.userInfo, response[1].data);
            if (selectedRecord["svaliditystartdate"] !== "") {

                selectedRecord["dvaliditystartdate"] = rearrangeDateFormat(editParam.userInfo, selectedRecord["svaliditystartdate"]); //new Date(response[7].data["smanufacdate"]);
            }

            if (selectedRecord["svalidityenddate"] !== "") {
                selectedRecord["dvalidityenddate"] = rearrangeDateFormat(editParam.userInfo, selectedRecord["svalidityenddate"]); //new Date(response[7].data["spodate"]);
            }
            
            dispatch({
                type: DEFAULT_RETURN, payload:{
                selectedRecord ,
                operation:editParam.operation,
                openChildModal: true,
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
    else {
        toast.warn(intl.formatMessage({ id: "IDS_NOTEDITDELETEMETHODVALIDITY" }));
    }
    }
 }