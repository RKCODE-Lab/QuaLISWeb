import React, { Component } from "react";
import { toast } from "react-toastify";
import { injectIntl } from "react-intl";
import { process } from "@progress/kendo-data-query";
import "../../assets/styles/lims-global-theme.css";
import SlideOutModal from "../../components/slide-out-modal/SlideOutModal";
import { DEFAULT_RETURN } from "../../actions/LoginTypes";
import {
  showEsign,  
  convertDateValuetoString, 
  formatInputDate,
} from "../../components/CommonScript";
import Esign from "../audittrail/Esign";
import AddMethodValidity from "./AddMethodValidity";
//import ValidateFormula from './ValidateFormula';
import {
  transactionStatus,
  FORMULAFIELDTYPE,
} from "../../components/Enumeration";
import CustomTab from "../../components/custom-tabs/custom-tabs.component";
import MethodValidityTab from "./MethodValidityTab";
import ConfirmMessage from "../../components/confirm-alert/confirm-message.component";
import { rearrangeDateFormatDateOnly } from './../../components/CommonScript';

class MethodValidityView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRecord: {},
      fieldFlag: true,
      operatorFlag: false,
      functionFlag: true,
      methodvalidityDataState: { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5},
      methodDataState: { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 },
      selectedComponent:""
    };
    this.confirmMessage = new ConfirmMessage();
  }

  render() {
    const { SelectedMethod } = this.props.masterData;
    
    // const mandatoryFields = [
    //   {
    //     idsName: "IDS_VALIDITYSTARTDATE",
    //     dataField: "dvaliditystartdate",
    //     mandatoryLabel: "IDS_SELECT",
    //     controlType: "selectbox",
    //   },
    //   {
    //     idsName: "IDS_VALIDITYENDDATE",
    //     dataField: "dvalidityenddate",
    //     mandatoryLabel: "IDS_SELECT",
    //     controlType: "selectbox",
    //   },
    // ];
    return (
      <>
        {SelectedMethod && (
          <CustomTab
            tabDetail={this.tabDetail()}
            onTabChange={this.onTabChange}
          />
        )}

        {this.props.openChildModal && (
          <SlideOutModal
            show={this.props.openChildModal}
            closeModal={this.closeModal}
            operation={this.props.operation}
            inputParam={this.props.inputParam}
            screenName={"IDS_METHODVALIDITY"}
            onSaveClick={this.onSaveClick}
            esign={this.props.loadEsign}
            validateEsign={this.validateEsign}
            selectedRecord={this.state.selectedRecord || {}}
            mandatoryFields={this.mandatoryFields}
            addComponent={
              this.props.loadEsign ? (
                <Esign
                  operation={this.props.operation}
                  onInputOnChange={this.onEsignInputOnChange}
                  inputParam={this.props.inputParam}
                  selectedRecord={this.state.selectedRecord || {}}
                />
              ) : (
                <AddMethodValidity
                  selectedRecord={this.state.selectedRecord || {}}
                  methodvalidity={this.props.MethodValidity}
                  handleDateChange={this.handleDateChange}
                  userInfo={this.props.userInfo}
                />
              )
            }
          />
        )}
      </>
    );
  }
  handleDateChange = (dateName, dateValue, sdatename) => {
    const { selectedRecord } = this.state;
    // if(dateName === "dvaliditystartdate")
    // {
    //   selectedRecord["dvalidityenddate"] = dateValue;  
    // }
    selectedRecord[dateName] = dateValue;
    selectedRecord[sdatename] = dateValue;
    this.setState({ selectedRecord });
  };
  onTabChange = (tabProps) => {
    const screenName = tabProps.screenName;
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { screenName },
    };
    this.props.updateStore(updateInfo);
  };
  
  tabDetail = () => {
    const tabMap = new Map();

    for(let i=0;i<this.props.masterData["MethodValidity"].length;i++)
    {
      this.props.masterData["MethodValidity"][i].svaliditystartdate=rearrangeDateFormatDateOnly(this.props.userInfo,this.props.masterData["MethodValidity"][i].svaliditystartdate);
      this.props.masterData["MethodValidity"][i].svalidityenddate=rearrangeDateFormatDateOnly(this.props.userInfo,this.props.masterData["MethodValidity"][i].svalidityenddate);
    }

    tabMap.set(
      "IDS_METHODVALIDITY",
      <MethodValidityTab
        controlMap={this.props.controlMap}
        userRoleControlRights={this.props.userRoleControlRights}
        operation = {this.props.operation}
        dataResult={process(
          this.props.masterData["MethodValidity"],
          this.state.methodvalidityDataState )}
        dataState={this.state.methodvalidityDataState }
        dataStateChange={(event) =>
          this.setState({ methodvalidityDataState: event.dataState })
        }
        selectedMethod={this.props.masterData.SelectedMethod}
        fetchMethodValidityById={this.props.fetchMethodValidityById}
        editParam={this.props.editParam}
        userInfo={this.props.userInfo}
        inputParam={this.props.inputParam}
        selectedComponent={this.state.selectedComponent}
        handleComponentRowClick={this.handleComponentRowClick}
        formatMessage={this.props.intl.formatMessage}
        deleteRecord={this.deleteRecord}
        onApproveClick={this.onApproveClick}
        openChildModal={this.openChildModal}
        defaultRecord={this.defaultRecord}
        selectedId={this.props.selectedId}
        getAvailableValidityData={this.props.getAvailableValidityData}
        MethodValidity={this.props.masterData.MethodValidity || []}
        screenName="IDS_METHODVALIDITY"
        approveParam={this.props.approveParam}
      />
    );

    return tabMap;
  };
  handleComponentRowClick = (event) => {
    let selectedComponent = event.dataItem;
    // let SelectedTest = this.props.Login.Test && this.props.Login.Test[selectedComponent.slno] ? this.props.Login.Test[selectedComponent.slno] : [];
    const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          operation:""
            // SelectedTest, selectedComponent,
            // testDataState: {
            //     skip: 0, take: this.props.Login.settings ?
            //         parseInt(this.props.Login.settings[14]) : 5
            // }
        }
    }
    this.props.updateStore(updateInfo);
    this.setState({selectedComponent});

};
  openChildModal = () => {
    if(this.props.selectedMethod.nneedvalidity===transactionStatus.YES)
    {
    const addParam = {
      screenName: "IDS_METHOD", operation: "create", primaryKeyName: "nmethodvaliditycode",
      masterData: this.props.masterData, userInfo: this.props.userInfo
     
  }
  this.props.getMethodValidityUTCDate(addParam);
}
else
{
  toast.warn(this.props.intl.formatMessage({ id: "IDS_ENABLEMETHODVALIDITY" }));
}
    //let selectedRecord={};
    // const updateInfo = {
    //   typeName: DEFAULT_RETURN,
    //   data: { openChildModal: true,operation:"create" },
    // };//,selectedRecord
    // this.props.updateStore(updateInfo);
  };
    onApproveClick = (selectedDataItem, operation, primaryKeyName) => {
      if (selectedDataItem.dataItem.ntransactionstatus === transactionStatus.DRAFT) {
   // if (this.state.selectedComponent.ntransactionstatus === transactionStatus.DRAFT) {
        const approveId = this.props.controlMap.has("ApproveMethodValidity") && this.props.controlMap.get("ApproveMethodValidity").ncontrolcode
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;

        let obj= convertDateValuetoString(selectedDataItem.dataItem.svaliditystartdate ? selectedDataItem.dataItem.svaliditystartdate: new Date(),selectedDataItem.dataItem.svalidityenddate ? selectedDataItem.dataItem.svalidityenddate : new Date(),this.props.userInfo);
        selectedDataItem.dataItem.stempvaliditystartdate=obj.fromDate+"Z";
        selectedDataItem.dataItem.stempvalidityenddate=obj.toDate+"Z";

        //add               
        let postParam = undefined;
        inputData["methodvalidity"] =selectedDataItem.dataItem;
        postParam = { inputListName: "methodvalidity", selectedObject: "MethodValidity", primaryKeyField: "nmethodvaliditycode",
        primaryKeyValue: this.state.selectedRecord["nmethodvaliditycode"],
         fetchUrl: "method/getActiveMethodValidityById", fecthInputObject: { userinfo: this.props.userInfo },
         masterData: this.props.masterData 
      }
        const inputParam = {
            classUrl: "method",
            methodUrl: "MethodValidity",
            inputData: inputData,
            operation: "approve", postParam
        }
      
        const masterData = this.props.masterData;

        const esignNeeded = showEsign(this.props.esignRights, this.props.userInfo.nformcode, approveId);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, screenName: "IDS_METHOD", openChildModal: true, operation: "approve",selectedRecord: {}
                }
            }
            this.props.updateStore(updateInfo);
            
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openChildModal",{});
        }

  //  }
    // else {
    //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOAPPROVE" }));
    // }
      }
      else {
        toast.warn(this.props.intl.formatMessage({ id: "IDS_NOTEDITDELETEMETHODVALIDITY" }));
    }

}
  deleteRecord = (deleteParam) => {
    if (deleteParam.selectedRecord.ntransactionstatus === transactionStatus.DRAFT) {
    const methodUrl = deleteParam.methodUrl;
    const selected = deleteParam.selectedRecord;
    let dataState = undefined;
    if (this.props.screenName === "IDS_SECTION") {
      dataState = this.state.methodValidityDataState;
    }
    const inputParam = {
      inputData: {
        [methodUrl.toLowerCase()]: selected,
        userinfo: this.props.userInfo,
      },
      classUrl: "method",
      operation: deleteParam.operation,
      methodUrl: methodUrl,
      screenName: "IDS_METHOD",
      dataState,
    };
    const masterData = this.props.masterData;
    if (
      showEsign(
        this.props.esignRights,
        this.props.userInfo.nformcode,
        deleteParam.ncontrolCode
      )
    ) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true,
          screenData: { inputParam, masterData },
          openChildModal: true,
          screenName: "IDS_METHOD",
          operation: deleteParam.operation,
          selectedRecord: {},
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.props.crudMaster(inputParam, masterData, "openChildModal", {});
    }
  }
  else {
    toast.warn(this.props.intl.formatMessage({ id: "IDS_NOTEDITDELETEMETHODVALIDITY" }));
}
  };

  defaultRecord = (defaultParam, event) => {
    const methodUrl = defaultParam.methodUrl;
    let dataItem = defaultParam.selectedRecord;
    // dataItem["ndefaultstatus"] = transactionStatus.YES;
    let dataState = undefined;
    if (this.props.screenName === "IDS_SECTION") {
      dataState = this.state.methodValidityDataState;
    }
    const inputParam = {
      inputData: {
        [methodUrl.toLowerCase()]: dataItem,
        userinfo: this.props.userInfo,
      },
      classUrl: "method",
      operation: "setDefault",
      methodUrl: methodUrl,
      dataState,
    };
    const masterData = this.props.masterData;
    if (
      showEsign(
        this.props.esignRights,
        this.props.userInfo.nformcode,
        defaultParam.ncontrolCode
      )
    ) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true,
          screenData: { inputParam, masterData },
          openChildModal: true,
          screenName: "Method",
          operation: defaultParam.operation,
          selectedRecord: {},
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.props.crudMaster(inputParam, masterData, "openChildModal", {});
    }
  };
  closeModal = () => {
    let loadEsign = this.props.loadEsign;
    let openChildModal = this.props.openChildModal;
    let selectedRecord = this.props.selectedRecord;
    let selectedId = this.props.selectedId;
    if (this.props.loadEsign) {
      if (
        this.props.operation === "delete" ||
        this.props.operation === "approve"  
      ) {
        loadEsign = false;
        openChildModal = false;
        selectedRecord = {};
      } else {
        loadEsign = false;
        selectedRecord["agree"] = 4;
        selectedRecord["esignpassword"] = "";
        selectedRecord["esigncomments"] = "";
        selectedRecord['esignreason']=""
      }
    } else {
      openChildModal = false;
      selectedRecord = {};
      selectedId=null;
    }
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { openChildModal, loadEsign, selectedRecord,selectedId },
    };
    this.props.updateStore(updateInfo);
  };

  onComboChange = (comboData, fieldName, caseNo) => {
    let selectedRecord = this.state.selectedRecord || {};
    switch (caseNo) {
      case 1:
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;   
     
        this.setState({selectedRecord}); 
        // if (fieldName === "sparametername") {
        //   selectedRecord[fieldName] = comboData;
        //   selectedRecord["sparametersynonym"] = comboData.value;
        // } else {
        //   selectedRecord[fieldName] = comboData;
        // }
        // this.setState({ selectedRecord });
        break;

      case 2:
        const parameterData = this.props.parameterData;
        let item = comboData["item"];
        let needUnit = true;
        let needRoundingDigit = true;
        let needCodedResult = true;
        let needActualResult = true;
        let npredefinedcode = 4;
        if (item["nunitrequired"] === 3) {
          needUnit = false;
          selectedRecord["nunitcode"] = this.props.parameterData.defaultUnit;
        } else {
          selectedRecord["nunitcode"] = "";
        }
        if (item["nroundingrequired"] === 3) {
          needRoundingDigit = false;
        } else {
          selectedRecord["nroundingdigits"] = "";
        }
        if (item["npredefinedrequired"] === 3) {
          needCodedResult = false;
          npredefinedcode = item["npredefinedrequired"];
        } else {
          selectedRecord["spredefinedname"] = "";
        }
        if (item["ngraderequired"] === 3) {
          needActualResult = false;
          selectedRecord["ngradecode"] = this.props.parameterData.defaultGrade;
        } else {
          selectedRecord["ngradecode"] = "";
        }
        selectedRecord[fieldName] = comboData;
        const parameterInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            selectedRecord,
            parameterData: {
              ...parameterData,
              needUnit,
              needRoundingDigit,
              needCodedResult,
              needActualResult,
              npredefinedcode,
            },
          },
        };
        this.props.updateStore(parameterInfo);
        break;

      case 3:
        selectedRecord[fieldName] = comboData;
        this.props.formulaChangeFunction(
          {
            ntestcategorycode: comboData.value,
            nFlag: 2,
            userinfo: this.props.userInfo,
          },
          this.props.formulaData,
          1,
          selectedRecord,
          "/changeTestCatgoryInFormula"
        );
        break;

      case 4:
        selectedRecord[fieldName] = comboData;
        this.props.formulaChangeFunction(
          {
            ntestcode: comboData.value,
            nFlag: 3,
            userinfo: this.props.userInfo,
          },
          this.props.formulaData,
          2,
          selectedRecord,
          "/changeTestInFormula"
        );
        break;

      default:
        break;
    }
  };

  onEsignInputOnChange = (event) => {
    const selectedRecord = this.state.selectedRecord || {};
    if (event.target.type === "checkbox") {
      selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
    } else {
      selectedRecord[event.target.name] = event.target.value;
    }
    this.setState({ selectedRecord });
  };

  onInputOnChange = (event, caseNo, optional) => {
    const selectedRecord = this.state.selectedRecord || {};
    switch (caseNo) {
      case 1:
        if (event.target.type === "checkbox") {
          selectedRecord[event.target.name] =
            event.target.checked === true
              ? transactionStatus.YES
              : transactionStatus.NO;
        } else if (event.target.type === "radio") {
          selectedRecord[event.target.name] = optional;
          //  selectedRecord["sfilename"]="";
        } else {
          selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
        break;

      case 4:
        const inputValue = event.target.value;
        if (/^-?\d*?\.?\d*?$/.test(inputValue) || inputValue === "") {
          selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
        break;

      case 5:
        if (
          optional.ndynamicformulafieldcode === FORMULAFIELDTYPE.INTEGER &&
          optional.sdescription.indexOf("P$") === -1
        ) {
          const value = event.target.value.replace(/[^-^0-9]/g, "");
          const dynamicField = this.state.dynamicField || [];
          if (/^-?\d*?$/.test(value)) {
            if (!selectedRecord["formulainput"]) {
              selectedRecord["formulainput"] = {};
            }
            selectedRecord["formulainput"][event.target.name] = value;
            dynamicField[event.target.name] = {
              sparameter: optional.sdescription,
              svalues: value,
            };
          } else if (value === "") {
            if (!selectedRecord["formulainput"]) {
              selectedRecord["formulainput"] = {};
            }
            selectedRecord["formulainput"][event.target.name] = value;
            dynamicField[event.target.name] = {
              sparameter: optional.sdescription,
              svalues: value,
            };
          }
          this.setState({ dynamicField, selectedRecord });
          break;
        } else {
          const value = event.target.value.replace(/[^-^0-9.]/g, "");
          const dynamicField = this.state.dynamicField || [];
          if (/^-?\d*?\.?\d*?$/.test(value) || value !== "") {
            if (!selectedRecord["formulainput"]) {
              selectedRecord["formulainput"] = {};
            }
            selectedRecord["formulainput"][event.target.name] = value;
            dynamicField[event.target.name] = {
              sparameter: optional.sdescription,
              svalues: value,
            };
          }
          this.setState({ dynamicField, selectedRecord });
          break;
        }

      default:
        break;
    }
  };
  onSaveClick = (saveType, formRef) => {
    //add / edit
    let inputData = [];
    inputData["userinfo"] = this.props.userInfo;
    let postParam = undefined;
    let editId = this.props.controlMap.has("AddMethodValidity") && this.props.controlMap.get("AddMethodValidity").ncontrolcode
    // if (this.state.selectedRecord["ncommentsubtypecode"].value === 3) {
    //     if (this.state.selectedRecord["spredefinedname"] === undefined || 
    //          this.state.selectedRecord["spredefinedname"] === "") {
    //         toast.info("Enter PreDefined Name");
    //         return;
    //     }
    // }
  //   if (this.state.selectedRecord["dvalidityenddate"] !== undefined && this.state.selectedRecord["dvaliditystartdate"] !== undefined) {
  //     if (this.state.selectedRecord["dvalidityenddate"] < this.state.selectedRecord["dvaliditystartdate"]) {
  //         toast.info(this.props.intl.formatMessage({ id: "IDS_ENDDATEGRATERTHANSTARTDATE" }));
  //         return;
  //     }
  // }
  let obj= convertDateValuetoString(this.state.selectedRecord["dvaliditystartdate"] ? this.state.selectedRecord["dvaliditystartdate"]: new Date(),this.state.selectedRecord["dvalidityenddate"]?this.state.selectedRecord["dvalidityenddate"]:new Date(),this.props.userInfo);
  this.state.selectedRecord["svaliditystartdate"]=obj.fromDate;
  this.state.selectedRecord["svalidityenddate"]=obj.toDate;
    if (this.props.operation === "update") {
        // edit
        postParam = { inputListName: "methodvalidity", selectedObject: "MethodValidity", primaryKeyField: "nmethodvaliditycode",
        primaryKeyValue: this.state.selectedRecord["nmethodvaliditycode"],
         fetchUrl: "method/getActiveMethodValidityById", fecthInputObject: { userinfo: this.props.userInfo },
         masterData: this.props.masterData 
      }
        inputData["methodvalidity"] = { "nsitecode": this.props.userInfo.nmastersitecode };
        
        inputData["methodvalidity"]["dvaliditystartdate"] = this.state.selectedRecord["dvaliditystartdate"] ? formatInputDate(this.state.selectedRecord["dvaliditystartdate"]) : formatInputDate(new Date());
        inputData["methodvalidity"]["dvalidityenddate"] = this.state.selectedRecord["dvalidityenddate"] ? this.state.selectedRecord["dvalidityenddate"] : new Date();
        inputData["methodvalidity"]["svaliditystartdate"] = this.state.selectedRecord["svaliditystartdate"] ? this.state.selectedRecord["svaliditystartdate"] : new Date();
        inputData["methodvalidity"]["svalidityenddate"] = this.state.selectedRecord["svalidityenddate"] ? this.state.selectedRecord["svalidityenddate"] : new Date();
        inputData["methodvalidity"]["nmethodcode"] =this.props.selectedMethod.nmethodcode;
        inputData["methodvalidity"]["nmethodvaliditycode"] =this.state.selectedRecord["nmethodvaliditycode"] ? this.state.selectedRecord["nmethodvaliditycode"] : 0;
        editId = this.props.controlMap.has("EditMethodValidity") && this.props.controlMap.get("EditMethodValidity").ncontrolcode
    } else {
        inputData["methodvalidity"] = { "nsitecode": this.props.userInfo.nmastersitecode };
        
        inputData["methodvalidity"]["dvaliditystartdate"] = this.state.selectedRecord["dvaliditystartdate"] ? this.state.selectedRecord["dvaliditystartdate"] :new Date();
        inputData["methodvalidity"]["dvalidityenddate"] = this.state.selectedRecord["dvalidityenddate"] ? this.state.selectedRecord["dvalidityenddate"] : new Date();
        inputData["methodvalidity"]["svaliditystartdate"] = this.state.selectedRecord["svaliditystartdate"] ? this.state.selectedRecord["svaliditystartdate"] : new Date();
        inputData["methodvalidity"]["svalidityenddate"] = this.state.selectedRecord["svalidityenddate"] ? this.state.selectedRecord["svalidityenddate"] : new Date();
        inputData["methodvalidity"]["nmethodcode"] =this.props.selectedMethod.nmethodcode;
    }
    inputData["methodvalidity"]["ntzvaliditystartdatetimezone"] = this.state.selectedRecord[
      "ntzvaliditystartdatetimezone"
    ]
      ? this.state.selectedRecord["ntzvaliditystartdatetimezone"].value ||
      this.props.userInfo.ntimezonecode
      : this.props.userInfo.ntimezonecode;
  inputData["methodvalidity"]["ntzvalidityenddatetimezone"] = this.state.selectedRecord[
          "ntzvalidityenddatetimezone"
        ]
          ? this.state.selectedRecord["ntzvalidityenddatetimezone"].value ||
          this.props.userInfo.ntimezonecode
          : this.props.userInfo.ntimezonecode;
        
    const inputParam = {
        classUrl: "method",
        methodUrl: "MethodValidity",
        displayName:"IDS_METHOD",
        inputData: inputData,
        operation: this.props.operation,
        saveType, formRef, postParam, searchRef: this.searchRef
    }
    const masterData = this.props.masterData;
    const esignNeeded  = showEsign(this.props.esignRights, this.props.userInfo.nformcode, editId)
    if (esignNeeded) {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadEsign: true, screenData: { inputParam, masterData }, saveType
            }
        }
        this.props.updateStore(updateInfo);
    }
    else {
        
        this.props.crudMaster(inputParam, masterData, "openChildModal");
    }
  };
  validateEsign = () => {
    const inputParam = {
        inputData: {
            "userinfo": {
                ...this.props.userInfo,
                sreason: this.state.selectedRecord["esigncomments"],
                nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
           
            },
            password: this.state.selectedRecord["esignpassword"]
        },
        screenData: this.props.screenData
    }
    this.props.validateEsignCredential(inputParam, "openChildModal");
}
  ConfirmDelete = (deleteParam, deleteID) => {
    this.confirmMessage.confirm(
      "deleteMessage",
      this.props.intl.formatMessage({ id: "IDS_DELETE" }),
      this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
      this.props.intl.formatMessage({ id: "IDS_OK" }),
      this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
      () => this.deleteRecord(deleteParam)
    );
  };
  componentDidUpdate(previousProps) {
    if (this.props.selectedRecord !== previousProps.selectedRecord) {
      this.setState({ selectedRecord: this.props.selectedRecord });
    }

    
   
    if (this.props.masterData !== previousProps.masterData) {
      let { methodValidityDataState, selectedRecord } = this.state;
      if (this.props.dataState === undefined) {
        if (this.props.screenName === "IDS_METHODVALIDITY") {
          methodValidityDataState = { skip: 0, take: 10 };
        }
      }
      //this.props.masterData.MethodValidity
      
      this.setState({ methodValidityDataState, selectedRecord });
    }
    if (this.props.Login !== previousProps.Login) {
      this.PrevoiusLoginData = previousProps;
    }

    // if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
    //     this.setState({ selectedRecord: this.props.Login.selectedRecord });
    // }
    // if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
    //     const userRoleControlRights = [];
    //     if (this.props.Login.userRoleControlRights) {
    //         this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
    //             userRoleControlRights.push(item.ncontrolcode))
    //     }
    //     const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
    //     this.setState({ userRoleControlRights, controlMap });
    // }
  }
}
export default injectIntl(MethodValidityView);
