import { toast } from "react-toastify";
import { intl } from "../components/App";
import { sortData } from "../components/CommonScript";
import rsapi from "../rsapi";
import { initRequest } from "./LoginAction";
import { DEFAULT_RETURN } from "./LoginTypes";

export function getPortalOrderClickDetails(inputData, userInfo,masterData) {
    return function (dispatch) {

        dispatch(initRequest(true));
        return rsapi.post("portalorderdetails/getPortalOrderClickDetails", {
            "userinfo": userInfo,"nportalordercode": inputData.nportalordercode
        })
            .then(response => {

                masterData = { ...masterData, ...response.data,searchedData: undefined };

                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
            }).catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response }));
                }
            })

    }
}

