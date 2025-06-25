import { DEFAULT_RETURN } from './LoginTypes';
import rsapi from '../rsapi';
import { toast } from 'react-toastify';
import { sortData, constructOptionList } from '../components/CommonScript';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import Axios from 'axios';
import { transactionStatus } from '../components/Enumeration';


export function getSiteDetail(Site, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi.post("site/getSiteScreen", { nsitecode: Site.nsitecode, userinfo: userInfo })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, operation: null, modalName: undefined,
                        loading: false, dataState: undefined
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

export function getSiteCombo(siteParam) {
    return function (dispatch) {
        let urlArray = [];
        let selectedId = null;
        const timeZoneService = rsapi.post("timezone/getTimeZone");
        const dateformat = rsapi.post("site/getDateFormat", { userinfo: siteParam.userInfo });
        if (siteParam.operation === "create") {

            urlArray = [timeZoneService, dateformat];
        }
        else {

            const SiteByID = rsapi.post("site/getActiveSiteById", { [siteParam.primaryKeyField]: siteParam.primaryKeyValue, "userinfo": siteParam.userInfo });
            const districtService = rsapi.post("site/getDistrict", { userinfo: siteParam.userInfo, "nregioncode": siteParam.editRow.nregioncode });
            urlArray = [timeZoneService, dateformat, SiteByID, districtService];
            selectedId = siteParam.primaryKeyValue;

        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                let timezone = [];
                let dateFormat = [];
                let region = [];
                let district = [];
                let districtList = [];

                let selectedRecord = {};
                const timezoneMap = constructOptionList(response[0].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, false);

                const TimeZoneList = timezoneMap.get("OptionList");

                const dateFormatMap = constructOptionList(response[1].data.DateFormat || [], "ndateformatcode",
                    "sdateformat", undefined, undefined, false);

                const dateFormatList = dateFormatMap.get("OptionList");

                const regionMap = constructOptionList(response[1].data.Region || [], "nregioncode",
                    "sregionname", undefined, undefined, false);

                const regionList = regionMap.get("OptionList");
                if (siteParam.operation === "update") {
                    const districtMap = constructOptionList(response[3].data.districtList || [], "ndistrictcode",
                        "sdistrictname", undefined, undefined, false);

                    districtList = districtMap.get("OptionList");
                }
                if (siteParam.operation === "update") {

                    selectedRecord = response[2].data;
                    timezone.push({ "value": response[2].data["ntimezonecode"], "label": response[2].data["stimezoneid"] });
                    dateFormat.push({ "value": response[2].data["ndateformatcode"], "label": response[2].data["sdateformat"] });
                    region.push({ "value": response[2].data["nregioncode"], "label": response[2].data["sregionname"] });
                    district.push({ "value": response[2].data["ndistrictcode"], "label": response[2].data["sdistrictname"] });
                    if (response[2].data.nutcconversation !== transactionStatus.NO) {
                        selectedRecord["ntimezonecode"] = timezone[0];
                        selectedRecord["ndateformatcode"] = dateFormat[0];
                    } else {
                        selectedRecord["ntimezonecode"] = undefined;
                        selectedRecord["ndateformatcode"] = undefined;
                        selectedRecord["nutcconversation"] = response[2].data.nutcconversation;
                    }
                    if(response[2].data.nisdistributed !== transactionStatus.NO){
                        selectedRecord["nregioncode"] = region[0].label!=='NA'?region[0]:undefined;
                        selectedRecord["ndistrictcode"] = district[0].label!=='NA'?district[0]:undefined;
                    }
                    else {
                        selectedRecord["nregioncode"] = undefined;
                        selectedRecord["ndistrictcode"] = undefined;
                        selectedRecord["ssitecode"] = "";
                    }
                    
                }
                // else {
                //     selectedRecord = {
                //         ntimezonecode: {
                //             "label": siteParam.userInfo.stimezoneid,
                //             "value": siteParam.userInfo.ntimezonecode
                //         }
                //     };
                // }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        TimeZoneList, isOpen: true,
                        selectedRecord: siteParam.operation === "update" ? selectedRecord : { "ntransactionstatus": 1 },
                        operation: siteParam.operation, screenName: siteParam.screenName, selectedRecord,
                        openModal: true,
                        ncontrolCode: siteParam.ncontrolCode,
                        loading: false, selectedId, dateFormatList, regionList, districtList
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function getDistrictByRegion(methodParam) {
    return function (dispatch) {
        let URL = [];
        URL = rsapi.post("/site/getDistrict", { "userinfo": methodParam.inputData.userinfo, "nregioncode": methodParam.inputData.primarykey })
        dispatch(initRequest(true));
        Axios.all([URL])
            .then(response => {
                const districtMap = constructOptionList(response[0].data['districtList'] || [], "ndistrictcode",
                    "sdistrictname", undefined, undefined, false);

                const districtList = districtMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload:
                        { districtList, loading: false, data: undefined, dataState: undefined }
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
