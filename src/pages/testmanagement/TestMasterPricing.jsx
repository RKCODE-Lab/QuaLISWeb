import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faPencilAlt, faThumbsUp, faTrashAlt, faPlus} from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';
import {
    callService, crudMaster, validateEsignCredential, updateStore, filterColumnData,
   getEditTestPriceVersionService, getTestPriceVersionDetail, getPricingAddTestService,
   getPricingEditService} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap } from '../../components/CommonScript';
import { process } from '@progress/kendo-data-query';
import { transactionStatus } from '../../components/Enumeration';
import ListMaster from '../../components/list-master/list-master.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';

import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import AddType1Component from '../../components/type1component/AddType1Component';
//import AddUser from './AddUser';
//import UserTabs from './UserTabs';
import Esign from '../audittrail/Esign';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import AddPricingTest from './AddPricingTest';
import EditTestPricing from './EditTestPricing';
import { isText } from 'domhandler';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class TestMasterPricing extends React.Component {
    constructor(props) {
        super(props);

        const priceDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {

            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            SelectedTestPriceVersion: undefined,
            screenName: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            isClearSearch: false,
            data: [], 
            dataResult: [],
            priceDataState: priceDataState,
            sidebarview: false

        };
        this.searchRef = React.createRef();
       // this.emailRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();

       // this.versionFieldList = ['sversionname', 'sdescription'];

        this.versionFieldList = [
            { "idsName": "IDS_VERSIONNAME", "dataField": "sversionname", "width": "200px","fieldLength":"100","mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px" , "fieldLength":"255","mandatory": false , "mandatoryLabel":"IDS_ENTER", "controlType": "textarea"},
            ]
        this.extractedColumnList = [
                { "idsName": "IDS_TESTNAME", "dataField": "stestname", "width": "200px"},
                { "idsName": "IDS_COST", "dataField": "ncost", "width": "200px" },
               ]
        this.mandatoryFields = [ { "idsName": "IDS_VERSIONNAME", "dataField": "sversionname", "width": "200px","mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                                    ];
        this.mandatoryTestFields = [ { "idsName": "IDS_TEST", "dataField": "ntestcode", "width": "200px","mandatory": true , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                ];
        this.searchFieldList = ["sversionname", "sversionno", "sdescription", "sversionstatus"];
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
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
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
    }

    render() {

        let versionStatusCSS = "outline-secondary";
        let activeIconCSS = "fa fa-check"
        if (this.props.Login.masterData.SelectedTestPriceVersion && this.props.Login.masterData.SelectedTestPriceVersion.ntransactionstatus === transactionStatus.APPROVED) {
            versionStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.SelectedTestPriceVersion && this.props.Login.masterData.SelectedTestPriceVersion.ntransactionstatus === transactionStatus.RETIRED) {
            versionStatusCSS = "outline-danger";
            activeIconCSS = "";
        }
        else if (this.props.Login.masterData.SelectedTestPriceVersion && this.props.Login.masterData.SelectedTestPriceVersion.ntransactionstatus === transactionStatus.DRAFT) {
            activeIconCSS = "";
        }

        const addId = this.state.controlMap.has("AddTestPriceVersion") && this.state.controlMap.get("AddTestPriceVersion").ncontrolcode;
        const editId = this.state.controlMap.has("EditTestPriceVersion") && this.state.controlMap.get("EditTestPriceVersion").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteTestPriceVersion") && this.state.controlMap.get("DeleteTestPriceVersion").ncontrolcode
        const approveId = this.state.controlMap.has("ApproveTestPriceVersion") && this.state.controlMap.get("ApproveTestPriceVersion").ncontrolcode
        const copyId = this.state.controlMap.has("CopyTestPriceVersion") && this.state.controlMap.get("CopyTestPriceVersion").ncontrolcode
        const addPriceId = this.state.controlMap.has("AddTestPrice") && this.state.controlMap.get("AddTestPrice").ncontrolcode;
        const updatePriceId = this.state.controlMap.has("EditTestPrice") && this.state.controlMap.get("EditTestPrice").ncontrolcode;
       // const deletePriceId = this.state.controlMap.has("DeleteTestPrice") && this.state.controlMap.get("DeleteTestPrice").ncontrolcode;
     
     

        const filterParam = {
            inputListName: "TestPriceVersion", selectedObject: "SelectedTestPriceVersion", primaryKeyField: "npriceversioncode",
            fetchUrl: "testpricing/getTestPriceVersion", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };

        const addParam = {
            screenName: "IDS_TESTMASTERPRICING", operation: "create", primaryKeyName: "npriceversioncode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: addId
        }

        const editParam = {
            screenName:  this.props.intl.formatMessage({id:'IDS_TESTPRICEVERSION'}), operation: "update", primaryKeyName: "npriceversioncode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: editId, inputListName: "TestPriceVersion", selectedObject: "SelectedTestPriceVersion"
        };

        const copyParam = {
            screenName: "IDS_TESTMASTERPRICING", operation: "copy", primaryKeyName: "npriceversioncode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: copyId
        }

        const editTestPriceParam = {screenName:"IDS_PRICE", "operation":"update", 
                                    masterData:this.props.Login.masterData, userInfo: this.props.Login.userInfo, 
                                    ncontrolCode:updatePriceId};

        //console.log("props:", this.props.Login.masterData.TestPriceVersion);
        return (<>
            {/* Start of get display*/}
            <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb">
                <Row noGutters>
                    <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                        {/* <Row noGutters>
                            <Col md={12}> */}
                            {/* <div className="list-fixed-wrap"> */}
                                <ListMaster
                                    screenName={this.props.intl.formatMessage({ id: "IDS_TESTMASTERPRICING" })}
                                    masterData={this.props.Login.masterData}
                                    userInfo={this.props.Login.userInfo}
                                    masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.TestPriceVersion}
                                    getMasterDetail={(testPriceVersion) => this.props.getTestPriceVersionDetail(testPriceVersion, this.props.Login.userInfo, this.props.Login.masterData)}
                                    selectedMaster={this.props.Login.masterData.SelectedTestPriceVersion}
                                    primaryKeyField="npriceversioncode"
                                    mainField="sversionname"
                                    firstField="sversionno"
                                    secondField="sversionstatus"
                                    filterColumnData={this.props.filterColumnData}
                                    filterParam={filterParam}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    addId={addId}
                                    searchRef={this.searchRef}
                                    reloadData={this.reloadData}
                                    openModal={() => this.openModal(addParam)}
                                    isMultiSelecct={false}
                                    hidePaging={false}
                                    isClearSearch={this.props.Login.isClearSearch}
                                />
                            {/* </div>
                        </Col></Row> */}
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
                        {/* <Row>
                            <Col md={12}> */}
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.TestPriceVersion && this.props.Login.masterData.TestPriceVersion.length > 0 && this.props.Login.masterData.SelectedTestPriceVersion ?
                                        <>
                                            <Card.Header>
                                                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                                <Card.Title className="product-title-main">
                                                    {this.props.Login.masterData.SelectedTestPriceVersion.sversionname}
                                                </Card.Title>
                                                <Card.Subtitle>
                                                    <div className="d-flex product-category">
                                                        <h2 className="product-title-sub flex-grow-1">

                                                            <span className={`btn btn-outlined ${versionStatusCSS} btn-sm ml-3`}>
                                                                {activeIconCSS !== "" ? <i class={activeIconCSS}></i> : ""}
                                                                {this.props.Login.masterData.SelectedTestPriceVersion.sversionstatus}
                                                            
                                                            </span>
                                                        </h2>
                                                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                        <div className="d-inline">
                                                            <Nav.Link name="editTestPriceVersion" hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                className="btn btn-circle outline-grey mr-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                //data-for="tooltip_list_wrap"
                                                                onClick={() => this.props.getEditTestPriceVersionService(editParam)}
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </Nav.Link>

                                                            <Nav.Link name="deleteTestPriceVersion" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                               // data-for="tooltip_list_wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                onClick={() => this.confirmDelete(deleteId)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                               
                                                            </Nav.Link>
                                                            <Nav.Link name="approveTestPriceVersion" className="btn btn-circle outline-grey mr-2"
                                                                hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                //data-for="tooltip_list_wrap"
                                                                onClick={() => this.deleteOrApproveTestPriceVersion("TestPriceVersion", this.props.Login.masterData.SelectedTestPriceVersion,
                                                                    "approve", approveId)}>
                                                                <FontAwesomeIcon icon={faThumbsUp} />
                                                            </Nav.Link>
                                                            <Nav.Link name="copyTestPriceVersion" className="btn btn-circle outline-grey mr-2"
                                                                hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                                onClick={()=>this.openModal(copyParam)}
                                                                // onClick={() => this.copyTestPriceVersion("TestPriceVersion", this.props.Login.masterData.SelectedTestPriceVersion,
                                                                //     "copy", approveId)}
                                                                >
                                                                <FontAwesomeIcon icon={faCopy} />
                                                            </Nav.Link>
                                                        </div>
                                                        {/* </Tooltip> */}
                                                    </div>

                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body className="form-static-wrap">
                                                {/* <Card.Text> */}

                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_DESCRIPTION" message="Description" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedTestPriceVersion.sdescription}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                  
                                                </Row>
                                                {/* <Row>
                                                    <Col>
                                                        <div className="horizontal-line"></div>
                                                    </Col>
                                                </Row> */}
                                                  <Card className="at-tabs border-0">
                                                        <Row noGutters>
                                                            <Col md={12}>
                                                                <div className="d-flex justify-content-end">
                                                                <Nav.Link name="addPrice" className="add-txt-btn" 
                                                                        hidden={this.state.userRoleControlRights.indexOf(addPriceId) === -1}
                                                                        onClick={()=>this.props.getPricingAddTestService("IDS_TEST", "create", this.props.Login.masterData, this.props.Login.userInfo, addPriceId)}
                                                                        >
                                                                     <FontAwesomeIcon icon={faPlus} /> { } 
                                                                    <FormattedMessage id='IDS_TEST' defaultMessage='Test' />
                                                                </Nav.Link>
                                                                <Nav.Link name="updatePrice" className="add-txt-btn" 
                                                                        hidden={this.state.userRoleControlRights.indexOf(updatePriceId) === -1}
                                                                        onClick={()=>this.props.getPricingEditService({...editTestPriceParam, "updateType":"All", priceDataState:undefined})}
                                                                        >
                                                                    <FontAwesomeIcon icon={faPencilAlt} /> { }
                                                                    <FormattedMessage id='IDS_PRICE' defaultMessage='Price' />
                                                                </Nav.Link>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row noGutters>
                                                            <Col md={12}>
                                                                <DataGrid
                                                                    primaryKeyField={"ntestpricedetailcode"}
                                                                    data={this.state.data}
                                                                    dataResult={this.state.dataResult}
                                                                    dataState={this.state.priceDataState}
                                                                    dataStateChange={this.dataStateChange}
                                                                    extractedColumnList={this.extractedColumnList}
                                                                    controlMap={this.state.controlMap}
                                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                                    inputParam={this.props.Login.inputParam}
                                                                    userInfo={this.props.Login.userInfo}
                                                                    fetchRecord={this.props.getPricingEditService}
                                                                    editParam={{...editTestPriceParam, "updateType":"Single", priceDataState:this.state.priceDataState}}
                                                                    deleteRecord={this.deleteTestPrice}
                                                                    deleteParam={{operation:"delete"}}
                                                                    methodUrl={"TestPrice"}
                                                                // reloadData={this.reloadData}
                                                                    addRecord = {() => this.openModal(addId)}
                                                                    pageable={true}
                                                                    scrollable={'scrollable'}
                                                                // gridHeight = {'600px'}
                                                                    isActionRequired={true}
                                                                    isToolBarRequired={false}
                                                                    selectedId={this.props.Login.selectedId}
                                                                />
                                                            </Col>
                                                        </Row>
                                                </Card>
                                                {/* </Card.Text> */}
                                            
                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col></Row>
                    {/* </Col>
                </Row> */}
            </div>

            {/* End of get display*/}

            {/* Start of Modal Sideout for  Creation */}
            {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
            {this.props.Login.openModal ?
                <SlideOutModal show={this.props.Login.openModal}
                    closeModal={this.closeModal}
                    operation={this.props.Login.operation}
                    inputParam={this.props.Login.inputParam}
                    screenName={this.props.Login.screenName}
                    onSaveClick={(this.props.Login.screenName === "IDS_TEST" || 
                                this.props.Login.screenName === "IDS_PRICE")  ? this.onSaveTestPrice: this.onSaveClick}
                    esign={this.props.Login.loadEsign}
                    validateEsign={this.validateEsign}
                    masterStatus={this.props.Login.masterStatus}
                    updateStore={this.props.updateStore}
                    selectedRecord={this.state.selectedRecord || {}}
                    mandatoryFields={(this.props.Login.screenName === "IDS_TEST" || 
                    this.props.Login.screenName === "IDS_PRICE")? 
                            this.props.Login.operation === "update" ? [] : this.mandatoryTestFields:
                            this.mandatoryFields}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign operation={this.props.Login.operation}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        : (this.props.Login.screenName === "IDS_TEST" || 
                        this.props.Login.screenName === "IDS_PRICE")  ? 
                            this.props.Login.operation === "update" ?
                                <EditTestPricing
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onFocus={this.handleFocus}
                                    //testPriceList={this.props.Login.testPriceList || []}
                                    />
                                :<AddPricingTest
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onComboChange={this.onComboChange}
                                    pricingTestList={this.props.Login.pricingTestList || []}/>

                            : <AddType1Component
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                extractedColumnList={this.versionFieldList}
                            />
                      
                    }
                /> : ""}
            {/* End of Modal Sideout for User Creation */}
        </>
        );
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({ userRoleControlRights, controlMap,
                    data: this.props.Login.masterData.TestPrice,
                    dataResult: process(this.props.Login.masterData.TestPrice || [], this.state.priceDataState), });
            }
            else {        
                let {priceDataState} = this.state;
                if(this.props.Login.priceDataState === undefined){
                    priceDataState={skip:0,take:this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
                }         
                this.setState({
                    data: this.props.Login.masterData.TestPrice, selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData.TestPrice ||[],priceDataState),
                    priceDataState
                });
            }  
        }
    }

    handleFocus(e){
        e.target.select();
    }

    openModal = (inputParam) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: {}, operation: inputParam.operation, ncontrolCode:inputParam.ncontrolcode, selectedId:null,
                openModal: true, screenName: this.props.intl.formatMessage({id:'IDS_TESTPRICEVERSION'})
            }
        }
        this.props.updateStore(updateInfo);
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            priceDataState: event.dataState
        });
    }


    confirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteOrApproveTestPriceVersion("TestPriceVersion", this.props.Login.masterData.SelectedTestPriceVersion, "delete", deleteId));
    }

    deleteTestPrice = (deleteParam) =>{
        const postParam = { inputListName: "TestPriceVersion", selectedObject: "SelectedTestPriceVersion", primaryKeyField: "npriceversioncode" };

        const inputParam = {
            classUrl: "testpricing",
            methodUrl: "TestPrice",
            postParam,
            //displayName: ,
            inputData: {
                "testprice": deleteParam.selectedRecord,//.dataItem,
                "npriceversioncode":this.props.Login.masterData.SelectedTestPriceVersion.npriceversioncode,
                "userinfo": this.props.Login.userInfo,
                //postParam 

            },
            operation:"delete",
            priceDataState:this.state.priceDataState,
            selectedRecord: {...this.state.selectedRecord}
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
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};

                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            selectedId = null;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId }
        }
        this.props.updateStore(updateInfo);

    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
    }

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event, primaryFieldKey) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;

        }
        else {   
            if(primaryFieldKey && event.target.name === "ncost"){
                const index = selectedRecord.findIndex(item=>item.ntestpricedetailcode === primaryFieldKey);
                if (/^-?\d*?\.?\d*?$/.test(event.target.value)){
                    selectedRecord[index]["ncost"] = event.target.value;
                }
            }
            else{      
                selectedRecord[event.target.name] = event.target.value;
            }           
        }
        this.setState({ selectedRecord });
    }

    onSaveClick = (saveType, formRef) => {

        let versionData = [];
        versionData["userinfo"] = this.props.Login.userInfo;

        let postParam = undefined;

        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "TestPriceVersion", selectedObject: "SelectedTestPriceVersion", primaryKeyField: "npriceversioncode" };
            versionData["testpriceversion"] = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));
            versionData["sversionname"]=this.state.selectedRecord["sversionname"] || "";
            versionData["sdescription"]=this.state.selectedRecord["sdescription"] || "";

        }
        else {
            //add               
            versionData["testpriceversion"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode,
                                                 "ntransactionstatus": transactionStatus.DRAFT,
                                                "sversionname":this.state.selectedRecord["sversionname"] || "",
                                                "sdescription":this.state.selectedRecord["sdescription"] || "",
                                            };

            if(this.props.Login.operation === "copy"){
                versionData["testpriceversion"]["npriceversioncode"] = this.props.Login.masterData.SelectedTestPriceVersion.npriceversioncode;
            }

        }
        if (versionData["testpriceversion"].hasOwnProperty('esignpassword')) {
            if (versionData["testpriceversion"]['esignpassword'] === '') {
                delete versionData["testpriceversion"]['esigncomments']
                delete versionData["testpriceversion"]['esignpassword']
            }
        }
      
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "TestPriceVersion",
            inputData: versionData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef,
            isClearSearch: this.props.Login.isClearSearch,
            selectedRecord: {...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

    }

    onSaveTestPrice = (saveType, formRef) => {

       // console.log("this.props.Login.selectedRecord:", this.props.Login.selectedRecord);
        const testPriceData = {"userinfo": this.props.Login.userInfo,
                                "testpriceversion":this.props.Login.masterData.SelectedTestPriceVersion,
                                "npriceversioncode":this.props.Login.masterData.SelectedTestPriceVersion.npriceversioncode};

        let postParam = undefined;
        let priceDataState = undefined;
        let selectedId = null;
        
        if (this.props.Login.operation === "update") {
            // edit
            priceDataState = this.state.priceDataState;
            selectedId = this.props.Login.selectedId; 
            postParam = { inputListName: "TestPriceVersion", selectedObject: "SelectedTestPriceVersion", primaryKeyField: "npriceversioncode" };
            testPriceData["testpricelist"] = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));           
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
           
            testPriceData["testpricelist"] = priceList;                             

        }
        if (testPriceData["testpriceversion"].hasOwnProperty('esignpassword')) {
            if (testPriceData["testpriceversion"]['esignpassword'] === '') {
                delete testPriceData["testpriceversion"]['esigncomments']
                delete testPriceData["testpriceversion"]['esignpassword']
                delete testPriceData["testpriceversion"]["agree"]
            }
        }
       //console.log("update data:", testPriceData);
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "TestPrice",
            inputData: testPriceData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef,
            isClearSearch: this.props.Login.isClearSearch,
            selectedId, priceDataState,
            selectedRecord: {...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {            
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

    }


    deleteOrApproveTestPriceVersion = (methodUrl, SelectedTestPriceVersion, operation, ncontrolCode) => {
        if (SelectedTestPriceVersion.ntransactionstatus === transactionStatus.DRAFT) {         

            const postParam = {
                inputListName: "TestPriceVersion", selectedObject: "SelectedTestPriceVersion",
                primaryKeyField: "npriceversioncode",
                primaryKeyValue: SelectedTestPriceVersion.npriceversioncode,
                fetchUrl: "testpricing/getTestPriceVersion",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl, postParam,
                inputData: {
                    "userinfo": this.props.Login.userInfo,
                    "testpriceversion": SelectedTestPriceVersion
                },
                operation,
                isClearSearch: this.props.Login.isClearSearch,
                selectedRecord: {...this.state.selectedRecord}
            }

            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "IDS_TESTPRICEVERSION", operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }    
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTTESTPRICEVERSION" }));
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

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    reloadData = () => {
         //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "testpricing",
            methodUrl: "TestPriceVersion",
            displayName: "IDS_TESTPRICEVERSION",
            userInfo: this.props.Login.userInfo,
            isClearSearch: this.props.Login.isClearSearch

        };

        this.props.callService(inputParam);
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,getEditTestPriceVersionService,
    updateStore,filterColumnData, getTestPriceVersionDetail, getPricingAddTestService,
    getPricingEditService
})(injectIntl(TestMasterPricing));

