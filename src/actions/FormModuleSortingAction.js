import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import { toast } from 'react-toastify';
import {  sortData } from '../components/CommonScript';


export function formSortingService1(methodParam){
    return function (dispatch) {  
    return rsapi.post(methodParam.url, methodParam.inputData)
    .then(response=>{     
                let nFlag = 1;
                const masterData = {
                    ...response.data, nFlag};
                sortData(masterData,'ascending','nsorter');  

                dispatch({type: DEFAULT_RETURN, payload:{   masterData,
                                                            formsorting :methodParam.formsorting,
                                                            loading:false
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

export function moduleSortingOrder1(methodParam){
    return function (dispatch) {
        return rsapi.post(methodParam.url, methodParam.inputData)
        .then(response=>{     
                let nFlag = 1;
                const masterData = {
                    ...response.data, nFlag};
                sortData(masterData,'ascending','nsorter');  

                dispatch({type: DEFAULT_RETURN, payload:{   masterData,
                                                            modulesorting :methodParam.modulesorting,
                                                            loading:false
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

export function formModuleGetSorting(methodParam){
    return function (dispatch) {  
    return rsapi.post(methodParam.url, methodParam.inputData)
    .then(response=>{   
        let nFlag = 0;  
                const masterData = {
                    ...response.data, nFlag};

                dispatch({type: DEFAULT_RETURN, payload:{   masterData,
                                                            formsorting :methodParam.formsorting,
                                                            loading:false
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

