import React, { Component } from 'react';
import {ListWrapper} from '../../components/client-group.styles';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import rsapi from '../../rsapi';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
// import {
//     callService, crudMaster, getTestMaster, addTest, updateStore, getTestDetails, formulaChangeFunction, filterColumnData,
//     addParameter, validateEsignCredential, addCodedResult, addParameterSpecification, getAvailableData, addFormula,
//     changeTestCategoryFilter, addTestFile, viewAttachment,getActiveTestContainerTypeById
// } from '../../actions'
import { callService, crudMaster,getMethodComboService,getMethodDetail,getAvailableValidityData,fetchMethodValidityById,getMethodValidityUTCDate,updateStore, validateEsignCredential,filterColumnData } from '../../actions';
import MethodValidityView from './MethodValidityView';
import { injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
//import AddParameter from './AddParameter'
//import AddTest from '../../pages/testmanagement/AddTest'
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { getControlMap, showEsign, constructOptionList, convertDateValuetoString } from '../../components/CommonScript';
//import TestCategoryFilter from './TestCategoryFilter';
import ListMaster from '../../components/list-master/list-master.component';
import { faTrashAlt, faPencilAlt, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReadOnlyText, ContentPanel, MediaLabel } from '../../components/App.styles';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import Esign from '../audittrail/Esign';
// import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { parameterType, transactionStatus } from '../../components/Enumeration';
import 'react-perfect-scrollbar/dist/css/styles.css';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import AddMethod from './AddMethod';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
//import ReactTooltip from 'react-tooltip';
import { removeItems } from '@progress/kendo-react-treelist';


class Method extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            selectedRecord: {},
            error: "",
            userRoleControlRights: [],
            controlMap: new Map(),
            skip: 0,
            take: this.props.Login.settings ? this.props.Login.settings[3] : 25,
            sidebarview: false
        });
        this.searchRef = React.createRef();
       // this.searchFieldList = ["smethodname", "sdescription",  "smethodcategoryname", "stransactionstatus"];
        this.confirmMessage = new ConfirmMessage();
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }


    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "") {
            if (props.Login.errorCode === 417 || props.Login.errorCode === 409) {
                toast.warn(props.Login.masterStatus);
                props.Login.masterStatus = "";
            }
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    render() {

    //     const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
    //     && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

    //    const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
    //     && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;
    const addId = this.state.controlMap.has("AddMethod") && this.state.controlMap.get("AddMethod").ncontrolcode;
    const editId = this.state.controlMap.has("EditMethod") && this.state.controlMap.get("EditMethod").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteMethod") && this.state.controlMap.get("DeleteMethod").ncontrolcode;

        // const addParam = {screenName:"Method", primaryeyField: "nmethodcode", primaryKeyValue:undefined,  
        //     operation:"create", inputParam:this.props.Login.inputParam, userInfo : this.props.Login.userInfo, ncontrolCode: addId};

        //   const editParam = {screenName:this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), operation:"update", 
        //    primaryKeyField:"nmethodcode", inputParam:this.props.Login.inputParam,  userInfo:this.props.Login.userInfo,  ncontrolCode:editId};
        const addParam = {
            screenName: "IDS_METHOD", operation: "create", primaryKeyName: "nmethodcode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: addId
        }

        const editParam = {
            screenName: "IDS_METHOD", operation: "update", primaryKeyName: "nmethodcode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: editId, inputListName: "Method", selectedObject: "SelectedMethod"
        };
        const editValidityId = this.state.controlMap.has("EditMethodValidity") && this.state.controlMap.get("EditMethodValidity").ncontrolcode;
        const approveValidityId = this.state.controlMap.has("ApproveMethodValidity") && this.state.controlMap.get("ApproveMethodValidity").ncontrolcode;
    const editValidityParam = {
      screenName: "IDS_METHODVALIDITY", operation: "update", primaryKeyName: "nmethodvaliditycode",
      masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
      ncontrolcode: editValidityId, inputListName: "MethodValidity", selectedObject: "selectedRecord"
  };
  const approveValidityParam = {
    screenName: "IDS_METHODVALIDITY", operation: "approve", primaryKeyName: "nmethodvaliditycode",
    masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
    ncontrolcode: approveValidityId, inputListName: "MethodValidity", selectedObject: "selectedRecord"
};
        const mandatoryFields = [{"idsName":"IDS_METHODCATEGORY","dataField":"nmethodcatcode", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
        {"idsName":"IDS_METHODNAME","dataField":"smethodname", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
        // {idsName: "IDS_VALIDITYSTARTDATE",dataField: "dvaliditystartdate", mandatoryLabel: "IDS_SELECT",controlType: "selectbox"},
        // {idsName: "IDS_VALIDITYENDDATE",dataField: "dvalidityenddate",mandatoryLabel: "IDS_SELECT",controlType: "selectbox"},
        ];
        const deleteParam = { operation: "delete" };
        const filterParam = {
            inputListName: "Method", selectedObject: "SelectedMethod", primaryKeyField: "nmethodcode",
            fetchUrl: "method/getMethod", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["smethodname", "sdescription", "smethodcatname",'sdisplaystatus', "stransactionstatus"]
        };

        return (
            <>
                {/* Start of get display */}
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {/* {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    } */}
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                masterData={this.props.Login.masterData}
                                screenName={this.props.intl.formatMessage({ id: "IDS_METHOD" })}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Method}
                                getMasterDetail={(method) => this.props.getMethodDetail(method, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.SelectedMethod}
                                primaryKeyField="nmethodcode"
                                mainField="smethodname"
                                firstField="smethodcatname"
                                secondField="sdisplaystatus"
                                openModal={() => this.props.getMethodComboService(addParam)}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}

                                
                                
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
                            {this.props.Login.masterData.Method && this.props.Login.masterData.Method.length > 0 && this.props.Login.masterData.SelectedMethod && Object.values(this.props.Login.masterData.SelectedMethod).length > 0 ?
                                <ContentPanel className="panel-main-content">
                                    <Card className="border-0">
                                        <Card.Header>
                                            {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                            <Card.Title className="product-title-main">
                                                {this.props.Login.masterData.SelectedMethod.smethodname}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                {/* <Row>
                                                <Col md={8}> */}
                                                <div className="d-flex product-category">
                                                    <h2 className="product-title-sub flex-grow-1">
                                                        {/* <MediaLabel className={`btn btn-outlined ${this.props.Login.masterData.SelectedMethod.nstatus === 1 ? "outline-success" : "outline-secondary"} btn-sm ml-3`}>
                                                            {this.props.Login.masterData.SelectedMethod.nstatus === 1 && <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>}
                                                            {this.props.Login.masterData.SelectedMethod.sdisplaystatus}
                                                        </MediaLabel> */}
                                                        
                                                    </h2>
                                                    {/* </Col>
                                                <Col md="4"> */}
                                                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                    <div className="d-inline">
                                                       
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2" name="editmethodname"
                                                            hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            //data-for="tooltip_list_wrap"
                                                            onClick={() => this.props.getMethodComboService(editParam)}>
                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                        </Nav.Link>
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" name="deletemethodname"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            //data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                            onClick={() => this.ConfirmDelete(deleteParam,deleteId)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                            {/* <ConfirmDialog
                                                                    name="deleteMessage"
                                                                    message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                    doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                    doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                    icon={faTrashAlt}
                                                                    // title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                    hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(deleteId) === -1}
                                                                    handleClickDelete={() => this.deleteAction(SelectedTest, "delete", deleteId, "TestMaster", "openModal")}
                                                                /> */}
                                                        </Nav.Link>
                                                        
                                                    </div>
                                                    {/* </Tooltip> */}
                                                </div>
                                                {/* </Col>
                                            </Row> */}
                                            </Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body className="form-static-wrap">
                                            <Row>
                                            <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_REMARKS" })}</FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedMethod.sdescription}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}</FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedMethod.sdisplaystatus}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                {/* <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_METHODVALIDITYENABLE" })}</FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedMethod.smethodvalidityenable}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col> */}
                                                
                                                {/* <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_DISPLAYSTATUS" })}</FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedMethod.sdisplaystatus}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col> */}

                                                
                                               
                                                {/* End Here */}
                                            </Row>
                                            <MethodValidityView
                                                userInfo={this.props.Login.userInfo}
                                                dataState={this.props.Login.dataState}
                                                masterData={this.props.Login.masterData}
                                                inputParam={this.props.Login.inputParam}
                                                controlMap={this.state.controlMap}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                esignRights={this.props.Login.userRoleControlRights}
                                                screenData={this.props.Login.screenData}
                                                openChildModal={this.props.Login.openChildModal}
                                                fetchMethodValidityById={this.props.fetchMethodValidityById}
                                                editParam={editValidityParam}
                                                operation={this.props.Login.operation}
                                                screenName={this.props.Login.screenName}
                                                selectedRecord={this.props.Login.selectedRecord}
                                                selectedMethod={this.props.Login.masterData.SelectedMethod}
                                                loadEsign={this.props.Login.loadEsign}
                                                ncontrolCode={this.props.Login.ncontrolCode}
                                                crudMaster={this.props.crudMaster}
                                                getAvailableValidityData={this.props.getAvailableValidityData}
                                                getMethodDetails={this.props.getMethodDetails}
                                                getMethodValidityUTCDate={this.props.getMethodValidityUTCDate}
                                                updateStore={this.props.updateStore}
                                                validateEsignCredential={this.props.validateEsignCredential}
                                                settings = {this.props.Login.settings}
                                                selectedId={this.props.Login.selectedId}
                                                approveParam ={approveValidityParam}
                                            ></MethodValidityView>
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
                        closeModal={this.closeModal}
                        showSaveContinue={true}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields || []}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                onInputOnChange={this.onEsignInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddMethod  
                            selectedRecord={this.state.selectedRecord ||{}}                                  
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange} 
                            handleDateChange={this.handleDateChange}
                            methodCategoryList={this.props.Login.methodCategoryList ||[]}
                            operation={this.props.Login.operation}
                            userInfo={this.props.Login.userInfo}
                            inputParam={this.props.Login.inputParam}  
                            />
                        }
                    />
                }
                {/* End of Modal Sideout for Test Creation */}
            </>
        );
    }
   
    onSaveClick = (saveType, formRef) => {
        // if (this.state.selectedRecord["dvalidityenddate"] !== undefined && this.state.selectedRecord["dvaliditystartdate"] !== undefined) {
        //     if (this.state.selectedRecord["dvalidityenddate"] < this.state.selectedRecord["dvaliditystartdate"]) {
        //         toast.info(this.props.intl.formatMessage({ id: "IDS_ENDDATEGRATERTHANSTARTDATE" }));
        //         return;
        //     }
        // }
        //add / edit            
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        let selectedId = null;
        inputData["method"]={};
        if ( this.props.Login.operation === "update"){
            // edit
            delete this.state.selectedRecord["dcurrentdate"];
            dataState = this.state.dataState;
            //inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            selectedId = this.props.Login.selectedRecord.nmethodcode;              
            inputData["method"]["nmethodcode"] = this.props.Login.selectedRecord.nmethodcode;
        }
        else{
            //add               
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = {"nsitecode":this.props.Login.userInfo.nmastersitecode};      
           
        }   

        inputData["method"]["ndefaultstatus"] = this.state.selectedRecord["ndefaultstatus"] !== undefined && this.state.selectedRecord["ndefaultstatus"]? this.state.selectedRecord["ndefaultstatus"]:transactionStatus.NO;
        inputData["method"]["nmethodcatcode"] = this.state.selectedRecord["nmethodcatcode"]? this.state.selectedRecord["nmethodcatcode"].value:"";
        inputData["method"]["smethodname"] = this.state.selectedRecord["smethodname"]? this.state.selectedRecord["smethodname"]:"";
        inputData["method"]["nneedvalidity"] = this.state.selectedRecord["nneedvalidity"] !== undefined && this.state.selectedRecord["nneedvalidity"]? this.state.selectedRecord["nneedvalidity"]:transactionStatus.NO;
        inputData["method"]["sdescription"] = this.state.selectedRecord["sdescription"]? this.state.selectedRecord["sdescription"]:"";
       
        inputData["methodvalidity"]={};

        let clearSelectedRecordField=[
            {"idsName":"IDS_DEFAULTSTATUS","dataField":"ndefaultstatus","width":"200px","isClearField":true,"preSetValue":4},
            
            {"idsName":"IDS_METHODNAME","dataField":"smethodname","width":"200px","isClearField":true},
            {"idsName":"IDS_NEEDVALIDITY","dataField":"nneedvalidity","width":"200px","isClearField":true,"preSetValue":4},
            {"idsName":"IDS_DESCRIPTION","dataField":"sdescription","width":"200px","isClearField":true},
            
            
            
        ];

        if(this.state.selectedRecord["nneedvalidity"] === transactionStatus.YES)
        {
            let obj= convertDateValuetoString(this.state.selectedRecord["dvaliditystartdate"] ? this.state.selectedRecord["dvaliditystartdate"]: new Date(),this.state.selectedRecord["dvalidityenddate"]?this.state.selectedRecord["dvalidityenddate"]:new Date(),this.props.Login.userInfo);
            this.state.selectedRecord["svaliditystartdate"]=obj.fromDate;
            this.state.selectedRecord["svalidityenddate"]=obj.toDate;

            inputData["methodvalidity"]["dvaliditystartdate"] = this.state.selectedRecord["dvaliditystartdate"] ? this.state.selectedRecord["dvaliditystartdate"] : new Date();
            inputData["methodvalidity"]["dvalidityenddate"] = this.state.selectedRecord["dvalidityenddate"] ? this.state.selectedRecord["dvalidityenddate"] : new Date();
            inputData["methodvalidity"]["svaliditystartdate"] = this.state.selectedRecord["svaliditystartdate"] ? this.state.selectedRecord["svaliditystartdate"] : new Date();
            inputData["methodvalidity"]["svalidityenddate"] = this.state.selectedRecord["svalidityenddate"] ? this.state.selectedRecord["svalidityenddate"] : new Date();

            inputData["methodvalidity"]["ntzvaliditystartdatetimezone"] = this.state.selectedRecord["ntzvaliditystartdatetimezone"]
                                                                        ? this.state.selectedRecord["ntzvaliditystartdatetimezone"].value 
                                                                        || this.props.Login.userInfo.ntimezonecode
                                                                        : this.props.Login.userInfo.ntimezonecode;
            inputData["methodvalidity"]["ntzvalidityenddatetimezone"] = this.state.selectedRecord["ntzvalidityenddatetimezone" ]
                                                                        ? this.state.selectedRecord["ntzvalidityenddatetimezone"].value 
                                                                        || this.props.Login.userInfo.ntimezonecode
                                                                        : this.props.Login.userInfo.ntimezonecode;

            inputData["methodvalidity"]["stzvaliditystartdatetimezone"] = this.state.selectedRecord["stzvaliditystartdatetimezone"]
                                                                        ? this.state.selectedRecord["stzvaliditystartdatetimezone"].value 
                                                                        || this.props.Login.userInfo.ntimezonecode
                                                                        : this.props.Login.userInfo.ntimezonecode;
            inputData["methodvalidity"]["stzvalidityenddatetimezone"] = this.state.selectedRecord["stzvalidityenddatetimezone"]
                                                                        ? this.state.selectedRecord["stzvalidityenddatetimezone"].value 
                                                                        || this.props.Login.userInfo.ntimezonecode
                                                                        : this.props.Login.userInfo.ntimezonecode;

        }   
        let postParam = undefined;
        postParam= {
            inputListName: "Method", selectedObject: "SelectedMethod", primaryKeyField: "nmethodcode",
            primaryKeyValue: this.props.Login.selectedRecord.nmethodcode,
            fetchUrl: "method/getActiveMethodById", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Method",//this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.screenName,  
            inputData: inputData, selectedId, dataState,
            operation: this.props.Login.operation, saveType, formRef,
            postParam, searchRef: this.searchRef,
            selectedRecord: {...this.state.selectedRecord}

        }
       
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded){
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign:true, screenData:{inputParam, masterData:this.props.Login.masterData}, 
                    openModal:true, screenName: this.props.Login.screenName && this.props.intl.formatMessage({ id:this.props.Login.screenName}),
                    operation:this.props.Login.operation
                    }
                }
            this.props.updateStore(updateInfo);
        }
        else{
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal","","",clearSelectedRecordField);
        }
       
}

    ConfirmDelete = (deleteParam,deleteID) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(deleteParam,deleteID));
    }
    deleteRecord = (deleteParam, nControlcode) => {
        const postParam = {
            inputListName: "Method", selectedObject: "SelectedMethod",
            primaryKeyField: "nmethodcode",
            primaryKeyValue: this.props.Login.masterData.SelectedMethod.nmethodcode,
            fetchUrl: "method/getMethod",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
                                classUrl: this.props.Login.inputParam.classUrl,
                                methodUrl: "Method",//this.props.Login.inputParam.methodUrl,                        
                                displayName:this.props.Login.screenName,
                                inputData: {["method"] :this.props.Login.masterData.SelectedMethod,   //deleteParam.selectedRecord,
                                            "userinfo": this.props.Login.userInfo},
                                operation:deleteParam.operation,
                                dataState: this.state.dataState,
                                postParam,
                                selectedRecord: {...this.state.selectedRecord}
                            }       
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, nControlcode)){
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign:true, screenData:{inputParam, masterData:this.props.Login.masterData}, 
                    openModal:true, screenName: this.props.Login.screenName && this.props.intl.formatMessage({ id:this.props.Login.screenName}),
                    operation:deleteParam.operation
                    }
                }
            this.props.updateStore(updateInfo);
        }
        else{
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }
    onEsignInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }
    onInputOnChange=(event) => {
        
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox')
        {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else{
            selectedRecord[event.target.name] = event.target.value;
        }
        
        this.setState({selectedRecord});
    }

    onComboChange = (comboData, fieldName) => {      
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;   
     
        this.setState({selectedRecord});        
    }
    handleDateChange = (dateName, dateValue, sdatename) => {
        const { selectedRecord } = this.state;
        // if(dateName === "dvaliditystartdate")
        // {
        //    selectedRecord["dvalidityenddate"] = dateValue;  
        // }
        selectedRecord[dateName] = dateValue;
        selectedRecord[sdatename] = dateValue;
        this.setState({ selectedRecord });
      };
    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
                selectedRecord["agree"] = transactionStatus.NO;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        } else {
            openModal = false;
            selectedRecord = {};
            selectedId=null;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord,selectedId }
        }
        this.props.updateStore(updateInfo);
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

    reloadData = () => {
        //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }
        const inputParam = {
                        inputData : {"userinfo":this.props.Login.userInfo},                        
                        classUrl: this.props.Login.inputParam.classUrl,
                        methodUrl: "Method",//this.props.Login.inputParam.methodUrl,
                        //displayName:this.props.Login.inputParam.displayName,
                        //ALPD-5148 Method --> When approve the method validity method name is hiding
                        displayName:this.props.intl.formatMessage({ id:"IDS_METHOD"}),
                        userInfo: this.props.Login.userInfo
                    };     
        this.props.callService(inputParam);
    }

    componentDidUpdate(previousProps) {
        let isComponentUpdated = false;

       

        // if (this.props.Login.regparentSubSampleColumnList !== previousProps.Login.regparentSubSampleColumnList) {
        //     this.setState({
        //         regparentSubSampleColumnList: this.props.Login.regparentSubSampleColumnList,
        //         regSubSamplecomboComponents: this.props.Login.regSubSamplecomboComponents,
        //         regSubSamplewithoutCombocomponent: this.props.Login.regSubSamplewithoutCombocomponent
        //     });

        // }


        if (this.props.Login.showSaveContinue !== previousProps.Login.showSaveContinue) {
            this.setState({ showSaveContinue: this.props.Login.showSaveContinue });

        }
        if (this.props.Login !== previousProps.Login) {
            this.PrevoiusLoginData = previousProps
        }

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({ userRoleControlRights, controlMap });
        }
        

        
       
        
    }

    // generateBreadCrumData() {
    //     const breadCrumbData = [];
    //     if (this.props.Login.masterData && this.props.Login.masterData.filterTestCategory) {

    //         breadCrumbData.push(
    //             {
    //                 "label": "IDS_TESTCATEGORY",
    //                 "value": this.props.Login.masterData.SelectedTestCat ? this.props.Login.masterData.SelectedTestCat.stestcategoryname : "NA"
    //             }
    //         );
    //     }
    //     return breadCrumbData;
    // }
    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
                
            }
        }
        this.props.updateStore(updateInfo);
    }

}
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster,getMethodComboService,getMethodDetail,getAvailableValidityData,fetchMethodValidityById,getMethodValidityUTCDate,updateStore, validateEsignCredential,filterColumnData,
})(injectIntl(Method));