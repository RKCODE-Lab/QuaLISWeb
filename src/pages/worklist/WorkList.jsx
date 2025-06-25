import React, { Component } from "react";
import { Row, Col, Card, Nav, FormGroup, FormLabel } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashAlt, faBolt } from "@fortawesome/free-solid-svg-icons";
import WorklistPreparationFilter from './WorklistPreparationFilter'
import { rearrangeDateFormat, convertDateValuetoString } from '../../components/CommonScript';
import { injectIntl } from "react-intl";
import Esign from "../audittrail/Esign";
import AddWorklistSection from '../worklist/AddWorklistSection';
import AddWorklistSample from '../worklist/AddWorklistSample';
import CustomTab from "../../components/custom-tabs/custom-tabs.component";
import WorklistHistoryTab from "./WorklistHistoryTab";
import WorklistSampleTab from "./WorklistSampleTab";
import { designProperties, transactionStatus, REPORTTYPE, SUBSAMPLEAUDITMULTILINGUALFIELDS, designComponents } from '../../components/Enumeration';
import SpecificationInfo from '../testgroup/SpecificationInfo';
//import { ReactComponent as Closure } from '../../assets/image/prepared-worklist.svg';
import { ReactComponent as Closure } from '../../assets/image/prepared.svg';
import { ReactComponent as ReportIcon } from '../../assets/image/report-Icon.svg';
//import { ReactComponent as ReportIcon } from '../../assets/image/report-svgrepo-com.svg';
import { ReactComponent as Report } from '../../assets/image/Report.svg';
import { ReactComponent as SaveIcon } from '../../assets/image/save_icon.svg';
import CustomPopover from '../../components/customPopover';
import ModalShow from '../../components/ModalShow';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

import {
  callService,
  crudMaster,
  validateEsignCredential,
  updateStore,
  getSectionAndTest,
  getWorklistDetail,
  OpenDate,
  CloseDate, viewAttachment, getInstrumentCombo, getWorklistSample, getRegTypeTestWise,
  getRegTypeWorklist, getSectionbaseTest, onWorklistApproveClick
  , getWorklistDetailFilter, getEditSectionAndTest, createWorklistCreation, filterColumnData, getConfigVersionTestWise,
  ViewSampleDetails, getWorklisthistoryAction, reportWorklist, getRegSubTypeWise,
  insertWorklist, generateControlBasedReport, validateEsignforWorklist, getWorklistFilterDetails
} from "../../actions";

import ListMaster from "../../components/list-master/list-master.component";
import { DEFAULT_RETURN } from "../../actions/LoginTypes";
import SlideOutModal from "../../components/slide-out-modal/SlideOutModal";

import {
  showEsign,
  getControlMap,
  constructOptionList,
} from "../../components/CommonScript";
import { ContentPanel, MediaLabel } from "../../components/App.styles";

import { process } from "@progress/kendo-data-query";
import ConfirmMessage from "../../components/confirm-alert/confirm-message.component";

import BreadcrumbComponent from "../../components/Breadcrumb.Component";
import { Affix } from "rsuite";
import DataGrid from '../../components/data-grid/data-grid.component';
const mapStateToProps = (state) => {
  return { Login: state.Login };
};

class WorkList extends Component {
  constructor(props) {
    super(props);
    const sectionDataState = { skip: 0, take: 10 };
    this.state = {
      selectedRecord: {},
      error: "",
      userRoleControlRights: [],
      selectedWorklist: undefined,
      controlMap: new Map(),
      Instrument: [],
      sectionDataState,
      addComponentDataList: [],
      addedComponentList: [],
      RegistrationSubTypeList: [], FilterStatusList: [], SampletypeList: [], RegTypeValue: [], ConfigVersionList: [],
      sidebarview: false
    };
    this.searchRef = React.createRef();
    this.searchFieldList = ["sworklistno", "stestname"];
    this.confirmMessage = new ConfirmMessage();
  }
  sidebarExpandCollapse = () => {
    this.setState({
      sidebarview: true
    })
  }

  handleDateChange = (dateName, dateValue) => {


    if (dateValue === null) {
      dateValue = new Date();
    }
    // let toDate;
    // let fromDate;
    let fromdate = this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()
    let todate = this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()
    let obj = {}
    if (dateName === 'fromDate') {
      obj = convertDateValuetoString(dateValue, todate, this.props.Login.userInfo)
      fromdate = obj.fromDate
      todate = obj.toDate
      let fromDate = obj.fromDate
      let toDate = obj.toDate
    } else {
      obj = convertDateValuetoString(fromdate, dateValue, this.props.Login.userInfo)
      fromdate = obj.fromDate
      todate = obj.toDate
      let fromDate = obj.fromDate
      let toDate = obj.toDate

    }
    let inputParam = {
      inputData: {
        nflag: 2,
        nregtypecode: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode,
        nregsubtypecode: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
        nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
        fromdate: String(fromdate),
        todate: String(todate),
        userinfo: this.props.Login.userInfo,
        realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
        realApprovalVersionValue: this.props.Login.masterData.realApprovalVersionValue,
      },
      masterData: this.props.Login.masterData

    }
    this.props.getConfigVersionTestWise(inputParam)

  };



  onFilterComboChange = (comboData, fieldName) => {

    if (comboData) {
      let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
      let inputParamData = {};
      if (fieldName === 'nsampletypecode') {
        //if (comboData.value !== this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode) {
        inputParamData = {
          nflag: 2,
          fromdate: obj.fromDate,
          todate: obj.toDate,
          nsampletypecode: comboData.value,
          userinfo: this.props.Login.userInfo,
          masterData: this.props.Login.masterData,
          defaultSampleTypeValue: comboData.item,
          realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
          realApprovalVersionValue: this.props.Login.masterData.realApprovalVersionValue,
        };
        this.props.getRegTypeWorklist(inputParamData)
        // }
      } else if (fieldName === 'nregtypecode') {
        //  if (comboData.value !== this.props.Login.masterData.defaultRegTypeValue.nregtypecode) {
        inputParamData = {
          nflag: 3,
          fromdate: obj.fromDate,
          todate: obj.toDate,
          nsampletypecode: this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode,
          nregtypecode: comboData.value,
          userinfo: this.props.Login.userInfo,
          masterData: this.props.Login.masterData,
          nregtypecode: comboData.value,
          realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
          realApprovalVersionValue: this.props.Login.masterData.realApprovalVersionValue,
          masterData: {
            ...this.props.Login.masterData,
            RegTypeValue: comboData.item,
            //RegistrationSubTypeList: inputParam.masterData.RegistrationSubTypeList
          }
          //defaultRegTypeValue: comboData.item


        }
        this.props.getRegSubTypeWise(inputParamData)
        //  }



      } else if (fieldName === 'nregsubtypecode') {

        //  if (comboData.value !== this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) {
        let inputData = {
          nflag: 4,
          fromdate: obj.fromDate,
          todate: obj.toDate,
          nsampletypecode: this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode,
          nregtypecode: this.props.Login.masterData.RegTypeValue.nregtypecode,
          nneedtemplatebasedflow: comboData.item.nneedtemplatebasedflow,
          nregsubtypecode: comboData.value,
          userinfo: this.props.Login.userInfo,
          realApprovalConfigVersionList: this.props.Login.masterData.realApprovalConfigVersionList,
          realApprovalVersionValue: this.props.Login.masterData.realApprovalVersionValue,
        }
        inputParamData = {
          inputData,
          masterData: {
            ...this.props.Login.masterData,
            RegSubTypeValue: comboData.item,
            //RegistrationSubTypeList: inputParam.masterData.RegistrationSubTypeList
          }
        }
        this.props.getConfigVersionTestWise(inputParamData)
        // }
      }

      else if (fieldName === 'ntransactionstatus') {
        // if (comboData.value !== this.props.Login.masterData.FilterStatusValue.ntransactionstatus) {
        let masterData = { ...this.props.Login.masterData, FilterStatusValue: comboData.item }
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: { masterData }
        }
        this.props.updateStore(updateInfo);
        //   }
      }


      else if (fieldName === 'napproveconfversioncode') {
        // if (comboData.value !== this.props.Login.masterData.defaultApprovalVersionValue.napproveconfversioncode) {
        let masterData = { ...this.props.Login.masterData, defaultApprovalVersionValue: comboData.item }
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: { masterData }
        }
        this.props.updateStore(updateInfo);
        //  }
      }

      //
    }
  }

  onInputOnChange = (event, optional) => {
    const selectedRecord = this.state.selectedRecord || {};
    if (event.target.type === "checkbox") {
      selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
    } else if (event.target.type === 'radio') {
      selectedRecord[event.target.name] = optional;
    } else {
      selectedRecord[event.target.name] = event.target.value;
    }
    this.setState({ selectedRecord });
  };



  onSaveClick = (saveType, formRef) => {
    // this.searchRef.current.value = "";
    let inputData = [];
    let instSection = [];
    inputData["userinfo"] = this.props.Login.userInfo;
    let obj = convertDateValuetoString(this.props.Login.masterData.fromdate, this.props.Login.masterData.todate, this.props.Login.userInfo)
    inputData['fromdate'] = obj.fromDate;
    inputData['todate'] = obj.toDate;
    if (this.props.Login.screenName === "IDS_WORKLIST") {
      let postParam = undefined;
      inputData["worklist"] = {
        nstatus: this.props.Login.userInfo.nmastersitecode,
      };
      inputData["worklist"]["nsampletypecode"] = this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode
      inputData["worklist"]["nsectioncode"] = this.state.selectedRecord["nsectioncode"].value
      inputData["worklist"]["ntestcode"] = this.state.selectedRecord["ntestcode"].value
      //inputData["worklist"]["nregtypecode"] = this.props.Login.masterData.RegTypeValue.nregtypecode
      inputData["worklist"]["nregtypecode"] = this.props.Login.masterData.defaultRegTypeValue.nregtypecode
      //inputData["worklist"]["nregsubtypecode"] = this.props.Login.masterData.RegSubTypeValue.nregsubtypecode
      inputData["worklist"]["nregsubtypecode"] = this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode
      inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.ndesigntemplatemappingcode
      inputData["napprovalconfigversioncode"] = (this.props.Login.masterData.defaultApprovalVersionValue && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode)
      inputData["ncontrolCode"] =
        this.state.controlMap.has("AddSamples") &&
        this.state.controlMap.get("AddSamples").ncontrolcode;
      // let defaultFilterStatusValue={};
      // let FilterStatusValue={};
      inputData["ntransactionstatus"] = (this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus) || -1;
      // this.props.Login.masterData.FilterStatus.map(item => {if(item.ntransactionstatus === transactionStatus.DRAFT){
      //   defaultFilterStatusValue = item;
      //   FilterStatusValue = item;}
      // });
      // let defaultFilterStatusValue=this.props.Login.masterData.FilterStatus[1];
      // let FilterStatusValue=this.props.Login.masterData.FilterStatus[1];
      if (this.props.Login.operation === "update") { inputData["worklist"]["nworklistcode"] = this.props.Login.masterData.selectedWorklist.nworklistcode }

      const inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl: "Worklist",
        inputData: inputData,
        operation: this.props.Login.operation,
        saveType,
        formRef,
        postParam,
        searchRef: this.searchRef,
      };
      const masterData = {...this.props.Login.masterData};
      // let masterData = {...this.props.Login.masterData
      //   ,defaultFilterStatusValue,
      //   FilterStatusValue      }
      if (
        showEsign(
          this.props.Login.userRoleControlRights,
          this.props.Login.userInfo.nformcode,
          this.props.Login.ncontrolCode
        )
      ) {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            loadEsign: true,
            screenData: {
              inputParam, masterData: {
                masterData
              }
            },
            saveType,
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        //this.props.crudMaster(inputParam, masterData, "openModal");
        this.props.insertWorklist(inputParam, masterData);
      }
    }



    //add / edit  

    let validList = true;
    if (this.props.Login.screenName === "IDS_WORKLISTSAMPLE" && this.state.addedComponentList.length > 1000) {
      validList = false;
    }

    if (validList) {
      let saveList = [];
      if (this.props.Login.screenName === "IDS_WORKLISTSAMPLE") {
        const compList = this.state.addComponentSortedList.map(x => {
          delete (x.selected);
          //return {...x, 'sregistereddate':formatInputDate(x.sregistereddate, false)}
          return x;
        }) || [];
        //compList.map(item=>saveList.push({"npreregno": item.npreregno}));
        if (compList.length > 0) {

          compList.map(item => saveList.indexOf(item.ntransactionsamplecode) === -1 ?
            saveList.push(item) : "");
          const masterData = {...this.props.Login.masterData};
          const inputData = {
            worklistcompcreationlist: saveList,
            userinfo: this.props.Login.userInfo,
            worklistcreation: this.props.Login.masterData.selectedWorklist,
            ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode
          };

          let dataState = undefined;
          let selectedId = null;
          let postParam = undefined;

          const inputParam = {
            classUrl: "worklist",
            methodUrl: "WorklistCreation",
            inputData: inputData, selectedId, dataState, postParam,
            operation: "create", saveType, masterData
          };



          if (
            showEsign(
              this.props.Login.userRoleControlRights,
              this.props.Login.userInfo.nformcode,
              this.props.Login.ncontrolCode
            )
          ) {
            const updateInfo = {
              typeName: DEFAULT_RETURN,
              data: {
                loadEsign: true, screenData: { inputParam, masterData: masterData }, saveType
              }
            }
            this.props.updateStore(updateInfo);
          }
          else {
            //this.props.crudMaster(inputParam,masterData, "openChildModal");
            this.props.createWorklistCreation(inputParam);
          }


        }
        else {
          //this.props.crudMaster(inputParam,masterData, "openChildModal");
          toast.warn(this.props.intl.formatMessage({ id: "IDS_SELCETONESAMPLE" }));
        }


      }




    }
    else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_EXCEEDSMAXINSERT" }));
    }






  };






  DeleteWorklistSample = (operation, ncontrolCode) => {
    let inputData = [];
    if (operation.screenName === "IDS_WORKLISTSAMPLE") {
      const dataState = this.state.sectionDataState;
      inputData["worklistsample"] = {
        nsitecode: this.props.Login.userInfo.ntranssitecode,
      };
      inputData["worklistsample"]["nworklistcode"] =
        operation.selectedRecord.nworklistcode;
      inputData["worklistsample"]["nworklistsamplecode"] =
        operation.selectedRecord.nworklistsamplecode;
      inputData["worklistsample"]["ntransactiontestcode"] =
        operation.selectedRecord.ntransactiontestcode;
      inputData["worklistsample"]["ntransactionsamplecode"] =
        operation.selectedRecord.ntransactionsamplecode;
      inputData["worklistsample"]["sarno"] =
        operation.selectedRecord.sarno;
      inputData["worklistsample"]["ssamplearno"] =
        operation.selectedRecord.ssamplearno;
      inputData["worklistsample"]["stestname"] =
        operation.selectedRecord.stestsynonym;
      inputData["worklistsample"]["nregsubtypecode"] =
        operation.selectedRecord.nregsubtypecode;
      inputData["worklistsample"]["nregtypecode"] =
        operation.selectedRecord.nregtypecode;
      inputData['ndesigntemplatemappingcode'] = this.props.Login.masterData.ndesigntemplatemappingcode;

      inputData["userinfo"] = this.props.Login.userInfo;
      const inputParam = {
        methodUrl: "WorklistSample",
        classUrl: this.props.Login.inputParam.classUrl,
        inputData: inputData,
        operation: "delete",
        dataState: dataState,
      };
      const masterData = this.props.Login.masterData;
      if (
        showEsign(
          this.props.Login.userRoleControlRights,
          this.props.Login.userInfo.nformcode,
          operation.ncontrolCode
        )
      ) {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            loadEsign: true,
            screenData: { inputParam, masterData },
            openChildModal: true,
            screenName: "worklistSample",
            operation: operation.operation,
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openChildModal");
      }
    }
  }


  gridfillingColumn(data) {
    const temparray = [];
    data && data.map((option) => {
      if (option[designProperties.VALUE] !== "dregdate") {
        temparray.push({
          "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode],
          "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3"
        })
      }
    });
    if (temparray) {
      temparray.push({ "idsName": "IDS_REGISTRATIONDATE", "dataField": "sregistereddate", "width": "250px", "columnSize": "3" })
    }
    return temparray;
  }
  gridfillingColumnGridMoreItem(data) {
    const temparray = [];
    data && data.map((option) => {
      if (option[designProperties.VALUE] !== "dregdate") {
        temparray.push({
          "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode],
          "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3"
        })
      }
    });
    // if (temparray) {
    //   temparray.push({ "idsName": "IDS_REGISTRATIONDATE", "dataField": "sregistereddate", "width": "250px", "columnSize": "3" })
    // }
    return temparray;
  }
  // onNumericInputOnChange = (value, name) => {
  //   const selectedRecord = this.state.selectedRecord || {};
  //   selectedRecord[name] = value;
  //   this.setState({ selectedRecord });
  // };
  // dataStateChangeWorklistSample = (event) => {
  //   // ADDed by Neeraj-ALPD-5136
  //   //WorkList Screen -> Including filter in Data selection Kendo Grid 
  //     let updatedList = [];
  //     if (event.dataState && event.dataState.filter === null) {
  //       let addComponentDataListCopy = this.state.addComponentDataListCopy ||this.state.addComponentDataList|| [];
  //       addComponentDataListCopy.forEach(x => {
  //         // Check if x's ntransactiontestcode exists in addComponentSortedList
  //         const exists = this.state.addComponentSortedList.some(
  //           item => item.ntransactiontestcode === x.ntransactiontestcode
  //         );
  //         // If it doesn't exist, add it to updatedList
  //         if (!exists) {
  //           updatedList.push(x);
  //         }
  //       });
  //     }else{
  //       updatedList=this.state.addComponentDataList||[]
  //     }      
      
  //       this.setState({
  //         dataResult: process(this.state.addComponentDataList || [], event.dataState),
  //         dataState: event.dataState,addComponentDataList:updatedList,addSelectAll:event.dataState && event.dataState.filter === null?
  //         this.valiateCheckAll(updatedList): this.valiateCheckAll(process(updatedList || [], event.dataState).data)
  //       });
  //   }

  // selectionChange = (event) => {
  //   let addedComponentList = this.state.addedComponentList || [];
  //   const addComponentDataList = this.props.Login.addComponentDataList.map(item => {
  //     if (item.ntransactiontestcode === event.dataItem.ntransactiontestcode) {
  //       item.selected = !event.dataItem.selected;
  //       if (item.selected) {
  //         const newItem = JSON.parse(JSON.stringify(item));
  //         newItem["jsondata"] = {}
  //         newItem["jsonuidata"] = {}
  //         delete newItem['selected']
  //         //newItem.selected = false;
  //         newItem["jsondata"]['worklist'] = item
  //         newItem["jsonuidata"]['worklist'] = item
  //         addedComponentList.push(newItem);
  //       }
  //       else {
  //         addedComponentList = addedComponentList.filter(item1 => item1.ntransactiontestcode !== item.ntransactiontestcode)
  //       }
  //     }
  //     return item;
  //   });
  //   this.setState({
  //     addComponentDataList, addedComponentList,
  //     addSelectAll: this.valiateCheckAll(addComponentDataList),
  //     deleteSelectAll: this.valiateCheckAll(addedComponentList)
  //   });
  // }
  // selectionChange = (event) => {
  //   let addedComponentList = this.state.addedComponentList || [];
  //   const addComponentDataList = this.state.addComponentDataList.map(item => {
  //     if (item.ntransactiontestcode === event.dataItem.ntransactiontestcode) {
  //       item.selected = !event.dataItem.selected;
  //       if (item.selected) {
  //         const newItem = JSON.parse(JSON.stringify(item));
  //         newItem["jsondata"] = {}
  //         newItem["jsonuidata"] = {}
  //         delete newItem['selected']
  //         //newItem.selected = false;
  //         newItem["jsondata"]['worklist'] = item
  //         newItem["jsonuidata"]['worklist'] = item
  //         addedComponentList.push(newItem);
  //       }
  //       else {
  //         addedComponentList = addedComponentList.filter(item1 => item1.ntransactiontestcode !== item.ntransactiontestcode)
  //       }
  //     }
  //     return item;
  //   });
  //   this.setState({
  //     // ADDed by Neeraj-ALPD-5136
  //     //WorkList Screen -> Including filter in Data selection Kendo Grid 
  //          addSelectAll: this.valiateCheckAll(this.state.dataState && this.state.dataState.filter 
  //           && this.state.dataState.filter !== null && this.state.dataState.filter!==undefined
  //        ? process(addComponentDataList || [], this.state.dataState).data : addComponentDataList),
  //     addComponentDataList, addedComponentList,
  //     //addSelectAll: this.valiateCheckAll(addComponentDataList),
  //     deleteSelectAll: this.valiateCheckAll(addedComponentList),
  //     addComponentDataListCopy:this.valiateCopy(this.state.addComponentSortedList||[],addComponentDataList||[],addedComponentList||[])
  //   });
  // }

  dataStateChange = (event) => {
    this.setState({ dataState: event.dataState })
  }


  specificationReport = (ncontrolCode) => {
    if (this.props.Login.masterData.selectedWorklist) {
      const inputParam = {

        stablename: "worklistcode",
        primaryKeyField: "nworklistcode",
        sreportlink: this.props.Login.reportSettings[15],
        smrttemplatelink: this.props.Login.reportSettings[16],
        nreporttypecode: REPORTTYPE.CONTROLBASED,
        ncontrolcode: ncontrolCode,
        primaryKeyValue: this.props.Login.masterData.selectedWorklist.nworklistcode,
        nworklistcode: this.props.Login.masterData.selectedWorklist.nworklistcode,
        nworklistcode_componentcode: REPORTTYPE.CONTROLBASED,
        nworklistcode_componentname: designComponents.NUMBER,
        ntranscode: this.props.Login.masterData.selectedWorklist.ntransactionstatus,
        userinfo: this.props.Login.userInfo
      }
      //this.props.reportWorklist(inputParam['inputData']);
      this.props.generateControlBasedReport(inputParam);

    } else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_REPORTCANNOTGENERATEFORCOMPWITHOUTTEST" }));
    }
  }

  // headerSelectionChange = (event) => {
  //   const checked = event.syntheticEvent.target.checked;
  //   let addComponentDataList = event.target.props.data //this.state.addedComponentList || [];
  //   let addedComponentList = [];


  //   if (checked) {
  //     const data = event.target.props.data.map(item => {
  //       //const data = this.state.addComponentDataList.map(item => {
  //       if (addedComponentList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode) === -1) {


  //         // addedComponentList.push({ ...item, selected: false });
  //         item.selected = checked;
  //         const newItem = JSON.parse(JSON.stringify(item));
  //         newItem["jsondata"] = {}
  //         newItem["jsonuidata"] = {}
  //         delete newItem['selected']
  //         //newItem.selected = false;
  //         newItem["jsondata"]['worklist'] = item
  //         newItem["jsonuidata"]['worklist'] = item
  //         addedComponentList.push(newItem);
  //         //item.selected = false;
  //         return item;
  //       } else {
  //         let olditem = JSON.parse(JSON.stringify(addedComponentList[addedComponentList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode)]))
  //         olditem.selected = checked;
  //         let newItem = JSON.parse(JSON.stringify(olditem));
  //         newItem.selected = false;
  //         newItem["jsondata"] = {};
  //         newItem["jsonuidata"] = {};
  //         delete newItem['selected']
  //         newItem["jsondata"]['worklist'] = olditem
  //         newItem["jsonuidata"]['worklist'] = olditem
  //         addedComponentList.push(newItem);
  //         return olditem;
  //       }

  //     });


  //     this.setState({
  //       addComponentDataList: data, addedComponentList,
  //       addSelectAll: this.valiateCheckAll(addedComponentList),
  //       deleteSelectAll: this.valiateCheckAll(addedComponentList),
  //       addSelectAll: checked, deleteSelectAll: false
  //     });
  //   }


  //   //   if (checked) {
  //   //     const data = event.dataItems.map(item => {
  //   //         if (addComponentDataList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode) === -1) {
  //   //           addComponentDataList.push({ ...item, selected: false });
  //   //             item.selected = checked;   
  //   //             let newItem = JSON.parse(JSON.stringify(item));
  //   //             newItem.selected = false;
  //   //             newItem["jsondata"]={};
  //   //             newItem["jsonuidata"]={};
  //   //             newItem["jsondata"]['worklist'] = item
  //   //             newItem["jsonuidata"]['worklist'] = item    
  //   //             addedComponentList.push(newItem);
  //   //             return item;
  //   //         } else {
  //   //             let olditem = JSON.parse(JSON.stringify(addComponentDataList[addComponentDataList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode)]))
  //   //             olditem.selected = checked;
  //   //             let newItem = JSON.parse(JSON.stringify(olditem));
  //   //             newItem.selected = false;
  //   //             newItem["jsondata"]={};
  //   //             newItem["jsonuidata"]={};
  //   //             newItem["jsondata"]['worklist'] = olditem
  //   //             newItem["jsonuidata"]['worklist'] = olditem
  //   //             addedComponentList.push(newItem);
  //   //             return olditem;

  //   //         }

  //   //     });


  //   //     this.setState({
  //   //       addComponentDataList: data,
  //   //         addedComponentList:addedComponentList,
  //   //         addComponentDataList,
  //   //         addSelectAll: checked, 
  //   //         deleteSelectAll: false
  //   //     });
  //   // }
  //   else {
  //     let addedComponentData = this.state.addedComponentList || [];
  //     let deletedListdData = this.state.deletedList || [];

  //     const data = this.state.addComponentDataList.map(item => {
  //       addedComponentData = addedComponentData.filter(item1 => item1.npreregno !== item.npreregno);
  //       deletedListdData = deletedListdData.filter(item1 => item1.npreregno !== item.npreregno);
  //       item.selected = checked;
  //       return item;
  //     });

  //     // console.log("data:",data1, data2);
  //     this.setState({
  //       addComponentDataList: data, addedComponentList: addedComponentData, deletedList: deletedListdData,
  //       addSelectAll: this.valiateCheckAll(addedComponentList),
  //       deleteSelectAll: this.valiateCheckAll(addedComponentList),
  //       addSelectAll: checked, deleteSelectAll: false
  //     });
  //   }



  // }

  // onApproveClick = () => {
  //   //if (this.props.Login.masterData.SelectedSupplier.ntransactionstatus === transactionStatus.DRAFT) {
  //   const ncontrolCode = this.state.controlMap.has("ApproveSupplier") && this.state.controlMap.get("ApproveSupplier").ncontrolcode
  //   let inputData = [];
  //   inputData["userinfo"] = this.props.Login.userInfo;
  //   //add               
  //   let postParam = undefined;
  //   inputData["supplier"] = { "nsuppliercode": this.props.Login.masterData.SelectedSupplier["nsuppliercode"] ? this.props.Login.masterData.SelectedSupplier["nsuppliercode"].Value : "" };
  //   inputData["supplier"] = this.props.Login.masterData.SelectedSupplier;
  //   postParam = { inputListName: "Supplier", selectedObject: "SelectedSupplier", primaryKeyField: "nsuppliercode" };
  //   const inputParam = {
  //     classUrl: 'supplier',
  //     methodUrl: "Supplier",
  //     inputData: inputData,
  //     operation: "approve", postParam
  //   }
  //   let saveType;

  //   const masterData = this.props.Login.masterData;

  //   const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
  //   if (esignNeeded) {
  //     const updateInfo = {
  //       typeName: DEFAULT_RETURN,
  //       data: {
  //         loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "approve"
  //       }
  //     }
  //     this.props.updateStore(updateInfo);
  //   }
  //   else {
  //     this.props.crudMaster(inputParam, masterData, "openModal");
  //   }

  //   // }
  //   // else {
  //   //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOAPPROVE" }));
  //   // }
  // }

  // headerSelectionChange = (event) => {
  //   const checked = event.syntheticEvent.target.checked;
  //   let addComponentDataList = //event.target.props.data 
  //     this.state.addComponentDataList || [];
  //   let addedComponentList = [];


  //   if (checked) {
  //     const data = event.target.props.data.map(item => {
  //       //  const data = addComponentDataList.map(item => {
  //       if (addedComponentList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode) === -1) {


  //         // addedComponentList.push({ ...item, selected: false });
  //         item.selected = checked;
  //         const newItem = JSON.parse(JSON.stringify(item));
  //         newItem["jsondata"] = {}
  //         newItem["jsonuidata"] = {}
  //         delete newItem['selected']
  //         //newItem.selected = false;
  //         newItem["jsondata"]['worklist'] = item
  //         newItem["jsonuidata"]['worklist'] = item
  //         addedComponentList.push(newItem);
  //         //item.selected = false;
  //         return item;
  //       } else {
  //         let olditem = JSON.parse(JSON.stringify(addedComponentList[addedComponentList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode)]))
  //         olditem.selected = checked;
  //         let newItem = JSON.parse(JSON.stringify(olditem));
  //         newItem.selected = false;
  //         newItem["jsondata"] = {};
  //         newItem["jsonuidata"] = {};
  //         delete newItem['selected']
  //         newItem["jsondata"]['worklist'] = olditem
  //         newItem["jsonuidata"]['worklist'] = olditem
  //         addedComponentList.push(newItem);
  //         return olditem;
  //       }

  //     });
  //     this.setState({
  //       addComponentDataList: data, addedComponentList,
  //       // ADDed by Neeraj-ALPD-5136
  //       //WorkList Screen -> Including filter in Data selection Kendo Grid 
  //       addComponentDataListCopy: this.valiateCopy(this.state.addComponentSortedList||[],data||[],addedComponentList||[]) ,
  //       addSelectAll: this.valiateCheckAll(addedComponentList),
  //       deleteSelectAll: this.valiateCheckAll(addedComponentList),
  //       addSelectAll: checked, deleteSelectAll: false
  //     });
  //   }


  //   //   if (checked) {
  //   //     const data = event.dataItems.map(item => {
  //   //         if (addComponentDataList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode) === -1) {
  //   //           addComponentDataList.push({ ...item, selected: false });
  //   //             item.selected = checked;  
  //   //             let newItem = JSON.parse(JSON.stringify(item));
  //   //             newItem.selected = false;
  //   //             newItem["jsondata"]={};
  //   //             newItem["jsonuidata"]={};
  //   //             newItem["jsondata"]['worklist'] = item
  //   //             newItem["jsonuidata"]['worklist'] = item    
  //   //             addedComponentList.push(newItem);
  //   //             return item;
  //   //         } else {
  //   //             let olditem = JSON.parse(JSON.stringify(addComponentDataList[addComponentDataList.findIndex(x => x.ntransactiontestcode === item.ntransactiontestcode)]))
  //   //             olditem.selected = checked;
  //   //             let newItem = JSON.parse(JSON.stringify(olditem));
  //   //             newItem.selected = false;
  //   //             newItem["jsondata"]={};
  //   //             newItem["jsonuidata"]={};
  //   //             newItem["jsondata"]['worklist'] = olditem
  //   //             newItem["jsonuidata"]['worklist'] = olditem
  //   //             addedComponentList.push(newItem);
  //   //             return olditem;

  //   //         }

  //   //     });


  //   //     this.setState({
  //   //       addComponentDataList: data,
  //   //         addedComponentList:addedComponentList,
  //   //         addComponentDataList,
  //   //         addSelectAll: checked,
  //   //         deleteSelectAll: false
  //   //     });
  //   // }
  //   else {
  //     let addedComponentData = this.state.addedComponentList || [];
  //     let deletedListdData = this.state.deletedList || [];

  //     const data = event.target.props.data.map(item => {
  //       addedComponentData = addedComponentData.filter(item1 => item1.npreregno !== item.npreregno);
  //       deletedListdData = deletedListdData.filter(item1 => item1.npreregno !== item.npreregno);
  //       item.selected = checked;
  //       return item;
  //     });

  //     // console.log("data:",data1, data2);
  //     this.setState({
  //       addComponentDataList: data, addedComponentList: addedComponentData, deletedList: deletedListdData,
  //       addSelectAll: this.valiateCheckAll(addedComponentList),
  //       deleteSelectAll: this.valiateCheckAll(addedComponentList),
  //       addSelectAll: checked, deleteSelectAll: false,
  //       addComponentDataListCopy:  this.valiateCopy(this.state.addComponentSortedList||[],data||[],addedComponentData||[])   
  //     });
  //   }



  // }

    // ADDed by Neeraj-ALPD-5136
  //WorkList Screen -> Including filter in Data selection Kendo Grid 
  // addSaveDataGrid = () => {
  //   let filterdata1=this.state.dataState ?process(this.state.addComponentDataListCopy || [], {...this.state.dataState,take:this.state.addComponentDataList.length}).data:[];
  //   let sortListedData1 = filterdata1.filter(x => 
  //    this.state.addedComponentList.some(item => item.ntransactiontestcode === x.ntransactiontestcode)
  //  );
  //  let exists=this.state.dataState && this.state.dataState.filter!==null && this.state.dataState.filter!==undefined ? sortListedData1.length>0 ? true : false :true;
  //   if (this.state.addedComponentList.length > 0 && exists) {
  //     let addComponentSortedList = [];
  //     let   updatedList =[];
  //     let ListedData =[];
  //     let sortListedData=[];
  //     if(this.state.dataState && this.state.dataState.filter!==null && this.state.dataState.filter!==undefined){
  //       let filterdata=process(this.state.addComponentDataListCopy|| this.state.addComponentDataList || [], {...this.state.dataState,take:this.state.addComponentDataList.length}).data;
  //        sortListedData = filterdata.filter(x => 
  //         this.state.addedComponentList.some(item => item.ntransactiontestcode === x.ntransactiontestcode)
  //       );
  //        updatedList = this.state.addComponentDataList.filter(
  //         (item) => !sortListedData.some(
  //           (addedItem) => addedItem.ntransactiontestcode === item.ntransactiontestcode
  //         )
  //       );
  //        updatedList.map(x =>{if(x.selected){ ListedData.push(x)}});

  //     }else{
  //      updatedList = this.state.addComponentDataList.filter(
  //       (item) => !this.state.addedComponentList.some(
  //         (addedItem) => addedItem.ntransactiontestcode === item.ntransactiontestcode
  //       )
  //     );
  //     ListedData=[];
  //     sortListedData= this.state.addedComponentList
  //   }
  //     if (this.state.addComponentSortedList.length > 0) {
  //       this.state.addComponentSortedList.map(item => {
  //         const newItem = JSON.parse(JSON.stringify(item));
  //         newItem["jsondata"] = {}
  //         newItem["jsonuidata"] = {}
  //         newItem["jsondata"]['worklist'] = item
  //         newItem["jsonuidata"]['worklist'] = item
  //         addComponentSortedList.push(newItem)
  //       })
  //     }
  //     sortListedData.map(item => {
  //       const newItem = JSON.parse(JSON.stringify(item));
  //       newItem["jsondata"] = {}
  //       newItem["jsonuidata"] = {}
  //       newItem["jsondata"]['worklist'] = item
  //       newItem["jsonuidata"]['worklist'] = item
  //       addComponentSortedList.push(newItem)
  //     })
  //     this.setState({
  //       addComponentDataList: updatedList, addSelectAll: this.valiateCheckAll(updatedList)
  //       , addComponentSortedList: addComponentSortedList
  //       , addedComponentList: ListedData,
  //       addComponentDataListCopy:this.valiateCopy(addComponentSortedList||[],updatedList||[],ListedData||[]) 
  //     })
  //   } else {
  //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELCETONESAMPLE" }));
  //   }
  // }
  // ADDed by Neeraj-ALPD-5136
  //WorkList Screen -> Including filter in Data selection Kendo Grid 
  // handleClickDelete = (row) => {
  //   let updatedAddList = [];
  //   const ntransactiontestcode = row.dataItem.ntransactiontestcode;
  //   const updatedList = this.state.addComponentSortedList.filter(
  //     (item) => item.ntransactiontestcode !== ntransactiontestcode
  //   );

  //   const exists = this.state.addComponentDataList.some(
  //     (item) => item.ntransactiontestcode === ntransactiontestcode
  //   );
  //   if (!exists) {
  //     updatedAddList = this.state.addComponentDataList.map(item => {
  //       return item
  //     })
  //     updatedAddList.push({ ...row.dataItem, selected: false });
  //   }

  //   this.setState({ addComponentDataList: updatedAddList, 
  //     addComponentSortedList: updatedList , addComponentDataListCopy:this.valiateCopy(updatedList||[],updatedAddList||[])})

  // }


// ADDed by Neeraj-ALPD-5136
  //WorkList Screen -> Including filter in Data selection Kendo Grid 
  // valiateCopy(sortedList,addComponentDataList,addedComponentList){
  //   let addedComponentLists=addedComponentList||this.state.addedComponentList||[];
  //   let listData = this.props.Login.addComponentDataList || [];
  //   let copyingList = listData.filter(item1 => 
  //     !sortedList.some(item2 => item1.ntransactiontestcode === item2.ntransactiontestcode)
  //   ) ||[];
  //   let copyingListData = copyingList.map(item => {
  //     const existsInAddComponentDataList = addedComponentLists.some(
  //       item1 => item1.ntransactiontestcode === item.ntransactiontestcode 
  //     );
     
  //     if(existsInAddComponentDataList){
  //       return {...item,selected: true};
  //     }else{
  //       return {...item,selected: false};
  //     }
     
  //   });
  //   return copyingListData;
  // }




  valiateCheckAll(data) {

    let selectAll = true;

    // let checkRepeatComponent;

    //  let addedComponentList = this.state.addedComponentList || [];

    if (data && data.length > 0) {

      data.forEach(dataItem => {

        if (dataItem.selected) {

          if (dataItem.selected === false) {

            selectAll = false;

          }

        }

        else {

          selectAll = false;

          // checkRepeatComponent=this.state.addComponentDataList.filter(item=>item.npreregno==data.npreregno)

          // if(checkRepeatComponent.length>0){

          //     selectAll = true;

          // }else{

          //     selectAll = false;

          // }

        }

      })

    }

    else {

      //if (gridType === "originalgrid"){

      selectAll = false;

      // }

    }

    return selectAll;

  }


  static getDerivedStateFromProps(props, state) {
    if (props.Login.masterStatus !== "") {
      if (props.Login.errorCode === 417 || props.Login.errorCode === 409) {
        toast.warn(props.Login.masterStatus);
        props.Login.masterStatus = "";
      }
    }
    if (props.Login.error !== state.error) {
      toast.error(props.Login.error);
      props.Login.error = "";
    }
    if (props.Login.selectedRecord === undefined) {
      return { selectedRecord: {} };
    }
    return null;
  }

  validateEsign = () => {
    let modalName = this.props.Login.screenName === "worklistSample" ? "openChildModal" : "openModal";
    const inputParam = {
      inputData: {
        userinfo: {
          ...this.props.Login.userInfo,
          sreason: this.state.selectedRecord["esigncomments"],
        },
        password: this.state.selectedRecord["esignpassword"],
      },
      screenData: this.props.Login.screenData,
    };
    if (this.props.Login.operation === "prepare") {
      this.props.validateEsignforWorklist(inputParam, modalName, this.confirmMessage);
    }
    else {
      this.props.validateEsignCredential(inputParam, modalName);
    }
    // this.props.validateEsignCredential(inputParam, "openModal");

  };



  // onSwitchChange = (item, key, methodUrl) => {
  //   let dataItem = item;
  //   dataItem["ndefaultstatus"] = 3;
  //   const inputParam = {
  //     inputData: {
  //       [key]: dataItem,
  //       userinfo: this.props.userInfo,
  //     },
  //     classUrl: "testmaster",
  //     operation: "setDefault",
  //     methodUrl: methodUrl,
  //   };
  //   this.props.crudMaster(
  //     inputParam,
  //     this.props.masterData,
  //     "openChildModal",
  //     {}
  //   );
  // };

  tabDetail = () => {
    const tabMap = new Map();
    const deleteSecId =
      this.state.controlMap.has("DeleteWorklistSample") &&
      this.state.controlMap.get("DeleteWorklistSample").ncontrolcode;
    const addSampleId =
      this.state.controlMap.has("AddSamples") &&
      this.state.controlMap.get("AddSamples").ncontrolcode;

    const viewSampleId =
      this.state.controlMap.has("ViewWorklistSample") &&
      this.state.controlMap.get("ViewWorklistSample").ncontrolcode;

    tabMap.set(
      "IDS_WORKLISTSAMPLE",
      <WorklistSampleTab
        controlMap={this.state.controlMap}
        userRoleControlRights={this.state.userRoleControlRights}
        dataState={this.state.WorklistSamples}
        selectedWorklist={this.state.WorklistSamples}
        extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
        detailedFieldList={this.gridfillingColumnGridMoreItem(this.state.DynamicGridMoreItem) || []}

        userInfo={this.props.Login.userInfo}
        inputParam={this.props.Login.inputParam}
        deleteRecord={this.DeleteWorklistSample}
        deleteSecId={deleteSecId}
        defaultRecord={this.defaultRecord}
        WorklistSamples={this.state.WorklistSamples || []}
        viewSample={this.viewSample}
        screenName="IDS_WORKLISTSAMPLE"
        selectedRecord={this.state.selectedRecord}
        settings={this.props.Login.settings}
        getWorklistSample={this.props.getWorklistSample}
        masterData={this.props.Login.masterData}
        addSampleId={addSampleId}
        viewSampleId={viewSampleId}
      />

    );
    tabMap.set(
      "IDS_WORKLISTHISTORY",
      <WorklistHistoryTab
        dataState={this.props.Login.masterData.WorklistHistory}
        selectedWorklistHistory={this.props.Login.masterData.WorklistHistory}
        InstrumentSection={this.props.Login.masterData.WorklistHistory || []}
        userInfo={this.props.Login.userInfo}
        //inputParam={this.props.Login.inputParam}
        // deleteRecord={this.DeleteWorklistSample}
        // deleteSecId={deleteSecId}
        // defaultSecId={defaultSecId}
        // defaultRecord={this.defaultRecord}
        controlMap={this.state.controlMap}
        userRoleControlRights={this.state.userRoleControlRights}
        screenName="IDS_WORKLISTHISTORY"
        selectedRecord={this.state.selectedRecord}
        settings={this.props.Login.settings}
      />
    );


    return tabMap;
  };

  shouldComponentUpdate(nextProps, nextState) {
    if ((this.props.Login.openModal || this.props.Login.openChildModal) && nextState.isInitialRender === false &&
        (nextState.addComponentSortedList !== this.state.addComponentSortedList)) {
        return false;
    } else {
        return true;
    }
}

  render() {
    let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
    let mandatoryFields = [];
    // this.feildsForGrid =
    //   [
    //     // { "idsName": "IDS_TEST", "dataField": "stestsynonym", "width": "200px" },       
    //     { "idsName": "IDS_PARAMETER", "dataField": "sparametersynonym", "width": "100px" },
    //     { "idsName": "IDS_RESULT", "dataField": "sfinal", "width": "100px" },
    //     { "idsName": "IDS_GRADE", "dataField": "sgradename", "width": "200px" },
    //   ];

    this.feildsForGrid =
      [
        // { "idsName": "IDS_TEST", "dataField": "stestsynonym", "width": "200px" },
        { "idsName": "IDS_REPORTREFNO", "dataField": "sreportno", "width": "200px" },
        { "idsName": this.props.Login.genericLabel && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "sarno", "width": "200px" },
        { "idsName": this.props.Login.genericLabel && this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "ssamplearno", "width": "200px" },
        { "idsName": "IDS_PARAMETER", "dataField": "sparametersynonym", "width": "200px" },
        { "idsName": "IDS_RESULT", "dataField": "sfinal", "width": "200px" },
        { "idsName": "IDS_GRADE", "dataField": "sgradename", "width": "200px" },
        { "idsName": "IDS_REGISTRATIONDATE", "dataField": "sregdate", "width": "200px" },



      ];
    this.extractedColumnList = [

      //  { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "350px" },
      { "idsName": "IDS_NEWCOMMENTS", "dataField": "scomments", "width": "350px" },
      { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
      { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" },
      { "idsName": "IDS_ACTIONTYPE", "dataField": "sactiontype", "width": "200px" },
      { "idsName": "IDS_MODULENAME", "dataField": "smodulename", "width": "200px" },
      { "idsName": "IDS_FORMNAME", "dataField": "sformname", "width": "200px" },
      { "idsName": "IDS_REASON", "dataField": "spredefinedreason", "width": "200px" },
      { "idsName": "IDS_ESIGNCOMMENTS", "dataField": "sreason", "width": "200px" },


    ]

    // const auditInfoFields = [{ "fieldName": "sarno", "label": "IDS_ARNO" }, 
    // { "fieldName": "spatientid", "label": "IDS_PATIENTID" },   
    // { "fieldName": "sfirstname", "label": "IDS_PATIENTNAME" },
    // { "fieldName": "sage", "label": "IDS_AGE" },
    // { "fieldName": "sgendername", "label": "IDS_GENDER" },
    // { "fieldName": "stestsynonym", "label": "IDS_TEST" },
    // { "fieldName": "sregdate", "label": "IDS_REGISTRATIONDATE" },
    // { "fieldName": "scompletedate", "label": "IDS_COMPLETEDDATEANDTIME" }

    // ];
    const auditInfoFields = [
      { "label": this.props.Login.genericLabel && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "fieldName": "sarno", },
      { "fieldName": "stestsynonym", "label": "IDS_TEST" },
      { "fieldName": "sfirstname", "label": "IDS_PATIENTNAME" },
      { "fieldName": "sgendername", "label": "IDS_GENDER" },


    ];

    if (this.props.Login.screenName === "IDS_WORKLIST") {
      mandatoryFields.push(
        {
          mandatory: true,
          idsName: "IDS_ADDSECTION",
          dataField: "nsectioncode",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        }, {
        mandatory: true,
        idsName: "IDS_TEST",
        dataField: "ntestcode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      }
      );

    }

    const addId =
      this.state.controlMap.has("AddWorklist") &&
      this.state.controlMap.get("AddWorklist").ncontrolcode;
    // const editId =
    //   this.state.controlMap.has("EditWorklist") &&
    //   this.state.controlMap.get("EditWorklist").ncontrolcode;
    const deleteId =
      this.state.controlMap.has("DeleteWorklist") &&
      this.state.controlMap.get("DeleteWorklist").ncontrolcode;

    const approvalId =
      this.state.controlMap.has("GenerateWorklist") &&
      this.state.controlMap.get("GenerateWorklist").ncontrolcode;

    const reportId =
      this.state.controlMap.has("WorklistReport") &&
      this.state.controlMap.get("WorklistReport").ncontrolcode;

    // const addSampleId =
    //   this.state.controlMap.has("AddWorklistSample") &&
    //   this.state.controlMap.get("AddWorklistSample").ncontrolcode;
    // const deleteSampleId =
    // this.state.controlMap.has("DeleteWorklistSample") &&
    // this.state.controlMap.get("DeleteWorklistSample").ncontrolcode;

    const { selectedWorklist } = this.props.Login.masterData;
    const filterParam = {
      inputListName: "Worklist",
      selectedObject: "selectedWorklist",
      primaryKeyField: "nworklistcode",
      fetchUrl: "worklist/getWorklistSample",
      fecthInputObject: { userinfo: this.props.Login.userInfo, ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode },
      masterData: this.props.Login.masterData,
      searchFieldList: this.searchFieldList,

    };
    const filterNameId = this.state.controlMap.has("FilterName") ? this.state.controlMap.get("FilterName").ncontrolcode : -1;
    const filterDetailId = this.state.controlMap.has("FilterDetail") ? this.state.controlMap.get("FilterDetail").ncontrolcode : -1;
    const mandatoryFieldsFilter = [{ "mandatory": true, "idsName": "IDS_FILTERNAME", "dataField": "sfiltername", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]

    const breadCrumbData = this.state.filterData || [];
    return (
      <>
        <div className="client-listing-wrap new-breadcrumb toolbar-top-wrap mtop-4 screen-height-window">
          {breadCrumbData.length > 0 ? (
            <Affix top={53}>
              <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
            </Affix>
          ) : (
            ""
          )}
          <div className='fixed-buttons'>
            <Nav.Link className="btn btn-circle outline-grey mr-2"
              hidden={this.state.userRoleControlRights.indexOf(filterNameId) === -1}
              data-tip={this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" })}
              //onClick={() => this.props.onWorklistApproveClick(this.props.Login.masterData, this.props.Login.userInfo, this.confirmMessage, approvalId)}
              onClick={() => this.openFilterName(filterNameId)}
            >   <SaveIcon width='20px' height='20px' className='custom_icons' /></Nav.Link>

            {
              this.state.userRoleControlRights.indexOf(filterDetailId) !== -1 &&
                this.props.Login.masterData && this.props.Login.masterData.FilterName !== undefined && this.props.Login.masterData.FilterName.length > 0 ?
                <CustomPopover
                  icon={faBolt}
                  nav={true}
                  data={this.props.Login.masterData.FilterName}
                  btnClasses="btn-circle btn_grey ml-2 spacesremovefromaction"
                  //dynamicButton={(value) => this.props.getAcceptTestTestWise(value,testGetParam,this.props.Login.masterData.MJSelectedTest,this.props.Login.userInfo)}
                  dynamicButton={(value) => this.clickFilterDetail(value)}
                  textKey="sfiltername"
                  iconKey="nfiltercode"
                >
                </CustomPopover>
                : ""
            }
          </div>
          <Row noGutters={true}>
            <Col md={`${!this.props.sidebarview ? '4' : "2"}`}>
              <ListMaster
                formatMessage={this.props.intl.formatMessage}
                screenName={"worklist"}
                masterData={this.props.Login.masterData}
                userInfo={this.props.Login.userInfo}
                masterList={
                  this.props.Login.masterData.searchedData ||
                  this.props.Login.masterData.Worklist
                }
                getMasterDetail={(worklist) =>
                  this.props.getWorklistDetail(
                    worklist,
                    this.props.Login.userInfo,
                    this.props.Login.masterData
                  )
                }
                selectedMaster={this.props.Login.masterData.selectedWorklist}
                primaryKeyField="nworklistcode"
                mainField="sworklistno"
                firstField="stestname"
                secondField="ssectionname"
                isIDSField="Yes"
                filterColumnData={this.props.filterColumnData}
                filterParam={filterParam}
                userRoleControlRights={this.state.userRoleControlRights}
                searchRef={this.searchRef}
                addId={addId}
                hideCheckLabel={true}
                hidePaging={false}
                reloadData={this.reloadData}
                openModal={() =>
                  this.props.getSectionAndTest(
                    "IDS_WORKLIST",
                    "create",
                    "nworklistcode",
                    this.props.Login.masterData,
                    this.props.Login.userInfo,
                    addId
                  )
                }
                openFilter={this.openFilter}
                closeFilter={this.closeFilter}
                onFilterSubmit={this.onFilterSubmit}
                showFilterIcon={true}
                showFilter={this.props.Login.showFilter}
                callCloseFunction={true}
                filterComponent={[
                  {
                    IDS_WORKLISTFILTER: (
                      <WorklistPreparationFilter
                        SampleTypeValue={this.props.Login.masterData.defaultSampleTypeValue || {}}
                        RegTypeValue={this.props.Login.masterData.RegTypeValue || {}}
                        RegSubTypeValue={this.props.Login.masterData.RegSubTypeValue || {}}
                        RegSubType={this.state.RegistrationSubTypeList || []}
                        RegType={this.state.RegistrationTypeList || []}
                        userInfo={this.props.Login.userInfo || {}}
                        ApprovalVersion={this.state.ConfigVersionList || []}
                        ApprovalVersionValue={this.props.Login.masterData.defaultApprovalVersionValue || []}

                        //SampleType={this.state.stateSampleType || []}
                        FilterStatusValue={this.props.Login.masterData.FilterStatusValue || {}}
                        FilterStatus={this.state.FilterStatusList || []}
                        RegistrationType={this.state.stateRegistrationType || []}
                        RegistrationSubType={this.state.stateRegistrationSubType || []}
                        fromDate={this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()}
                        toDate={this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()}
                        handleDateChange={this.handleDateChange}
                        onFilterComboChange={this.onFilterComboChange}
                        SampleType={this.state.SampletypeList || []}

                      />
                    ),
                  },
                ]}
              />
            </Col>
            <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
              <div className="sidebar-view-btn-block">
                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                  {!this.props.sidebarview ?
                    <i class="fa fa-less-than"></i> :
                    <i class="fa fa-greater-than"></i>
                  }
                </div>
              </div>
              <Row>
                <Col md={12}>
                  <ContentPanel className="panel-main-content">
                    <Card className="border-0">
                      {this.props.Login.masterData.Worklist && this.props.Login.masterData.Worklist.length > 0 && this.props.Login.masterData.selectedWorklist
                        ? (
                          <>
                            <Card.Header>
                              <Card.Title className="product-title-main">
                                {
                                  this.props.Login.masterData.selectedWorklist
                                    .sworklistno
                                }
                              </Card.Title>
                              <Card.Subtitle>
                                <div className="d-flex product-category">
                                  <h2 className="product-title-sub flex-grow-1">
                                    <MediaLabel className={`btn btn-outlined ${this.props.Login.masterData.selectedWorklist.ntransactionstatus === 83 ? "outline-success" : "outline-secondary"} btn-sm ml-3`}>
                                      {this.props.Login.masterData.selectedWorklist.ntransactionstatus === 83 && <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>}
                                      {this.props.Login.masterData.selectedWorklist.stransdisplaystatus}
                                    </MediaLabel>
                                  </h2>
                                  <div className="d-inline">
                                    {/* <Nav.Link className="btn btn-circle outline-grey mr-2"
                                    data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                    //    data-for="tooltip_list_wrap"
                                    hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                    onClick={() => this.props.getEditSectionAndTest(
                                      "IDS_WORKLIST",
                                      "update",
                                      "nworklistcode",
                                      this.props.Login.masterData,
                                      this.props.Login.userInfo,
                                      editId
                                    )

                                      //"Checklist","nchecklistcode",this.props.Login.masterData.selectedchecklist.nchecklistcode)
                                    }>
                                    <FontAwesomeIcon icon={faPencilAlt} title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                  </Nav.Link> */}


                                    <Nav.Link
                                      name="deleteWorklist"
                                      className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                      data-tip={this.props.intl.formatMessage({
                                        id: "IDS_DELETE",
                                      })}
                                      //   data-for="tooltip_list_wrap"
                                      hidden={
                                        this.state.userRoleControlRights.indexOf(
                                          deleteId
                                        ) === -1
                                      }
                                      onClick={() =>
                                        this.ConfirmDelete(
                                          {
                                            operation: "delete",
                                            screenName: "IDS_WORKLIST",
                                          },
                                          deleteId
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon icon={faTrashAlt} />
                                    </Nav.Link>

                                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                                      hidden={this.state.userRoleControlRights.indexOf(approvalId) === -1}
                                      data-tip={this.props.intl.formatMessage({ id: "IDS_PREPARED" })}
                                      //onClick={() => this.props.onWorklistApproveClick(this.props.Login.masterData, this.props.Login.userInfo, this.confirmMessage, approvalId)}
                                      onClick={() => this.onApproveClick()}
                                    >
                                      {/* <FontAwesomeIcon icon={faThumbsUp} title={this.props.intl.formatMessage({ id: "IDS_PREPARED" })} /> */}
                                      <Closure className="custom_icons" width="18" height="23" />
                                    </Nav.Link>


                                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                                      hidden={this.state.userRoleControlRights.indexOf(reportId) === -1}
                                      data-tip={this.props.intl.formatMessage({ id: "IDS_REPORT" })}
                                      //onClick={() => this.specificationReport(reportId)}
                                      onClick={() => this.props.generateControlBasedReport(reportId, this.props.Login.masterData.selectedWorklist, this.props.Login, "worklist", this.props.Login.masterData.selectedWorklist.nworklistcode)}

                                    >
                                      <Report />
                                      {/* <ReportIcon className="custom_icons" width="17" height="20" /> */}
                                    </Nav.Link>

                                  </div>
                                </div>
                              </Card.Subtitle>
                            </Card.Header>


                            <Card.Body>

                              {selectedWorklist && (
                                <CustomTab
                                  activeKey={this.props.Login.activeKey ? this.props.Login.activeKey : "IDS_WORKLISTSAMPLE"}
                                  tabDetail={this.tabDetail()}
                                  onTabChange={this.onTabChange}
                                />
                              )}
                            </Card.Body>
                          </>
                        ) : (
                          ""
                        )
                      }
                    </Card>
                  </ContentPanel>
                </Col>
              </Row>
            </Col>



          </Row>
        </div>
        {(this.props.Login.openModal || this.props.Login.openChildModal) && (
          <SlideOutModal
            show={this.props.Login.openModal || this.props.Login.openChildModal}
            closeModal={this.closeModal}
            operation={this.props.Login.operation}
            inputParam={this.props.Login.inputParam}
            screenName={this.props.Login.screenName}
            onSaveClick={this.onSaveClick}
            esign={this.props.Login.loadEsign}
            validateEsign={this.validateEsign}
            masterStatus={this.props.Login.masterStatus}
            mandatoryFields={mandatoryFields}
            updateStore={this.props.updateStore}
            selectedRecord={this.state.selectedRecord || {}}
            hideSave={this.props.Login.screenName === "IDS_PREVIOUSRESULTVIEW" ? true : false}
            size={(this.props.Login.screenName === "IDS_PREVIOUSRESULTVIEW" || this.props.Login.screenName === "IDS_WORKLISTSAMPLE") ? "xl" : "lg"}


            addComponent={
              this.props.Login.loadEsign ? (
                <Esign
                  operation={this.props.Login.operation}
                  onInputOnChange={this.onInputOnChange}
                  inputParam={this.props.Login.inputParam}
                  selectedRecord={this.state.selectedRecord || {}}
                />
              )
                : this.props.Login.screenName === "IDS_WORKLIST" ? (
                  <AddWorklistSection
                    //onNumericInputOnChange={this.onNumericInputOnChange}
                    selectedRecord={this.props.Login.selectedRecord || {}}
                    onInputOnChange={this.onInputOnChange}
                    onComboChange={this.onComboChange}
                    SectionValue={this.props.Login.Section}
                    TestValue={this.props.Login.Test}
                    handleDateChange={this.handleDateChange}
                  />
                )


                  : this.props.Login.screenName === "IDS_WORKLISTSAMPLE" ? (
                    <AddWorklistSample
                      selectionChange={this.selectionChange}
                      headerSelectionChange={this.headerSelectionChange}
                      addComponentDataLists={this.state.addComponentDataList || []}
                      addSelectAll={this.state.addSelectAll}
                      //onNumericInputOnChange={this.onNumericInputOnChange}
                      selectedRecord={this.props.Login.selectedRecord || {}}
                      onInputOnChange={this.onInputOnChange}
                      onComboChange={this.onComboChange}
                      TestValue={this.props.Login.Test}
                      userInfo={this.props.Login.userInfo}
                      handleDateChange={this.handleDateChange}
                      dataResult={this.state.dataResult ? this.state.dataResult : process(this.state.addComponentDataList || [], this.state.dataState
                        ? this.state.dataState : { skip: 0, take: 10 })}
                      dataState={this.state.dataState
                        ? this.state.dataState : { skip: 0, take: 10 }}
                      dataStateChangeWorklistSample={this.dataStateChangeWorklistSample}
                      nneedsubsample={this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nneedsubsample}
                      addSaveDataGrid={this.addSaveDataGrid}
                      addComponentSortedList={this.state.addComponentSortedList || []}
                      handleClickDelete={this.handleClickDelete}
                      childDataChange={this.childDataChange}
                    />
                  )
                    : this.props.Login.screenName === "IDS_PREVIOUSRESULTVIEW" ? (
                      <>

                        <Card className='one' >
                          <Card.Body>
                            <SpecificationInfo
                              controlMap={this.state.controlMap}
                              auditInfoFields={auditInfoFields}
                              userRoleControlRights={this.state.userRoleControlRights}
                              selectedSpecification={this.props.Login.masterData.viewdetails}
                              userInfo={this.props.Login.userInfo}
                              selectedNode={this.props.Login.masterData.selectedNode}
                              selectedRecord={this.state.filterData}
                              approvalRoleActionDetail={this.props.Login.masterData.ApprovalRoleActionDetail}
                              screenName="IDS_PREVIOUSRESULTVIEW"

                            />
                          </Card.Body>
                        </Card>
                        <br></br>
                        <DataGrid
                          primaryKeyField={"ntransactiontestcode"}
                          data={this.props.Login.masterData.AuditModifiedComments || []}
                          detailedFieldList={this.feildsForGrid}
                          extractedColumnList={this.feildsForGrid}
                          dataResult={this.props.Login.masterData.AuditModifiedComments && this.props.Login.masterData.AuditModifiedComments.length > 0
                            && process(this.props.Login.masterData.AuditModifiedComments, this.state.dataState ? this.state.dataState : { skip: 0, take: 10 })}
                          //dataState={{ skip: 0, take: 10 }}
                          dataState={this.state.dataState
                            ? this.state.dataState : { skip: 0, take: 10 }}
                          selectionChange={this.selectionChange}
                          headerSelectionChange={this.headerSelectionChange}
                          pageable={true}
                          scrollable={'scrollable'}
                          dataStateChange={this.dataStateChange}

                        />
                      </>
                    ) : (
                      ""
                    )
            }
          />

        )}

        {this.state.showConfirmAlert ? this.confirmAlert() : ""}
        {/* //Ate234 janakumar ALPD-5000 Work List -> To get previously saved filter details when click the filter name 
          //ALPD-4912-To show the add popup to get input of filter name,done by Dhanushya RI
        */}

        {this.props.Login.modalShow ? ( 
          <ModalShow
            modalShow={this.props.Login.modalShow}
            closeModal={this.closeModalShow}
            onSaveClick={this.onSaveModalFilterName}
            validateEsign={this.validateEsign}
            masterStatus={this.props.Login.masterStatus}
            mandatoryFields={mandatoryFieldsFilter}
            updateStore={this.props.updateStore}
            selectedRecord={this.state.selectedRecord || {}}
            modalTitle={this.props.Login.modalTitle}
            modalBody={
              this.props.Login.loadEsign ?
                <Esign
                  operation={this.props.Login.operation}
                  onInputOnChange={this.onEsignInputOnChange}
                  inputParam={this.props.Login.inputParam}
                  selectedRecord={this.state.selectedRecord || {}}
                />
                :
                this.props.Login && this.props.Login.isFilterDetail ?
                <Col md={12}>
                  <FormTextarea
                    label={this.props.intl.formatMessage({ id: "IDS_FILTERNAME" })}
                    name={"sfiltername"}
                    // type="text"
                    onChange={this.onInputOnChange}
                    placeholder={this.props.intl.formatMessage({ id: "IDS_FILTERNAME" })}
                    value={this.state.selectedRecord ? this.state.selectedRecord.sfiltername : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={"50"}
                  />
                </Col>
                :""
            }
          />
        )
          : (
            ""
          )}
      </>
    );
  }

  	//Ate234 janakumar ALPD-5000 Work List -> To get previously saved filter details when click the filter name
  clickFilterDetail = (value) => {
    //  if(this.props.Login.nfilternamecode!==value.nfilternamecode){
    this.searchRef.current.value = "";
    this.props.Login.change = false
    let masterData = this.props.Login.masterData
    let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)

    let inputData = {
      userinfo: this.props.Login.userInfo,
      FromDate: obj.fromDate,
      ToDate: obj.toDate,
      nfilternamecode: value && value.nfilternamecode ? value.nfilternamecode : -1,
      npreregno: "0",
      sampletypecode: (this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode) || -1,
      regtypecode: parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
      regsubtypecode: parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
      approvalconfigurationcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
      napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : -1,
      userinfo: this.props.Login.userInfo,
      designtemplatcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
      //ntranscode: this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus,         
      ntranscode: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatusValue.ntransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
    }
    const inputParam = {
      masterData, inputData

    }
    this.props.getWorklistFilterDetails(inputParam);
    // }
    // else{
    //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDFILTERALREADYLOADED" }));  
    // }
  }

  //ALPD-4878 To open the save popup of filtername,done by Dhanushya RI
  //Ate234 janakumar ALPD-5000 Work List -> To get previously saved filter details when click the filter name
  openFilterName = () => {
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { modalShow: true, operation: "create", isFilterDetail: true, modalTitle: this.props.intl.formatMessage({ id: "IDS_SAVEFILTER" }) }
    }
    this.props.updateStore(updateInfo);
  }

		//Ate234 janakumar ALPD-5000 Work List -> To get previously saved filter details when click the filter name
  onSaveModalFilterName = () => {
    let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)

    const masterData = this.props.Login.masterData;

    let inputData = {
      userinfo: this.props.Login.userInfo,
      dfrom: obj.fromDate,
      dto: obj.toDate,
      sfiltername: this.state.selectedRecord && this.state.selectedRecord.sfiltername !== null
        ? this.state.selectedRecord.sfiltername : "",
      sampleTypeValue: this.props.Login.masterData && this.props.Login.masterData.RealSampleTypeValue,
      regTypeValue: this.props.Login.masterData && this.props.Login.masterData.realRegTypeValue,
      regSubTypeValue: this.props.Login.masterData && this.props.Login.masterData.realRegSubTypeValue,
      filterStatusValue: this.props.Login.masterData && this.props.Login.masterData.RealFilterStatusValue,
      approvalConfigValue: this.props.Login.masterData && this.props.Login.masterData.realApprovalVersionValue,
      designTemplateMappingValue: this.props.Login.masterData && this.props.Login.masterData.realDesignTemplateMappingValue,
      npreregno: "0",
      nsampletypecode: (this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode) || -1,
      nregtypecode: parseInt(this.props.Login.masterData.realRegTypeValue && this.props.Login.masterData.realRegTypeValue.nregtypecode) || -1,
      nregsubtypecode: parseInt(this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode) || -1,
      //ntranscode: ((this.props.Login.masterData.realFilterStatusValue && this.props.Login.masterData.realFilterStatusValue.ntransactionstatus !== undefined) || this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) + ',' + String(transactionStatus.worklist) : "-1",
      // ntranscode: this.props.Login.masterData.FilterStatusValue
      //  && (this.props.Login.masterData.FilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join("'",",",",") : "'",this.props.Login.masterData.FilterStatusValue.ntransactionstatus,"'"),
      // //ntranscode: this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus,         
      ntransactionstatusfilter: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatus.map(item => `${item.ntransactionstatus}`).join(","):`${this.props.Login.masterData.FilterStatusValue.ntransactionstatus}`,
      ntranscode: this.props.Login.masterData.FilterStatusValue.ntransactionstatus === 0 ? this.props.Login.masterData.FilterStatusValue.ntransactionstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
      napprovalconfigcode: this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigcode || -1 : null,
      napproveconfversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode : -1,
      userinfo: this.props.Login.userInfo,
      ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
      needExtraKeys: true,
    }

    let inputParam = {
      classUrl: this.props.Login.inputParam.classUrl,
      methodUrl: "FilterName",
      inputData: inputData,
      operation: this.props.Login.operation,
    };
    if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
      && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
      ) {

      this.props.crudMaster(inputParam, masterData, "modalShow");


    } else {
      toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
    }
  }


  onTabChange = (tabProps) => {
    const screenName = tabProps.screenName;
    if (screenName == "IDS_WORKLISTHISTORY") {
      let inputData = {
        masterData: this.props.Login.masterData,
        userInfo: this.props.Login.userInfo,
        nworklistcode: this.props.Login.masterData.selectedWorklist.nworklistcode
      }
      this.props.getWorklisthistoryAction(inputData, true);
    } else {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: { screenName, activeKey: "IDS_WORKLISTSAMPLE" }
      }

      this.props.updateStore(updateInfo);

    }
  };


  // dataStateChange = (event) => {
  //   this.setState({
  //     dataResult: process(
  //       this.props.Login.masterData["selectedSection"],
  //       event.dataState
  //     ),
  //     sectionDataState: event.dataState,
  //   });
  // };







  reloadData = () => {
    this.searchRef.current.value = "";
    this.props.Login.masterData.searchedData = undefined;
    let obj = convertDateValuetoString(this.props.Login.masterData.fromdate, this.props.Login.masterData.todate, this.props.Login.userInfo)
    let realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
    let realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);

    let defaultSampleTypeValue = this.props.Login.masterData.defaultSampleTypeValue
    let defaultRegTypeValue = this.props.Login.masterData.defaultRegTypeValue
    let defaultRegSubTypeValue = this.props.Login.masterData.defaultRegSubTypeValue
    let defaultFilterStatusValue = this.props.Login.masterData.defaultFilterStatusValue
    let defaultApprovalVersionValue = this.props.Login.masterData.defaultApprovalVersionValue
    let defaultApprovalVersion = this.props.Login.masterData.defaultApprovalVersionValue
    let masterData = { ...this.props.Login.masterData, realFromDate, realToDate, defaultSampleTypeValue, defaultRegTypeValue, defaultRegSubTypeValue, defaultFilterStatusValue, defaultApprovalVersionValue }
    let inputData = {
      nsampletypecode: (this.props.Login.masterData.defaultSampleTypeValue && this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode) || -1,
      nregtypecode: parseInt(this.props.Login.masterData.defaultRegTypeValue && this.props.Login.masterData.defaultRegTypeValue.nregtypecode) || -1,
      nregsubtypecode: parseInt(this.props.Login.masterData.defaultRegSubTypeValue && this.props.Login.masterData.defaultRegSubTypeValue.nregsubtypecode) || -1,
      //  ntransactionstatus: (this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus) || -1,
      ntransactionstatus: (this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus) || -1,

      userinfo: this.props.Login.userInfo,
      napprovalconfigversioncode: (this.props.Login.masterData.defaultApprovalVersionValue && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) || -1,

    }
    if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1 && inputData.napprovalconfigversioncode !== -1 && inputData.ntransactionstatus !== "-1") {

      inputData['fromdate'] = obj.fromDate;
      inputData['todate'] = obj.toDate;
      inputData['ndesigntemplatemappingcode'] = this.props.Login.masterData.ndesigntemplatemappingcode;
      let inputParam = {
        masterData,
        inputData,
        searchTestRef: this.searchTestRef,
        skip: this.state.skip,
        take: this.state.take,
        testskip: this.state.testskip,
        testtake: this.state.testtake,
        isClearSearch: this.props.Login.isClearSearch,


      }
      this.props.getWorklistDetailFilter(inputParam)
    } else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
    }
  };



  ConfirmDelete = (operation, deleteId) => {
    this.confirmMessage.confirm(
      "deleteMessage",
      this.props.intl.formatMessage({ id: "IDS_DELETE" }),
      this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
      this.props.intl.formatMessage({ id: "IDS_OK" }),
      this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
      () =>
        this.DeleteWorklist(
          operation,
          deleteId,
          operation.screenName ? operation.screenName : "IDS_WORKLIST"
        )
    );
  };



  DeleteWorklist = (operation, ncontrolCode) => {
    let inputData = [];

    inputData["worklist"] = this.props.Login.masterData.selectedWorklist;
    inputData["userinfo"] = this.props.Login.userInfo;
    let obj = convertDateValuetoString(this.props.Login.masterData.fromdate, this.props.Login.masterData.todate, this.props.Login.userInfo)
    inputData['fromdate'] = obj.fromDate;
    inputData['todate'] = obj.toDate;
    inputData['ndesigntemplatemappingcode'] = this.props.Login.masterData.ndesigntemplatemappingcode;
    inputData["napprovalconfigversioncode"] = (this.props.Login.masterData.defaultApprovalVersionValue && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode)
    inputData["ntransactionstatus"] = (this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus) || -1
    const postParam = {
      inputListName: "Worklist",
      selectedObject: "selectedWorklist",
      primaryKeyField: "nworklistcode",
      primaryKeyValue:
        this.props.Login.masterData.selectedWorklist.nworklistcode,
      fetchUrl: "worklist/getWorklistSelectSample",
      fecthInputObject: { userinfo: this.props.Login.userInfo, ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode, nneedsampleandhistory: transactionStatus.YES },
    };

    const inputParam = {
      methodUrl: "Worklist",
      postParam,
      classUrl: this.props.Login.inputParam.classUrl,
      inputData: inputData,
      operation: operation.operation,
    };
    const masterData = this.props.Login.masterData;
    if (
      showEsign(
        this.props.Login.userRoleControlRights,
        this.props.Login.userInfo.nformcode,
        ncontrolCode
      )
    ) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true,
          screenData: { inputParam, masterData },
          openModal: true,
          screenName: "Worklist",
          operation: operation.operation,
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.props.crudMaster(inputParam, masterData, "openModal");
    }

  };



  onApproveClick = () => {


    //onClick={() => this.props.onWorklistApproveClick(this.props.Login.masterData, this.props.Login.userInfo, this.confirmMessage, approvalId)}
    //if (this.props.Login.masterData.SelectedSupplier.ntransactionstatus === transactionStatus.DRAFT) {
    const ncontrolCode = this.state.controlMap.has("GenerateWorklist") && this.state.controlMap.get("GenerateWorklist").ncontrolcode
    let inputData = [];
    inputData["userinfo"] = this.props.Login.userInfo;
    const masterData = this.props.Login.masterData;
    // //add               
    let postParam = undefined;
    inputData["worklist"] = masterData.selectedWorklist;
    inputData["ncontrolCode"] = ncontrolCode;
    inputData["ndesigntemplatemappingcode"] = masterData.ndesigntemplatemappingcode;
    inputData["ntransactionstatus"] = (this.props.Login.masterData.defaultFilterStatusValue && this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.defaultFilterStatusValue.ntransactionstatus) || -1;

    // inputData["supplier"] = this.props.Login.masterData.SelectedSupplier;
    postParam = {
      inputListName: "Worklist",
      selectedObject: "selectedWorklist",
      primaryKeyField: "nworklistcode",
      primaryKeyValue:
        this.props.Login.masterData.selectedWorklist.nworklistcode,
      fetchUrl: "worklist/getWorklistSelectSample",
      fecthInputObject: { userinfo: this.props.Login.userInfo, ndesigntemplatemappingcode: this.props.Login.masterData.ndesigntemplatemappingcode, nneedsampleandhistory: transactionStatus.YES },
    };
    const inputParam = {
      classUrl: 'worklist',
      methodUrl: "Worklist",
      inputData: inputData,
      operation: "prepare", postParam
    }
    let saveType;



    const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
    if (esignNeeded) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "prepare", screenName: "Worklist"
        }
      }
      this.props.updateStore(updateInfo);
    }
    else {
      //this.props.crudMaster(inputParam, masterData, "openModal");
      this.props.onWorklistApproveClick(this.props.Login.masterData, this.props.Login.userInfo, this.confirmMessage, ncontrolCode)
    }


  }



  onComboChange = (comboData, fieldName, caseNo) => {
    const selectedRecord = this.state.selectedRecord || {};

    if (comboData !== null) {
      switch (caseNo) {
        case 1:
          if (selectedRecord[fieldName] && selectedRecord[fieldName].value !== comboData.value) {
            delete selectedRecord["ntestcode"]
          }
          selectedRecord[fieldName] = comboData;
          //this.setState({selectedRecord});
          this.props.getSectionbaseTest(selectedRecord, this.props.Login.userInfo, this.props.Login.masterData, this.props.Login.ncontrolCode)
          break;
        default:
          break;
      }
    }
    else {
      if (selectedRecord["nsectioncode"]) {
        delete selectedRecord["nsectioncode"];
        delete selectedRecord["nusercode"];

      }
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: { selectedRecord }
      }
      this.props.updateStore(updateInfo);
    }
  };

  closeModal = () => {
    let loadEsign = this.props.Login.loadEsign;
    let openModal = this.props.Login.openModal;
    let modalShow = this.props.Login.modalShow;
    let selectedRecord = this.props.Login.selectedRecord;
    let openChildModal = this.props.Login.openChildModal;
   // let isFilterDetail = this.props.Login.isFilterDetail;

    if (this.props.Login.loadEsign) {
      if ((this.props.Login.operation.operation ? this.props.Login.operation.operation : this.props.Login.operation) === "delete") {
        loadEsign = false;
        openModal = false;
        openChildModal = false;
        selectedRecord = {};
      } else {
        loadEsign = false;
        // selectedRecord["agree"] = transactionStatus.NO;
        selectedRecord['esignpassword'] = ""
        selectedRecord['esigncomments'] = ""
        selectedRecord['esignreason'] = ""
		//ALPD-5674--Added by Vignesh R(10-04-2025)-->ETICA Worklist --> Blank page occurs when cancel the esign.
        modalShow = false;
        openModal = false;
        openChildModal = false;

      }
    } else {
      openModal = false;
      modalShow = false;
    //  isFilterDetail=false;
      openChildModal = false;
      selectedRecord = {};
    }

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { openModal, modalShow, loadEsign, selectedRecord, selectedId: null, openChildModal },
    };
    this.props.updateStore(updateInfo);
  };



  viewSample = (viewdetails) => {
    //let openModal = this.props.Login.openModal;
    //let openModal = true;
    //let screenName = 'IDS_VIEWDETAILS'

    this.props.ViewSampleDetails(this.props.Login.masterData, "IDS_PREVIOUSRESULTVIEW", this.props.Login.userInfo, viewdetails);
  };

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

  componentDidUpdate(previousProps) {
    let updateState = false;
    let {
      selectedRecord, addedComponentList,
      userRoleControlRights,
      controlMap,
      filterData,
      nfilterInstrumentCategory,
      filterInstrumentCategory, RegistrationSubTypeList, FilterStatusList, SampletypeList,
      RegistrationTypeList, DynamicGridItem, DynamicGridMoreItem, ConfigVersionList, subsampleGridItem, sampleGridItem, testGridItem = [], samplegridmoreitem, testGridItems
      , addSelectAll, deleteSelectAll } = this.state;
    if (
      this.props.Login.selectedRecord !== previousProps.Login.selectedRecord
    ) {
      selectedRecord = this.props.Login.selectedRecord;
      updateState = true;
    }
    if (
      this.props.Login.userInfo.nformcode !==
      previousProps.Login.userInfo.nformcode
    ) {
      userRoleControlRights = [];
      if (this.props.Login.userRoleControlRights) {
        this.props.Login.userRoleControlRights[
          this.props.Login.userInfo.nformcode
        ] &&
          Object.values(
            this.props.Login.userRoleControlRights[
            this.props.Login.userInfo.nformcode
            ]
          ).map((item) => userRoleControlRights.push(item.ncontrolcode));
      }
      controlMap = getControlMap(
        this.props.Login.userRoleControlRights,
        this.props.Login.userInfo.nformcode
      );
      updateState = true;
    }
    if (this.props.Login.masterData !== previousProps.Login.masterData) {
      const RegistrationSubTypeListMap = constructOptionList(this.props.Login.masterData.RegistrationSubType || [], "nregsubtypecode", "sregsubtypename", "nsorter", 'ascending', 'nregsubtypecode', false);
      RegistrationSubTypeList = RegistrationSubTypeListMap.get("OptionList");

      const RegistrationTypeListMap = constructOptionList(this.props.Login.masterData.RegistrationType || [], "nregtypecode", "sregtypename", "nsorter", 'ascending', 'nregtypecode', false);
      RegistrationTypeList = RegistrationTypeListMap.get("OptionList");

      const FilterStatusListMap = constructOptionList(this.props.Login.masterData.FilterStatus || [], "ntransactionstatus", "stransdisplaystatus", undefined, undefined, false);
      FilterStatusList = FilterStatusListMap.get("OptionList");

      const SampletypeListMap = constructOptionList(this.props.Login.masterData.SampleType || [], "nsampletypecode", "ssampletypename", 'ascending', 'nsampletypecode', false);
      SampletypeList = SampletypeListMap.get("OptionList");
      const ConfigVersionListMap = constructOptionList(this.props.Login.masterData.ApprovalConfigVersion || [], "napprovalconfigversioncode", "sversionname", 'descending', 'ntransactionstatus', false);
      ConfigVersionList = ConfigVersionListMap.get("OptionList");
      nfilterInstrumentCategory = this.state.nfilterInstrumentCategory || {};
      addSelectAll = false;
      deleteSelectAll = true;
      if (
        this.props.Login.masterData.SelectedInsCat &&
        this.props.Login.masterData.SelectedInsCat !==
        previousProps.Login.masterData.SelectedInsCat
      ) {
        nfilterInstrumentCategory = {
          label: this.props.Login.masterData.SelectedInsCat.stestsynonym,
          value: this.props.Login.masterData.SelectedInsCat.ntestcode,
          item: this.props.Login.masterData.SelectedInsCat,
        };
      }
      filterData = this.generateBreadCrumData();
      updateState = true;
    }

    if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
      const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)


      testGridItem[0] = dynamicColumn.testListFields.releasetestfields[0] ? dynamicColumn.testListFields.releasetestfields[0] : [];
      sampleGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem : [];
      subsampleGridItem = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];
      testGridItems = dynamicColumn.testListFields.testlistitem ? dynamicColumn.testListFields.testlistitem : [];
      //testGridItem= dynamicColumn.conditionfields ? dynamicColumn.conditionfields : [];

      DynamicGridItem = [...sampleGridItem, ...subsampleGridItem, ...testGridItems.slice(1), ...testGridItem]
      samplegridmoreitem = dynamicColumn.samplegridmoreitem ? dynamicColumn.samplegridmoreitem : [];
      DynamicGridMoreItem = [...samplegridmoreitem]
      //DynamicGridItem.push(dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [])
    }


    if (
      this.props.Login.masterData.filterInstrumentCategory !==
      previousProps.Login.masterData.filterInstrumentCategory
    ) {
      const insCategoryMap = constructOptionList(
        this.props.Login.masterData.filterInstrumentCategory || [],
        "ntestcode",
        "stestsynonym",
        "ntestcategorycode",
        "ascending",
        false
      );
      filterInstrumentCategory = insCategoryMap.get("OptionList");
      if (insCategoryMap.get("DefaultValue")) {
        nfilterInstrumentCategory = insCategoryMap.get("DefaultValue");
      } else if (
        filterInstrumentCategory &&
        filterInstrumentCategory.length > 0
      ) {
        nfilterInstrumentCategory = filterInstrumentCategory[0];
      }
      updateState = true;
    }


    // let updateState = false;
    let updateStateObject = {};
    if (this.props.Login.addedComponentList !== previousProps.Login.addedComponentList) {

      addSelectAll = false;
      deleteSelectAll = true;

      this.setState({
        addedComponentList: this.props.Login.addedComponentList,
        addSelectAll, deleteSelectAll
      });
    }

    if (this.props.addedComponentList !== previousProps.addedComponentList) {
      // this.setState({ addedComponentList : this.props.addedComponentList});
      updateState = true;
      updateStateObject = { ...updateStateObject, addedComponentList: this.props.addedComponentList };
    }

    if (this.props.Login.dataState !== previousProps.Login.dataState) {
      if (this.props.Login.dataState) {
        delete (this.props.Login.dataState.filter)
        delete (this.props.Login.dataState.sort)
        this.setState({ dataState: this.props.Login.dataState });
      }
    }

    if (this.props.Login.masterData.addComponentDataList !== previousProps.Login.masterData.addComponentDataList) {
      this.setState({ addComponentDataList: this.props.Login.masterData.addComponentDataList });
    }
    if (this.props.Login.addComponentSortedList !== previousProps.Login.addComponentSortedList) {
      this.setState({ addComponentSortedList: this.props.Login.addComponentSortedList,isInitialRender:true });
    }
    //ADDed by Neeraj-ALPD-5136
    //WorkList Screen -> Including filter in Data selection Kendo Grid
    if (this.props.Login.masterData.WorklistSamples !== previousProps.Login.masterData.WorklistSamples) {
      let worklistSamplesList = this.props.Login.masterData.WorklistSamples || []
      let updatedSortedList = worklistSamplesList.sort((a, b) => {
        const A = a.nworklistsamplecode;
        const B = b.nworklistsamplecode; // Corrected from 'a' to 'b'

        return A - B; // Sort in ascending order
      });
      this.setState({ WorklistSamples: updatedSortedList });
    }


    if (updateState) {
      this.setState({
        selectedRecord,
        userRoleControlRights,
        controlMap,
        filterData,
        nfilterInstrumentCategory,
        filterInstrumentCategory, RegistrationSubTypeList, FilterStatusList, SampletypeList,
        RegistrationTypeList, DynamicGridItem, ConfigVersionList, DynamicGridMoreItem, addSelectAll, deleteSelectAll
      });
    }
  }

  generateBreadCrumData() {
    //obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)

    const breadCrumbData = [];
    if (this.props.Login.masterData && this.props.Login.masterData.Worklist) {
      const obj = convertDateValuetoString(this.props.Login.masterData.fromdate, this.props.Login.masterData.todate, this.props.Login.userInfo)

      breadCrumbData.push({

        "label": "IDS_FROM",
        "value": obj.breadCrumbFrom
      }, {
        "label": "IDS_TO",
        "value": obj.breadCrumbto
      },
        // {
        //   "label": "IDS_SAMPLETYPE",
        //   "value": this.props.Login.masterData.defaultSampleTypeValue ? this.props.Login.masterData.defaultSampleTypeValue.ssampletypename || "NA" :
        //     this.props.Login.masterData.defaultSampleTypeValue ? this.props.Login.masterData.defaultSampleTypeValue.ssampletypename || "NA" : "NA"
        // },
        {
          "label": "IDS_REGTYPE",
          "value": this.props.Login.masterData.defaultRegTypeValue ? this.props.Login.masterData.defaultRegTypeValue.sregtypename || "NA" :
            this.props.Login.masterData.defaultRegTypeValue ? this.props.Login.masterData.defaultRegTypeValue.sregtypename || "NA" : "NA"
        }, {
        "label": "IDS_REGSUBTYPE",
        "value": this.props.Login.masterData.defaultRegSubTypeValue ? this.props.Login.masterData.defaultRegSubTypeValue.sregsubtypename || "NA" :
          this.props.Login.masterData.defaultRegSubTypeValue ?
            this.props.Login.masterData.defaultRegSubTypeValue.sregsubtypename : "NA"
      },

        // {
        //   "label": "IDS_CONFIGVERSION",
        //   "value": this.props.Login.masterData.defaultApprovalVersion ?
        //     this.props.Login.masterData.defaultApprovalVersion.sversionname || "NA" :
        //     this.props.Login.masterData.defaultApprovalVersion ? this.props.Login.masterData.defaultApprovalVersion.sversionname || "NA" : "NA"
        // },


        {
          "label": "IDS_WORKLISTSTATUS",
          "value": this.props.Login.masterData.defaultFilterStatusValue ?
            this.props.Login.masterData.defaultFilterStatusValue.stransdisplaystatus || "NA" :
            this.props.Login.masterData.defaultFilterStatusValue ?
              this.props.Login.masterData.defaultFilterStatusValue.stransdisplaystatus || "NA" : "NA"
        }
        //];
      );
    }
    return breadCrumbData;
  }

  openFilter = () => {
    let showFilter = !this.props.Login.showFilter;
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { showFilter },
    };
    this.props.updateStore(updateInfo);
  };

  closeFilter = () => {
    let inputValues = {
      RegistrationSubType: this.props.Login.masterData.realRegistrationSubTypeList || [],
      RegistrationType: this.props.Login.masterData.realRegistrationTypeList || [],
      FilterStatus: this.props.Login.masterData.realFilterStatusList || [],
      SampleType: this.props.Login.masterData.realSampleTypeList || [],
      ApprovalConfigVersion: this.props.Login.masterData.realApprovalConfigVersionList || [],
      FilterStatusValue: this.props.Login.masterData.RealFilterStatusValue || {},
      ApprovalVersionValue: this.props.Login.masterData.realApprovalVersionValue || {},
      RegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue || {},
      RegTypeValue: this.props.Login.masterData.realRegTypeValue || {},
      SampleTypeValue: this.props.Login.masterData.RealSampleTypeValue || {},
      fromDate: this.props.Login.masterData.fromdate || new Date(),// ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date(),
      toDate: this.props.Login.masterData.todate || new Date(),// ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date(),
      defaultSampleTypeValue: this.props.Login.masterData.RealSampleTypeValue || {},
      defaultApprovalVersionValue: this.props.Login.masterData.realApprovalVersionValue || {},

    }
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { showFilter: false, masterData: { ...this.props.Login.masterData, ...inputValues } },
    };
    this.props.updateStore(updateInfo);
  };

  //Ate234 janakumar ALPD-5000 Work List -> To get previously saved filter details when click the filter name
  onFilterSubmit = () => {
    this.searchRef.current.value = "";

    this.props.Login.masterData.searchedData = undefined;
    let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)

    let realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
    let realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);
    let fromdate = this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date();
    let todate = this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date();

    let defaultSampleTypeValue = this.props.Login.masterData.defaultSampleTypeValue
    let defaultRegTypeValue = this.props.Login.masterData.RegTypeValue
    let defaultRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue
    let defaultFilterStatusValue = this.props.Login.masterData.FilterStatusValue
    let defaultApprovalVersion = this.props.Login.masterData.defaultApprovalVersionValue
    let RealSampleTypeValue = this.props.Login.masterData.defaultSampleTypeValue
    let realApprovalVersionValue = this.props.Login.masterData.defaultApprovalVersionValue
    let realRegTypeValue = this.props.Login.masterData.RegTypeValue
    let realRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue
    let RealFilterStatusValue = this.props.Login.masterData.FilterStatusValue
    let realApprovalConfigVersionList = this.props.Login.masterData.ApprovalConfigVersion
    let realFilterStatusList = this.props.Login.masterData.FilterStatus
    let realRegistrationTypeList = this.props.Login.masterData.RegistrationType
    let realRegistrationSubTypeList = this.props.Login.masterData.RegistrationSubType
    let masterData = {
      ...this.props.Login.masterData, realFromDate, realToDate,
      defaultSampleTypeValue, defaultRegTypeValue, defaultRegSubTypeValue, defaultFilterStatusValue, defaultApprovalVersion,
      fromdate, todate, RealSampleTypeValue, realApprovalVersionValue, realRegTypeValue, realRegSubTypeValue, RealFilterStatusValue, realApprovalConfigVersionList,
      realFilterStatusList, realRegistrationTypeList, realRegistrationSubTypeList
    };

    let inputData = {
      //npreregno: "0",
      nsampletypecode: (this.props.Login.masterData.defaultSampleTypeValue && this.props.Login.masterData.defaultSampleTypeValue.nsampletypecode) || -1,
      nregtypecode: parseInt(this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode) || -1,
      nregsubtypecode: parseInt(this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode) || -1,
      //ntransactionstatus: (this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus) || -1,
      ntransactionstatus: this.props.Login.masterData.FilterStatusValue
        && (this.props.Login.masterData.FilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus),

      ntranscode: this.props.Login.masterData.FilterStatusValue
        && (this.props.Login.masterData.FilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus.map(item => item.ntransactionstatus).join(",") : this.props.Login.masterData.FilterStatusValue.ntransactionstatus),
      napprovalconfigversioncode: (this.props.Login.masterData.defaultApprovalVersionValue && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) || -1,
      napprovalversioncode: (this.props.Login.masterData.defaultApprovalVersionValue && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) || -1,
      userinfo: this.props.Login.userInfo,
      needExtraKeys: true,
      saveFilterSubmit:true,
      nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
      sampleTypeValue:this.props.Login.masterData.defaultSampleTypeValue && this.props.Login.masterData.defaultSampleTypeValue,
      regTypeValue:this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue,
      regSubTypeValue:this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue,
      filterStatusValue:this.props.Login.masterData && this.props.Login.masterData.RealFilterStatusValue,
      approvalConfigValue: this.props.Login.masterData && this.props.Login.masterData.realApprovalVersionValue,
      designTemplateMappingValue: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
      napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode ? String(this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode) : -1,



    }
    if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1 && inputData.napprovalconfigversioncode !== -1
      && inputData.ntranscode !== "-1") {

      inputData['fromdate'] = obj.fromDate;
      inputData['todate'] = obj.toDate;
      inputData['ndesigntemplatemappingcode'] = this.props.Login.masterData.ndesigntemplatemappingcode;
      let inputParam = {
        masterData,
        inputData,
        searchTestRef: this.searchTestRef,
        skip: this.state.skip,
        take: this.state.take,
        testskip: this.state.testskip,
        testtake: this.state.testtake,


      }
      this.props.getWorklistDetailFilter(inputParam)
    } else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
    }

  }
  childDataChange = (addComponentSortedList) => {
    this.setState({
        addComponentSortedList: addComponentSortedList,
        isInitialRender: false
    });
} 
}

export default connect(mapStateToProps, {
  callService,
  crudMaster,
  getWorklistDetail,
  filterColumnData,
  getSectionAndTest,
  updateStore,
  validateEsignCredential,
  onWorklistApproveClick,
  OpenDate,
  CloseDate, viewAttachment, getInstrumentCombo, getWorklistSample, getRegTypeTestWise, getRegTypeWorklist,
  getSectionbaseTest, getWorklistDetailFilter, getEditSectionAndTest, createWorklistCreation, getConfigVersionTestWise,
  ViewSampleDetails, getWorklisthistoryAction, reportWorklist, getRegSubTypeWise, insertWorklist,
  generateControlBasedReport, validateEsignforWorklist, getWorklistFilterDetails
})(injectIntl(WorkList));
