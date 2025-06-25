import React, { Component } from "react";
import { Row, Col, Card, Nav, FormGroup, FormLabel } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPencilAlt, faThumbsUp, faUserTimes, faCloudDownloadAlt, faCheckCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as ReportEdit } from '../../assets/image/report-edit.svg';

import { injectIntl } from "react-intl";
import {
  callService, crudMaster, validateEsignCredential, updateStore, changeProjectTypeFilter, filterColumnData,
  viewAttachment, addProjectMaster, ReportInfo, getProjectMaster, getProjectmasterAddMemberService, addProjectMasterFile, getuserComboServices,
  getClientByCategory, getQuotationByClient, closureProjectMaster, modalSave, projectMasterModal,getAvailableQuotation,
  validateEsignforModal,getActiveProjectQuotationById
} from "../../actions";

import ListMaster from "../../components/list-master/list-master.component";
import { transactionStatus } from "../../components/Enumeration";
import AddProjectMaster from "../../pages/project/AddProjectMaster";
import ReportInfoProject from "../../pages/project/ReportInfoProject";
import ProjectMasterTab from "../../pages/project/ProjectMasterTab";
import ProjectMasterClosure from "../../pages/project/ProjectMasterClosure";
import { DEFAULT_RETURN } from "../../actions/LoginTypes";
import SlideOutModal from "../../components/slide-out-modal/SlideOutModal";

import Esign from "../audittrail/Esign";
import { showEsign, getControlMap, constructOptionList, formatInputDate, onDropAttachFileList, deleteAttachmentDropZone, create_UUID, rearrangeDateFormatDateOnly, Lims_JSON_stringify, replaceBackSlash }
  from "../../components/CommonScript";
import { ReadOnlyText, ContentPanel } from "../../components/App.styles";
import { process } from "@progress/kendo-data-query";
import ConfirmMessage from "../../components/confirm-alert/confirm-message.component";
import BreadcrumbComponent from "../../components/Breadcrumb.Component";
import { Affix } from "rsuite";
import ProjectMasterFilter from './ProjectMasterFilter';
import { ReactComponent as Closure } from '../../assets/image/cancel-close-svgrepo-com.svg';
import { intl } from "../../components/App";
import ModalShow from "../../components/ModalShow";
import AddCompletionDate from "../../pages/project/AddCompletionDate";
import ProjectMasterRetire from "../../pages/project/ProjectMasterRetire";
import AddProjectInfoPreview from "../../pages/project/AddProjectInfoPreview";
import ViewInfoDetails from "../../components/ViewInfoDetails";
import {ReactComponent as RetireaQuotation} from '../../assets/image/RetireaQuotation.svg';


const mapStateToProps = (state) => {
  return { Login: state.Login };
};

class ProjectMaster extends Component {
  constructor(props) {
    super(props);
    const dataState = {
      skip: 0,
      take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
    };
    const projectQuotationDataState = {
      skip: 0,
      take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
    };
    this.state = {
      selectedRecord: {},
      error: "",
      userRoleControlRights: [],
      selectedProjectMaster: undefined,
      controlMap: new Map(),
      Instrument: [],
      dataState,
      sidebarview: false,
      projectQuotationDataState
    };
    this.searchRef = React.createRef();
    this.searchFieldList = ["sprojectcode", "sprojectname", "sprojecttitle", "suserrolename", "susername", "srfwdate", "sprojectstartdate", "sprojectdescription", "sversionstatus", "sfilename", "sclosureremarks", "sprojectduration"]
    this.confirmMessage = new ConfirmMessage();
  }
  sidebarExpandCollapse = () => {
    this.setState({
      sidebarview: true
    })
  }

  handleDateChange = (dateName, dateValue) => {
    const { selectedRecord } = this.state;
    selectedRecord[dateName] = dateValue;
    this.setState({ selectedRecord });
  };


  onSaveModalClick = () => {
    if (this.props.Login.masterData.SelectedProjectMaster && this.props.Login.masterData.SelectedProjectMaster.ntransactionstatus === transactionStatus.APPROVED) {
      const completeId = this.state.controlMap.has("CompleteProjectMaster") && this.state.controlMap.get("CompleteProjectMaster").ncontrolcode;
      const retireId = this.state.controlMap.has("RetireProjectMaster") && this.state.controlMap.get("RetireProjectMaster").ncontrolcode;

      let inputData = [];
      let inputParam = [];
      let projectMasterData = [];

      const postParam = {
        inputListName: "ProjectMaster",
        selectedObject: "SelectedProjectMaster",
        primaryKeyField: "nprojectmastercode",
        primaryKeyValue: this.props.Login.masterData.SelectedProjectMaster.nprojectmastercode,
        fetchUrl: "projectmaster/getProjectMaster",
        fecthInputObject: { userinfo: this.props.Login.userInfo },
      };

      if (this.props.Login.screenName === "IDS_PROJECTCOMPLETION") {
        if (this.state.selectedRecord["dprojectcompletiondate"]) {
          projectMasterData["dtransactiondate"] = formatInputDate(this.state.selectedRecord["dprojectcompletiondate"], false);
        }
        projectMasterData["ntransdatetimezonecode"] = this.props.Login.userInfo.ntimezonecode ? this.props.Login.userInfo.ntimezonecode : "-1";

        inputParam = {
          methodUrl: "ProjectMaster",
          classUrl: this.props.Login.inputParam.classUrl,
          inputData: {
            "userinfo": this.props.Login.userInfo,
            "projectmaster": { ...this.props.Login.masterData.SelectedProjectMaster, "dtransactiondate": projectMasterData["dtransactiondate"], "scompletionremarks": this.state.selectedRecord.scompletionremarks === undefined ? "" : this.state.selectedRecord.scompletionremarks, "ntransdatetimezonecode": projectMasterData["ntransdatetimezonecode"] }
          },
          operation: this.props.Login.operation,
          modalShow: false, postParam,
          selectedRecord: { ...this.state.selectedRecord }
        }


      }


      // console.log("inputData",inputData["projectmaster"]);


      if (this.props.Login.screenName === "IDS_RETIREDPROJECT") {
        if (this.state.selectedRecord["dprojectretiredate"]) {
          projectMasterData["dtransactiondate"] = formatInputDate(this.state.selectedRecord["dprojectretiredate"], false);
        }
        projectMasterData["ntransdatetimezonecode"] = this.props.Login.userInfo.ntimezonecode ? this.props.Login.userInfo.ntimezonecode : "-1";

        inputParam = {
          classUrl: this.props.Login.inputParam.classUrl,
          methodUrl: "ProjectMaster",
          inputData: {
            "userinfo": this.props.Login.userInfo,
            "projectmaster": { ...this.props.Login.masterData.SelectedProjectMaster, "dtransactiondate": projectMasterData["dtransactiondate"], "sretiredremarks": this.state.selectedRecord.sretiredremarks === undefined ? "" : this.state.selectedRecord.sretiredremarks, "ntransdatetimezonecode": projectMasterData["ntransdatetimezonecode"] }
          },
          operation: this.props.Login.operation, postParam,
          isClearSearch: this.props.Login.isClearSearch,
          selectedRecord: { ...this.state.selectedRecord },
          modalShow: false
        }
      }



      const masterData = this.props.Login.masterData;

      if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            loadEsign: true, screenData: { inputParam, masterData },
            operation: this.props.Login.operation,
            // loadEsign: true, screenData: { inputParam, masterData },
            modalShow: false,
            openModal: true, screenName: this.props.Login.screenName === "IDS_PROJECTCOMPLETION" ? "IDS_PROJECTCOMPLETION" : "IDS_RETIREDPROJECT", operation: this.props.Login.operation,
          }
        }
        this.props.updateStore(updateInfo);
      }
      else {
        this.props.modalSave(inputParam, masterData);
      }
    }
    else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }));
    }

  };




  handleProjectMasterModal = (selectedProjectMaster, modalShowdata, controId) => {

    //const completeId = this.state.controlMap.has("CompleteProjectMaster") && this.state.controlMap.get("CompleteProjectMaster").ncontrolcode;
    //  const editId = this.state.controlMap.has("EditProjectMaster") && this.state.controlMap.get("EditProjectMaster").ncontrolcode;


    if (selectedProjectMaster.ntransactionstatus === transactionStatus.APPROVED) {

      if (modalShowdata === "ProjectCompletion") {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            screenName: "IDS_PROJECTCOMPLETION",
            modalShow: true,
            operation: "complete",
            ncontrolCode: controId,
            selectedRecord: {
              "dprojectcompletiondate": new Date()
            }
          },
        };
        this.props.updateStore(updateInfo);

      }
      else {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            screenName: "IDS_RETIREDPROJECT",
            modalShow: true,
            operation: "retire",
            ncontrolCode: controId,
            selectedRecord: {
              "dprojectretiredate": new Date()
            }
          },

        };
        this.props.updateStore(updateInfo);


      }
    } else {

      toast.warn(intl.formatMessage({ id: "IDS_SELECTAPPROVEVERSION" }));

    }

  };


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

    let projectMasterData = [];
    let inputParam = {};
    projectMasterData["userinfo"] = this.props.Login.userInfo;
    let clearSelectedRecordField =[];

    let postParam = {
      inputListName: "ProjectMaster",
      selectedObject: "SelectedProjectMaster",
      primaryKeyField: "nprojectmastercode",

    };

    if ((this.props.Login.operation === "update") && (this.props.Login.screenName === "IDS_PROJECTMASTER")) {

      postParam["primaryKeyValue"] =
        this.props.Login.masterData.SelectedProjectMaster.nprojectmastercode;

      projectMasterData["projectMaster"] = {
        nprojectmastercode: this.props.Login.masterData.SelectedProjectMaster.nprojectmastercode,
        //     nprojecttypecode:this.state.selectedRecord.nprojecttypecode.value,
        sprojecttitle: this.state.selectedRecord.sprojecttitle,
        sprojectcode: this.state.selectedRecord.sprojectcode,
        sprojectname: this.state.selectedRecord.sprojectname,
        sprojectdescription: this.state.selectedRecord.sprojectdescription,
        srfwid: this.state.selectedRecord.srfwid,

        // drfwdate: formatInputDate(this.state.selectedRecord["drfwdate"],false),
        // dprojectstartdate: formatInputDate(this.state.selectedRecord["dprojectstartdate"],false),
        //     nstudydirectorcode:this.state.selectedRecord.nstudydirectorcode.value,
        //     nteammembercode: this.state.selectedRecord.nteammembercode.value,
        //     nperiodcode: this.state.selectedRecord.nperiodcode.value,
        nprojectduration: this.state.selectedRecord.nprojectduration,
        ntransactionstatus: this.props.Login.masterData.SelectedProjectMaster.ntransactionstatus,


      };

    } else if ((this.props.Login.operation === "create") && (this.props.Login.screenName === "IDS_PROJECTMASTER")) {

      projectMasterData["projectMaster"] = {

        nsitecode: this.props.Login.userInfo.nmastersitecode,
        sprojecttitle: this.state.selectedRecord.sprojecttitle,
        sprojectname: this.state.selectedRecord.sprojectname,
        sprojectcode: this.state.selectedRecord.sprojectcode === undefined ? "-" : this.state.selectedRecord.sprojectcode,
        sprojectdescription: this.state.selectedRecord.sprojectdescription === undefined ? "" : this.state.selectedRecord.sprojectdescription,
        nprojectduration: parseInt(this.state.selectedRecord.nprojectduration),
        //  ntransactionstatus: this.props.Login.masterData.SelectedProjectMaster.ntransactionstatus
        ntransactionstatus: transactionStatus.DRAFT,
        sfilename: this.state.selectedRecord.sfilename === undefined ? "" : this.state.selectedRecord.sfilename,
        sclosureremarks: this.state.selectedRecord.sclosureremarks === undefined ? "" : this.state.selectedRecord.sclosureremarks,
        sretiredremarks: this.state.selectedRecord.sretiredremarks === undefined ? "" : this.state.selectedRecord.sclosureremarks,
        scompletionremarks: this.state.selectedRecord.scompletionremarks === undefined ? "" : this.state.selectedRecord.scompletionremarks,
        srfwid: this.state.selectedRecord.srfwid === undefined ? "" : this.state.selectedRecord.srfwid,

      };
      clearSelectedRecordField =[
        { "idsName": "IDS_PROJECTTITLE", "dataField": "sprojecttitle", "width": "200px" ,"controlType": "textbox","isClearField":true},
        { "idsName": "IDS_PROJECTCODE", "dataField": "sprojectcode", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_PROJECTNAME", "dataField": "sprojectname", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_PROJECTDESCRIPTION", "dataField": "sprojectdescription", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_RFWID", "dataField": "srfwid", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_PROJECTDURATION", "dataField": "nprojectduration", "width": "200px","controlType": "textbox","isClearField":true },
        
        //{ "idsName": "IDS_DEFAULT", "dataField": "ndefaultstatus", "width": "100px","isClearField":true,"preSetValue":4},
        
    ]
      /*     this.projectMasterFieldList.map((item) => {
             return (projectMasterData["projectMaster"][item] = this.state.selectedRecord[item] == "" || this.state.selectedRecord[item] == undefined ?
             undefined :this.state.selectedRecord[item]);
           }); */
    }

    if (((this.props.Login.operation === "create") || (this.props.Login.operation === "update")) && (this.props.Login.screenName === "IDS_PROJECTMASTER")) {

      projectMasterData["projectMaster"]["nprojecttypecode"] = this.state.selectedRecord["nprojecttypecode"] ? this.state.selectedRecord["nprojecttypecode"].value
        : transactionStatus.NA;

      projectMasterData["projectMaster"]["nuserrolecode"] = this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value
        : transactionStatus.NA;

      projectMasterData["projectMaster"]["nusercode"] = this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value
        : transactionStatus.NA;

      // projectMasterData["projectMaster"]["nteammembercode"] = this.state.selectedRecord["nteammembercode"] ? this.state.selectedRecord["nteammembercode"].value
      //   : transactionStatus.NA;

      projectMasterData["projectMaster"]["nperiodcode"] = this.state.selectedRecord["nperiodcode"] ? this.state.selectedRecord["nperiodcode"].value
        : transactionStatus.NA;

      projectMasterData["projectMaster"]["nclientcatcode"] = this.state.selectedRecord["nperiodcode"] ? this.state.selectedRecord["nclientcatcode"].value
        : transactionStatus.NA;

      projectMasterData["projectMaster"]["nclientcode"] = this.state.selectedRecord["nclientcode"] ? this.state.selectedRecord["nclientcode"].value
        : transactionStatus.NA;

      projectMasterData["projectMaster"]["nquotationcode"] = this.state.selectedRecord["nquotationcode"] ? this.state.selectedRecord["nquotationcode"].value
        : transactionStatus.NA;

      projectMasterData["projectMaster"]["nautoprojectcode"] = parseInt(this.props.Login.settings[31]) === transactionStatus.YES ? transactionStatus.YES : transactionStatus.NO;
     // projectMasterData["projectMaster"]["needjsontemplate"] = parseInt(this.props.Login.settings[29]) === transactionStatus.YES ? transactionStatus.YES : transactionStatus.NO;


      // if (this.state.selectedRecord["drfwdate"] || this.state.selectedRecord["dprojectstartdate"]) {
      //   if (this.props.Login.operation === "create") {

      if (this.state.selectedRecord["drfwdate"]) {
        projectMasterData["projectMaster"]["drfwdate"] = formatInputDate(this.state.selectedRecord["drfwdate"], false);

      }

      if (this.state.selectedRecord["dexpectcompletiondate"]) {
        projectMasterData["projectMaster"]["dexpectcompletiondate"] = formatInputDate(this.state.selectedRecord["dexpectcompletiondate"], false);
      }
      if (this.state.selectedRecord["dprojectcompletiondate"]) {
        projectMasterData["projectMaster"]["dprojectcompletiondate"] = formatInputDate(this.state.selectedRecord["dprojectcompletiondate"], false);
      }
      if (this.state.selectedRecord["dretiredate"]) {
        projectMasterData["projectMaster"]["dprojectretiredate"] = formatInputDate(this.state.selectedRecord["dprojectretiredate"], false);
      }
      if (this.state.selectedRecord["dprojectclosuredate"]) {
        projectMasterData["projectMaster"]["dprojectclosuredate"] = formatInputDate(this.state.selectedRecord["dprojectclosuredate"], false);
      }

      //projectMasterData["projectMaster"]["drfwdate"] = this.state.selectedRecord["drfwdate"]? formatInputDate(this.state.selectedRecord["drfwdate"], false):"";
      projectMasterData["projectMaster"]["dprojectstartdate"] = formatInputDate(this.state.selectedRecord["dprojectstartdate"], false);
      projectMasterData["projectMaster"]["ntzrfwdate"] = projectMasterData.userinfo.ntimezonecode ? projectMasterData.userinfo.ntimezonecode : "-1";
      projectMasterData["projectMaster"]["ntzprojectstartdate"] = projectMasterData.userinfo.ntimezonecode ? projectMasterData.userinfo.ntimezonecode : "-1";

      projectMasterData["projectMaster"]["ntzrfwdate"] = projectMasterData.userinfo.ntimezonecode ? projectMasterData.userinfo.ntimezonecode : "-1";
      projectMasterData["projectMaster"]["ntzexpectcompletiondate"] = projectMasterData.userinfo.ntimezonecode ? projectMasterData.userinfo.ntimezonecode : "-1";
      projectMasterData["projectMaster"]["ntzprojectcompletiondate"] = projectMasterData.userinfo.ntimezonecode ? projectMasterData.userinfo.ntimezonecode : "-1";
      projectMasterData["projectMaster"]["ntzprojectretiredate"] = projectMasterData.userinfo.ntimezonecode ? projectMasterData.userinfo.ntimezonecode : "-1";
      projectMasterData["projectMaster"]["ntzprojectclosuredate"] = projectMasterData.userinfo.ntimezonecode ? projectMasterData.userinfo.ntimezonecode : "-1";

      //   }
      //   else {

      //     projectMasterData["projectMaster"]["drfwdate"] = formatInputDate(this.state.selectedRecord["drfwdate"],false);
      //     projectMasterData["projectMaster"]["dprojectstartdate"] = formatInputDate(this.state.selectedRecord["dprojectstartdate"],false);

      //   }
      // }
    }

    if ((this.props.Login.operation === "create") && (this.props.Login.screenName === "IDS_ADDMEMBERS")) {
      projectMasterData["ProjectMember"] = {};
      projectMasterData["ProjectMember"]["nusercode"] = this.state.selectedRecord["nusercode"][0] ? this.state.selectedRecord["nusercode"][0].value
        : transactionStatus.NA;
      projectMasterData["ProjectMember"]["nprojectmastercode"] = this.props.Login.masterData.SelectedProjectMaster.nprojectmastercode;
    }



    if (((this.props.Login.operation === "create") || (this.props.Login.operation === "update")) && (this.props.Login.screenName === "IDS_PROJECTMASTER")) {

      inputParam = {
        classUrl: "projectmaster",
        methodUrl: "ProjectMaster",
        inputData: projectMasterData,
        operation: this.props.Login.operation,
        saveType,
        formRef,
        postParam,
        searchRef: this.searchRef,
        isClearSearch: this.props.Login.isClearSearch,
        selectedRecord: { ...this.state.selectedRecord }

      };
    }/* else if (((this.props.Login.operation === "create") || (this.props.Login.operation === "update")) && (this.props.Login.screenName === "IDS_PROJECTMASTER")) {

      inputParam = {
        classUrl: "projectmaster",
        methodUrl: "ProjectMember",
        inputData: projectMasterData,
        operation: this.props.Login.operation,
        saveType,
        formRef,
        postParam,
        searchRef: this.searchRef,
        isClearSearch: this.props.Login.isClearSearch,
      }
    } */

    // if ((this.props.Login.operation === "create") && (this.props.Login.screenName === "IDS_PROJECTCLOSURE")) {

    //   inputParam = this.onSaveProjectMasterClosureFile(saveType, formRef);

    // }

    if (
      //(this.props.Login.operation === "update") &&
      (this.props.Login.screenName === "IDS_REPORTINFOPROJECT")) {
      inputParam = this.onSaveReportInfoProject(saveType, formRef);

    }

    const masterData = this.props.Login.masterData;

    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true,
          screenData: { inputParam, masterData },
          saveType,
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      
      if(this.props.Login.screenName === "IDS_PROJECTMASTER")
      {
        this.props.crudMaster(inputParam, masterData, "openModal","","",clearSelectedRecordField);
      }
      else
      {
         this.props.crudMaster(inputParam, masterData, "openModal");
      }
    }

  };

  onNumericInputOnChange = (value, name) => {
    const selectedRecord = this.state.selectedRecord || {};
    selectedRecord[name] = value;
    this.setState({ selectedRecord });
  };

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
    let modalName;
    const inputParam = {
      inputData: {
        "userinfo": {
          ...this.props.Login.userInfo,
          sreason: this.state.selectedRecord["esigncomments"],
          nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
          spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

        },
        password: this.state.selectedRecord["esignpassword"]
      },
      screenData: this.props.Login.screenData
    }
    if ((this.props.Login.screenName === "IDS_PROJECTCOMPLETION" || this.props.Login.screenName === "IDS_RETIREDPROJECT")) {
      this.props.validateEsignforModal(inputParam);

    } else {
      this.props.validateEsignCredential(inputParam, "openModal");

    }
  }


  onSaveProjectMasterClosureFile = (saveType, formRef) => {

    const selectedRecord = this.state.selectedRecord;
    const acceptedFiles = selectedRecord.sfilename;

    let projectmasterclosureFile = {};
    let projectmasterclosureFileArray = [];

    const formData = new FormData();
    const dtransactiondate = [];
    const tempData = Object.assign({}, projectmasterclosureFile);
    let postParam = {
      inputListName: "ProjectMaster",
      selectedObject: "SelectedProjectMaster",
      primaryKeyField: "nprojectmastercode",

    };
    postParam["primaryKeyValue"] = this.props.Login.masterData.SelectedProjectMaster.nprojectmastercode;

    if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
      acceptedFiles.forEach((file, index) => {

        const splittedFileName = file.name.split('.');
        const fileExtension = file.name.split('.')[splittedFileName.length - 1];
        const uniquefilename = create_UUID() + '.' + fileExtension;
        tempData["ssystemfilename"] = uniquefilename;
        tempData["sfilename"] = Lims_JSON_stringify(file.name ? file.name : "", false);
        // tempData["sclosureremarks"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.sclosureremarks ? selectedRecord.sclosureremarks.trim() : ""),false)  ;

        formData.append("uploadedFile" + index, file);
        formData.append("uniquefilename" + index, uniquefilename);


      });
    }
    tempData["sclosureremarks"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sclosureremarks ? selectedRecord.sclosureremarks.trim() : ""), false);

    tempData["nprojectmastercode"] = this.props.Login.masterData.SelectedProjectMaster.nprojectmastercode;
    tempData["ntransactionstatus"] = this.props.Login.masterData.SelectedProjectMaster.ntransactionstatus;
    tempData["nprojecttypecode"] = this.props.Login.masterData.SelectedProjectMaster.nprojecttypecode;
    tempData["sprojecttitle"] = Lims_JSON_stringify(this.props.Login.masterData.SelectedProjectMaster.sprojecttitle, false);
    tempData["sprojectcode"] = Lims_JSON_stringify(this.props.Login.masterData.SelectedProjectMaster.sprojectcode, false);
    tempData["ntransdatetimezonecode"] = this.props.Login.userInfo.ntimezonecode ? this.props.Login.userInfo.ntimezonecode : "-1";

    projectmasterclosureFileArray.push(tempData);



    dtransactiondate["dtransactiondate"] = formatInputDate(this.state.selectedRecord["dprojectclosuredate"], false);

    // dtransactiondate["ntransdatetimezonecode"] =  this.props.Login.userInfo.ntimezonecode ? this.props.Login.userInfo.ntimezonecode : "-1";

    formData.append("dtransactiondate", dtransactiondate["dtransactiondate"]);

    formData.append("ntransdatetimezonecode", dtransactiondate["ntransdatetimezonecode"]);

    formData.append("projectmaster", JSON.stringify(projectmasterclosureFileArray[0]));
    formData.append("filecount", acceptedFiles && acceptedFiles.length);


    const closureId = this.state.controlMap.has("ClosureProjectMaster") && this.state.controlMap.get("ClosureProjectMaster").ncontrolcode;

    let selectedId = null;


    // if (this.props.Login.operation === "create") {
    //   // edit
    //   postParam = { inputListName: "ProjectMaster", selectedObject: "SelectedProjectMaster", primaryKeyField: "nprojectmastercode",isSingleGet:true};
    //   selectedId = selectedRecord["nprojectmastercode"];
    // }
    const inputParam = {
      inputData: {
        "userinfo": {
          ...this.props.Login.userInfo,
          sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
          smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
          //ALPD-1826(while saving the file and link,audit trail is not captured the respective language)
          slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
        }
      },
      formData: formData,

      isFileupload: true,
      operation: "closure",
      classUrl: "projectmaster",
      saveType, formRef, methodUrl: "ProjectMasterFile", postParam,
      searchRef: this.searchRef,
      // openClosureModal:false,
      ncontrolcode: closureId
    }

    const masterData = this.props.Login.masterData;

    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true, screenData: { inputParam, masterData },
          screenName: "IDS_PROJECTCLOSURE", operation: this.props.Login.operation
        }
      }
      this.props.updateStore(updateInfo);

    } else {
      this.props.closureProjectMaster(inputParam, masterData);
    }

    // return inputParam;
  }

  DeleteProjectMaster = (methodUrl, selectedProjectMaster, operation, ncontrolCode) => {
    const postParam = {
      inputListName: "ProjectMasterList",
      selectedObject: "SelectedProjectMaster",
      primaryKeyField: "nprojectmastercode",
      primaryKeyValue: selectedProjectMaster.nprojectmastercode,
      fetchUrl: "projectmaster/getActiveProjectMasterById",
      fecthInputObject: { userinfo: this.props.Login.userInfo },
    };

    const inputParam = {
      classUrl: this.props.Login.inputParam.classUrl,
      methodUrl,
      postParam,
      inputData: {
        userinfo: this.props.Login.userInfo,
        projectmaster: selectedProjectMaster,
      },
      operation,
      isClearSearch: this.props.Login.isClearSearch,
      selectedRecord: { ...this.state.selectedRecord }

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
          screenName: "IDS_PROJECTMASTER",
          operation,
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.props.crudMaster(inputParam, masterData, "openModal");
    }
  };

  deleteAttachment = (event, file, fieldName) => {
    let selectedRecord = this.state.selectedRecord || {};
    selectedRecord[fieldName] = deleteAttachmentDropZone(
      selectedRecord[fieldName],
      file
    );

    this.setState({
      selectedRecord,
      actionType: "delete",
    });
  };

  onSaveReportInfoProject = (saveType, formRef) => {
    let postParam = undefined;
    let inputData = [];
    const selectedRecord = this.state.selectedRecord;
    postParam = {
      inputListName: "ProjectMaster",
      selectedObject: "SelectedProjectMaster",
      primaryKeyField: "nprojectmastercode",
    };
    inputData["reportinfoproject"] = {};
    inputData["reportinfoproject"]["nprojectmastercode"] = this.props.Login.masterData.SelectedProjectMaster.nprojectmastercode;
    inputData["reportinfoproject"]["nprojecttypecode"] = this.props.Login.masterData.SelectedProjectType.nprojecttypecode;
    inputData["reportinfoproject"]["sreporttemplateversion"] = selectedRecord.sreporttemplateversion;
    inputData["reportinfoproject"]["srevision"] = selectedRecord.srevision;
    inputData["reportinfoproject"]["srevisionauthor"] = selectedRecord.srevisionauthor;
    inputData["reportinfoproject"]["sintroduction"] = selectedRecord.sintroduction;
    inputData["reportinfoproject"]["stestproductheadercomments"] = selectedRecord.stestproductheadercomments;
    inputData["reportinfoproject"]["stestproductfootercomments1"] = selectedRecord.stestproductfootercomments1;
    inputData["reportinfoproject"]["stestproductfootercomments2"] = selectedRecord.stestproductfootercomments2;
    inputData["reportinfoproject"]["stestproductfootercomments3"] = selectedRecord.stestproductfootercomments3;
    inputData["reportinfoproject"]["stestproductfootercomments4"] = selectedRecord.stestproductfootercomments4;
    inputData["reportinfoproject"]["ssamplingdetails"] = selectedRecord.ssamplingdetails;
    inputData["reportinfoproject"]["suncertainitymeasurement"] = selectedRecord.suncertainitymeasurement;
    inputData["reportinfoproject"]["nreporttemplatecode"] = this.state.selectedRecord["nreporttemplatecode"] ? this.state.selectedRecord["nreporttemplatecode"].value
      : transactionStatus.NA;
    inputData["userinfo"] = this.props.Login.userInfo;
    let dataState = this.state.dataState;


    const inputParam = {
      classUrl: this.props.Login.inputParam.classUrl,
      methodUrl: "ReportInfoProject",
      displayName: this.props.Login.screenName,
      inputData: inputData,
      selectedId: this.state.selectedRecord["nprojectmastercode"],
      operation: "update", saveType, formRef, dataState,
      searchRef: this.searchRef,
      postParam: postParam
    }
    return inputParam;


    // this.fieldprojectreportinfoList.map(item => {
    //     return inputData["projectreportinfo"][item] = selectedRecord[item] !== null ? selectedRecord[item] : "";
    // })
  }

  render() {


    let versionStatusCSS = "outline-secondary";
    let activeIconCSS = "fa fa-check"


    if (this.props.Login.masterData.SelectedProjectMaster && this.props.Login.masterData.SelectedProjectMaster.ntransactionstatus === transactionStatus.APPROVED) {
      versionStatusCSS = "outline-success";
    }
    else if (this.props.Login.masterData.SelectedProjectMaster && ((this.props.Login.masterData.SelectedProjectMaster.ntransactionstatus === transactionStatus.RETIRED) || (this.props.Login.masterData.SelectedProjectMaster.ntransactionstatus === transactionStatus.CLOSED))) {
      versionStatusCSS = "outline-danger";
      activeIconCSS = "";
    }
    else if (this.props.Login.masterData.SelectedProjectMaster && this.props.Login.masterData.SelectedProjectMaster.ntransactionstatus === transactionStatus.DRAFT) {
      activeIconCSS = "";

    }

    if (this.props.Login.openModal) {
      this.mandatoryFields = this.findMandatoryFields(this.props.Login.screenName, this.state.selectedRecord, this.props.Login.operation)
    }

    //console.log("master main", this.props.Login.masterData);
    // let mandatoryFields = [];
    const { userInfo } = this.props.Login;
    const addId = this.state.controlMap.has("AddProjectMaster") && this.state.controlMap.get("AddProjectMaster").ncontrolcode;
    const editId = this.state.controlMap.has("EditProjectMaster") && this.state.controlMap.get("EditProjectMaster").ncontrolcode;
    const deleteId = this.state.controlMap.has("DeleteProjectMaster") && this.state.controlMap.get("DeleteProjectMaster").ncontrolcode;
    const approveId = this.state.controlMap.has("ApproveProjectMaster") && this.state.controlMap.get("ApproveProjectMaster").ncontrolcode;
    const completeId = this.state.controlMap.has("CompleteProjectMaster") && this.state.controlMap.get("CompleteProjectMaster").ncontrolcode;
    const viewId = this.state.controlMap.has("ViewProjectMaster") && this.state.controlMap.get("ViewProjectMaster").ncontrolcode;
    // const addteammembersId = this.state.controlMap.has("AddTeamMembers") && this.state.controlMap.get("AddTeamMembers").ncontrolcode;
    const retireId = this.state.controlMap.has("RetireProjectMaster") && this.state.controlMap.get("RetireProjectMaster").ncontrolcode;
    const closureId = this.state.controlMap.has("ClosureProjectMaster") && this.state.controlMap.get("ClosureProjectMaster").ncontrolcode;
    // const deleteteammembersId = this.state.controlMap.has("DeleteTeammembers") && this.state.controlMap.get("DeleteTeammembers").ncontrolcode;

    const viewClosureFileId = this.state.controlMap.has("ViewProjectMasterClosureFile") && this.state.controlMap.get("ViewProjectMasterClosureFile").ncontrolcode;
    const reportdetailId = this.state.controlMap.has("ReportInfoProject") && this.state.controlMap.get("ReportInfoProject").ncontrolcode;
    const fieldsForGrid = [

      { "idsName": "IDS_LOGINID", "dataField": "sloginid", "width": "200px" },
      { "idsName": "IDS_USER", "dataField": "steammembername", "width": "200px" }

    ]


    const { SelectedProjectMaster } = this.props.Login.masterData;
    const selectedMaster = this.props.Login.masterData.SelectedProjectMaster;
    const selectedProjectMaster = this.props.Login.masterData.SelectedProjectMaster;

    const filterParam = {
      inputListName: "ProjectMaster",
      selectedObject: "SelectedProjectMaster",
      primaryKeyField: "nprojectmastercode",
      fetchUrl: "projectmaster/getActiveProjectMasterById",
      fecthInputObject: { userinfo: this.props.Login.userInfo },
      masterData: this.props.Login.masterData,
      searchFieldList: this.searchFieldList,
    };
    const breadCrumbData = this.state.filterData || [];
    return (
      <>
        <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
          {breadCrumbData.length > 0 ? (
            <Affix top={53}>
              <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
            </Affix>
          ) : (
            ""
          )}
          <Row noGutters={true}>
            <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
              <ListMaster
                screenName={this.props.intl.formatMessage({ id: "IDS_PROJECTMASTER" })}
                masterData={this.props.Login.masterData}
                userInfo={this.props.Login.userInfo}
                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.ProjectMaster}
                getMasterDetail={(ProjectMasterdata) => this.props.getProjectMaster(ProjectMasterdata, this.props.Login.userInfo, this.props.Login.masterData)}
                selectedMaster={selectedProjectMaster}
                primaryKeyField="nprojectmastercode"
                mainField="sprojecttitle"
                firstField="sprojectcode"
                secondField="sversionstatus"
                filterColumnData={this.props.filterColumnData}
                filterParam={filterParam}
                userRoleControlRights={this.state.userRoleControlRights}
                addId={addId}
                searchRef={this.searchRef}
                reloadData={this.reloadData}
                //     openModal={() => this.props.addProjectMaster("create", SelectedProjectMaster, userInfo, addId, this.state.ProjectMasterList)}
                openModal={() => this.props.addProjectMaster("create", SelectedProjectMaster, userInfo, addId, this.state.selectedRecordfilter, this.props.Login.masterData.SelectedProjectType)}
                isMultiSelecct={false}
                hidePaging={false}
                isClearSearch={this.props.Login.isClearSearch}

                openFilter={this.openFilter}
                closeFilter={this.closeFilter}
                onFilterSubmit={this.onFilterSubmit}
                showFilterIcon={true}
                showFilter={this.props.Login.showFilter}
                filterComponent={[
                  {
                    "IDS_PROJECTMASTERFILTER":
                      <ProjectMasterFilter
                        filterProjectType={this.state.ProjectMasterList || []}
                        nfilterProjectType={this.props.Login.masterData.SelectedProjectType || {}}
                        onComboChange={this.onComboChange}
                        selectedRecord={this.state.selectedRecordfilter || {}}
                      />
                  }
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
              {selectedProjectMaster ?
                <ContentPanel className="panel-main-content">
                  <Card className="border-0">
                    <Card.Header>
                      {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                      <Card.Title className="product-title-main">
                        {selectedProjectMaster.sprojecttitle}
                      </Card.Title>
                      <Card.Subtitle>
                        <div className="d-flex product-category">
                          <h2 className="product-title-sub flex-grow-1">

                            <span className={`btn btn-outlined ${versionStatusCSS} btn-sm ml-3`}>
                              <i class={activeIconCSS}></i>
                              {selectedProjectMaster.sversionstatus}

                            </span>
                          </h2>
                          {/* </Col>
                                                <Col md="4"> */}
                          {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                          <div className="d-inline">
                            {/* Don't delete these commented lines because additional info feature is needed for Agaram LIMS */}
                            {/* Start Here */}
                            {/* <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="" >  
                                                            <FontAwesomeIcon icon={faEye} className="ActionIconColor" onClick={(e)=>this.viewAdditionalInfo(e)} />
                                                        </Nav.Link> */}
                            {/* End Here */}
                            <ViewInfoDetails 
                                userInfo={this.props.Login.userInfo}
                                selectedObject ={this.props.Login.masterData.SelectedProjectMaster}
                                screenHiddenDetails={this.state.userRoleControlRights.indexOf(editId) === -1}   
                                screenName={this.props.Login.screenName}
                                dataTip={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                               // hidden={(this.state.userRoleControlRights.indexOf(viewClosureFileId) === -1) ? true : this.props.Login.masterData.SelectedProjectMaster&& this.props.Login.masterData.SelectedProjectMaster.sfilename&&this.props.Login.masterData.SelectedProjectMaster.sfilename==='-'? true : false}
                               // downLoadIcon={this.props.Login.masterData.SelectedProjectMaster&& this.props.Login.masterData.SelectedProjectMaster.sfilename&&this.props.Login.masterData.SelectedProjectMaster.sfilename!='-'? true : false}
                                rowList={[
                                  [
                                    {dataField:"sprojecttitle", idsName:"IDS_PROJECTTITLE"},                                    
                                    {dataField:"sprojectcode", idsName:"IDS_PROJECTCODE"}                      
                                  ],
                                  [
                                    {dataField:"sprojectname", idsName:"IDS_PROJECTNAME"},  // ALPD-5068 Changed IDS_CLIENT to IDS_PROJECTNAME by Vishakh
                                    {dataField: "suserrolename", idsName: "IDS_ROLE"}                  
                                  ],
                                  [
                                    {dataField:"susername", idsName:"IDS_INCHARGE"},
                                    {dataField: "srfwdate", idsName:"IDS_RFWDATE"},            
                                  ],
                                  [
                                    {dataField:"sprojectstartdate", idsName:"IDS_STARTDATE"},
                                    {dataField:"sexpectcompletiondate", idsName:"IDS_EXPECTEDPROJECTCOMPLETIONDATE"}                
                                  ],
                                  [
                                    {dataField:"sclientcatname", idsName:"IDS_CLIENTCATEGORY"},
                                    {dataField:"sclientname", idsName:"IDS_CLIENT"}                        
                        
                                  ],
                                  //ALPD-4468
                                  // [
                                  //   {dataField:"squotationno", idsName:"IDS_QUOTATIONNO"},
                                  //   {dataField:"srfwid", idsName:"IDS_RFWID"}

                                  // ],
                                  [
                                    {dataField:"sprojectduration", idsName:"IDS_PROJECTDURATION"},
                                    {dataField:"sprojectdescription", idsName:"IDS_PROJECTDESCRIPTION"}

                                  ],
                                      [{dataField:"sfilename", idsName:"IDS_CLOSUREFILENAME"},
                                      {                              
                                       hidden:this.props.Login.masterData.SelectedProjectMaster&& this.props.Login.masterData.SelectedProjectMaster.sfilename&&this.props.Login.masterData.SelectedProjectMaster.sfilename!='-'&&  this.state.userRoleControlRights.indexOf(viewClosureFileId) !== -1 ? false : true,
                                      onClick:this.viewProjectMasterClosureFile}]




                                  
                                ]}
                            />
                            {parseInt(this.props.Login.settings[34]) === transactionStatus.YES ?
                            <Nav.Link className="btn btn-circle outline-grey mr-2" name="reportdetailstestname"
                              hidden={this.state.userRoleControlRights.indexOf(reportdetailId) === -1}
                              data-tip={this.props.intl.formatMessage({ id: "IDS_REPORTINFOPROJECT" })}
                              //data-for="tooltip_list_wrap"
                              onClick={(e) => this.props.ReportInfo("IDS_REPORTINFOPROJECT", "", "nprojectmastercode", this.props.Login.masterData, this.props.Login.userInfo, reportdetailId, this.props.Login.settings[34])}>
                              <ReportEdit className="custom_icons" width="20" height="20" />
                            </Nav.Link>
                            : "" }

                            <Nav.Link className="btn btn-circle outline-grey mr-2" name="edittestname"
                              hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                              data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                              //data-for="tooltip_list_wrap"
                              onClick={() => this.props.addProjectMaster("update", selectedProjectMaster, userInfo, editId, this.state.selectedRecordfilter, addProjectMaster)}>
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </Nav.Link>
                            <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" name="deletetestname"
                              data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                              //   data-for="tooltip_list_wrap"
                              hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                              onClick={() => this.ConfirmDelete(selectedProjectMaster, "delete", deleteId, "ProjectMaster")}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />

                            </Nav.Link>
                            <Nav.Link name="approveProjectMaster" className="btn btn-circle outline-grey mr-2"
                              hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                              data-tip={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                              //data-for="tooltip_list_wrap"
                              onClick={() => this.approveProjectMaster("ProjectMaster", selectedProjectMaster, "approve", approveId)}>
                              <FontAwesomeIcon icon={faThumbsUp} />
                            </Nav.Link>
                            <Nav.Link name="completeProjectMaster"
                              hidden={this.state.userRoleControlRights.indexOf(completeId) === -1}
                              className="btn btn-circle outline-grey mr-2"
                              data-tip={this.props.intl.formatMessage({ id: "IDS_COMPLETE" })}
                              onClick={() => this.props.projectMasterModal(selectedProjectMaster, "complete", "IDS_PROJECTCOMPLETION", completeId, "dprojectcompletiondate", this.props.Login.userInfo)}

                            >
                              <FontAwesomeIcon icon={faCheckCircle}
                              />
                            </Nav.Link>


                            <Nav.Link name="retireProjectMaster" className="btn btn-circle outline-grey mr-2"
                              hidden={this.state.userRoleControlRights.indexOf(retireId) === -1}
                              data-tip={this.props.intl.formatMessage({ id: "IDS_RETIRE" })}
                              //data-for="tooltip_list_wrap"
                              onClick={() => this.props.projectMasterModal(selectedProjectMaster, "retire", "IDS_RETIREDPROJECT", retireId, "dprojectretiredate", this.props.Login.userInfo)}

                            >
                              {/* <FontAwesomeIcon icon={faUserTimes} /> */}
                              <RetireaQuotation/>
                            </Nav.Link>

                            <Nav.Link name="ClosureProjectMaster" className="btn btn-circle outline-grey mr-2"
                              hidden={this.state.userRoleControlRights.indexOf(closureId) === -1}
                              data-tip={this.props.intl.formatMessage({ id: "IDS_CLOSE" })}
                              //data-for="tooltip_list_wrap"
                              onClick={() => this.props.projectMasterModal(selectedProjectMaster, "closure", "IDS_PROJECTCLOSURE", closureId, "dprojectclosuredate", this.props.Login.userInfo)}>
                              {/* <FontAwesomeIcon icon={faWindowClose} /> */}
                              <Closure className="custom_icons" width="17" height="20" />
                            </Nav.Link>



                          </div>
                          {/* </Tooltip> */}
                        </div>
                        {/* </Col>
                                            </Row> */}
                      </Card.Subtitle>
                    </Card.Header>
                    <Card.Body className="form-static-wrap">
                      {/* <Row>
                        <Col md="4">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_PROJECTCODE" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.sprojectcode}</ReadOnlyText>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_PROJECTNAME" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.sprojectname}</ReadOnlyText>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_ROLE" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.suserrolename}</ReadOnlyText>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_USER" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.susername}</ReadOnlyText>
                          </FormGroup>
                        </Col>
                        {/* <Col md="4">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_TEAMMEMBERS" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.steammembername}</ReadOnlyText>
                          </FormGroup>
                        </Col> 
                        <Col md="4">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_RFWDATE" })}</FormLabel>
                            <ReadOnlyText>{rearrangeDateFormatDateOnly(this.props.Login.userInfo,selectedProjectMaster.srfwdate)} </ReadOnlyText>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_STARTDATE" })}</FormLabel>
                            <ReadOnlyText>{rearrangeDateFormatDateOnly(this.props.Login.userInfo,selectedProjectMaster.sprojectstartdate)} </ReadOnlyText>
                          </FormGroup>
                        </Col>

                        <Col md="4">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_EXPECTEDPROJECTCOMPLETIONDATE" })}</FormLabel>
                            <ReadOnlyText>{rearrangeDateFormatDateOnly(this.props.Login.userInfo,selectedProjectMaster.sexpectcompletiondate)} </ReadOnlyText>
                          </FormGroup>
                        </Col>

                        <Col md="4">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_PROJECTDURATION" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.sprojectduration}</ReadOnlyText>
                          </FormGroup>
                        </Col>
                        {/* <Col md="4">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_DURATIONPERIOD" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.speriodname}</ReadOnlyText>
                          </FormGroup>
                        </Col>  

                        <Col md="4">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_PROJECTDESCRIPTION" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.sprojectdescription}</ReadOnlyText>
                          </FormGroup>
                        </Col>

                      </Row> */}
                      {/* <Col md={12}>
                        <div className="horizontal-line"></div>
                      </Col> */}

                      {/* <Row>

                        <Col md="3">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_PROJECTCLOSURENAME" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.sfilename}</ReadOnlyText>
                          </FormGroup>
                        </Col>

                        <Col md="3"> 
                          <Nav.Link name="ClosureProjectMasterFile" className="btn btn-circle outline-grey mr-2"
                              hidden={(this.state.userRoleControlRights.indexOf(viewClosureFileId) === -1) ? true : selectedProjectMaster.sfilename === '-' ? true : false }
                              data-tip={this.props.intl.formatMessage({ id: "IDS_DOWNLOAD" })}
                              onClick={() => this.viewProjectMasterClosureFile(selectedProjectMaster, userInfo)}>
                              <FontAwesomeIcon icon={faCloudDownloadAlt} />
                            </Nav.Link> 
                       </Col> 

                        <Col md="3">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_REMARKS" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.sclosureremarks}</ReadOnlyText>
                          </FormGroup>
                        </Col>

                        <Col md="3">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_CLOSUREDATE" })}</FormLabel>
                            <ReadOnlyText>{rearrangeDateFormatDateOnly(this.props.Login.userInfo,selectedProjectMaster.sprojectclosuredate)} </ReadOnlyText>
                          </FormGroup>
                        </Col>

                      </Row>

                      <Col md={12}>
                        <div className="horizontal-line"></div>
                      </Col>
                      <Row>

                      <Col md="6">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_RETIREDATE" })}</FormLabel>
                            <ReadOnlyText>{rearrangeDateFormatDateOnly(this.props.Login.userInfo,selectedProjectMaster.sprojectretiredate)} </ReadOnlyText>
                          </FormGroup>
                        </Col>
                      <Col md="6">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_REMARKS" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.sretiredremarks}</ReadOnlyText>
                          </FormGroup>
                        </Col>
                        </Row>

                        <Col md={12}>
                        <div className="horizontal-line"></div>
                      </Col>
                      <Row>

                      <Col md="6">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_PROJECTCOMPLETIONDATE" })}</FormLabel>
                            <ReadOnlyText>{rearrangeDateFormatDateOnly(this.props.Login.userInfo,selectedProjectMaster.sprojectcompletiondate)} </ReadOnlyText>
                          </FormGroup>
                        </Col>
                      <Col md="6">
                          <FormGroup>
                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_REMARKS" })}</FormLabel>
                            <ReadOnlyText>{selectedProjectMaster.scompletionremarks}</ReadOnlyText>
                          </FormGroup>
                        </Col>
                        </Row> */}

                      <Card className="at-tabs border-0">
                        <Row noGutters>
                          <Col md={12}>
                            <ProjectMasterTab
                              primaryKeyField={"nprojectmembercode"}
                              // data={this.props.Login.masterData.ProjectMember}
                              data={this.state.data}
                              // dataResult={this.props.Login.masterData.ProjectMember}

                              projectMasterHistorydata={this.props.Login.masterData.ProjectMasterHistory}
                              projectMasterdataResult={this.props.Login.masterData.ProjectMasterHistory}
                              dataResult={this.state.dataResult}
                              masterData={this.props.Login.masterData}
                              screenName={this.props.Login.screenName}
                              operation={this.props.Login.operation}
                              openChildModal={this.props.Login.openChildModal}
                              crudMaster={this.props.crudMaster}
                              errorCode={this.props.Login.errorCode}
                              validateEsignCredential={this.props.validateEsignCredential}
                              loadEsign={this.props.Login.loadEsign}
                              showAccordian={this.state.showAccordian}
                              selectedRecord={this.state.selectedRecord || {}}
                              // dataState={{skip: 0, take: 10}}
                              //dataState={this.props.Login.dataState}
                              dataState={this.state.dataState}
                              dataStateChange={this.dataStateChange}
                              extractedColumnList={fieldsForGrid}
                              controlMap={this.state.controlMap}
                              userRoleControlRights={this.state.userRoleControlRights}
                              inputParam={this.props.Login.inputParam}
                              userInfo={this.props.Login.userInfo}
                              //    getProjectmasterAddMemberService={(this.props.Login.screenName,this.props.Login.operation,this.props.getProjectmasterAddMemberService,this.props.Login.userInfo,this.props.Login.ncontrolCode)}
                              getProjectmasterAddMemberService={this.props.getProjectmasterAddMemberService}
                              // --   fetchRecord={this.props.getPricingEditService}
                              //--       editParam={{...editTestPriceParam, "updateType":"Single", priceDataState:this.state.priceDataState}}
                              deleteRecord={this.deleteProjectMember}
                              //  deleteParam={{operation:"delete"}}
                              methodUrl={"Teammembers"}
                              // reloadData={this.reloadData}
                              // --      addRecord = {() => this.openModal(addId)}
                              pageable={true}
                              onTabChange={this.onTabChange}
                              updateStore={this.props.updateStore}
                              scrollable={'scrollable'}
                              // gridHeight = {'600px'}
                              isActionRequired={true}
                              isToolBarRequired={false}
                              selectedId={this.props.Login.selectedId}
                              viewAttachment={this.props.viewAttachment}
                              MembersList={this.props.Login.MembersList}
                              onComboChange={this.onComboChange}
                              // File
                              addProjectMasterFile={this.props.addProjectMasterFile}
                              esignRights={this.props.Login.userRoleControlRights}
                              ntransactionstatus={selectedProjectMaster.ntransactionstatus}
                              //  selectedRecord={this.props.Login.selectedRecord}
                              onDropProjectMasterFile={this.onDropProjectMasterFile}
                              onInputOnChange={this.onInputOnChange}
                              screenData={this.props.Login.screenData}
                              deleteAttachment={this.deleteAttachment}
                              ncontrolCode={this.props.Login.ncontrolCode}
                              linkMaster={this.props.Login.linkMaster}
                              historydataStateChange={this.historydataStateChange}
                              //ALPD-3566 Start
                              getAvailableQuotation={this.props.getAvailableQuotation}
                              ProjectQuotationList={this.props.Login.ProjectQuotationList}
                              projectQuotationdataResult={this.props.Login.masterData.ProjectQuotation}
                              projectQuotationdata={this.props.Login.masterData.ProjectQuotation}
                              projectQuotationDataState={this.state.projectQuotationDataState}
                              projectQuotationDataStateChange={this.projectQuotationDataStateChange}
                              deleteProjectQuotation={this.deleteProjectQuotation}
                              getActiveProjectQuotationById={this.props.getActiveProjectQuotationById}
                              //ALPD-3566 End
                            />
                          </Col>
                        </Row>
                      </Card>
                    </Card.Body>
                  </Card>
                </ContentPanel>
                : ""
              }
            </Col>
          </Row>


        </div>
        {/* End of get display */}

        {/* Start of Modal Sideout for Test Creation */}
        {(this.props.Login.openModal) &&
          <SlideOutModal
            show={this.props.Login.openModal}
            //size={this.props.Login.operation==="create" ? "xl" : "lg" }
            closeModal={this.closeModal}
            hideSave={this.props.Login.screenName === "IDS_PROJECTINFO" ? true : false}
            operation={this.props.Login.operation}
            inputParam={this.props.Login.inputParam}
            screenName={this.props.Login.screenName}
            showSaveContinue={this.props.Login.screenName === "IDS_PROJECTMASTER"?true:false}
            onSaveClick={this.props.Login.screenName === "IDS_PROJECTCLOSURE" ? this.onSaveProjectMasterClosureFile : this.onSaveClick}
            esign={this.props.Login.loadEsign}
            validateEsign={this.validateEsign}
            selectedRecord={this.state.selectedRecord || {}}
            mandatoryFields={this.mandatoryFields || []}
            addComponent={this.props.Login.loadEsign ?
              <Esign
                operation={this.props.Login.operation}
                onInputOnChange={this.onInputOnChange}
                inputParam={this.props.Login.inputParam}
                selectedRecord={this.state.selectedRecord || {}}
              />
              : (this.props.Login.screenName === "IDS_PROJECTMASTER") ?

                <AddProjectMaster

                  userInfo={this.props.Login.userInfo}
                  selectedRecord={this.state.selectedRecord || {}}
                  ProjectType={this.props.Login.ProjectType}
                  onInputOnChange={this.onInputOnChange}
                  onComboChange={this.onComboChange}
                  // onNumericInputOnChange={this.onNumericInputOnChange}
                  onNumericInputChange={this.onNumericInputChange}

                  handleDateChange={this.handleDateChange}
                  Userrole={this.props.Login.Userrole}
                  Users={this.props.Login.userList}
                  TeamMembers={this.props.Login.TeamMembers}
                  PeriodByControl={this.props.Login.PeriodByControl}
                  settings={this.props.Login.settings}
                  ClientCategory={this.props.Login.ClientCategory}
                  Client={this.props.Login.Client}
                  QuotationNo={this.props.Login.QuotationNo}
                />
                : (this.props.Login.screenName === "IDS_REPORTINFOPROJECT") ?
                  <ReportInfoProject
                    userInfo={this.props.Login.userInfo}
                    selectedRecord={this.state.selectedRecord || {}}
                    onInputOnChange={this.onInputOnChange}
                    onComboChange={this.onComboChange}
                    onNumericInputChange={this.onNumericInputChange}
                    reportTemplateList={this.props.Login.reportTemplateList}
                    settings={this.props.Login.settings}

                  /> :


                  (this.props.Login.screenName === "IDS_PROJECTCLOSURE") ?

                    <ProjectMasterClosure
                      handleDateChange={this.handleDateChange}
                      userInfo={this.props.Login.userInfo}

                      selectedRecord={this.state.selectedRecord || {}}
                      onInputOnChange={this.onInputOnChange}
                      onDrop={this.onDropProjectMasterclosureFile}
                      onDropAccepted={this.onDropAccepted}
                      deleteAttachment={this.deleteAttachment}
                      actionType={this.state.actionType}
                      onComboChange={this.onComboChange}
                      linkMaster={this.props.linkMaster}
                      editFiles={this.props.editFiles}
                      maxSize={20}
                      maxFiles={1}
                      multiple={false}
                      label={this.props.intl.formatMessage({ id: "IDS_FILENAME" })}
                      name="projectmasterclosurefilename"

                    ></ProjectMasterClosure>
                    : (this.props.Login.screenName === "IDS_PROJECTINFO") ?
                      <AddProjectInfoPreview
                        selectedProjectMaster={this.props.Login.masterData.SelectedProjectMaster}
                        userInfo={this.props.Login.userInfo}
                        viewProjectMasterClosureFile={this.viewProjectMasterClosureFile}
                        userRoleControlRights={this.state.userRoleControlRights}
                        viewClosureFileId={viewClosureFileId}
                      >
                      </AddProjectInfoPreview>

                      : "Parent"

            }
          />
        }

        {this.props.Login.modalShow ? (
          <ModalShow
            modalShow={this.props.Login.modalShow}
            closeModal={this.closeModalShow}
            onSaveClick={this.onSaveModalClick}
            validateEsign={this.validateEsign}
            masterStatus={this.props.Login.masterStatus}
            updateStore={this.props.updateStore}
            selectedRecord={this.state.selectedRecord || {}}
            modalTitle={this.props.Login.screenName}
            modalBody={
              this.props.Login.screenName === "IDS_PROJECTCOMPLETION" ? (
                <AddCompletionDate
                  selectedRecord={this.state.selectedRecord || {}}
                  onInputOnChange={this.onInputOnChange}
                  handleDateChange={this.handleDateChange}
                  userInfo={this.props.Login.userInfo}
                  esign={this.props.Login.loadEsign}
                  currentTime={this.props.Login.currentTime}
                  TimeZoneList={this.props.Login.TimeZoneList}

                />
              ) : (
                <ProjectMasterRetire
                  selectedRecord={this.state.selectedRecord || {}}
                  TimeZoneList={this.props.Login.TimeZoneList}
                  onInputOnChange={this.onInputOnChange}
                  handleDateChange={this.handleDateChange}
                  userInfo={this.props.Login.userInfo}

                //onComboChange={this.onComboChange}
                //currentTime={this.props.Login.currentTime}
                />
              )
            }
          />
        ) : (
          ""
        )}


        {/* End of Modal Sideout for Test Creation */}
      </>
    );
  }

  viewProjectMasterClosureFile = (selectedProjectMaster, userInfo) => {
    const inputParam = {
      inputData: {
        projectmasterclosurefile: selectedProjectMaster,
        userinfo: userInfo
      },
      classUrl: "projectmaster",
      operation: "view",
      methodUrl: "AttachedProjectMasterClosureFile",
      screenName: "ProjectMaster Closure File"
    }
    this.props.viewAttachment(inputParam);
  }

  findMandatoryFields(screenName, selectedRecord, operation) {
    let mandatoryFields = [];
    if (screenName === "IDS_PROJECTMASTER") {

      mandatoryFields = [
        { "idsName": "IDS_PROJECTTYPE", "dataField": "nprojecttypecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_PROJECTTITLE", "dataField": "sprojecttitle", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_PROJECTNAME", "dataField": "sprojectname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_ROLE", "dataField": "nuserrolecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_INCHARGE", "dataField": "nusercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        //{ "idsName": "IDS_RFWDATE", "dataField": "drfwdate", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },
        { "idsName": "IDS_STARTDATE", "dataField": "dprojectstartdate", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },
        { "idsName": "IDS_PROJECTDURATION", "dataField": "nprojectduration", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_DURATIONPERIOD", "dataField": "nperiodcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_CLIENTCATEGORY", "dataField": "nclientcatcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_CLIENT", "dataField": "nclientcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

      ]

      mandatoryFields.forEach(item => item.mandatory === true && mandatoryFields.push(item));
      if (parseInt(this.props.Login.settings[31]) != 3)
        mandatoryFields.push({ "idsName": "IDS_PROJECTCODE", "dataField": "sprojectcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" });
      return mandatoryFields;

    }
    else if (screenName === "IDS_PROJECTCLOSURE") {

      mandatoryFields = [
        //{ "idsName": "IDS_FILENAME", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
        // { "idsName": "IDS_REASONFORCLOSURE", "dataField": "sclosureremarks", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textarea" },
        { "idsName": "IDS_CLOSUREDATE", "dataField": "dprojectclosuredate", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },

      ]

      mandatoryFields.forEach(item => item.mandatory === true && mandatoryFields.push(item));
      return mandatoryFields;
    }
    else if (screenName === "IDS_REPORTINFOPROJECT") {
      mandatoryFields = [
        { "idsName": "IDS_REPORTTEMPLATEVERSION", "dataField": "sreporttemplateversion", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_REVISION", "dataField": "srevision", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_REVISIONAUTHOR", "dataField": "srevisionauthor", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_INTRODUCTION", "dataField": "sintroduction", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_TESTPRODUCTHEADERCOMMENTS", "dataField": "stestproductheadercomments", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_TESTPRODUCTFOOTERCOMMENTS1", "dataField": "stestproductfootercomments1", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_TESTPRODUCTFOOTERCOMMENTS2", "dataField": "stestproductfootercomments2", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_TESTPRODUCTFOOTERCOMMENTS3", "dataField": "stestproductfootercomments3", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_TESTPRODUCTFOOTERCOMMENTS4", "dataField": "stestproductfootercomments4", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_SAMPLINGDETAILS", "dataField": "ssamplingdetails", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_UNCERTAINITYOFMEASUREMENT", "dataField": "suncertainitymeasurement", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        // {"idsName": "IDS_REPORTTEMPLATE", "dataField": "nreporttemplatecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }

      ]
;
     
      return mandatoryFields;
    }

    else if (screenName === "IDS_RETIREDPROJECT") {
      mandatoryFields = [
        { "idsName": "IDS_RETIREDATE", "dataField": "dprojectretiredate", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" }
      ]
    }
    else if (screenName === "IDS_PROJECTCOMPLETION") {
      mandatoryFields = [
        { "idsName": "IDS_PROJECTCOMPLETEDDATE", "dataField": "dprojectcompletiondate", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" }
      ]
    }
    else {
      return [];
    }
  }

  onComboChange = (comboData, fieldName, caseNo) => {

    const selectedRecord = this.state.selectedRecord || {};
    switch (caseNo) {
      case 1:
        // const selectedRecord = this.state.selectedRecord || {};
        if (selectedRecord.nuserrolecode) {
          if (parseInt(comboData.value) !== parseInt(selectedRecord.nuserrolecode.value)) {
            // selectedRecord.nusercode={};
            delete (selectedRecord.nusercode);
          }
        }

        selectedRecord[fieldName] = comboData;
        selectedRecord["suserrolename"] = comboData.item["suserrolename"];
        this.props.getuserComboServices({

          inputData: {
            userinfo: this.props.Login.userInfo,
            sdisplayname: selectedRecord.nuserrolecode.label,
            primarykey: selectedRecord.nuserrolecode.value,
          }

        }, selectedRecord);


        // this.setState({ selectedRecord });

        break;

      case 2:
        // let nfilterProjectType = this.state.nfilterProjectType || {}
        // nfilterProjectType = comboData;
        const selectedRecordfilter = this.state.selectedRecordfilter || {};
        selectedRecordfilter[fieldName] = comboData;
        this.setState({ selectedRecordfilter });
        break;

      case 3:

        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
        break;

      case 4:
        if (selectedRecord.nclientcatcode) {
          if (parseInt(comboData.value) !== parseInt(selectedRecord.nclientcatcode.value)) {
            delete (selectedRecord.nclientcode);
            if (selectedRecord.nquotationcode)
              delete (selectedRecord.nquotationcode);
          }
        }
        selectedRecord[fieldName] = comboData;
        selectedRecord["sclientcatname"] = comboData.item["sclientcatname"];

        this.props.getClientByCategory({

          inputData: {
            userinfo: this.props.Login.userInfo,
            sdisplayname: selectedRecord.nclientcatcode.label,
            primarykey: selectedRecord.nclientcatcode.value,
          }

        }, selectedRecord);

      case 5:
        // if (selectedRecord.nclientcatcode) {
        //   if (this.props.Login.selec !== parseInt(selectedRecord.nclientcatcode.value)) {
        //   delete (selectedRecord.nclientcode);
        //     delete (selectedRecord.nquotationcode);
        //   }}
        if (selectedRecord.nclientcode) {
          if (parseInt(comboData.value) !== parseInt(selectedRecord.nclientcode.value)) {
            delete (selectedRecord.nquotationcode);
          }
        }


        selectedRecord[fieldName] = comboData;
        selectedRecord["squotationno"] = comboData.item["squotationno"];
        this.props.getQuotationByClient({

          inputData: {
            userinfo: this.props.Login.userInfo,
            sdisplayname: selectedRecord.nclientcatcode.label,
            nclientcatcode: selectedRecord.nclientcatcode.value,
            nclientcode: parseInt(comboData.value)
          }

        }, selectedRecord);



      default:
        break;
    }
  }

  onDropProjectMasterFile = (attachedFiles, fieldName, maxSize) => {

    let selectedRecord = this.state.selectedRecord || {};
    selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
    this.setState({ selectedRecord, actionType: "new" });
  }

  onInputOnChange = (event, optional) => {
    const selectedRecord = this.state.selectedRecord || {};
    if (event.target.type === 'checkbox') {
      if (event.target.name === "ntransactionstatus")
        selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
      // else if (event.target.name === "nlockmode")
      //     selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.UNLOCK : transactionStatus.LOCK;
      else
        selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
    }
    else if (event.target.type === 'radio') {
      selectedRecord[event.target.name] = optional;
    }
    else {
      selectedRecord[event.target.name] = event.target.value;
    }
    this.setState({ selectedRecord });
  }
//ALPD-3566 Start
  deleteProjectQuotation = (deleteParam) => {
    const inputParam = {
      classUrl: "projectmaster",
      methodUrl: "ProjectQuotation",
      //displayName: ,
      inputData: {
        "ProjectQuotation": deleteParam.selectedRecord,//.dataItem,
        "nprojectquotationcode": deleteParam.selectedRecord.nprojectquotationcode,
        "userinfo": this.props.Login.userInfo
      },
      operation: "delete",
      selectedRecord: { ...this.state.selectedRecord }

    }
    if (this.props.Login.masterData.SelectedProjectMaster.ntransactionstatus === transactionStatus.DRAFT
      || this.props.Login.masterData.SelectedProjectMaster.ntransactionstatus === transactionStatus.APPROVED) {

    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
          openChildModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_QUOTATION" }),
          operation: deleteParam.operation
        }
      }
      this.props.updateStore(updateInfo);
    }
    else {
      this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
    }
  }
    else {

      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTAPPROVEDRECORD" }));
  }
  }
//ALPD-3566 End
  deleteProjectMember = (deleteParam) => {
    const inputParam = {
      classUrl: "projectmaster",
      methodUrl: "ProjectMember",
      //displayName: ,
      inputData: {
        "projectmember": deleteParam.selectedRecord,//.dataItem,
        "nprojectmembercode": deleteParam.selectedRecord.nprojectmembercode,
        "userinfo": this.props.Login.userInfo
      },
      operation: "delete",
      selectedRecord: { ...this.state.selectedRecord }

      // priceDataState:this.state.priceDataState
    }

    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
          openChildModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_MEMBERS" }),
          operation: deleteParam.operation
        }
      }
      this.props.updateStore(updateInfo);
    }
    else {
      this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
    }
  }

  onDropProjectMasterclosureFile = (attachedFiles, fieldName, maxSize) => {

    let selectedRecord = this.state.selectedRecord || {};
    selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
    this.setState({ selectedRecord, actionType: "new" });
  }

  /* onNumericInputChange = (value, name) => {
    console.log("value:", value, name);
    const selectedRecord = this.state.selectedRecord || {};
    if (name === "nroundingdigits") {
        
        if (/^-?\d*?$/.test(value.target.value) || value.target.value === "") {
            console.log("val:", value.target.value);
            selectedRecord[name] = value.target.value;
        }
    }
    else {
        selectedRecord[name] = value;
    }
  
    this.setState({ selectedRecord });
  } */

  onNumericInputChange = (value, name) => {

    console.log("value:", value, name);

    const selectedRecord = this.state.selectedRecord || {};

    if (name === "nprojectduration") {

      if (/^[0-9]+$/.test(value.target.value) || value.target.value === "") {

        selectedRecord[name] = value.target.value;
      } else {

        selectedRecord[name] = "";
      }

    }

    else {

      selectedRecord[name] = value;
    }
    this.setState({ selectedRecord });

  }

  approveProjectMaster = (methodUrl, selectedProjectMaster, operation, ncontrolCode) => {
    if (selectedProjectMaster.ntransactionstatus === transactionStatus.DRAFT) {

      const postParam = {
        inputListName: "ProjectMaster",
        selectedObject: "SelectedProjectMaster",
        primaryKeyField: "nprojectmastercode",
        primaryKeyValue: selectedProjectMaster.nprojectmastercode,
        fetchUrl: "projectmaster/getProjectMaster",
        fecthInputObject: { userinfo: this.props.Login.userInfo },
      };

      const inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl, postParam,
        inputData: {
          "userinfo": this.props.Login.userInfo,
          "projectmaster": { ...selectedProjectMaster, },
          "nautoprojectcode": parseInt(this.props.Login.settings[31]) === transactionStatus.YES ? transactionStatus.YES : transactionStatus.NO
        },
        operation,
        isClearSearch: this.props.Login.isClearSearch,
        selectedRecord: { ...this.state.selectedRecord }

      }

      const masterData = this.props.Login.masterData;

      if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            loadEsign: true, screenData: { inputParam, masterData },
            openModal: true, screenName: "IDS_PROJECTMASTER", operation
          }
        }
        this.props.updateStore(updateInfo);
      }
      else {
        this.props.crudMaster(inputParam, masterData, "openModal");
      }
    }
    else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }));
    }

  }

  // RetireProjectMaster = (methodUrl, selectedProjectMaster, operation, ncontrolCode) => {
  //   if (selectedProjectMaster.ntransactionstatus === transactionStatus.CLOSED) {

  //     const postParam = {
  //       inputListName: "ProjectMaster",
  //       selectedObject: "SelectedProjectMaster",
  //       primaryKeyField: "nprojectmastercode",
  //       primaryKeyValue: selectedProjectMaster.nprojectmastercode,
  //       fetchUrl: "projectmaster/getProjectMaster",
  //       fecthInputObject: { userinfo: this.props.Login.userInfo },
  //     };

  //     const inputParam = {
  //       classUrl: this.props.Login.inputParam.classUrl,
  //       methodUrl, postParam,
  //       inputData: {
  //         "userinfo": this.props.Login.userInfo,
  //         "projectmaster": selectedProjectMaster
  //       },
  //       operation,
  //       isClearSearch: this.props.Login.isClearSearch
  //     }

  //     const masterData = this.props.Login.masterData;

  //     if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
  //       const updateInfo = {
  //         typeName: DEFAULT_RETURN,
  //         data: {
  //           loadEsign: true, screenData: { inputParam, masterData },
  //           openModal: true, screenName: "IDS_PROJECTMASTER", operation
  //         }
  //       }
  //       this.props.updateStore(updateInfo);
  //     }
  //     else {
  //       this.props.crudMaster(inputParam, masterData, "openModal");
  //     }
  //   }
  //   else {
  //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCLOSEDVERSION" }));
  //   }

  // }
  onTabChange = (tabProps) => {
    const screenName = tabProps.screenName;
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { screenName },
    };
    this.props.updateStore(updateInfo);
  };

  onDropTestFile = (attachedFiles, fieldName, maxSize) => {
    let selectedRecord = this.state.selectedRecord || {};
    selectedRecord[fieldName] = onDropAttachFileList(
      selectedRecord[fieldName],
      attachedFiles,
      maxSize
    );
    this.setState({ selectedRecord, actionType: "new" });
  };
  /*
  dataStateChange = (event) => {
    this.setState({
      dataResult: process(
        this.props.Login.masterData["selectedSection"],
        event.dataState
      ),
      sectionDataState: event.dataState,
    });
  };
*/
  dataStateChange = (event) => {
    this.setState({
      dataResult: process(this.state.data, event.dataState),
      dataState: event.dataState
    });
  }
  historydataStateChange = (event) => {
    this.setState({
      dataResult: process(this.state.data, event.historydataState),
      historydataState: event.historydataState
    });
  }
//ALPD-3566 Start
  projectQuotationDataStateChange = (event) => {
    this.setState({
      dataResult: process(this.state.data, event.projectQuotationDataState),
      projectQuotationDataState: event.projectQuotationDataState
    });
  }
//ALPD-3566 End
  /*
    tabDetail = () => {
      const tabMap = new Map();
      const deleteSecId =
        this.state.controlMap.has("DeleteSection") &&
        this.state.controlMap.get("DeleteSection").ncontrolcode;
      const defaultSecId =
        this.state.controlMap.has("DefaultSection") &&
        this.state.controlMap.get("DefaultSection").ncontrolcode;
      tabMap.set(
        "IDS_SECTION",
        <InstrumentSectionTab
          controlMap={this.state.controlMap}
          userRoleControlRights={this.state.userRoleControlRights}
          dataState={this.props.Login.dataState}
          masterData={this.props.Login.masterData["selectedSection"] || []}
          selectedProjectMaster={this.props.Login.masterData.selectedProjectMaster}
          userInfo={this.props.Login.userInfo}
          inputParam={this.props.Login.inputParam}
          deleteRecord={this.DeleteInstrument}
          deleteSecId={deleteSecId}
          defaultSecId={defaultSecId}
          defaultRecord={this.defaultRecord}
          getAvailableInstData={this.props.getAvailableInstData}
          InstrumentSection={this.props.Login.masterData.selectedSection || []}
          screenName="IDS_SECTION"
          selectedRecord={this.state.selectedRecord}
          settings={this.props.Login.settings}
        />
      );
      tabMap.set(
        "IDS_INSTRUMENTVALIDATION",
        <InstrumentValidationTab
          controlMap={this.state.controlMap}
          userRoleControlRights={this.state.userRoleControlRights}
          selectedProjectMaster={this.props.Login.masterData.selectedProjectMaster}
          FileData={this.props.Login.masterData.ValidationFileData}
          InstrumentValidation={this.props.Login.masterData.InstrumentValidation}
          masterData={this.props.Login.masterData}
          userInfo={this.props.Login.userInfo}
          getDataForAddEditValidation={this.props.getDataForAddEditValidation}
          inputParam={this.props.inputParam}
          selectedRecord={this.state.selectedRecord}
          deleteRecord={this.DeleteInstrument}
          deleteTabFileRecord={this.deleteTabFileRecord}
          getTabDetails={this.props.getTabDetails}
          addInstrumentFile={this.props.addInstrumentFile}
          deleteAction={this.props.deleteAction}
          ConfirmDelete={this.ConfirmDelete}
          getDataForEdit={this.props.getDataForEdit}
          addfilecllick={this.addInstrumentFile}
          viewInstrumentFile={this.viewInstrumentFile}
          screenName="IDS_INSTRUMENTVALIDATION"
        />
      );
      tabMap.set(
        "IDS_INSTRUMENTCALIBRATION",
        <InstrumentCalibrationTab
          controlMap={this.state.controlMap}
          userRoleControlRights={this.state.userRoleControlRights}
          selectedProjectMaster={this.props.Login.masterData.selectedProjectMaster}
          FileData={this.props.Login.masterData.CalibrationFileData}
          InstrumentCalibration={
            this.props.Login.masterData.InstrumentCalibration
          }
          masterData={this.props.Login.masterData}
          userInfo={this.props.Login.userInfo}
          getDataForAddEditCalibration={this.props.getDataForAddEditCalibration}
          inputParam={this.props.inputParam}
          selectedRecord={this.state.selectedRecord}
          deleteRecord={this.DeleteInstrument}
          deleteTabFileRecord={this.deleteTabFileRecord}
          getTabDetails={this.props.getTabDetails}
          viewInstrumentFile={this.viewInstrumentFile}
          addInstrumentFile={this.props.addInstrumentFile}
          addfilecllick={this.addInstrumentCalibrationFile}
          deleteAction={this.props.deleteAction}
          ConfirmDelete={this.ConfirmDelete}
          addOpenDate={this.props.addOpenDate}
          OpenDate={this.props.OpenDate}
          CloseDate={this.props.CloseDate}
          screenName="IDS_INSTRUMENTCALIBRATION"
        />
      );
      tabMap.set(
        "IDS_INSTRUMENTMAINTENANCE",
        <InstrumentMaintenanceTab
          controlMap={this.state.controlMap}
          userRoleControlRights={this.state.userRoleControlRights}
          selectedProjectMaster={this.props.Login.masterData.selectedProjectMaster}
          FileData={this.props.Login.masterData.MaintenanceFileData}
          InstrumentMaintenance={
            this.props.Login.masterData.InstrumentMaintenance
          }
          masterData={this.props.Login.masterData}
          userInfo={this.props.Login.userInfo}
          getDataForAddEditMaintenance={this.props.getDataForAddEditMaintenance}
          inputParam={this.props.inputParam}
          selectedRecord={this.state.selectedRecord}
          viewInstrumentFile={this.viewInstrumentFile}
          deleteRecord={this.DeleteInstrument}
          deleteTabFileRecord={this.deleteTabFileRecord}
          getTabDetails={this.props.getTabDetails}
          addInstrumentFile={this.props.addInstrumentFile}
          addfilecllick={this.addInstrumentMaintenanceFile}
          deleteAction={this.props.deleteAction}
          ConfirmDelete={this.ConfirmDelete}
          addOpenDate={this.props.addOpenDate}
          OpenDate={this.props.OpenDate}
          CloseDate={this.props.CloseDate}
          screenName="IDS_INSTRUMENTMAINTENANCE"
        />
      );
  
      return tabMap;
    }; */

  ConfirmDelete = (selectedProjectMaster, operation, deleteId, screenName) => {
    this.confirmMessage.confirm(
      "deleteMessage",
      this.props.intl.formatMessage({ id: "IDS_DELETE" }),
      this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
      this.props.intl.formatMessage({ id: "IDS_OK" }),
      this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
      () =>
        this.DeleteProjectMaster(
          screenName,
          selectedProjectMaster,
          operation,
          deleteId

        )
    );
  };



  reloadData = () => {
    this.searchRef.current.value = "";

    // if (Object.values(this.state.selectedRecordfilter.nprojecttypecodevalue).length && this.state.selectedRecordfilter.nprojecttypecodevalue !== undefined) {
    if (this.props.Login.masterData.SelectedProjectType !== undefined) {
      if (Object.values(this.props.Login.masterData.SelectedProjectType).length && this.props.Login.masterData.SelectedProjectType !== undefined) {
        let inputParam = {
          inputData: {
            // nprojecttypecode: this.state.selectedRecord.nprojecttypecode.value,
            nprojecttypecode: this.props.Login.masterData.SelectedProjectType.nprojecttypecode,
            userinfo: this.props.Login.userInfo,
            // nfilterProjectType: this.state.selectedRecord.nprojecttypecode,
            nfilterProjectType: this.props.Login.masterData.SelectedProjectType,
          },
          classUrl: "projectmaster",
          methodUrl: "ProjectMasterByProjectType",
        };

        this.props.changeProjectTypeFilter(inputParam, this.props.Login.masterData.filterProjectType);
      }
    } else {
      toast.warn(
        this.props.intl.formatMessage({
          id: "IDS_PROJECTTYPENOTAVAILABLE",
        })
      );
    }
  };



  closeModal = () => {
    let loadEsign = this.props.Login.loadEsign;
    let openModal = this.props.Login.openModal;
    //let openClosureModal=this.props.Login.openClosureModal;
    let selectedRecord = this.state.selectedRecord;
    let modalShow = this.props.Login.modalShow;;
    //    let selectedRecord = this.state.selectedRecord;
    if (this.props.Login.loadEsign) {
      if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve") {
        loadEsign = false;
        openModal = false;
        // if (this.props.Login.modalTitle === "IDS_RETIREDPROJECT" ||
        // this.props.Login.modalTitle === "IDS_PROJECTCOMPLETION") {
        // modalShow = true;
        // openModal = false;
        // openClosureModal = false}
        // openClosureModal=false;
        selectedRecord = {};
      }
      else {
        loadEsign = false;
        if (this.props.Login.screenName === "IDS_RETIREDPROJECT" ||
          this.props.Login.screenName === "IDS_PROJECTCOMPLETION") {
          modalShow = true;
          openModal = false;
          //openClosureModal = false

        }
        selectedRecord['esignpassword'] = '';
        selectedRecord['esigncomments'] = '';
        selectedRecord['esignreason'] = '';
      }
    }
    else {
      this.props.Login.Client = [];
      this.props.Login.QuotationNo = [];
      openModal = false;
      // openClosureModal=false;
      modalShow = false;
      selectedRecord = {};
    }

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { openModal, modalShow, loadEsign, selectedRecord }
    }
    this.props.updateStore(updateInfo);

  }



  closeModalShow = () => {
    let loadEsign = this.props.Login.loadEsign;

    let modalShow = this.props.Login.modalShow;
    //let popUp = this.props.Login.popUp;
    let selectedRecord = this.props.Login.selectedRecord;
    if (this.props.Login.loadEsign) {
      loadEsign = false;
    } else {
      modalShow = false;
      selectedRecord = {};
      //popUp = undefined;
    }

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { modalShow, selectedRecord, selectedId: null, loadEsign, },
    };
    this.props.updateStore(updateInfo);
  };


  componentDidUpdate(previousProps) {
    let updateState = false;
    let {
      selectedRecord,
      selectedRecordfilter,
      userRoleControlRights,
      controlMap,
      filterData,
      nfilterProjectType,
      filterProjectType,
 
    } = this.state;
 
    // if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
    //   selectedRecord = this.props.Login.selectedRecord;
    //   updateState = true;
    //   this.setState({ selectedRecord, selectedRecordfilter });
    // }
    if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
      userRoleControlRights = [];
      if (this.props.Login.userRoleControlRights) {
        this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode
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
      this.setState({
        controlMap, userRoleControlRights, data: this.props.Login.masterData.ProjectMember,
        dataResult: process(this.props.Login.masterData.ProjectMember || [], this.state.dataState)
      });
      //   updateState = true;
    }
 
    let nprojecttypecode = this.state.nfilterProjectType || {};
 
    if (this.props.Login.masterData !== previousProps.Login.masterData) {
      nfilterProjectType = this.state.nfilterProjectType || {};
 
      const filterProjectType = constructOptionList(this.props.Login.masterData.filterProjectType || [], "nprojecttypecode",
        "sprojecttypename", undefined, undefined, undefined);
     
 
       let ProjectMasterList = filterProjectType.get("OptionList");
      nprojecttypecode = ProjectMasterList[0];
      //ALPD-3524
      if (this.props.Login.masterData.filterProjectType !== previousProps.Login.masterData.filterProjectType) {
      selectedRecordfilter = { nprojecttypecodevalue: nprojecttypecode }
      }
      selectedRecord = { nprojecttypecodevalue: nprojecttypecode }
      // nfilterProjectType = this.props.Login.masterData.nfilterProjectType;
      this.setState({
        ProjectMasterList,
        selectedRecordfilter, selectedRecord, data: this.props.Login.masterData.ProjectMember, dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
        dataResult: process(this.props.Login.masterData.ProjectMember || [], { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 })
      });
 
      if (this.props.Login.masterData.SelectedProjectType && this.props.Login.masterData.SelectedProjectType !== previousProps.Login.masterData.SelectedProjectType) {
        nfilterProjectType = {
          label: this.props.Login.masterData.SelectedProjectType.sprojecttypename,
          value: this.props.Login.masterData.SelectedProjectType.nprojecttypecode,
          item: this.props.Login.masterData.SelectedProjectType,
        };
      }
      //  selectedRecordfilter = {nprojecttypecodevalue:nfilterProjectType}
      filterData = this.generateBreadCrumData();
      updateState = true;
      this.setState({ filterData, selectedRecordfilter });
    }
 
    if (this.props.Login.masterData.SelectedProjectType !== previousProps.Login.masterData.SelectedProjectType) {
 
      let nprojecttypecodevalue = this.props.Login.masterData.SelectedProjectType ?
        {
          label: this.props.Login.masterData.SelectedProjectType.sprojecttypename,
          value: this.props.Login.masterData.SelectedProjectType.nprojecttypecode,
          item: this.props.Login.masterData.SelectedProjectType
        } : ""
      //  nprojecttypecode=ProjectMasterList[ProjectMasterList.length-1];
      selectedRecordfilter = { nprojecttypecodevalue }
      selectedRecord = { nprojecttypecodevalue: nprojecttypecode }
      // nfilterProjectType = this.props.Login.masterData.nfilterProjectType;
      this.setState({
        selectedRecordfilter, selectedRecord
 
      });
 
    }

    if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
      selectedRecord = this.props.Login.selectedRecord;
      updateState = true;
      this.setState({ selectedRecord, selectedRecordfilter });
    }
 
 
 
  }
  generateBreadCrumData() {
    const breadCrumbData = [];
    if (this.props.Login.masterData && this.props.Login.masterData.SelectedProjectType) {

      breadCrumbData.push({
        label: "IDS_PROJECTTYPE",
        value: this.props.Login.masterData.SelectedProjectType
          ? this.props.Login.masterData.SelectedProjectType.sprojecttypename
          : "NA",
      });

    } else if (this.props.Login.masterData && this.props.Login.masterData.SelectedProjectMaster) {

      /*    breadCrumbData.push({
            label: "IDS_PROJECTTYPE",
            value: this.state.selectedRecord.nprojecttypecode
              ? this.state.selectedRecord.nprojecttypecode.label
              : "NA",
          }); */

      breadCrumbData.push({
        label: "IDS_PROJECTTYPE",
        value: this.props.Login.masterData.SelectedProjectMaster
          ? this.props.Login.masterData.SelectedProjectMaster.sprojecttypename
          : "NA",
      });

    } else {

      /*       breadCrumbData.push({
             label: "IDS_PROJECTTYPE",
             value:  this.state.selectedRecord.nprojecttypecodevalue
               ? this.state.selectedRecord.nprojecttypecodevalue.label
               : "NA",
           }); */

      breadCrumbData.push({
        label: "IDS_PROJECTTYPE",
        value: this.props.Login.masterData.nfilterProjectType
          ? this.props.Login.masterData.nfilterProjectType.label
          : "NA",
      });

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
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { showFilter: false },
    };
    this.props.updateStore(updateInfo);
  };

  ProjectMasterInfoPreview = (viewId) => {

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {
        screenName: "IDS_PROJECTINFO",
        openModal: true,
        operation: "view",
        modalScreenSize: false,
        ncontrolcode: viewId

      },
    };

    this.props.updateStore(updateInfo);
  };

  onFilterSubmit = () => {
    this.searchRef.current.value = "";

    // if (this.state.nfilterProjectType.value) {
    // if (this.state.selectedRecord.nprojecttypecodevalue.value) {
    //if ((this.state.selectedRecord).length>0) {

    // if (Object.values(this.state.selectedRecordfilter.nprojecttypecodevalue).length && this.state.selectedRecordfilter.nprojecttypecodevalue !== undefined) {

    if (this.state.selectedRecordfilter.nprojecttypecodevalue !== undefined) {
      if (Object.values(this.state.selectedRecordfilter.nprojecttypecodevalue).length && this.state.selectedRecordfilter.nprojecttypecodevalue !== undefined) {
        let inputParam = {
          inputData: {
            nprojecttypecode: this.state.selectedRecordfilter.nprojecttypecodevalue.value,
            userinfo: this.props.Login.userInfo,
            // nfilterProjectType: this.state.nfilterProjectType,
            nfilterProjectType: this.state.selectedRecordfilter.nprojecttypecodevalue,
          },
          classUrl: "projectmaster",
          methodUrl: "ProjectMasterByProjectType",
        };
        this.props.changeProjectTypeFilter(
          inputParam,
          this.props.Login.masterData.filterProjectType
        );
      }
    } else {
      toast.warn(
        this.props.intl.formatMessage({
          id: "IDS_PROJECTTYPENOTAVAILABLE",
        })
      );
    }
  };
}

export default connect(mapStateToProps, {
  callService,
  crudMaster,
  filterColumnData,
  updateStore,
  validateEsignCredential,
  changeProjectTypeFilter,
  viewAttachment, addProjectMaster, ReportInfo, getProjectMaster, getProjectmasterAddMemberService, addProjectMasterFile,
  getuserComboServices, getClientByCategory, getQuotationByClient, closureProjectMaster, modalSave, validateEsignforModal,
  projectMasterModal,getAvailableQuotation,getActiveProjectQuotationById
})(injectIntl(ProjectMaster));
