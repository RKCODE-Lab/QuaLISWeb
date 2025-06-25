import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
import Axios from 'axios';
//import {constructOptionList} from '../components/CommonScript';
import { initRequest } from './LoginAction';
import { toast } from 'react-toastify';
import { intl } from '../components/App';

export function fetchRecordComponent(fetchRecordParam) {
    return function (dispatch) {
        let urlArray = [];

        let selectedId = null;
        if (fetchRecordParam.operation === "update") {
            const component = rsapi.post(fetchRecordParam.inputParam.classUrl + "/getActive" + fetchRecordParam.inputParam.methodUrl + "ById", { [fetchRecordParam.primaryKeyField]: fetchRecordParam.primaryKeyValue, "userinfo": fetchRecordParam.userInfo });

            urlArray = [ component];
            selectedId = fetchRecordParam.primaryKeyValue;
        }
        else {
            urlArray = [];
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(Axios.spread((...response) => {

                let selectedRecord = {};

                if (fetchRecordParam.operation === "update") {
                    selectedRecord = response[0].data;
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord: fetchRecordParam.operation === "update" ? selectedRecord : selectedRecord,
                        operation: fetchRecordParam.operation,
                        screenName: fetchRecordParam.screenName,
                        openModal: true, ncontrolCode: fetchRecordParam.ncontrolCode,
                        loading: false, selectedId
                    }
                });
            }))

            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                //console.log("Error In Component : ", error);
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })

    }
}