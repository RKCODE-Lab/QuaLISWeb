import rsapi from '../rsapi';
import Axios from 'axios';
import {toast} from 'react-toastify';
import { DEFAULT_RETURN} from './LoginTypes';
import { initRequest } from './LoginAction';
import { sortData ,constructOptionList } from '../components/CommonScript';

export const changeSampleTypeFilter = (inputParam, filterSampleType, SelectedSampleType) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/projectview/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                // const masterData = response.data
                let responseData = { ...response.data }
                responseData= sortData(responseData)
                let masterData = {
                    ...inputParam.inputData,
                    ...responseData,
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        dataState: undefined,
                        
                        masterData: {
                            ...masterData,
                            filterSampleType,
                            nfilterSampleType: inputParam.inputData.nfilterSampleType,
                            SelectedSampleType: SelectedSampleType.item
                            
                            
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

export function getuserComboServices(methodParam,selectedRecord) {

    return function (dispatch) {

        let URL = [];

            URL=rsapi.post("/projectmaster/getUsers", { "userinfo": methodParam.inputData.userinfo, "nuserrolecode":  methodParam.inputData.primarykey  })

         dispatch(initRequest(true));

        Axios.all([URL])

            .then(response => {

                let userList;

                const districtMap = constructOptionList(response[0].data || [], "nusercode",

                "susername", undefined, undefined, false);              

                userList = districtMap.get("OptionList");

                 

                dispatch({ type: DEFAULT_RETURN, payload:

                     { userList,selectedRecord, loading: false, data: undefined, dataState: undefined } })

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


//ProjectView Click
export const getProjectView = (projectviewItem, userInfo, masterData) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/projectview/getActiveProjectViewById", {
            nprojectmastercode: projectviewItem.nprojectmastercode,
            nsampletypecode: masterData.filterSampleType[0].nsampletypecode,          
                userinfo: userInfo
            })
            .then(response => {
                

                    let masterData1  = {...masterData,

                        ...response.data }

                    // ...masterData,
                    // ...response.data
                    masterData=masterData1
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                       // masterData,
                        loading: false,
                        dataState: undefined,
                        masterData
                        
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

