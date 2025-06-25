import { DEFAULT_RETURN, UPDATE_LANGUAGE, REQUEST_INIT } from './LoginTypes';
import rsapi from "../rsapi";
import { intl, createIntlReinitilize } from '../components/App';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { constructjsonOptionList, constructOptionList, formatInputDate, rearrangeDateFormat } from '../components/CommonScript';
import { getHomeDashBoard } from './DashBoardTypeAction';
import { getListStaticDashBoard } from './StaticDashBoardAction';
import { getListAlert } from './AlertViewAction'
import { getRandomColor } from '../components/header/headerutils';
import { loadMessages } from '@progress/kendo-react-intl';
import messages_ru from '../assets/translations/ru.json';
import messages_tg from '../assets/translations/tg.json';
import messages_en from '../assets/translations/en.json';
import messages_ko from '../assets/translations/ko.json';
import messages_fr from '../assets/translations/fr.json';
import { PostgreSQLMaintenance, transactionStatus } from '../components/Enumeration';
import { callService } from './ServiceAction';
import ConfirmMessage from '../components/confirm-alert/confirm-message.component';
import { loadCaptchaEnginge } from 'react-simple-captcha';


const messages = {
    'en-US': messages_en,
    'ru-RU': messages_ru,
    'tg-TG': messages_tg,
    //ALPD-5196 ADDed by Neeraj -All masters screens > Filter is in multi Language
    'ko-KR': messages_ko,
    'fr-FR': messages_fr
}


export const initRequest = (loading) => {
    return {
        type: REQUEST_INIT,
        payload: loading
    }
}

export const navPage = (data) => dispatch => {
    dispatch({
        type: DEFAULT_RETURN,
        payload: {
            navigation: data,
            nusermultirolecode: undefined,
            nusersitecode: undefined,
            selectedRecord: undefined,
            loginFlag: false    //  ALPD-5704   Added loginFlag to handle url login issue by Vishakh (09-04-2025)
        }
    });
}

export const changeLanguage = (language, selectedRecord, loginType) => (dispatch) => {
    const loginTypeMap = constructjsonOptionList(loginType || [], "nlogintypecode",
        "sdisplayname", false, false, true, undefined, 'jsondata', true, language);
    createIntlReinitilize(language);  //ALPD-715 Fix
    dispatch({
        type: UPDATE_LANGUAGE,
        payload: {
            language,
            // selectedRecord,
            loginTypeList: loginTypeMap.get("OptionList"),
            selectedRecord: {
                ...selectedRecord,
                // ALPD-3839
                nlogintypecode: loginTypeMap.get("OptionList").find(item => item.value === selectedRecord.nlogintypecode.value) || ""
                // nlogintypecode: loginTypeMap.get("DefaultValue") ? loginTypeMap.get("DefaultValue") : ""
            }
        }
    })
}

export const clickOnLoginButton = (inputData, languageList) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post(inputData.url, inputData)
            .then(response => {
                const returnStr = response.data["rtn"];
                if (returnStr.toUpperCase() === "SUCCESS") {
                    const responseData = response.data;
                    const PassFlag = responseData.PassFlag;
                    //ALPD-4789 L.Subashini cleared warnings
                    languageList &&
                        languageList.map(x => {
                            return loadMessages(messages[inputData.slanguagetypecode], inputData.slanguagetypecode);
                        })
                    createIntlReinitilize(inputData.slanguagetypecode);
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            openCPModal: response.data.PassFlag === transactionStatus.UNLOCK || PassFlag === transactionStatus.EXPIRED ? true : false,
                            passwordPolicy: response.data.PasswordPolicy,
                            screenName: PassFlag === transactionStatus.UNLOCK ? "IDS_CREATEPASSWORD" : PassFlag === transactionStatus.EXPIRED ? "IDS_CHANGEPASSWORD" : "",
                            PassFlag,
                            userInfo: response.data.UserInfo,
                            // userInfo: {
                            //     nlogintypecode: inputData.nlogintypecode
                            // }
                            loginFlag: true //  ALPD-5704   Added loginFlag to handle url login issue by Vishakh (09-04-2025)
                        }
                    });
                    if (responseData.PassFlag !== transactionStatus.UNLOCK && responseData.PassFlag !== transactionStatus.EXPIRED) {
                        const inputParam = {
                            userInfo: responseData.UserInfo,
                            menuDesign: responseData.MenuDesign,
                            HomeDesign: responseData.HomeDesign,
                            navigation: (responseData.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].shomename,
                            defaultMenuHome: (responseData.HomeDesign.filter(x => x.ndefaultstatus === 3))[0],
                            userRoleControlRights: responseData.UserRoleControlRights,
                            userFormControlProperties: responseData.UserFormControlproperties,
                            transactionValidation: responseData.TransactionValidation,
                            displayName: (responseData.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].sdisplayname,
                            userMultiRole: responseData.UserMultiRole,
                            settings: responseData.Settings,
                            reportSettings: responseData.ReportSettings,
                            integrationSettings: responseData.IntegrationSettings,
                            elnUserInfo: responseData.ELNUserInfo,
                            elnSite: responseData.ELNSite,
                            genericLabel: responseData.GenericLabel,
                            genericLabelIDS: responseData.GenericLabelIDS,
                            sdmselnsettings: responseData.SDMSELNSettings,
                            hideQualisForms: responseData.HideQualisForms,
                            filterOperator: responseData.FilterOperator,
                            deputyUser: response.data.DeputyUser,
                            deputyUserRole: response.data.DeputyUserRole,
                            isDeputyLogin: false,
                            loading: false,
                            userImagePath: responseData.UserImagePath,
                            //profileColor: "#002699",
                            profileColor: responseData.UserImagePath === "" ? getRandomColor([240, 360], [90, 100], [0, 95], [1, 1]) : "#ff0000",
                            idleneed: true,
                            colortheme: responseData.colortheme,
                            selectedUserUiConfig: responseData.selectedUserUiConfig
                        }
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: inputParam
                        });

                        if (inputParam.navigation === 'dashboard') {
                            dispatch(getListStaticDashBoard(responseData.UserInfo));
                        } else if (inputParam.navigation === 'apiservice') {
                            const inputParam1 = {
                                inputData: { currentdate: formatInputDate(new Date(), true), "userinfo": inputParam.userInfo },
                                serviceNeed: true, classUrl: inputParam.navigation, methodUrl: (responseData.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].smethodurl
                            };
                            dispatch(callService(inputParam1));
                        }

                        dispatch(getListAlert(responseData.UserInfo, true));
                        if (responseData.PasswordAlertDay) {
                            toast.info(intl.formatMessage({
                                id: "IDS_PASSWORDEXPIRY"
                            }) + " " + responseData.PasswordAlertDay + " " + intl.formatMessage({
                                id: "IDS_DAYS"
                            }))
                        }
                    }
                } else {
                    toast.warn(intl.formatMessage({
                        id: returnStr
                    }));
                }
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response && error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else if (error.response === undefined) {
                    toast.warn("Service not available");
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const submitChangeRole = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getuserscreenrightsmenu", inputParam)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        userInfo: response.data.UserInfo,
                        menuDesign: response.data.MenuDesign,
                        navigation: (response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].shomename,
                        defaultMenuHome: (response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0],
                        userRoleControlRights: response.data.UserRoleControlRights,
                        userMultiRole: response.data.UserMultiRole,
                        deputyUser: response.data.DeputyUser,
                        deputyUserRole: response.data.DeputyUserRole,
                        loading: false,
                        masterData: [],
                        displayName: (response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].sdisplayname,
                        // navigation: "home",
                        inputParam: {},
                        openRoleBox: false
                    }
                });
                if ((response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].shomename === 'dashboard') {
                    dispatch(getListStaticDashBoard(response.data.UserInfo, 1));
                } else if (inputParam.navigation === 'apiservice') {
                    const inputParam1 = {
                        inputData: { currentdate: formatInputDate(new Date(), true), "userinfo": response.data.UserInfo },
                        serviceNeed: true, classUrl: (response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].shomename, methodUrl: (response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].smethodurl
                    };
                    dispatch(callService(inputParam1));
                }

                // dispatch(getHomeDashBoard(response.data.UserInfo, 0, false));
                dispatch(getListAlert(response.data.UserInfo));
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const updateStore = (updateInfo) => dispatch => {
    //ALPD-3511 added loadEsignStateHandle key to handle EsignStateHandle component
    if (updateInfo.data.loadEsign === true || updateInfo.data.loadEsignStateHandle) {

        const currentTimeUrl = rsapi.post("/timezone/getLocalTimeByZone", {
            "userinfo": updateInfo.data.screenData.inputParam.inputData.userinfo
        });
        const reasonUrl = rsapi.post("/reason/getReason", {
            "userinfo": updateInfo.data.screenData.inputParam.inputData.userinfo
        });
        dispatch(initRequest(true));
        Axios.all([currentTimeUrl, reasonUrl])
            .then(response => {

                const reasonMap = constructOptionList(response[1].data || [], "nreasoncode",
                    "sreason", undefined, undefined, false);
                const reasonList = reasonMap.get("OptionList");

                dispatch({
                    type: updateInfo.typeName,
                    payload: {
                        serverTime: rearrangeDateFormat(updateInfo.data.screenData.inputParam.inputData.userinfo, response[0].data),
                        esignReasonList: reasonList,
                        ...updateInfo.data,
                        masterStatus: "",
                        errorCode: undefined,
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
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    } else {
        dispatch({
            type: updateInfo.typeName,
            payload: {
                ...updateInfo.data,
                masterStatus: "",
                errorCode: undefined
            }
        });
    }
}

export const getChangeUserRole = (userInfo) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getchangerole", {
            "userinfo": userInfo
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ...response.data,
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
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

//commend by gowtham 
// export const getLoginDetails = () => {
//     return (dispatch) => {
//         dispatch(initRequest(true));
//         rsapi.post("/login/getloginInfo", {})
//             .then(response => {
//                 // let loginType = [];
//                 // response.data.LoginType.map(type => {
//                 //     loginType
//                 // })
//                 const languageMap = constructOptionList(response.data.Language || [], "slanguagetypecode", "slanguagename", false, false, true);
//                 let defaultLanguage = languageMap.get("DefaultValue") ? languageMap.get("DefaultValue") : undefined;
//                 let languageCode = defaultLanguage ? defaultLanguage.value : "en-US";
//                 const loginTypeMap = constructjsonOptionList(response.data.LoginType || [], "nlogintypecode", "sdisplayname", false, false, true, undefined, 'jsondata', true, languageCode);

//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         loginTypes: response.data.LoginType,
//                         loginTypeList: loginTypeMap.get("OptionList"),
//                         languageList: languageMap.get("OptionList"),
//                         nlanguagecode: defaultLanguage || "",
//                         selectedRecord: {
//                             nlogintypecode: loginTypeMap.get("DefaultValue") ? loginTypeMap.get("DefaultValue") : "",
//                             nlanguagecode: defaultLanguage || ""
//                         },
//                         language: defaultLanguage.value,
//                         loading: false
//                     }
//                 });
//             })
//             .catch(error => {
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         loading: false
//                     }
//                 });
//                 if (error.response && error.response.status === 500) {
//                     toast.error(intl.formatMessage({
//                         id: error.message
//                     }));
//                 } else if (error.response === undefined) {
//                     toast.warn("Service not available");
//                 } else {
//                     toast.warn(intl.formatMessage({
//                         id: error.response.data
//                     }));
//                 }
//             });
//     }
// }

export const getLoginDetails = () => {
    return (dispatch) => {
        dispatch(initRequest(true));

        // Gowtham R -- ALPD-5190 -- 14/12/2024 -- for Vacuum Start
        rsapi.post("/login/getJavaTime")
        .then(response => {
            const maintenanceBreakPopUp = (breakTime) => {
                const confirmMessage = new ConfirmMessage();
                confirmMessage.confirm(
                    "MaintainceBreakMessage",
                        intl.formatMessage({
                            id: "IDS_MAINTAINCEBREAK"
                        }),
                        intl.formatMessage({
                            id: "IDS_MAINTAINCEBREAKMESSAGE"
                        }),
                        undefined,
                        undefined,
                        undefined,
                        false,
                        undefined,
                        breakTime
                    );
                }
                let MaintenanceBreak = 0;
                if (PostgreSQLMaintenance.STARTHOUR > PostgreSQLMaintenance.ENDHOUR) {
                    const minutesLeftToday = (60 - PostgreSQLMaintenance.STARTMINUTE) + ((23 - PostgreSQLMaintenance.STARTHOUR) * 60);
                    const minutesNextDay = (PostgreSQLMaintenance.ENDHOUR * 60) + PostgreSQLMaintenance.ENDMINUTE;
                    MaintenanceBreak = minutesLeftToday + minutesNextDay;
                } else if (PostgreSQLMaintenance.STARTHOUR < PostgreSQLMaintenance.ENDHOUR) {
                    const minutesThisDay = ((PostgreSQLMaintenance.ENDHOUR - PostgreSQLMaintenance.STARTHOUR) * 60)
                        - PostgreSQLMaintenance.STARTMINUTE + PostgreSQLMaintenance.ENDMINUTE;
                        MaintenanceBreak = minutesThisDay;
                } else {
                    MaintenanceBreak = PostgreSQLMaintenance.ENDMINUTE - PostgreSQLMaintenance.STARTMINUTE;
                }                
                const date = new Date();
                date.setHours(response.data.Hours);
                date.setMinutes(response.data.Minutes);
                date.setSeconds(response.data.Seconds);
                
                const isMaintenanceTime = () => {
                    if (
                        (date.getHours() > PostgreSQLMaintenance.STARTHOUR || 
                        (date.getHours() === PostgreSQLMaintenance.STARTHOUR && date.getMinutes() >= PostgreSQLMaintenance.STARTMINUTE)) &&
                        (date.getHours() < PostgreSQLMaintenance.ENDHOUR || 
                        (date.getHours() === PostgreSQLMaintenance.ENDHOUR && date.getMinutes() < PostgreSQLMaintenance.ENDMINUTE))
                    ) {
                        MaintenanceBreak = PostgreSQLMaintenance.ENDMINUTE - date.getMinutes();
                        return true;
                    } else {
                        return false;
                    }
                };
                
                const incrementTimeByMinute = () => {
                    date.setMinutes(date.getMinutes() + 1);
                    if (date.getMinutes() === 60) {
                        date.setMinutes(0);
                        date.setHours(date.getHours() + 1);
                    }
                    if (date.getHours() === 24) {
                        date.setHours(0);
                    }
                };
                
                const maintenanceCheck = () => {
                    if (isMaintenanceTime()) {
                        maintenanceBreakPopUp(60000 * MaintenanceBreak);
                    }
                };
                
                setTimeout(() => {
                    incrementTimeByMinute();
                    maintenanceCheck();
                    
                    setInterval(() => {
                        incrementTimeByMinute();
                        maintenanceCheck();
                    }, 60000);
                    
                }, (60 - (date.getSeconds() + 1)) * 1000);
                
                if (isMaintenanceTime()) {
                    maintenanceBreakPopUp(60000 * MaintenanceBreak);
                }else{
                    // for Vacuum End
                    
                    rsapi.post("/login/getloginInfo", {})
                        .then(response => {
            
                            const languageMap = constructOptionList(response.data.Language || [], "slanguagetypecode", "slanguagename", false, false, true);
                            let defaultLanguage = languageMap.get("DefaultValue") ? languageMap.get("DefaultValue") : undefined;
                            let languageCode = defaultLanguage ? defaultLanguage.value : "en-US";
                            const loginTypeMap = constructjsonOptionList(response.data.LoginType || [], "nlogintypecode", "sdisplayname", false, false, true, undefined, 'jsondata', true, languageCode);

                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    loginTypes: response.data.LoginType,
                                    loginTypeList: loginTypeMap.get("OptionList"),
                                    languageList: languageMap.get("OptionList"),
                                    nlanguagecode: defaultLanguage || "",
                                    selectedRecord: {
                                        nlogintypecode: loginTypeMap.get("DefaultValue") ? loginTypeMap.get("DefaultValue") : "",
                                        nlanguagecode: defaultLanguage || ""
                                    },
                                    language: defaultLanguage.value,
                                    captchaNeeded:response.data.settingKey && response.data.settingKey.ssettingvalue, //Added for sonia on 16th June 2025 for jira id:ALPD-6028 (Captcha Validation)
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
                            if (error.response && error.response.status === 500) {
                                toast.error(intl.formatMessage({
                                    id: error.message
                                }));
                            } else if (error.response === undefined) {
                                toast.warn("Service not available");
                            } else {
                                toast.warn(intl.formatMessage({
                                    id: error.response.data
                                }));
                            }
                        });
                }
                
            });
        }
}

export const getUserSiteAndRole = (inputParam, selectedRecord) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getloginvalidation", {
            ...inputParam
        })
            .then(response => {
                if (inputParam.Language !== undefined && inputParam.logintype !== undefined) {
                    //Start	ALPD-4393 17/06/2024 Abdul Gaffoor.A To validate ads password of login User and to get ads user details and update it
                    if (response.data && response.data.NewAdsUser && response.data.NewAdsUser === "true") {
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                openADSModal: true,
                                userInfo: {
                                    nlogintypecode: inputParam.nlogintypecode || selectedRecord.nlogintypecode && selectedRecord.nlogintypecode.value,
                                },
                                screenName: "IDS_NEWADSUSERVALIDATION",
                                loading: false,
                                createPwdRecord: {},
                            }
                        });
                    }
                    //End	ALPD-4393 17/06/2024 Abdul Gaffoor.A To validate ads password of login User and to get ads user details and update it
                    else {
                        const roleMap = constructOptionList(response.data.UserMultiRole || [], "nusermultirolecode", "suserrolename", false, false, true, "ndefaultrole");
                        const siteMap = constructOptionList(response.data.Site || [], "nusersitecode", "ssitename", false, false, true, "ndefaultsite");
                        let loggeInLoginTypeCode = response.data.Users.nlogintypecode;
                        let logintypecode = inputParam.logintype.filter(x => x.value === loggeInLoginTypeCode);
                        if (inputParam.logintype.length > 0 && logintypecode.length === 0) {
                            logintypecode = inputParam.logintype;
                            loggeInLoginTypeCode = logintypecode[0].value;
                        }
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loginUserRole: roleMap.get("OptionList"),
                                loginUserSite: siteMap.get("OptionList"),
                                nusermultirolecode: roleMap.get("DefaultValue") ?
                                    roleMap.get("DefaultValue") : roleMap.get("OptionList") ? roleMap.get("OptionList")[0] : "",

                                nusersitecode: siteMap.get("DefaultValue") ?
                                    siteMap.get("DefaultValue") : siteMap.get("OptionList") ? siteMap.get("OptionList")[0] : "",

                                nusercode: response.data.Users.nusercode,
                                nlogintypecode: logintypecode ? logintypecode[0] : "",

                                selectedRecord: {
                                    ...selectedRecord,
                                    nusermultirolecode: roleMap.get("DefaultValue") ?
                                        roleMap.get("DefaultValue") : roleMap.get("OptionList") ? roleMap.get("OptionList")[0] : "",
                                    nusersitecode: siteMap.get("DefaultValue") ?
                                        siteMap.get("DefaultValue") : siteMap.get("OptionList") ? siteMap.get("OptionList")[0] : "",
                                    nusercode: response.data.Users.nusercode,
                                    nlogintypecode: logintypecode ? logintypecode[0] : ""
                                },

                                openCPModal: response.data.PassFlag === 6 ? true : false,
                                passwordPolicy: response.data.PasswordPolicy,
                                screenName: "IDS_CREATEPASSWORD",
                                loading: false,
                                PassFlag: response.data.PassFlag,
                                createPwdRecord: {},
                                userInfo: {
                                    nlogintypecode: loggeInLoginTypeCode
                                }
                            }


                        });
                    }
                } else {
                    toast.warn(inputParam.Language === undefined ? "Language not available" : "Login type not available");
                }
            }
            )
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        loginUserRole: [],
                        loginUserSite: [],
                        selectedRecord: {
                            ...selectedRecord,
                            nusermultirolecode: "",
                            nusersitecode: ""
                        }
                    }
                });
                if (error.response && error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else if (error.response === undefined) {
                    toast.warn("Service not available");
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }


            });


    }
}

export const createPassword = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/createnewpassword", {
            ...inputParam
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openCPModal: false,
                        loading: false,
                        createPwdRecord: {}
                    }
                });
                toast.success(intl.formatMessage({
                    id: "IDS_PASSWORDCREATEDSUCCESSFULLY"
                }));
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

//Start ALPD-4393 17/06/2024 Abdul Gaffoor.A To validate ads password of login User and to get ads user details and update it
export const validateADSPassword = (inputParam) => {
    let selectedRecord = inputParam.selectedRecord || {};
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/validateadspassword", {
            ...inputParam
        })
            .then(response => {

                if (inputParam.slanguagefilename !== undefined) {

                    const roleMap = constructOptionList((response.data && response.data.UserMultiRole) || [], "nusermultirolecode", "suserrolename", false, false, true, "ndefaultrole");
                    const siteMap = constructOptionList((response.data && response.data.Site) || [], "nusersitecode", "ssitename", false, false, true, "ndefaultsite");
                    // let loggeInLoginTypeCode = response.data.Users.nlogintypecode;
                    // let logintypecode = inputParam.logintype.filter(x => x.value === loggeInLoginTypeCode);
                    // if (inputParam.logintype.length > 0 && logintypecode.length === 0) {
                    //     logintypecode = inputParam.logintype;
                    //     loggeInLoginTypeCode = logintypecode[0].value;
                    // }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loginUserRole: roleMap.get("OptionList"),
                            loginUserSite: siteMap.get("OptionList"),
                            nusermultirolecode: roleMap.get("DefaultValue") ?
                                roleMap.get("DefaultValue") : roleMap.get("OptionList") ? roleMap.get("OptionList")[0] : "",

                            nusersitecode: siteMap.get("DefaultValue") ?
                                siteMap.get("DefaultValue") : siteMap.get("OptionList") ? siteMap.get("OptionList")[0] : "",

                            nusercode: response.data.Users.nusercode,
                            nlogintypecode: inputParam.nlogintypecode,

                            selectedRecord: {
                                ...selectedRecord,
                                nusermultirolecode: roleMap.get("DefaultValue") ?
                                    roleMap.get("DefaultValue") : roleMap.get("OptionList") ? roleMap.get("OptionList")[0] : "",
                                nusersitecode: siteMap.get("DefaultValue") ?
                                    siteMap.get("DefaultValue") : siteMap.get("OptionList") ? siteMap.get("OptionList")[0] : "",
                                nusercode: response.data.Users.nusercode,
                                //nlogintypecode: ...inputParam.nlogintypecode || ""
                            },

                            openADSModal: false,
                            passwordPolicy: response.data.PasswordPolicy,
                            // screenName: "IDS_CREATEPASSWORD",
                            loading: false,
                            // PassFlag: response.data.PassFlag,
                            createPwdRecord: {},
                            userInfo: {
                                nlogintypecode: inputParam.nlogintypecode
                            }
                        }


                    });

                } else {
                    toast.warn("Language not available");
                }
            }
            )
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        loginUserRole: [],
                        loginUserSite: [],
                        selectedRecord: {
                            ...selectedRecord,
                            nusermultirolecode: "",
                            nusersitecode: ""
                        }
                    }
                });
                if (error.response && error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else if (error.response === undefined) {
                    toast.warn("Service not available");
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }


            });
    }
}
//End	ALPD-4393 17/06/2024 Abdul Gaffoor.A To validate ads password of login User and to get ads user details and update it

export const changepassword = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/changepassword", {
            ...inputParam
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openCPModal: false,
                        loading: false,
                        createPwdRecord: {},
                        navigation: "login"
                    }
                });
                toast.success(intl.formatMessage({
                    id: "IDS_PASSWORDCHANGEDSUCCESSFULLY"
                }));
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export function validateEsignforDigitalSignature(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi.post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data === "Success") {

                    const methodUrl = "performaction"
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                    }
                    dispatch(saveDigitalSign(inputParam["screenData"]["inputParam"]))
                }
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
    };
}

export const saveDigitalSign = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        const formData = inputParam.formData;
        formData.append("userinfo", JSON.stringify(inputParam.inputData.userinfo));
        rsapi.post("/digitalsignature/updateDigitalSignature", formData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openCPModal: false,
                        loading: false,
                        loadEsign: false
                    }
                });
                toast.success(intl.formatMessage({
                    id: "IDS_DIGITALSIGNATURESAVEDSUCCESSFULLY"
                }));
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const getPassWordPolicy = (nuserrolecode) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getPassWordPolicy", {
            nuserrolecode
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openCPModal: true,
                        loading: false,
                        createPwdRecord: {},
                        screenName: "IDS_CHANGEPASSWORD",
                        passwordPolicy: response.data.PasswordPolicy
                    }
                })
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const getDigitalSign = (nusercode, userInfo) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/digitalsignature/getDigitalSignature", {
            nusercode: nusercode, userInfo: userInfo
        })
            .then(response => {
                let responseData = response.data;
                let selectedDigiSign = responseData !== "" ? responseData : {}
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openCPModal: true,
                        loading: false,
                        screenName: "IDS_DIGITALSIGNATURE",
                        operation: "update",
                        selectedDigiSign,
                        isInitialRender: true
                    }
                })
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const changeOwner = (inputData) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/changeOwner", {
            ...inputData
        })
            .then(response => {
                const responseData = response.data;
                const inputParam = {
                    userInfo: responseData.UserInfo,
                    menuDesign: responseData.MenuDesign,
                    userRoleControlRights: responseData.UserRoleControlRights,
                    userFormControlProperties: responseData.UserFormControlproperties,
                    transactionValidation: responseData.TransactionValidation,
                    //displayName: "",
                    userMultiRole: responseData.UserMultiRole,
                    isDeputyLogin: true,
                    // settings: responseData.Settings,
                    //deputyUser: responseData.DeputyUser,
                    // deputyUserRole: responseData.DeputyUserRole,
                    loading: false,
                    masterData: [],
                    //navigation: "home",
                    navigation: (response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].shomename,
                    defaultMenuHome: (response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0],
                    inputParam: {},
                    displayName: (response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].sdisplayname,
                    openRoleBox: false,
                    userImagePath: responseData.UserImagePath,
                    profileColor: responseData.UserImagePath === "" ? getRandomColor([240, 360], [90, 100], [0, 95], [1, 1]) : "#ff0000",
                    idleneed: true
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: inputParam
                });
                if ((response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].shomename === 'dashboard') {
                    dispatch(getListStaticDashBoard(response.data.UserInfo, 1));
                } else if (inputParam.navigation === 'apiservice') {
                    const inputParam1 = {
                        inputData: { currentdate: formatInputDate(new Date(), true), "userinfo": response.data.UserInfo },
                        serviceNeed: true, classUrl: (response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].shomename, methodUrl: (response.data.HomeDesign.filter(x => x.ndefaultstatus === 3))[0].smethodurl
                    };
                    dispatch(callService(inputParam1));
                }
                //dispatch(getHomeDashBoard(response.data.UserInfo, 0, false));
                dispatch(getListAlert(response.data.UserInfo));
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const logOutAuditAction = (inputData, languageList) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post('login/insertAuditAction', {
            ...inputData,
            nFlag: 2
        })
            .then(response => {
                languageList &&
                    languageList.map(x => {
                        loadMessages({}, x.slanguagetypecode);
                    })
                dispatch(navPage("login"))
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export const elnLoginAction = (inputParam, serverUrl, uiUrl) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post(serverUrl, {
            ...inputParam
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (response !== null && response.data.objResponse !== null) {
                    if (response.data.objResponse.status) {
                        if (uiUrl) {
                            let user = response;
                            let elnURL = uiUrl + "#" + user.data.username + "$" + user.data.password;
                            window.open(elnURL, '_blank');
                        } else {
                            toast.info(intl.FormattedMessage({
                                id: "IDS_ELNUIURLNOTAVAILABLE"
                            }))
                        }
                    } else {
                        toast.info(response.data.objResponse.information);
                    }
                    // if(!$("#appsdetails").is(":hidden")){
                    //     $('#appsdetails').addClass("dp-none");
                    // }
                };

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

export const sdmsLoginAction = (inputParam, serverUrl, sdmsUIUrl) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post(serverUrl, {
            ...inputParam
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (response !== null && response.data.status) {
                    if (response.data.status) {
                        const sdmsURL = sdmsUIUrl + "?un=" + response.data.username + "&pd=" + response.data.password + "&sc=" + inputParam.sSiteCode;
                        window.open(sdmsURL, '_blank');
                    } else {
                        toast.info(response.Message);
                    }
                } else {
                    toast.info(intl.FormattedMessage({
                        id: "IDS_CHECKSYNCSERVICE"
                    }));
                }
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


export const getUsersiteRole = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post('login/changeSite', {
            "usersSite": inputParam.selectedRecord.nusersitecode.item
        })
            .then(response => {
                const roleMap = constructOptionList(response.data.UserMultiRole || [], "nusermultirolecode", "suserrolename", false, false, true, "ndefaultrole");

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        loginUserRole: roleMap.get("OptionList"),
                        selectedRecord: {
                            ...inputParam.selectedRecord,
                            nusermultirolecode: roleMap.get("DefaultValue") ?
                                roleMap.get("DefaultValue") : roleMap.get("OptionList") ? roleMap.get("OptionList")[0] : ""


                        },
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

export const checkPassword = (inputParam, selectedRecord) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getlogintypevalidation", {
            ...inputParam
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord: {
                            ...selectedRecord,
                            nusercode: response.data.Users.nusercode
                        },
                        userInfo: {
                            nlogintypecode: inputParam.nlogintypecode
                        },
                        openCPModal: response.data.PassFlag === 6 ? true : false,
                        passwordPolicy: response.data.PasswordPolicy,
                        screenName: "IDS_CREATEPASSWORD",
                        loading: false,
                        PassFlag: response.data.PassFlag,
                        createPwdRecord: {}
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
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export function getDashBoardForHome(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi.post("/staticdashboard/getListStaticDashBoard", { 'userinfo': inputParam.data.userInfo })

            .then(response => {

                let respObject = { masterDataStatic: response.data, loading: false, userInfo: inputParam.data.userInfo };
                if (response.data !== null && Object.keys(response.data).length > 0) {
                    respObject = { ...inputParam.data, ...respObject, currentPageNo: -1 };
                }
                dispatch(getHomeDashBoard(inputParam.data.userInfo, 0, false, respObject));
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}


export const getcolorMaster = (userInfo) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/useruiconfig/getcolormastertheme", {
            "userinfo": userInfo
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ...response.data,
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
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export const submitUserTheme = (useruiconfig, userInfo) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/useruiconfig/createUserUiConfig", {
            "useruiconfig": useruiconfig, "userinfo": userInfo
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ...response.data,
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
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}


//ALPD-4102
export const getAboutInfo = (userinfo) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi.post("/login/getAboutInfo", {
            userinfo
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openAboutModal: true,
                        loading: false,
                        screenName: "IDS_ABOUT",
                        aboutInfo: response.data.jsondata
                    }
                })
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

