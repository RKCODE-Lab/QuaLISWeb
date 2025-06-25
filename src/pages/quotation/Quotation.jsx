import React, { Component } from "react";
import { Row, Col, Card, Nav, FormGroup, FormLabel } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPencilAlt, faThumbsUp,faPlus,faEye,faUserTimes, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Quotationdiscount } from '../../assets/image/quotationdiscount.svg';
import { injectIntl,FormattedMessage } from "react-intl";
import {
  callService, crudMaster, validateEsignCredential, updateStore, getQuotation, filterColumnData,getProjectTypeComboService,
  viewAttachment, addQuotation, getreloadQuotation, getQuotationAddTestService, getQuotationPricingEditService, GrossQuotation,modalSave,handleRetireQuotation,
  getQuotationClientCategoryComboService,getQuotaionClientComboService,getProjectCodeComboService ,
  getQuotaionProductCategoryComboService,getQuotaionClientSiteComboService,generateControlBasedReport
} from "../../actions";

import ListMaster from "../../components/list-master/list-master.component";
import { transactionStatus } from "../../components/Enumeration";
import AddQuotation from "../../pages/quotation/AddQuotation";
import { DEFAULT_RETURN } from "../../actions/LoginTypes";
import SlideOutModal from "../../components/slide-out-modal/SlideOutModal";

import Esign from "../audittrail/Esign";
import { showEsign, getControlMap, formatInputDate }
  from "../../components/CommonScript";
import { ReadOnlyText, ContentPanel } from "../../components/App.styles";
import { process } from "@progress/kendo-data-query";
import ConfirmMessage from "../../components/confirm-alert/confirm-message.component";
// import ProjectMasterFilter from './ProjectMasterFilter';
import { intl } from "../../components/App";
// import DataGrid from '../../components/data-grid/data-grid.component';
import QuotationTab from "./QuotationTab";
import AddQuotationPreview from "../../pages/quotation/AddQuotationPreview";
import RetireQuotation from "../../pages/quotation/RetireQuotation";
import ModalShow from "../../components/ModalShow";
import ViewInfoDetails from "../../components/ViewInfoDetails";
import {ReactComponent as RetireaQuotation} from '../../assets/image/RetireaQuotation.svg';

const mapStateToProps = (state) => {
  return { Login: state.Login };
};

class Quotation extends Component {
  constructor(props) {
    super(props);
    const dataState = {
      skip: 0,
      take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
  };


  
  this.state = {
      selectedRecord: {},
      error: "",
      userRoleControlRights: [],
      selectedQuotation: undefined,
      controlMap: new Map(),
      Instrument: [],
      dataState: dataState,
      dataResult: [], data: [],
      sidebarview: false

    };
    this.searchRef = React.createRef();
    this.searchFieldList = ["squotationno","sclientcatname", "sclientname", "sclientsiteaddress", "soemname","sproductcatname","sproductname","squotationdate","sdescription","sdeviationremarks","sversionstatus","sretireremarks"]
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

    let quotationData = [];
    let inputParam = {};
    let slideOutModal;
    quotationData["userinfo"] = this.props.Login.userInfo;

    let postParam = {
      inputListName: "Quotation",
      selectedObject: "SelectedQuotation",
      primaryKeyField: "nquotationcode",
    };

    if ((this.props.Login.operation === "update") && (this.props.Login.screenName === "IDS_QUOTATION")) {

      postParam["primaryKeyValue"] =
        this.props.Login.masterData.SelectedQuotation.nquotationcode;

      quotationData["quotation"] = {
        nquotationcode: this.props.Login.masterData.SelectedQuotation.nquotationcode,
        nsitecode: this.props.Login.userInfo.nmastersitecode,
        sprojecttitle: this.state.selectedRecord.sprojecttitle === undefined ? "" : this.state.selectedRecord.sprojecttitle, 
        sclientsiteaddress: this.state.selectedRecord.sclientsiteaddress === undefined ? "" : this.state.selectedRecord.sclientsiteaddress, 
        sinvoiceaddress: this.state.selectedRecord.sinvoiceaddress === undefined ? "" : this.state.selectedRecord.sinvoiceaddress, 
        sdescription: this.state.selectedRecord.sdescription === undefined ? "" : this.state.selectedRecord.sdescription, 
        ntransactionstatus: transactionStatus.DRAFT,
        sdeviationremarks: this.state.selectedRecord.sdeviationremarks === undefined ? "" : this.state.selectedRecord.sdeviationremarks,
        soemname: this.state.selectedRecord.soemname === undefined ? "" : this.state.selectedRecord.soemname,
        // squotationleadtime: this.state.selectedRecord.squotationleadtime === undefined ? "" : this.state.selectedRecord.squotationleadtime

      };

    } else if ((this.props.Login.operation === "create") && (this.props.Login.screenName === "IDS_QUOTATION")) {

      quotationData["quotation"] = {  

        nsitecode: this.props.Login.userInfo.nmastersitecode,
        sprojecttitle: this.state.selectedRecord.sprojecttitle === undefined ? "" : this.state.selectedRecord.sprojecttitle, 
        sclientsiteaddress: this.state.selectedRecord.sclientsiteaddress === undefined ? "" : this.state.selectedRecord.sclientsiteaddress, 
        sinvoiceaddress: this.state.selectedRecord.sinvoiceaddress === undefined ? "" : this.state.selectedRecord.sinvoiceaddress, 
        sdescription: this.state.selectedRecord.sdescription === undefined ? "" : this.state.selectedRecord.sdescription, 
        ntransactionstatus: transactionStatus.DRAFT,
        sdeviationremarks: this.state.selectedRecord.sdeviationremarks === undefined ? "" : this.state.selectedRecord.sdeviationremarks,
        soemname: this.state.selectedRecord.soemname === undefined ? "" : this.state.selectedRecord.soemname,
        // squotationleadtime: this.state.selectedRecord.squotationleadtime === undefined ? "" : this.state.selectedRecord.squotationleadtime

      };

     
    }

    if (((this.props.Login.operation === "create") || (this.props.Login.operation === "update")) && (this.props.Login.screenName === "IDS_QUOTATION")) {

      quotationData["quotation"]["nclientcatcode"] = this.state.selectedRecord["nclientcatcode"] ? this.state.selectedRecord["nclientcatcode"].value
        : transactionStatus.NA;

      quotationData["quotation"]["nclientcode"] = this.state.selectedRecord["nclientcode"]!=="" ? this.state.selectedRecord["nclientcode"].value
        : transactionStatus.NA;

        quotationData["quotation"]["nclientsitecode"] = this.state.selectedRecord["nclientsitecode"]!=="" ? this.state.selectedRecord["nclientsitecode"].value
        : transactionStatus.NA;

        quotationData["quotation"]["nclientcontactcode"] = this.state.selectedRecord["nclientcontactcode"]!=="" ? this.state.selectedRecord["nclientcontactcode"].value
        : transactionStatus.NA;

        quotationData["quotation"]["noemcode"] = this.state.selectedRecord["noemcode"]!== undefined ? this.state.selectedRecord["noemcode"].value
        : transactionStatus.NA;

    // quotationData["quotation"]["nquotationtypecode"] = this.state.selectedRecord["nquotationtypecode"]!=="" ? this.state.selectedRecord["nquotationtypecode"].value
    //   : transactionStatus.NA;

      quotationData["quotation"]["nquotationtypecode"] = transactionStatus.ACTIVE;
      quotationData["quotation"]["nprojecttypecode"] = this.state.selectedRecord["nprojecttypecode"] ? this.state.selectedRecord["nprojecttypecode"].value
        : transactionStatus.NA;

      quotationData["quotation"]["nprojectmastercode"] = this.state.selectedRecord["nprojectmastercode"]  ? this.state.selectedRecord["nprojectmastercode"].value
        : transactionStatus.NA;


 /*     quotationData["quotation"]["nuserrolecode"] = this.state.selectedRecord["nuserrolecode"]!=="" ? this.state.selectedRecord["nuserrolecode"]
         : transactionStatus.NA; */
        
      // quotationData["quotation"]["nusercode"] = this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"]
      //   : transactionStatus.NA;


 // quotationData["quotation"]["drfwdate"] = formatInputDate(this.state.selectedRecord["srfwdate"], false);
      quotationData["quotation"]["dquotationdate"] = this.QuotationformatInputDate(this.state.selectedRecord["dquotationdate"]);
 //     quotationData["quotation"]["dquotationdate"] = rearrangeDateFormat(quotationData.userinfo,this.state.selectedRecord["dquotationdate"]);
      quotationData["quotation"]["ntzrfwdate"] =  quotationData.userinfo.ntimezonecode ? quotationData.userinfo.ntimezonecode : "-1";
      quotationData["quotation"]["ntzquotationdate"] =  quotationData.userinfo.ntimezonecode ? quotationData.userinfo.ntimezonecode : "-1";

      quotationData["quotation"]["nproductcatcode"] = this.state.selectedRecord["nproductcatcode"]!=="" ? this.state.selectedRecord["nproductcatcode"].value
      : transactionStatus.NA;

      quotationData["quotation"]["nproductcode"] = this.state.selectedRecord["nproductcode"]!=="" ? this.state.selectedRecord["nproductcode"].value
      : transactionStatus.NA;
      
    }

if ((this.props.Login.operation  === "create") && (this.props.Login.screenName === "IDS_TEST")) {
          
      inputParam = this.onSaveQuotationTest(saveType, formRef);
  }

if ((this.props.Login.operation  === "update") && ((this.props.Login.screenName === "IDS_PRICE") || (this.props.Login.screenName === "IDS_CALCULATEPRICING")) ) {
      
    inputParam = this.onSaveQuotationTestPrice(saveType, formRef);
}

if ((this.props.Login.operation  === "create") && (this.props.Login.screenName === "IDS_CALCULATEPRICING")) {
          
  inputParam = this.onSaveGrossQuotation(saveType, formRef);
}

    
    if (((this.props.Login.operation === "create") || (this.props.Login.operation === "update")) && (this.props.Login.screenName === "IDS_QUOTATION")) {

      inputParam = {
        classUrl: "quotation",
        methodUrl: "Quotation",
        inputData: quotationData,
        operation: this.props.Login.operation,
        saveType,
        formRef,
        postParam,
        searchRef: this.searchRef,
        isClearSearch: this.props.Login.isClearSearch,
        selectedRecord:{...this.state.selectedRecord}
      };
    } 
    
   

  slideOutModal= ((this.props.Login.screenName === "IDS_TEST") || (this.props.Login.screenName === "IDS_PRICE") 
  || (this.props.Login.screenName === "IDS_CALCULATEPRICING")) ? "openChildModal" : "openModal";

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
      this.props.crudMaster(inputParam, masterData, slideOutModal);
    }

  };

  onSaveQuotationTest(saveType, formRef) {
    let inputData = [];
    inputData["userinfo"] = this.props.Login.userInfo;
    const masterData = this.props.Login.masterData;
    // inputData["supplier"] = this.props.masterData.SelectedSupplier;
  //  inputData["Quotation"] = {};


    let testArray = []
    testArray = this.state.selectedRecord.ntestcode.map(item => {
        let QuotationData = {}

        QuotationData["ntestcode"] = item.value
        QuotationData["nquotationcode"] = this.props.Login.masterData.SelectedQuotation.nquotationcode;
        QuotationData["nclientcode"] = this.props.Login.masterData.SelectedQuotation.nclientcode;
        QuotationData["nprojectmastercode"] = this.props.Login.masterData.SelectedQuotation.nprojectmastercode;


        return QuotationData;
    });
    inputData['QuotationTest'] = testArray;
    
    const inputParam = {
        classUrl: "quotation",
        methodUrl: "QuotationTest",
        inputData: inputData,masterData,
        operation: this.props.Login.operation, saveType, formRef,
        searchRef: this.searchRef,
        isClearSearch: this.props.Login.isClearSearch,
        isChild: true


    }
    return inputParam;
}


QuotationformatInputDate(date) {

  let formattedDate = "";

  formattedDate = date.getFullYear() + "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) +
      ("T00:00:00Z");

  return formattedDate;
}

onSaveQuotationTestPrice = (saveType, formRef) => {

  const quotationtestPriceData = {"userinfo": this.props.Login.userInfo,
                           "QuotationTest":this.props.Login.masterData.SelectedQuotation,
                           "nquotationcode":this.props.Login.masterData.SelectedQuotation.nquotationcode,
                           "nprojectmastercode":this.props.Login.masterData.SelectedQuotation.nprojectmastercode,
                          //  "nclientcatcode":this.props.Login.masterData.SelectedQuotation.nclientcatcode,
                           "nclientcode":this.props.Login.masterData.SelectedQuotation.nclientcode,
                          //  "nclientsitecode":this.props.Login.masterData.SelectedQuotation.nclientsitecode,
                          //  "nclientcontactcode":this.props.Login.masterData.SelectedQuotation.nclientcontactcode
                       //    "ncost":this.props.Login.selectedRecord[0].ncost
                          };

   let postParam = undefined;
   let dataState = undefined;
   let selectedId = null;
   
   if (this.props.Login.operation === "update") {
       // edit
       dataState = this.state.dataState;
       selectedId = this.props.Login.selectedId; 
       postParam = { inputListName: "Quotation", selectedObject: "SelectedQuotation", primaryKeyField: "nquotationcode" };

      //  let selectedRecord1=[this.props.Login.selectedRecord];
        let QuotationTestPriceArray=[];
      
       (this.props.Login.selectedRecord).forEach((item,index) => {
               if(item.ntotalamount<0){
                QuotationTestPriceArray[index]={...this.props.Login.selectedRecord[index],ntotalamount:0}
               } 

               QuotationTestPriceArray[index] = {
                 
                 namount: this.props.Login.selectedRecord[index].namount,
                 nclientcode: this.props.Login.masterData.SelectedQuotation.nclientcode,
                 ncost: this.props.Login.selectedRecord[index].ncost,
                 nnoofsamples: this.props.Login.selectedRecord[index].nnoofsamples,
                 nprojectmastercode: this.props.Login.selectedRecord[index].nprojectmastercode,
                 nquotationcode: this.props.Login.selectedRecord[index].nquotationcode,
                 nquotationtestcode: this.props.Login.selectedRecord[index].nquotationtestcode,
                 ntestcode: this.props.Login.selectedRecord[index].ntestcode, 
                 ntotalamount: this.props.Login.selectedRecord[index].ntotalamount,
                 ntotalgrosstamount: this.props.Login.selectedRecord[index].ntotalgrosstamount,
                //  stestdescription: this.props.Login.selectedRecord[index].stestdescription,
                 stestsynonym: this.props.Login.selectedRecord[index].stestsynonym,
                 //ALPD-4575
                 ndiscountbandcode: this.props.Login.selectedRecord[index].ndiscountbandcode ? this.props.Login.selectedRecord[index].ndiscountbandcode.value:-1,
                 stestplatform: this.props.Login.selectedRecord[index].stestplatform, 
                 squotationleadtime: this.props.Login.selectedRecord[index].squotationleadtime, 
                 snotes: this.props.Login.selectedRecord[index].snotes ,
                 nmethodcode: this.props.Login.selectedRecord[index].nmethodcode,
                 nclientcatcode: this.props.Login.masterData.SelectedQuotation.nclientcatcode,
                 nclientsitecode: this.props.Login.masterData.SelectedQuotation.nclientsitecode,
                 nclientcontactcode: this.props.Login.masterData.SelectedQuotation.nclientcontactcode

                };
         
     });
     
       quotationtestPriceData["QuotationTest"] = JSON.parse(JSON.stringify(QuotationTestPriceArray));           
   }
   else {
       //add               
                                          
       let priceList = [];
       this.state.selectedRecord["ntestcode"] &&
           this.state.selectedRecord["ntestcode"].map(item => {
               return priceList.push({
                  ntestcode: item.value                      
               })
           })
      
       quotationtestPriceData["QuotationTest"] = priceList;                             

   }
   if (quotationtestPriceData["QuotationTest"].hasOwnProperty('esignpassword')) {
       if (quotationtestPriceData["QuotationTest"]['esignpassword'] === '') {
           delete quotationtestPriceData["QuotationTest"]['esigncomments']
           delete quotationtestPriceData["QuotationTest"]['esignpassword']
           delete quotationtestPriceData["QuotationTest"]["agree"]
       }
   }
  //console.log("update data:", quotationtestPriceData);
   const inputParam = {
       classUrl: this.props.Login.inputParam.classUrl,
       methodUrl: "QuotationTest",
       inputData: quotationtestPriceData,
       operation: this.props.Login.operation,
       saveType, formRef, postParam, searchRef: this.searchRef,
       isClearSearch: this.props.Login.isClearSearch,
       selectedId, dataState
   }
   
   return inputParam;
}


onSaveGrossQuotation(saveType, formRef) {

  let quotationData = {};
  quotationData["userinfo"] = this.props.Login.userInfo;
 


  quotationData["GrossQuotation"] = {  

    nquotationcode: this.props.Login.masterData.SelectedQuotation.nquotationcode,
    nsitecode: this.props.Login.userInfo.nmastersitecode,
    ndiscountamount:this.state.selectedRecord.DiscountAmount,
    nvatamount:this.state.selectedRecord.VatAmount,
    ntotalnetamount:this.state.selectedRecord.TotalNetAmount,
    ntotalgrossamount : this.props.Login.QuotationGrossAmount[0].ntotalgrossamount,
    nclientcatcode:this.props.Login.masterData.SelectedQuotation.nclientcatcode,
    nclientcode:this.props.Login.masterData.SelectedQuotation.nclientcode,
    nclientsitecode:this.props.Login.masterData.SelectedQuotation.nclientsitecode,
    nclientcontactcode:this.props.Login.masterData.SelectedQuotation.nclientcontactcode,
    nprojectmastercode : this.props.Login.masterData.SelectedQuotation.nprojectmastercode
    
  };

  quotationData["GrossQuotation"]["ndiscountbandcode"] = this.state.selectedRecord["ndiscountbandcode"] ? this.state.selectedRecord["ndiscountbandcode"].value
  : transactionStatus.NA;

  quotationData["GrossQuotation"]["nvatbandcode"] = this.state.selectedRecord["nvatbandcode"] ? this.state.selectedRecord["nvatbandcode"].value
  : transactionStatus.NA;

  // const postParam = {
  //   inputListName: "Quotation",
  //   selectedObject: "SelectedQuotation",
  //   primaryKeyField: "nquotationcode",
  //   primaryKeyValue: this.props.Login.masterData.SelectedQuotation.nquotationcode,
  //   fetchUrl: "quotation/getQuotation",
  //   fecthInputObject: { userinfo: this.props.Login.userInfo },
  // };

  const inputParam = {
    classUrl: "quotation",
    methodUrl: "GrossQuotation",// postParam,
    inputData: quotationData,
    searchRef: this.searchRef,
    operation: this.props.Login.operation, saveType, formRef,
    isClearSearch: this.props.Login.isClearSearch,
    isChild: true
  }
 
  return inputParam;
}

 
  onNumericInputOnChange = (event, primaryFieldKey) => {
    const selectedRecord = this.state.selectedRecord || {};

     
        if(primaryFieldKey && ( event.target.name === "nnoofsamples" )){
            const index = selectedRecord.findIndex(item=>item.nquotationtestcode === primaryFieldKey);
            if (/^-?\d*?\.?\d*?$/.test(event.target.value)){
                selectedRecord[index]["nnoofsamples"] = event.target.value;
            }
        }
        else{      
            selectedRecord[event.target.name] = event.target.value;
        }           
    
    this.setState({ selectedRecord });
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
    this.props.validateEsignCredential(inputParam, "openModal");

  };



  DeleteQuotation = (methodUrl, selectedQuotation, operation, ncontrolCode) => {
    if (selectedQuotation.ntransactionstatus === transactionStatus.DRAFT) {
    const postParam = {
      inputListName: "QuotationList",
      selectedObject: "SelectedQuotation",
      primaryKeyField: "nquotationcode",
      primaryKeyValue: selectedQuotation.nquotationcode,
      fetchUrl: "quotation/getQuotation",
      fecthInputObject: { userinfo: this.props.Login.userInfo },
    };

    const inputParam = {
      classUrl: this.props.Login.inputParam.classUrl,
      methodUrl,
      postParam,
      inputData: {
        userinfo: this.props.Login.userInfo,
        quotation: selectedQuotation,
      },
      operation,
      isClearSearch: this.props.Login.isClearSearch,
      selectedRecord:{...this.state.selectedRecord}
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
          screenName: "IDS_QUOTATION",
          operation,
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.props.crudMaster(inputParam, masterData, "openModal");
    }
  }
  else if(selectedQuotation.ntransactionstatus === transactionStatus.APPROVED){

    toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTDELETEAPPROVEDQUOTATION" }));

  }else if(selectedQuotation.ntransactionstatus === transactionStatus.RETIRED){

    toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTDELETERETIREDQUOTATION" }));

  }
  };

  

  render() {


    let versionStatusCSS = "outline-secondary";
    let activeIconCSS = "fa fa-check"


    if (this.props.Login.masterData.SelectedQuotation && this.props.Login.masterData.SelectedQuotation.ntransactionstatus === transactionStatus.APPROVED) {
      versionStatusCSS = "outline-success";
    }
    else if (this.props.Login.masterData.SelectedQuotation && this.props.Login.masterData.SelectedQuotation.ntransactionstatus === transactionStatus.RETIRED) {
      versionStatusCSS = "outline-danger";
      activeIconCSS = "";
    }
    else if (this.props.Login.masterData.SelectedQuotation && this.props.Login.masterData.SelectedQuotation.ntransactionstatus === transactionStatus.DRAFT) {
      activeIconCSS = "";

    }
    
    

    if (this.props.Login.openModal || this.props.Login.modalShow) {
      this.mandatoryFields = this.findMandatoryFields(this.props.Login.screenName, this.state.selectedRecord, this.props.Login.operation)
    }


    const { userInfo } = this.props.Login;
    const addId = this.state.controlMap.has("AddQuotation") && this.state.controlMap.get("AddQuotation").ncontrolcode;
    const editId = this.state.controlMap.has("EditQuotation") && this.state.controlMap.get("EditQuotation").ncontrolcode;
    const deleteId = this.state.controlMap.has("DeleteQuotation") && this.state.controlMap.get("DeleteQuotation").ncontrolcode;
    const approveId = this.state.controlMap.has("ApproveQuotation") && this.state.controlMap.get("ApproveQuotation").ncontrolcode;
    const retireId = this.state.controlMap.has("RetireQuotation") && this.state.controlMap.get("RetireQuotation").ncontrolcode;
    const addQuotationTestId = this.state.controlMap.has("AddQuotationTest") && this.state.controlMap.get("AddQuotationTest").ncontrolcode;
    const updateQuotationTestId = this.state.controlMap.has("EditQuotationTest") && this.state.controlMap.get("EditQuotationTest").ncontrolcode;
    // const grossQuotationeId = this.state.controlMap.has("CalculatePricing") && this.state.controlMap.get("CalculatePricing").ncontrolcode;
    const viewQuotationId = this.state.controlMap.has("ViewQuotation") && this.state.controlMap.get("ViewQuotation").ncontrolcode;
    const viewreportId = this.state.controlMap.has("ViewReport") && this.state.controlMap.get("ViewReport").ncontrolcode;

    const editTestPriceParam = {screenName:"IDS_PRICE", "operation":"update", 
    masterData:this.props.Login.masterData, userInfo: this.props.Login.userInfo, 
    ncontrolCode:updateQuotationTestId};

  const selectedQuotation = this.props.Login.masterData.SelectedQuotation;

    const filterParam = {
      inputListName: "Quotation",
      selectedObject: "SelectedQuotation",
      primaryKeyField: "nquotationcode",
      fetchUrl: "quotation/getActiveQuotationById",
      fecthInputObject: { userinfo: this.props.Login.userInfo },
      masterData: this.props.Login.masterData,
      searchFieldList: this.searchFieldList,
    };
    
    return (
      <>
        <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
          
          <Row noGutters={true}>
            <Col md={`${!this.props.sidebarview ? '4' : "2"}`}>                
              <ListMaster
                screenName={this.props.intl.formatMessage({ id: "IDS_QUOTATION" })}
                masterData={this.props.Login.masterData}
                userInfo={this.props.Login.userInfo}
                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Quotation}
                getMasterDetail={(quotationData) => this.props.getQuotation(quotationData, this.props.Login.userInfo, this.props.Login.masterData)}
                selectedMaster={selectedQuotation}
                primaryKeyField="nquotationcode"
                mainField="squotationno"
                firstField="sclientname"
                secondField="sversionstatus"
                filterColumnData={this.props.filterColumnData}
                filterParam={filterParam}
                userRoleControlRights={this.state.userRoleControlRights}
                addId={addId}
                searchRef={this.searchRef}
                reloadData={this.reloadData}
                //     openModal={() => this.props.addQuotation("create", selectedQuotation, userInfo, addId, this.state.ProjectMasterList)}
                openModal={() => this.props.addQuotation("create", userInfo, addId, selectedQuotation)}
                isMultiSelecct={false}
                hidePaging={false}
                isClearSearch={this.props.Login.isClearSearch}
                openFilter={this.openFilter}
                closeFilter={this.closeFilter}
                // onFilterSubmit={this.onFilterSubmit}    
                showFilterIcon={false}
                showFilter={this.props.Login.showFilter}
       /*         filterComponent={[
                  {
                    "IDS_PROJECTMASTERFILTER":
                      <ProjectMasterFilter
                        filterProjectType={this.state.ProjectMasterList || []}
                        nfilterProjectType={this.props.Login.masterData.SelectedProjectType || {}}
                        onComboChange={this.onComboChange}
                        selectedRecord={this.state.selectedRecordfilter || {}}
                      />
                  }
                ]} */

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
              {selectedQuotation ?
                <ContentPanel className="panel-main-content">
                  <Card className="border-0">
                    <Card.Header>
                      {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                      <Card.Title className="product-title-main">
                        {selectedQuotation.sclientname}
                      </Card.Title>
                      <Card.Subtitle>
                        <div className="d-flex product-category">
                          <h2 className="product-title-sub flex-grow-1">

                            <span className={`btn btn-outlined ${versionStatusCSS} btn-sm mr-3`}>
                              {/* <i class={activeIconCSS}></i> */}
                              {selectedQuotation.sversionstatus}

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
                                selectedObject ={this.props.Login.masterData.SelectedQuotation}
                                screenHiddenDetails={this.state.userRoleControlRights.indexOf(editId) === -1}   
                                screenName={this.props.Login.screenName}
                                dataTip={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                rowList={[
                                  [
                                    {dataField:"sclientcatname", idsName:"IDS_CLIENTCATEGORY"},                                    
                                    {dataField:"soemnameview", idsName:"IDS_OEM"}                      
                                  ],
                                  [
                                    {dataField:"sclientname", idsName:"IDS_CLIENT"},
                                    {dataField: "sproductcatname", idsName: (this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] || "")},                  
                                  ],
                                  [
                                    {dataField:"scontactname", idsName:"IDS_CONTACTPERSON"},
                                    {dataField: "sproductname", idsName: (this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] || "")},            
                                  ],
                                  [
                                    {dataField:"sphoneno", idsName:"IDS_CONTACTNUMBER"},
                                    {dataField:"squotationdate", idsName:"IDS_QUOTATIONDATE"}                
                                  ],
                                  [
                                    {dataField:"semail", idsName:"IDS_EMAILID"}                        
                                  ],
                                  [
                                    {dataField:"sdescription", idsName:"IDS_DESCRIPTION"}
                                  ],
                                  [
                                    {dataField:"sdeviationremarks", idsName:"IDS_REMARKS"}
                                  ]
                                ]}
                            />
                        
                            {/* <Nav.Link className="btn btn-circle outline-grey mr-2" name="edittestname"
                              hidden={this.state.userRoleControlRights.indexOf(viewQuotationId) === -1}
                              data-tip={this.props.intl.formatMessage({ id: "IDS_VIEW" })}                              
                              onClick={() => this.QuotationPreview()}>
                              <FontAwesomeIcon icon={faEye} />
                            </Nav.Link> */}

                            <Nav.Link className="btn btn-circle outline-grey mr-2" name="edittestname"
                              hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                              data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                              //data-for="tooltip_list_wrap"
                              onClick={() => this.props.addQuotation("update",userInfo, editId, selectedQuotation )}>
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </Nav.Link>
                            
                            <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" name="deletetestname"
                              data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                              //   data-for="tooltip_list_wrap"
                              hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                              onClick={() => this.ConfirmDelete(selectedQuotation, "delete", deleteId, "Quotation")}>
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </Nav.Link>
                           

                            <Nav.Link name="approveQuotation" className="btn btn-circle outline-grey mr-2"
                              hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                              data-tip={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                              //data-for="tooltip_list_wrap"
                              onClick={() => this.approveQuotation("Quotation", selectedQuotation, "approve", approveId)}>
                              <FontAwesomeIcon icon={faThumbsUp} />
                            </Nav.Link>

                            <Nav.Link name="retireQuotation" className="btn btn-circle outline-grey mr-2"
                              hidden={this.state.userRoleControlRights.indexOf(retireId) === -1}
                              data-tip={this.props.intl.formatMessage({ id: "IDS_RETIRE" })}
                              //data-for="tooltip_list_wrap"
                              onClick={() => this.props.handleRetireQuotation("retire", userInfo, retireId, selectedQuotation)}
                              // onClick={() => this.retireQuotation(selectedQuotation, retireId)}
                            >
                              <RetireaQuotation/>
                              {/* <FontAwesomeIcon icon={faUserTimes} /> */}
                            </Nav.Link>

                            <Nav.Link name="reportQuotation" className="btn btn-circle outline-grey mr-2"
                              hidden={this.state.userRoleControlRights.indexOf(viewreportId) === -1}
                              data-tip={this.props.intl.formatMessage({ id: "IDS_VIEWREPORT" })}
                              //data-for="tooltip_list_wrap"
                              onClick={() =>this.props.generateControlBasedReport(viewreportId,selectedQuotation,this.props.Login,"Quotation",selectedQuotation.nquotationcode)}
                            > 
                            <FontAwesomeIcon icon={faFileAlt} /> 
                             </Nav.Link>

                          </div>
                          {/* </Tooltip> */}
                        </div>
                        {/* </Col>
                                            </Row> */}
                      </Card.Subtitle>
                    </Card.Header>
                    <Card.Body className="form-static-wrap">
                      
                      {/* <Col md={12}>
                        <div className="horizontal-line"></div>
                      </Col> */}
                     
                         
                      <Card className="at-tabs border-0">
                              {/* <Row noGutters>  --
                                  <Col md={12}>
                                      <div className="d-flex justify-content-end">
                                      <Nav.Link name="addPrice" className="add-txt-btn" 
                                              hidden={this.state.userRoleControlRights.indexOf(addQuotationTestId) === -1}
                                              onClick={()=>this.props.getQuotationAddTestService("IDS_TEST", "create", this.props.Login.masterData, this.props.Login.userInfo, addQuotationTestId)}
                                              >
                                            <FontAwesomeIcon icon={faPlus} /> { } 
                                          <FormattedMessage id='IDS_TEST' defaultMessage='Test' />
                                      </Nav.Link>
                                      <Nav.Link name="updatePrice" className="add-txt-btn" 
                                              hidden={this.state.userRoleControlRights.indexOf(updateQuotationTestId) === -1}
                                              onClick={()=>this.props.getQuotationPricingEditService({...editTestPriceParam, "updateType":"All", dataState:undefined})}
                                              >
                                          <FontAwesomeIcon icon={faPencilAlt} /> { }
                                          <FormattedMessage id='IDS_PRICE' defaultMessage='Price' />
                                      </Nav.Link>
                                      </div>
                                  </Col>
                              </Row> */}
                              {/* <Row noGutters>
                                  <Col md={12}>
                                      <DataGrid
                                          primaryKeyField={"nquotationtestcode"}
                                       // data={this.props.Login.masterData.QuotationTest}
                                          data={this.state.data}
                                       // dataResult={this.props.Login.masterData.QuotationTest}
                                      //  dataResult={process(this.props.Login.masterData.QuotationTest || [], this.state.quotationDataState)}
                                          dataResult={this.state.dataResult}
                                     //   dataState={this.state.quotationDataState}
                                          dataState={this.state.dataState}
                                       // dataStateChange={this.dataStateChange}
                                       //   dataStateChange={(event) => this.setState({ quotationDataState: event.dataState })}
                                          dataStateChange={this.dataStateChange}
                                          extractedColumnList={this.extractedColumnList}
                                          expandField="expanded"
                                          controlMap={this.state.controlMap}
                                          userRoleControlRights={this.state.userRoleControlRights}
                                          inputParam={this.props.Login.inputParam}
                                          userInfo={this.props.Login.userInfo}
                                          fetchRecord={this.props.getQuotationPricingEditService}
                                          editParam={{...editTestPriceParam, "updateType":"Single", dataState:this.state.dataState}}
                                          gridHeight={'335px'}
                                          deleteRecord={this.DeleteQuotationTest}
                                          deleteParam={{operation:"delete"}}
                                          methodUrl={"QuotationTest"}
                                          addRecord = {() => this.openModal(addId)}
                                          pageable={true}
                                          scrollable={'scrollable'}
                                          isActionRequired={true}
                                          isToolBarRequired={false}
                                          selectedId={this.props.Login.selectedId}
                                      />
                                  </Col>
                              </Row> */}

                                  <Card className="at-tabs border-0">
                                    <Row noGutters>
                                      <Col md={12}>
                                        <QuotationTab
                                          primaryKeyField={"nquotationtestcode"}
                                          // data={this.props.Login.masterData.ProjectMember}
                                          data={this.state.data}
                                          // dataResult={this.props.Login.masterData.ProjectMember}
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
                                          // dataState={this.props.Login.dataState}
                                          dataState={this.state.dataState}
                                          dataStateChange={this.dataStateChange}
                                          // extractedColumnList={fieldsForGrid} --
                                          controlMap={this.state.controlMap}
                                          userRoleControlRights={this.state.userRoleControlRights}
                                          inputParam={this.props.Login.inputParam}
                                          userInfo={this.props.Login.userInfo}
                                          //    getProjectmasterAddMemberService={(this.props.Login.screenName,this.props.Login.operation,this.props.getProjectmasterAddMemberService,this.props.Login.userInfo,this.props.Login.ncontrolCode)}
                                          getProjectmasterAddMemberService={this.props.getProjectmasterAddMemberService}
                                          // --   fetchRecord={this.props.getPricingEditService}
                                          //--       editParam={{...editTestPriceParam, "updateType":"Single", priceDataState:this.state.priceDataState}}
                                          //  deleteParam={{operation:"delete"}}
                                       
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
                                          // ntransactionstatus={selectedProjectMaster.ntransactionstatus}  ---
                                          //  selectedRecord={this.props.Login.selectedRecord}
                                          onDropProjectMasterFile={this.onDropProjectMasterFile}
                                          onInputOnChange={this.onInputOnChange}
                                          screenData={this.props.Login.screenData}
                                          deleteAttachment={this.deleteAttachment}
                                          ncontrolCode={this.props.Login.ncontrolCode}
                                          linkMaster= {this.props.Login.linkMaster}


                                          addQuotationTestId= {this.props.Login.addQuotationTestId}
                                          updateQuotationTestId= {this.props.Login.updateQuotationTestId}
                                          addId= {this.props.Login.addId}
                                          editParam={{...editTestPriceParam}}
                                          // fetchRecord={this.props.getQuotationPricingEditService}
                                          deleteRecord={this.DeleteQuotationTest}
                                          getQuotationAddTestService={this.props.getQuotationAddTestService}
                                          getQuotationPricingEditService={this.props.getQuotationPricingEditService}
                                          QuotationTestList={this.props.Login.QuotationTestList}
                                          onSaveClick={this.onSaveClick}
                                          onnetAmountEvent={this.onnetAmountEvent}
                                          onNumericInputChange={this.onNumericInputChange}
                                          DiscountBand={this.props.Login.DiscountBand}
                                          VATBand={this.props.Login.VATBand}
                                          modalScreenSize={this.props.Login.modalScreenSize}
                                          QuotationGrossAmount={this.props.Login.QuotationGrossAmount}

                                          QuotationHistorydata={this.props.Login.masterData.QuotationHistory}
                                          QuotationHistorydataResult={this.props.Login.masterData.QuotationHistory}
                                          historydataState={this.state.historydataState}
                                          historydataStateChange={this.historydataStateChange}
                                          selectedQuotation={selectedQuotation}
                                          GrossQuotation={this.props.GrossQuotation}
                                          EstimateQuotation={this.props.Login.masterData.GrossQuotation[0]}
                                          onFocus={this.handleFocus}
                                        />
                                      </Col>
                                    </Row>
                                  </Card>

                          <Col md={12}>
                            <div className="horizontal-line"></div>
                          </Col>

                         
                      {/* <Card>
                        <Card.Body>

                          <Row className='justify-content-end pr-2 m-0'>

                                <Nav.Link name="CalculatePricing" className="btn btn-circle outline-grey mr-2"
                                    hidden={this.state.userRoleControlRights.indexOf(grossQuotationeId) === -1}
                                    data-tip={this.props.intl.formatMessage({ id: "IDS_VATCALCULATION" })}
                                    onClick={() => this.props.GrossQuotation("create", userInfo, grossQuotationeId, selectedQuotation)}>
                                    
                                  <Quotationdiscount className="custom_icons" width="20" height="20" />
                                </Nav.Link>

                          </Row>  

                         <Row className='justify-content-end '>
                            <Col md="4">
                              <FormGroup>
                                <FormLabel>{this.props.intl.formatMessage({ id: "IDS_TOTALGROSSAMOUNT" })}</FormLabel>
                                <ReadOnlyText>{parseFloat((selectedQuotation.ntotalgrossamount).toFixed(2))}</ReadOnlyText>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                          <Col md="4">
                              <FormGroup>
                                <FormLabel>{this.props.intl.formatMessage({ id: "IDS_DISCOUNTBAND" })}</FormLabel>
                                <ReadOnlyText>{selectedQuotation.sdiscountbandname}</ReadOnlyText>
                              </FormGroup>
                            </Col>

                            <Col md="4">
                              <FormGroup>
                                <FormLabel>{this.props.intl.formatMessage({ id: "IDS_AMOUNT" })}</FormLabel>
                                <ReadOnlyText>{selectedQuotation.ndiscountpercentage}</ReadOnlyText>
                              </FormGroup>
                            </Col>

                            <Col md="4">
                              <FormGroup>
                                <FormLabel>{this.props.intl.formatMessage({ id: "IDS_DISCOUNTAMOUNT" })}</FormLabel>
                                <ReadOnlyText>{parseFloat((selectedQuotation.ndiscountamount).toFixed(2))} </ReadOnlyText>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                          <Col md="4">
                              <FormGroup>
                                <FormLabel>{this.props.intl.formatMessage({ id: "IDS_VATBAND" })}</FormLabel>
                                <ReadOnlyText>{selectedQuotation.svatbandname}</ReadOnlyText>
                              </FormGroup>
                          </Col>

                           
                            <Col md="4">
                              <FormGroup>
                                <FormLabel>{this.props.intl.formatMessage({ id: "IDS_AMOUNT" })}</FormLabel>
                                <ReadOnlyText>{selectedQuotation.nvatpercentage}</ReadOnlyText>
                              </FormGroup>
                            </Col>

                            <Col md="4">
                              <FormGroup>
                                <FormLabel>{this.props.intl.formatMessage({ id: "IDS_VATAMOUNT" })}</FormLabel>
                                <ReadOnlyText>{parseFloat((selectedQuotation.nvatamount).toFixed(2))} </ReadOnlyText>
                              </FormGroup>
                            </Col>

                          </Row>

                          <Row className='justify-content-end'>
                          <Col md="4">

                            <FormGroup>
                              <FormLabel>{this.props.intl.formatMessage({ id: "IDS_TOTALNETAMOUNT" })}</FormLabel>
                                <ReadOnlyText>{parseFloat((selectedQuotation.ntotalnetamount).toFixed(2))}</ReadOnlyText>
                            </FormGroup>

                           </Col>


                          </Row>         
                        </Card.Body>
                      </Card> */}
                      </Card>
                      {/* <Card className="at-tabs border-0">
                        <Row noGutters>
                          <Col md={12}>
                            <QuotationTab
                              primaryKeyField={"nprojectmembercode"}
                              // data={this.props.Login.masterData.ProjectMember}
                              data={this.state.data}
                              // dataResult={this.props.Login.masterData.ProjectMember}
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
                              // dataState={this.props.Login.dataState}
                              dataState={this.state.dataState}
                              dataStateChange={this.dataStateChange}
                              // extractedColumnList={fieldsForGrid} --
                              controlMap={this.state.controlMap}
                              userRoleControlRights={this.state.userRoleControlRights}
                              inputParam={this.props.Login.inputParam}
                              userInfo={this.props.Login.userInfo}
                              //    getProjectmasterAddMemberService={(this.props.Login.screenName,this.props.Login.operation,this.props.getProjectmasterAddMemberService,this.props.Login.userInfo,this.props.Login.ncontrolCode)}
                              getProjectmasterAddMemberService={this.props.getProjectmasterAddMemberService}
                              // --   fetchRecord={this.props.getPricingEditService}
                              //--       editParam={{...editTestPriceParam, "updateType":"Single", priceDataState:this.state.priceDataState}}
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
                              // ntransactionstatus={selectedProjectMaster.ntransactionstatus}  ---
                              //  selectedRecord={this.props.Login.selectedRecord}
                              onDropProjectMasterFile={this.onDropProjectMasterFile}
                              onInputOnChange={this.onInputOnChange}
                              screenData={this.props.Login.screenData}
                              deleteAttachment={this.deleteAttachment}
                              ncontrolCode={this.props.Login.ncontrolCode}
                              linkMaster= {this.props.Login.linkMaster}


                              addQuotationTestId= {this.props.Login.addQuotationTestId}
                              updateQuotationTestId= {this.props.Login.updateQuotationTestId}
                              addId= {this.props.Login.addId}
                              editParam={{...editTestPriceParam}}
                              fetchRecord={this.props.getQuotationPricingEditService}
                              deleteRecord={this.DeleteQuotationTest}
                             
                            />
                          </Col>
                        </Row>
                      </Card> */}



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
        {this.props.Login.openModal &&
           <SlideOutModal
           show={this.props.Login.openModal}
           size={this.props.Login.modalScreenSize===true ? "xl" : "lg" }
           closeModal={this.closeModal}
           hideSave={this.props.Login.screenName ===  "IDS_VIEW" ? true :  false}
           operation={(this.props.Login.screenName === "IDS_CALCULATEPRICING" || this.props.Login.screenName === "IDS_VIEW") ? "" :  this.props.Login.operation}
           inputParam={this.props.Login.inputParam}
           screenName={this.props.Login.screenName}
           onSaveClick={this.onSaveClick}
           esign={this.props.Login.loadEsign}
           validateEsign={this.validateEsign}
           selectedRecord={this.state.selectedRecord || {}} 
          //  mandatoryFields={this.props.Login.screenName !=="IDS_PRICE" ? this.mandatoryFields : []}
           mandatoryFields={ this.mandatoryFields} 
           addComponent={this.props.Login.loadEsign ?
            <Esign
               operation={this.props.Login.operation}
               onInputOnChange={this.onInputOnChange}
               inputParam={this.props.Login.inputParam}
               selectedRecord={this.state.selectedRecord || {}}
             />
             : (this.props.Login.screenName === "IDS_QUOTATION") ?

               <AddQuotation

                userInfo={this.props.Login.userInfo}
                genericlabel={this.props.Login.genericLabel}
                selectedRecord={this.state.selectedRecord || {}}
                // selectedclientcode={this.state.selectedRecord.nclientcode || {}}
                sclientsiteaddress={this.props.Login.sclientsiteaddress}
                SelectedClient={this.props.Login.SelectedClient}
                ClientCategory={this.props.Login.ClientCategory}
                Client={this.props.Login.Client}
                ClientSite={this.props.Login.ClientSite}
                ClientContact={this.props.Login.ClientContact}
                OEM={this.props.Login.OEM}
                ProjectCode={this.props.Login.ProjectCode}
                ProjectType={this.props.Login.ProjectType}
                ProjectMaster={this.props.Login.ProjectMaster}
                QuotationType={this.props.Login.QuotationType}
                Product={this.props.Login.Product}
                ProductCategory={this.props.Login.ProductCategory}
                onInputOnChange={this.onInputOnChange}
                onComboChange={this.onComboChange}
         //     onNumericInputChange={this.onNumericInputChange}
                 handleDateChange={this.handleDateChange}
               /> 
              : (this.props.Login.screenName === "IDS_VIEW") ? 

               <AddQuotationPreview

                selectedQuotation ={this.props.Login.masterData.SelectedQuotation}
                userInfo={this.props.Login.userInfo}
                genericlabel={this.props.Login.genericLabel}
              ></AddQuotationPreview> : ""
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
          mandatoryFields={this.mandatoryFields}
          updateStore={this.props.updateStore}
          selectedRecord={this.state.selectedRecord || {}}
          modalTitle={this.props.Login.modalTitle}
          modalBody={
              this.props.Login.modalTitle === "IDS_RETIREQUOTATION" ? (
              <RetireQuotation
                selectedRecord={this.state.selectedRecord || {}}
                // Status={this.props.Login.screenName === "IDS_RETIRE"}
                TimeZoneList={this.props.Login.TimeZoneList}
                onInputOnChange={this.onInputOnChange}
                handleDateChange={this.handleDateChange}
                userInfo={this.props.Login.userInfo}
                esign={this.props.Login.loadEsign}
              />
            ) : ""
          }
        />
          ) : (
            ""
        )
      }
        {/* End of Modal Sideout for Test Creation */}
      </>
    );
  }

  findMandatoryFields(screenName, selectedRecord, operation) {
    let mandatoryFields = [];
    if (screenName === "IDS_QUOTATION" && operation !== "retire") {

      mandatoryFields = [
        { "idsName": "IDS_CLIENTCATEGORY", "dataField": "nclientcatcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_CLIENT", "dataField": "nclientcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_CLIENTSITE", "dataField": "nclientsitecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_CONTACTNAME", "dataField": "nclientcontactcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
//      { "idsName": "IDS_OEM", "dataField": "noemcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
//      { "idsName": "IDS_INVOICEADDRESS", "dataField": "sinvoiceaddress", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
//      { "idsName": "IDS_QUOTATIONTYPE", "dataField": "nquotationtypecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
//      { "idsName": "IDS_PROJECTTYPE", "dataField": "nprojecttypecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
//      { "idsName": "IDS_PROJECTCODE", "dataField": "nprojectmastercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
//      { "idsName": "IDS_PROJECTTITLE", "dataField": "sprojecttitle", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
//      { "idsName": "IDS_RFWDATE", "dataField": "srfwdate", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "textbox" },
 //     { "idsName": "IDS_ROLE", "dataField": "suserrolename", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
 //     { "idsName": "IDS_USER", "dataField": "susername", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": (this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] || ""), "dataField": "nproductcatcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": (this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] || ""), "dataField": "nproductcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

        { "idsName": "IDS_QUOTATIONDATE", "dataField": "dquotationdate", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },
        
      ]

      // mandatoryFields.forEach(item => item.mandatory === true && mandatoryFields.push(item));
      return mandatoryFields;

    } else if (screenName === "IDS_QUOTATION" && operation === "retire") {

      mandatoryFields = [
        { "idsName": "IDS_RETIREDATE", "dataField": "dretiredatetime", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "selectbox" },

      ]
      return mandatoryFields;
    }
    else {
      return [];
    }
  }

  QuotationPreview = () => {

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {
        screenName: "IDS_VIEW",
        openModal: true,
        operation: "create",
        modalScreenSize : false
        
      },
    };

    this.props.updateStore(updateInfo);
  };



  onComboChange = (comboData, fieldName, caseNo, nquotationtestcode) => {

    const selectedRecord = this.state.selectedRecord || {};
    if(comboData!==null){
      switch (caseNo) {
        case 1:

        if(fieldName==="nclientcatcode"){
        // const selectedRecord = this.state.selectedRecord || {};
          if (selectedRecord.nclientcatcode) {
            if (parseInt(comboData.value) !== parseInt(selectedRecord.nclientcatcode.value)) {
            // selectedRecord.nusercode={};
            delete (selectedRecord.nclientcode);
            delete (selectedRecord.nclientsitecode);
            delete (selectedRecord.nclientcontactcode);
            }
          }

          selectedRecord[fieldName] = comboData;
          selectedRecord["sclientcatname"] = comboData.item["sclientcatname"];
          this.props.getQuotationClientCategoryComboService({

          inputData: {
            userinfo: this.props.Login.userInfo,
            sdisplayname: selectedRecord.nclientcatcode.label,
            primarykey: selectedRecord.nclientcatcode.value,
          }

        }, selectedRecord);
      }

      if(fieldName==="nclientcode"){
        // const selectedRecord = this.state.selectedRecord || {};
        if (selectedRecord.nclientcode) {
          if (parseInt(comboData.value) !== parseInt(selectedRecord.nclientcode.value)) {
            // selectedRecord.nusercode={};
            delete (selectedRecord.nclientsitecode);
            delete (selectedRecord.nclientcontactcode);
            
          }
        }

        selectedRecord[fieldName] = comboData;
        selectedRecord["sclientname"] = comboData.item["sclientname"];
        this.props.getQuotaionClientComboService({

          inputData: {
            userinfo: this.props.Login.userInfo,
            sdisplayname: selectedRecord.nclientcode.label,
            primarykey: selectedRecord.nclientcode.value,
          }

        }, selectedRecord);
      }

      if(fieldName==="nclientsitecode"){
        // const selectedRecord = this.state.selectedRecord || {};
        if (selectedRecord.nclientsitecode) {
          if (parseInt(comboData.value) !== parseInt(selectedRecord.nclientsitecode.value)) {
            // selectedRecord.nusercode={};
            delete (selectedRecord.nclientcontactcode);
            
          }
        }

        selectedRecord[fieldName] = comboData;
        selectedRecord["sclientsitename"] = comboData.item["sclientsitename"];
        this.props.getQuotaionClientSiteComboService({

          inputData: {
            userinfo: this.props.Login.userInfo,
            sdisplayname: selectedRecord.nclientsitecode.label,
            primarykey: selectedRecord.nclientsitecode.value,
            nclientcode: selectedRecord.nclientcode.value,
          }

        }, selectedRecord);
      }

      if(fieldName==="nproductcatcode"){ //
        // const selectedRecord = this.state.selectedRecord || {};
        if (selectedRecord.nproductcatcode) {
          if (parseInt(comboData.value) !== parseInt(selectedRecord.nproductcatcode.value)) {
            // selectedRecord.nusercode={};
            delete (selectedRecord.nproductcode);
            
          }
        }

        selectedRecord[fieldName] = comboData;
        selectedRecord["sproductcatname"] = comboData.item["sproductcatname"];
        this.props.getQuotaionProductCategoryComboService({

          inputData: {
            userinfo: this.props.Login.userInfo,
            sdisplayname: selectedRecord.nproductcatcode.label,
            primarykey: selectedRecord.nproductcatcode.value,
          }

        }, selectedRecord);
      }

        break;

      case 2:

        // const selectedRecordfilter = this.state.selectedRecordfilter || {};
        // selectedRecordfilter[fieldName] = comboData;
        // this.setState({ selectedRecordfilter });
        // break;

        // const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
        break;
        
      case 3:

        selectedRecord[fieldName] = comboData;

        if ( selectedRecord[fieldName]==null ){
          
          selectedRecord[fieldName]=[];

          if(fieldName==="ndiscountbandcode"){

            selectedRecord["DiscountAmount"]=0;
            selectedRecord["ndiscountpercentage"]= 0;

          }else if(fieldName==="nvatbandcode"){

            selectedRecord["VatAmount"]=0;
            selectedRecord["nvatpercentage"] =0;

          }
          selectedRecord["TotalNetAmount"]=parseFloat(((this.props.Login.QuotationGrossAmount[0].ntotalgrossamount+selectedRecord.VatAmount)-this.state.selectedRecord.DiscountAmount).toFixed(2));

        }else{

          if(fieldName==="ndiscountbandcode"){

            const VatAmount=(this.state.selectedRecord.VatAmount === undefined ? 0.00 : this.state.selectedRecord.VatAmount)
            selectedRecord["DiscountAmount"]=parseFloat((this.props.Login.QuotationGrossAmount[0].ntotalgrossamount * (selectedRecord.ndiscountbandcode.item.namount/100)).toFixed(2));
        //  selectedRecord["TotalNetAmount"]=this.props.Login.QuotationGrossAmount[0].ntotalgrossamount+(this.state.selectedRecord.DiscountAmount-VatAmount);
            selectedRecord["TotalNetAmount"]=parseFloat(((this.props.Login.QuotationGrossAmount[0].ntotalgrossamount+VatAmount)-this.state.selectedRecord.DiscountAmount).toFixed(2));
            selectedRecord["ndiscountpercentage"]= selectedRecord.ndiscountbandcode.item.namount;
  
  
          }else if(fieldName==="nvatbandcode"){
  
              selectedRecord["VatAmount"]=parseFloat((this.props.Login.QuotationGrossAmount[0].ntotalgrossamount * (selectedRecord.nvatbandcode.item.namount/100)).toFixed(2));
              //            selectedRecord["TotalNetAmount"]=this.props.Login.QuotationGrossAmount[0].ntotalgrossamount+(selectedRecord.DiscountAmount-this.state.selectedRecord.VatAmount);
              selectedRecord["TotalNetAmount"]=parseFloat(((this.props.Login.QuotationGrossAmount[0].ntotalgrossamount+this.state.selectedRecord.VatAmount)-selectedRecord.DiscountAmount).toFixed(2));
              selectedRecord["nvatpercentage"] = selectedRecord.nvatbandcode.item.namount; 
  
          }

        }
       
        this.setState({ selectedRecord });
        break;

        case 4:
         
          if(fieldName==="nprojecttypecode"){
            if (selectedRecord.nprojecttypecode) {
              if (parseInt(comboData.value) !== parseInt(selectedRecord.nprojecttypecode.value)) {
                delete (selectedRecord.nprojectmastercode);
                delete (selectedRecord.sprojecttitle);
                delete (selectedRecord.srfwdate);
                delete (selectedRecord.suserrolename);
                delete (selectedRecord.susername);
              }
            }
    
            selectedRecord[fieldName] = comboData;
            selectedRecord["sprojecttypename"] = comboData.item["sprojecttypename"];
            this.props.getProjectTypeComboService({
    
              inputData: {
                userinfo: this.props.Login.userInfo,
                sdisplayname: selectedRecord.nprojecttypecode.label,
                primarykey: selectedRecord.nprojecttypecode.value,
              }
    
            }, selectedRecord);
          }

          if(fieldName==="nprojectmastercode"){
            if (selectedRecord.nprojectmastercode) {
              if (parseInt(comboData.value) !== parseInt(selectedRecord.nprojectmastercode.value)) {
                delete (selectedRecord.sprojecttitle);
                delete (selectedRecord.srfwdate);
                delete (selectedRecord.suserrolename);
                delete (selectedRecord.susername);
              }
            }
    
            selectedRecord[fieldName] = comboData;
            selectedRecord["sprojectcode"] = comboData.item["sprojectcode"];
            this.props.getProjectCodeComboService({
    
              inputData: {
                userinfo: this.props.Login.userInfo,
                sdisplayname: selectedRecord.nprojectmastercode.label,
                primarykey: selectedRecord.nprojectmastercode.value,
              }
    
            }, selectedRecord);
          }

          break;
          case 5:

            let selectedRecordindex=selectedRecord.findIndex((item) => (item.nquotationtestcode === nquotationtestcode ? item : ""));
            selectedRecord[fieldName] = comboData;

            if (selectedRecord[fieldName]==null){
              
              selectedRecord[selectedRecordindex][fieldName]=[];
    
            }else{

            //  selectedRecord[fieldName] = comboData;
            //  selectedRecord["namount"]=comboData.item.namount;
            let str=selectedRecord[selectedRecordindex];
            let discountamount = parseFloat(( (str.ncost * str.nnoofsamples) * (comboData.item.namount/100)).toFixed(2));
            let count= ( str.ncost * str.nnoofsamples ) - ( discountamount ); 
            selectedRecord[selectedRecordindex]={...str, ntotalamount:parseFloat((count).toFixed(2)), namount:comboData.item.namount , ndiscountbandcode:comboData.item.ndiscountbandcode}
            selectedRecord[selectedRecordindex]["ndiscountbandcode"]={label :comboData.item.sdiscountbandname,value:comboData.item.ndiscountbandcode}

          //    selectedRecord[selectedRecordindex]["ndiscountbandcode"]=  {...selectedRecord[selectedRecordindex],

          //     label :comboData.item.sdiscountbandname,
          //     value:comboData.item.ndiscountbandcode
              
          // }
            }
          

           this.setState(selectedRecord);

          break;
      default:
        break;
    };
  }
  else{
    if(fieldName === 'noemcode'){
      delete (selectedRecord.noemcode);

    }
    //ALPD-4575
    switch (caseNo) {
      case 3:

      if(fieldName === 'ndiscountbandcode'){
        delete (selectedRecord.ndiscountbandcode);
  
      }

       break;
      case 5:
        if(fieldName === 'ndiscountbandcode'){
          //ALPD-5600 Quotation-->while edit the price in quotation cant able to clear the discount band
          let selectedRecordindex=selectedRecord.findIndex((item) => (item.nquotationtestcode === nquotationtestcode ? item : ""));
          //delete (selectedRecord[0].ndiscountbandcode);
          delete (selectedRecord[selectedRecordindex].ndiscountbandcode);
        }    
      break;
    }
    
  this.setState({selectedRecord});
  }
}

  // onNumericInputChange = (event, primaryFieldKey) => {
  //   // console.log("value:", value, name);
  //    const selectedRecord = this.state.selectedRecord || {};
  //    if (event.target.name === "nnoofsamples") {
  //     const index = selectedRecord.findIndex(item=>item.nquotationtestcode === primaryFieldKey);
  //        if (/^-?\d*?$/.test(event.target.value) || event.target.value === "") {
    
  //         selectedRecord[index][event.target.name] = event.target.value;
  //        }
  //    }
  //    else {
  //     selectedRecord[event.target.name] = event.target.value;
  //    }
  
  //    this.setState({ selectedRecord });
  // }

  closeModalShow = () => {
    let loadEsign = this.props.Login.loadEsign;

    let modalShow = this.props.Login.modalShow;
    let popUp = this.props.Login.popUp;
    let selectedRecord = this.props.Login.selectedRecord;
    if (this.props.Login.loadEsign) {
      loadEsign = false;
    } else {
      modalShow = false;
      selectedRecord = {};
      popUp = undefined;
    }

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { modalShow, selectedRecord, selectedId: null, loadEsign, popUp },
    };
    this.props.updateStore(updateInfo);
  };

  onNumericInputChange = (value, name,primaryFieldKey) => {

     const selectedRecord = this.state.selectedRecord || {};
     const index = selectedRecord.findIndex(item=>item.nquotationtestcode === primaryFieldKey);
     selectedRecord[index][name] = value;
   

     this.setState({ selectedRecord });
 }

  onInputOnChange = (event, primaryFieldKey) => {
    const selectedRecord = this.state.selectedRecord || {};

    if (event.target.name === 'snotes' || event.target.name === 'stestplatform' || event.target.name === 'squotationleadtime') {

      const index = selectedRecord.findIndex(item=>item.nquotationtestcode === primaryFieldKey);
      selectedRecord[index][event.target.name] = event.target.value;

    }
    else if (event.target.type === 'checkbox') {
      if (event.target.name === "ntransactionstatus")
        selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.RETIRED;
      else
        selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
    }
    else {   
        if(primaryFieldKey && (event.target.name === "ncost" || event.target.name === "nnoofsamples" || event.target.name === "ntotalamount")){
            const index = selectedRecord.findIndex(item=>item.nquotationtestcode === primaryFieldKey);
            // if (/^-?\d*?\.?\d*?$/.test(event.target.value)){
              if (/^-?\d*?$/.test(event.target.value)) {
                selectedRecord[index][event.target.name] = event.target.value;
            }
        }
        else{      
            selectedRecord[event.target.name] = event.target.value;
        }           
    }
    this.setState({ selectedRecord });
}

onnetAmountEvent = (nquotationtestcode) => {

  let selectedRecord=this.state.selectedRecord;
  let selectedRecordindex=selectedRecord.findIndex((item) => (item.nquotationtestcode === nquotationtestcode ? item : ""));
  let str=selectedRecord[selectedRecordindex];
//  let count= (str.ncost * str.nnoofsamples)-str.namount; 
  let discountamount = parseFloat(( (str.ncost * str.nnoofsamples) * (str.namount/100)).toFixed(2));
  let count= ( str.ncost * str.nnoofsamples ) - ( discountamount ); 
  // selectedRecord[selectedRecordindex]={...str,ntotalamount:count}
  selectedRecord[selectedRecordindex]={...str,ntotalamount: parseFloat((count).toFixed(2))}

  this.setState(selectedRecord);

  
} 



  approveQuotation = (methodUrl, selectedQuotation, operation, ncontrolCode) => {
    if (selectedQuotation.ntransactionstatus === transactionStatus.DRAFT) {

      const postParam = {
        inputListName: "Quotation",
        selectedObject: "SelectedQuotation",
        primaryKeyField: "nquotationcode",
        primaryKeyValue: selectedQuotation.nquotationcode,
        fetchUrl: "quotation/getQuotation",
        fecthInputObject: { userinfo: this.props.Login.userInfo },
      };

      const inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl, postParam,
        inputData: {
          "userinfo": this.props.Login.userInfo, 
          "quotation": selectedQuotation
        },
        operation,
        isClearSearch: this.props.Login.isClearSearch,
        selectedRecord:{...this.state.selectedRecord}
      }

      const masterData = this.props.Login.masterData;

      if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            loadEsign: true, screenData: { inputParam, masterData },
            openModal: true, screenName: "IDS_QUOTATION", operation
          }
        }
        this.props.updateStore(updateInfo);
      }
      else {
        this.props.crudMaster(inputParam, masterData, "openModal");
      }
    }else if(selectedQuotation.ntransactionstatus === transactionStatus.APPROVED){

      toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYAPPROVED" }));

    }else if(selectedQuotation.ntransactionstatus === transactionStatus.RETIRED){

      toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYRETIRED" }));

    }
    else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }));
    }

  }

  onSaveModalClick = () => {
    console.log("savemodal");
    let inputData = {};
    let quotationData = [];

    if (this.props.Login.masterData.SelectedQuotation && this.props.Login.masterData.SelectedQuotation.ntransactionstatus === transactionStatus.APPROVED) {
      const retireId = this.state.controlMap.has("RetireQuotation") && this.state.controlMap.get("RetireQuotation").ncontrolcode;
      let inputParam = {};
      const postParam = {
        inputListName: "Quotation",
        selectedObject: "SelectedQuotation",
        primaryKeyField: "nquotationcode",
        primaryKeyValue: this.props.Login.masterData.SelectedQuotation.nquotationcode,
        fetchUrl: "quotation/getQuotation",
        fecthInputObject: { userinfo: this.props.Login.userInfo },
      };
      if(this.props.Login.modalTitle==="IDS_RETIREQUOTATION"){
        if (this.state.selectedRecord["dretiredatetime"] !== null) {
          quotationData["dtransactiondate"] = formatInputDate(this.state.selectedRecord["dretiredatetime"],false);
          quotationData["ntransdatetimezonecode"] =  this.props.Login.userInfo.ntimezonecode ? this.props.Login.userInfo.ntimezonecode : "-1";
                quotationData["sretireremarks"] = this.state.selectedRecord["sretireremarks"] ? this.state.selectedRecord["sretireremarks"]  : "";
                quotationData["nquotationcode"] = this.props.Login.masterData.SelectedQuotation.nquotationcode;
                quotationData["nquotationversioncode"] = this.props.Login.masterData.SelectedQuotation.nquotationversioncode;

                inputParam = {
                  classUrl: this.props.Login.inputParam.classUrl,
                  methodUrl : "Quotation", postParam,
                  inputData: {
                    "userinfo": this.props.Login.userInfo,
                    "quotation": {...this.props.Login.masterData.SelectedQuotation, "dtransactiondate":quotationData["dtransactiondate"], "sretireremarks" : quotationData["sretireremarks"] ,"nquotationcode": quotationData["nquotationcode"], "nquotationversioncode": quotationData["nquotationversioncode"], "ntransdatetimezonecode": quotationData["ntransdatetimezonecode"]}
                  },
                  operation:this.props.Login.operation,
                  isClearSearch: this.props.Login.isClearSearch,
                  selectedRecord:{...this.state.selectedRecord}
                }
      
            const masterData = this.props.Login.masterData;

          if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, retireId)) {
            const updateInfo = {
              typeName: DEFAULT_RETURN,
              data: {
                loadEsign: true, screenData: { inputParam, masterData },openModal: true,
                modalShow: false, screenName: "IDS_QUOTATION", operation:this.props.Login.operation
              }
            }
            this.props.updateStore(updateInfo);
          }else {
            this.props.modalSave(inputParam, masterData);
          }
        }else{
          toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDATE" }));
        }
      }
    
    }else if(this.props.Login.masterData.SelectedQuotation.ntransactionstatus === transactionStatus.RETIRED){

      toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYRETIRED" }));

    }
    else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDQUOTATION" }));
    }

  };


  onTabChange = (tabProps) => {
    const screenName = tabProps.screenName;
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { screenName },
    };
    this.props.updateStore(updateInfo);
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
handleFocus(e){
  e.target.select();
}
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

  ConfirmDelete = (selectedQuotation, operation, deleteId, screenName) => {
    this.confirmMessage.confirm(
      "deleteMessage",
      this.props.intl.formatMessage({ id: "IDS_DELETE" }),
      this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
      this.props.intl.formatMessage({ id: "IDS_OK" }),
      this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
      () =>
        this.DeleteQuotation(
          screenName,
          selectedQuotation,
          operation,
          deleteId

        )
    );
  };
  reloadData = () => {
    this.searchRef.current.value = "";

//    if (Object.values(this.props.Login.masterData.SelectedQuotation).length && this.props.Login.masterData.SelectedQuotation !== undefined) {
      // if (this.props.Login.masterData.SelectedQuotation !== undefined) {
      let inputParam = {
        inputData: {
     
          userinfo: this.props.Login.userInfo,
          
        },
        classUrl: "quotation",
        methodUrl: "Quotation",
      };

      this.props.getreloadQuotation(inputParam);

    // } 
    // else {
    //   toast.warn(
    //     this.props.intl.formatMessage({
    //       id: "IDS_PROJECTTYPENOTAVAILABLE",
    //     })
    //   );
    // }
  };

  DeleteQuotationTest = (deleteParam) =>{

  
    deleteParam.selectedRecord["nclientcode"]=this.props.Login.masterData.SelectedQuotation.nclientcode;
    deleteParam.selectedRecord["nprojectmastercode"]=this.props.Login.masterData.SelectedQuotation.nprojectmastercode;
    deleteParam.selectedRecord["nclientcatcode"]=this.props.Login.masterData.SelectedQuotation.nclientcatcode;
    deleteParam.selectedRecord["nclientsitecode"]=this.props.Login.masterData.SelectedQuotation.nclientsitecode;
    deleteParam.selectedRecord["nclientcontactcode"]=this.props.Login.masterData.SelectedQuotation.nclientcontactcode;

    const postParam = { 
      
      inputListName: "QuotationList", selectedObject: "SelectedQuotation",
      primaryKeyField: "nquotationcode", primaryKeyValue: deleteParam.selectedRecord.nquotationtestcode,
      fetchUrl: "quotation/getQuotationTest",
      fecthInputObject: { userinfo: this.props.Login.userInfo }
  };

    const inputParam = {
        classUrl: "quotation",
        methodUrl: "QuotationPrice",
        postParam,

        inputData: {
            "QuotationTestPrice": deleteParam.selectedRecord,//.dataItem,
      //      "npriceversioncode":this.props.Login.masterData.SelectedTestPriceVersion.npriceversioncode,
            "userinfo": this.props.Login.userInfo,

        },
        operation:"delete",
     //  priceDataState:this.state.priceDataState
    }

    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_TESTPRICE" }),
                operation:deleteParam.operation
            }
        }
        this.props.updateStore(updateInfo);
    }
    else {
        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
    }
}


  closeModal = () => {
    let loadEsign = this.props.Login.loadEsign;
    let modalShow = this.props.Login.modalShow;
    let openModal = this.props.Login.openModal;
    let selectedRecord = this.state.selectedRecord;
//    let selectedRecord = this.state.selectedRecord;
    if (this.props.Login.loadEsign) {
        if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve" ) {
            loadEsign = false;
            openModal = false;
            selectedRecord = {};
        }
        else if(this.props.Login.operation === "retire"){
            loadEsign = false;
            openModal = false;
            modalShow = true;
            // selectedRecord['esignpassword'] = '';
            // selectedRecord['esigncomments'] = '';
            // selectedRecord['esignreason'] = '';
        }
        else {
            loadEsign = false;
            selectedRecord['esignpassword'] = '';
            selectedRecord['esigncomments'] = '';
            selectedRecord['esignreason'] = '';
        } 
    }
    else {
        openModal = false;
        modalShow = false;
        selectedRecord = {};
    }

    const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: { openModal, loadEsign, selectedRecord ,modalShow}
    }
    this.props.updateStore(updateInfo);

}

  componentDidUpdate(previousProps) {
    let {
      selectedRecord,
      userRoleControlRights,
      controlMap,
      filterData,dataResult
      
    } = this.state;

    if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
      selectedRecord = this.props.Login.selectedRecord;
      this.setState({ selectedRecord });
    }


//   if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
//     userRoleControlRights = [];
//     if (this.props.Login.userRoleControlRights) {
//       this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode
//       ] &&
//         Object.values(
//           this.props.Login.userRoleControlRights[
//           this.props.Login.userInfo.nformcode
//           ]
//         ).map((item) => userRoleControlRights.push(item.ncontrolcode));
//     }
//     controlMap = getControlMap(
//       this.props.Login.userRoleControlRights,
//       this.props.Login.userInfo.nformcode
//     );
//     // this.setState({ controlMap, userRoleControlRights });


//     this.setState({
//       userRoleControlRights, controlMap, data: this.props.Login.masterData.QuotationTest,
//       dataResult: process(this.props.Login.masterData.QuotationTest, this.state.dataState)
//   });
//   }
//   else {

//     let {dataState}=this.state;
//         if(this.state.dataResult !== undefined){ 
//             if(this.state.dataResult.data){
//                 if(this.state.dataResult.data.length ===1){
//                     let skipcount=this.state.dataState.skip>0?(this.state.dataState.skip-this.state.dataState.take):
//                     this.state.dataState.skip
//                     dataState={skip:skipcount,take:this.state.dataState.take}
//                 }
//               } 

//               this.setState({
//                 dataResult: process( this.props.Login.masterData || [], dataState),
//                 dataState
//           });
//     }
    
// }

    if (this.props.Login.masterData !== previousProps.Login.masterData) {

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
        // this.setState({ controlMap, userRoleControlRights });
  
  
        this.setState({
          userRoleControlRights, controlMap, data: this.props.Login.masterData.QuotationTest,
          dataResult: process(this.props.Login.masterData.QuotationTest || [], this.state.dataState),

          // QuotationHistorydataResult: process(this.props.Login.masterData.QuotationHistory || [], this.state.historydataState)
          // QuotationHistorydata: this.props.Login.masterData.QuotationHistory, QuotationHistorydataResult: process(this.props.Login.masterData.QuotationHistory || [], this.state.dataState)
      });
      
   
      
      }
      else {
  
        let {dataState}=this.state;
        // let {historydataState}=this.state;
            if(this.state.dataResult !== undefined){ 
                if(this.state.dataResult.data){
                    if(this.state.dataResult.data.length ===1){
                        let skipcount=this.state.dataState.skip>0?(this.state.dataState.skip-this.state.dataState.take):
                        this.state.dataState.skip
                        dataState={skip:skipcount,take:this.state.dataState.take}
                    }
                  } 
  
                  this.setState({
                    data: this.props.Login.masterData.QuotationTest,
                    dataResult: process( this.props.Login.masterData.QuotationTest || [], dataState),
                    dataState 
                    // QuotationHistorydata: this.props.Login.masterData.QuotationHistory, QuotationHistorydataResult: process(this.props.Login.masterData.QuotationHistory || [], this.state.dataState)

              });
        }

  //       if(this.state.QuotationHistorydataResult !== undefined){ 
  //         if(this.state.QuotationHistorydataResult.data){
  //             if(this.state.QuotationHistorydataResult.data.length ===1){
  //                 let skipcount=this.state.historydataState.skip>0?(this.state.historydataState.skip-this.state.historydataState.take):
  //                 this.state.historydataState.skip
  //                 historydataState={skip:skipcount,take:this.state.historydataState.take}
  //             }
  //           } 

  //           this.setState({
  //             QuotationHistorydata: this.props.Login.masterData.QuotationHistory,
  //             QuotationHistorydataResult: process( this.props.Login.masterData.QuotationHistory || [], historydataState),
  //             historydataState 
  //             // QuotationHistorydata: this.props.Login.masterData.QuotationHistory, QuotationHistorydataResult: process(this.props.Login.masterData.QuotationHistory || [], this.state.dataState)

  //       });
  // }
        
    }
      // dataResult = this.props.Login.masterData.QuotationTest;
      // this.setState({
      //   selectedRecord,dataResult
      // });

      // this.setState({ filterData });
    }


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

  
}

export default connect(mapStateToProps, {
  callService,
  crudMaster,
  filterColumnData,
  updateStore,
  validateEsignCredential,
  getQuotation,getProjectTypeComboService,
  viewAttachment, addQuotation, getreloadQuotation, getQuotationAddTestService, getQuotationPricingEditService,modalSave,handleRetireQuotation,
   GrossQuotation,getQuotationClientCategoryComboService,getQuotaionClientComboService,getProjectCodeComboService ,
   getQuotaionProductCategoryComboService,getQuotaionClientSiteComboService,generateControlBasedReport
})(injectIntl(Quotation));
