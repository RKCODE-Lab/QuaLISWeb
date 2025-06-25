import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Card, Form, Modal, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { ModalInner } from '../../components/App.styles';
import { SampleType, transactionStatus, formCode, designComponents } from '../../components/Enumeration';
import { faCalculator, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import {
    ageCalculate,
    ageCalculateOnlyForYear,
    childComboClear,
    comboChild, convertDateTimetoString,
    extractFieldHeader,
    filterRecordBasedOnTwoArrays,
    formatDate,
    formatInputDate,
    formatInputDateWithoutT,
    getSameRecordFromTwoArrays,
    rearrangeDateFormat,
    rearrangeDateFormatforUI,
    removeIndex,
    removeSpaceFromFirst,
    showEsign,
    sortByField,
    validateEmail, validatePhoneNumber, conditionBasedInput, onDropAttachFileList, deleteAttachmentDropZone, create_UUID, Lims_JSON_stringify,
    checkFilterIsEmptyQueryBuilder, convertDateTimetoStringDBFormat
} from '../../components/CommonScript';
import AddSpecification from '../../pages/registration/AddSpecification';
import AddTest from '../../pages/registration/AddTest';
import { connect } from 'react-redux';
import {
    getPreviewTemplate, getChildValues, callService,
    getNewRegSpecification, AddComponents, updateStore,
    EditComponent, getTest, addsubSample, editSubSample,
    insertRegistration, updateRegistration, addSubSampleSaveContinue,
    componentTest, getDynamicFilter, getDynamicFilterExecuteData,
    insertRegistrationScheduler, testPackageTest,
    rearrangeDateFormatforKendoDataTool, addMasterRecord, getAddMasterCombo, getDynamicMasterTempalte,
    getChildComboMaster, getChildValuesForAddMaster, viewExternalportalDetail, getEditMaster, insertMultipleRegistration,
    testSectionTest, insertSchedulerConfig, updateSchedulerConfig, getSchedulerMasteDetails, insertStbStudyPlan
} from '../../actions'
import AddComponentPopUp from '../../pages/registration/AddComponentPopUp';
import AddSubSample from '../../pages/registration/AddSubSample';
import {
    getRegistration, getRegistrationScheduler, getRegistrationSubSample, SubSample, TestListManipulation, getStabilityStudyPlan
} from '../../pages/registration/RegistrationValidation';
import {
    getSchedulerConfig
} from '../Scheduler//SchedulerValidation.jsx';

import KendoDatatoolFilter from '../contactmaster/KendoDatatoolFilter.jsx'
import FilterQueryBuilder from '../../components/FilterQueryBuilder';
import {
    Utils as QbUtils,
} from "@react-awesome-query-builder/ui";
import Esign from '../audittrail/Esign';
import PatientMaster from '../contactmaster/PatientMaster';
import { getFieldSpecification } from '../../components/type2component/Type2FieldSpecificationList';
import { getFieldSpecification as getFieldSpecification1 } from '../../components/type1component/Type1FieldSpecificationList';
import { getFieldSpecification as getFieldSpecification3 } from '../../components/type3component/Type3FieldSpecificationList';
import AddMasterRecords from '../dynamicpreregdesign/AddMasterRecords'
import ExternalOrderSlideout from '../dynamicpreregdesign/ExternalOrderSlideout';
import AddImportFileData from '../../pages/registration/AddImportFileData';
import AddImportSampleCountData from '../../pages/registration/AddImportSampleCountData';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { LocalizationProvider } from '@progress/kendo-react-intl';
import { checkBoxOperation } from '../../components/Enumeration';
import rsapi from '../../rsapi.js';
import Axios from 'axios';
import StbRegSlideOut from './StbRegSlideOut.jsx';
import { addStbTimePoint, insertExportStbStudyPlan } from '../../actions/StabilityStudyPlanAction'


const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
class StbPreRegSlideOutModal extends React.Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef()
        this.PrevoiusLoginData = this.props.PrevoiusLoginData;
        this.subSampleDataGridList = [];
        this.componentColumnList = [
            { "idsName": "IDS_COMPONENT", "dataField": "scomponentname", width: "200px" },
            { "idsName": "IDS_DATERECEIVED", "dataField": "sreceiveddate", width: "250px" },
            { "idsName": "IDS_COMMENTS", "dataField": "scomments", width: "200px" },
        ];
        this.sampleeditable = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)

    }
    formRef = React.createRef();
    state = {
        failedControls: [],
        testDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
        subSampleDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
        selectedRecord: {},
        selectedSpec: {},
        selectComponent: {},
        selectedTest: {},
        selectedTestData: {},
        selectedTestPackageData: {},
        selectPackage: {},
        selectSection: {},
        SubSamplecomboComponents: [],
        SubSamplewithoutCombocomponent: [],
        // selectedTestData: [],
        parentSubSampleColumnList: [],
        specBasedComponent: false,
        specBasedTestPackage: false,
        selectedMaster: [],
        exportFiled: []
    }


    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.info(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        return null;
    }

    custombuttonclick = (event, component) => {
        event.preventDefault();
        event.stopPropagation();
        const inputparam = {
            component, userinfo: this.props.Login.userInfo,
        }
        this.props.getDynamicFilter(inputparam)
    }
    onChangeAwesomeQueryBuilder = (immutableTree, config) => {
        //let selectedRecord = this.state.selectedRecord || {};
        const filterquery = QbUtils.sqlFormat(immutableTree, config);
        const filterQueryTreeStr = QbUtils.getTree(immutableTree);

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                awesomeTree: immutableTree, awesomeConfig: config, filterquery, filterQueryTreeStr
            }
        }
        this.props.updateStore(updateInfo)

        // this.setState({ awesomeTree: immutableTree, awesomeConfig: config, selectedRecord: selectedRecord });

    };

    handlePageChange = (event) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                kendoSkip: event.skip, kendoTake: event.take
            }
        }
        this.props.updateStore(updateInfo)
        //this.setState({ kendoSkip: event.skip, kendoTake: event.take });
    };
    handleFilterChange = (event) => {
        // event.preventDefault();
        //event.stopPropagation();
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                kendoFilter: event.filter
                // screenName: this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename
            }
        }
        this.props.updateStore(updateInfo)
        // this.setState({ kendoFilter: event.filter });
    };


    // searchClickedItemParent(treeData) {
    //     let ParentItem = { ...treeData };
    //     let isFilterEmpty=true;
    //         let childArray = ParentItem.children1;
    //         if (childArray && childArray.length > 0 && childArray !== undefined) {
    //             for (var i = 0; i < childArray.length; i++) {
    //                 let childData = childArray[i]
    //                 if (!childData.hasOwnProperty('children1')) {
    //                     if( childData.properties.field !== null && childData.properties.operator!=="is_empty"
    //                       && childData.properties.operator!=="is_not_empty"
    //                       && childData.properties.operator!=="is_null"
    //                       && childData.properties.operator!=="is_not_null" ){
    //                         if( childData.properties.field !== null && (childData.properties.operator==="not_equal"||childData.properties.operator==="equal") &&
    //                         childData.properties.valueSrc[0]==='func'){
    //                        isFilterEmpty= childData.properties.value[0] && childData.properties.value[0].args.str && childData.properties.value[0].args.str.value!=="" && 
    //                        childData.properties.value[0] && childData.properties.value[0].args.str && childData.properties.value[0].args.str.value!==undefined ? true:false;
    //                         }else{
    //                         isFilterEmpty= (childData.properties.value[0]!=="" && childData.properties.value[0]!==undefined)? true:false;
    //                         }
    //                         if(!isFilterEmpty){
    //                         return isFilterEmpty;
    //                     }
    //                 }
    //                 } else {
    //                     if (childData) {
    //                         ParentItem = this.searchClickedItemParent(childData)
    //                         if(!ParentItem){
    //                             return ParentItem;
    //                         }
    //                     } 
    //                 }
    //             }
    //         }
    //         return isFilterEmpty;
    // }

    handleExecuteClick = (event) => {
        const filterquery = this.props.Login.filterquery
        const filterQueryTreeStr = this.props.Login.filterQueryTreeStr;
        let isFilterEmpty = checkFilterIsEmptyQueryBuilder(filterQueryTreeStr);
        if (filterquery !== "" && filterquery !== undefined
            && !filterquery.includes('Invalid date') && isFilterEmpty) {
            const val = removeSpaceFromFirst(filterquery, '')
            const inputparam = {
                component: this.props.Login.seletedFilterComponent,
                userinfo: this.props.Login.userInfo,
                filterquery: val
            }
            this.props.getDynamicFilterExecuteData(inputparam)
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_PROVIDEVALUESFORINPUTS" }));
        }
    }

    handleKendoRowClick = (event) => {
        let item1 = event.dataItem;
        const component = this.props.Login.seletedFilterComponent

        if (component["childFields"]) {
            const index = this.props.Login.masterIndex;
            let selectedRecord = this.state.selectedMaster || {};

            component["childFields"].map(item => {
                let data = item1[item.columnname];
                if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
                    //combocontrol
                    data = { label: item1[item.sdisplaymember], value: item1[item.svaluemember] };
                }
                else if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
                    //Date picker control
                    data = rearrangeDateFormatforKendoDataTool(this.props.Login.userInfo, data);
                }
                selectedRecord[index][item.columnname] = data;
            })


            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    selectedMaster: selectedRecord, loadCustomSearchFilter: false,
                    screenName: this.props.Login.addMaster === true
                        ? this.props.Login.selectedControl[this.props.Login.masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]
                        : this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename,
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            const newdata = {
                label: item1[component['displaymember']],
                value: item1[component['valuemember']], item: { jsondata: { ...item1, jsondata: { ...item1 } } }
            }


            this.onComboChange(newdata, component, component['label'])
        }
    };

    // handleKendoRowClick = (event) => {
    //     let selecteddata = event.dataItem;
    //     const component = this.props.Login.seletedFilterComponent
    //     if (component.hasOwnProperty("child")) {
    //         if (this.props.Login.loadSubSample) {
    //             const selectComponent = this.state.selectComponent;
    //             component.child.map(y => {
    //                 const withoutCombocomponent = this.state.SubSamplewithoutCombocomponent;
    //                 const readonlyfields = withoutCombocomponent.findIndex(k => k.label === y.label);
    //                 // if (readonlyfields !== -1) {

    //                 //     if (withoutCombocomponent[readonlyfields]["isMultiLingual"]) {
    //                 //         selectComponent[y.label] = selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] ?
    //                 //             selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]][this.props.Login.userInfo.languagetypeCode] : ""
    //                 //     } else {
    //                 //         selectComponent[y.label] = selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] ? selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] : ""
    //                 //     }
    //                 // }

    //                 if (readonlyfields !== -1) {

    //                     if (withoutCombocomponent[readonlyfields]['inputtype'] === "date") {
    //                         selectComponent[y.label] = selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] ?
    //                             rearrangeDateFormatforKendoDataTool(this.props.Login.userInfo, selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]]) : ""
    //                         selectComponent[y.label + 'value'] = selectComponent[y.label]

    //                         if (withoutCombocomponent[readonlyfields].child) {
    //                             const Age = withoutCombocomponent.filter(x => x.name === 'Age');
    //                             withoutCombocomponent[readonlyfields].child.map(k => {
    //                                 if (k.label === Age[0].label) {
    //                                     const age = ageCalculate(selectComponent[y.label]);

    //                                     selectComponent[Age[0].label] = age
    //                                 }
    //                             })


    //                         }

    //                     } else {
    //                         if (withoutCombocomponent[readonlyfields]["isMultiLingual"]) {
    //                             selectComponent[y.label] = selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] ?
    //                                 selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]][this.props.Login.userInfo.languagetypeCode] ?
    //                                     selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]][this.props.Login.userInfo.languagetypeCode] : selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] : ""
    //                         } else {
    //                             selectComponent[y.label] = selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] ? selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] : ""
    //                         }
    //                     }


    //                 } else {
    //                     const comboComponents = this.state.SubSamplecomboComponents;
    //                     const readonlyfields = comboComponents.findIndex(k => k.label === y.label);
    //                     if (readonlyfields !== -1) {
    //                         if (this.props.Login.comboData[y.label]) {

    //                             const val = this.props.Login.SubSamplecomboData[y.label].filter(item => item.value === selecteddata[y.foriegntablePK])
    //                             if (val.length > 0)
    //                                 selectComponent[y.label] = val[0]

    //                             //selectComponent[y.label] = this.props.Login.comboData[y.label].filter(item => item.value === selecteddata[y.foriegntablePK])
    //                         }

    //                     }

    //                 }

    //             })
    //             const updateInfo = {
    //                 typeName: DEFAULT_RETURN,
    //                 data: {
    //                     selectComponent,
    //                     loadCustomSearchFilter: false,
    //                     screenName: "SubSample",
    //                 }
    //             }
    //             this.props.updateStore(updateInfo)
    //         } else {
    //             const selectedRecord = this.state.selectedRecord;
    //             component.child.map(y => {
    //                 // component.filterfields.filter(x=>x.)
    //                 const withoutCombocomponent = this.props.withoutCombocomponent;
    //                 const readonlyfields = withoutCombocomponent.findIndex(k => k.label === y.label);
    //                 if (readonlyfields !== -1) {
    //                     if (withoutCombocomponent[readonlyfields]['inputtype'] === "date") {
    //                         selectedRecord[y.label] = selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] ?
    //                             rearrangeDateFormatforKendoDataTool(this.props.Login.userInfo, selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]]) : ""
    //                         selectedRecord[y.label + 'value'] = selectedRecord[y.label]

    //                         if (withoutCombocomponent[readonlyfields].child) {
    //                             const Age = withoutCombocomponent.filter(x => x.name === 'Age');
    //                             withoutCombocomponent[readonlyfields].child.map(k => {
    //                                 if (k.label === Age[0].label) {
    //                                     const age = ageCalculate(selectedRecord[y.label]);

    //                                     selectedRecord[Age[0].label] = age
    //                                 }
    //                             })


    //                         }

    //                     }
    //                     else if (withoutCombocomponent[readonlyfields]["isMultiLingual"]) {
    //                         selectedRecord[y.label] = selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] ?
    //                             selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]][this.props.Login.userInfo.languagetypeCode] ?
    //                                 selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]][this.props.Login.userInfo.languagetypeCode] : selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] : ""
    //                     } else {
    //                         selectedRecord[y.label] = selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] ? selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] : ""
    //                     }
    //                 } else {
    //                     const comboComponents = this.props.comboComponents || [];
    //                     const readonlyfields = comboComponents.findIndex(k => k.label === y.label);
    //                     if (readonlyfields !== -1) {
    //                         if (this.props.Login.comboData[y.label]) {
    //                             const val = this.props.Login.comboData[y.label].filter(item => item.value === selecteddata[y.foriegntablePK])
    //                             if (val.length > 0)
    //                                 selectedRecord[y.label] = val[0]
    //                         }

    //                     }

    //                 }

    //             })
    //             const updateInfo = {
    //                 typeName: DEFAULT_RETURN,
    //                 data: {
    //                     selectedRecord,
    //                     loadCustomSearchFilter: false,
    //                     screenName: this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename
    //                 }
    //             }
    //             this.props.updateStore(updateInfo)
    //         }
    //     }
    // };

    handleSaveClick = (saveType) => {
        const failedControls = [];
        const startLabel = [];
        let label = "IDS_ENTER";
        let mandatoryFields = [];
        let selectedRecord = this.state.selectedRecord;
        // console.log("handle save:", selectedRecord);

        if (this.props.Login.addMaster) {
            const masterIndex = this.props.Login.masterIndex
            mandatoryFields = this.props.Login.masterextractedColumnList[masterIndex].filter(x => x.mandatory === true)
            selectedRecord = this.state.selectedMaster[masterIndex]
        }
        else if (this.props.Login.loadComponent) {
            mandatoryFields = [
                { "idsName": "IDS_COMPONENT", "dataField": "ncomponentcode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
                { "idsName": "IDS_RECEIVEDDATE", "dataField": "dreceiveddate", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
                { "idsName": "IDS_TIMEZONE", "dataField": "ntzdreceivedate", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
            ]
            selectedRecord = this.state.selectComponent
        }
        else if (this.props.Login.loadSubSample) {

            if (this.state.specBasedComponent)
                mandatoryFields = [{ "idsName": "IDS_COMPONENT", "dataField": "ncomponentcode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }]

            this.props.Login.masterData.SubSampleTemplate &&
                this.props.Login.masterData.SubSampleTemplate.jsondata.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            // console.log("component1:", component);
                            return component.hasOwnProperty("children") ?
                                component.children.map(componentrow => {
                                    //  console.log("componentrow:", componentrow);
                                    if (componentrow.mandatory === true) {
                                        if (componentrow.recordbasedshowhide) {
                                            if (this.state.selectComponent[componentrow.parentLabel]
                                                === componentrow.recordbasedhide) {
                                                if (componentrow.inputtype === "email") {
                                                    mandatoryFields.push({
                                                        "mandatory": true,
                                                        "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],//componentrow.label,
                                                        "dataField": componentrow.label,
                                                        "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                        "validateFunction": validateEmail,
                                                        "mandatoryLabel": "IDS_ENTER",
                                                        "controlType": "textbox"
                                                    })
                                                } else {
                                                    mandatoryFields.push({
                                                        "mandatory": true,
                                                        "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],//componentrow.label,
                                                        "dataField": componentrow.label,
                                                        "mandatoryLabel": componentrow.inputtype === "combo" ?
                                                            "IDS_SELECT" : "IDS_ENTER",
                                                        "controlType": componentrow.inputtype === "combo" ?
                                                            "selectbox" : "textbox"
                                                    })
                                                }
                                            }

                                        } else {
                                            if (componentrow.inputtype === "email") {
                                                mandatoryFields.push({
                                                    "mandatory": true,
                                                    "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],//componentrow.label,
                                                    "dataField": componentrow.label,
                                                    "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                    "validateFunction": validateEmail,
                                                    "mandatoryLabel": "IDS_ENTER",
                                                    "controlType": "textbox"
                                                })
                                            } else {
                                                mandatoryFields.push({
                                                    "mandatory": true,
                                                    "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],//componentrow.label,
                                                    "dataField": componentrow.label,
                                                    "mandatoryLabel": componentrow.inputtype === "combo" ?
                                                        "IDS_SELECT" : "IDS_ENTER",
                                                    "controlType": componentrow.inputtype === "combo" ?
                                                        "selectbox" : "textbox"
                                                })
                                            }
                                        }
                                    } else {
                                        if (componentrow.inputtype === "email") {

                                            this.state.selectComponent[componentrow.label] &&
                                                this.state.selectComponent[componentrow.label] !== "" &&
                                                mandatoryFields.push({
                                                    "mandatory": true,
                                                    "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],//componentrow.label,
                                                    "dataField": componentrow.label,
                                                    "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                    "validateFunction": validateEmail,
                                                    "mandatoryLabel": "IDS_ENTER",
                                                    "controlType": "textbox"
                                                })
                                        }
                                    }
                                    return null;
                                })
                                : component.mandatory === true ?
                                    component.recordbasedshowhide ?
                                        this.state.selectComponent[component.parentLabel]
                                            === component.recordbasedhide ?
                                            component.inputtype === "email" ?
                                                mandatoryFields.push({
                                                    "mandatory": true,
                                                    "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],//component.label, 
                                                    "dataField": component.label,
                                                    "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                    "validateFunction": validateEmail,
                                                    "mandatoryLabel": "IDS_ENTER",
                                                    "controlType": "textbox"
                                                })
                                                :
                                                mandatoryFields.push({
                                                    "mandatory": true,
                                                    "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],//component.label, 
                                                    "dataField": component.label,
                                                    "mandatoryLabel": component.inputtype === "combo" ?
                                                        "IDS_SELECT" : "IDS_ENTER",
                                                    "controlType": component.inputtype === "combo" ? "selectbox" : "textbox"
                                                }) : "" :
                                        component.inputtype === "email" ?
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],//component.label, 
                                                "dataField": component.label,
                                                "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                "validateFunction": validateEmail,
                                                "mandatoryLabel": "IDS_ENTER",
                                                "controlType": "textbox"
                                            })
                                            :
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],//component.label,
                                                "dataField": component.label,
                                                "mandatoryLabel": component.inputtype === "combo" ?
                                                    "IDS_SELECT" : "IDS_ENTER",
                                                "controlType": component.inputtype === "combo" ? "selectbox" : "textbox"
                                            })
                                    : this.state.selectComponent[component.label] ?
                                        component.inputtype === "email" ?
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],//component.label, 
                                                "dataField": component.label,
                                                "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                "validateFunction": validateEmail,
                                                "mandatoryLabel": "IDS_ENTER",
                                                "controlType": "textbox"
                                            }) : "" : ""
                        })
                    })
                })

            selectedRecord = this.state.selectComponent
        }
        else if (this.props.Login.loadTest) {
            mandatoryFields = [{ "idsName": "IDS_TEST", "dataField": "ntestgrouptestcode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },]
            selectedRecord = this.props.Login.selectedTestData
        } else if (this.props.Login.loadImportFileData) {
            mandatoryFields = [
                { "idsName": "IDS_FILENAME", "dataField": "sfilename", "mandatoryLabel": "IDS_SELECT", "controlType": "files" },
            ]

            this.props.Login.masterData.registrationTemplate &&
                this.props.Login.masterData.registrationTemplate.jsondata.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            return component.hasOwnProperty("children") ?
                                component.children.map(componentrow => {
                                    if (this.props.sampleexportfields.findIndex(x => x === componentrow.label) === -1) {
                                        if (componentrow.mandatory === true) {
                                            if (componentrow.inputtype === "email") {
                                                mandatoryFields.push({
                                                    "mandatory": true, //"idsName": componentrow.label,
                                                    "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                    "dataField": componentrow.label,
                                                    "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                    "validateFunction": validateEmail,
                                                    "mandatoryLabel": "IDS_ENTER",
                                                    "controlType": "textbox"
                                                })
                                            } else {
                                                mandatoryFields.push({
                                                    "mandatory": true,
                                                    // "idsName": componentrow.label,
                                                    "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                    "dataField": componentrow.label,
                                                    "mandatoryLabel": componentrow.inputtype === "combo" ?
                                                        "IDS_SELECT" : "IDS_ENTER",
                                                    "controlType": componentrow.inputtype === "combo" ?
                                                        "selectbox" : "textbox"
                                                })
                                            }

                                        }

                                    }
                                    return null;
                                })
                                : this.props.sampleexportfields.findIndex(x => x === component.label) === -1 ? component.mandatory === true ?
                                    component.inputtype === "email" ?
                                        mandatoryFields.push({
                                            "mandatory": true,
                                            //"idsName": component.label, 
                                            "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                            "dataField": component.label,
                                            "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                            "validateFunction": validateEmail,
                                            "mandatoryLabel": "IDS_ENTER",
                                            "controlType": "textbox"
                                        })
                                        :
                                        mandatoryFields.push({
                                            "mandatory": true,
                                            //"idsName": component.label, 
                                            "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                            "dataField": component.label,
                                            "mandatoryLabel": component.inputtype === "combo" ?
                                                "IDS_SELECT" : "IDS_ENTER",
                                            "controlType": component.inputtype === "combo" ? "selectbox" : "textbox"
                                        }) : "" : ""
                        })
                    })
                })


        }
        else if (this.props.Login.loadImportSampleCountData) {
            mandatoryFields = [
                { "idsName": "IDS_SAMPLECOUNT", "dataField": "nsamplecount", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
        }
        else if (this.props.Login.loadSpec) {
            mandatoryFields = [
                { "idsName": "IDS_SPECIFICATION", "dataField": "nallottedspeccode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
            ]
        } else {
            this.props.Login.masterData.registrationTemplate &&
                this.props.Login.masterData.registrationTemplate.jsondata.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            return component.hasOwnProperty("children") ?
                                component.children.map(componentrow => {
                                    if (componentrow.mandatory === true) {
                                        if (componentrow.recordbasedshowhide) {
                                            if (this.state.selectedRecord[componentrow.parentLabel]
                                                === componentrow.recordbasedhide) {
                                                if (componentrow.inputtype === "email") {
                                                    mandatoryFields.push({
                                                        "mandatory": true,
                                                        //"idsName": componentrow.label,
                                                        "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                        "dataField": componentrow.label,
                                                        "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                        "validateFunction": validateEmail,
                                                        "mandatoryLabel": "IDS_ENTER",
                                                        "controlType": "textbox"
                                                    })
                                                } else {
                                                    mandatoryFields.push({
                                                        "mandatory": true,
                                                        // "idsName": componentrow.label,
                                                        "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                        "dataField": componentrow.label,
                                                        "mandatoryLabel": componentrow.inputtype === "combo" ?
                                                            "IDS_SELECT" : "IDS_ENTER",
                                                        "controlType": componentrow.inputtype === "combo" ?
                                                            "selectbox" : "textbox"
                                                    })
                                                }
                                            }

                                        } else {
                                            if (componentrow.inputtype === "email") {
                                                mandatoryFields.push({
                                                    "mandatory": true, //"idsName": componentrow.label,
                                                    "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                    "dataField": componentrow.label,
                                                    "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                    "validateFunction": validateEmail,
                                                    "mandatoryLabel": "IDS_ENTER",
                                                    "controlType": "textbox"
                                                })
                                            } else {
                                                mandatoryFields.push({
                                                    "mandatory": true,
                                                    // "idsName": componentrow.label,
                                                    "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                    "dataField": componentrow.label,
                                                    "mandatoryLabel": componentrow.inputtype === "combo" ?
                                                        "IDS_SELECT" : "IDS_ENTER",
                                                    "controlType": componentrow.inputtype === "combo" ?
                                                        "selectbox" : "textbox"
                                                })
                                            }
                                        }
                                    } else {
                                        if (componentrow.inputtype === "email") {

                                            selectedRecord[componentrow.label] &&
                                                selectedRecord[componentrow.label] !== "" &&
                                                mandatoryFields.push({
                                                    "mandatory": true, //"idsName": componentrow.label,
                                                    "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                    "dataField": componentrow.label,
                                                    "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                    "validateFunction": validateEmail,
                                                    "mandatoryLabel": "IDS_ENTER",
                                                    "controlType": "textbox"
                                                })
                                        }
                                    }
                                    return null;
                                })
                                : component.mandatory === true ?
                                    component.recordbasedshowhide ?
                                        this.state.selectedRecord[component.parentLabel]
                                            === component.recordbasedhide ?
                                            component.inputtype === "email" ?
                                                mandatoryFields.push({
                                                    "mandatory": true,
                                                    //"idsName": component.label, 
                                                    "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                    "dataField": component.label,
                                                    "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                    "validateFunction": validateEmail,
                                                    "mandatoryLabel": "IDS_ENTER",
                                                    "controlType": "textbox"
                                                })
                                                :
                                                mandatoryFields.push({
                                                    "mandatory": true,
                                                    //"idsName": component.label, 
                                                    "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                    "dataField": component.label,
                                                    "mandatoryLabel": component.inputtype === "combo" ?
                                                        "IDS_SELECT" : "IDS_ENTER",
                                                    "controlType": component.inputtype === "combo" ? "selectbox" : "textbox"
                                                }) : "" :
                                        component.inputtype === "email" ?
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                //"idsName": component.label, 
                                                "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                "dataField": component.label,
                                                "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                "validateFunction": validateEmail,
                                                "mandatoryLabel": "IDS_ENTER",
                                                "controlType": "textbox"
                                            })
                                            :
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                //"idsName": component.label, 
                                                "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                "dataField": component.label,
                                                "mandatoryLabel": component.inputtype === "combo" ?
                                                    "IDS_SELECT" : "IDS_ENTER",
                                                "controlType": component.inputtype === "combo" ? "selectbox" : "textbox"
                                            })
                                    : selectedRecord[component.label] ?
                                        component.inputtype === "email" ?
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                //"idsName": component.label, 
                                                "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                "dataField": component.label,
                                                "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                "validateFunction": validateEmail,
                                                "mandatoryLabel": "IDS_ENTER",
                                                "controlType": "textbox"
                                            }) : "" : ""
                        })
                    })
                })
        }
        if (this.props.esign) {
            mandatoryFields = [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
            ]
        }
        if (this.props.Login.loadEsign) {
            mandatoryFields = [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
            ]
        }
        //  console.log("mandate fields:", mandatoryFields);
        /* if(this.props.Login.userInfo.nformcode===241 && this.props.Login.masterData.RealSampleTypeValue &&
             this.props.Login.masterData.RealSampleTypeValue.nsampletypecode===2){
             mandatoryFields.unshift( { "idsName": "IDS_SITE", "dataField": "SchedulerSite", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
             )
         }*/
        mandatoryFields.forEach(item => {
            if (selectedRecord[item.dataField] === undefined || selectedRecord[item.dataField] === null) {
                const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                failedControls.push(alertMessage);
                startLabel.push(item.mandatoryLabel)//"IDS_PROVIDE";
            }
            else {
                if (item.validateFunction) {
                    const validateData = item.validateFunction;
                    if (validateData(selectedRecord[item.dataField]) === false) {
                        const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                        failedControls.push(alertMessage);
                        startLabel.push(item.mandatoryLabel)
                    }
                }
                else {
                    if (typeof selectedRecord[item.dataField] === "object") {
                        //to validate FormSelectSearch component
                        if (selectedRecord[item.dataField].length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)//"IDS_SELECT";
                        }
                    }
                    else if (typeof selectedRecord[item.dataField] === "string") {
                        //to handle string field -- added trim function
                        if (selectedRecord[item.dataField].trim().length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)
                        }
                    }
                    else {
                        //number field
                        if (selectedRecord[item.dataField].length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)
                        }
                    }
                }
            }
            // else{
            //     const alertMessage=(item.alertPreFix?item.alertPreFix:'')+this.props.intl.formatMessage({id:item.idsName})+(item.alertSuffix?item.alertSuffix:'')
            //     failedControls.push(alertMessage);
            // }
        });
        // console.log("validationPassed:", failedControls);

        if (failedControls.length === 0) {
            if (saveType === 4) {
                this.props.onExecuteClick(this.formRef);
            }
            else if (saveType === 3) {
                if (selectedRecord.agree && selectedRecord.agree === transactionStatus.NO) {

                    toast.info(this.props.intl.formatMessage({ id: "IDS_CHECKAGREE" }));

                } else {

                    this.props.validateEsign();
                }
            }
            else {
                if (this.props.Login.addMaster) {
                    this.onSaveMasterRecord(saveType, this.formRef)
                }
                else if (this.props.Login.loadSpec) {
                    let selectedSpec = this.state.selectedSpec
                    let selectedSpecCheck = { ...this.state.selectedSpec }
                    selectedSpec["nallottedspeccode"] = this.state.selectedRecord["nallottedspeccode"]
                    selectedSpec["sversion"] = this.state.selectedRecord["sversion"]
                    selectedSpec["ntemplatemanipulationcode"] = this.state.selectedRecord["ntemplatemanipulationcode"]

                    const specBasedComponent = selectedSpec["nallottedspeccode"] &&
                        selectedSpec["nallottedspeccode"].item.ncomponentrequired === transactionStatus.YES ? true : false
                    this.subSampleDataGridList = []
                    if (specBasedComponent) {
                        this.subSampleDataGridList = [
                            { "idsName": this.props.Login.genericLabel ? 
                            this.props.Login.genericLabel["SubSample"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]
                            :"IDS_COMPONENT", "dataField": "scomponentname", width: "200px" }
                        ]
                    }

                    this.props.Login.masterData.SubSampleTemplate &&
                        this.props.Login.masterData.SubSampleTemplate.jsondata.map(row => {
                            return row.children.map(column => {
                                return column.children.map(component => {
                                    // let label = ''
                                    if (component.hasOwnProperty("children")) {
                                        component.children.map(componentrow => {
                                            if (componentrow.mandatory === true) {
                                                // label = label + '&' + componentrow.label
                                                this.subSampleDataGridList.push({ "mandatory": true, "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode], "dataField": componentrow.label, width: "150px" })
                                            }
                                            return this.subSampleDataGridList;
                                        })
                                    } else {
                                        if (component.mandatory)
                                            this.subSampleDataGridList.push({ "mandatory": true, "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode], "dataField": component.label, width: "150px" });

                                        return this.subSampleDataGridList
                                    }

                                })

                            })
                        })

                    //  this.setState({ selectedSpec: this.props.Login.selectedSpec,
                    //      specBasedComponent });

                    // this.setState({
                    //     selectedTestData: [], loadSpec: false, SelectedTest: [], Test: [], Component: [], selectedSpec
                    // })
                    let inputvalues = {};
                    if (this.state.selectedRecord["nallottedspeccode"] !== selectedSpecCheck.nallottedspeccode) {
                        inputvalues = {
                            selectedTestData: [],
                            selectComponent: [],
                            selectedComponent: {},
                            loadSpec: false,
                            SelectedTest: [],
                            Test: [],
                            Component: [],
                            subSampleDataGridList: [],
                            selectedSpec: { ...selectedSpec },
                            screenName: this.props.screenName,
                            specBasedComponent
                        }
                    } else {
                        inputvalues = {
                            loadSpec: false,
                            selectedSpec: { ...selectedSpec },
                            screenName: this.props.screenName,
                            specBasedComponent
                        }
                    }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            // selectedTestData: [],
                            // selectComponent: [],
                            // selectedComponent: {},
                            // loadSpec: false,
                            // SelectedTest: [],
                            // Test: [],
                            // Component: [],
                            // subSampleDataGridList: [],
                            // selectedSpec: { ...selectedSpec },
                            // screenName: this.props.Login.masterData.RealRegSubTypeValue &&
                            //     this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename || "Scheduler",
                            // specBasedComponent
                            ...inputvalues
                        }
                    }
                    this.props.updateStore(updateInfo);

                }
                else if (this.props.Login.loadComponent) {
                    this.onSaveComponentClick(saveType, this.formRef)
                }
                else if (this.props.Login.loadTest) {
                    this.onSaveTestClick(saveType, this.formRef)
                }
                else if (this.props.Login.loadSubSample) {
                    this.onSaveSubSampleClick(saveType, this.formRef)
                }
                else if (this.props.Login.loadImportFileData) {
                    this.onSaveClickImport('1', this.formRef);
                }
                else if (this.props.Login.loadImportSampleCountData) {
                    this.onSaveClickImport('2', this.formRef);
                }
                else {
                    this.onSaveClick(saveType, this.formRef);
                }

            }
        }
        else {
            label = startLabel[0] === undefined ? label : startLabel[0];
            toast.info(`${this.props.intl.formatMessage({ id: label })} ${failedControls[0]}`);
        }

    }



    MandatoryCheckSubSample = () => {

        let mandatoryFields = []
        let exportFields = []
        let comboComponent = []
        let exportFieldProperties = []

        let subSampleFields = []
        if (this.state.specBasedComponent) {
            exportFieldProperties = [{ "nquerybuildertablecode": 32, "valumeber": "ncomponentcode", "inputtype": "combo", "displaymember": "scomponentname", "label": "ncomponentcode", "source": "component" }]
            mandatoryFields = [{ "displayname": "IDS_COMPONENT", "idsField": true, "label": "ncomponentcode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo", "mandatory": true, }]
            // mandatoryFields = [{ "displayname": "IDS_COMPONENT", "idsField": true, "label": "ncomponentcode_child", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }]

            exportFields = ["ncomponentcode"]
            subSampleFields = [{ "displayname": "IDS_COMPONENT", "idsField": true, "label": "ncomponentcode_child", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }]
        }


        this.props.Login.masterData.SubSampleTemplate &&
            this.props.Login.masterData.SubSampleTemplate.jsondata.map(row => {
                return row.children.map(column => {
                    return column.children.map(component => {
                        if (component.hasOwnProperty("children")) {
                            component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    comboComponent.push(componentrow)
                                }

                                subSampleFields.push({
                                    "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                    "dataField": componentrow.label,
                                    "mandatoryLabel": componentrow.inputtype === "combo" ?
                                        "IDS_SELECT" : "IDS_ENTER",
                                    "controlType": componentrow.inputtype === "combo" ?
                                        "selectbox" : "textbox",
                                    "label": componentrow.label
                                })


                                if (this.props.subsampleexportfields.findIndex(x => x === componentrow.label) !== -1) {
                                    exportFields.push(componentrow.label
                                    )
                                    exportFieldProperties.push(componentrow)
                                }


                                if (componentrow.mandatory === true && !componentrow.templatemandatory && this.props.subsampleexportfields.findIndex(x => x === componentrow.label) !== -1) {
                                    if (componentrow.inputtype === "email") {
                                        mandatoryFields.push({
                                            "mandatory": true,
                                            //"idsName": componentrow.label,
                                            "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                            "dataField": componentrow.label,
                                            "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                            // "validateFunction": validateEmail,
                                            "mandatoryLabel": "IDS_ENTER",
                                            "controlType": "email",
                                            "label": componentrow.label
                                        })
                                    } else {
                                        mandatoryFields.push({
                                            "mandatory": true,
                                            // "idsName": componentrow.label,
                                            "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                            "dataField": componentrow.label,
                                            "mandatoryLabel": componentrow.inputtype === "combo" ?
                                                "IDS_SELECT" : "IDS_ENTER",
                                            "controlType": componentrow.inputtype === "combo" ?
                                                "selectbox" : "textbox",
                                            "label": componentrow.label
                                        })
                                    }
                                } else {
                                    if (this.props.subsampleexportfields.findIndex(x => x === componentrow.label) !== -1 && componentrow.inputtype === "email") {
                                        mandatoryFields.push({
                                            "mandatory": false, //"idsName": componentrow.label,
                                            "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                            "dataField": componentrow.label,
                                            "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                            // "validateFunction": validateEmail,
                                            "mandatoryLabel": "IDS_ENTER",
                                            "controlType": "email",
                                            "label": componentrow.label
                                        })
                                    }
                                }
                                return null;
                            })
                        } else {

                            if (component.inputtype === "combo") {
                                comboComponent.push(component)
                            }

                            subSampleFields.push({
                                "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                "dataField": component.label,
                                "mandatoryLabel": component.inputtype === "combo" ?
                                    "IDS_SELECT" : "IDS_ENTER",
                                "controlType": component.inputtype === "combo" ?
                                    "selectbox" : "textbox",
                                "label": component.label
                            })

                            if (this.props.subsampleexportfields.findIndex(x => x === component.label) !== -1) {
                                exportFields.push(
                                    component.label
                                )
                                exportFieldProperties.push(component)
                            }
                            if (component.mandatory === true && !component.templatemandatory && this.props.subsampleexportfields.findIndex(x => x === component.label) !== -1) {
                                if (component.inputtype === "email") {
                                    mandatoryFields.push({
                                        "mandatory": true,
                                        "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                        "dataField": component.label,
                                        "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                        //"validateFunction": validateEmail,
                                        "mandatoryLabel": "IDS_ENTER",
                                        "controlType": "email",
                                        "label": component.label
                                    })
                                }
                                else {
                                    mandatoryFields.push({
                                        "mandatory": true,
                                        "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                        "dataField": component.label,
                                        "mandatoryLabel": component.inputtype === "combo" ?
                                            "IDS_SELECT" : "IDS_ENTER",
                                        "controlType": component.inputtype === "combo" ? "selectbox" : "textbox",
                                        "label": component.label
                                    })
                                }
                            } else {
                                if (this.props.subsampleexportfields.findIndex(x => x === component.label) !== -1 && component.inputtype === "email") {
                                    mandatoryFields.push({
                                        "mandatory": false,
                                        "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                        "dataField": component.label,
                                        "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                        // "validateFunction": validateEmail,
                                        "mandatoryLabel": "IDS_ENTER",
                                        "controlType": "email",
                                        "label": component.label
                                    })
                                }
                            }
                        }
                    })
                })
            })

        return { mandatoryFields, exportFields, subSampleFields, comboComponent, exportFieldProperties };
    }

    // SubSampleFields = () => {

    //     let mandatoryFields = []
    //     if (this.state.specBasedComponent)
    //         mandatoryFields = [{ "idsName": "IDS_COMPONENT", "dataField": "ncomponentcode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }]

    //     this.props.Login.masterData.SubSampleTemplate &&
    //         this.props.Login.masterData.SubSampleTemplate.jsondata.map(row => {
    //             return row.children.map(column => {
    //                 return column.children.map(component => {
    //                     return component.hasOwnProperty("children") ?
    //                         component.children.map(componentrow => {
    //                             mandatoryFields.push({
    //                                 "mandatory": true,
    //                                 // "idsName": componentrow.label,
    //                                 "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
    //                                 "dataField": componentrow.label,
    //                                 "mandatoryLabel": componentrow.inputtype === "combo" ?
    //                                     "IDS_SELECT" : "IDS_ENTER",
    //                                 "controlType": componentrow.inputtype === "combo" ?
    //                                     "selectbox" : "textbox"
    //                             })

    //                             return null;
    //                         })
    //                         :
    //                         mandatoryFields.push({
    //                             "mandatory": true,
    //                             //"idsName": component.label, 
    //                             "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
    //                             "dataField": component.label,
    //                             "mandatoryLabel": component.inputtype === "combo" ?
    //                                 "IDS_SELECT" : "IDS_ENTER",
    //                             "controlType": component.inputtype === "combo" ? "selectbox" : "textbox"
    //                         })


    //                 })
    //             })
    //         })

    //     return mandatoryFields;
    // }

    // SampleFields = () => {

    //     let mandatoryFields = []
    //     if (this.state.specBasedComponent)
    //         mandatoryFields = [{ "idsName": "IDS_COMPONENT", "dataField": "ncomponentcode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }]

    //     this.props.Login.masterData.SubSampleTemplate &&
    //         this.props.Login.masterData.SubSampleTemplate.jsondata.map(row => {
    //             return row.children.map(column => {
    //                 return column.children.map(component => {
    //                     return component.hasOwnProperty("children") ?
    //                         component.children.map(componentrow => {
    //                             mandatoryFields.push({
    //                                 "mandatory": true,
    //                                 // "idsName": componentrow.label,
    //                                 "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
    //                                 "dataField": componentrow.label,
    //                                 "mandatoryLabel": componentrow.inputtype === "combo" ?
    //                                     "IDS_SELECT" : "IDS_ENTER",
    //                                 "controlType": componentrow.inputtype === "combo" ?
    //                                     "selectbox" : "textbox"
    //                             })

    //                             return null;
    //                         })
    //                         :
    //                         mandatoryFields.push({
    //                             "mandatory": true,
    //                             //"idsName": component.label, 
    //                             "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
    //                             "dataField": component.label,
    //                             "mandatoryLabel": component.inputtype === "combo" ?
    //                                 "IDS_SELECT" : "IDS_ENTER",
    //                             "controlType": component.inputtype === "combo" ? "selectbox" : "textbox"
    //                         })


    //                 })
    //             })
    //         })

    //     return mandatoryFields;
    // }


    MandatoryCheck = () => {
        const mandatoryFields = []
        const exportFields = []
        const exportFieldProperties = []
        const comboComponent = []
        this.props.Login.masterData.registrationTemplate &&
            this.props.Login.masterData.registrationTemplate.jsondata.map(row => {
                return row.children.map(column => {
                    return column.children.map(component => {
                        if (component.hasOwnProperty("children")) {
                            component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    comboComponent.push(componentrow)
                                }


                                if (this.props.sampleexportfields.findIndex(x => x === componentrow.label) !== -1) {
                                    exportFields.push(componentrow.label)
                                    exportFieldProperties.push(componentrow)
                                }

                                if (componentrow.mandatory === true && !componentrow.templatemandatory && this.props.sampleexportfields.findIndex(x => x === componentrow.label) !== -1) {
                                    if (componentrow.inputtype === "email") {
                                        mandatoryFields.push({
                                            "mandatory": true,
                                            //"idsName": componentrow.label,
                                            "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                            "dataField": componentrow.label,
                                            "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                            // "validateFunction": validateEmail,
                                            "mandatoryLabel": "IDS_ENTER",
                                            "controlType": "email",
                                            "label": componentrow.label
                                        })
                                    } else {
                                        mandatoryFields.push({
                                            "mandatory": true,
                                            // "idsName": componentrow.label,
                                            "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                            "dataField": componentrow.label,
                                            "mandatoryLabel": componentrow.inputtype === "combo" ?
                                                "IDS_SELECT" : "IDS_ENTER",
                                            "controlType": componentrow.inputtype === "combo" ?
                                                "selectbox" : "textbox",
                                            "label": componentrow.label
                                        })
                                    }
                                } else {
                                    if (this.props.sampleexportfields.findIndex(x => x === componentrow.label) !== -1 && componentrow.inputtype === "email") {
                                        mandatoryFields.push({
                                            "mandatory": false, //"idsName": componentrow.label,
                                            "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                            "dataField": componentrow.label,
                                            "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                            // "validateFunction": validateEmail,
                                            "mandatoryLabel": "IDS_ENTER",
                                            "controlType": "email",
                                            "label": componentrow.label
                                        })
                                    }
                                }
                                return null;
                            })
                        } else {

                            if (component.inputtype === "combo") {
                                comboComponent.push(component)
                            }


                            if (this.props.sampleexportfields.findIndex(x => x === component.label) !== -1) {
                                exportFields.push(component.label
                                )
                                exportFieldProperties.push(component)
                            }
                            if (component.mandatory === true && !component.templatemandatory && this.props.sampleexportfields.findIndex(x => x === component.label) !== -1) {
                                if (component.inputtype === "email") {
                                    mandatoryFields.push({
                                        "mandatory": true,
                                        "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                        "dataField": component.label,
                                        "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                        //"validateFunction": validateEmail,
                                        "mandatoryLabel": "IDS_ENTER",
                                        "controlType": "email",
                                        "label": component.label
                                    })
                                }
                                else {
                                    mandatoryFields.push({
                                        "mandatory": true,
                                        "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                        "dataField": component.label,
                                        "mandatoryLabel": component.inputtype === "combo" ?
                                            "IDS_SELECT" : "IDS_ENTER",
                                        "controlType": component.inputtype === "combo" ? "selectbox" : "textbox",
                                        "label": component.label
                                    })
                                }
                            } else {
                                if (this.props.sampleexportfields.findIndex(x => x === component.label) !== -1 && component.inputtype === "email") {
                                    mandatoryFields.push({
                                        "mandatory": false,
                                        "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                        "dataField": component.label,
                                        "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                        // "validateFunction": validateEmail,
                                        "mandatoryLabel": "IDS_ENTER",
                                        "controlType": "email",
                                        "label": component.label
                                    })
                                }
                            }
                        }
                    })
                })
            })

        return { mandatoryFields, exportFields, comboComponent, exportFieldProperties };

    }

    TestChange = (comboData, fieldName) => {
        const selectedTestData = this.state.selectedTestData || {};
        selectedTestData[fieldName] = comboData;
        //  this.setState({ selectedTestData });
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { selectedTestData }
        }
        this.props.updateStore(updateInfo);
    }

    onSchedulerComboChange = (event, fieldName) => {
        if (event !== null) {
            let Map = {};
            let selectedRecord = this.state.selectedRecord;
            Map["nschedulecode"] = parseInt(event.value);
            Map['userinfo'] = this.props.Login.userInfo;

            selectedRecord[fieldName] = event;
            this.props.getSchedulerMasteDetails(Map, selectedRecord, this.props.Login.masterData);
        }
    }

    onComboChange = (comboData, control, customName) => {
        const selectedRecord = this.state.selectedRecord || {};
        //console.log("Control:", control);
        if (comboData) {
            let parentList = []
            let childComboList = []
            let childColumnList = {}
            let comboName = customName || control.label;
            let product = false;
            let productCategory = false;
            let nproductcatcode = -1
            let nproductcode = -1
            let materialType = false;
            let instrument = false;
            let instrumentCategory = false;
            let material = false;
            let materialCategory = false;
            let project = false;
            let nprojectmastercode = -1;
            let childSpec = false;
            const nsampletypecode = 1;

            if (nsampletypecode === SampleType.CLINICALTYPE) {
                if (control.table && control.table.item.nquerybuildertablecode === 228
                    && (control.inputtype === 'backendsearchfilter' || control.inputtype === 'frontendsearchfilter')) {
                    selectedRecord['spatientid'] = comboData.item['jsondata']['spatientid']
                }
            }

            if (control.name === "manualorderid") {
                selectedRecord['spatientid'] = comboData.item && comboData.item['jsondata']['spatientid']
            }

            const sampleTypeCatBasedFlow = this.props.Login.masterData.RealSampleTypeValue ?
                parseInt(this.props.Login.masterData.RealSampleTypeValue.ncategorybasedflowrequired)
                : transactionStatus.NO

            const nprojectSpecReqd = this.props.Login.masterData.RealSampleTypeValue ?
                parseInt(this.props.Login.masterData.RealSampleTypeValue.nprojectspecrequired)
                : transactionStatus.NO;
            const inputParem = {
                child: control.child,
                source: control.source,
                primarykeyField: control.valuemember,
                value: comboData ? comboData.value : -1,
                item: comboData ? comboData.item : "",
                label: comboData ? comboName : "",
                nameofdefaultcomp: control.name,
                screenName: this.props.screenName
            }
            if (comboData) {
                comboData["item"] = {
                    ...comboData["item"], "pkey": control.valuemember,
                    "nquerybuildertablecode": control.nquerybuildertablecode, source: control.source
                };

                selectedRecord[comboName] = comboData;
            } else {
                selectedRecord[comboName] = []
            }
            if (control.name === 'Product') {
                const ProductCategory = this.props.comboComponents.filter(x => x.name === "Product Category");
                let ncategorybasedflow = selectedRecord[ProductCategory[0].label] &&
                    selectedRecord[ProductCategory[0].label]['item']['jsondata']['ncategorybasedflow'];
                nproductcatcode = selectedRecord[ProductCategory[0].label] &&
                    selectedRecord[ProductCategory[0].label].value;

                //If SampleType table's categorybasedflow = 3 then we should not consider
                //product category's categorybasedflow
                if (sampleTypeCatBasedFlow === transactionStatus.YES) {
                    ncategorybasedflow = transactionStatus.YES;
                }

                if (nsampletypecode === SampleType.PROJECTSAMPLETYPE && nprojectSpecReqd === transactionStatus.YES) {
                    //ALPD-2009       
                    if (ncategorybasedflow !== transactionStatus.YES) {

                        nproductcode = selectedRecord[comboName] &&
                            selectedRecord[comboName].value;
                        nprojectmastercode = selectedRecord['Project Code'] &&
                            selectedRecord['Project Code']['value'];
                        project = true;
                    }
                }
                else {
                    if (ncategorybasedflow !== transactionStatus.YES) {
                        product = true;
                        nproductcode = selectedRecord[comboName] &&
                            selectedRecord[comboName].value;
                    }
                }

            }
            else if (control.name === 'Instrument Name') {
                const InstrumentCategory = this.props.comboComponents.filter(x => x.name === "Instrument Category");
                let ncategorybasedflow = selectedRecord[InstrumentCategory[0].label] &&
                    selectedRecord[InstrumentCategory[0].label]['item']['jsondata']['ncategorybasedflow'];
                nproductcatcode = selectedRecord[InstrumentCategory[0].label] &&
                    selectedRecord[InstrumentCategory[0].label].value;

                //If SampleType table's categorybasedflow = 3 then we should not consider
                //product category's categorybasedflow
                if (sampleTypeCatBasedFlow === transactionStatus.YES) {
                    ncategorybasedflow = transactionStatus.YES;
                }
                if (ncategorybasedflow !== transactionStatus.YES) {
                    instrument = true
                    nproductcode = selectedRecord[comboName] &&
                        selectedRecord[comboName].value;
                }

            }
            else if (control.name === 'Material') {
                const MaterialCategory = this.props.comboComponents.filter(x => x.name === "Material Category");
                let ncategorybasedflow = selectedRecord[MaterialCategory[0].label] &&
                    selectedRecord[MaterialCategory[0].label]['item']['jsondata']['ncategorybasedflow'];
                nproductcatcode = selectedRecord[MaterialCategory[0].label] &&
                    selectedRecord[MaterialCategory[0].label].value;

                //If SampleType table's categorybasedflow = 3 then we should not consider
                //product category's categorybasedflow
                if (sampleTypeCatBasedFlow === transactionStatus.YES) {
                    ncategorybasedflow = transactionStatus.YES;
                }

                if (ncategorybasedflow !== transactionStatus.YES) {
                    material = true
                    nproductcode = selectedRecord[comboName] &&
                        selectedRecord[comboName].value;
                }

            }
            else if (control.name === 'Product Category') {
                const Product = this.props.comboComponents.filter(x => x.name === "Product");
                nproductcatcode = selectedRecord[control.label] &&
                    selectedRecord[control.label]['value'];

                let ncategorybasedflow = selectedRecord[control.label] &&
                    selectedRecord[control.label]['item']['jsondata']['ncategorybasedflow'];

                //If SampleType table's categorybasedflow = 3 then we should not consider
                //product category's categorybasedflow
                if (sampleTypeCatBasedFlow === transactionStatus.YES) {
                    ncategorybasedflow = transactionStatus.YES;
                }

                if (nsampletypecode === SampleType.PROJECTSAMPLETYPE
                    && nprojectSpecReqd === transactionStatus.YES) {
                    //ALPD-2009
                    if (ncategorybasedflow === transactionStatus.YES) {

                        //const Product = this.props.comboComponents.filter(x => x.name === "Product");
                        nprojectmastercode = selectedRecord['Project Code'] &&
                            selectedRecord['Project Code']['value'];
                        project = true;
                    }
                    else {

                        const Product = this.props.comboComponents.filter(x => x.name === "Product");
                        nproductcode = selectedRecord[Product[0].label] !== undefined ? selectedRecord[Product[0].label].value : -1;

                        nprojectmastercode = selectedRecord['Project Code'] &&
                            selectedRecord['Project Code']['value'];
                        project = true;
                    }
                }
                else {
                    if (ncategorybasedflow === transactionStatus.YES) {
                        productCategory = true;
                    }
                    else {
                        inputParem["ProductName"] = Product[0].label;
                        product = true;
                    }

                }
            }
            else if (control.name === 'Instrument Category') {
                const Instrument = this.props.comboComponents.filter(x => x.name === "Instrument");
                nproductcatcode = selectedRecord[control.label] &&
                    selectedRecord[control.label]['value'];
                let ncategorybasedflow = selectedRecord[control.label] &&
                    selectedRecord[control.label]['item']['jsondata']['ncategorybasedflow'];

                //If SampleType table's categorybasedflow = 3 then we should not consider
                //product category's categorybasedflow
                if (sampleTypeCatBasedFlow === transactionStatus.YES) {
                    ncategorybasedflow = transactionStatus.YES;
                }
                if (ncategorybasedflow === transactionStatus.YES) {
                    instrumentCategory = true
                } else {
                    inputParem["InstrumentName"] = Instrument[0] && Instrument[0].label
                    // nproductcode = selectedRecord[comboName] &&
                    // selectedRecord[comboName].value;
                    instrument = true
                }
            }
            else if (control.name === 'Material Category') {
                const Material = this.props.comboComponents.filter(x => x.name === "Material");
                nproductcatcode = selectedRecord[control.label] &&
                    selectedRecord[control.label]['value'];
                let ncategorybasedflow = selectedRecord[control.label] &&
                    selectedRecord[control.label]['item']['jsondata']['ncategorybasedflow'];

                //If SampleType table's categorybasedflow = 3 then we should not consider
                //product category's categorybasedflow
                if (sampleTypeCatBasedFlow === transactionStatus.YES) {
                    ncategorybasedflow = transactionStatus.YES;
                }
                if (ncategorybasedflow === transactionStatus.YES) {
                    materialCategory = true
                } else {
                    inputParem["MaterialName"] = Material[0].label
                    // nproductcode = selectedRecord[comboName] &&
                    // selectedRecord[comboName].value;
                    material = true
                }
            }
            else if (control.name === 'Material Type') {
                const MaterialCategory = this.props.comboComponents.filter(x => x.name === "Material Category");
                //nproductcatcode = -1;
                // const ncategorybasedflow = comboData &&
                //     comboData['item']['jsondata']['ncategorybasedflow'];
                // if (ncategorybasedflow === 3) {
                //     productCategory = true
                // } else {
                inputParem["MaterialCategoryName"] = MaterialCategory[0].label
                // nproductcode = selectedRecord[comboName] &&
                // selectedRecord[comboName].value;
                materialType = true
                //  }
            }
            else if (control.name === 'Project Code') {
                //project = true;
                const ProductCategory = this.props.comboComponents.filter(x => x.name === "Product Category");
                const Product = this.props.comboComponents.filter(x => x.name === "Product");
                nproductcatcode = selectedRecord[ProductCategory[0].label] !== undefined ? selectedRecord[ProductCategory[0].label].value : -1;

                let ncategorybasedflow = selectedRecord[ProductCategory[0].label] &&
                    selectedRecord[ProductCategory[0].label]['item']['jsondata']['ncategorybasedflow'];

                //If SampleType table's categorybasedflow = 3 then we should not consider
                //product category's categorybasedflow
                if (sampleTypeCatBasedFlow === transactionStatus.YES) {
                    ncategorybasedflow = transactionStatus.YES;
                }

                if (ncategorybasedflow !== transactionStatus.YES) {
                    // nproductcode = selectedRecord[Product[0].label] &&
                    //     selectedRecord[Product[0].label].value;
                    nproductcode = selectedRecord[Product[0].label] !== undefined ? selectedRecord[Product[0].label].value : -1;
                }
                nprojectmastercode = selectedRecord[control.label] &&
                    selectedRecord[control.label]['value'];

                if (nsampletypecode === SampleType.PROJECTSAMPLETYPE && nprojectSpecReqd === transactionStatus.YES) {
                    project = true;
                }
                // else{
                //     if (ncategorybasedflow === 3) {
                //         productCategory = true;
                //     }
                //     else{
                //         product =true;
                //     }
                // }

            }

            if (nsampletypecode === SampleType.PROJECTSAMPLETYPE && nprojectSpecReqd === transactionStatus.YES) {
                product = false;
                productCategory = false;
                materialType = false;
                instrument = false;
                instrumentCategory = false;
                material = false;
                materialCategory = false;
            }

            if (control.child && control.child.length > 0) {
                childComboList = getSameRecordFromTwoArrays(this.props.comboComponents, control.child, "label")
                childColumnList = {};
                childComboList.map(columnList => {
                    const val = comboChild(this.props.comboComponents, columnList, childColumnList, false);
                    childColumnList = val.childColumnList
                    return null;
                })

                parentList = getSameRecordFromTwoArrays(this.props.withoutCombocomponent, control.child, "label")
                // let childTemplateMandatory = {}
                // if (!(product ||
                //     productCategory ||
                //     materialType ||
                //     instrument ||
                //     instrumentCategory ||
                //     material ||
                //     materialCategory ||
                //     project)) {
                //     const TemplateMandatory = childComboList && childComboList.filter(x => x.templatemandatory)
                //     if (TemplateMandatory && TemplateMandatory.length > 0) {
                //         const ProductCategory = childComboList.filter(x => x.name === "Product Category");
                //         const Product = childComboList.filter(x => x.name === "Product");
                //         const InstrumentCategory = childComboList.filter(x => x.name === "Instrument Category");
                //         const MaterialCategory = childComboList.filter(x => x.name === "Material Category");
                //         const Material = childComboList.filter(x => x.name === "Material");
                //         const MaterialType = childComboList.filter(x => x.name === "Material Type");
                //         const ProjectCode = childComboList.filter(x => x.name === "Project Code");
                //         const Instrument = childComboList.filter(x => x.name === "Instrument");

                //         childTemplateMandatory = {
                //             ProductCategory, Product
                //             , InstrumentCategory
                //             , MaterialCategory, Material
                //             , MaterialType, MaterialType
                //             , ProjectCode, Instrument
                //         }
                //         if (ProductCategory || Product
                //             || InstrumentCategory
                //             || MaterialCategory || Material
                //             || MaterialType || MaterialType
                //             || ProjectCode || Instrument) {
                //             childSpec = true;
                //         }
                //     }
                //     else {
                //         const TemplateChild = childComboList && childComboList.filter(x => x.child && x.child.length > 0)
                //         if (TemplateChild&& TemplateChild.length> 0) {

                //             TemplateChild.map(x=>{
                //                 x.child&&x.child.map(y=>{
                //                 const data=this.props.comboComponents(x=>x.label===y.label)  
                //                 if(data&&data[0].templatemandatory){
                //                     const name=data[0].name
                //                     if(name==="Product Category"||name==="Instrument Category"
                //                     ||name==="Product"||name==="Material Category"
                //                     ||name==="Material"||name==="Project Code"||name==="Instrument"){
                //                         childSpec = true;
                //                         childTemplateMandatory={childSpec:true}
                //                     }
                //                 }
                //                 })
                //             })
                //         }

                //     }
                // }
                const mapOfFilter = {
                    nproductcode, nproductcatcode,
                    nsampletypecode: nsampletypecode,
                    nprojectmastercode, nprojectSpecReqd,
                    nneedsubsample: this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample === true ? transactionStatus.YES : transactionStatus.NO,
                    nportalrequired: this.props.Login.masterData.RealSampleTypeValue.nportalrequired,
                    ntestgroupspecrequired: this.props.Login.masterData.RealRegSubTypeValue.ntestgroupspecrequired === true ? transactionStatus.YES : transactionStatus.NO  //ALPD-4834, Vishakh, Added ntestgroupspecrequired key to send value to backend
                    // ...childTemplateMandatory
                }
                /*  if(this.props.Login.userInfo.nformcode===241){
                  childComboList = childComboList.map(item => {
                      if (item.label === 'Instrument ID') {
                          return { ...item, conditionstring: "" };
                      }
                      return item;
                  });
              }*/

                this.props.getChildValues(inputParem, this.props.Login.userInfo, selectedRecord, this.props.Login.comboData,
                    childComboList, childColumnList, this.props.withoutCombocomponent,
                    [...childComboList, ...parentList], productCategory, product, mapOfFilter,
                    instrumentCategory, instrument, materialCategory, material, materialType,
                    undefined, project, this.props.comboComponents)
            }
            else {
                if (product || productCategory || instrument ||
                    material || materialCategory || instrumentCategory || materialType
                    || project) {
                    const mapOfFilter = {
                        nproductcode, nproductcatcode,
                        nsampletypecode: nsampletypecode,
                        nprojectmastercode,
                        nneedsubsample: this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample === true ? transactionStatus.YES : transactionStatus.NO,
                        ntestgroupspecrequired: this.props.Login.masterData.RealRegSubTypeValue.ntestgroupspecrequired === true ? transactionStatus.YES : transactionStatus.NO  //ALPD-4834, Vishakh, Added ntestgroupspecrequired key to send value to backend
                       
                    }

                    this.props.getChildValues(inputParem,
                        this.props.Login.userInfo, selectedRecord, this.props.Login.comboData,
                        childComboList, childColumnList, this.props.withoutCombocomponent,
                        [...childComboList, ...parentList], productCategory, product, mapOfFilter,
                        instrumentCategory, instrument, materialCategory, material,
                        undefined, undefined, project)
                } else {
                    //let sitevalue=comboData.value;
                    let comboData = this.props.Login.comboData;

                    //   if(sitevalue===selectedRecord['SchedulerSite'].value){
                    if (customName === 'SchedulerSite') {

                        this.props.comboComponents.forEach(item => {
                            if (item.name === 'Instrument Category' || item.name === 'Instrument Name' || item.name === 'Instrument') {
                                delete selectedRecord[item.label];
                                if (item.name !== 'Instrument Category')
                                    comboData[item.label] = '';

                            }
                        });


                    }
                    // }


                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { selectedRecord, loadCustomSearchFilter: false, comboData }
                    }
                    this.props.updateStore(updateInfo);
                }


            }
        } else {
            const comboData = this.props.Login.comboData
            selectedRecord[control.label] = "";
            if (control.child && control.child.length > 0) {
                control.child.map(temp => {
                    selectedRecord[temp.label] = ""
                    delete comboData[temp.label]
                    const components = [...this.props.comboComponents, ...this.props.withoutCombocomponent]

                    components.map(component => {
                        if (component.label === temp.label) {
                            if (component.child && component.child.length > 0) {
                                component.child.map(temp1 => {
                                    selectedRecord[temp1.label] = ""
                                    delete comboData[temp1.label]
                                })
                            }
                        }
                    })
                })
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord, comboData, loadCustomSearchFilter: false, }
            }
            this.props.updateStore(updateInfo);
        }
    }

    onInputOnChange = (event, control, radiotext) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === 'timeonly') {
                selectedRecord['dateonly'] = false;
            }
            if (event.target.name === 'dateonly') {
                selectedRecord['timeonly'] = false;
            }
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            }
            //ALPD-3596 Start
            if (event.target.name === "importTest") {
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
                if (event.target.checked === false) {
                    let needTest = event.target.checked
                    this.testForImport(needTest)
                }
            }
            //ALPD-3596 End

            else {

                const value = selectedRecord[event.target.name];
                if (value !== '' && value !== undefined) {
                    if (value.includes(radiotext)) {
                        const index = value.indexOf(radiotext);
                        if (index !== -1) {
                            if (index === 0) {
                                const indexcomma = value.indexOf(",")
                                if (indexcomma !== -1) {
                                    selectedRecord[event.target.name] = value.slice(indexcomma + 1)

                                } else {
                                    selectedRecord[event.target.name] = ""
                                }
                            } else {
                                if (value.slice(index).indexOf(",") !== -1) {
                                    selectedRecord[event.target.name] = value.slice(0, index) + value.slice(index + value.slice(index).indexOf(",") + 1)
                                } else {
                                    selectedRecord[event.target.name] = value.slice(0, index - 1)
                                }

                            }
                        }

                    } else {
                        selectedRecord[event.target.name] = value + ',' + radiotext;
                    }

                } else {
                    selectedRecord[event.target.name] = radiotext;
                }

            }

        }
        else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = radiotext;
        }
        else {
            selectedRecord[event.target.name] = conditionBasedInput(control, event.target.value, radiotext, event.target.defaultValue)
            // if (control.isnumeric === true
            //      && control.label===radiotext) {
            //     selectedRecord[event.target.name] = event.target.value.replace(/[^0-9]/g, '');
            // } else {
            //     selectedRecord[event.target.name] = event.target.value;
            // }
            //  selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onInputOnSubSampleChange = (event, control, radiotext) => {
        const selectComponent = this.state.selectComponent || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === 'timeonly') {
                selectComponent['dateonly'] = false;
            }
            if (event.target.name === 'dateonly') {
                selectComponent['timeonly'] = false;
            }
            const value = selectComponent[event.target.name];
            if (value !== '' && value !== undefined) {
                if (value.includes(radiotext)) {
                    const index = value.indexOf(radiotext);
                    if (index !== -1) {
                        if (index === 0) {
                            const indexcomma = value.indexOf(",")
                            if (indexcomma !== -1) {
                                selectComponent[event.target.name] = value.slice(indexcomma + 1)

                            } else {
                                selectComponent[event.target.name] = ""
                            }
                        } else {
                            //  const  indexcomma= value.indexOf(",")
                            if (value.slice(index).indexOf(",") !== -1) {
                                selectComponent[event.target.name] = value.slice(0, index) + value.slice(index + value.slice(index).indexOf(",") + 1)
                            } else {
                                selectComponent[event.target.name] = value.slice(0, index - 1)
                            }

                        }
                    }

                } else {
                    selectComponent[event.target.name] = value + ',' + radiotext;
                }

            } else {
                selectComponent[event.target.name] = radiotext;
            }
        }
        else if (event.target.type === 'radio') {
            selectComponent[event.target.name] = radiotext;
        }
        else {
            selectComponent[event.target.name] = conditionBasedInput(control, event.target.value, radiotext, event.target.defaultValue)
            // if (control.isnumeric === true
            //     && control.label===radiotext) { 
            //             selectComponent[event.target.name] = event.target.value.replace(/[^0-9]/g, '');
            //     } else {
            //         selectComponent[event.target.name] = event.target.value;
            //     }
            // selectComponent[event.target.name] = event.target.value;
        }
        this.setState({ selectComponent });
    }

    onComboSubSampleChange = (comboData, control, customName) => {
        const selectComponent = this.state.selectComponent || {};
        if (comboData) {
            let parentList = []
            let childComboList = []
            let childColumnList = {}

            let comboName = customName || control.label;

            const inputParem = {
                child: control.child,
                source: control.source,
                primarykeyField: control.valuemember,
                value: comboData ? comboData.value : -1,
                item: comboData ? { ...comboData.item, pkey: control.valuemember, nquerybuildertablecode: control.nquerybuildertablecode, source: control.source } : "",
                label: comboData ? comboName : "",
                nameofdefaultcomp: control.name,
                screenName: "IDS_TIMEPOINT"
            }
            comboData["item"] = {
                ...comboData["item"], pkey: control.valuemember,
                nquerybuildertablecode: control.nquerybuildertablecode,
                source: control.source
            };

            if (comboData) {
                selectComponent[comboName] = comboData;
            } else {
                selectComponent[comboName] = []
            }
            if (control.child && control.child.length > 0) {
                childComboList = getSameRecordFromTwoArrays(this.state.SubSamplecomboComponents,
                    control.child, "label")
                childColumnList = {};
                childColumnList = childComboList.map(columnList => {
                    const val = comboChild(this.state.SubSamplecomboComponents,
                        columnList, childColumnList, false);
                    return val.childColumnList
                })

                parentList = getSameRecordFromTwoArrays(this.state.SubSamplewithoutCombocomponent,
                    control.child, "label")

                this.props.getChildValues(inputParem,
                    this.props.Login.userInfo, selectComponent, this.props.Login.SubSamplecomboData,
                    childComboList, childColumnList, this.state.SubSamplewithoutCombocomponent,
                    [...childComboList, ...parentList])
            } else {

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectComponent }
                }
                this.props.updateStore(updateInfo);
            }
        } else {
            const SubSamplecomboData = this.props.Login.SubSamplecomboData
            selectComponent[control.label] = "";
            if (control.child && control.child.length > 0) {
                control.child.map(temp => {
                    selectComponent[temp.label] = ""
                    delete SubSamplecomboData[temp.label]
                    const components = [...this.props.SubSamplecomboComponents, ...this.props.SubSamplewithoutCombocomponent]

                    components.map(component => {
                        if (component.label === temp.label) {
                            if (component.child && component.child.length > 0) {
                                component.child.map(temp1 => {
                                    selectComponent[temp1.label] = ""
                                    delete SubSamplecomboData[temp1.label]
                                })
                            }
                        }
                    })
                })
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectComponent, SubSamplecomboData }
            }
            this.props.updateStore(updateInfo);
        }
    }

    onNumericInputChange = (value, name) => {
        let selectedRecord = this.state.selectedRecord
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onNumericBlurSubSample = (value, control) => {
        let selectComponent = this.state.selectComponent
        if (selectComponent[control.label]) {
            if (control.max) {
                if (!(selectComponent[control.label] < parseFloat(control.max))) {
                    selectComponent[control.label] = control.precision ? parseFloat(control.max) : parseInt(control.max)
                }
            }
            if (control.min) {
                if (!(selectComponent[control.label] > parseFloat(control.min))) {
                    selectComponent[control.label] = control.precision ? parseFloat(control.min) : parseInt(control.min)
                }
            }


        }
        this.setState({ selectComponent });
    }

    onNumericInputSubSampleChange = (value, name) => {
        let selectComponent = this.state.selectComponent
        selectComponent[name] = value;
        this.setState({ selectComponent });
    }

    handleDateChangeComp = (dateValue, dateName, screenName) => {
        const { selectedRecord } = this.state;
        if (screenName === 'component') {
            const selectComponent = this.state.selectComponent;
            selectComponent[dateName] = dateValue;
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    selectComponent
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            selectedRecord[dateName] = dateValue;
            this.setState({ selectedRecord });
        }

    }

    handleDateChange = (dateValue, dateName) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        if (this.props.Login.masterData.SampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
            const ageComp = this.props.Login.withoutCombocomponent.filter(item => item.name === "Age");
            const age = ageCalculate(dateValue);
            selectedRecord[ageComp[0].label] = age;
        }
        this.setState({ selectedRecord });
    }

    handleDateSubSampleChange = (dateValue, dateName) => {
        const { selectComponent } = this.state;
        selectComponent[dateName] = dateValue;
        this.setState({ selectComponent });
    }

    componentDidUpdate(previousProps) {
        let masterStatus = this.props.masterStatus;
        // const {selectedRecord,selectedSpec,selectedTestData,selectComponent} =this.state
        let check = false;

        if (this.props.Login.selectedMaster !== this.PrevoiusLoginData.Login.selectedMaster) {
            this.setState({ selectedMaster: this.props.Login.selectedMaster });
            check = true;

        }
        if (this.props.Login.selectedRecord !== this.PrevoiusLoginData.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
            check = true
        }
        if (this.props.Login.selectedSpec !== this.PrevoiusLoginData.Login.selectedSpec) {

            const specBasedComponent = this.props.Login.selectedSpec["nallottedspeccode"] &&
                this.props.Login.selectedSpec["nallottedspeccode"].item.ncomponentrequired === transactionStatus.YES ? true : false
            // const specBasedTestPackage = this.props.Login.userRoleControlRights &&
            //     this.props.Login.userRoleControlRights !== undefined ? true : false
            const specBasedTestPackage = this.props.Login.userRoleControlRights &&
                this.props.Login.userRoleControlRights[formCode.TESTPACKAGE] !== undefined ? true : false

            this.subSampleDataGridList = []
            this.subSampleDataDetailGridList = []
            if (specBasedComponent) {
                this.subSampleDataGridList = [
                    { "idsName": this.props.Login.genericLabel ? 
                    this.props.Login.genericLabel["SubSample"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]
                    :"IDS_COMPONENT", "dataField": "scomponentname", width: "200px" }
                ]
            }

            this.props.Login.masterData.SubSampleTemplate &&
                this.props.Login.masterData.SubSampleTemplate.jsondata.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            // let label = ''
                            if (component.hasOwnProperty("children")) {
                                component.children.map(componentrow => {
                                    if (componentrow.mandatory === true) {
                                        // label = label + '&' + componentrow.label
                                        this.subSampleDataGridList.push({
                                            "mandatory": true,
                                            //"idsName": componentrow.label, 
                                            "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                            "dataField": componentrow.label, width: "150px"
                                        })
                                    } else {
                                        this.subSampleDataDetailGridList.push({
                                            "mandatory": false,
                                            //"idsName": componentrow.label, 
                                            "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                            "dataField": componentrow.label, width: "50px", columnSize: "2"
                                        })
                                    }
                                    return this.subSampleDataGridList;
                                })
                            } else {
                                if (component.mandatory) {
                                    this.subSampleDataGridList.push({
                                        "mandatory": true,// "idsName": component.label,
                                        "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                        "dataField": component.label, width: "150px",
                                    });
                                } else {
                                    this.subSampleDataDetailGridList.push({
                                        "mandatory": false,
                                        //"idsName": componentrow.label, 
                                        "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                        "dataField": component.label, width: "50px", columnSize: "2"
                                    })
                                }
                                return this.subSampleDataGridList
                            }
                            // if (label !== '') {
                            //     this.subSampleDataGridList.push({ "mandatory": true, "idsName": label.substring(1), "dataField": label.substring(1),width: "150px" })
                            // }
                        })

                    })
                })

            this.setState({
                selectedSpec: this.props.Login.selectedSpec,
                specBasedComponent, specBasedTestPackage
            });
            check = true
        }
        if (this.props.Login.selectedTestData !== this.PrevoiusLoginData.Login.selectedTestData) {
            this.setState({ selectedTestData: this.props.Login.selectedTestData });
            check = true
        }
        if (this.props.Login.selectedTestPackageData !== this.PrevoiusLoginData.Login.selectedTestPackageData) {
            this.setState({ selectedTestPackageData: this.props.Login.selectedTestPackageData });
            check = true
        }
        if (this.props.Login.selectComponent !== this.PrevoiusLoginData.Login.selectComponent) {
            this.setState({ selectComponent: this.props.Login.selectComponent });
            check = true
        }
        if (this.props.Login.selectPackage !== this.PrevoiusLoginData.Login.selectPackage) {
            this.setState({ selectPackage: this.props.Login.selectPackage });
            check = true
        }
        if (this.props.Login.selectSection !== this.PrevoiusLoginData.Login.selectSection) {
            this.setState({ selectSection: this.props.Login.selectSection });
            check = true
        }
        if (this.props.Login.specBasedComponent !== this.PrevoiusLoginData.Login.specBasedComponent) {
            this.setState({ specBasedComponent: this.props.Login.specBasedComponent });
            check = true
        }
        if (this.props.Login.specBasedTestPackage !== this.PrevoiusLoginData.Login.specBasedTestPackage) {
            this.setState({ specBasedTestPackage: this.props.Login.specBasedTestPackage });
            check = true
        }

        if (this.props.Login.SubSamplewithoutCombocomponent !== this.PrevoiusLoginData.Login.SubSamplewithoutCombocomponent) {
            this.setState({ SubSamplewithoutCombocomponent: this.props.Login.SubSamplewithoutCombocomponent });
            check = true
        }
        if (this.props.Login.SubSamplecomboComponents !== this.PrevoiusLoginData.Login.SubSamplecomboComponents) {
            this.setState({ SubSamplecomboComponents: this.props.Login.SubSamplecomboComponents });
            check = true
        }
        if (this.props.Login.parentSubSampleColumnList !== this.PrevoiusLoginData.Login.parentSubSampleColumnList) {
            this.setState({ parentSubSampleColumnList: this.props.Login.parentSubSampleColumnList });
            check = true
        }

        if (this.state.export) {
            this._excelExportHeader.save()
            this.setState({ export: false })
        }


        if (check) {
            this.PrevoiusLoginData = previousProps
        }
        if (masterStatus !== "" && masterStatus !== undefined) {
            toast.info(masterStatus);
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { masterStatus: "" }
            }
            this.props.updateStore(updateInfo);
            masterStatus = "";
        }
        if (this.props.innerPopup !== this.state.innerTop) {
            setTimeout(() => {
                let scrollDoc = this.props.modalEvent && this.props.modalEvent.id ? document.getElementById(this.props.modalEvent.id) : null;
                if (this.myRef && this.myRef.current) {
                    this.myRef.current.scrollIntoView({ behavior: 'smooth' })
                }
                if (scrollDoc) {
                    scrollDoc.scrollIntoView({ behavior: 'smooth' })
                }
            }, 100)
            this.setState({
                innerTop: this.props.innerPopup
            })
        }
    }

    openFilter = () => {
        let showFilter = !this.state.showFilter
        this.setState({
            showFilter
        })
    }

    closeFilter = () => {

        this.setState({
            showFilter: false
        })
    }

    AddSpec = (e) => {
        // this.setState({
        //     loadSpec: true
        // })
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadSpec: true,
                screenName: this.props.intl.formatMessage({ id: "IDS_SPECIFICATION" })
            }
        }
        this.props.updateStore(updateInfo);
    }
    //ALPD-3596 Start

    testForImport = (needTest) => {
        const selectedSpecification = {
            nallottedspeccode: this.state.selectedSpec["nallottedspeccode"] ? this.state.selectedSpec["nallottedspeccode"].value : -1,
            slno: 1
        };
        this.getTestForImport(selectedSpecification, this.props.Login,
            (this.props.Login.masterData
                && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample), this.state.selectedRecord, needTest, this.state.specBasedComponent);
    }
    getTestForImport = (objComponent, LoginProps, nneedsubsample, selectedRecord, needTest, specBasedComponent) => {
        if (!this.state.specBasedComponent) {
            const urlArray = []
            const TestGet = rsapi.post("/registration/getTestfromDB", {
                nspecsampletypecode: objComponent.nspecsampletypecode,
                slno: objComponent.slno,
                nneedsubsample: nneedsubsample,
                nallottedspeccode: objComponent.nallottedspeccode,
                specBasedComponent: specBasedComponent,

            });
            urlArray[0] = TestGet;
            Axios.all(urlArray).then(response => {

                let TestData = response[0].data;
                let Test = LoginProps.Test || [];
                let componentTest = Test[objComponent.slno] ? Test[objComponent.slno] : [];
                let TestCombinedForImport = filterRecordBasedOnTwoArrays(TestData, componentTest, "ntestcode");
                selectedRecord['importTest'] = needTest ? transactionStatus.YES : transactionStatus.NO;
                this.setState({
                    TestCombinedForImport,
                    // AllTest: TestData,
                    // screenName: intl.formatMessage({ id: "IDS_IMPORT" }),
                    selectedTestData: [],
                    selectedRecord: selectedRecord,
                    // loadImportFileData: true,
                    loading: false,
                });
            })
                .catch(error => {
                    toast.error(error.message);
                    this.setState({ loading: false });
                })

        }

    }
    //ALPD-3596 End

    AddImportFile = (selectedRecord) => {

        if (this.state.selectedSpec.nallottedspeccode) {
            //ALPD-3596 
            selectedRecord['importTest'] = transactionStatus.YES;
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadImportFileData: true,
                    screenName: this.props.intl.formatMessage({ id: "IDS_IMPORT" }),
                    selectedRecord: selectedRecord 		//ALPD-3596
                }
            }
            this.props.updateStore(updateInfo);

        } else {

            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }))
        }
    }
    AddSampleCount = (e) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadImportSampleCountData: true,
                screenName: this.props.intl.formatMessage({ id: "IDS_SAMPLECOUNT" })
            }
        }
        this.props.updateStore(updateInfo);
    }
    // addTestslide = (e) => {
    //     this.setState({
    //         loadTest: true
    //     })
    // }

    addTestslide = (selectedComponent, nneedsubsample, componentBasedSpec) => {

        if (this.state.selectedSpec.nallottedspeccode !== undefined
            && this.state.selectedSpec.nallottedspeccode !== "") {
            let isValid = true;
            const selectedSpecification = {
                nallottedspeccode: this.state.selectedSpec["nallottedspeccode"] ? this.state.selectedSpec["nallottedspeccode"].value : -1,
                slno: 1
            };
            let selectedRecord = selectedComponent;
            //  if(componentBasedSpec){
            if (nneedsubsample) {
                if (selectedComponent && Object.keys(selectedComponent).length > 0) {
                    delete selectedComponent["selected"];
                }
                else {
                    isValid = false;
                }
            }
            else {
                selectedRecord = selectedSpecification;
            }
            // }
            // else{
            //     selectedRecord = selectedSpecification;          
            // }

            if (isValid) {
                this.props.getTest(selectedRecord, this.props.Login, nneedsubsample, componentBasedSpec);
            }
            else {
                toast.info(this.props.intl.formatMessage({ id: nneedsubsample ? "IDS_SELECTSUBSAMPLETOADDTEST" : "IDS_SELECTCOMPONENTTOADDTEST" }));
            }
            // } 
            // else {
            //     const selectedComponent1 = {
            //         nallottedspeccode: this.state.selectedSpec["nallottedspeccode"] ? this.state.selectedSpec["nallottedspeccode"].value : -1,
            //         slno: 1
            //     }
            //     this.props.getTest(selectedComponent1,
            //         this.props.Login,
            //         nneedsubsample, specBasedComponent);
            // }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ADDSPECIFICATION" }));
        }
    }

    closeSpec = (e) => {
        // this.setState({
        //     loadSpec: false,
        //      selectedRecord: { ...this.state.selectedRecord, ...this.state.selectedSpec },
        //      screenName:"Specification"
        // })
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadSpec: false,
                selectedRecord: { ...this.state.selectedRecord, ...this.state.selectedSpec },
                screenName: this.props.screenName
            }
        }
        this.props.updateStore(updateInfo);
    }
    closeImportFileData = (e) => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedTestData: {}, 		//ALPD-3596 
                loadImportFileData: false,
                TestCombinedForImport: [], 		//ALPD-3596 
                selectedRecord: { ...{ ...this.state.selectedRecord, sfilename: undefined }, ...this.state.selectedSpec },
                screenName: this.props.screenName
            }
        }
        this.props.updateStore(updateInfo);
    }

    closeImportSampleCountData = (e) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadImportSampleCountData: false,
                selectedRecord: { ...this.state.selectedRecord, ...this.state.selectedSpec },
                screenName: this.props.screenName
            }
        }
        this.props.updateStore(updateInfo);
    }

    closeKendoFilter = (e) => {
        // this.setState({
        //     loadSpec: false,
        //      selectedRecord: { ...this.state.selectedRecord, ...this.state.selectedSpec },
        //      screenName:"Specification"
        // })
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadCustomSearchFilter: false,
                screenName: this.props.Login.addMaster === true
                    ? this.props.Login.selectedControl[this.props.Login.masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]
                    : this.props.screenName,
                kendoFilter: { logic: "and", filters: [] },
                kendoSkip: 0,
                kendoTake: 5,
                awesomeConfig: undefined,
                awesomeTree: undefined
            }
        }
        this.props.updateStore(updateInfo);
        // this.setState({ kendoFilter: { logic: "and", filters: [], kendoSkip: 0, kendoTake: 5 } })
    }




    closeAddMaster = (e) => {
        let masterIndex = this.props.Login.masterIndex
        let updateInfo = {}
        if (masterIndex !== 0) {

            const screenName = this.props.Login.selectedControl[masterIndex - 1].displayname[this.props.Login.userInfo.slanguagetypecode]
            const selectedMaster = removeIndex(this.props.Login.selectedMaster, masterIndex)
            const selectedControl = removeIndex(this.props.Login.selectedControl, masterIndex)
            const masterextractedColumnList = this.props.Login.masterextractedColumnList && removeIndex(this.props.Login.masterextractedColumnList, masterIndex)
            const masterfieldList = this.props.Login.masterfieldList && removeIndex(this.props.Login.masterfieldList, masterIndex)
            const masterdataList = this.props.Login.masterdataList && removeIndex(this.props.Login.masterdataList, masterIndex)
            const mastercomboComponents = this.props.Login.mastercomboComponents && removeIndex(this.props.Login.mastercomboComponents, masterIndex)
            const masterComboColumnFiled = this.props.Login.masterComboColumnFiled && removeIndex(this.props.Login.masterComboColumnFiled, masterIndex)
            const masterwithoutCombocomponent = this.props.Login.masterwithoutCombocomponent && removeIndex(this.props.Login.masterwithoutCombocomponent, masterIndex)
            const masterDesign = this.props.Login.masterDesign && removeIndex(this.props.Login.masterDesign, masterIndex)
            const masterOperation = this.props.Login.masterOperation && removeIndex(this.props.Login.masterOperation, masterIndex)
            const masterEditObject = this.props.Login.masterEditObject && removeIndex(this.props.Login.masterEditObject, masterIndex)
            masterIndex = masterIndex - 1;


            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    selectedMaster,
                    selectedControl,
                    masterextractedColumnList,
                    masterfieldList,
                    masterdataList,
                    mastercomboComponents,
                    masterwithoutCombocomponent,
                    masterComboColumnFiled,
                    masterDesign,
                    masterIndex,
                    screenName,
                    masterOperation,
                    masterEditObject,
                }

            }

        } else {
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    selectedMaster: [],
                    selectedControl: [],
                    masterextractedColumnList: [],
                    masterfieldList: [],
                    addMaster: false,
                    masterdataList: [],
                    mastercomboComponents: [],
                    masterwithoutCombocomponent: [],
                    masterComboColumnFiled: [],
                    masterDesign: [],
                    masterEditObject: [],
                    masterOperation: [],
                    masterIndex: undefined,
                    screenName: this.props.Login.loadSubSample ? "IDS_TIMEPOINT" :
                        this.props.screenName,


                }
            }
        }

        this.props.updateStore(updateInfo);
    }

    closeDynamicView = (e) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                isDynamicViewSlideOut: false,
                selectedDynamicViewControl: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    closeComponent = (e) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadComponent: false,
                selectComponent: {}
            }
        }
        this.props.updateStore(updateInfo);
    }

    closeTest = (e) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadTest: false,
                selectedTestData: {},
                selectPackage: {},
                screenName: this.props.screenName,
                TestCombined: [],

            }
        }
        this.props.updateStore(updateInfo);
    }

    closeSubSample = (e) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadSubSample: false,
                selectedSubSample: {},
                showSaveContinue: false,
                selectComponent: {},
                selectedTestData: {},
                selectPackage: {},
                screenName: this.props.screenName,
                masterStatus: "",
                TestPackage: [],
                //Test:[]
                TestCombined: [],


            }
        }
        this.props.updateStore(updateInfo);
    }

    onspecChange = (event, fieldName) => {
        if (event !== null) {
            const selectedRecord = this.state.selectedRecord;
            // const oldpromarycode = this.state.selectedRecord["nallottedspeccode"] !== undefined ?
            //     this.state.selectedRecord["nallottedspeccode"].value : undefined;
            selectedRecord["sversion"] = parseInt(event.item.sversion);
            selectedRecord["nallottedspeccode"] = event;
            //  if(this.props.Login.Component.length=== 0 ){
            this.setState({ selectedRecord });
            // }else{
            //     if(event.value!== oldpromarycode ){
            //     this.confirmMessage.confirm("confirmation", "Confirmation!", "Do You Want to clear the Existing Components ?",
            //     "ok", "cancel", () => this.setState({ selectedRecord }));
            //     }
            // }

        }
    }

    onTreeClick = (event) => {
        const inputParam = {
            methodUrl: "TestGroupSpecification",
            screenName: "IDS_REGISTRATION",
            operation: "get",
            activeKey: event.key,
            focusKey: event.key,
            keyName: "treetemplatemanipulation",
            userinfo: this.props.Login.userInfo,
            selectedNode: event.item,
            selectedRecord: this.state.selectedRecord,
            ntestgroupspecrequired: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue ? 
                           this.props.Login.masterData.RealRegSubTypeValue.ntestgroupspecrequired ? transactionStatus.YES : 
                           transactionStatus.NO : transactionStatus.NO,    // ALPD-5259    Added ntestgroupspecrequired key to send it to backend by Vishakh
            primaryKey: event.primaryKey
        };
        if (event.primaryKey !== this.state.selectedRecord["ntemplatemanipulationcode"]) {
            this.props.getNewRegSpecification(inputParam, this.props.Login.masterData);
        }


        // if (this.props.Login.Component === undefined || this.props.Login.Component.length === 0) {
        //     //   this.props.getRegSpecification(inputParam, this.props.Login.masterData, getComponents);
        // } else {
        //     // if(event.key!== this.props.Login.ActiveKey ){
        //     // this.confirmMessage.confirm("confirmation", "Confirmation!", "Do You Want to clear the Existing Components ?",
        //     // "ok", "cancel", () =>  this.props.getRegSpecification(inputParam, this.props.Login.masterData, getComponents));
        //     // }
        // }
    }

    handleComponentRowClick = (event) => {
        let selectedComponent = event.dataItem;
        let SelectedTest = this.props.Login.Test && this.props.Login.Test[selectedComponent.slno] ? this.props.Login.Test[selectedComponent.slno] : [];
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                SelectedTest, selectedComponent,
                testDataState: {
                    skip: 0, take: this.props.Login.settings ?
                        parseInt(this.props.Login.settings[14]) : 5
                }
            }
        }
        this.props.updateStore(updateInfo);

    };

    AddComponent = () => {
        let Map = {};
        if (this.state.selectedSpec.nallottedspeccode !== undefined
            && this.state.selectedSpec.nallottedspeccode !== "") {
            Map["ntemplatemanipulationcode"] = this.state.selectedSpec.ntemplatemanipulationcode;
            Map["nallottedspeccode"] = this.state.selectedSpec.nallottedspeccode.value;
            Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
            Map["testrequired"] = false;
            Map["userinfo"] = this.props.Login.userInfo;
            this.props.AddComponents(Map);
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
        }

    }

    onComponentChange = (comboData, fieldName, nneedsubsample) => {
        if (comboData !== null) {
            //  if (!nneedsubsample) {
            const selectComponent = this.state.selectComponent || {};
            if (fieldName === 'ntzdreceivedate') {
                selectComponent["ntzdreceivedate"] = comboData;
                this.setState({ selectComponent })
            } else {
                // const oldspecsampletypecode = selectComponent.nspecsampletypecode
                // if (oldspecsampletypecode !== comboData.item.nspecsampletypecode) {
                //     //selectComponent["nneedservice"] = true;
                // }
                selectComponent[fieldName] = comboData;
                selectComponent["Sample Name"] = comboData.label;
                selectComponent["nspecsampletypecode"] = comboData.item.nspecsampletypecode;
                // selectComponent["nneedsubsample"] = nneedsubsample;
                selectComponent["nneedsubsample"] = this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;
                this.props.componentTest(selectComponent, false, this.state.specBasedComponent,
                    this.props.Login.Component, this.state.specBasedTestPackage, this.state.specBasedTestPackage ? true : false,
                {userinfo:this.props.Login.userInfo});
            }

            // const updateInfo = {
            //     typeName: DEFAULT_RETURN,
            //     data: {
            //         selectComponent
            //     }
            // }
            // this.props.updateStore(updateInfo);
            // } else {
            //     const selectComponent = this.state.selectComponent || {};
            //     selectComponent[fieldName] = comboData;
            //     // selectComponent["nspecsampletypecode"] = comboData.item.nspecsampletypecode ?  comboData.item.nspecsampletypecode : -1;
            //     this.setState({ selectComponent })
            // }
        }

    }

    onInputComponentOnChange = (event) => {
        const selectComponent = this.state.selectComponent || {};
        if (event.target.type === 'checkbox') {
            selectComponent[event.target.name] = event.target.checked === true ? 3 : 4;
        }
        else {
            selectComponent[event.target.name] = event.target.value;
        }
        this.setState({ selectComponent })
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         selectComponent
        //     }
        // }
        // this.props.updateStore(updateInfo);
    }

    onSaveComponentClick = (saveType, formRef) => {
        const childoperation = this.props.Login.childoperation;
        if (childoperation === "create") {
            if (saveType === 1) {
                this.ComponentObjectAfterSave();
            } else if (saveType === 2) {
                this.ComponentObject();
            }
        } else {
            const Component = this.props.Login.Component;
            const Test = this.props.Login.Test;
            const testrequired = this.state.selectedRecord.ntransactionstatus;

            let selectedComponent = { ...this.state.selectComponent };
            let objcomponent = {};
            objcomponent["scomponentname"] = selectedComponent["ncomponentcode"].label;
            objcomponent["ncomponentcode"] = selectedComponent["ncomponentcode"] ? selectedComponent["ncomponentcode"].value : -1;
            const dreceiveddate = selectedComponent["dreceiveddate"];
            objcomponent["dreceiveddate"] = dreceiveddate;
            objcomponent["sreceiveddate"] = convertDateTimetoString(dreceiveddate, this.props.Login.userInfo);
            objcomponent["ntzdreceivedate"] = selectedComponent["ntzdreceivedate"] ? selectedComponent["ntzdreceivedate"].value : -1;
            objcomponent["stzdreceivedate"] = selectedComponent["ntzdreceivedate"] ? selectedComponent["ntzdreceivedate"].label : "";
            objcomponent["jsondata"] = ""
            selectedComponent = { ...selectedComponent, ...objcomponent }

            const index = Component.findIndex(x => x.slno === selectedComponent.slno);
            if (index > -1) {
                Component.splice(index, 1, selectedComponent);
            }
            if (testrequired === 3) {
                this.props.getTestByComponentChange(Component, selectedComponent, this.props.Login);
            }
            else if (selectedComponent["nneedservice"] === true) {
                this.props.getTestByComponentChange(Component, selectedComponent, this.props.Login, true);
            } else {
                delete selectedComponent.nneedservice;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        Component, selectedComponent: selectedComponent, loadComponent: false, openChildModal: false,
                        selectComponent: undefined, parentPopUpSize: "xl", Test, SelectedTest: Test[selectedComponent.slno]
                    }
                }
                this.props.updateStore(updateInfo);
            }
        }

    }

    ComponentObjectAfterSave() {
        const testrequired = this.state.selectedRecord.ntransactionstatus;
        let objcomponent = this.state.selectComponent;
        delete objcomponent.nneedservice;

        if (testrequired === 3) {
            this.props.getTestfromDB(objcomponent, this.props.Login, 2);
        } else {
            const Component = this.props.Login.Component || [];
            let saveComponent = { ...objcomponent };
            saveComponent["slno"] = this.props.Login.Component ? Object.keys(this.props.Login.Component).length + 1 : 1;
            saveComponent["scomponentname"] = objcomponent["ncomponentcode"].label;
            saveComponent["ncomponentcode"] = objcomponent["ncomponentcode"] ? objcomponent["ncomponentcode"].value : -1;
            const dreceiveddate = objcomponent["dreceiveddate"];
            saveComponent["dreceiveddate"] = dreceiveddate;
            saveComponent["sreceiveddate"] = convertDateTimetoString(dreceiveddate, this.props.Login.userInfo);
            saveComponent["nallottedspeccode"] = objcomponent["nallottedspeccode"] ? objcomponent["nallottedspeccode"] : -1;
            saveComponent["ntzdreceivedate"] = objcomponent["ntzdreceivedate"] ? objcomponent["ntzdreceivedate"].value : -1;
            saveComponent["stzdreceivedate"] = objcomponent["ntzdreceivedate"] ? objcomponent["ntzdreceivedate"].label : "";
            saveComponent["jsondata"] = ""
            Component.unshift(saveComponent);
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    Component, openChildModal: false, selectedComponent: saveComponent,
                    SelectedTest: [], selectComponent: {}, showSaveContinue: false, loadComponent: false, parentPopUpSize: "xl"
                }
            }
            this.props.updateStore(updateInfo);
        }
    }

    ComponentObject() {
        const testrequired = this.state.selectedRecord.ntransactionstatus;
        let objcomponent = this.state.selectComponent;
        delete objcomponent.nneedservice;
        let objcomponent1 = { ...this.state.selectComponent };
        if (testrequired === 3) {
            this.props.getTestfromDB(objcomponent, this.props.Login, 1);
        } else {
            const Component = this.props.Login.Component || [];
            let saveComponent = { ...objcomponent };
            saveComponent["scomponentname"] = objcomponent["ncomponentcode"].label;
            saveComponent["slno"] = this.props.Login.Component ? Object.keys(this.props.Login.Component).length + 1 : 1;
            saveComponent["ncomponentcode"] = objcomponent["ncomponentcode"] ? objcomponent["ncomponentcode"].value : -1;
            const dreceiveddate = objcomponent["dreceiveddate"];
            saveComponent["dreceiveddate"] = dreceiveddate;
            saveComponent["sreceiveddate"] = convertDateTimetoString(dreceiveddate, this.props.Login.userInfo);
            saveComponent["ntzdreceivedate"] = objcomponent["ntzdreceivedate"] ? objcomponent["ntzdreceivedate"].value : -1;
            saveComponent["stzdreceivedate"] = objcomponent["ntzdreceivedate"] ? objcomponent["ntzdreceivedate"].label : "";
            saveComponent["nallottedspeccode"] = objcomponent["nallottedspeccode"] ? objcomponent["nallottedspeccode"] : -1;
            saveComponent["jsondata"] = ""
            Component.unshift(saveComponent);
            objcomponent1["scomments"] = "";
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { Component, selectedComponent: saveComponent, SelectedTest: [], selectComponent: objcomponent1 }
            }
            this.props.updateStore(updateInfo);
        }
    }

    onTestPackageChange = (comboData, fieldName, nneedsubsample, action) => {
        const selectPackage = this.state.selectPackage || {};
        const selectedTestData = this.state.selectedTestData || {};
        const selectSection = this.state.selectSection;

        if (comboData !== null) {
            selectPackage[fieldName] = comboData;
            selectPackage["stestpackagename"] = comboData.label;
            //selectPackage["ntestpackagecode"] = comboData.item.ntestpackagecode;
            // this.props.testPackageTest(Object.keys(this.props.Login.selectedComponent).length!==0?this.props.Login.selectedComponent:this.state.selectedSpec.nallottedspeccode.item, false, this.state.specBasedComponent,
            //     this.props.Login.Component, this.state.specBasedTestPackage, this.state.specBasedTestPackage ? true : false, this.state.selectComponent,
            //     this.props.Login.selectedComponent, this.props.Login,selectPackage,false,this.state.selectedSpec.nallottedspeccode,this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample
            //     );
            const selectedComponentData = this.props.Login.selectedComponent ?
                Object.keys(this.props.Login.selectedComponent).length !== 0
                    ? this.props.Login.selectedComponent : this.state.selectedSpec.nallottedspeccode.item
                : this.state.selectedSpec.nallottedspeccode.item;
            this.props.testPackageTest(selectedComponentData, false, this.state.specBasedComponent,
                this.props.Login.Component, this.state.selectComponent, this.props.Login.selectedComponent,
                this.props.Login, selectPackage, selectSection, false, this.state.selectedSpec.nallottedspeccode,
                this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample, action
            );

        }
        else {
            let availableTest = [];
            let availableTestSection = [];
            if (selectPackage["ntestpackagecode"]) {
                //ALPD-3404
                delete selectPackage["ntestpackagecode"];
                delete selectedTestData["ntestgrouptestcode"];
                delete selectSection["nsectioncode"];
                let Test = (action !== "AddSubSample") ? (this.props.Login.Test || []) : [];

                let testData = this.props.Login.AllTest || [];

                // ALPD-4919, Added condition to when this.props.Login.selectedComponent is undefined then should return empty array
                let componentTest = this.props.Login.selectedComponent && Test[this.props.Login.selectedComponent.slno] ? Test[this.props.Login.selectedComponent.slno] : [];

                availableTest = filterRecordBasedOnTwoArrays(testData, componentTest, "ntestcode");
                availableTestSection = this.props.Login.AllSection || [];

            }
            else {
                availableTest = this.props.Login.TestCombined || [];
                availableTestSection = this.props.Login.AllSection || [];

            }

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedTestData: {}, selectPackage, selectSection, TestCombined: availableTest, TestSection: availableTestSection }
            }
            this.props.updateStore(updateInfo);
        }

    }
    //ALPD-3404
    onTestSectionChange = (comboData, fieldName, nneedsubsample, action) => {
        const selectPackage = this.state.selectPackage;
        const selectSection = this.state.selectSection || {};
        const selectedTestData = this.state.selectedTestData || {};

        if (comboData !== null) {
            selectSection[fieldName] = comboData;
            selectSection["ssectionname"] = comboData.label;
            //selectPackage["ntestpackagecode"] = comboData.item.ntestpackagecode;
            // this.props.testPackageTest(Object.keys(this.props.Login.selectedComponent).length!==0?this.props.Login.selectedComponent:this.state.selectedSpec.nallottedspeccode.item, false, this.state.specBasedComponent,
            //     this.props.Login.Component, this.state.specBasedTestPackage, this.state.specBasedTestPackage ? true : false, this.state.selectComponent,
            //     this.props.Login.selectedComponent, this.props.Login,selectPackage,false,this.state.selectedSpec.nallottedspeccode,this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample
            //     );
            const selectedComponentData = this.props.Login.selectedComponent ?
                Object.keys(this.props.Login.selectedComponent).length !== 0
                    ? this.props.Login.selectedComponent : this.state.selectedSpec.nallottedspeccode.item
                : this.state.selectedSpec.nallottedspeccode.item;
            this.props.testSectionTest(selectedComponentData, false, this.state.specBasedComponent,
                this.props.Login.Component, this.state.selectComponent, this.props.Login.selectedComponent,
                this.props.Login, selectPackage, selectSection, false, this.state.selectedSpec.nallottedspeccode,
                this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample, action
            );

        }
        else {
            let availableTest = [];
            if (selectSection["nsectioncode"]) {
                delete selectSection["nsectioncode"];
                delete selectedTestData["ntestgrouptestcode"];
                let Test = (action !== "AddSubSample") ? (this.props.Login.Test || []) : [];

                let testData = this.props.Login.AllTest || [];

                // ALPD-4919, Added condition to when this.props.Login.selectedComponent is undefined then should return empty array
                let componentTest = this.props.Login.selectedComponent && Test[this.props.Login.selectedComponent.slno] ? Test[this.props.Login.selectedComponent.slno] : [];

                availableTest = selectPackage['ntestpackagecode'] ? this.props.Login.TestPakageTest || []
                    : filterRecordBasedOnTwoArrays(testData, componentTest, "ntestcode");

            }
            else {
                availableTest = this.props.Login.TestCombined || [];

            }

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedTestData: {}, selectSection, TestCombined: availableTest, TestSection: this.props.Login.TestSection || [] }
            }
            this.props.updateStore(updateInfo);
        }

    }

    onSaveSubSampleClick = (saveType, formRef) => {
        const childoperation = this.props.Login.childoperation;
        if (childoperation === "create") {
            if (saveType === 1) {
                this.SubSampleObjectAfterSave();
            } else if (saveType === 2) {
                this.SubSampleObject();
            }
        } else {
            const Component = this.props.Login.Component;
            const Test = this.props.Login.Test;
            const testrequired = this.state.selectedRecord.ntransactionstatus;
            let selectedComponent = { ...this.state.selectComponent };
            let objcomponent = {};
            objcomponent["slno"] = selectedComponent["slno"] ? selectedComponent["slno"] : ""
            const subSampleDetail = getRegistrationSubSample(selectedComponent,
                this.props.Login.masterData.SubSampleTemplate.jsondata, this.props.Login.userInfo,
                this.props.Login.defaulttimezone, true, this.state.specBasedComponent, this.state.selectedSpec)

            objcomponent = { ...objcomponent, ...subSampleDetail.sampleRegistration }

            let subSampleDataGridList = this.props.Login.subSampleDataGridList || []
            const index1 = subSampleDataGridList.findIndex(x => x.slno === objcomponent.slno)
            if (index1 !== -1)
                subSampleDataGridList[index1] = { ...objcomponent['jsonuidata'], ...objcomponent }
            selectedComponent = { ...objcomponent }
            const index = Component.findIndex(x => x.slno === selectedComponent.slno);
            if (index > -1) {
                Component.splice(index, 1, selectedComponent);
            }
            if (testrequired === 3) {
                this.props.getTestByComponentChange(Component, selectedComponent, this.props.Login);
            }
            else if (selectedComponent["nneedservice"] === true) {
                this.props.getTestByComponentChange(Component, selectedComponent, this.props.Login, true);
            } else {
                delete selectedComponent.nneedservice;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        Component,
                        selectedComponent: selectedComponent,
                        loadSubSample: false, openChildModal: false,
                        selectComponent: {}, parentPopUpSize: "xl",
                        Test, SelectedTest: Test[selectedComponent.slno],
                        screenName: this.props.screenName,
                        subSampleDataGridList
                    }
                }
                this.props.updateStore(updateInfo);
            }
        }

    }

    SubSampleObjectAfterSave() {
        const testrequired = this.state.selectedRecord.ntransactionstatus;
        let objcomponent = this.state.selectComponent;
        delete objcomponent.nneedservice;
        // const defaulttimezone = this.props.Login.defaulttimezone;
        // const userInfo = this.props.Login.userInfo;
        if (testrequired === 3) {
            this.props.getTestfromDB(objcomponent, this.props.Login, 2);
        } else {
            const Component = this.props.Login.Component || [];
            let saveComponent = {};
            saveComponent["slno"] = this.props.Login.Component ? Object.keys(this.props.Login.Component).length + 1 : 1;
            const subSampleDetail = getRegistrationSubSample(objcomponent,
                this.props.Login.masterData.SubSampleTemplate.jsondata, this.props.Login.userInfo,
                this.props.Login.defaulttimezone, true, this.state.specBasedComponent, this.state.selectedSpec)

            saveComponent = { ...saveComponent, ...subSampleDetail.sampleRegistration }

            let subSampleDataGridList = this.props.Login.subSampleDataGridList || []
            // START ALPD-3673 VISHAKH
            let dateList = subSampleDetail.dateList;
            let subSampleCurrentDataGridList = { ...saveComponent['jsonuidata'], ...saveComponent };
            if (dateList && dateList.length > 0 && subSampleCurrentDataGridList) {
                dateList.map(dateLst => {
                    if (subSampleCurrentDataGridList.hasOwnProperty(dateLst)) {
                        subSampleCurrentDataGridList[dateLst] = convertDateTimetoString(new Date(subSampleCurrentDataGridList[dateLst]), this.props.Login.userInfo);
                    }
                })
            }
            subSampleDataGridList.push(subSampleCurrentDataGridList);
            Component.unshift(saveComponent);

            let selectedTestData = this.state.selectedTestData["ntestgrouptestcode"];
            const selectedTestArray = [];
            selectedTestData && selectedTestData.map((item) => {
                item.item['slno'] = saveComponent.slno;
                return selectedTestArray.push(item.item);
            });
            const Test = this.props.Login.Test || [];
            const ArrayTest = Test[saveComponent.slno] ? Test[saveComponent.slno] : [];
            Test[saveComponent.slno] = [...ArrayTest, ...selectedTestArray]

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    Component, openChildModal: false,
                    selectedComponent: saveComponent,
                    loadSubSample: false,
                    selectComponent: {},
                    showSaveContinue: false,
                    parentPopUpSize: "xl",
                    SelectedTest: Test[saveComponent.slno],
                    Test: Test, selectedTestData: {},
                    screenName: this.props.screenName,
                    subSampleDataGridList,
                    masterStatus: "", selectedComponentWithFile: objcomponent,

                }
            }
            this.props.updateStore(updateInfo);
        }
    }

    SubSampleObject() {
        const testrequired = this.state.selectedRecord.ntransactionstatus;
        let objcomponent = this.state.selectComponent;
        delete objcomponent.nneedservice;
        let objcomponent1 = { ...this.state.selectComponent };
        // const defaulttimezone = this.props.Login.defaulttimezone;
        // const userInfo = this.props.Login.userInfo;
        if (testrequired === 3) {
            this.props.getTestfromDB(objcomponent, this.props.Login, 1);
        } else {
            const Component = this.props.Login.Component || [];
            let saveComponent = {};
            // if(this.props.specBasedComponent){
            //     saveComponent["scomponentname"] = objcomponent["ncomponentcode"].label;
            //     saveComponent["ncomponentcode"] = objcomponent["ncomponentcode"] ? objcomponent["ncomponentcode"].value : -1;
            //     saveComponent["nspecsampletypecode"] = objcomponent["nspecsampletypecode"] ?objcomponent["nspecsampletypecode"]  : -1;
            // }else{
            //     saveComponent["nspecsampletypecode"] = this.state.selectedSpec["nallottedspeccode"] ? this.state.selectedSpec["nallottedspeccode"]['item'].nspecsampletypecode : -1;
            // }
            saveComponent["slno"] = this.props.Login.Component ? Object.keys(this.props.Login.Component).length + 1 : 1;


            const subSampleDetail = getRegistrationSubSample(objcomponent,
                this.props.Login.masterData.SubSampleTemplate.jsondata, this.props.Login.userInfo,
                this.props.Login.defaulttimezone, true, this.state.specBasedComponent,
                this.state.selectedSpec)

            saveComponent = { ...saveComponent, ...subSampleDetail.sampleRegistration }

            let subSampleDataGridList = this.props.Login.subSampleDataGridList || []
            // START ALPD-3673 VISHAKH
            let dateList = subSampleDetail.dateList;
            let subSampleCurrentDataGridList = { ...saveComponent['jsonuidata'], ...saveComponent };
            if (dateList && dateList.length > 0 && subSampleCurrentDataGridList) {
                dateList.map(dateLst => {
                    if (subSampleCurrentDataGridList.hasOwnProperty(dateLst)) {
                        subSampleCurrentDataGridList[dateLst] = convertDateTimetoString(new Date(subSampleCurrentDataGridList[dateLst]), this.props.Login.userInfo);
                    }
                })
            }
            subSampleDataGridList.push(subSampleCurrentDataGridList);
            // subSampleDataGridList.push({ ...saveComponent['jsonuidata'], ...saveComponent })
            // END ALPD-3673 VISHAKH

            Component.unshift(saveComponent);
            // objcomponent1["scomments"] = "";
            //objcomponent1["ssubsamplename"] = "";

            let selectedTestData = this.state.selectedTestData["ntestgrouptestcode"] ? JSON.parse(JSON.stringify(this.state.selectedTestData["ntestgrouptestcode"])) : this.state.selectedTestData["ntestgrouptestcode"];
            let selectedTestArray = [];
            selectedTestData && selectedTestData.map((item) => {
                item.item['slno'] = saveComponent.slno;
                return selectedTestArray.push(item.item);
            });
            // selectedTestArray.map((item,i)=>{
            //     selectedTestArray[i]['slno']=saveComponent.slno;
            // })
            let Test = this.props.Login.Test || [];

            const ArrayTest = Test[saveComponent.slno] ? Test[saveComponent.slno] : [];

            Test[saveComponent.slno] = [...ArrayTest, ...selectedTestArray]

            const updateInfo = {
                Component, selectedComponent: saveComponent,
                selectComponent: objcomponent1,
                TestCombined: this.props.Login.TestCombined,
                //selectComponent:C.saveContinueData,
                SelectedTest: Test[saveComponent.slno],
                Test: Test, subSampleDataGridList,
                //selectedTestData: {}
                specBasedTestPackage: this.state.specBasedTestPackage,
                saveContinueData: this.props.Login.saveContinueData,
                selectedComponentWithFile: objcomponent
            }

            this.addSubSampleSaveContinue(updateInfo, selectedTestData)
            // const updateInfo = {
            //     typeName: DEFAULT_RETURN,
            //     data: {
            //         Component, selectedComponent: saveComponent,
            //         selectComponent: objcomponent1,
            //         SelectedTest: Test[saveComponent.slno],
            //         Test: Test, selectedTestData: {}
            //     }
            // }
            // this.props.updateStore(updateInfo);
        }
    }

    addSubSampleSaveContinue = (updateInfo, selectedTestData) => {
        const Map = {}
        Map["ntemplatemanipulationcode"] = this.state.selectedSpec.ntemplatemanipulationcode;
        Map["nallottedspeccode"] = this.state.selectedSpec.nallottedspeccode.value;
        Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue &&
            this.props.Login.masterData.RealRegTypeValue.nregtypecode || -1;
        Map["testrequired"] = false;
        Map["userinfo"] = this.props.Login.userInfo;
        Map["nneedsubsample"] = true;
        Map["nspecsampletypecode"] = updateInfo.selectedComponent["nspecsampletypecode"] ?
            updateInfo.selectedComponent["nspecsampletypecode"] : -1
        this.props.addSubSampleSaveContinue(updateInfo, Map, this.state.specBasedComponent,
            this.props.Login.Components, selectedTestData, this.props.Login.lstComponent, this.props.Login)
    }

    editComponent = (editselectedcomponent) => {
        let inputData = {};
        let objComponent = { ...editselectedcomponent };
        inputData["ntemplatemanipulationcode"] = this.state.selectedSpec.ntemplatemanipulationcode;
        inputData["nallottedspeccode"] = this.state.selectedSpec.nallottedspeccode.value;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
        this.props.EditComponent(inputData, objComponent, this.props.Login.userInfo, this.props.Login);
    }

    editSubSample = (editselectedcomponent, specBasedComponent) => {
        let inputData = {};
        let objComponent = { ...editselectedcomponent };
        const defaulttimezone = this.props.Login.defaulttimezone;
        const userInfo = this.props.Login.userInfo;
        inputData["ntemplatemanipulationcode"] = this.state.selectedSpec.ntemplatemanipulationcode;
        inputData["nallottedspeccode"] = this.state.selectedSpec.nallottedspeccode.value;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
        inputData["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
        // inputData["masterData"]=this.props.Login.masterData;



        let selectComponent = this.state.selectComponent;
        selectComponent['nspecsampletypecode'] = objComponent['nspecsampletypecode'] ?
            objComponent['nspecsampletypecode'] : -1
        if (specBasedComponent) {
            selectComponent['ncomponentcode'] = { value: objComponent['ncomponentcode'] ? objComponent['ncomponentcode'] : -1, label: objComponent['scomponentname'] ? objComponent['scomponentname'] : "" }

        }
        selectComponent['slno'] = objComponent['slno']
        this.props.Login.masterData.SubSampleTemplate &&
            this.props.Login.masterData.SubSampleTemplate.jsondata.map(row => {
                return row.children.map(column => {
                    return column.children.map(component => {
                        if (component.hasOwnProperty("children")) {
                            return component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    selectComponent[componentrow.label] = objComponent["jsondata"][componentrow.label] ?
                                        objComponent["jsondata"][componentrow.label] : ""
                                }
                                else if (componentrow.inputtype === "date") {

                                    selectComponent[componentrow.label] = objComponent["jsondata"][componentrow.label] ?
                                        rearrangeDateFormatforUI(userInfo, objComponent["jsondata"][componentrow.label]) : "";

                                    if (componentrow.timezone) {
                                        selectComponent[`tz${componentrow.label}`] = objComponent["jsondata"][`tz${componentrow.label}`] ?
                                            objComponent["jsondata"][`tz${componentrow.label}`] :
                                            defaulttimezone ? defaulttimezone : -1
                                    }
                                }
                                else {
                                    selectComponent[componentrow.label] = objComponent["jsondata"][componentrow.label] ?
                                        objComponent["jsondata"][componentrow.label] : ""
                                }
                                return null;
                            })
                        }
                        else {
                            if (component.inputtype === "combo") {
                                selectComponent[component.label] = objComponent["jsondata"][component.label] ?
                                    objComponent["jsondata"][component.label] : -1
                            }
                            else if (component.inputtype === "date") {

                                selectComponent[component.label] = objComponent["jsondata"][component.label] ?
                                    rearrangeDateFormatforUI(userInfo, objComponent["jsondata"][component.label]) : "";

                                if (component.timezone) {
                                    selectComponent[`tz${component.label}`] = objComponent["jsondata"][`tz${component.label}`] ?
                                        objComponent["jsondata"][`tz${component.label}`] :
                                        defaulttimezone ? defaulttimezone : -1
                                }
                            }
                            else {
                                selectComponent[component.label] = objComponent["jsondata"][component.label] ?
                                    objComponent["jsondata"][component.label] : ""
                            }
                            return selectComponent;
                        }
                    }
                    )
                })
            })

        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         loadSubSample: true, childoperation: "update",
        //         ChildscreenName: "SubSample",
        //         screenName: "SubSample",
        //         openChildModal: false, selectComponent,
        //         parentPopUpSize: "lg", loading: false
        //     }
        // }
        // this.props.updateStore(updateInfo)
        this.props.editSubSample(inputData, selectComponent,
            this.props.Login.userInfo, specBasedComponent, this.props.Login.SubSamplecomboData,
            this.state.selectedRecord);
    }

    deleteComponent = (event) => {
        const dataItem = event;
        const comp1 = this.props.Login.Component
        const Component = this.props.Login.Component;
        let subSampleDataGridList = this.props.Login.subSampleDataGridList;
        const Test = this.props.Login.Test;
        let SelectedTest = this.props.Login.SelectedTest;

        const index = comp1.findIndex(x => x.slno === dataItem.slno);
        const subSampleIndex = subSampleDataGridList.findIndex(x => x.slno === dataItem.slno);
        let updateInfo = {};
        let incslno = comp1.length - 1;
        if (comp1.length !== dataItem.slno) {
            //  let slno = Component[index].slno
            Test && Test[dataItem.slno] && delete Test[dataItem.slno]
            // const preList = comp1.splice(0, index);
            // const afterList = comp1.splice(index, comp1.length);


            // preList.map(x => {
            //     Test[incslno] = Test && Test[x.slno]
            //     x.slno = incslno;
            //     incslno = incslno - 1;
            //     return null;
            // })

            if (index > -1) {
                Component.splice(index, 1);
            }
            if (subSampleIndex > -1) {
                subSampleDataGridList.splice(subSampleIndex, 1);
            }

            //const Component1 = [...preList, ...afterList];

            // Component1.map(x => {
            //     subSampleDataGridList.push({ ...x.jsonuidata, ...x })

            // })
            //sortByField(subSampleDataGridList, 'desc', 'slno')
            SelectedTest = Test && Object.keys(Test).length > 0 && Test[Component[0] && Component[0].slno];
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { Component, selectedComponent: Component[0], Test, SelectedTest, subSampleDataGridList }
            }

        } else {
            if (index > -1) {
                Component.splice(index, 1);
            }
            if (subSampleIndex > -1) {
                subSampleDataGridList.splice(subSampleIndex, 1);
            }
            Test && Test[dataItem.slno] && delete Test[dataItem.slno]
            SelectedTest = Test && Object.keys(Test).length > 0 && Test[Component[0] && Component[0].slno];
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { Component, selectedComponent: Component[0], Test, SelectedTest, subSampleDataGridList }
            }
        }



        this.props.updateStore(updateInfo);
    }




    deleteTest = (event) => {
        const dataItem = event;
        let SelectedTest = this.props.Login.SelectedTest;
        let selectedComponent = this.props.Login.selectedComponent;
        const Test = this.props.Login.Test;
        const index = SelectedTest.findIndex(x => x.ntestgrouptestcode === dataItem.ntestgrouptestcode);
        if (index > -1) {
            SelectedTest.splice(index, 1);
        }
        Test[selectedComponent && selectedComponent.slno] = SelectedTest;

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { Test, SelectedTest }
        }
        this.props.updateStore(updateInfo);
    }

    onSaveTestClick = (saveType, formRef) => {
        let selectedTestData = this.props.Login.selectedTestData["ntestgrouptestcode"];
        let selectedTestArray = [];

        let updateInfo = {}
        let selectedComponent = this.props.Login.selectedComponent;

        let Test = this.props.Login.Test || [];
        if (this.props.Login.masterData.RealRegSubTypeValue ?
            this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample : false) {
            selectedTestData.map((item) => {
                item.item['slno'] = selectedComponent.slno;
                return selectedTestArray.push(item.item);
            });
            const ArrayTest = Test[selectedComponent.slno] ? Test[selectedComponent.slno] : [];
            //  ArrayTest.push(selectedTestArray);
            Test[selectedComponent.slno] = [...ArrayTest, ...selectedTestArray]

            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { SelectedTest: Test[selectedComponent.slno], Test: Test, selectedTestData: {}, loadTest: false, parentPopUpSize: "xl" }
            }
        } else {
            selectedComponent = {
                jsondata: { samplename: "NA" },
                slno: 1
            }
            selectedTestData.map((item) => {
                item.item['slno'] = selectedComponent.slno;
                return selectedTestArray.push(item.item);
            });
            const Component = [selectedComponent]
            const ArrayTest = Test[selectedComponent.slno] ? Test[selectedComponent.slno] : [];
            //  ArrayTest.push(selectedTestArray);
            Test[selectedComponent.slno] = [...ArrayTest, ...selectedTestArray]
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    selectedComponent,
                    Component,
                    SelectedTest: Test[selectedComponent.slno],
                    Test: Test, selectedTestData: {}, loadTest: false,
                    parentPopUpSize: "xl"
                    , screenName: this.props.screenName,

                }
            }
        }
        this.props.updateStore(updateInfo);
    }

    componentDataStateChange = (event) => {
        this.setState({
            componentDataState: event.dataState
        });
    }

    testDataStateChange = (event) => {
        this.setState({
            testDataState: event.dataState
        });
    }

    subSampleDataStateChange = (event) => {
        this.setState({
            subSampleDataState: event.dataState
        });
    }

    addsubSample = (specBasedComponent, specBasedTestPackage) => {
        let Map = {};
        if (this.state.selectedSpec.nallottedspeccode !== undefined
            && this.state.selectedSpec.nallottedspeccode !== "") {
            Map["ntemplatemanipulationcode"] = this.state.selectedSpec.ntemplatemanipulationcode || -1;
            Map["nallottedspeccode"] = this.state.selectedSpec.nallottedspeccode.value || -1;
            Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue &&
                this.props.Login.masterData.RealRegTypeValue.nregtypecode || -1;
            Map["nneedsubsample"] = true;
            Map["testrequired"] = false;
            Map["userinfo"] = this.props.Login.userInfo;
            let data = this.state.SubSamplecomboComponents || []
            const SubSamplewithoutCombocomponent = this.state.SubSamplewithoutCombocomponent || []
            const component = [...data, ...SubSamplewithoutCombocomponent]
            const Layout = this.props.Login.masterData.SubSampleTemplate
                && this.props.Login.masterData.SubSampleTemplate.jsondata
            //Added by Dhanushya for jira ETICA-22
            const orderTypeComp = this.props.Login.comboComponents.filter(item => item.name === "manualordertype");
            //Added by sonia  on 1 August 2024 for Sub Sample Add
            if (this.state.selectedRecord.hasOwnProperty(orderTypeComp.length > 0 && orderTypeComp[0].label)) {
                Map["orderTypeCombCode"] = this.state.selectedRecord[orderTypeComp[0].label].value;
            } else {
                Map["orderTypeCombCode"] = -1;
            }

            if (component.length === 0) {
                if (Layout !== undefined) {
                    Layout.map(row => {
                        return row.children.map(column => {
                            return column.children.map(component => {
                                return component.hasOwnProperty("children") ?
                                    component.children.map(componentrow => {
                                        if (componentrow.inputtype === "combo" || componentrow.inputtype === "backendsearchfilter"
                                            || componentrow.inputtype === "frontendsearchfilter") {
                                            data.push(componentrow)
                                        } else {
                                            SubSamplewithoutCombocomponent.push(componentrow)
                                        }
                                        return null;
                                    })
                                    : component.inputtype === "combo" || component.inputtype === "backendsearchfilter"
                                        || component.inputtype === "frontendsearchfilter" ? data.push(component) :
                                        SubSamplewithoutCombocomponent.push(component)
                            })
                        })
                    })
                    const SubSamplecomboComponents = data
                    let childColumnList = {};
                    data.map(columnList => {
                        const val = comboChild(data, columnList, childColumnList, true);
                        data = val.data;
                        childColumnList = val.childColumnList
                        return null;
                    })

                    this.props.addStbTimePoint(this.props.Login.masterData,
                        this.props.Login.userInfo, data, this.state.selectComponent,
                        childColumnList, SubSamplecomboComponents,
                        SubSamplewithoutCombocomponent, specBasedComponent,
                        Map, this.props.Login.Component, true, this.props.Login.SubSamplecomboData,
                        this.state.selectedRecord, true, specBasedTestPackage, this.props.Login)

                    //  this.props.addsubSample(this.props.Login.userInfo, specBasedComponent, Map)
                }
            } else {
                this.props.addStbTimePoint(this.props.Login.masterData,
                    this.props.Login.userInfo, data, this.state.selectComponent,
                    this.state.parentSubSampleColumnList, this.state.SubSamplecomboComponents,
                    this.state.SubSamplewithoutCombocomponent, specBasedComponent, Map,
                    this.props.Login.Component, false, this.props.Login.SubSamplecomboData,
                    this.state.selectedRecord, true, specBasedTestPackage, this.props.Login)
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ADDSPECIFICATION" }));
        }

    }

    onSaveClick = (saveType, formRef) => {
        let operation = this.props.Login.operation;
        // ALPD-4914 Added codes for scheduler configuration screen
        if (this.props.Login.screenName !== 'scheduler') {
            if (this.props.Login.userInfo && this.props.Login.userInfo.nformcode === formCode.SCHEDULERCONFIGURATION) {
                if (operation === "create") {
                    this.insertSchedulerConfig(true);
                }
                else if (operation === "update") {
                    this.updateSchedulerConfig(true);

                }
            } else {
                if (operation === "update") {
                    this.onUpdateRegistration(saveType, formRef, operation);
                }
                else {
                    if (operation === "create") {
                        this.insertRegistration(true);
                    }
                }
            }
        }
        else {
            if (operation === "update") {
                this.onUpdateRegistration(saveType, formRef, operation);
            }
            else {
                if (operation === "create") {
                    this.insertRegistrationScheduler(true);
                }
            }
        }

    }
    onSaveClickImport = (saveType, formRef) => {
        let nneedsubsample = this.props.Login.masterData
            && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;
        let isFileupload = false;
        if (this.state.selectedSpec.nallottedspeccode !== undefined
            && this.state.selectedSpec.nallottedspeccode !== "") {
            let Map = {};
            if (nneedsubsample === false || !this.state.specBasedComponent) {
                Map["nspecsampletypecode"] = this.state.selectedSpec.nallottedspeccode.item.nspecsampletypecode
            }

            Map["specBasedComponnet"] = this.state.specBasedComponent
            Map["subsampleDateList"] = this.findSubsampleDateList(this.props.Login.masterData.SubSampleTemplate.jsondata);
            Map["FromDate"] = "";
            Map["ToDate"] = "";
            Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue &&
                this.props.Login.masterData.RealRegTypeValue.nregtypecode || -1;
            Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue &&
                this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode || -1;
            Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
            Map["nfilterstatus"] = transactionStatus.DRAFT;
            Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.registrationTemplate
                && this.props.Login.masterData.registrationTemplate.ndesigntemplatemappingcode;
            Map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue &&
                this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode || -1;
            Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow || -1;
                Map["nneedsubsample"] = this.props.Login.masterData
                && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;
            // Map["checkBoxOperation"] = 3;
            // Map["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;
            const param = getStabilityStudyPlan(this.props.Login.masterData,
                this.state.selectedRecord, this.state.selectedSpec,
                this.props.Login.masterData.registrationTemplate.jsondata,
                this.props.Login.userInfo, this.props.Login.defaultTimeZone, 'create',
                this.props.comboComponents);
            Map["StabilityStudyPlan"] = param.sampleRegistration
            Map["DateList"] = param.dateList
            const fields = this.MandatoryCheck();

            Map["MandatoryList"] = fields.mandatoryFields
            Map["exportFieldProperties"] = fields.exportFieldProperties
            //  Map["ExportList"] = fields.exportFields

            Map["exportFields"] = [...fields.exportFields]

            Map["comboComponent"] = fields.comboComponent

            Map["SampleFieldsString"] = [...fields.exportFields];
            //ALPD-3596 
            Map["TestGroupTestCode"] = this.state.selectedTestData && Object.keys(this.state.selectedTestData).length !== 0 ? this.state.selectedTestData.ntestgrouptestcode.map(value => value.item.ntestgrouptestcode).join(",") : "";
            Map["importTest"] = this.state.selectedRecord && this.state.selectedRecord.importTest;
            if (nneedsubsample) {
                const subSample = this.MandatoryCheckSubSample()
                Map["comboComponent"] = [...fields.comboComponent, ...subSample.comboComponent]
                Map["MandatoryList"] = [...fields.mandatoryFields, ...subSample.mandatoryFields]
                Map["SubSampleFields"] = subSample.subSampleFields
                Map["exportFields"] = [...fields.exportFields, ...subSample.exportFields]
                Map["exportFieldProperties"] = [...fields.exportFieldProperties, ...subSample.exportFieldProperties]
                //  Map["SubSampleFieldsString"] = [...subSample.exportFields.map(x => x.label)];
            }
            // Map["SampleFields"] = this.SampleFields();
            Map['sampledateconstraints'] = this.sampleeditable.sampledateconstraints;
            Map["userinfo"] = this.props.Login.userInfo;
            Map["samplecombinationunique"] = this.props.samplecombinationunique;
            Map["subsamplecombinationunique"] = this.props.subsamplecombinationunique;
            Map["nflag"] = 2;
            Map["url"] = this.props.Login.settings[24];
            // Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
            // Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
            // Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
            // Map["multipleselectionFlag"] = this.props.Login.settings && parseInt(this.props.Login.settings[7]) === 3 ? true : false;

            //  Map["nneedjoballocation"] = this.props.Login.masterData.RegSubTypeValue
            //  && this.props.Login.masterData.RegSubTypeValue.nneedjoballocation;
            Map["DataRecordMaster"] = this.props.Login.masterData;

            // if (this.props.Login.masterData.SampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
            //     const ageComp = this.props.Login.withoutCombocomponent.filter(item => item.name === "Age");
            //     const dateComp = this.props.Login.withoutCombocomponent.filter(item => item.name === "Date Of Birth");
            //     const genderComp = this.props.Login.comboComponents.filter(item => item.name === "Gender");
            //     if (this.state.selectedRecord.hasOwnProperty(ageComp[0].label)) {
            //         Map["AgeData"] = parseInt(ageCalculate(this.state.selectedRecord[dateComp[0].label], true));
            //         Map["sDob"]= convertDateTimetoString(new Date(this.state.selectedRecord[dateComp[0].label]), this.props.Login.userInfo);

            //     }
            //     if (this.state.selectedRecord.hasOwnProperty(genderComp[0].label)) {
            //         Map["ngendercode"] = this.state.selectedRecord[genderComp[0].label].value;
            //     }
            //     Map["Registration"]['jsondata']['ageDataForRulesEngine'] = { 'nage': Map["AgeData"], 'ngendercode': Map["ngendercode"] }

            //     let orderType = {
            //         "Order Type": {
            //             "pkey": "nordertypecode",
            //             "label": "NA",
            //             "value": -1,
            //             "source": "ordertype",
            //             "nordertypecode": -1,
            //             "nquerybuildertablecode": 246
            //         }
            //     };
            //     if (this.props.Login.masterData.registrationTemplate.ndefaulttemplatecode === 9) {
            //         //external order
            //         orderType = {
            //             "Order Type": {
            //                 "pkey": "nordertypecode",
            //                 "label": "External",
            //                 "value": 2,
            //                 "source": "ordertype",
            //                 "nordertypecode": 2,
            //                 "nquerybuildertablecode": 246
            //             }
            //         };

            //         Map["Registration"]['jsondata'] = {
            //             ...Map["Registration"]['jsondata'],
            //             ...orderType
            //         };

            //     }
            //     else if (this.props.Login.masterData.registrationTemplate.ndefaulttemplatecode === 6) {
            //         //manual order
            //         orderType = {
            //             "Order Type": {
            //                 "pkey": "nordertypecode",
            //                 "label": "Manual",
            //                 "value": 1,
            //                 "source": "ordertype",
            //                 "nordertypecode": 1,
            //                 "nquerybuildertablecode": 246
            //             }
            //         };

            //         Map["Registration"]['jsondata'] = {
            //             ...Map["Registration"]['jsondata'],
            //             ...orderType
            //         };
            //     }

            //     Map["orderTypeValue"] = this.state.selectedRecord['Order Type'] && this.state.selectedRecord['Order Type'].value
            // }
            Map["skipmethodvalidity"] = false;

            const formData = new FormData();
            formData.append("Map", Lims_JSON_stringify(JSON.stringify(Map)));
            formData.append("stbTimePointImportFile", this.state.selectedRecord['sfilename'][0])
            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));

            const inputParam = {
                inputData: Map,
                postParamList: this.props.postParamList,
                action: "create",
                formData: formData,
                isFileupload
            }
            this.props.insertExportStbStudyPlan(inputParam, this.props.Login.masterData)
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
        }
    }

    onUpdateRegistration(saveType, formRef, operation, flag) {
        const inputData = { userinfo: this.props.Login.userInfo };
        let isFileupload = false;
        let initialParam = {
            nfilterstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
            fromdate: "",
            todate: "",
            nflag: 2,
            //ntype:2,
            ntype: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample ? -1 : 2,
            selectedStbTimePointTest: String(this.state.selectedRecord.selectedStbTimePointTest),
            ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            napproveconfversioncode: this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue ?
                this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow
                : false,
            nneedsubsample: this.props.Login.masterData
                && this.props.Login.masterData.RealRegSubTypeValue ?
                this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample : false,
            // checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
            activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS"

        }

        inputData["initialparam"] = initialParam;
        // inputData["samplebeforeedit"] = JSON.parse(JSON.stringify(this.props.Login.regRecordToEdit));
        //inputData["registration"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
        const param = getRegistration(this.props.Login.masterData,
            this.state.selectedRecord, this.state.selectedSpec,
            this.props.Login.masterData.registrationTemplate.jsondata,
            this.props.Login.userInfo, this.props.Login.defaulttimezone,
            operation, this.props.comboComponents);

        //console.log("edit reg:", param);

        inputData["registration"] = param.sampleRegistration
        inputData["registration"]["jsonuidata"]["selectedStbTimePointTest"] = String(this.state.selectedRecord.selectedStbTimePointTest)
        inputData["registration"]["selectedStbTimePointTest"] = String(this.state.selectedRecord.selectedStbTimePointTest)
        inputData["DateList"] = param.dateList;
        inputData['sampledateconstraints'] = this.sampleeditable.sampledateconstraints;
        inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
            && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
        inputData["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
            && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
        inputData["nneedsubsample"] = this.props.Login.masterData
            && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;
        //inputData["checkBoxOperation"] = 3;
        inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;

        inputData["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS"
        inputData["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS"
        inputData["samplecombinationunique"] = this.props.samplecombinationunique;
        inputData["subsamplecombinationunique"] = this.props.subsamplecombinationunique;
        inputData["selectedSample"] = this.props.Login.masterData.selectedSample

        let tempData = {}
        const formData = new FormData();
        this.props.Login.withoutCombocomponent.map(item => {
            if (item.inputtype === "files") {
                if (typeof this.state.selectedRecord[item && item.label] === "object") {
                    this.state.selectedRecord[item && item.label] && this.state.selectedRecord[item && item.label].forEach((item1, index) => {
                        const fileName = create_UUID();
                        const splittedFileName = item1.name.split('.');
                        const fileExtension = item1.name.split('.')[splittedFileName.length - 1];
                        const uniquefilename = fileName + '.' + fileExtension;

                        tempData[item && item.label + '_susername_Sample'] = this.props.Login.userInfo.susername
                        tempData[item && item.label + '_suserrolename_Sample'] = this.props.Login.userInfo.suserrolename
                        tempData[item && item.label + '_nfilesize_Sample'] = item1.size
                        tempData[item && item.label + '_ssystemfilename_Sample'] = uniquefilename
                        tempData[item && item.label] = Lims_JSON_stringify(item1.name.trim(), false)
                        formData.append("uploadedFile" + index, item1);
                        formData.append("uniquefilename" + index, uniquefilename);
                        formData.append("filecount", this.state.selectedRecord[item && item.label].length);
                        formData.append("isFileEdited", transactionStatus.YES);
                        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                        inputData['isFileupload'] = true;
                        inputData["registration"]['jsondata'] = {
                            ...inputData["registration"]['jsondata'],
                            ...tempData
                        };
                        inputData["registration"]['jsonuidata'] = {
                            ...inputData["registration"]['jsonuidata'],
                            ...tempData
                        };
                        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                        formData.append("Map", Lims_JSON_stringify(JSON.stringify(inputData)));
                        isFileupload = true;
                    }
                    )
                }
            }
        })

        // Object.keys(this.state.selectedRecord).map(key => {
        //     if (typeof this.state.selectedRecord[key] === "object") {
        //         if (this.state.selectedRecord[key] === null) {
        //             return inputData["registration"][key] = this.state.selectedRecord[key];
        //         }
        //         else if (this.state.selectedRecord[key] instanceof Date) {
        //             return inputData["registration"][key] = formatInputDate(this.state.selectedRecord[key], false);
        //         }
        //         else {
        //             return inputData["registration"][key] = this.state.selectedRecord[key].value
        //         }
        //     }
        //     else {
        //         return inputData["registration"][key] = this.state.selectedRecord[key];
        //     }
        // }
        //  )
        // console.log("edit:", inputData);

        // if (inputData["registration"] ) {
        //     delete inputData["registration"]["esignpassword"]
        //     delete inputData["registration"]["esigncomments"]
        //     delete inputData["registration"]["agree"]
        // }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Registration",
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef,
            selectedRecord: { ...this.state.selectedRecord, sloginid: this.props.Login.userInfo.sloginid },
            action: 'editSample',
            showConfirmAlert: false,
            resultDataState: this.state.resultDataState,
            testCommentDataState: this.state.testCommentDataState,
            isFileupload, formData: formData
            // dataState:undefined, selectedId
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    // screenName:"Esignature",
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    saveType, parentPopUpSize: "lg", //openModal:true, openPortal:false
                    openModal: false, openPortal: true
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            //this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            this.props.updateRegistration(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    updateSchedulerConfig(saveType, formRef, operation, flag) {
        const inputData = { userinfo: this.props.Login.userInfo };
        let isFileupload = false;
        let initialParam = {
            nfilterstatus: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus == 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
            nflag: 2,
            //ntype:2,
            ntype: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample ? -1 : 2,
            nschedulersamplecode: String(this.state.selectedRecord.nschedulersamplecode),
            ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            napproveconfversioncode: this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode,
            nregsubtypeversioncode: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypeversioncode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue ?
                this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow
                : false,
            nneedsubsample: this.props.Login.masterData
                && this.props.Login.masterData.RealRegSubTypeValue ?
                this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample : false,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS",
            nsampleschedulerconfigtypecode: this.props.Login.masterData.SchedulerConfigTypeValue && this.props.Login.masterData.SchedulerConfigTypeValue.nsampleschedulerconfigtypecode


        }

        inputData["initialparam"] = initialParam;
        // inputData["samplebeforeedit"] = JSON.parse(JSON.stringify(this.props.Login.regRecordToEdit));
        //inputData["registration"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
        const param = getSchedulerConfig(this.props.Login.masterData,
            this.state.selectedRecord, this.state.selectedSpec,
            this.props.Login.masterData.registrationTemplate.jsondata,
            this.props.Login.userInfo, this.props.Login.defaulttimezone,
            operation, this.props.comboComponents);

        //console.log("edit reg:", param);

        inputData["schedulerconfiguration"] = param.sampleRegistration
        inputData["schedulerconfiguration"]["jsonuidata"]["nschedulersamplecode"] = String(this.state.selectedRecord.nschedulersamplecode)
        inputData["schedulerconfiguration"]["nschedulersamplecode"] = String(this.state.selectedRecord.nschedulersamplecode)
        inputData["schedulerconfiguration"]["nschedulecode"] = this.state.selectedRecord['SchedulerMaster'] && this.state.selectedRecord['SchedulerMaster'].value || -1;

        inputData["DateList"] = param.dateList;
        inputData['sampledateconstraints'] = this.sampleeditable.sampledateconstraints;
        inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
            && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
        inputData["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
            && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
        inputData["nneedsubsample"] = this.props.Login.masterData
            && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;
        inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;

        inputData["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS"
        inputData["samplecombinationunique"] = this.props.samplecombinationunique;
        inputData["subsamplecombinationunique"] = this.props.subsamplecombinationunique;
        inputData["selectedSample"] = this.props.Login.masterData.selectedSample

        let tempData = {}
        const formData = new FormData();
        this.props.Login.withoutCombocomponent.map(item => {
            if (item.inputtype === "files") {
                if (typeof this.state.selectedRecord[item && item.label] === "object") {
                    this.state.selectedRecord[item && item.label] && this.state.selectedRecord[item && item.label].forEach((item1, index) => {
                        const fileName = create_UUID();
                        const splittedFileName = item1.name.split('.');
                        const fileExtension = item1.name.split('.')[splittedFileName.length - 1];
                        const uniquefilename = fileName + '.' + fileExtension;

                        tempData[item && item.label + '_susername_Sample'] = this.props.Login.userInfo.susername
                        tempData[item && item.label + '_suserrolename_Sample'] = this.props.Login.userInfo.suserrolename
                        tempData[item && item.label + '_nfilesize_Sample'] = item1.size
                        tempData[item && item.label + '_ssystemfilename_Sample'] = uniquefilename
                        tempData[item && item.label] = Lims_JSON_stringify(item1.name.trim(), false)
                        formData.append("uploadedFile" + index, item1);
                        formData.append("uniquefilename" + index, uniquefilename);
                        formData.append("filecount", this.state.selectedRecord[item && item.label].length);
                        formData.append("isFileEdited", transactionStatus.YES);
                        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                        inputData['isFileupload'] = true;
                        inputData["registration"]['jsondata'] = {
                            ...inputData["registration"]['jsondata'],
                            ...tempData
                        };
                        inputData["registration"]['jsonuidata'] = {
                            ...inputData["registration"]['jsonuidata'],
                            ...tempData
                        };
                        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                        formData.append("Map", Lims_JSON_stringify(JSON.stringify(inputData)));
                        isFileupload = true;
                    }
                    )
                }
            }
        })

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "SchedulerConfig",
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef,
            selectedRecord: { ...this.state.selectedRecord, sloginid: this.props.Login.userInfo.sloginid },
            action: 'editSchedulerConfig',
            showConfirmAlert: false,
            resultDataState: this.state.resultDataState,
            // testCommentDataState: this.state.testCommentDataState,
            isFileupload, formData: formData
            // dataState:undefined, selectedId
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    // screenName:"Esignature",
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    saveType, parentPopUpSize: "lg", //openModal:true, openPortal:false
                    openModal: false, openPortal: true
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            //this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            this.props.updateSchedulerConfig(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    findSubsampleDateList(subsampletemplate) {
        const dateList = []
        subsampletemplate && subsampletemplate.map(row => {
            return row.children.map(column => {
                return column.children.map(component => {
                    if (component.hasOwnProperty("children")) {
                        return component.children.map(componentrow => {
                            if (componentrow.inputtype === "date") {
                                dateList.push(componentrow.label)
                            }
                        })
                    }
                    else {
                        if (component.inputtype === "date") {
                            dateList.push(component.label)
                        }
                        return dateList
                    }
                }
                )
            })
        })
        return dateList;
    }

    insertRegistrationScheduler() {
        let Components = this.props.Login.Component;
        if (Components && Components.length > 0) {
            let Test = this.props.Login.Test;
            let Map = {};
            Map["testgrouptest"] = TestListManipulation(Components, Test);
            Map["RegistrationSample"] = SubSample(this.props.Login.Component ? this.props.Login.Component : [],
                this.state.specBasedComponent,
                this.props.Login.masterData.RealRegSubTypeValue ? this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample : false,
                this.state.selectedSpec);
            Map["subsampleDateList"] = this.findSubsampleDateList(this.props.Login.masterData.SubSampleTemplate ?
                this.props.Login.masterData.SubSampleTemplate.jsondata : this.props.Login.masterData.schedulerSubSampleTemplate.jsondata);
            Map["nregtypecode"] = 1;
            Map["nregsubtypecode"] = 1;
            Map["nsampletypecode"] = 1;
            // Map["nfilterstatus"] = transactionStatus.PREREGISTER;
            Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode;
            Map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
            Map["nneedtemplatebasedflow"] = false;
            Map["nneedsubsample"] = this.props.Login.masterData.RealRegSubTypeValue ?
                this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample : false;
            // Map["checkBoxOperation"] = 3;
            const param = getRegistrationScheduler(this.props.Login.masterData,
                this.state.selectedRecord, this.state.selectedSpec,
                this.props.Login.masterData.schedulerTemplate.jsondata,
                this.props.Login.userInfo, this.props.Login.defaultTimeZone, 'create',
                this.props.comboComponents);
            Map["Registration"] = param.sampleRegistration
            Map["DateList"] = param.dateList
            Map['sampledateconstraints'] = this.sampleeditable.sampledateconstraints;
            Map["userinfo"] = this.props.Login.userInfo;
            Map["selectedscheduler"] = this.props.Login.masterData.SelectedScheduler;

            Map["selectedscheduler"]["sstarttime"] = formatInputDateWithoutT(rearrangeDateFormat(this.props.Login.userInfo, Map["selectedscheduler"]["sstarttime"]), false)
            //Map["nflag"] = 2;
            // Map["ntype"] = 2;
            //Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
            //Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
            //  Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
            //Map["multipleselectionFlag"] = this.props.Login.settings && parseInt(this.props.Login.settings[7]) === 3 ? true : false;

            const inputParam = {
                inputData: Map,
                postParamList: this.props.postParamList,
                action: "preregister"
            }
            this.props.insertRegistrationScheduler(inputParam, this.props.Login.masterData)
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ADDSUBSAMPLETOPREREGISTER" }));
        }

    }
    insertMultipleRegistration(saveType) {
        let Components = this.props.Login.Component;
        let nneedsubsample = this.props.Login.masterData
            && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;
        let isFileupload = false;
        if (this.state.selectedSpec.nallottedspeccode !== undefined
            && this.state.selectedSpec.nallottedspeccode !== "") {
            if (nneedsubsample ? Components && Components.length > 0 : true) {
                let Test = this.props.Login.Test;
                let Map = {};
                Map["testgrouptest"] = TestListManipulation(Components, Test);
                if (nneedsubsample === false && this.props.Login.Test && this.props.Login.Test.length === 0) {
                    Map["RegistrationSample"] = [{
                        "jsondata": { "ssamplename": "NA" }, "slno": 1
                        , "ncomponentcode": -1, "nspecsampletypecode": this.state.selectedSpec.nallottedspeccode.item.nspecsampletypecode
                    }]
                } else {
                    Map["RegistrationSample"] = SubSample(this.props.Login.Component ? this.props.Login.Component : [],
                        this.state.specBasedComponent,
                        this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample, this.state.selectedSpec);
                }

                Map["subsampleDateList"] = this.findSubsampleDateList(this.props.Login.masterData.SubSampleTemplate.jsondata);
                //Map["FromDate"] = rearrangeDateFormat(this.props.Login.userInfo, this.props.fromDate);//formatDate(this.fromDate);
                // Map["ToDate"] = rearrangeDateFormat(this.props.Login.userInfo, this.props.toDate);//formatDate(this.toDate);
                Map["FromDate"] = "";
                Map["ToDate"] = "";
                Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
                Map["nfilterstatus"] = transactionStatus.PREREGISTER;
                Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.registrationTemplate
                    && this.props.Login.masterData.registrationTemplate.ndesigntemplatemappingcode;
                Map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
                Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                Map["nneedsubsample"] = this.props.Login.masterData
                    && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;
                // Map["checkBoxOperation"] = 3;
                Map["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;
                const param = getRegistration(this.props.Login.masterData,
                    this.state.selectedRecord, this.state.selectedSpec,
                    this.props.Login.masterData.registrationTemplate.jsondata,
                    this.props.Login.userInfo, this.props.Login.defaultTimeZone, 'create',
                    this.props.comboComponents);
                //console.log("param:", param);
                Map["Registration"] = param.sampleRegistration
                Map["DateList"] = param.dateList
                Map['sampledateconstraints'] = this.sampleeditable.sampledateconstraints;
                Map["userinfo"] = this.props.Login.userInfo;
                Map["samplecombinationunique"] = this.props.samplecombinationunique;
                Map["subsamplecombinationunique"] = this.props.subsamplecombinationunique;
                Map["nflag"] = 2;
                Map["url"] = this.props.Login.settings[24];
                // Map["ntype"] = 2;
                Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                Map["multipleselectionFlag"] = this.props.Login.settings && parseInt(this.props.Login.settings[7]) === 3 ? true : false;
                Map["ntestpackagecode"] = this.state.selectedRecord['ntestpackagecode'] && this.state.selectedRecord['ntestpackagecode']
                Map["nneedjoballocation"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedjoballocation;
                Map["DataRecordMaster"] = this.props.Login.masterData;
                //console.log("this.props.Login.masterData.registrationTemplate:", this.props.Login.masterData.registrationTemplate);
                if (this.props.Login.masterData.SampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
                    const ageComp = this.props.Login.withoutCombocomponent.filter(item => item.name === "Age");
                    const dateComp = this.props.Login.withoutCombocomponent.filter(item => item.name === "Date Of Birth");
                    const genderComp = this.props.Login.comboComponents.filter(item => item.name === "Gender");
                    if (this.state.selectedRecord.hasOwnProperty(ageComp[0].label)) {
                        Map["AgeData"] = parseInt(ageCalculate(this.state.selectedRecord[dateComp[0].label], true));
                        Map["sDob"] = convertDateTimetoString(new Date(this.state.selectedRecord[dateComp[0].label]), this.props.Login.userInfo);

                    }
                    if (this.state.selectedRecord.hasOwnProperty(genderComp[0].label)) {
                        Map["ngendercode"] = this.state.selectedRecord[genderComp[0].label].value;

                    }
                    Map["Registration"]['jsondata']['ageDataForRulesEngine'] = { 'nage': Map["AgeData"], 'ngendercode': Map["ngendercode"] }

                    let orderType = {
                        "Order Type": {
                            "pkey": "nordertypecode",
                            "label": "NA",
                            "value": -1,
                            "source": "ordertype",
                            "nordertypecode": -1,
                            "nquerybuildertablecode": 246
                        }
                    };
                    if (this.props.Login.masterData.registrationTemplate.ndefaulttemplatecode === 9) {
                        //external order
                        orderType = {
                            "Order Type": {
                                "pkey": "nordertypecode",
                                "label": "External",
                                "value": 2,
                                "source": "ordertype",
                                "nordertypecode": 2,
                                "nquerybuildertablecode": 246
                            }
                        };

                        Map["Registration"]['jsondata'] = {
                            ...Map["Registration"]['jsondata'],
                            ...orderType
                        };

                    }
                    else if (this.props.Login.masterData.registrationTemplate.ndefaulttemplatecode === 6) {
                        //manual order
                        orderType = {
                            "Order Type": {
                                "pkey": "nordertypecode",
                                "label": "Manual",
                                "value": 1,
                                "source": "ordertype",
                                "nordertypecode": 1,
                                "nquerybuildertablecode": 246
                            }
                        };

                        Map["Registration"]['jsondata'] = {
                            ...Map["Registration"]['jsondata'],
                            ...orderType
                        };
                    }


                    // Map["Registration"]['jsondata'] = {... Map["Registration"]['jsondata'], 
                    //                                       ...orderType
                    //                                      }
                    Map["orderTypeValue"] = this.state.selectedRecord['Order Type'] && this.state.selectedRecord['Order Type'].value
                }
                Map["skipmethodvalidity"] = false;
                let tempData = {}
                const formData = new FormData();
                let count = 0;
                this.props.Login.withoutCombocomponent.map(item => {
                    if (item.inputtype === "files") {
                        this.state.selectedRecord[item && item.label] && this.state.selectedRecord[item && item.label].forEach((item1, index) => {
                            const fileName = create_UUID();
                            const splittedFileName = item1.name.split('.');
                            const fileExtension = item1.name.split('.')[splittedFileName.length - 1];
                            const uniquefilename = fileName + '.' + fileExtension;
                            tempData[item && item.label + '_susername_Sample'] = this.props.Login.userInfo.susername
                            tempData[item && item.label + '_suserrolename_Sample'] = this.props.Login.userInfo.suserrolename
                            tempData[item && item.label + '_nfilesize_Sample'] = item1.size
                            tempData[item && item.label + '_ssystemfilename_Sample'] = uniquefilename
                            tempData[item && item.label] = Lims_JSON_stringify(item1.name.trim(), false)
                            formData.append("uploadedFile" + count, item1);
                            formData.append("uniquefilename" + count, uniquefilename);
                            count++;
                            // formData.append("filecount", count);
                            formData.append("isFileEdited", transactionStatus.YES);
                            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                            Map['isFileupload'] = true;
                            Map["Registration"]['jsondata'] = {
                                ...Map["Registration"]['jsondata'],
                                ...tempData
                            };
                            Map["Registration"]['jsonuidata'] = {
                                ...Map["Registration"]['jsonuidata'],
                                ...tempData
                            };
                            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                            //formData.append("Map", Lims_JSON_stringify(JSON.stringify(Map)));
                            isFileupload = true;
                        }
                        )
                    }
                })

                this.state.SubSamplewithoutCombocomponent.map(item => {
                    if (item.inputtype === "files") {
                        Map["RegistrationSample"].map((item12, index) => {
                            item12[item && item.label] && item12[item && item.label].forEach((item1) => {
                                formData.append("uploadedFile" + count, item1);
                                formData.append("uniquefilename" + count, Map["RegistrationSample"][index].uniquefilename);
                                count++;
                                // formData.append("filecount",  count);
                                formData.append("isFileEdited", transactionStatus.YES);
                                formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                                isFileupload = true;
                            })
                            delete (Map["RegistrationSample"][index].uniquefilename);
                            delete (Map["RegistrationSample"][index][item && item.label]);
                        })
                    }
                })
                // formData.append("Map", Lims_JSON_stringify(JSON.stringify(Map)));
                formData.append("filecount", count);
                let dateList = []
                this.props.Login.withoutCombocomponent.map(item => {
                    if (item.inputtype === 'date') {
                        //dateList.push(item.label)
                    }
                })
                if (saveType === '1') {
                    this.state.selectedRecord['sfilename'] && this.state.selectedRecord['sfilename'].forEach(item => {
                        isFileupload = true
                        Map["isFile"] = true;
                        formData.append('datelist', Lims_JSON_stringify(JSON.stringify(dateList), false))
                        formData.append("readFile", item);
                        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                    })
                    formData.append("Map", Lims_JSON_stringify(JSON.stringify(Map)));
                } else {
                    isFileupload = true
                    Map["isFile"] = false;
                    Map["nsamplecount"] = this.state.selectedRecord.nsamplecount;
                    formData.append("Map", Lims_JSON_stringify(JSON.stringify(Map)));
                    formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                }
                const inputParam = {
                    inputData: Map,
                    postParamList: this.props.postParamList,
                    action: "preregister",
                    formData: formData,
                    isFileupload
                }
                //console.log("insert reg:", inputParam);
                this.props.insertMultipleRegistration(inputParam, this.props.Login.masterData)
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_ADDSUBSAMPLETOPREREGISTER" }));
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
        }
    }

    insertRegistration() {
        let Components = this.props.Login.Component;
        let nneedsubsample = this.props.Login.masterData
            && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;
        let isFileupload = false;
        if (this.state.selectedSpec.nallottedspeccode !== undefined
            && this.state.selectedSpec.nallottedspeccode !== "") {
            if (nneedsubsample ? Components && Components.length > 0 : true) {
                let Test = this.props.Login.Test;
                let Map = {};
                Map["testgrouptest"] = TestListManipulation(Components, Test);
                if (nneedsubsample === false && this.props.Login.Test && this.props.Login.Test.length === 0) {
                    Map["StbTimePoint"] = [{
                        "jsondata": { "ssamplename": "NA" }, "slno": 1
                        , "ncomponentcode": -1, "nspecsampletypecode": this.state.selectedSpec.nallottedspeccode.item.nspecsampletypecode
                    }]
                } else {
                    Map["StbTimePoint"] = SubSample(this.props.Login.Component ? this.props.Login.Component : [],
                        this.state.specBasedComponent,
                        this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample, this.state.selectedSpec);
                }
                Map["subsampleDateList"] = this.findSubsampleDateList(this.props.Login.masterData.SubSampleTemplate.jsondata);
                //Map["FromDate"] = rearrangeDateFormat(this.props.Login.userInfo, this.props.fromDate);//formatDate(this.fromDate);
                // Map["ToDate"] = rearrangeDateFormat(this.props.Login.userInfo, this.props.toDate);//formatDate(this.toDate);
                Map["FromDate"] = "";
                Map["ToDate"] = "";
                Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue &&
                    this.props.Login.masterData.RealRegTypeValue.nregtypecode || -1;
                Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue &&
                    this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode || -1;
                Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue &&
                    this.props.Login.masterData.RealSampleTypeValue.nsampletypecode || -1;
                Map["nportalrequired"] = this.props.Login.masterData.RealSampleTypeValue &&
                    this.props.Login.masterData.RealSampleTypeValue.nportalrequired || -1;
                Map["nfilterstatus"] = transactionStatus.DRAFT;
                Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.registrationTemplate
                    && this.props.Login.masterData.registrationTemplate.ndesigntemplatemappingcode;
                Map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue &&
                    this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode || -1;
                Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow || -1;
                Map["nneedsubsample"] = this.props.Login.masterData
                    && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;

                //  Map["checkBoxOperation"] = 3;
                //  Map["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;
                // Map["nneedmyjob"] = this.props.Login.masterData.RealRegSubTypeValue&&this.props.Login.masterData.RealRegSubTypeValue.nneedmyjob ? this.props.Login.masterData.RealRegSubTypeValue.nneedmyjob : false;
                const param = getStabilityStudyPlan(this.props.Login.masterData,
                    this.state.selectedRecord, this.state.selectedSpec,
                    this.props.Login.masterData.registrationTemplate.jsondata,
                    this.props.Login.userInfo, this.props.Login.defaultTimeZone, 'create',
                    this.props.comboComponents);
                //console.log("param:", param);
                Map["StabilityStudyPlan"] = param.sampleRegistration
                Map["DateList"] = param.dateList
                Map['sampledateconstraints'] = this.sampleeditable.sampledateconstraints;
                Map["userinfo"] = this.props.Login.userInfo;
                Map["samplecombinationunique"] = this.props.samplecombinationunique;
                Map["subsamplecombinationunique"] = this.props.subsamplecombinationunique;
                Map["nflag"] = 2;
                Map["url"] = this.props.Login.settings[24];
                Map["ncontrolcode"] = this.props.Login.ncontrolcode;
                // Map["ntype"] = 2;
                //Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                //Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                //Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                Map["multipleselectionFlag"] = this.props.Login.settings && parseInt(this.props.Login.settings[7]) === 3 ? true : false;
                Map["ntestpackagecode"] = this.state.selectedRecord['ntestpackagecode'] && this.state.selectedRecord['ntestpackagecode']
                //Map["nneedjoballocation"] = this.props.Login.masterData.RegSubTypeValue
                //    && this.props.Login.masterData.RegSubTypeValue.nneedjoballocation;
                Map["DataRecordMaster"] = this.props.Login.masterData;
                Map["noutsourcerequired"] = this.props.Login.masterData.RealSampleTypeValue.noutsourcerequired;
                Map["loadAdhocTest"] = this.props.Login.loadAdhocTest == true ? true : false;
                //console.log("this.props.Login.masterData.registrationTemplate:", this.props.Login.masterData.registrationTemplate);
                // if (this.props.Login.masterData.SampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
                //     const ageComp = this.props.Login.withoutCombocomponent.filter(item => item.name === "Age");
                //     const dateComp = this.props.Login.withoutCombocomponent.filter(item => item.name === "Date Of Birth");
                //     const genderComp = this.props.Login.comboComponents.filter(item => item.name === "Gender");
                //     if (this.state.selectedRecord.hasOwnProperty(ageComp[0].label)) {
                //         Map["AgeData"] = parseInt(ageCalculate(this.state.selectedRecord[dateComp[0].label], true));
                //         Map["sDob"]= convertDateTimetoString(new Date(this.state.selectedRecord[dateComp[0].label]), this.props.Login.userInfo);
                //     }
                //     if (this.state.selectedRecord.hasOwnProperty(genderComp[0].label)) {
                //         Map["ngendercode"] = this.state.selectedRecord[genderComp[0].label].value;

                //     }
                //     Map["Registration"]['jsondata']['ageDataForRulesEngine'] = { 'nage': Map["AgeData"], 'ngendercode': Map["ngendercode"] }

                //     let orderType = {
                //         "Order Type": {
                //             "pkey": "nordertypecode",
                //             "label": "NA",
                //             "value": -1,
                //             "source": "ordertype",
                //             "nordertypecode": -1,
                //             "nquerybuildertablecode": 246
                //         }
                //     };
                //     if (this.props.Login.masterData.registrationTemplate.ndefaulttemplatecode === 9) {
                //         //external order
                //         orderType = {
                //             "Order Type": {
                //                 "pkey": "nordertypecode",
                //                 "label": "External",
                //                 "value": 2,
                //                 "source": "ordertype",
                //                 "nordertypecode": 2,
                //                 "nquerybuildertablecode": 246
                //             }
                //         };

                //         Map["Registration"]['jsondata'] = {
                //             ...Map["Registration"]['jsondata'],
                //             ...orderType
                //         };

                //     }
                //     else if (this.props.Login.masterData.registrationTemplate.ndefaulttemplatecode === 6) {
                //         //manual order
                //         orderType = {
                //             "Order Type": {
                //                 "pkey": "nordertypecode",
                //                 "label": "Manual",
                //                 "value": 1,
                //                 "source": "ordertype",
                //                 "nordertypecode": 1,
                //                 "nquerybuildertablecode": 246
                //             }
                //         };

                //         Map["Registration"]['jsondata'] = {
                //             ...Map["Registration"]['jsondata'],
                //             ...orderType
                //         };
                //     }


                //     // Map["Registration"]['jsondata'] = {... Map["Registration"]['jsondata'], 
                //     //                                       ...orderType
                //     //                                      }
                //     Map["orderTypeValue"] = this.state.selectedRecord['Order Type'] && this.state.selectedRecord['Order Type'].value
                //     Map["orderTypelabel"] = this.state.selectedRecord['Order Type'] && this.state.selectedRecord['Order Type'].label
                //     Map["extrenalOrderTypeCode"] = Map["Registration"]['jsonuidata'].nexternalordertypecode;
                //     Map["RegistrationSample"].map((x, i) => {
                //         Map["RegistrationSample"][i]['jsondata'] = { ...x['jsondata'], nordertypecode: Map["orderTypeValue"], sordertypename: Map["orderTypelabel"], externalorderid: this.state.selectedRecord['Order'] && this.state.selectedRecord['Order'].label }
                //         Map["RegistrationSample"][i]['jsonuidata'] = { ...x['jsonuidata'], nordertypecode: Map["orderTypeValue"], sordertypename: Map["orderTypelabel"], externalorderid: this.state.selectedRecord['Order'] && this.state.selectedRecord['Order'].label }
                //     })
                // }
                Map["StabilityStudyPlan"]['jsondata'] = {
                    ...Map["StabilityStudyPlan"]['jsondata'],
                    ncomponentrequired: this.state.specBasedComponent ? 3 : 4
                };
                Map["StabilityStudyPlan"]['jsonuidata'] = {
                    ...Map["StabilityStudyPlan"]['jsonuidata'],
                    ncomponentrequired: this.state.specBasedComponent ? 3 : 4
                };
                Map["skipmethodvalidity"] = false;
                let tempData = {}
                const formData = new FormData();
                let count = 0;
                this.props.Login.withoutCombocomponent.map(item => {
                    if (item.inputtype === "files") {
                        this.state.selectedRecord[item && item.label] && this.state.selectedRecord[item && item.label].forEach((item1, index) => {
                            const fileName = create_UUID();
                            const splittedFileName = item1.name.split('.');
                            const fileExtension = item1.name.split('.')[splittedFileName.length - 1];
                            const uniquefilename = fileName + '.' + fileExtension;
                            tempData[item && item.label + '_susername_Sample'] = this.props.Login.userInfo.susername
                            tempData[item && item.label + '_suserrolename_Sample'] = this.props.Login.userInfo.suserrolename
                            tempData[item && item.label + '_nfilesize_Sample'] = item1.size
                            tempData[item && item.label + '_ssystemfilename_Sample'] = uniquefilename
                            tempData[item && item.label] = Lims_JSON_stringify(item1.name.trim(), false)
                            formData.append("uploadedFile" + count, item1);
                            formData.append("uniquefilename" + count, uniquefilename);
                            count++;
                            // formData.append("filecount", count);
                            formData.append("isFileEdited", transactionStatus.YES);
                            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                            Map['isFileupload'] = true;
                            Map["StabilityStudyPlan"]['jsondata'] = {
                                ...Map["StabilityStudyPlan"]['jsondata'],
                                ...tempData
                            };
                            Map["StabilityStudyPlan"]['jsonuidata'] = {
                                ...Map["StabilityStudyPlan"]['jsonuidata'],
                                ...tempData
                            };
                            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                            //formData.append("Map", Lims_JSON_stringify(JSON.stringify(Map)));
                            isFileupload = true;
                        }
                        )
                    }
                })

                this.state.SubSamplewithoutCombocomponent.map(item => {
                    if (item.inputtype === "files") {
                        Map["StbTimePoint"].map((item12, index) => {
                            item12[item && item.label] && item12[item && item.label].forEach((item1) => {
                                formData.append("uploadedFile" + count, item1);
                                formData.append("uniquefilename" + count, Map["StbTimePoint"][index].uniquefilename);
                                count++;
                                // formData.append("filecount",  count);
                                formData.append("isFileEdited", transactionStatus.YES);
                                formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                                isFileupload = true;
                            })
                            delete (Map["StbTimePoint"][index].uniquefilename);
                            delete (Map["StbTimePoint"][index][item && item.label]);
                        })
                    }
                })
                formData.append("Map", Lims_JSON_stringify(JSON.stringify(Map)));
                formData.append("filecount", count);
                const inputParam = {
                    inputData: Map,
                    postParamList: this.props.postParamList,
                    action: "create",
                    formData: formData,
                    isFileupload
                }
                //console.log("insert reg:", inputParam);
                this.props.insertStbStudyPlan(inputParam, this.props.Login.masterData)
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_ADDSUBSAMPLETOPREREGISTER" }));
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
        }
    }

    // ALPD-4914 Added insertSchedulerConfig method for scheduler configuration screen
    insertSchedulerConfig() {
        let Components = this.props.Login.Component;
        let nneedsubsample = this.props.Login.masterData
            && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;
        let isFileupload = false;
        if (this.state.selectedSpec.nallottedspeccode !== undefined
            && this.state.selectedSpec.nallottedspeccode !== "") {
            if (nneedsubsample ? Components && Components.length > 0 : true) {
                let Test = this.props.Login.Test;
                let Map = {};
                Map["testgrouptest"] = TestListManipulation(Components, Test);
                if (nneedsubsample === false && this.props.Login.Test && this.props.Login.Test.length === 0) {
                    Map["SchedulerConfigSample"] = [{
                        "jsondata": { "ssamplename": "NA" }, "slno": 1
                        , "ncomponentcode": -1, "nspecsampletypecode": this.state.selectedSpec.nallottedspeccode.item.nspecsampletypecode
                    }]
                } else {
                    Map["SchedulerConfigSample"] = SubSample(this.props.Login.Component ? this.props.Login.Component : [],
                        this.state.specBasedComponent,
                        this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample, this.state.selectedSpec);
                }
                Map["subsampleDateList"] = this.findSubsampleDateList(this.props.Login.masterData.SubSampleTemplate.jsondata);
                //Map["FromDate"] = rearrangeDateFormat(this.props.Login.userInfo, this.props.fromDate);//formatDate(this.fromDate);
                // Map["ToDate"] = rearrangeDateFormat(this.props.Login.userInfo, this.props.toDate);//formatDate(this.toDate);
                Map["FromDate"] = "";
                Map["ToDate"] = "";
                Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                Map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
                Map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
                Map["nportalrequired"] = this.props.Login.masterData.RealSampleTypeValue.nportalrequired;
                Map["nschedulerconfigtypecode"] = this.props.Login.masterData.RealSchedulerConfigTypeValue.nschedulerconfigtypecode;
                Map["nfilterstatus"] = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus == 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus;
                Map["nsampleschedulerconfigtypecode"] = this.props.Login.masterData.SchedulerConfigTypeValue && this.props.Login.masterData.SchedulerConfigTypeValue.nsampleschedulerconfigtypecode;

                Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.registrationTemplate
                    && this.props.Login.masterData.registrationTemplate.ndesigntemplatemappingcode;
                Map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
                Map["nregsubtypeversioncode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypeversioncode;
                Map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
                Map["nneedsubsample"] = this.props.Login.masterData
                    && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample;
                //  Map["checkBoxOperation"] = 3;
                Map["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;
                Map["nneedmyjob"] = this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedmyjob ? this.props.Login.masterData.RealRegSubTypeValue.nneedmyjob : false;
                const param = getSchedulerConfig(this.props.Login.masterData,
                    this.state.selectedRecord, this.state.selectedSpec,
                    this.props.Login.masterData.registrationTemplate.jsondata,
                    this.props.Login.userInfo, this.props.Login.defaultTimeZone, 'create',
                    this.props.comboComponents);
                //console.log("param:", param);
                Map["SchedulerConfig"] = param.sampleRegistration
                Map["DateList"] = param.dateList
                Map['sampledateconstraints'] = this.sampleeditable.sampledateconstraints;
                Map["userinfo"] = this.props.Login.userInfo;
                Map["samplecombinationunique"] = this.props.samplecombinationunique;
                Map["subsamplecombinationunique"] = this.props.subsamplecombinationunique;
                Map["nflag"] = 2;
                Map["url"] = this.props.Login.settings[24];
                Map["ncontrolcode"] = this.props.Login.ncontrolcode;
                // Map["ntype"] = 2;
                Map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERRESULTS";
                Map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
                Map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
                Map["multipleselectionFlag"] = this.props.Login.settings && parseInt(this.props.Login.settings[7]) === 3 ? true : false;
                Map["ntestpackagecode"] = this.state.selectedRecord['ntestpackagecode'] && this.state.selectedRecord['ntestpackagecode']
                Map["nneedjoballocation"] = this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedjoballocation;
                Map["DataRecordMaster"] = this.props.Login.masterData;
                Map["noutsourcerequired"] = this.props.Login.masterData.RealSampleTypeValue.noutsourcerequired;
                Map["loadAdhocTest"] = this.props.Login.loadAdhocTest == true ? true : false;

                //console.log("this.props.Login.masterData.registrationTemplate:", this.props.Login.masterData.registrationTemplate);
                if (this.props.Login.masterData.SampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
                    const ageComp = this.props.Login.withoutCombocomponent.filter(item => item.name === "Age");
                    const dateComp = this.props.Login.withoutCombocomponent.filter(item => item.name === "Date Of Birth");
                    const genderComp = this.props.Login.comboComponents.filter(item => item.name === "Gender");
                    if (this.state.selectedRecord.hasOwnProperty(ageComp[0].label)) {
                        Map["AgeData"] = parseInt(ageCalculate(this.state.selectedRecord[dateComp[0].label], true));
                    }
                    if (this.state.selectedRecord.hasOwnProperty(genderComp[0].label)) {
                        Map["ngendercode"] = this.state.selectedRecord[genderComp[0].label].value;

                    }
                    Map["SchedulerConfig"]['jsondata']['ageDataForRulesEngine'] = { 'nage': Map["AgeData"], 'ngendercode': Map["ngendercode"] }

                    let orderType = {
                        "Order Type": {
                            "pkey": "nordertypecode",
                            "label": "NA",
                            "value": -1,
                            "source": "ordertype",
                            "nordertypecode": -1,
                            "nquerybuildertablecode": 246
                        }
                    };
                    if (this.props.Login.masterData.registrationTemplate.ndefaulttemplatecode === 9) {
                        //external order
                        orderType = {
                            "Order Type": {
                                "pkey": "nordertypecode",
                                "label": "External",
                                "value": 2,
                                "source": "ordertype",
                                "nordertypecode": 2,
                                "nquerybuildertablecode": 246
                            }
                        };

                        Map["SchedulerConfig"]['jsondata'] = {
                            ...Map["SchedulerConfig"]['jsondata'],
                            ...orderType
                        };

                    }
                    else if (this.props.Login.masterData.registrationTemplate.ndefaulttemplatecode === 6) {
                        //manual order
                        orderType = {
                            "Order Type": {
                                "pkey": "nordertypecode",
                                "label": "Manual",
                                "value": 1,
                                "source": "ordertype",
                                "nordertypecode": 1,
                                "nquerybuildertablecode": 246
                            }
                        };

                        Map["SchedulerConfig"]['jsondata'] = {
                            ...Map["SchedulerConfig"]['jsondata'],
                            ...orderType
                        };
                    }


                    // Map["Registration"]['jsondata'] = {... Map["Registration"]['jsondata'], 
                    //                                       ...orderType
                    //                                      }
                    Map["orderTypeValue"] = this.state.selectedRecord['Order Type'] && this.state.selectedRecord['Order Type'].value
                    Map["orderTypelabel"] = this.state.selectedRecord['Order Type'] && this.state.selectedRecord['Order Type'].label
                    Map["extrenalOrderTypeCode"] = Map["SchedulerConfig"]['jsonuidata'].nexternalordertypecode;
                    Map["SchedulerConfigSample"].map((x, i) => {
                        Map["SchedulerConfigSample"][i]['jsondata'] = { ...x['jsondata'], nordertypecode: Map["orderTypeValue"], sordertypename: Map["orderTypelabel"], externalorderid: this.state.selectedRecord['Order'] && this.state.selectedRecord['Order'].label }
                        Map["SchedulerConfigSample"][i]['jsonuidata'] = { ...x['jsonuidata'], nordertypecode: Map["orderTypeValue"], sordertypename: Map["orderTypelabel"], externalorderid: this.state.selectedRecord['Order'] && this.state.selectedRecord['Order'].label }
                    })
                }

                Map["skipmethodvalidity"] = false;
                let tempData = {}
                const formData = new FormData();
                let count = 0;
                this.props.Login.withoutCombocomponent.map(item => {
                    if (item.inputtype === "files") {
                        this.state.selectedRecord[item && item.label] && this.state.selectedRecord[item && item.label].forEach((item1, index) => {
                            const fileName = create_UUID();
                            const splittedFileName = item1.name.split('.');
                            const fileExtension = item1.name.split('.')[splittedFileName.length - 1];
                            const uniquefilename = fileName + '.' + fileExtension;
                            tempData[item && item.label + '_susername_Sample'] = this.props.Login.userInfo.susername
                            tempData[item && item.label + '_suserrolename_Sample'] = this.props.Login.userInfo.suserrolename
                            tempData[item && item.label + '_nfilesize_Sample'] = item1.size
                            tempData[item && item.label + '_ssystemfilename_Sample'] = uniquefilename
                            tempData[item && item.label] = Lims_JSON_stringify(item1.name.trim(), false)
                            formData.append("uploadedFile" + count, item1);
                            formData.append("uniquefilename" + count, uniquefilename);
                            count++;
                            // formData.append("filecount", count);
                            formData.append("isFileEdited", transactionStatus.YES);
                            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                            Map['isFileupload'] = true;
                            Map["SchedulerConfig"]['jsondata'] = {
                                ...Map["SchedulerConfig"]['jsondata'],
                                ...tempData
                            };
                            Map["SchedulerConfig"]['jsonuidata'] = {
                                ...Map["SchedulerConfig"]['jsonuidata'],
                                ...tempData
                            };
                            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                            //formData.append("Map", Lims_JSON_stringify(JSON.stringify(Map)));
                            isFileupload = true;
                        }
                        )
                    }
                })

                this.state.SubSamplewithoutCombocomponent.map(item => {
                    if (item.inputtype === "files") {
                        Map["SchedulerConfigSample"].map((item12, index) => {
                            item12[item && item.label] && item12[item && item.label].forEach((item1) => {
                                formData.append("uploadedFile" + count, item1);
                                formData.append("uniquefilename" + count, Map["SchedulerConfigSample"][index].uniquefilename);
                                count++;
                                // formData.append("filecount",  count);
                                formData.append("isFileEdited", transactionStatus.YES);
                                formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                                isFileupload = true;
                            })
                            delete (Map["SchedulerConfigSample"][index].uniquefilename);
                            delete (Map["SchedulerConfigSample"][index][item && item.label]);
                        })
                    }
                })
                formData.append("Map", Lims_JSON_stringify(JSON.stringify(Map)));
                formData.append("filecount", count);
                const inputParam = {
                    inputData: Map,
                    postParamList: this.props.postParamList,
                    action: "create",
                    formData: formData,
                    isFileupload
                }
                //console.log("insert reg:", inputParam);
                this.props.insertSchedulerConfig(inputParam, this.props.Login.masterData)
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_ADDSUBSAMPLETOADD" }));
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
        }
    }

    onNumericInputChange = (value, name) => {
        let selectedRecord = this.state.selectedRecord
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onNumericBlur = (value, control) => {
        let selectedRecord = this.state.selectedRecord
        if (selectedRecord[control.label]) {
            if (control.max) {
                if (!(selectedRecord[control.label] < parseFloat(control.max))) {
                    selectedRecord[control.label] = control.precision ? parseFloat(control.max) : parseInt(control.max)
                }
            }
            if (control.min) {
                if (!(selectedRecord[control.label] > parseFloat(control.min))) {
                    selectedRecord[control.label] = control.precision ? parseFloat(control.min) : parseInt(control.min)
                }
            }


        }
        this.setState({ selectedRecord });
    }



    handleExportClick = () => {

        if (this.state.selectedSpec.nallottedspeccode) {
            const exportFiled = [];
            const Layout = this.props.Login.masterData.registrationTemplate
                && this.props.Login.masterData.registrationTemplate.jsondata
            if (Layout !== undefined) {
                Layout.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            return component.hasOwnProperty("children") ?
                                component.children.map(componentrow => {
                                    if (this.props.sampleexportfields.findIndex(x => x === componentrow.label) !== -1) {
                                        exportFiled.push(componentrow)
                                    }
                                    return null;
                                })
                                :
                                (this.props.sampleexportfields.findIndex(x => x === component.label) !== -1) ?
                                    exportFiled.push(component) : ""
                        })
                    })

                })
            }
            const subSampleLayout = this.props.Login.masterData.SubSampleTemplate &&
                this.props.Login.masterData.SubSampleTemplate.jsondata
            if (this.state.specBasedComponent) {
                exportFiled.push({ "displayname": "IDS_COMPONENT", "idsField": true, "label": "ncomponentcode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" })
            }
            const mandatoryCheck = []

            if (subSampleLayout !== undefined) {
                subSampleLayout.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            return component.hasOwnProperty("children") ?
                                component.children.map(componentrow => {
                                    if (this.props.subsampleexportfields.findIndex(x => x === componentrow.label) !== -1) {
                                        exportFiled.push(componentrow)
                                    }
                                    else if (componentrow.mandatory) {
                                        mandatoryCheck.push(componentrow)
                                    }
                                    return null;
                                })
                                :
                                (this.props.subsampleexportfields.findIndex(x => x === component.label) !== -1) ?
                                    exportFiled.push(component) : component.mandatory ? mandatoryCheck.push(component) : ""
                        })
                    })

                })
            }
            if (exportFiled.length > 0) {
                if (this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample === true) {
                    if (mandatoryCheck.length === 0) {
                        this.setState({ exportFiled, export: true });
                    } else {
                        toast.info(this.props.intl.formatMessage({ id: "IDS_SUBSAMPLEMANDATORYFIELDMUSTBEEXPORT" }))
                    }
                } else {
                    this.setState({ exportFiled, export: true });
                }


            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_EXPORTFIELDSNOTAVAILABLE" }))
            }

        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }))
        }
    }



    render() {
        let saveType = 1;
        if (this.props.ignoreFormValidation) {
            saveType = 5;
        }
        let buttonLabel = "Save";
        let idsLabel = "IDS_SAVE";
        if (this.props.buttonLabel) {
            buttonLabel = this.props.buttonLabel;
            idsLabel = 'IDS_'.concat(buttonLabel.toUpperCase());
        }
        // const testColumnList = [
        //     { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", width: "200px" },
        //     { "idsName": "IDS_SECTION", "dataField": "ssectionname", width: "150px" },
        //     { "idsName": "IDS_SOURCE", "dataField": "ssourcename", width: "150px" },
        //     { "idsName": "IDS_METHOD", "dataField": "smethodname", width: "150px" },
        //     { "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "sinstrumentcatname", width: "200px" }]
        return (

            <Modal
                size={this.props.Login.loadComponent ?
                    'lg' : this.props.Login.loadSpec ? 'lg' :
                        this.props.Login.loadTest ? 'lg' :
                            this.props.Login.loadSubSample ? 'lg' :
                                this.props.Login.loadCustomSearchFilter ? 'xl' : 'xl'}
                // size={this.props.templateData[0] ?
                //     this.props.templateData[0].children ?
                //         this.props.templateData[0].children.length >= 2 ? 'xl' : 'lg' : 'lg' : 'lg'}
                backdrop="static"
                //className={this.props.className || "registrationModel"}
                className={this.props.Login.loadCustomSearchFilter ? 'wide-popup' : this.props.className || ""}
                show={this.props.Login.openPortal}
                onHide={this.props.closeModal}
                enforceFocus={false}
                dialogClassName="modal-dialog-slideout freakerstop"
                aria-labelledby="add-user">
                {/* <Modal.Header className="d-flex align-items-center mb-2"> */}
                <Modal.Header className="d-flex align-items-center">
                    <Modal.Title id="add-user" className="header-primary flex-grow-1">
                        {this.props.graphView === true ? "" : this.props.Login.inputParam ?
                            this.props.Login.esign === true ?
                                <FormattedMessage id={"IDS_ESIGN"} defaultMessage="Esign" />
                                : this.props.Login.loadEsign === true ?
                                    <FormattedMessage id={"IDS_ESIGN"} defaultMessage="Esign" />
                                    : this.props.loginoperation ?
                                        <FormattedMessage id={this.props.Login.screenName} />
                                        : <>
                                            {this.props.operation ?
                                                <>
                                                    <FormattedMessage id={this.props.Login.operation && "IDS_".concat(this.props.Login.addMaster ? this.props.Login.masterOperation[this.props.Login.masterIndex].toUpperCase() : this.props.Login.operation.toUpperCase())}
                                                        defaultMessage='Add' />
                                                    {" "}
                                                    {
                                                        this.props.Login.screenName ?
                                                            <FormattedMessage id={this.props.Login.screenName} />
                                                            : ""
                                                    }
                                                </>
                                                :
                                                this.props.Login.screenName ?
                                                    <FormattedMessage id={this.props.Login.screenName} />
                                                    : ""}
                                        </>
                            : ""}
                    </Modal.Title>
                    <Button className="btn-user btn-cancel" variant=""
                        onClick={this.props.Login.isDynamicViewSlideOut ? this.closeDynamicView :
                            this.props.Login.loadCustomSearchFilter ? this.closeKendoFilter :
                                this.props.Login.addMaster ? this.closeAddMaster : this.props.Login.loadSpec ?
                                    this.closeSpec : this.props.Login.loadTest ? this.closeTest : this.props.Login.loadComponent ?
                                        this.closeComponent : this.props.Login.loadSubSample ? this.closeSubSample :
                                            this.props.Login.loadImportFileData ? this.closeImportFileData :
                                                this.props.Login.loadImportSampleCountData ? this.closeImportSampleCountData :
                                                    this.props.closeModal}>
                        <FormattedMessage id='IDS_CANCEL' defaultMessage='Cancel' />
                    </Button>
                    {this.props.Login.operation === "create" && (!this.props.Login.addMaster &&
                        !this.props.Login.loadComponent && !this.props.Login.loadSubSample &&
                        !this.props.Login.loadImportSampleCountData && !this.props.Login.loadTest &&
                        !this.props.Login.loadImportFileData && !this.props.Login.loadEsign
                        && !this.props.Login.loadSpec
                        && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE) ?
                        <>

                            <Button className=" btn-user btn-primary-blue"
                                onClick={() => this.handleExportClick()}
                                hidden={this.props.userRoleControlRights.indexOf(this.props.exportTemplateId) === -1}

                            >
                                <FontAwesomeIcon icon={faFileExport} /> { }
                                <FormattedMessage id={"IDS_EXPORTTEMPLATE"} defaultMessage={buttonLabel} />
                            </Button>

                            <Button className=" btn-user btn-primary-blue"
                                hidden={this.props.userRoleControlRights.indexOf(this.props.importTemplateId) === -1}
                                onClick={() => this.AddImportFile(this.state.selectedRecord)}>
                                <FontAwesomeIcon icon={faFileImport} /> { }
                                <FormattedMessage id={"IDS_IMPORTTEMPLATE"} defaultMessage={"IDS_IMPORTTEMPLATE"} />
                            </Button>
                        </>
                        : ""}

                    {this.props.Login.loadEsign === true ?
                        <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(3)}>
                            <FontAwesomeIcon icon={faSave} /> { }
                            <FormattedMessage id='IDS_SUBMIT' defaultMessage='Submit' />
                        </Button>
                        :
                        (this.props.operation === "create" || this.props.operation === "update") && this.props.showValidate ?
                            <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(4)}>
                                <FontAwesomeIcon icon={faSave} /> { }
                                <FormattedMessage id='IDS_VALIDATE' defaultMessage='Validate' />
                            </Button> :
                            this.props.showCalculate ?
                                <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(saveType)}>
                                    <FontAwesomeIcon icon={faSave} /> { }
                                    <FormattedMessage id='IDS_CALCULATE' defaultMessage='Calculate' />
                                </Button> :
                                this.props.showParam === true && this.props.showExecute ?
                                    <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(4)}>
                                        <FontAwesomeIcon icon={faCalculator} /> { }
                                        <FormattedMessage id='IDS_EXECUTE' defaultMessage='Execute' />
                                    </Button> :
                                    this.props.noSave || this.props.graphView ?
                                        this.props.operation === "view" ? ""
                                            : <Button className="btn btn-user btn-primary-blue" role="button"
                                                onClick={this.props.resetView}
                                            >
                                                <FormattedMessage id={"IDS_RESET"} defaultMessage='Reset' />
                                            </Button>
                                        : this.props.Login.loadEsign === true && this.props.Login.operation === "update" ? -
                                            <Button className=" btn-user btn-primary-blue" onClick={() => this.handleSaveClick(3)}>
                                                <FontAwesomeIcon icon={faSave} /> { }
                                                <FormattedMessage id={idsLabel} defaultMessage={buttonLabel} />
                                            </Button>
                                            : this.props.Login.loadCustomSearchFilter || ((!this.props.Login.addMaster &&
                                                !this.props.Login.loadComponent && !this.props.Login.loadSubSample &&
                                                !this.props.Login.loadImportSampleCountData && !this.props.Login.loadTest &&
                                                !this.props.Login.loadImportFileData && !this.props.Login.loadEsign && !this.props.Login.loadSpec)
                                                && this.props.Login.importData) ? "" :
                                                <>


                                                    <Button className=" btn-user btn-primary-blue" onClick={() => this.handleSaveClick(saveType)}>
                                                        <FontAwesomeIcon icon={faSave} /> { }
                                                        <FormattedMessage id={idsLabel} defaultMessage={buttonLabel} />
                                                    </Button>
                                                </>
                    }
                    {this.props.Login.operation === "create" && (this.props.Login.showSaveContinue && (this.props.Login.addMaster === undefined || this.props.Login.addMaster === false)) ?
                        <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(2)}>
                            <FontAwesomeIcon icon={faSave} /> { }
                            <FormattedMessage id='IDS_SAVECONTINUE' defaultMessage='Save & Continue' />
                        </Button>
                        : ""
                    }
                    {(this.props.operation === "create" || this.props.operation === "update")
                        && this.props.esign !== true && this.props.showExecute === true && this.props.showSave ?
                        <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(1)}>
                            <FontAwesomeIcon icon={faSave} /> { }
                            <FormattedMessage id='IDS_SAVE' defaultMessage='Save' />
                        </Button>
                        : ""}
                </Modal.Header>
                <Modal.Body className='popup-fixed-center-headed-full-width'>
                    <ModalInner ref={this.myRef} >
                        <Card.Body >
                            {/* className="no-padding" */}
                            {/* <SplitterLayout borderColor="#999"
                                primaryIndex={1} percentage={true}
                                secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                onSecondaryPaneSizeChange={this.paneSizeChange}
                                primaryMinSize={40}
                                secondaryMinSize={20}
                                vertical={true}
                            > */}
                            <React.Fragment>
                                <Form ref={this.formRef}>

                                    {this.props.Login.patientRegistration ?
                                        <Row>
                                            <Col>
                                                <PatientMaster Login={this.props.Login} />
                                            </Col>
                                        </Row> : this.props.Login.isDynamicViewSlideOut ?
                                            <ExternalOrderSlideout
                                                dynamicExternalSample={this.props.Login.dynamicExternalSample}
                                                dynamicExternalTestChild={this.props.Login.dynamicExternalTestChild}
                                                dynamicGridSelectedId={this.props.Login.dynamicGridSelectedId || null}
                                                selectedRecord={this.state.selectedRecord}
                                                selectedDynamicViewControl={this.props.Login.selectedDynamicViewControl}
                                            />

                                            : this.props.Login.loadCustomSearchFilter ?
                                                this.props.Login.seletedFilterComponent.inputtype === 'frontendsearchfilter' ?
                                                    <KendoDatatoolFilter
                                                        filter={this.props.Login.kendoFilter}
                                                        handleFilterChange={this.handleFilterChange}
                                                        filterData={this.props.Login.lstPatient || []}
                                                        skip={this.props.Login.kendoSkip}
                                                        take={this.props.Login.kendoTake}
                                                        handlePageChange={this.handlePageChange}
                                                        fields={this.props.Login.fields || []}
                                                        gridColumns={this.props.Login.gridColumns || []}
                                                        onRowClick={this.handleKendoRowClick}
                                                        userInfo={this.props.Login.userInfo}

                                                    /> : <FilterQueryBuilder
                                                        fields={this.props.Login.fields || {}}
                                                        onChange={this.onChangeAwesomeQueryBuilder}
                                                        tree={this.props.Login.awesomeTree}
                                                        config={this.props.Login.awesomeConfig}
                                                        skip={this.props.Login.kendoSkip}
                                                        take={this.props.Login.kendoTake}
                                                        handlePageChange={this.handlePageChange}
                                                        gridColumns={this.props.Login.gridColumns || []}
                                                        filterData={this.props.Login.lstPatient}
                                                        onRowClick={this.handleKendoRowClick}
                                                        handleExecuteClick={this.handleExecuteClick}
                                                        userInfo={this.props.Login.userInfo}
                                                    /> :
                                                this.props.Login.loadSpec ?
                                                    <AddSpecification
                                                        AgaramTree={this.props.Login.AgaramTree}
                                                        openNodes={this.props.Login.OpenNodes}
                                                        handleTreeClick={this.onTreeClick}
                                                        focusKey={this.props.Login.FocusKey}
                                                        activeKey={this.props.Login.ActiveKey}
                                                        Specification={this.props.Login.Specification}
                                                        selectedSpec={this.state.selectedSpec}
                                                        selectedRecord={this.state.selectedRecord}
                                                        onSpecChange={this.onspecChange}
                                                    />
                                                    : this.props.Login.loadTest ?
                                                        <AddTest
                                                            TestCombined={this.props.Login.TestCombined || []}
                                                            TestChange={this.TestChange}
                                                            selectedTestData={this.props.Login.selectedTestData}
                                                            TestPackage={this.props.Login.TestPackage || []}
                                                            selectPackage={this.state.selectPackage}
                                                            selectSection={this.state.selectSection}
                                                            onTestPackageChange={this.onTestPackageChange}
                                                            onTestSectionChange={this.onTestSectionChange}
                                                            hideQualisForms={this.props.Login.hideQualisForms}
                                                            TestSection={this.props.Login.TestSection || []}

                                                        /> : this.props.Login.loadComponent ?
                                                            <AddComponentPopUp
                                                                ref={this.myScrollRef}
                                                                selectComponent={this.state.selectComponent || {}}
                                                                RealSampleTypeValue={this.props.Login.masterData.RealSampleTypeValue || {}}
                                                                RealRegTypeValue={this.props.Login.masterData.RealRegTypeValue || {}}
                                                                RealRegSubTypeValue={this.props.Login.masterData.RealRegSubTypeValue || {}}
                                                                RealFilterStatusValue={this.props.Login.masterData.RealFilterStatusValue || {}}
                                                                formatMessage={this.props.intl.formatMessage}
                                                                handleDateChange={this.handleDateChangeComp}
                                                                Component={this.props.Login.lstComponent || []}
                                                                onInputComponentOnChange={this.onInputComponentOnChange}
                                                                // onComboChange={this.onComponentComboChange}
                                                                timeZoneList={this.props.Login.timeZoneList}
                                                                onComponentChange={this.onComponentChange}
                                                                userInfo={this.props.Login.userInfo}
                                                                sreceiveddate={this.props.Login.sreceiveddate || []}
                                                                CurrentTime={this.props.Login.CurrentTime}
                                                            /> : this.props.Login.addMaster ?
                                                                <AddMasterRecords
                                                                    selectedControl={this.props.Login.selectedControl[this.props.Login.masterIndex]}
                                                                    fieldList={this.props.Login.masterfieldList && this.props.Login.masterfieldList[this.props.Login.masterIndex]}
                                                                    extractedColumnList={this.props.Login.masterextractedColumnList[this.props.Login.masterIndex]}
                                                                    // primaryKeyField={this.props.Login.masterprimaryKeyField}
                                                                    selectedRecord={this.state.selectedMaster[this.props.Login.masterIndex] || {}}
                                                                    onInputOnChange={this.onInputOnChangeMaster}
                                                                    onComboChange={this.onComboChangeMaster}
                                                                    handleDateChange={this.handleDateChangeMaster}
                                                                    dataList={this.props.Login.masterdataList && this.props.Login.masterdataList[this.props.Login.masterIndex]}
                                                                    onNumericInputOnChange={this.onNumericInputOnChangeMaster}
                                                                    masterDesign={this.props.Login.masterDesign && this.props.Login.masterDesign[this.props.Login.masterIndex]}
                                                                    mastertimeZoneList={this.props.Login.mastertimeZoneList}
                                                                    masterdefaultTimeZone={this.props.Login.masterdefaultTimeZone}
                                                                    onComboChangeMasterDyanmic={this.onComboChangeMasterDyanmic}
                                                                    handleDateChangeMasterDynamic={this.handleDateChangeMasterDynamic}
                                                                    onInputOnChangeMasterDynamic={this.onInputOnChangeMasterDynamic}
                                                                    onNumericInputChangeMasterDynamic={this.onNumericInputChangeMasterDynamic}
                                                                    onNumericBlurMasterDynamic={this.onNumericBlurMasterDynamic}
                                                                    userInfo={this.props.Login.userInfo}
                                                                    Login={this.props.Login}
                                                                    addMasterRecord={this.addMasterRecord}
                                                                    userRoleControlRights={this.props.Login.userRoleControlRights}
                                                                    masterIndex={this.props.Login.masterIndex}
                                                                    custombuttonclick={this.custombuttonclick}
                                                                    editMasterRecord={this.editMasterRecord}

                                                                />
                                                                : this.props.Login.loadSubSample ?
                                                                    <AddSubSample
                                                                        Component={this.props.Login.lstComponent || []}
                                                                        selectComponent={this.state.selectComponent}
                                                                        selectedRecord={this.state.selectedRecord}
                                                                        onComponentChange={this.onComponentChange}
                                                                        onInputComponentOnChange={this.onInputComponentOnChange}
                                                                        templateData={this.props.Login.masterData.SubSampleTemplate &&
                                                                            this.props.Login.masterData.SubSampleTemplate.jsondata}
                                                                        genericLabel={this.props.Login.genericLabel}
                                                                        userInfo={this.props.Login.userInfo}
                                                                        timeZoneList={this.props.Login.timeZoneList}
                                                                        defaultTimeZone={this.props.Login.defaultTimeZone}
                                                                        handleDateChange={this.handleDateSubSampleChange}
                                                                        onInputOnChange={this.onInputOnSubSampleChange}
                                                                        onNumericInputChange={this.onNumericInputSubSampleChange}
                                                                        onNumericBlur={this.onNumericBlurSubSample}
                                                                        comboData={this.props.Login.SubSamplecomboData}
                                                                        onComboChange={this.onComboSubSampleChange}
                                                                        TestCombined={this.props.Login.TestCombined || []}
                                                                        TestChange={this.TestChange}
                                                                        selectedTestData={this.state.selectedTestData}
                                                                        selectPackage={this.state.selectPackage}
                                                                        selectSection={this.state.selectSection}
                                                                        selectedTestPackageData={this.state.selectedTestPackageData}
                                                                        TestPackage={this.props.Login.TestPackage || []}
                                                                        TestSection={this.props.Login.TestSection || []}
                                                                        childoperation={this.props.Login.childoperation}
                                                                        specBasedComponent={this.state.specBasedComponent}
                                                                        onTestPackageChange={this.onTestPackageChange}
                                                                        onTestSectionChange={this.onTestSectionChange}
                                                                        userRoleControlRights={this.props.Login.userRoleControlRights}
                                                                        hideQualisForms={this.props.Login.hideQualisForms}
                                                                        addMasterRecord={this.addMasterRecord}
                                                                        editMasterRecord={this.editMasterRecord}
                                                                        onDropFile={this.onDropFileSubSample}
                                                                        deleteAttachment={this.deleteAttachmentSubSample}

                                                                    />
                                                                    : this.props.Login.loadEsign ?

                                                                        <Esign
                                                                            operation={this.props.Login.operation}
                                                                            onInputOnChange={this.onInputOnChange}
                                                                            inputParam={this.props.Login.inputParam}
                                                                            selectedRecord={this.props.Login.selectedRecord}
                                                                        />
                                                                        : this.props.Login.loadImportFileData ?
                                                                            <AddImportFileData
                                                                                //ALPD-3596                                                                  
                                                                                TestCombined={this.state.TestCombinedForImport || []}
                                                                                TestChange={this.TestChange}
                                                                                selectedTestData={this.state.selectedTestData}
                                                                                specBasedComponent={this.state.specBasedComponent}
                                                                                userInfo={this.props.Login.userInfo}
                                                                                selectedRecord={this.state.selectedRecord}
                                                                                onDropFile={this.onDropFile}
                                                                                deleteAttachment={this.deleteAttachment}
                                                                                onInputOnChange={this.onInputOnChange}

                                                                            />
                                                                            : this.props.Login.loadImportSampleCountData ?
                                                                                <AddImportSampleCountData
                                                                                    selectedRecord={this.state.selectedRecord}
                                                                                    userInfo={this.props.Login.userInfo}
                                                                                    onNumericInputChange={this.onNumericInputChange}
                                                                                />
                                                                                : <StbRegSlideOut
                                                                                    //addPatient={this.addPatient}
                                                                                    onSchedulerComboChange={this.onSchedulerComboChange}
                                                                                    siteList={this.props.siteList || []}
                                                                                    nsampleschedulerconfigtypecode={this.props.nsampleschedulerconfigtypecode}
                                                                                    schedulerList={this.props.schedulerList || []}
                                                                                    scheduleMasterDetails={this.props.scheduleMasterDetails || []}


                                                                                    editfield={this.sampleeditable &&
                                                                                        this.sampleeditable['sampleeditable']}
                                                                                    ntransactionstatus={this.props.Login.masterData && this.props.Login.masterData.selectedSample &&
                                                                                        this.props.Login.masterData.selectedSample.length > 0
                                                                                        && this.props.Login.masterData.selectedSample[0].ntransactionstatus}
                                                                                    loadPreregister={this.props.Login.loadPreregister}
                                                                                    selectedSpec={this.state.selectedSpec}
                                                                                    selectedRecord={this.state.selectedRecord}
                                                                                    selectedComponent={this.props.Login.selectedComponent}
                                                                                    subSampleDataGridList={this.props.Login.subSampleDataGridList || []}
                                                                                    SelectedTest={this.props.Login.SelectedTest}
                                                                                    selectedTestData={this.state.selectedTestData}
                                                                                    userRoleControlRights={this.props.userRoleControlRights}
                                                                                    userRoleControlRights1={this.props.Login.userRoleControlRights}
                                                                                    templateData={this.props.Login.masterData.registrationTemplate ?
                                                                                        this.props.Login.masterData.registrationTemplate.jsondata :
                                                                                        this.props.Login.masterData.schedulerTemplate ?
                                                                                            this.props.Login.masterData.schedulerTemplate.jsondata : {}}
                                                                                    handleChange={this.props.handleChange}
                                                                                    handleDateChange={this.handleDateChange}
                                                                                    onInputOnChange={this.onInputOnChange}
                                                                                    onNumericInputChange={this.onNumericInputChange}
                                                                                    onNumericBlur={this.onNumericBlur}
                                                                                    comboData={this.props.Login.comboData}
                                                                                    onComboChange={this.onComboChange}
                                                                                    userInfo={this.props.Login.userInfo}
                                                                                    timeZoneList={this.props.Login.timeZoneList}
                                                                                    defaultTimeZone={this.props.Login.defaultTimeZone}
                                                                                    AddSpec={this.AddSpec}
                                                                                    addTest={this.addTestslide}
                                                                                    handleComponentRowClick={this.handleComponentRowClick}
                                                                                    nneedsubsample={this.props.Login.masterData
                                                                                        && this.props.Login.masterData.RealRegSubTypeValue ?
                                                                                        this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample : false}
                                                                                    specBasedComponent={this.state.specBasedComponent}
                                                                                    AddComponent={this.AddComponent}
                                                                                    deleteComponent={this.deleteComponent}
                                                                                    deleteTest={this.deleteTest}
                                                                                    editComponent={this.editComponent}
                                                                                    componentColumnList={this.componentColumnList}
                                                                                    Component={this.props.Login.Component}
                                                                                    TestChange={this.TestChange}
                                                                                    testDataState={this.state.testDataState}
                                                                                    subSampleDataState={this.state.subSampleDataState}
                                                                                    testDataStateChange={this.testDataStateChange}
                                                                                    subSampleDataStateChange={this.subSampleDataStateChange}
                                                                                    addsubSample={this.addsubSample}
                                                                                    editSubSample={this.editSubSample}
                                                                                    subSampleDataGridFields={this.subSampleDataGridList}
                                                                                    selectedSample={this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample[0] || {}}
                                                                                    operation={this.props.Login.operation}
                                                                                    specBasedTestPackage={this.state.specBasedTestPackage}
                                                                                    custombuttonclick={this.custombuttonclick}
                                                                                    addMasterRecord={this.addMasterRecord}
                                                                                    editMasterRecord={this.editMasterRecord}
                                                                                    onClickView={this.onClickView}
                                                                                    comboComponents={this.props.Login.comboComponents}
                                                                                    sampleType={{
                                                                                        "label": this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.ssampletypename,
                                                                                        "value": this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                                                                                        "item": this.props.Login.masterData.RealSampleTypeValue,
                                                                                    }}
                                                                                    onDropFile={this.onDropFile}
                                                                                    deleteAttachment={this.deleteAttachment}
                                                                                    AddImportFile={this.AddImportFile}
                                                                                    AddSampleCount={this.AddSampleCount}
                                                                                    importData={this.props.Login.importData}
                                                                                    ntestgroupspecrequired={this.props.Login.masterData
                                                                                        && this.props.Login.masterData.RealRegSubTypeValue ?
                                                                                        this.props.Login.masterData.RealRegSubTypeValue.ntestgroupspecrequired : false} //ALPD-4834, Vishakh, Added ntestgroupspecrequired key to send value to RegisterSlideOut component
                                                                                />
                                    }
                                </Form>
                                {this.state.export ?
                                    <LocalizationProvider>
                                        <ExcelExport
                                            data={[]}
                                            collapsible={true}
                                            fileName={(this.props.Login.screenName && this.props.Login.screenName) + "_" + this.state.selectedSpec.nallottedspeccode.label}
                                            ref={(exporter) => {
                                                this._excelExportHeader = exporter;
                                            }}>
                                            {[...this.state.exportFiled].map((item, index) =>
                                                <ExcelExportColumn
                                                    field={item.label} title={(item.idsField ? this.props.intl.formatMessage({ id: item.displayname }) : item.displayname[this.props.Login.userInfo.slanguagetypecode]) + '(' + item.label + ')' + (item.inputtype === "date" ? item.dateonly ? '(yyyy-mm-dd)' : item.timeonly ? '(HH:mm:ss)' : '(yyyy-mm-dd  HH:mm:ss)' : "")} width={200} />
                                            )

                                            }
                                        </ExcelExport>
                                    </LocalizationProvider > : ""}
                            </React.Fragment>
                            {/* </SplitterLayout> */}
                        </Card.Body>
                    </ModalInner>
                </Modal.Body>
            </Modal>
        );
    }

    onComboChangeMaster = (comboData, fieldName, item) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}
        if (comboData !== null) {
            if (this.props.Login.selectedControl[masterIndex].table.item.nformcode === 137) {
                selectedMaster[masterIndex][item.tableDataField] = comboData.value;
            }
            else if (item.foreignDataField) {
                selectedMaster[masterIndex][item.foreignDataField] = comboData.value;
            }
        }
        selectedMaster[masterIndex][fieldName] = comboData;
        if (item.childIndex !== undefined) {
            this.props.getChildComboMaster(selectedMaster, fieldName, item,
                this.props.Login.selectedControl,
                this.props.Login.masterfieldList,
                this.props.Login.masterdataList, this.props.Login.userInfo, masterIndex)
        } else {
            this.setState({ selectedMaster });
        }

    }

    handleDateChangeMaster = (dateName, dateValue, item) => {
        //   const { selectedMaster } = this.state;
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][dateName] = dateValue;
        const age = ageCalculate(dateValue);
        selectedMaster[masterIndex]["sage"] = age;
        this.setState({ selectedMaster });

    }

    onNumericInputOnChangeMaster = (value, name, item) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][name] = value;
        this.setState({ selectedMaster });
    }
    onInputOnChangeMaster = (event) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        if (event.target.type === 'checkbox') {
            selectedMaster[masterIndex][event.target.name] = event.target.checked === true ? 3 : 4;
            if (this.props.Login.selectedControl[masterIndex].table.item.nformcode === 137) {
                if (selectedMaster[masterIndex].nneedcurrentaddress === 3) {
                    selectedMaster[masterIndex].sflatnotemp = selectedMaster[masterIndex].sflatno;
                    selectedMaster[masterIndex].shousenotemp = selectedMaster[masterIndex].shouseno;
                    selectedMaster[masterIndex].spostalcodetemp = selectedMaster[masterIndex].spostalcode;
                    selectedMaster[masterIndex].sstreettemp = selectedMaster[masterIndex].sstreet;
                    selectedMaster[masterIndex].scitynametemp = selectedMaster[masterIndex].scityname;
                    selectedMaster[masterIndex].sdistrictnametemp = selectedMaster[masterIndex].sdistrictname;
                    selectedMaster[masterIndex].sregionnametemp = selectedMaster[masterIndex].sregionname;
                }
                else {
                    selectedMaster[masterIndex].sflatnotemp = "";
                    selectedMaster[masterIndex].shousenotemp = "";
                    selectedMaster[masterIndex].spostalcodetemp = "";
                    selectedMaster[masterIndex].sstreettemp = "";
                    selectedMaster[masterIndex].scitynametemp = "";
                    selectedMaster[masterIndex].sdistrictnametemp = "";
                    selectedMaster[masterIndex].sregionnametemp = "";
                }
            }
        }
        else {
            // selectedMaster[masterIndex][event.target.name] = event.target.value;
            if (event.target.name === "smobileno" || event.target.name === "sphoneno") {
                if (event.target.value !== "") {
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedMaster[masterIndex][event.target.name] = event.target.value !== "" ?
                        event.target.value : selectedMaster[masterIndex][event.target.name];
                }
                else {
                    selectedMaster[masterIndex][event.target.name] = event.target.value;
                }
            } else {
                selectedMaster[masterIndex][event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedMaster });
    }

    onSaveMasterRecord = (saveType, formRef) => {
        //add / edit            
        const masterIndex = this.props.Login.masterIndex;
        let inputData = [];
        const selectedControl = this.props.Login.selectedControl
        const masterDesign = this.props.Login.masterDesign
        inputData["userinfo"] = { ...this.props.Login.userInfo, nformcode: selectedControl[masterIndex].table.item.nformcode };
        inputData[selectedControl[masterIndex].table.item.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

        let isEmailCheck = true;
        let isFileupload = false;
        const formData = new FormData();
        const methodUrl = selectedControl[masterIndex].table.item.methodUrl.toLowerCase()
        if (this.props.Login.masterOperation[masterIndex] === 'update') {
            if (selectedControl[masterIndex].table.item.component === 'Dynamic') {
                inputData[methodUrl]["ndynamicmastercode"] = this.props.Login.masterEditObject[masterIndex].item ?
                    this.props.Login.masterEditObject[masterIndex].item.jsondata.ndynamicmastercode : this.props.Login.masterEditObject[masterIndex].ndynamicmastercode
            }
            else {
                inputData[methodUrl][selectedControl[masterIndex]["valuemember"]] = this.props.Login.masterEditObject[masterIndex].value
            }

        }

        if (selectedControl[masterIndex].table.item.component === 'Dynamic') {
            const selectedMaster = this.state.selectedMaster;
            inputData["userinfo"] = { ...this.props.Login.userInfo, nformcode: selectedControl[masterIndex].table.item.nformcode };
            inputData["masterdateconstraints"] = masterDesign[masterIndex].screendesign.masterdateconstraints;
            inputData["masterdatefields"] = masterDesign[masterIndex].screendesign.masterdatefields;
            inputData["mastercombinationunique"] = masterDesign[masterIndex].screendesign.mastercombinationunique;
            //add                          
            inputData["dynamicmaster"] = {
                ...inputData[methodUrl],
                nformcode: selectedControl[masterIndex].table.item.nformcode,
                ndesigntemplatemappingcode: masterDesign[masterIndex].ndesigntemplatemappingcode,
                jsondata: {}, jsonuidata: {}
            };

            const dateList = [];
            const defaulttimezone = this.props.Login.defaulttimezone;
            isFileupload = true;
            inputData["isFileupload"] = false;
            masterDesign[masterIndex] &&
                masterDesign[masterIndex].slideoutdesign.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if (component.hasOwnProperty("children")) {

                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo") {
                                        inputData["dynamicmaster"]["jsondata"][componentrow.label] = selectedMaster[componentrow.label] ?
                                            {
                                                value: selectedMaster[masterIndex][componentrow.label].value,
                                                label: selectedMaster[masterIndex][componentrow.label].label,
                                                pkey: componentrow.valuemember,
                                                nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                                source: componentrow.source,
                                                [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]: this.props.Login.masterOperation[masterIndex] === 'update' ?
                                                    selectedMaster[masterIndex][componentrow.label].item ? selectedMaster[masterIndex][componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                                        selectedMaster[masterIndex][componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                                    :
                                                    selectedMaster[masterIndex][componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                            } : -1

                                        inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = selectedMaster[masterIndex][componentrow.label] ? selectedMaster[masterIndex][componentrow.label].label : ""

                                    }
                                    else if (componentrow.inputtype === "date") {
                                        if (componentrow.mandatory) {
                                            inputData["dynamicmaster"]["jsondata"][componentrow.label] = formatDate(selectedMaster[masterIndex][componentrow.label], false)

                                            inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label]
                                            //inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = convertDateTimetoString(selectedRecord[componentrow.label], userInfo);
                                        }
                                        else {
                                            inputData["dynamicmaster"]["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                                formatDate(selectedMaster[masterIndex][componentrow.label] || new Date(), false) :
                                                selectedMaster[masterIndex][componentrow.label] ? formatDate(selectedMaster[masterIndex][componentrow.label], false)
                                                    : "";

                                            inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label];
                                            //convertDateTimetoString(selectedRecord[componentrow.label], userInfo);
                                        }
                                        if (componentrow.timezone) {
                                            inputData["dynamicmaster"]["jsondata"][`tz${componentrow.label}`] = selectedMaster[masterIndex][`tz${componentrow.label}`] ?
                                                { value: selectedMaster[masterIndex][`tz${componentrow.label}`].value, label: selectedMaster[masterIndex][`tz${componentrow.label}`].label } :
                                                defaulttimezone ? defaulttimezone : -1

                                            inputData["dynamicmaster"]["jsonuidata"][`tz${componentrow.label}`] = inputData["dynamicmaster"]["jsondata"][`tz${componentrow.label}`]
                                        }
                                        dateList.push(componentrow.label)
                                    }

                                    else {
                                        inputData["dynamicmaster"]["jsondata"][componentrow.label] = selectedMaster[masterIndex][componentrow.label] ?
                                            selectedMaster[masterIndex][componentrow.label] : ""

                                        inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label]
                                        // inputData["dynamicmaster"]["jsondata"][componentrow.label]

                                    }
                                    return inputData["dynamicmaster"];
                                })
                            }
                            else {
                                if (component.inputtype === "combo") {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = selectedMaster[masterIndex][component.label] ?
                                        {
                                            value: selectedMaster[masterIndex][component.label].value,
                                            label: selectedMaster[masterIndex][component.label].label,
                                            pkey: component.valuemember,
                                            nquerybuildertablecode: component.nquerybuildertablecode,
                                            source: component.source,
                                            [component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]: this.props.Login.masterOperation[masterIndex] === 'update' ?
                                                selectedMaster[masterIndex][component.label].item ? selectedMaster[masterIndex][component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] : selectedMaster[masterIndex][component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                                :
                                                selectedMaster[masterIndex][component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                        } : -1

                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label].label;
                                    //selectedRecord[component.label] ? selectedRecord[component.label].label : ""
                                }
                                else if (component.inputtype === "date") {
                                    if (component.mandatory) {
                                        inputData["dynamicmaster"]["jsondata"][component.label] = formatDate(selectedMaster[masterIndex][component.label], false);
                                        // convertDateTimetoString(selectedRecord[component.label] ?
                                        // selectedRecord[component.label] : new Date(), userInfo);

                                        inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                        //convertDateTimetoString(selectedRecord[component.label], userInfo);

                                    } else {
                                        inputData["dynamicmaster"]["jsondata"][component.label] = component.loadcurrentdate ?
                                            //convertDateTimetoString(selectedRecord[component.label] ?                                      
                                            //    selectedRecord[component.label] : new Date(), userInfo) :
                                            formatDate(selectedMaster[masterIndex][component.label] || new Date(), false) :
                                            selectedMaster[masterIndex][component.label] ?
                                                // convertDateTimetoString(selectedRecord[component.label] ?
                                                //   selectedRecord[component.label] : new Date(), userInfo) : "";
                                                formatDate(selectedMaster[masterIndex][component.label], false) : "";
                                        inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                        //convertDateTimetoString(selectedRecord[component.label], userInfo)

                                    }
                                    if (component.timezone) {
                                        inputData["dynamicmaster"]["jsondata"][`tz${component.label}`] = selectedMaster[masterIndex][`tz${component.label}`] ?
                                            { value: selectedMaster[masterIndex][`tz${component.label}`].value, label: selectedMaster[masterIndex][`tz${component.label}`].label } :
                                            defaulttimezone ? defaulttimezone : -1

                                        inputData["dynamicmaster"]["jsonuidata"][`tz${component.label}`] = inputData["dynamicmaster"]["jsondata"][`tz${component.label}`]
                                    }
                                    dateList.push(component.label)
                                }
                                else {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = selectedMaster[masterIndex][component.label] ?
                                        selectedMaster[masterIndex][component.label] : ""

                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                }
                            }
                            return inputData["dynamicmaster"];
                        }
                        )
                        return inputData["dynamicmaster"];
                    })
                    return inputData["dynamicmaster"];
                })


            inputData["dynamicmaster"]["jsonstring"] = JSON.stringify(inputData["dynamicmaster"]["jsondata"]);
            inputData["dynamicmaster"]["jsonuistring"] = JSON.stringify(inputData["dynamicmaster"]["jsonuidata"]);
            inputData["masterdatelist"] = dateList;
            formData.append("Map", Lims_JSON_stringify(JSON.stringify({ ...inputData })));


        }
        else if (selectedControl[masterIndex].table.item.component === 'Type3Component'
            && selectedControl[masterIndex].table.item.nformcode === formCode.PATIENTMASTER) {
            inputData["noneedfilter"] = 1
            if (selectedControl[masterIndex].inputtype === 'backendsearchfilter' || selectedControl[masterIndex].inputtype === 'frontendsearchfilter') {
                inputData["noneedfilter"] = 2
            }
            this.props.Login.masterextractedColumnList[masterIndex].map(item => {
                let fieldName = item.dataField;
                if (fieldName === "semail") {
                    isEmailCheck = this.state.selectedMaster[masterIndex][fieldName] && this.state.selectedMaster[masterIndex][fieldName] !== "" && this.state.selectedMaster[masterIndex][fieldName] !== "null" ? validateEmail(this.state.selectedMaster[masterIndex][fieldName]) : true;
                }
                if (item.isJsonField === true) {
                    return inputData[methodUrl][item.jsonObjectName] = { ...inputData[methodUrl][item.jsonObjectName], [fieldName]: this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "" }
                }
                else {
                    if (item.controlType === "selectbox") {
                        // inputData[methodUrl][fieldName] = this.state.selectedMaster[fieldName] ? this.state.selectedMaster[fieldName].label ? this.state.selectedMaster[fieldName].label : "" : -1;
                        inputData[methodUrl][item.tableDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        return inputData;
                    }
                    else if (item.controlType === "datepicker") {
                        inputData[methodUrl][item.dateField] = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);
                    }
                    else if (item.controlType === "checkbox") {
                        inputData[methodUrl][item.controlName] = this.state.selectedMaster[masterIndex][item.controlName] ? this.state.selectedMaster[masterIndex][item.controlName] : transactionStatus.NO;
                    }
                    else {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    }
                    // inputData[methodUrl][selectedRecordPrimarykey] = this.props.Login.selectedId;
                    return inputData;
                }
            })
        }
        else if (selectedControl[masterIndex].table.item.component === 'Type3Component'
            && selectedControl[masterIndex].table.item.nformcode === 43) {
            //added by vignesh for ALPD-3010
            this.state.selectedRecord = { ...this.state.selectedRecord, "spatientid": this.state.selectedMaster[masterIndex]["spatientid"] };
            inputData["noneedfilter"] = 2; //will disl=play all db records
            if (selectedControl[masterIndex].inputtype === 'backendsearchfilter' || selectedControl[masterIndex].inputtype === 'frontendsearchfilter') {
                inputData["noneedfilter"] = 2; //will display will added record
            }

            this.props.Login.masterextractedColumnList[masterIndex].map(item => {
                let fieldName = item.dataField;
                if (fieldName === "semail") {
                    isEmailCheck = this.state.selectedMaster[masterIndex][fieldName] && this.state.selectedMaster[masterIndex][fieldName] !== "" && this.state.selectedMaster[masterIndex][fieldName] !== "null" ? validateEmail(this.state.selectedMaster[masterIndex][fieldName]) : true;
                }
                if (item.isJsonField === true) {
                    let fieldData = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    if (item.controlType === "datepicker") {
                        fieldData = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);

                    }
                    else if (item.controlType === "selectbox") {
                        fieldData = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        inputData[methodUrl][item.tableDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        fieldName = item.tableDataField;
                    }
                    inputData[methodUrl][item.jsonObjectName] = {
                        ...inputData[methodUrl][item.jsonObjectName],
                        [fieldName]: fieldData
                    }
                    return inputData[methodUrl];
                }
                else {
                    if (item.controlType === "selectbox") {
                        // inputData[methodUrl][fieldName] = this.state.selectedMaster[fieldName] ? this.state.selectedMaster[fieldName].label ? this.state.selectedMaster[fieldName].label : "" : -1;
                        inputData[methodUrl][item.tableDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;

                        if (fieldName === 'ssubmittername') {
                            inputData[methodUrl]['jsondata'] =
                            {
                                ...inputData[methodUrl]['jsondata'],
                                ssubmitterfirstname: this.state.selectedMaster[masterIndex][fieldName].item.sfirstname,
                                ssubmitterlastname: this.state.selectedMaster[masterIndex][fieldName].item.slastname,
                                ssubmitteremail: this.state.selectedMaster[masterIndex][fieldName].item.semail,
                                sshortname: this.state.selectedMaster[masterIndex][fieldName].item.sshortname,
                                ssubmittercode: this.state.selectedMaster[masterIndex][fieldName].item.ssubmittercode,
                                ssubmitterid: this.state.selectedMaster[masterIndex][fieldName].item.ssubmitterid,
                                stelephone: this.state.selectedMaster[masterIndex][fieldName].item.stelephone,
                            }
                        }


                        if (fieldName === 'sinstitutionsitename') {
                            inputData[methodUrl]['jsondata'] =
                            {
                                ...inputData[methodUrl]['jsondata'],
                                sinstitutionsitename: this.state.selectedMaster[masterIndex][fieldName].item.sinstitutionsitename,
                            }
                        }


                        if (fieldName === 'sinstitutionname') {
                            inputData[methodUrl]['jsondata'] =
                            {
                                ...inputData[methodUrl]['jsondata'],
                                sinstitutionname: this.state.selectedMaster[masterIndex][fieldName].item.sinstitutionname,
                                sinstitutioncode: this.state.selectedMaster[masterIndex][fieldName].item.sinstitutioncode,

                            }
                        }


                        if (fieldName === 'sinstitutioncatname') {
                            inputData[methodUrl]['jsondata'] =
                            {
                                ...inputData[methodUrl]['jsondata'],
                                sinstitutioncatname: this.state.selectedMaster[masterIndex][fieldName].item.sinstitutioncatname,

                            }
                        }

                        if (fieldName === 'sdistrictname') {
                            inputData[methodUrl]['jsondata'] =
                            {
                                ...inputData[methodUrl]['jsondata'],
                                sinstitutiondistrictname: this.state.selectedMaster[masterIndex][fieldName].label,

                            }
                        }


                        return inputData;
                    }
                    else if (item.controlType === "datepicker") {
                        inputData[methodUrl][item.dateField] = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);
                    }
                    else if (item.controlType === "checkbox") {
                        inputData[methodUrl][item.controlName] = this.state.selectedMaster[masterIndex][item.controlName] ? this.state.selectedMaster[masterIndex][item.controlName] : transactionStatus.NO;
                    }
                    else {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    }
                    // inputData[methodUrl][selectedRecordPrimarykey] = this.props.Login.selectedId;
                    return inputData;
                }
            })
            inputData[methodUrl]["nproductcode"] = -1;
            //inputData[methodUrl]["ndiagnosticcasecode"] = -1;
            //inputData[methodUrl]["sexternalorderid"] = 1;
            inputData[methodUrl]["nordertypecode"] = 1;
        }
        else {

            this.props.Login.masterextractedColumnList[masterIndex].map(item => {
                let fieldName = item.dataField;
                if (item.isJsonField === true) {
                    return inputData[methodUrl][item.jsonObjectName] = { ...inputData[methodUrl][item.jsonObjectName], [fieldName]: this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "" }
                }
                else {
                    if (item.controlType === "selectbox") {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].label ? this.state.selectedMaster[masterIndex][fieldName].label : "" : -1;
                        inputData[methodUrl][item.foreignDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        return inputData;
                    }
                    else if (item.controlType === "datepicker") {
                        inputData[methodUrl][item.dateField] = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);
                    }
                    else if (item.controlType === "checkbox") {
                        inputData[methodUrl][item.controlName] = this.state.selectedMaster[masterIndex][item.controlName] ? this.state.selectedMaster[masterIndex][item.controlName] : transactionStatus.NO;
                    }
                    else {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    }
                    // inputData[methodUrl][selectedRecordPrimarykey] = this.props.Login.selectedId;
                    return inputData;
                }
            })
        }
        // }
        const inputParam = {
            withoutCombocomponent: this.props.Login.loadSubSample ? this.state.SubSamplewithoutCombocomponent
                : this.props.Login.withoutCombocomponent,
            comboComponents: this.props.Login.loadSubSample ? this.state.SubSamplecomboComponents
                : this.props.Login.comboComponents,
            selectedRecord: this.props.Login.loadSubSample ?
                this.state.selectComponent
                : this.state.selectedRecord,
            selectedRecordName: this.props.Login.loadSubSample ?
                'selectComponent'
                : 'selectedRecord',
            loadSubSample: this.props.Login.loadSubSample,
            selectedControl: this.props.Login.selectedControl,
            comboData: this.props.Login.loadSubSample ?
                this.props.Login.SubSamplecomboData : this.props.Login.comboData,
            comboName: this.props.Login.loadSubSample ?
                'SubSamplecomboData' : 'comboData',
            classUrl: selectedControl[masterIndex].table.item.classUrl,
            methodUrl: selectedControl[masterIndex].table.item.methodUrl,
            // displayName: this.props.Login.selectedControl.table.item.sdisplayname,
            inputData: inputData,
            operation: this.props.Login.masterOperation[masterIndex],
            saveType, formRef,
            screenName: this.props.Login.loadSubSample ? "IDS_TIMEPOINT" :
                this.props.screenName,
            masterIndex,
            selectedMaster: this.state.selectedMaster,
            mastercomboComponents: this.props.Login.mastercomboComponents,
            masterwithoutCombocomponent: this.props.Login.masterwithoutCombocomponent,
            masterComboColumnFiled: this.props.Login.masterComboColumnFiled,
            masterextractedColumnList: this.props.Login.masterextractedColumnList,
            masterdataList: this.props.Login.masterdataList,
            masterDesign: this.props.Login.masterDesign,
            masterfieldList: this.props.Login.masterfieldList,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            nportalrequired: this.props.Login.masterData.RealSampleTypeValue.nportalrequired,
            nneedsubsample: this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample === true ? transactionStatus.YES : transactionStatus.NO,
            masterEditObject: this.props.Login.masterEditObject,
            masterOperation: this.props.Login.masterOperation,
            formData: formData,
            isFileupload

        }
        if (isEmailCheck) {
            this.props.addMasterRecord(inputParam, this.props.Login.masterData)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }));
        }

    }

    onClickView = (selectedControl) => {
        const selectedRecord = this.state.selectedRecord;
        if (selectedRecord[selectedControl.label] !== undefined && selectedRecord[selectedControl.label] !== '') {
            this.props.viewExternalportalDetail(selectedControl, selectedRecord[selectedControl.label], this.props.Login.userInfo)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECT" }) + " " + this.props.intl.formatMessage({ id: "IDS_" + selectedControl.label.toUpperCase() }));
        }

    }

    addMasterRecord = (control) => {
        let masterIndex = this.props.Login.masterIndex
        if (masterIndex !== undefined) {
            masterIndex = masterIndex + 1;
        } else {
            masterIndex = 0
        }
        let selectedControl = this.props.Login.selectedControl || []
        let selectedMaster = this.state.selectedMaster || []
        selectedMaster[masterIndex] = {}
        selectedControl[masterIndex] = control

        let fieldList = this.props.Login.masterfieldList || []
        fieldList[masterIndex] = []

        let masterComboColumnFiled = this.props.Login.masterComboColumnFiled || []
        masterComboColumnFiled[masterIndex] = []

        let extractedColumnList = this.props.Login.masterextractedColumnList || []
        extractedColumnList[masterIndex] = []

        let masterdataList = this.props.Login.masterdataList || []
        let masterDesign = this.props.Login.masterDesign || []
        let masterwithoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
        let mastercomboComponents = this.props.Login.mastercomboComponents || []
        let masterOperation = this.props.Login.masterOperation || []

        masterdataList[masterIndex] = []
        masterDesign[masterIndex] = []
        masterwithoutCombocomponent[masterIndex] = []
        mastercomboComponents[masterIndex] = []
        masterOperation[masterIndex] = 'create'

        if (control.table.item.component === 'Type2Component' || control.table.item.component === 'Type1Component') {
            if (control.table.item.component === 'Type2Component') {
                fieldList[masterIndex] = getFieldSpecification().get(control.table.item.methodUrl) || [];
            } else {
                fieldList[masterIndex] = getFieldSpecification1().get(control.table.item.methodUrl) || [];
            }


            extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));

            const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    selectedControl,
                    addMaster: true,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    masterOperation,
                    selectedMaster,
                    screenName: selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode],
                }
            }
            this.props.updateStore(updateInfo)
        }
        else if (control.table.item.component === 'Type3Component') {
            fieldList[masterIndex] = getFieldSpecification3().get(control.table.item.methodUrl) || [];
            extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));
            masterComboColumnFiled[masterIndex] = extractedColumnList[masterIndex].filter(item =>
                item.ndesigncomponentcode === designComponents.COMBOBOX)
            const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";
            const inputParam = {
                userinfo: this.props.Login.userInfo,
                selectedControl,
                masterfieldList: fieldList,
                masterextractedColumnList: extractedColumnList,
                masterprimaryKeyField: primaryKeyField,
                masterComboColumnFiled: masterComboColumnFiled,
                masterIndex,
                masterdataList,
                masterDesign,
                masterwithoutCombocomponent,
                mastercomboComponents,
                masterOperation,
                selectedMaster,
                screenName: selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode],

            }

            this.props.getAddMasterCombo(inputParam);

        }
        else if (control.table.item.component === 'Dynamic') {
            const inputParam = {
                userinfo: this.props.Login.userInfo,
                selectedControl,
                masterIndex,
                masterdataList,
                masterDesign,
                masterComboColumnFiled,
                masterwithoutCombocomponent,
                mastercomboComponents,
                masterfieldList: fieldList,
                masterextractedColumnList: extractedColumnList,
                masterComboColumnFiled,
                masterOperation,
                selectedMaster,

            }
            this.props.getDynamicMasterTempalte(inputParam);
        }

        // this.props.getMasterRecord(control);
    }

    editMasterRecord = (control, editObject) => {
        if (editObject) {
            let masterIndex = this.props.Login.masterIndex
            if (masterIndex !== undefined) {
                masterIndex = masterIndex + 1;
            } else {
                masterIndex = 0
            }
            let selectedControl = this.props.Login.selectedControl || []
            let selectedMaster = this.state.selectedMaster || []
            selectedMaster[masterIndex] = {}
            selectedControl[masterIndex] = control

            let fieldList = this.props.Login.masterfieldList || []
            fieldList[masterIndex] = []

            let masterComboColumnFiled = this.props.Login.masterComboColumnFiled || []
            masterComboColumnFiled[masterIndex] = []

            let extractedColumnList = this.props.Login.masterextractedColumnList || []
            extractedColumnList[masterIndex] = []

            let masterdataList = this.props.Login.masterdataList || []
            let masterDesign = this.props.Login.masterDesign || []
            let masterwithoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
            let mastercomboComponents = this.props.Login.mastercomboComponents || []
            let masterOperation = this.props.Login.masterOperation || []
            let masterEditObject = this.props.Login.masterEditObject || []

            masterdataList[masterIndex] = []
            masterDesign[masterIndex] = []
            masterwithoutCombocomponent[masterIndex] = []
            mastercomboComponents[masterIndex] = []
            masterOperation[masterIndex] = 'update'
            masterEditObject[masterIndex] = editObject

            if (control.table.item.component === 'Type2Component' || control.table.item.component === 'Type1Component') {
                if (control.table.item.component === 'Type2Component') {
                    fieldList[masterIndex] = getFieldSpecification().get(control.table.item.methodUrl) || [];
                } else {
                    fieldList[masterIndex] = getFieldSpecification1().get(control.table.item.methodUrl) || [];
                }
                extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));

                const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";

                const updateInfo = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    addMaster: true,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    selectedMaster,
                    masterEditObject,
                    masterOperation
                    // editObject
                    //   screenName:selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]

                }
                this.props.getEditMaster(updateInfo)
            }
            else if (control.table.item.component === 'Type3Component') {
                fieldList[masterIndex] = getFieldSpecification3().get(control.table.item.methodUrl) || [];
                extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));
                masterComboColumnFiled[masterIndex] = extractedColumnList[masterIndex].filter(item =>
                    item.ndesigncomponentcode === designComponents.COMBOBOX)
                const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";
                const inputParam = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    masterEditObject,
                    masterOperation,
                    selectedMaster,
                    screenName: selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode],
                    // editObject
                }

                this.props.getEditMaster(inputParam);

            }
            else if (control.table.item.component === 'Dynamic') {
                const inputParam = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterComboColumnFiled,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterComboColumnFiled,
                    masterEditObject,
                    masterOperation,
                    selectedMaster,
                    //  editObject
                }
                this.props.getEditMaster(inputParam);
            }

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTHERECORD" }))
        }

    }

    onComboChangeMasterDyanmic = (comboData, control, customName) => {

        let comboName = customName || control.label;
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}
        //if (comboData) {
        comboData["item"] = {
            ...comboData["item"], "pkey": control.valuemember, "nquerybuildertablecode": control.nquerybuildertablecode,
            "source": control.source
        };
        selectedMaster[masterIndex][comboName] = comboData;

        // console.log("selected:", selectedMaster, comboData, control, customName);
        if (control.child && control.child.length > 0) {
            const childComboList = getSameRecordFromTwoArrays(this.props.Login.mastercomboComponents[masterIndex], control.child, "label")
            let childColumnList = {};
            childComboList.map(columnList => {
                const val = this.comboChild(this.props.Login.mastercomboComponents[masterIndex], columnList, childColumnList, false);
                childColumnList = val.childColumnList
            })

            const parentList = getSameRecordFromTwoArrays(this.props.Login.masterwithoutCombocomponent[masterIndex], control.child, "label")

            if (comboData) {
                const inputParem = {
                    child: control.child,
                    source: control.source,
                    primarykeyField: control.valuemember,
                    value: comboData.value,
                    item: comboData.item
                }
                this.props.getChildValuesForAddMaster(inputParem,
                    this.props.Login.userInfo, selectedMaster, this.props.Login.masterdataList,
                    childComboList, childColumnList,
                    this.props.Login.masterwithoutCombocomponent,
                    [...childComboList, ...parentList], masterIndex)
            } else {
                let comboData = this.props.Login.masterdataList
                const withoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
                const inputParam = { control, comboComponents: this.props.Login.mastercomboComponents[masterIndex], withoutCombocomponent: withoutCombocomponent[masterIndex], selectedMaster: selectedMaster[masterIndex], comboData: comboData[masterIndex] }
                const childParam = childComboClear(inputParam)
                selectedMaster[masterIndex] = childParam.selectedRecord
                comboData[masterIndex] = childParam.comboData
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedMaster, mastedataList: comboData }
                }
                this.props.updateStore(updateInfo);
            }
        } else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedMaster }
            }
            this.props.updateStore(updateInfo);
        }
    }


    onInputOnChangeMasterDynamic = (event, control, radiotext) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        if (event.target.type === 'toggle') {
            selectedMaster[masterIndex][event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        } else if (event.target.type === 'numeric') {
            if (/\D/.test(event.target.value))
                selectedMaster[masterIndex][event.target.name] = event.target.value;
        } else if (event.target.type === 'checkbox') {
            const value = selectedMaster[masterIndex][event.target.name];
            if (value !== '' && value !== undefined) {
                if (value.includes(radiotext)) {
                    const index = value.indexOf(radiotext);
                    if (index !== -1) {
                        if (index === 0) {
                            const indexcomma = value.indexOf(",")
                            if (indexcomma !== -1) {
                                selectedMaster[masterIndex][event.target.name] = value.slice(indexcomma + 1)
                            } else {
                                selectedMaster[masterIndex][event.target.name] = ""
                            }
                        } else {
                            if (value.slice(index).indexOf(",") !== -1) {
                                selectedMaster[masterIndex][event.target.name] = value.slice(0, index) + value.slice(index + value.slice(index).indexOf(",") + 1)
                            } else {
                                selectedMaster[masterIndex][event.target.name] = value.slice(0, index - 1)
                            }
                        }
                    }

                } else {
                    selectedMaster[masterIndex][event.target.name] = value + ',' + radiotext;
                }

            } else {
                selectedMaster[masterIndex][event.target.name] = radiotext;
            }
        } else if (event.target.type === 'radio') {
            selectedMaster[masterIndex][event.target.name] = radiotext
        } else {
            selectedMaster[masterIndex][event.target.name] = conditionBasedInput(control, event.target.value, radiotext, event.target.defaultValue)
            // selectedMaster[masterIndex][event.target.name] = event.target.value;
        }
        this.setState({ selectedMaster });
    }


    handleDateChangeMasterDynamic = (dateValue, dateName) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][dateName] = dateValue;

        this.setState({ selectedMaster });
    }

    onNumericInputChangeMasterDynamic = (value, name) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][name] = value;
        this.setState({ selectedMaster });
    }

    onNumericBlurMasterDynamic = (value, control) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        if (selectedMaster[masterIndex][control.label]) {
            if (control.max) {
                if (!(selectedMaster[masterIndex][control.label] < parseFloat(control.max))) {
                    selectedMaster[masterIndex][control.label] = control.precision ? parseFloat(control.max) : parseInt(control.max)
                }
            }
            if (control.min) {
                if (!(selectedMaster[masterIndex][control.label] > parseFloat(control.min))) {
                    selectedMaster[masterIndex][control.label] = control.precision ? parseFloat(control.min) : parseInt(control.min)
                }
            }


        }
        this.setState({ selectedMaster });
    }

    onDropFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }

    onDropFileSubSample = (attachedFiles, fieldName, maxSize) => {
        let selectComponent = this.state.selectComponent || {};
        selectComponent[fieldName] = onDropAttachFileList(selectComponent[fieldName], attachedFiles, maxSize)
        this.setState({ selectComponent, actionType: "new" });
    }

    deleteAttachmentSubSample = (event, file, fieldName) => {
        let selectComponent = this.state.selectComponent || {};
        selectComponent[fieldName] = deleteAttachmentDropZone(selectComponent[fieldName], file)

        this.setState({
            selectComponent, actionType: "delete" //fileToDelete:file.name 
        });
    }
}

export default connect(mapStateToProps, {
    getChildValues,
    getPreviewTemplate, getNewRegSpecification,
    AddComponents, updateStore, EditComponent, getTest,
    addsubSample, editSubSample, insertRegistration,
    updateRegistration, addSubSampleSaveContinue, callService,
    componentTest, getDynamicFilter, getDynamicFilterExecuteData,
    insertRegistrationScheduler, testPackageTest, addMasterRecord,
    getAddMasterCombo, getDynamicMasterTempalte,
    getChildComboMaster, getChildValuesForAddMaster, viewExternalportalDetail, getEditMaster,
    insertMultipleRegistration, insertExportStbStudyPlan, testSectionTest, insertSchedulerConfig, updateSchedulerConfig,
    getSchedulerMasteDetails, addStbTimePoint, insertStbStudyPlan
}
)(injectIntl(StbPreRegSlideOutModal));