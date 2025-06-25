import React from 'react';
import { ListWrapper } from '../components/client-group.styles';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { intl } from '../components/App';

import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
    callService, crudMaster, updateStore, validateEsignCredential, getSubSampleBySample, getReleaseSelectedSamples, filterColumnData,
    getReleaseSelectedSampleSubSampleTest, getReleaseSelectedSubSamples, getTestBySample, getReleaseSelectedTest, xmlExportAction,
    getReleaseRegistrationType, getReleaseRegistrationSubType,
    getReleaseFilterStatus, getReleaseApprovalVersion, getReleaseFilterBasedTest, getReleaseSample,getCOAReportType,generateReport
} from '../actions';


import Esign from '../pages/audittrail/Esign';
import { DEFAULT_RETURN } from '../actions/LoginTypes';

import { showEsign, getControlMap, convertDateValuetoString, rearrangeDateFormat, constructOptionList, searchData, searchJsonData } from '../components/CommonScript';
import { designProperties, transactionStatus } from '../components/Enumeration';
import DataGridWithMultipleGrid from '../components/data-grid/DataGridWithMultipleGrid';
import BreadcrumbComponentToolbar from '../components/ToolbarBreadcrumb.Component';

import {

    getSelectedState
} from "@progress/kendo-react-grid";
import COAReleaseFilter from './coarelease/COAReleaseFilter';
import TrainingUpdateChildTab from './competencemanagement/trainingupdate/TrainingUpdateChildTab';
import { Affix } from 'rsuite';
import ModalShow from '../components/ModalShow';
import AddRelease from './coarelease/AddRelease';
const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class COARelease extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            childDataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
            SampletypeList: [],
            RegistrationTypeList: [],
            RegistrationSubTypeList: [],
            FilterStatusList: [],
            sampleSearchField: [],
            subsampleSearchField: [],
            testSearchField: [],
            searchedData: [],
            count: 0,
            SampleGridItem: [],
            combinedSearchField:[],
            npreregno:[],
            ntransactiontestcode:[],
            ntransactionsamplecode:[]

        };
        this.searchRef = React.createRef();

        this.extractedColumnList = [
            { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" },
            {
                "idsName": "IDS_PRODUCT", "dataField": "Specimen Type", "width": "200px"
            },
            { "idsName": "IDS_PRODUCTCATEGORY", "dataField": "Specimen Category", "width": "200px" },
            { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "200px" }
        ];

        this.sampleColumnList = [{ "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "150px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_SAMPLENAME", "dataField": "Sample Name", "width": "100px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "100px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        ];

        this.testColumnList = [
            { "idsName": "IDS_TESTNAME", "dataField": "stestname", "width": "100px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "100px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        ];
    }

 
    handleExpandChange = (row, dataState) => {
        const viewParam = {
            nsitecode: -1,
            userInfo: this.props.Login.userInfo, primaryKeyField: "npreregno",
            masterData: this.props.Login.masterData
        };

        this.props.getSubSampleBySample({
            ...viewParam, dataState,
            primaryKeyValue: row["dataItem"][viewParam.primaryKeyField], viewRow: row["dataItem"]
        });

    }
    handleExpandChange = (row, dataState) => {
        const viewParam = {
            nsitecode: -1,
            userInfo: this.props.Login.userInfo, primaryKeyField: "npreregno",
            masterData: this.props.Login.masterData
        };

        this.props.getSubSampleBySample({
            ...viewParam, dataState,
            primaryKeyValue: row["dataItem"][viewParam.primaryKeyField], viewRow: row["dataItem"]
        });

    }
    childHandleExpandChange = (row, dataState) => {
        const viewParam = {
            nsitecode: -1,
            userInfo: this.props.Login.userInfo, primaryKeyField: "npreregno",
            masterData: this.props.Login.masterData
        };

        this.props.getTestBySample({
            ...viewParam, dataState,
            primaryKeyValue: row["dataItem"][viewParam.primaryKeyField], viewRow: row["dataItem"]
        });

    }
    expandNextData(y) {
        let change = []
        let x = process(this.props.Login.masterData.searchedData1 && this.props.Login.masterData.searchedData1 || this.props.Login.masterData.ReleaseSample && this.props.Login.masterData.ReleaseSample || [], y);

        let data = x.data.every(item => {
            return item.expanded === true
        })
        if (data === true) {
            change = true
        } else {
            change = false
        }
        this.expandFunc({ change: change })

    }
    dataStateChange = (event) => {


        this.setState({ dataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
        this.expandNextData(event.dataState);
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }
    handleDateChange = (dateName, dateValue) => {
        if (dateValue === null) {
            dateValue = new Date();
        }
        let dfrom = this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()
        let dto = this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()
        let obj = {}
        if (dateName === 'fromDate') {
            obj = convertDateValuetoString(dateValue, dto, this.props.Login.userInfo)
            dfrom = obj.fromDate
            dto = obj.toDate
        } else {
            obj = convertDateValuetoString(dfrom, dateValue, this.props.Login.userInfo)
            dfrom = obj.fromDate
            dto = obj.toDate

        }
        let inputParam = {
            inputData: {
                nflag: 2,
                nregtypecode: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                dfrom: String(dfrom),
                dto: String(dto),
                userinfo: this.props.Login.userInfo
            },
            masterData: this.props.Login.masterData

        }
        this.props.getReleaseApprovalVersion(inputParam)
    }

    onFilterComboChange = (comboData, fieldName) => {

        if (comboData) {
            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            let inputParamData = {};
            if (fieldName === 'nsampletypecode') {
                if (comboData.value !== this.props.Login.masterData.SampleTypeValue.nsampletypecode) {
                    inputParamData = {
                        nflag: 2,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        SampleTypeValue: comboData.item
                    };
                    this.props.getReleaseRegistrationType(inputParamData)
                }
            } else if (fieldName === 'nregtypecode') {
                if (comboData.value !== this.props.Login.masterData.RegTypeValue.nregtypecode) {
                    inputParamData = {
                        nflag: 3,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        RegTypeValue: comboData.item
                    }
                    this.props.getReleaseRegistrationSubType(inputParamData)
                }
            } else if (fieldName === 'nregsubtypecode') {

                if (comboData.value !== this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) {
                    let inputData = {
                        nflag: 4,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                        nregsubtypecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        nsectioncode: this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.UserSectionValue.nsectioncode,
                    }
                    inputParamData = {
                        inputData,
                        masterData: {
                            ...this.props.Login.masterData,
                            RegSubTypeValue: comboData.item
                        }
                    }
                    this.props.getReleaseApprovalVersion(inputParamData)
                }
            }
            else if (fieldName === 'ndesigntemplatemappingcode') {
                const inputParamData = {
                    dfrom: obj.fromDate,
                    dto: obj.toDate,
                    nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                    napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                    userinfo: this.props.Login.userInfo,
                    masterData: { ...this.props.Login.masterData },
                    RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
                    ntransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                    stransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                    nsectioncode: this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.UserSectionValue.nsectioncode,
                    ndesigntemplatemappingcode: comboData.value,
                    DesignTemplateMappingValue: comboData.item
                }
                this.props.getReleaseFilterBasedTest(inputParamData)
            }
            else if (fieldName === 'napproveconfversioncode') {
                if (comboData.value !== this.props.Login.masterData.ApprovalVersionValue.napproveconfversioncode) {
                    inputParamData = {
                        nflag: 4,
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, ApprovalVersionValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
                        nsectioncode: this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") : this.props.Login.masterData.UserSectionValue.nsectioncode,
                        ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1
                    }
                    this.props.getReleaseFilterStatus(inputParamData)
                }
            }
            else if (fieldName === 'nsectioncode') {
                if (comboData.value !== this.props.Login.masterData.UserSectionValue.nsectioncode) {
                    // let masterData = { ...this.props.Login.masterData, UserSectionValue: comboData.item }
                    inputParamData = {
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, UserSectionValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
                        ntransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                        nsectioncode: comboData.value === -1 ? null
                            // this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") 
                            : comboData.value,
                        stransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
                        ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1,
                        DesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
                    }

                    this.props.getReleaseFilterBasedTest(inputParamData);
                }
            } else if (fieldName === 'njobstatuscode') {
                if (comboData.value !== this.props.Login.masterData.JobStatusValue.njobstatuscode) {
                    let masterData = { ...this.props.Login.masterData, JobStatusValue: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
            else if (fieldName === 'ntestcode') {
                if (comboData.value !== this.props.Login.masterData.TestValue.ntestcode) {
                    let masterData = { ...this.props.Login.masterData, TestValue: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
            else {
                if (comboData.value !== this.props.Login.masterData.FilterStatusValue.ntransactionstatus) {
                    //  let masterData = { ...this.props.Login.masterData, FilterStatusValue: comboData.item }
                    //  const updateInfo = {
                    //     typeName: DEFAULT_RETURN,
                    //    data: { masterData }
                    // }

                    inputParamData = {
                        dfrom: obj.fromDate,
                        dto: obj.toDate,
                        nsampletypecode: this.props.Login.masterData.SampleTypeValue.nsampletypecode,
                        nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
                        nregsubtypecode: this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
                        napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                        userinfo: this.props.Login.userInfo,
                        masterData: { ...this.props.Login.masterData, FilterStatusValue: comboData.item },
                        RegSubTypeValue: this.props.Login.masterData.RegSubTypeValue,
                        ntransactionstatus: comboData.value,
                        stransactionstatus: comboData.value === 0 ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : comboData.value,
                        nsectioncode: null//this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? 
                        //this.props.Login.masterData.UserSection.map(item => item.nsectioncode).join(",") 
                        //: this.props.Login.masterData.UserSectionValue.nsectioncode,
                        ,ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode ? this.props.Login.masterData.ndesigntemplatemappingcode : -1
                        ,DesignTemplateMappingValue: this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue  

                    }

                    this.props.getReleaseFilterBasedTest(inputParamData);
                }
            }
        }
    }
    onFilterSubmit = () => {
        this.searchRef.current.value = "";
        delete this.props.Login.masterData["searchedData1"]
        delete this.props.Login.masterData["searchedData2"]

        delete this.props.Login.masterData["searchedData3"]
        this.props.Login.change = false

        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
        let realFromDate = obj.fromDate;
        let realToDate = obj.toDate
        let realSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue
        let realRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue
        let realRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue
        let realFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue
        let realApprovalVersionValue = this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue
        let realUserSectionValue = this.props.Login.masterData.UserSectionValue && this.props.Login.masterData.UserSectionValue
        let realTestValue = this.props.Login.masterData.TestValue && this.props.Login.masterData.TestValue
        let realDesignTemplateMappingValue = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue
        let masterData = { ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue, realDesignTemplateMappingValue }
        let inputData = {
            npreregno: "0",
            nsampletypecode: (this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode) || -1,
            nregtypecode: parseInt(this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
            nregsubtypecode: parseInt(this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus: ((this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1",
            napprovalconfigcode: this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue && this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode) : null,
            nsectioncode: this.props.Login.masterData.UserSectionValue ? this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.UserSectionValue.nsectioncode) : null,
            ntestcode: this.props.Login.masterData.TestValue ? this.props.Login.masterData.TestValue.ntestcode : -1,
            nneedsubsample: (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample) || false,
            nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
            userinfo: this.props.Login.userInfo,

            ntype: 2,
            ndesigntemplatemappingcode: (this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode
                ?this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode:this.props.Login.masterData.DesignTemplateMappingValue) || -1
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
            && realFilterStatusValue.sfilterstatus !== null && inputData.ntestcode !== undefined) {

            inputData['dfrom'] = obj.fromDate;
            inputData['dto'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
                searchSampleRef: this.searchSampleRef,
                searchSubSampleRef: this.searchSubSampleRef,
                searchTestRef: this.searchTestRef,
                skip: this.state.skip,
                take: this.state.take,
                testskip: this.state.testskip,
                testtake: this.state.testtake,

            }
            this.props.getReleaseSample(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }

    }
    searchedGridData = (filterValue, filterParam) => {

        let masterData1 = filterParam.masterData;

        let primaryKeyValue = 0;
        let searchedData = undefined;
        if (filterValue === "") {
            if (masterData1[filterParam.inputListName] && masterData1[filterParam.inputListName].length > 0) {

                primaryKeyValue = masterData1[filterParam.inputListName][0][filterParam.primaryKeyField];
                // }
            }
        }
        else {
            if (filterParam.isjsondata) {
                searchedData = searchJsonData(filterValue, masterData1[filterParam.inputListName], filterParam.searchFieldList || []);
            }
            else {
                searchedData = this.searchNestedGridData(filterValue, masterData1[filterParam.inputListName], filterParam.searchFieldList || [], masterData1);

            }
            masterData1["searchedData3"] = searchedData.test;
            masterData1["searchedData1"] = searchedData.sample;
            masterData1["searchedData2"] = searchedData.subsample;

            //    masterData1["searchedData"]["selected"]=false
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: { ...masterData1 }
            }
        }
        this.props.updateStore(updateInfo);
    }
    searchNestedGridData=(filterValue, originalData, fieldList, masterData) =>{
        let searchedData = [];
        let ntransactionsamplecode = [];
        let subdata = [];
        let detail = []
        let npreregno = []
      
        Object.entries(originalData).map(item1 => {
          item1[1].map(item => {
            detail.push(item)
          })
        })
      
        let temp =
          detail.filter(item => {
            const itemArray = [];
      
            fieldList.map(itemKey =>
              item[itemKey] && item[itemKey] !== null ?
                itemArray.push(typeof item[itemKey] === "string" ? item[itemKey].toLowerCase()
                  : item[itemKey].toString().toLowerCase())
                : "")
            return itemArray
              .findIndex(element => element
                .includes(filterValue.toLowerCase())) > -1
      
          })
      
        temp.map(item1 => {
          if (!npreregno.includes(item1.npreregno))
            npreregno.push(item1.npreregno)
          if (!ntransactionsamplecode.includes(item1.ntransactionsamplecode))
            ntransactionsamplecode.push(item1.ntransactionsamplecode)
        })
        let test = groupBy(temp, 'ntransactionsamplecode');
        let sample = masterData.ReleaseSample.filter(item => {
      
          for (var i = 0; i < npreregno.length; i++) {
            if (npreregno[i] === item.npreregno && npreregno[i] !== undefined) {
              return item
            }
          }
      
        })
      
        Object.entries(masterData.ReleaseSubSample).map(item1 => {
          item1[1].map(item => {
            subdata.push(item)
          })
        })
        let subsample1 = subdata.filter(item => {
      
          for (var i = 0; i < ntransactionsamplecode.length; i++) {
            if (ntransactionsamplecode[i] === item.ntransactionsamplecode && ntransactionsamplecode[i] !== undefined) {
              return item
            }
          }
      
        })
        let subsample = groupBy(subsample1, "npreregno");
        function groupBy(objectArray, property) {
          return objectArray.reduce((acc, obj) => {
            const key = obj[property];
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
          }, {});
        }
        searchedData = { test, sample, subsample }
        return searchedData;
      }
      //end- search logic
    checkFunction = (data) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                arrayfalse: data.arrayfalse,
                childfalsearray: data.childfalsearray
            }
        }
        this.props.updateStore(updateInfo);
    }
    checkFunction1 = () => {
        this.setState({
            count: 1
        })
    }
    expandFunc = (change) => {
        let count = change.count;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: { ...this.props.Login.masterData },
                change: change.change,
                checkFlag: "1",
                count: count
            }
        }
        this.props.updateStore(updateInfo);
    }
    gridfillingColumn(data) {
        //  const tempArray = [];
        const temparray = data && data.map((option) => {
            return { "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode], "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3" };
        });
        return temparray;
    }
    render() {
        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)




        const filterTestParam = {
            inputListName: "ReleaseTest",
            //  selectedObject: "APSelectedTest",
            primaryKeyField: "ntransactiontestcode",
            //    fetchUrl: this.getActiveTestURL(),
            // fecthInputObject: {
            //     ntransactiontestcode: this.props.Login.masterData.APSelectedTest ? this.props.Login.masterData.APSelectedTest.map(test => test.ntransactiontestcode).join(",") : "-1",
            //     userinfo: this.props.Login.userInfo,
            //     checkBoxOperation: 3,
            //     ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode || -1
            // },
            isSingleSelect: false,
            masterData: this.props.Login.masterData,
            searchFieldList: this.state.combinedSearchField || [],

        };

        let breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom
            }, {
                "label": "IDS_TO",
                "value": obj.breadCrumbto
            },
            // {
            //     "label": "IDS_SAMPLETYPE",
            //     "value": this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.ssampletypename ? this.props.Login.masterData.realSampleTypeValue.ssampletypename : "Product"
            // },
             {
                "label": "IDS_REGTYPE",
                "value": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.sregtypename || "NA" :
                    this.props.Login.masterData.RegTypeValue ? this.props.Login.masterData.RegTypeValue.sregtypename || "NA" : "NA"
            }, {
                "label": "IDS_REGSUBTYPE",
                "value": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.sregsubtypename || "NA" :
                    this.props.Login.masterData.RegSubTypeValue ?
                        this.props.Login.masterData.RegSubTypeValue.sregsubtypename : "NA"
            },
            // {
            //     "label": "IDS_DESIGNTEMPLATE",
            //     "value": this.props.Login.masterData.realDesignTemplateMappingValue ?
            //         this.props.Login.masterData.realDesignTemplateMappingValue.sregtemplatename || "NA" :
            //         this.props.Login.masterData.realDesignTemplateMappingValue ? this.props.Login.masterData.realDesignTemplateMappingValue.sregtemplatename || "NA" : "NA"
            // },
            // {
            //     "label": "IDS_CONFIGVERSION",
            //     "value": this.props.Login.masterData.realApprovalVersionValue ?
            //         this.props.Login.masterData.realApprovalVersionValue.sversionname || "NA" :
            //         this.props.Login.masterData.ApprovalVersionValue ? this.props.Login.masterData.ApprovalVersionValue.sversionname || "NA" : "NA"
            // },
            // {
            //     "label": "IDS_SECTION",
            //     "value": this.props.Login.masterData.realUserSectionValue ?
            //         this.props.Login.masterData.realUserSectionValue.ssectionname || "NA" :
            //         this.props.Login.masterData.UserSectionValue ?
            //             this.props.Login.masterData.UserSectionValue.ssectionname || "NA" : "NA"
            // },
            // {
            //     "label": "IDS_Test",
            //     "value": this.props.Login.masterData.realTestValue ?
            //         this.props.Login.masterData.realTestValue.stestsynonym || "NA" :
            //         this.props.Login.masterData.TestValue ?
            //             this.props.Login.masterData.TestValue.stestsynonym || "NA" : "NA"
            // },
            {
                "label": "IDS_TESTSTATUS",
                "value": this.props.Login.masterData.realFilterStatusValue ?
                    this.props.Login.masterData.realFilterStatusValue.sfilterstatus || "NA" :
                    this.props.Login.masterData.FilterStatusValue ?
                        this.props.Login.masterData.FilterStatusValue.sfilterstatus || "NA" : "NA"
            }
        ];
        const releaseId = this.props.Login.inputParam && this.state.controlMap.has("COARelease")
            && this.state.controlMap.get('COARelease').ncontrolcode;
        const expandId = this.props.Login.inputParam && this.state.controlMap.has("ReleaseExpand")
            && this.state.controlMap.get('ReleaseExpand').ncontrolcode;
        return (
            <>
                {/* <Row> */}
                    {/* <Col> */}
                    <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                        <Affix top={60}>
                         <BreadcrumbComponentToolbar
                                //   showFilter={true}
                                showSearch={true}
                                breadCrumbItem={breadCrumbData}
                                filterColumnData={this.searchedGridData}
                                filterParam={filterTestParam}
                                selectedMaster={this.props.Login.masterData.RSSelectedSample}
                                searchRef={this.searchRef}
                                filterComponent={[
                                    {
                                        "Sample Filter": <COAReleaseFilter
                                            SampleType={this.state.SampletypeList || []}
                                            SampleTypeValue={this.props.Login.masterData.SampleTypeValue || []}
                                            RegType={this.state.RegistrationTypeList || []}
                                            RegTypeValue={this.props.Login.masterData.RegTypeValue || []}
                                            RegSubType={this.state.RegistrationSubTypeList || []}
                                            RegSubTypeValue={this.props.Login.masterData.RegSubTypeValue || []}
                                            ApprovalVersion={this.state.ConfigVersionList || []}
                                            ApprovalVersionValue={this.props.Login.masterData.ApprovalVersionValue || []}
                                            UserSection={this.state.UserSectionList || []}
                                            UserSectionValue={this.props.Login.masterData.UserSectionValue || []}
                                            // JobStatus={this.props.Login.masterData.JobStatus || []}
                                            Test={this.state.TestList || []}
                                            TestValue={this.props.Login.masterData.TestValue || []}
                                            FilterStatus={this.state.FilterStatusList || []}
                                            FilterStatusValue={this.props.Login.masterData.FilterStatusValue || []}
                                            fromDate={this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()}
                                            toDate={this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()}
                                            onFilterComboChange={this.onFilterComboChange}
                                            handleDateChange={this.handleDateChange}

                                            // onDesignTemplateChange={this.onDesignTemplateChange}
                                            // DynamicDesignMapping={this.state.stateDynamicDesign || []}
                                            // DesignTemplateMapping={this.props.Login.masterData.DesignTemplateMapping}
                                            // DesignTemplateMappingValue={this.props.Login.masterData.DesignTemplateMappingValue || {}}
                                            userInfo={this.props.Login.userInfo}

                                        />
                                    }
                                ]}
                                onFilterSubmit={this.onFilterSubmit}

                                />
                            </Affix>
                </div>
                {/* <Row>
                <Col> */}
                        <ListWrapper className="client-list-content" style={{paddingTop:"5px"}}>
                     

                            {this.state.data ?
                                <DataGridWithMultipleGrid
                                    needSubSample={this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample || false}
                                    data={this.state.data}
                                    dataResult={process(this.props.Login.masterData.searchedData1 && this.props.Login.masterData.searchedData1 || this.props.Login.masterData.ReleaseSample && this.props.Login.masterData.ReleaseSample || [], this.state.dataState)}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    expandNextData={this.expandNextData}
                                    checkFunction={this.checkFunction}
                                    checkFunction1={this.checkFunction1}
                                    expandFunc={this.expandFunc}
                                    //expandData={this.expandData}
                                    childDataResult={this.state.childDataResult}
                                    subChildDataResult={this.state.subChildDataResult}
                                    extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                                    subChildColumnList={this.gridfillingColumn(this.state.DynamicTestGridItem) || []}

                                    expandField="expanded"
                                    handleExpandChange={this.handleExpandChange}
                                    childHandleExpandChange={this.childHandleExpandChange}

                                    reloadData={this.reloadData}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    pageable={true}
                                    scrollable={'scrollable'}
                            gridHeight={'600px'}
                            gridTop={'10px'}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    isExpandRequired={true}
                                  //  isDownloadRequired={true}
                                    isCollapseRequired={true}

                                    selectedId={this.props.Login.selectedId}
                                    hasChild={true}
                                    hasSubChild={true}
                                    childList={
                                        this.props.Login.masterData.searchedData2 ||
                                        this.props.Login.masterData.ReleaseSubSample
                                    }
                                    childColumnList={this.gridfillingColumn(this.state.DynamicSubSampleGridItem) || []}
                                    childMappingField={"npreregno"}
                                    subChildMappingField={"ntransactionsamplecode"}

                                   // subChildMappingField={this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample ? "ntransactionsamplecode" : "npreregno"}
                                    subChildList={
                                        this.props.Login.masterData.searchedData3 ||
                                        this.props.Login.masterData.ReleaseTest
                                    }
                                    selectedsubcild={this.props.Login.selectedsubcild}
                                    methodUrl={"Release"}
                                    headerSelectionChange={this.headerSelectionChange}
                                    childHeaderSelectionChange={this.childHeaderSelectionChange}
                                    childSelectAll={this.props.Login.childSelectAll}
                                    childSelectionChange={this.childSelectionChange}
                                    subChildSelectionChange={this.subChildSelectionChange}
                                    subChildHeaderSelectionChange={this.subChildHeaderSelectionChange}
                                    subChildSelectAll={this.props.Login.subChildSelectAll}
                                    selectionChange={this.selectionChange}
                                    selectAll={this.props.Login.selectAll}
                                    releaseRecord={//this.props.getCOAReportType
                                        this.onSaveModalClick} 
                                        viewDownloadFile={this.viewDownloadFile}
                                        regnerateFile={this.regnerateFile}
                                />
                                : ""}
                        </ListWrapper>
                    {/* </Col>
                </Row> */}
{this.props.Login.modalShow ? (
          <ModalShow
            modalShow={this.props.Login.modalShow}
            closeModal={this.closeModalShow}
            onSaveClick={this.onSaveModalClick}
            validateEsign={this.validateEsign}
            masterStatus={this.props.Login.masterStatus}
          //  mandatoryFields={mandatoryFields}
            updateStore={this.props.updateStore}
            selectedRecord={this.state.selectedRecord || {}}
            modalTitle={this.props.Login.modalTitle}
            modalBody={
               
                <AddRelease
                  selectedRecord={this.props.Login.selectedRecord || {}}
                  ReportTypeList={this.props.Login.ReportTypeList}
                  onInputOnChange={this.onInputOnChange}
                 // handleDateChange={this.handleDateChange}
                  onComboChange={this.onComboChange}
                  userInfo={this.props.Login.userInfo}
                  esign={this.props.Login.loadEsign}
                  //currentTime={this.props.Login.currentTime}
                />
            }
          />
        ) : (
          ""
        )}
            </>
        );
    }
    onComboChange = (comboData, fieldName) => {
        if (comboData !== null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;

            this.setState({ selectedRecord });
        }

    } 
    closeModalShow = () => {
        let loadEsign = this.props.Login.loadEsign;
    
        let modalShow = this.props.Login.modalShow;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
          loadEsign = false;
        } else {
          modalShow = false;
          selectedRecord = {};
        }
    
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: { modalShow, selectedRecord, selectedId: null, loadEsign },
        };
        this.props.updateStore(updateInfo);
      };
      viewDownloadFile= (inputData,row) => { 
        // this.props.generateReport()
        this.onSaveModalClick(true,row,'IDS_DOWNLOADFILE')
     }
     regnerateFile= (inputData,row) => { 
        // this.props.generateReport()
        this.onSaveModalClick(true,row,'IDS_REGENERATEFILE')
     }
      onSaveModalClick = (nflag,row,action) => {
        let ntransactionsamplecode = ""
        let ntransactiontestcode = ""
        let npreregno = ""
        if(nflag===true?true:this.state.npreregno&&this.state.npreregno.length>0 ){
        let sample = this.state.npreregno.filter((c, index) => {
            return this.state.npreregno.indexOf(c) === index;
        });
        let subsample = this.state.ntransactionsamplecode.filter((c, index) => {
            return this.state.ntransactionsamplecode.indexOf(c) === index;
        });
        let test = this.state.ntransactiontestcode.filter((c, index) => {
            return this.state.ntransactiontestcode.indexOf(c) === index;
        });
        if (nflag===true)
        {
            npreregno = row.dataItem['npreregno']

        }
        else
        {
            npreregno = sample.map(x => x).join(",") 
        }
        ntransactionsamplecode = subsample.map(x => x).join(",")
        ntransactiontestcode = test.map(x => x).join(",")

        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        let ntransCode = this.props.Login.masterData.FilterStatusValue.ntransactionstatus
        if (ntransCode === transactionStatus.ALL) {
            ntransCode = this.props.Login.masterData.FilterStatus.map(status => status.ntransactionstatus).join(",");
        } else {
            ntransCode = ntransCode
        }
        const inputParam = {
            inputData: {
                change: this.props.Login.change,
                npreregno: npreregno,
                ntransactionsamplecode: ntransactionsamplecode,
                ntransactiontestcode: ntransactiontestcode,
                nsectioncode: this.props.Login.masterData.UserSectionValue ?
                    this.props.Login.masterData.UserSectionValue.nsectioncode === -1 ?
                        this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') :
                        String(this.props.Login.masterData.UserSectionValue.nsectioncode) :
                    null,
                ntestcode: this.props.Login.masterData.realTestValue && this.props.Login.masterData.realTestValue.ntestcode,
                // nTransStatus: ntransCode,
                // ntransactionstatus: ((this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus 
                //     !== undefined) || this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== '0')
                //      ? String(this.props.Login.masterData.realFilterStatusValue.ntransactionstatus) : "-1",

                 ntransactionstatus: String("-1"),
                nsampletypecode: this.props.Login.masterData.realSampleTypeValue && this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                napprovalversioncode: this.props.Login.masterData.ApprovalVersionValue.napprovalconfigversioncode,
                nneedsubsample: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample) || false,
                nneedtemplatebasedflow: (this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow) || false,
                dfrom: obj.fromDate,
                dto: obj.toDate,
                nflag: 2,
                ntype: 1,
                userinfo: this.props.Login.userInfo,
                APSelectedSample: this.props.Login.masterData.APSelectedSample,
                APSelectedSubSample: this.props.Login.masterData.APSelectedSubSample,
                APSelectedTest: this.props.Login.masterData.APSelectedTest,
                // retestcount: action.ntransactionstatus === transactionStatus.RETEST ? this.state.selectedRecord ? this.state.selectedRecord.retestcount || 1 : 1 : undefined,
                // ncontrolCode,
                checkBoxOperation: 3,
                action,
                ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1
            },
            userinfo: this.props.Login.userInfo
        }
       if (nflag===true)
        {
            this.props.generateReport( inputParam.inputData, this.props.Login.masterData)
        }
        else
        {
            this.props.getReleaseSelectedSampleSubSampleTest(this.props.Login.userInfo, this.props.Login.masterData, inputParam.inputData) 
        }
    }
    else
    {
        toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTANYONESAMPLE/SUBSAMPLE/TEST" })); 
    }
    }
    componentDidUpdate(previousProps) {
        let { userRoleControlRights, controlMap,
            sampleListColumns, subSampleListColumns, testListColumns, SingleItem,
            sampleListMainField, subSampleListMainField, testListMainField,
            SampleGridItem, SampleGridExpandableItem, testMoreField,
            resultDataState, instrumentDataState,
            materialDataState, taskDataState,
            documentDataState, resultChangeDataState,
            historyDataState, testCommentDataState,
            samplePrintHistoryDataState, sampleHistoryDataState,
            selectedRecord, SampletypeList, RegistrationTypeList,
            RegistrationSubTypeList, FilterStatusList,
            ConfigVersionList, UserSectionList, TestList, skip, take, testskip, testtake, selectedFilter,
            DynamicSampleColumns, DynamicSubSampleColumns, DynamicTestColumns, DynamicGridItem, DynamicTestGridItem,DynamicSubSampleGridItem,
            DynamicGridMoreField, stateDynamicDesign, sampleSearchField, subsampleSearchField, testSearchField ,combinedSearchField,checkedflag,npreregno} = this.state;

        let bool = false;
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            bool = true;
        }
        if (this.props.Login.masterData.RegSubTypeValue !== previousProps.Login.masterData.RegSubTypeValue) {
            if (this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nsubsampleneed === transactionStatus.NO) {
                let dataState = {
                    skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5//, group: [{ field: `${this.props.Login.masterData.RegSubTypeValue.nsubsampleneed ? 'ssamplearno' : 'sarno'}` }] 
                }
                resultDataState = dataState
                instrumentDataState = dataState
                materialDataState = dataState
                taskDataState = dataState
                documentDataState = dataState
                resultChangeDataState = dataState
                historyDataState = dataState
                testCommentDataState = dataState

                bool = true;
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {

            selectedRecord = this.props.Login.selectedRecord
            bool = true;
        }
        if (this.props.Login.checkedflag !== previousProps.Login.checkedflag) {

            checkedflag = this.props.Login.checkedflag
            bool = true;
        }
        if (this.props.Login.npreregno !== previousProps.Login.npreregno) {

            npreregno = this.props.Login.npreregno
            bool = true;
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const SampletypeListMap = constructOptionList(this.props.Login.masterData.SampleType || [], "nsampletypecode", "ssampletypename", 'ascending', 'nsampletypecode', false);
            const RegistrationTypeListMap = constructOptionList(this.props.Login.masterData.RegType || [], "nregtypecode", "sregtypename", "nsorter", 'ascending', 'nregtypecode', false);
            const RegistrationSubTypeListMap = constructOptionList(this.props.Login.masterData.RegSubType || [], "nregsubtypecode", "sregsubtypename", "nsorter", 'ascending', 'nregsubtypecode', false);
            const FilterStatusListMap = constructOptionList(this.props.Login.masterData.FilterStatus || [], "ntransactionstatus", "sfilterstatus", undefined, undefined, true);
            const ConfigVersionListMap = constructOptionList(this.props.Login.masterData.ApprovalVersion || [], "napprovalconfigversioncode", "sversionname", 'descending', 'ntransactionstatus', false);
            const UserSectionListMap = constructOptionList(this.props.Login.masterData.UserSection || [], "nsectioncode", "ssectionname", undefined, undefined, true);
            const TestListMap = constructOptionList(this.props.Login.masterData.Test || [], "ntestcode", "stestsynonym", undefined, undefined, true);
            SampletypeList = SampletypeListMap.get("OptionList");
            RegistrationTypeList = RegistrationTypeListMap.get("OptionList");
            RegistrationSubTypeList = RegistrationSubTypeListMap.get("OptionList");
            FilterStatusList = FilterStatusListMap.get("OptionList");
            ConfigVersionList = ConfigVersionListMap.get("OptionList");
            UserSectionList = UserSectionListMap.get("OptionList");
            TestList = TestListMap.get("OptionList");
            bool = true;
            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
            take = this.props.Login.take || take
            testskip = this.props.Login.testskip === undefined ? testskip : this.props.Login.testskip
            testtake = this.props.Login.testtake || testtake
            let selectFilterStatus = { ntransactionstatus: transactionStatus.PARTIAL, sfilterstatus: this.props.intl.formatMessage({ id: "IDS_PARTIAL" }), scolorhexcode: "#800000" }
            const selectedFilters = this.props.Login.masterData.FilterStatus || [];

            const selectedFiltersNew = JSON.parse(JSON.stringify(selectedFilters));

            const index = selectedFiltersNew.findIndex(item => item.ntransactionstatus === transactionStatus.PARTIAL)
            if (selectedFiltersNew.length > 0 && index === -1) {
                selectedFiltersNew.push(selectFilterStatus)
            }
            selectedFilter = selectedFiltersNew;
            if (this.props.Login.resultDataState && this.props.Login.resultDataState !== previousProps.Login.resultDataState) {
                resultDataState = this.props.Login.resultDataState;
            }
            if (this.props.Login.instrumentDataState && this.props.Login.instrumentDataState !== previousProps.Login.instrumentDataState) {
                instrumentDataState = this.props.Login.instrumentDataState;
            }
            if (this.props.Login.taskDataState && this.props.Login.taskDataState !== previousProps.Login.taskDataState) {
                taskDataState = this.props.Login.taskDataState;
            }
            if (this.props.Login.resultChangeDataState && this.props.Login.resultChangeDataState !== previousProps.Login.resultChangeDataState) {
                resultChangeDataState = this.props.Login.resultChangeDataState;
            }
            if (this.props.Login.historyDataState && this.props.Login.historyDataState !== previousProps.Login.historyDataState) {
                historyDataState = this.props.Login.historyDataState;
            }
            if (this.props.Login.testCommentDataState && this.props.Login.testCommentDataState !== previousProps.Login.testCommentDataState) {
                testCommentDataState = this.props.Login.testCommentDataState;
            }
            if (this.props.Login.samplePrintHistoryDataState && this.props.Login.samplePrintHistoryDataState !== previousProps.Login.samplePrintHistoryDataState) {
                samplePrintHistoryDataState = this.props.Login.samplePrintHistoryDataState;
            }
            if (this.props.Login.sampleHistoryDataState && this.props.Login.sampleHistoryDataState !== previousProps.Login.sampleHistoryDataState) {
                sampleHistoryDataState = this.props.Login.sampleHistoryDataState;
            }
        }

        if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
            const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)
            DynamicSampleColumns = dynamicColumn.samplelistitem ? dynamicColumn.samplelistitem : [];
            DynamicSubSampleColumns = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];
            DynamicTestColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : []

           // DynamicGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem : [];
            DynamicGridItem = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields : [];
            DynamicTestGridItem = dynamicColumn.testListFields.releasetestfields ? dynamicColumn.testListFields.releasetestfields : [];
            DynamicSubSampleGridItem=dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];

            DynamicGridMoreField = dynamicColumn.samplegridmoreitem ? dynamicColumn.samplegridmoreitem : [];

            SingleItem = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields : [];
            testMoreField = dynamicColumn.testlistmoreitems ? dynamicColumn.testlistmoreitems : [];
            testListColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : [];

            sampleSearchField = dynamicColumn.samplesearchfields ? dynamicColumn.samplesearchfields : [];
            subsampleSearchField = dynamicColumn.subsamplesearchfields ? dynamicColumn.subsamplesearchfields : [];
            testSearchField = dynamicColumn.testsearchfields ? dynamicColumn.testsearchfields : [];
            sampleSearchField.map(item => { combinedSearchField.push(item) });
            subsampleSearchField.map(item => { combinedSearchField.push(item) });
            testSearchField.map(item => { combinedSearchField.push(item) });


            bool = true;

            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            selectedRecord['fromDate'] = obj.fromDate;
            selectedRecord['toDate'] = obj.toDate;

            bool = true;
        }
        if (this.props.Login.masterData.DesignTemplateMapping !== previousProps.Login.masterData.DesignTemplateMapping) {

            const DesignTemplateMappingMap = constructOptionList(this.props.Login.masterData.DesignTemplateMapping || [], "ndesigntemplatemappingcode",
                "sregtemplatename", undefined, undefined, false);

            stateDynamicDesign = DesignTemplateMappingMap.get("OptionList")
        }
        if (bool) {
            bool = false;
            this.setState({
                userRoleControlRights, controlMap,
                sampleListColumns, subSampleListColumns, testListColumns, SingleItem,
                sampleListMainField, subSampleListMainField, testListMainField,
                SampleGridItem, SampleGridExpandableItem, testMoreField,
                resultDataState, instrumentDataState,
                materialDataState, taskDataState,
                documentDataState, resultChangeDataState,
                historyDataState, testCommentDataState,
                samplePrintHistoryDataState, sampleHistoryDataState,
                selectedRecord, SampletypeList, RegistrationTypeList,
                RegistrationSubTypeList, FilterStatusList,
                ConfigVersionList, UserSectionList, TestList,
                skip, take, testskip, testtake, selectedFilter,
                DynamicSampleColumns, DynamicSubSampleColumns,
                DynamicTestColumns, DynamicGridItem, DynamicTestGridItem,DynamicSubSampleGridItem,
                DynamicGridMoreField, stateDynamicDesign,
                sampleSearchField, subsampleSearchField, testSearchField,combinedSearchField,checkedflag,npreregno
            });
            //     if (this.state.count === 0){
            //         const updateInfo = {
            //             typeName: DEFAULT_RETURN,
            //             data: {
            //                 change: false,
            //             }
            //         }
            //     this.props.updateStore(updateInfo);
            // }
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    data: this.props.Login.data || this.props.Login.masterData.ReleaseSample || [],
                    dataResult: process(this.props.Login.data || this.props.Login.masterData.ReleaseSample || [], this.state.dataState),

                    //        childDataResult: process(this.props.Login.data || Object.values(this.props.Login.masterData.ReleaseSubSample).forEach(item=>item) || [], this.state.dataState),
                    //  subChildDataResult: process(this.props.Login.data || Object.entries(this.props.Login.masterData.ReleaseTest)[1] || [], this.state.dataState),


                });
                //     const updateInfo = {
                //         typeName: DEFAULT_RETURN,
                //         data: {
                //             masterData: process( this.props.Login.masterData.ReleaseSample || [], this.props.Login.dataState || this.state.dataState),
                //         }
                //     }
                // this.props.updateStore(updateInfo);
            }
            else {
                let { dataState } = this.state;
                if (this.state.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }

                const releaseData = this.props.Login.data || this.props.Login.masterData.ReleaseSample || [];

                this.setState({
                    data: this.props.Login.data || this.props.Login.masterData.ReleaseSample || [],
                    dataResult: process(this.props.Login.masterData.ReleaseSample || [], this.props.Login.dataState || dataState),
                    //   childDataResult: process(Object.values(this.props.Login.masterData.ReleaseSubSample).forEach(item=>item) || [], this.props.Login.dataState || dataState),
                    //    subChildDataResult: process(Object.entries(this.props.Login.masterData.ReleaseTest) || [], this.props.Login.dataState || dataState),

                    dataState
                });


            }
        }
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

    }
    

    reloadData = () => {
        this.searchRef.current.value = "";
        delete this.props.Login.masterData["searchedData1"]
        delete this.props.Login.masterData["searchedData2"]

        delete this.props.Login.masterData["searchedData3"]

        // this.props.Login.masterData.ReleaseSample.map(item=>item["expanded"]=false)

        this.props.Login.change = false
        let { realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue,
            realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue } = this.props.Login.masterData
        let masterData = { ...this.props.Login.masterData, realFromDate, realToDate, realSampleTypeValue, realRegTypeValue, realRegSubTypeValue, realFilterStatusValue, realApprovalVersionValue, realUserSectionValue, realTestValue }
        let inputData = {
            npreregno: "0",
            nneedsubsample: (realRegSubTypeValue && realRegSubTypeValue.nneedsubsample) || false,
            nneedtemplatebasedflow: (realRegSubTypeValue && realRegSubTypeValue.nneedtemplatebasedflow) || false,
            nsampletypecode: (realSampleTypeValue && realSampleTypeValue.nsampletypecode) || -1,
            nregtypecode: (realRegTypeValue && realRegTypeValue.nregtypecode) || -1,
            nregsubtypecode: (realRegSubTypeValue && realRegSubTypeValue.nregsubtypecode) || -1,
            ntransactionstatus: ((realFilterStatusValue && realFilterStatusValue.ntransactionstatus !== undefined) || realFilterStatusValue.ntransactionstatus !== '0') ? String(realFilterStatusValue.ntransactionstatus) : "-1",
            napprovalconfigcode: realApprovalVersionValue ? realApprovalVersionValue.napprovalconfigcode || -1 : null,
            napprovalversioncode: realApprovalVersionValue && realApprovalVersionValue.napprovalconfigversioncode ? String(realApprovalVersionValue.napprovalconfigversioncode) : null,
            nsectioncode: realUserSectionValue ? realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(realUserSectionValue.nsectioncode) : null,
            ntestcode: realTestValue && realTestValue.ntestcode ? realTestValue.ntestcode : -1,
            userinfo: this.props.Login.userInfo,
            activeTestTab: this.props.Login.activeTestTab || "",
            activeSampleTab: this.props.Login.activeSampleTab || "",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "",
            checkBoxOperation: 3,
            ntype: 2,
            ndesigntemplatemappingcode: (this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode) || -1
        }
        if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
            && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
            && realFilterStatusValue.sfilterstatus !== null) {

            let obj = convertDateValuetoString(realFromDate, realToDate, this.props.Login.userInfo)
            inputData['dfrom'] = obj.fromDate;
            inputData['dto'] = obj.toDate;
            let inputParam = {
                masterData,
                inputData,
                searchSampleRef: this.searchSampleRef,
                searchSubSampleRef: this.searchSubSampleRef,
                searchTestRef: this.searchTestRef,
                skip: this.state.skip,
                take: this.state.take,
                testskip: this.state.testskip,
                testtake: this.state.testtake,
                resultDataState: this.state.resultDataState,
                instrumentDataState: this.state.instrumentDataState,
                materialDataState: this.state.materialDataState,
                taskDataState: this.state.taskDataState,
                documentDataState: this.state.documentDataState,
                resultChangeDataState: this.state.resultChangeDataState,
                testCommentDataState: this.state.testCommentDataState,
                historyDataState: this.state.historyDataState,
                samplePrintHistoryDataState: this.state.samplePrintHistoryDataState,
                sampleHistoryDataState: this.state.sampleHistoryDataState
            }
            this.props.getReleaseSample(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }
    selectionChange = (event,nflag,checkedflag) => {
        const checked = event.syntheticEvent.target.checked;
        if (nflag === undefined) {
            this.state.dataResult.data.map(item => {
                if (item.npreregno === event.dataItem.npreregno) {
                    item.selected = checked;
                }
                   
            })
            let preregno = event.dataItem.npreregno
            let ncoahistorycode = event.dataItem.ncoahistorycode
            let ssystemfilename = event.dataItem.ssystemfilename
            const coaFileInfo = {
                typeName: DEFAULT_RETURN,
                data: { ncoahistorycode, ssystemfilename},
            };
            this.props.updateStore(coaFileInfo);

            this.childHeaderSelectionChange(event, preregno,checkedflag)
        }
        else {
            let data=[]
            event.dataItems.map(item => {
                data.push({"npreregno":item.npreregno})
            })
            this.childHeaderSelectionChange(event, data,checkedflag)

        }
       
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         data: undefined, dataState: undefined,

        //     }
        // }
        // this.props.updateStore(updateInfo);
    }
    childHeaderSelectionChange=(event, preregno,checkedflag) =>{
        const checked = event.syntheticEvent.target.checked;
        let subsamplecode = [];
        let npreregno = preregno === undefined ? event.dataItems[0].npreregno : preregno
       if (npreregno.length===0||npreregno.length===undefined) {
           this.props.Login.masterData.ReleaseSubSample[npreregno].map(item => {
                
                item.selected = checked
                if (!subsamplecode.includes(item.ntransactionsamplecode)) {
                    subsamplecode.push({ "ntransactionsamplecode": item.ntransactionsamplecode })
                }
                
            })
            this.props.Login.masterData.ReleaseSample.map(data => {
                if (data.npreregno === npreregno) {
                 data.selected = checked

                }
            })

            this.subChildHeaderSelectionChange(event, subsamplecode,checkedflag)
        }
       else {
           npreregno.map(value => {
               this.props.Login.masterData.ReleaseSubSample[value.npreregno].map(item => {
                   item.selected = checked
                   if (!subsamplecode.includes(item.ntransactionsamplecode)) {
                       subsamplecode.push({ "ntransactionsamplecode": item.ntransactionsamplecode })
                   }
               })
            //    this.props.Login.masterData.ReleaseSample.map(data => {
            //        if (data.npreregno === value.npreregno) {
            //         data.selected = checked
 
            //        }
            //    })
           })
           

        this.subChildHeaderSelectionChange(event, subsamplecode,checkedflag)
        }

        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         data: undefined, dataState: undefined,

        //     }
        // }
        // this.props.updateStore(updateInfo);

    }

    subChildHeaderSelectionChange = (event, subsamplecode,checkedflag) => {
        const checked = event.syntheticEvent.target.checked;
        let transactionsamplecode=[]
        if (subsamplecode !== undefined) {
            transactionsamplecode = subsamplecode
            transactionsamplecode.map(value =>
                this.props.Login.masterData.ReleaseTest[value.ntransactionsamplecode].map(item => {
                    item.selected = checked;
                    this.collectData(item,checkedflag)

                    return item;
                })
            )
        }
        else {
            let rFlag = true;
            event.dataItems.map(value =>
                this.props.Login.masterData.ReleaseTest[value.ntransactionsamplecode].map(item => {
                    item.selected = checked;
                    this.collectData(item,checkedflag)

                    return item;
                })
                
            )
            this.props.Login.masterData.ReleaseSubSample[event.dataItems[0].npreregno].map(item => {
                if (event.dataItems[0].ntransactionsamplecode === item.ntransactionsamplecode) {
                    item.selected = checked;

                }
            })
            let data = this.props.Login.masterData.ReleaseSubSample[event.dataItems[0].npreregno].every(item => {
                return item.selected === true;
            })
            if (data === true) {
                this.props.Login.masterData.ReleaseSample.map(item => {
                    if (event.dataItems[0].npreregno === item.npreregno) {
                        item.selected = checked;

                    }
    
                })
            }
            else {
                this.props.Login.masterData.ReleaseSample.map(item => {
                    if (event.dataItems[0].npreregno === item.npreregno) {
                        item.selected = false;
                    }
    
                })
            }
            
            // let x;
            // let i;
            // for (i = 0; i < this.props.Login.masterData.ReleaseSample.length; i++){
            //     x=i
            //         if (event.dataItems[0].npreregno !== this.props.Login.masterData.ReleaseSample[i].npreregno) {
            //             // item.selected = checked;
            //             rFlag = false;
            //             break;
            //         }
            // }
            
            // if (rFlag === true) {
            //     this.props.Login.masterData.ReleaseSample[x].selected = checked;
            // }
        }
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         data: undefined, dataState: undefined,

        //     }
        // }
        // this.props.updateStore(updateInfo);
    }
    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        // if(checked===true)
        // {
            this.state.dataResult.data.map(item => {
                item.selected = checked;
                return item;
            }); 
                //this.setState({headerSelect:checked})  
            this.selectionChange(event,1,checked);
        // }else
        // {
        //     this.setState({npreregno:[]})
        // }
    

    }
    childSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
            this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].map(item => {
                if (item.npreregno === event.dataItem.npreregno&&item.ntransactionsamplecode===event.dataItem.ntransactionsamplecode) {
                    item.selected = checked;
                }
                   
            })
        let data = this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].every(item => {
            return item.slected===true
        })
        if (data === true) {
            this.props.Login.masterData.ReleaseSample.map(item => {
                if (event.dataItem.npreregno === item.npreregno) {
                    item.selected = checked;
                }
            })
            this.props.Login.masterData.ReleaseTest[event.dataItem.ntransactionsamplecode].map(item => {
                if (event.dataItem.ntransactionsamplecode === item.ntransactionsamplecode) {
                    item.selected = checked;
                    this.collectData(item)
                }
            })
        }
        else {
            this.props.Login.masterData.ReleaseTest[event.dataItem.ntransactionsamplecode].map(item => {
                if (event.dataItem.ntransactionsamplecode === item.ntransactionsamplecode) {
                    item.selected = checked;
                    this.collectData(item)
                }
            })
            let data = this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].every(item => {
                return item.selected===true
            })
            if (data === true) {
                this.props.Login.masterData.ReleaseSample.map(item => {
                    if (event.dataItem.npreregno === item.npreregno) {
                        item.selected = checked;
                    }
                })
            }
            else{
                this.props.Login.masterData.ReleaseSample.map(item => {
                    if (event.dataItem.npreregno === item.npreregno) {
                        item.selected = false;
                    }
                })
            }
        }
        

        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         data: undefined, dataState: undefined,

        //     }
        // }
        // this.props.updateStore(updateInfo); 
    }
    subChildSelectionChange = (event) => {
        let x=[]
        const checked = event.syntheticEvent.target.checked;
        this.props.Login.masterData.ReleaseTest[event.dataItem.ntransactionsamplecode].map(item => {
            if (item.ntransactiontestcode === event.dataItem.ntransactiontestcode) {
                item.selected = checked;
                this.collectData(item)
            }
               
        })
        this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].map(item => {


                if (item.ntransactionsamplecode === event.dataItem.ntransactionsamplecode) {
                    if (this.props.Login.masterData.ReleaseTest[item.ntransactionsamplecode]) {
                        x = this.props.Login.masterData.ReleaseTest[item.ntransactionsamplecode]
                    }
                }

            })
            let y = x.filter(t => t.selected === true);
            if (x.length === y.length) {
                this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].map((t, i) => {
                    if (t.ntransactionsamplecode === y[0].ntransactionsamplecode) {
                        this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno][i].selected = true
                    }
                })

        }
            else {
                this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno].map((t, i) => {
                    if (t.ntransactionsamplecode === event.dataItem.ntransactionsamplecode) {
                        this.props.Login.masterData.ReleaseSubSample[event.dataItem.npreregno][i].selected = false
                    }
                })
        }
                this.state.dataResult.data.map(item => {


                if (item.npreregno === event.dataItem.npreregno) {
                    if (this.props.Login.masterData.ReleaseSubSample[item.npreregno]) {
                        x = this.props.Login.masterData.ReleaseSubSample[item.npreregno]
                    }
                }

            })
            let y1 = x.filter(t => t.selected === true);
            if (x.length === y1.length) {
                this.state.dataResult.data.map((t, i) => {
                    if (t.npreregno === y1[0].npreregno) {
                        this.state.dataResult.data[i].selected = true
                    }
                })

        }
            else {
                this.state.dataResult.data.map((t, i) => {
                    if(t.npreregno===event.dataItem.npreregno){
                    this.state.dataResult.data[i].selected = false
                    } 
                })
        }
   
    }
    collectData = (item,checkedflag) => {
            let npreregno = this.state.npreregno || []
        let ntransactionsamplecode=this.state.ntransactionsamplecode||[]
        let ntransactiontestcode = this.state.ntransactiontestcode || []
                        if (item.selected === true) {
                        if (!npreregno.includes(item.npreregno)) {
                            npreregno.push(item.npreregno)
                        }
                        if (!ntransactionsamplecode.includes(item.ntransactionsamplecode)) {
                            ntransactionsamplecode.push(item.ntransactionsamplecode)
                        }
                        if (!ntransactiontestcode.includes(item.ntransactiontestcode)) {
                            ntransactiontestcode.push(item.ntransactiontestcode)
                        }
                    }
                    else {
                        const npreregno1 = npreregno.filter(data => data !== item.npreregno )
                        npreregno = npreregno1
    
                        const ntransactionsamplecode1 = ntransactionsamplecode.filter(data => data !== item.ntransactionsamplecode)
                        ntransactionsamplecode = ntransactionsamplecode1
    
                        const ntransactiontestcode1 = ntransactiontestcode.filter(data => data!== item.ntransactiontestcode)
                        ntransactiontestcode = ntransactiontestcode1
                    }   
        //      const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         data: undefined, dataState: undefined,
        //         npreregno: npreregno,
        //         ntransactionsamplecode:ntransactionsamplecode,
        //         ntransactiontestcode:ntransactiontestcode
        //     }
        // }
        // this.props.updateStore(updateInfo);
        this.setState({npreregno:checkedflag===false?[]:npreregno,ntransactionsamplecode:ntransactionsamplecode,ntransactiontestcode:ntransactiontestcode})
    }

}
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential, filterColumnData,
    getSubSampleBySample, getReleaseSelectedSamples, getReleaseSelectedSubSamples, getTestBySample,
    getReleaseSelectedTest, getReleaseSelectedSampleSubSampleTest, getReleaseRegistrationType, getReleaseRegistrationSubType,
    getReleaseFilterStatus, getReleaseApprovalVersion, getReleaseFilterBasedTest, getReleaseSample,getCOAReportType
,generateReport
})(injectIntl(COARelease));