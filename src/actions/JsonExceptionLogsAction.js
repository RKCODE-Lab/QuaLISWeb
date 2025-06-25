import rsapi from '../rsapi';
import {DEFAULT_RETURN} from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';

export function ViewJsonExceptionLogs(masterData, userInfo, viewJsonExceptionLogs, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("jsonexceptionlogs/getJsonExceptionLogsDetails", { njsonexceptioncode:viewJsonExceptionLogs.njsonexceptioncode,userinfo:userInfo})
            .then(response => {
                 masterData = {
                    ...masterData,
                    ...response.data
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        viewJsonExceptionLogs:viewJsonExceptionLogs,
                        masterData,
                        selectedId:viewJsonExceptionLogs.njsonexceptioncode,
                        screenName,
                        loading: false,
                        openModal:true,
                        needOldValueColumn:response.data['needOldValueColumn'] 
                        
                    }
                })
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