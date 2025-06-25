import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button,Col, Row, Card, Nav } from 'react-bootstrap';
import { toast } from 'react-toastify';
import SplitterLayout from "react-splitter-layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faPencilAlt, faTrashAlt, faCheckCircle,faCopy,faPalette } from '@fortawesome/free-solid-svg-icons';
import { process } from '@progress/kendo-data-query';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { ListWrapper } from '../../components/client-group.styles';
import { ContentPanel } from '../../components/App.styles';
import { SampleType, transactionStatus, attachmentType } from '../../components/Enumeration';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import CustomPopOver from '../../components/customPopover';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import { constructOptionList, getControlMap, comboChild, deleteAttachmentDropZone, showEsign, 
         convertDateTimetoStringDBFormat, onDropAttachFileList, create_UUID, Lims_JSON_stringify,
         getSameRecordFromTwoArrays, sortData } from '../../components/CommonScript';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import { ReactComponent as Reject } from '../../assets/image/reject.svg';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { ProductList } from '../testmanagement/testmaster-styled';
import DynamicSlideout from '../dynamicpreregdesign/DynamicSlideout';
import Esign from '../audittrail/Esign';
import {
    updateStore, callService, crudMaster, getProtocolTemplateByConfigVersion, ProtocolFilterSubmit,
    getPreviewTemplate, getProtocolDetail, addProtocolFile, viewAttachment, getChildValues,validateEsignforProtocol,
    completeProtocolAction,dynamicAction,getEditComboService,updateProtocolAction,rejectProtocolAction,copyProtocolAction,
    insertProtocolAction,filterTransactionList,getProduct
} from '../../actions';
import ProtocolFilter from './ProtocolFilter';
import ProtocolFileTab from './ProtocolFileTab';
import AddProtocolFile from './AddProtocolFile';
import CopyProtocol from './CopyProtocol';
import ProtocolHistoryTab from './ProtocolHistoryTab';
import ProtocolView from './ProtocolView';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Protocol extends React.Component {

    constructor(props) {
        super(props)
        this.searchRef = React.createRef();
        this.formRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.state = {
            protocolSkip: 0,
            protocolTake: this.props.Login.settings && this.props.Login.settings[3],
            historyState : {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5
            },
            userRoleControlRights: [],
            controlMap: new Map(),
            selectedRecord: {},
            masterStatus: "",
            error: "",
            enablePropertyPopup: false,
            splitChangeWidthPercentage: 28.6,
            firstPane: 0,
            configVersionList: [],
            dynamicDesignMappingList: [],
            statusList: [],
            mandatoryProtocolFields: [],            
            singleItem: [],
            dynamicGridItem: [],
            dynamicGridMoreField: [],
            dynamicExportItem: [],
            dynamicDateField: [],
            dynamicTemplateField: [],
            dynamicDateConstraints: [],
            dynamicCombinationUnique: [],
            dynamicExportfields: [],
            dynamiccolumns:[],
            editable:[],

           

        }
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "") {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.multilingualMsg !== undefined && props.Login.multilingualMsg !== "") {
            toast.warn(props.intl.formatMessage({ id: props.Login.multilingualMsg }));
            props.Login.multilingualMsg = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }

        return null;
    }

    componentDidMount() {
        if (this.parentHeight) {
            const height = this.parentHeight.clientHeight;
            this.setState({
                firstPane: height - 80,
                parentHeight: height - 50
            });
        }
    }

    

    render() {       

        const actionStatus = this.props.Login.masterData.actionStatus ? sortData(this.props.Login.masterData.actionStatus, 'ascending', 'ntransactionstatus') : [];
        const protocolList = this.props.Login.masterData.protocol ? sortData(this.props.Login.masterData.protocol, 'descending', 'nprotocolcode') : [];


        const addId = this.state.controlMap.has("AddProtocol") ? this.state.controlMap.get("AddProtocol").ncontrolcode : -1;
        const editId = this.state.controlMap.has("EditProtocol") ? this.state.controlMap.get("EditProtocol").ncontrolcode : -1;
        const deleteId = this.state.controlMap.has("DeleteProtocol") ? this.state.controlMap.get("DeleteProtocol").ncontrolcode : -1;
        const completeId = this.state.controlMap.has("CompleteProtocol") ? this.state.controlMap.get("CompleteProtocol").ncontrolcode : -1;
        const approvalActionId = this.state.controlMap.has("ApprovalActionProtocol") ? this.state.controlMap.get("ApprovalActionProtocol").ncontrolcode : -1;
        const copyId = this.state.controlMap.has("CopyProtocol") ? this.state.controlMap.get("CopyProtocol").ncontrolcode : -1;
        const rejectId = this.state.controlMap.has("RejectProtocol") ? this.state.controlMap.get("RejectProtocol").ncontrolcode : -1;

        const protocolAddParam = {
            screenName: "IDS_PROTOCOL", operation: "create",
            masterData: this.props.Login.masterData,
            selectedRecord: this.state.selectedRecord,
            primaryKeyField: "nprotocolcode",
            userInfo: this.props.Login.userInfo, ncontrolCode: addId
        };

        const protocolEditParam = {
            screenName: "IDS_PROTOCOL", operation: "update", primaryKeyField: "nprotocolcode",
            userInfo: this.props.Login.userInfo, ncontrolCode: editId,masterData:this.props.Login.masterData
        }

        const protocolDeleteParam = {
            screenName: "IDS_PROTOCOL", methodUrl: "Protocol", operation: "delete", ncontrolCode: deleteId
        }

        
        const filterParam = {
            inputListName: "protocol", selectedObject: "selectedProtocol", primaryKeyField: "nprotocolcode",
            fetchUrl: "protocol/getActiveProtocolById", fecthInputObject: { 
                napprovalconfigversioncode: parseInt(this.props.Login.masterData.defaultApprovalVersionValue && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) || -1,
                ndesigntemplatemappingcode: parseInt(this.props.Login.masterData.defaultDesignTemplateMappingValue && this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
                ntranscode: this.props.Login.masterData.defaultStatusValue && this.props.Login.masterData.defaultStatusValue.ntransactionstatus || 0,
                userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: this.state.searchFields,
            childRefs: []

        };

        this.postParamList = [
            {
                filteredListName: "searchedProtocol",
                clearFilter: "no",
                searchRef: this.searchRef,
                primaryKeyField: "nprotocolcode",
                fetchUrl: "protocol/getActiveProtocolById",
                fecthInputObject: {},
                childRefs: [],
                selectedObject: "SelectedProtocol",
                inputListName: "protocol",
                updatedListname: "SelectedProtocol",
                unchangeList: ["realApprovalVersionValue", "approvalConfigVersionValue", "approvalConfigVersion",
                                "realDesignTemplateMappingValue", "dynamicDesignMappingValue", "dynamicDesignMapping", 
                                "realFilterStatusValue", "statusValue", "status"]
            }
        ]    
        

        const breadCrumbData = [
            {
                "label": "IDS_CONFIGVERSION",
                "value": this.props.Login.masterData.realApprovalVersionValue ? this.props.Login.masterData.realApprovalVersionValue.sversionname || "NA" :
                    this.props.Login.masterData.configVersionValue ? this.props.Login.masterData.configVersionValue.sversionname || "NA" : "NA"
            },
            {
                "label": "IDS_DESIGNTEMPLATE",
                "value": this.props.Login.masterData.realDesignTemplateMappingValue ? this.props.Login.masterData.realDesignTemplateMappingValue.sregtemplatename || "NA" :
                    this.props.Login.masterData.dynamicDesignMappingValue ? this.props.Login.masterData.dynamicDesignMappingValue.sregtemplatename || "NA" : "NA"
            },
            {
                "label": "IDS_STATUS",
                "value": this.props.Login.masterData.realStatusValue ? this.props.Login.masterData.realStatusValue.sfilterstatus || "NA" :
                    this.props.Login.masterData.statusValue ? this.props.Login.masterData.statusValue.sfilterstatus || "NA" : "NA"
            }


        ];
        const mandatoryFields = [];
        if(this.props.Login.screenName==="IDS_PROTOCOL" && this.props.Login.operation==="copy"){
            mandatoryFields.push({ "idsName": "IDS_PROTOCOLNAME", "dataField": "sprotocolname", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"});

        }else if (this.props.Login.screenName==="IDS_PROTOCOLFILE"){
            if (this.state.selectedRecord && this.state.selectedRecord.nattachmenttypecode === attachmentType.LINK) {
                mandatoryFields.push({ "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "file" },
                                     { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" })
            } else {
                mandatoryFields.push({ "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" });
            }

        }

        

        return (
            <>
                <ListWrapper className="client-listing-wrap toolbar-top-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                    <Row noGutters={true} className="toolbar-top">
                        <Col md={12} className="parent-port-height">
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                <div className={`tab-left-area ${this.state.activeTabIndex ? 'active' : ""}`}>
                                    <SplitterLayout borderColor="#999"
                                        primaryIndex={1} percentage={true}
                                        secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                        primaryMinSize={30}
                                        secondaryMinSize={20}
                                    >
                                        <div className='toolbar-top-inner'>
                                            <TransactionListMasterJsonView
                                                listMasterShowIcon={1}
                                                clickIconGroup={true}
                                                splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                                masterList={this.props.Login.masterData.searchedProtocol ||protocolList}
                                                selectedMaster={this.props.Login.masterData.selectedProtocol}
                                                primaryKeyField="nprotocolcode"
                                                filterColumnData={this.props.filterTransactionList}
                                                getMasterDetail = {(protocol, status) => { this.props.getProtocolDetail(
                                                    {
                                                        ...protocol,
                                                        userinfo: this.props.Login.userInfo,
                                                        masterData: this.props.Login.masterData                                                  
                                                       
                                                    }
                                                    , status);}}
                                                selectionList={this.props.Login.masterData.realStatusValue
                                                    && this.props.Login.masterData.realStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.status : []}
                                                selectionColorField="scolorhexcode"
                                                mainField={"sprotocolid"}
                                                showStatusLink={true}
                                                showStatusName={true}
                                                statusFieldName="stransdisplaystatus"
                                                statusField="ntransactionstatus"
                                                selectedListName="selectedProtocol"
                                                searchListName="searchedProtocol"
                                                searchRef={this.searchRef}
                                                objectName="protocol"
                                                listName="IDS_PROTOCOL"
                                                selectionField="ntransactionstatus"
                                                selectionFieldName="stransdisplaystatus"
                                                showFilter={this.props.Login.showFilter}
                                                openFilter={this.openFilter}
                                                closeFilter={this.closeFilter}
                                                onFilterSubmit={this.onFilterSubmit}
                                                needFilter={true}
                                                needMultiSelect={false}
                                                showStatusBlink={true}
                                                callCloseFunction={true}
                                                handlePageChange={this.handleProtocolPageChange}
                                                skip={this.state.protocolSkip}
                                                take={this.state.protocolTake}
                                                subFields={this.state.dynamiccolumns}

                                                childTabsKey={["protocolHistory", "protocolFile"]}
                                                filterParam = {filterParam}
                                                commonActions={
                                                    <ProductList className="d-flex product-category float-right icon-group-wrap">
                                                         <Button className="btn btn-icon-rounded btn-circle solid-blue ml-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(addId) === -1}
                                                            onClick={() => this.getProtocolComboService(protocolAddParam)} >
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </Button>
                                                        
                                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                            data-for="tooltip-common-wrap"
                                                            onClick={() => this.reloadData()} >
                                                           <RefreshIcon className='custom_icons'/>
                                                        </Button>
                                                    </ProductList>
                                                }
                                                filterComponent={[
                                                    {
                                                        "IDS_PROTOCOLFILTER":
                                                            <ProtocolFilter
                                                                configVersion={this.state.configVersionList}
                                                                configVersionValue={this.props.Login.masterData && this.props.Login.masterData.defaultApprovalVersionValue || {}}
                                                                dynamicDesignMapping={this.state.dynamicDesignMappingList}
                                                                dynamicDesignMappingValue={this.props.Login.masterData && this.props.Login.masterData.defaultDesignTemplateMappingValue || {}}
                                                                status={this.state.statusList}
                                                                statusValue={this.props.Login.masterData && this.props.Login.masterData.defaultStatusValue || {}}
                                                                onFilterComboChange={this.onFilterComboChange}
                                                                userInfo={this.props.Login.userInfo}
                
                                                            />
                                                    }
                                                ]}
                                            />
                                        </div>
                                        <div>                                           
                                            <Row>
                                                <Col md={12}>
                                                    <ContentPanel className="panel-main-content">
                                                    {this.props.Login.masterData.selectedProtocol && this.props.Login.masterData.protocol 
                                                        && this.props.Login.masterData.protocol.length > 0 && 
                                                        this.props.Login.masterData.selectedProtocol[0] ?
                                                        <Card className="border-0">
                                                            <Card.Header>
                                                                {/* <Card.Title className="product-title-main">{this.props.Login.masterData.selectedProtocol[0].sprotocolid}
                                                                    <Card.Subtitle> */}
                                                                        {/* <div className="d-flex product-category"> */}
                                                                                {/* <h2 className="product-title-sub flex-grow-1">
                                                                                    <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                                                        <i className={activeIconCSS}></i>
                                                                                            {this.props.Login.masterData.selectedProtocol[0].stransdisplaystatus}
                                                                                    </span>
                                                                                </h2> */}
                                                                            <div className="d-flex product-category float-right icon-group-wrap">
                                                                                <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                                    hidden={this.state.userRoleControlRights && this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                                    onClick={() => this.getEditProtocolComboService(protocolEditParam)}>
                                                                                    <FontAwesomeIcon icon={faPencilAlt} />                                                            
                                                                                </Nav.Link>
                                                                                <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                                    hidden={this.state.userRoleControlRights && this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                                    onClick={() => this.confirmDelete(deleteId)}>
                                                                                    <FontAwesomeIcon icon={faTrashAlt} />                                                            
                                                                                </Nav.Link>
                                                                                <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                                    hidden={this.state.userRoleControlRights && this.state.userRoleControlRights.indexOf(completeId) === -1}
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_COMPLETE" })}
                                                                                    onClick={() => this.completeProtocol(completeId,this.state.protocolSkip,this.state.protocolTake)}>
                                                                                    <FontAwesomeIcon icon={faCheckCircle} />                                                            
                                                                                </Nav.Link>
                                                                                {this.props.Login.masterData && this.props.Login.masterData.actionStatus 
                                                                                    && this.props.Login.masterData.actionStatus.length > 0  
                                                                                    && actionStatus.length > 0 && 
                                                                                    //this.props.userRoleControlRights.indexOf(approvalActionId) !== -1 &&
                                                                                    <CustomPopOver
                                                                                        icon={faPalette}
                                                                                        nav={true}
                                                                                        data={actionStatus}
                                                                                        Button={false}
                                                                                        btnClasses="btn-circle btn_grey ml-2 spacesremovefromaction"
                                                                                        dynamicButton={(value) => this.approveProtocol(value, -1,this.state.protocolSkip,this.state.protocolTake)}
                                                                                        textKey="stransdisplaystatus"
                                                                                        iconKey="ntransactionstatus"

                                                                                    />                                                                                  
                                                                                }
                                                                                <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="#"
                                                                                    hidden={this.state.userRoleControlRights && this.state.userRoleControlRights.indexOf(copyId) === -1}
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                                                    onClick={() => this.copyProtocol(copyId,this.state.protocolSkip,this.state.protocolTake)}>
                                                                                    <FontAwesomeIcon icon={faCopy} />                                                            
                                                                                </Nav.Link>
                                                                                <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="#"
                                                                                    hidden={this.state.userRoleControlRights && this.state.userRoleControlRights.indexOf(rejectId) === -1}
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_REJECT" })}
                                                                                    onClick={() => this.rejectProtocol(rejectId,this.state.protocolSkip,this.state.protocolTake)}>
                                                                                    <Reject className="custom_icons" width="20" height="20" />
                                                                                </Nav.Link>
                                                                            </div>    
                                                                        {/* </div>     */}
                                                                    {/* </Card.Subtitle>  
                                                                </Card.Title>     */}
                                                            </Card.Header>
                                                                <Card.Body className="form-static-wrap">                                     
                                                                    <Row className="no-gutters">
                                                                        <Col md={12}>
                                                                            <Card className="at-tabs">
                                                                                <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                                                                            </Card>
                                                                        </Col>
                                                                    </Row>          
                                                                </Card.Body>       
                                                        </Card>
                                                    :""}    
                                                    </ContentPanel>                                                
                                                </Col>
                                            </Row>
                                        </div>
                                    </SplitterLayout>
                                </div>
                            </ListWrapper>
                        </Col>                      
                    </Row>
                </ListWrapper>
                {this.props.Login.openModal|| this.props.Login.openChildModal ?
                    <SlideOutModal 
                        show={this.props.Login.screenName ==="IDS_PROTOCOL"?this.props.Login.openModal:this.props.Login.openChildModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        noSave={this.props.Login.operation === "view" ? true : false}
                        mandatoryFields={this.props.Login.screenName ==="IDS_PROTOCOL" && this.props.Login.operation ==="create" ? this.state.mandatoryProtocolFields :  mandatoryFields}
                        addComponent={this.props.Login.loadEsign ? (
                            <Esign 
                                operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                        ) : this.props.Login.screenName ===  "IDS_PROTOCOL"  && (this.props.Login.operation ===  "create" || this.props.Login.operation === "update") ? (
                            <DynamicSlideout
                                selectedRecord={this.props.Login.selectedRecord}
                                templateData={this.props.Login.masterData.dynamicDesignMapping && this.props.Login.masterData.dynamicDesignMapping [0].jsondata}
                                handleDateChange={this. dynamicHandleDateChange}
                                onInputOnChange={this.onInputOnChange}
                                onNumericInputChange={this.onNumericInputOnChange}
                                comboData={this.props.Login.comboData}
                                onComboChange={this.onDynamicComboChange}
                                onDropFile={this.onDropFile}
                                deleteAttachment={this.deleteAttachment}
                                onNumericBlur={this.onNumericBlur}
                                userInfo={this.props.Login.userInfo}
                                timeZoneList={this.props.Login.timeZoneList}
                                defaultTimeZone={this.props.Login.defaultTimeZone}
                                Login={this.props.Login}
                                addMasterRecord={this.addMasterRecord}
                                editMasterRecord={this.editMasterRecord}
                                editfield={ this.props.Login.operation === "update" ? this.state.editable: []}
                                selectedSample={this.props.Login.operation === "update" && this.props.Login.masterData.selectedProtocol && this.props.Login.masterData.selectedProtocol[0] || {}}
                                userRoleControlRights={this.props.Login.userRoleControlRights}
                            /> 
                        ) : this.props.Login.screenName ===  "IDS_PROTOCOL"  && this.props.Login.operation ===  "copy" ? (
                            <CopyProtocol
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                operation={this.props.Login.operation}
                                inputParam={this.props.Login.inputParam}
                                productCategory ={this.props.Login.productCategory}
                                product={this.props.Login.product}
                                productCategoryName={this.props.Login.productCategoryName}
                                productName={this.props.Login.productName}
                                protocolName={this.props.Login.protocolName} 
                                selectedRecord={this.state.selectedRecord || {}}
                                userInfo={this.props.Login.userInfo}
                            />

                        ) : this.props.Login.screenName ===  "IDS_PROTOCOLFILE"  && (this.props.Login.operation ===  "create" || this.props.Login.operation === "update") ? (
                            <AddProtocolFile
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onDrop={this.onDropProtocolFile}
                                onDropAccepted={this.onDropAccepted}
                                deleteAttachment={this.deleteAttachment}
                                actionType={this.state.actionType}
                                onComboChange={this.onComboChange}
                                linkMaster={this.props.Login.linkMaster}
                                editFiles={this.props.editFiles}
                                maxSize={20}
                                maxFiles={1}
                                multiple={false}                             
                                label={this.props.intl.formatMessage({ id: "IDS_PROTOCOLFILE" })}
                                name="protocolfilename"
                            />
                        ) : ("")
                    }
                    /> :""}      
                
            </> 

        )


    }

    onFilterComboChange = (comboData, fieldName) => {
        if (comboData) {
            let inputParamData = {};
            if (fieldName === 'napprovalconfigversioncode') {
                if (comboData.value !== this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) {
                    inputParamData = {
                        napprovalconfigversioncode: comboData.value,
                        nFilterFlag: true,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        defaultApprovalVersionValue: comboData.item

                    };
                    this.props.getProtocolTemplateByConfigVersion(inputParamData);

                }
            } else if (fieldName === 'ndesigntemplatemappingcode') {
                if (comboData.value !== this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode) {
                    const masterData = { ...this.props.Login.masterData, defaultDesignTemplateMappingValue: comboData.item };
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    };
                    this.props.updateStore(updateInfo);
                }
            } else if (fieldName === 'ntransactionstatus') {
                if (comboData.value !== this.props.Login.masterData.defaultStatusValue.ntransactionstatus) {
                    const masterData = { ...this.props.Login.masterData, defaultStatusValue: comboData.item };
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    };
                    this.props.updateStore(updateInfo);
                }
            }
        }
    }

    onFilterSubmit = () => {

        const realApprovalVersionValue = this.props.Login.masterData.defaultApprovalVersionValue;
        const realDesignTemplateMappingValue = this.props.Login.masterData.defaultDesignTemplateMappingValue;
        const realStatusValue = this.props.Login.masterData.defaultStatusValue;
        const masterData = { ...this.props.Login.masterData, realApprovalVersionValue, realDesignTemplateMappingValue, realStatusValue };
        const inputData = {
            napprovalconfigversioncode: this.props.Login.masterData.defaultApprovalVersionValue  
                                        && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode
                                        && parseInt(this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) 
                                        || -1,   
            ndesigntemplatemappingcode:this.props.Login.masterData.defaultDesignTemplateMappingValue
                                       && this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode 
                                       && parseInt(this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode)
                                        || -1,
            ntranscode: this.props.Login.masterData.defaultStatusValue 
                        && this.props.Login.masterData.defaultStatusValue.ntransactionstatus 
                        || -1,
            userinfo: this.props.Login.userInfo
        };
        if (inputData.napprovalconfigversioncode !== -1 && inputData.ndesigntemplatemappingcode !== -1 && inputData.ntransactionstatus !== -1) {
            const inputParam = {
                masterData,
                inputData,
                protocolSkip: this.state.protocolSkip,
                protocolTake: this.state.protocolTake,
                searchRef :this.searchRef
            };
            this.props.ProtocolFilterSubmit(inputParam);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
        }
    }

    reloadData = () => {
        this.searchRef.current.value = "";
        const realApprovalVersionValue = this.props.Login.masterData.defaultApprovalVersionValue;
        const realDesignTemplateMappingValue = this.props.Login.masterData.defaultDesignTemplateMappingValue;
        const realStatusValue = this.props.Login.masterData.defaultStatusValue;
        const masterData = { ...this.props.Login.masterData, realApprovalVersionValue, realDesignTemplateMappingValue, realStatusValue };
        const inputData = {
            napprovalconfigversioncode: this.props.Login.masterData.defaultApprovalVersionValue  
                                        && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode
                                        && parseInt(this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) 
                                        || -1,   
            ndesigntemplatemappingcode:this.props.Login.masterData.defaultDesignTemplateMappingValue
                                       && this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode 
                                       && parseInt(this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode)
                                        || -1,
            ntranscode: this.props.Login.masterData.defaultStatusValue 
                        && this.props.Login.masterData.defaultStatusValue.ntransactionstatus 
                        || -1,
            userinfo: this.props.Login.userInfo
        };
        const inputParam = {
            masterData,
            inputData,
            protocolSkip: this.state.protocolSkip,
            protocolTake: this.state.protocolTake,
            searchRef :this.searchRef
        };
        this.props.ProtocolFilterSubmit(inputParam);
    }

    getProtocolComboService = (protocolAddParam) => {

        const screenName = protocolAddParam.screenName;
        const operation = protocolAddParam.operation;
        const masterData = protocolAddParam.masterData;
        const selectedRecord = protocolAddParam.selectedRecord;
        const userInfo = protocolAddParam.userInfo;
        const controlCode = protocolAddParam.ncontrolCode;
        let importData;

        let data = [];
        const withoutCombocomponent = [];
        const mandatoryProtocolFields = [];
        const Layout = this.props.Login.masterData.dynamicDesignMapping
                       && this.props.Login.masterData.dynamicDesignMapping[0].jsondata;
        const templateStatus = this.props.Login.masterData.dynamicDesignMapping
                                && this.props.Login.masterData.dynamicDesignMapping[0].ntransactionstatus;               
        if (Layout !== undefined && Layout !== null) {
            if(templateStatus ==transactionStatus.RETIRED){
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDDESIGNTEMPLATE" }));
            }else{
                Layout.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if (component.hasOwnProperty("children")) {
                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo" || componentrow.inputtype === "backendsearchfilter"
                                        || componentrow.inputtype === "frontendsearchfilter") {
                                        data.push(componentrow)
                                    } else {
                                        withoutCombocomponent.push(componentrow)
                                    }
                                    if (componentrow.mandatory === true) {
                                        mandatoryProtocolFields.push({
                                            "mandatory": true,
                                            "idsName": componentrow.label,
                                            "dataField": componentrow.label,
                                            "mandatoryLabel": componentrow.inputtype === "combo" ?
                                            "IDS_SELECT" : "IDS_ENTER",
                                            "controlType": componentrow.inputtype === "combo" ?
                                            "selectbox" : "textbox"
                                        })
                                    }
                                })
                            } else {
                                component.inputtype === "combo" || component.inputtype === "backendsearchfilter"
                                    || component.inputtype === "frontendsearchfilter" ?
                                    data.push(component) : withoutCombocomponent.push(component)
                                if (component.mandatory === true) {
                                    mandatoryProtocolFields.push({
                                        "mandatory": true,
                                        "idsName": component.label,
                                        "dataField": component.label,
                                        "mandatoryLabel": component.inputtype === "combo" ?
                                        "IDS_SELECT" : "IDS_ENTER",
                                        "controlType": component.inputtype === "combo" ?
                                        "selectbox" : "textbox"
                                    })
                                }
    
                            }
                        })
                        this.setState({ mandatoryProtocolFields: mandatoryProtocolFields });
                    })
    
                })
                const comboComponents = data;
                let childColumnList = {};
                data.map(columnList => {
                    const val = comboChild(data, columnList, childColumnList, true);
                    data = val.data;
                    childColumnList = val.childColumnList
                    return null;
                });
                const mapOfFilterRegData = {
                    nsampletypecode: parseInt(SampleType.PROTOCOL)
                };
    
                this.props.getPreviewTemplate(masterData, userInfo, controlCode,
                    data, selectedRecord, childColumnList, comboComponents, withoutCombocomponent, false, true,
                    mapOfFilterRegData, false, operation, screenName, importData);
            }            
        } else {
            // ALPD-5466 - Gowtham R - 20/02/2025 - Protocol-->While Add the Protocol IDS Alert Popup Shown
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CONFIGUREPROTOCOLTEMPLATE" }));
        }

    }
    getEditProtocolComboService = (protocolEditParam) => {
        protocolEditParam["toedit"] = this.props.Login.masterData.selectedProtocol[0];
        let data = [];
        let editablecombo = [];
        const withoutCombocomponent = [];
        const Layout = this.props.Login.masterData.dynamicDesignMapping
            && this.props.Login.masterData.dynamicDesignMapping[0].jsondata;
        if (Layout !== undefined) {
            Layout.map(row => {
                return row.children.map(column => {
                    return column.children.map(component => {
                        if (component.hasOwnProperty("children")) {
                            component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    data.push(componentrow)
                                } else {
                                    withoutCombocomponent.push(componentrow)
                                }
                                if (componentrow.inputtype === "combo" && componentrow.iseditablereadonly && componentrow.iseditablereadonly === true) {
                                    editablecombo.push(componentrow)
                                }

                                return null;
                            })
                        } else {
                            if (component.inputtype === "combo" && component.iseditablereadonly && component.iseditablereadonly === true) {
                                editablecombo.push(component);
                            }
                            else if (component.inputtype === "combo") {
                                data.push(component);
                            } else {
                                withoutCombocomponent.push(component);
                            }
                        }
                    })
                })
            })
            const comboComponents = data;
            let childColumnList = {};
            data.map(columnList => {
                const val = comboChild(data, columnList, childColumnList, true);
                data = val.data;
                childColumnList = val.childColumnList;
                return null;
            });
            this.props.getEditComboService(protocolEditParam,
                data, this.state.selectedRecord, childColumnList,
                comboComponents, withoutCombocomponent, editablecombo);
        } else {
            // ALPD-5466 - Gowtham R - 20/02/2025 - Protocol-->While Add the Protocol IDS Alert Popup Shown
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CONFIGUREPROTOCOLTEMPLATE" }));
        }
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete"
                || this.props.Login.operation === "complete" 
                || this.props.Login.operation === "dynamicAction"
                || this.props.Login.operation === "reject") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason'] = "";
            }
        }
        else {
            openModal = false;
            openChildModal = false;
            selectedRecord = {};
            screenName = "";
            operation = "";
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, openChildModal, loadEsign, selectedRecord, selectedId: null, screenName, operation }
        };
        this.props.updateStore(updateInfo);
    }

    validateEsign = () => {
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
        };
        this.props.validateEsignforProtocol(inputParam, "openModal");
    }

    dynamicHandleDateChange = (dateValue, dateName) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onDynamicComboChange = (comboData, control, customName) => {
        const selectedRecord = this.state.selectedRecord || {};
        let comboName = customName || control.label;

        if (comboData) {
            comboData["item"] = {
                ...comboData["item"], "pkey": control.valuemember,
                "nquerybuildertablecode": control.nquerybuildertablecode, source: control.source
            };
            selectedRecord[comboName] = comboData;
        } else {
            selectedRecord[comboName] = [];
        }

        const inputParam = {
            child: control.child,
            source: control.source,
            primarykeyField: control.valuemember,
            value: comboData ? comboData.value : -1,
            item: comboData ? comboData.item : "",
            label: comboData ? comboName : "",
            nameofdefaultcomp: control.name,
            screenName: "IDS_PROTOCOL"
        };
        if (comboData) {
            let parentList = [];
            let childComboList = [];
            let childColumnList = {};
            let product = false;
            let productCategory = false;
            let nproductcatcode = -1;
            let nproductcode = -1;
            if (control.name === 'Product Category') {
                const Product = this.props.Login.comboComponents.filter(x => x.name === "Product");
                nproductcatcode = selectedRecord[control.label] && selectedRecord[control.label]['value'];
            }
            if (control.child && control.child.length > 0) {
                childComboList = getSameRecordFromTwoArrays(this.props.Login.comboComponents, control.child, "label");
                childColumnList = {};
                childComboList.map(columnList => {
                    const val = comboChild(this.props.Login.comboComponents, columnList, childColumnList, false);
                    childColumnList = val.childColumnList
                    return null;
                });

                parentList = getSameRecordFromTwoArrays(this.props.Login.withoutCombocomponent, control.child, "label")
                const mapOfFilter = {
                    nproductcode, nproductcatcode,
                    nsampletypecode: -1,
                    nprojectmastercode: -1, nprojectSpecReqd: -1,
                    nneedsubsample: transactionStatus.NO,
                    nportalrequired: -1,
                    ntestgroupspecrequired: transactionStatus.NO
                }
                this.props.getChildValues(inputParam, this.props.Login.userInfo, selectedRecord, this.props.Login.comboData,
                    childComboList, childColumnList, this.props.withoutCombocomponent,
                    [...childComboList, ...parentList], productCategory, product, mapOfFilter,
                    false, false, false, false, false,
                    undefined, false, this.props.Login.comboComponents)
            } else {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedRecord, loadCustomSearchFilter: false, }
                }
                this.props.updateStore(updateInfo);
            }
        }

    }

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    };

    onNumericBlur = (control) => {
        const selectedRecord = this.state.selectedRecord;
        if (selectedRecord[control.label]) {
            if (control.max) {
                if (!(selectedRecord[control.label] < parseFloat(control.max))) {
                    selectedRecord[control.label] = control.precision ? parseFloat(control.max) : parseInt(control.max);
                }
            }
            if (control.min) {
                if (!(selectedRecord[control.label] > parseFloat(control.min))) {
                    selectedRecord[control.label] = control.precision ? parseFloat(control.min) : parseInt(control.min);
                }
            }
        }
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event, optional) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO ;
            }else {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            }
        } else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = optional;
        }
        else {
            if (event.target.value !== "") {
                selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if(fieldName === "nproductcatcode"){
            selectedRecord["nproductcatcode"] = comboData;
            this.props.getProduct(this.state.selectedRecord.nproductcatcode.value,                                  
                                  this.props.Login.userInfo,
                                  selectedRecord);
        }else{
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }     
    }

    deleteAttachment = (event, file, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file);
        this.setState({ selectedRecord, actionType: "delete" });
    };

    onDropFile = (attachedFiles, fieldName, maxSize) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    onDropProtocolFile = (attachedFiles, fieldName, maxSize) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    openFilter = () => {
        const showFilter = !this.props.Login.showFilter;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        };
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {
        const inputValues = {
            statusValue:this.props.Login.masterData.realStatusValue || {} ,
            defaultStatusValue: this.props.Login.masterData.realStatusValue || {},
            configVersionValue:this.props.Login.masterData.realApprovalVersionValue || {} ,
            defaultApprovalVersionValue: this.props.Login.masterData.realApprovalVersionValue || {},
            dynamicDesignMappingValue:this.props.Login.masterData.realDesignTemplateMappingValue || {} ,
            defaultDesignTemplateMappingValue: this.props.Login.masterData.realDesignTemplateMappingValue || {}, 
        };
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false,masterData: { ...this.props.Login.masterData, ...inputValues } }
        };
        this.props.updateStore(updateInfo);
    };

    onSaveClick = (saveType, formRef) => {
        if (this.props.Login.screenName === "IDS_PROTOCOL" && this.props.Login.operation === "create") {
            this.insertProtocol(saveType, formRef);
        }
        if (this.props.Login.screenName === "IDS_PROTOCOL" && this.props.Login.operation === "update") {
            this.updateProtocol(saveType, formRef);
        }
        if (this.props.Login.screenName === "IDS_PROTOCOL" && this.props.Login.operation === "copy") {
            this.copySaveProtocol(saveType, formRef);
        }
        if (this.props.Login.screenName === "IDS_PROTOCOLFILE") {
            this.insertProtocolFile(saveType, formRef);
        }
    };

    insertProtocol = (saveType, formRef) => {
        let Map = {};
        let isFileupload = false;
        Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
        Map["napprovalconfigversioncode"] = this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode;
        Map["ntranscode"] = this.props.Login.masterData.realStatusValue.ntransactionstatus;

        const param = this.setProtocol(this.props.Login.masterData, this.state.selectedRecord,
            this.props.Login.masterData.dynamicDesignMapping[0].jsondata,
            this.props.Login.userInfo, this.props.Login.defaultTimeZone, 'create', this.props.Login.comboComponents);
        Map["protocol"] = param.protocol;
        Map["protocolVersion"] = param.protocolVersion;
        Map["dateList"] = param.dateList;
        Map["userinfo"] = this.props.Login.userInfo;
        Map["combinationUnique"] = this.state.dynamicCombinationUnique;

        let tempData = {};
        const formData = new FormData();
        let count = 0;
        this.props.Login.withoutCombocomponent.map(item => {
            if (item.inputtype === "files") {
                this.state.selectedRecord[item && item.label] && this.state.selectedRecord[item && item.label].forEach((item1, index) => {
                    const fileName = create_UUID();
                    const splittedFileName = item1.name.split('.');
                    const fileExtension = item1.name.split('.')[splittedFileName.length - 1];
                    const uniquefilename = fileName + '.' + fileExtension;
                    tempData[item && item.label + '_susername_Protocol'] = this.props.Login.userInfo.susername;
                    tempData[item && item.label + '_suserrolename_Protocol'] = this.props.Login.userInfo.suserrolename;
                    tempData[item && item.label + '_nfilesize_Protocol'] = item1.size;
                    tempData[item && item.label + '_ssystemfilename_Protocol'] = uniquefilename;
                    tempData[item && item.label] = Lims_JSON_stringify(item1.name.trim(), false)
                    formData.append("uploadedFile" + count, item1);
                    formData.append("uniquefilename" + count, uniquefilename);
                    count++;
                    formData.append("isFileEdited", transactionStatus.YES);
                    formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                    Map['isFileupload'] = true;
                    Map["protocolVersion"]['jsondata'] = {
                        ...Map["protocolVersion"]['jsondata'],
                        ...tempData
                    };
                    Map["protocolVersion"]['jsonuidata'] = {
                        ...Map["protocolVersion"]['jsonuidata'],
                        ...tempData
                    };
                    formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                    isFileupload = true;
                })
            }
        })    
        formData.append("Map", Lims_JSON_stringify(JSON.stringify(Map)));
        formData.append("filecount", count);


        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Protocol",
            displayName: this.props.Login.inputParam.displayName,
            inputData: Map,
            selectedId: this.state.selectedRecord["nprotocolcode"],
            operation: 'create',
            searchRef: this.searchRef,
            formData: formData,
            isFileupload,
            postParamList: this.postParamList
        };

        // if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: {
        //             loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
        //             openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_PROTOCOL" }),
        //             operation: 'create', saveType, formRef,
        //         }
        //     }
        //     this.props.updateStore(updateInfo);
        // } else {
            this.props.insertProtocolAction(inputParam, this.props.Login.masterData, "openModal");
        //}


    }

    updateProtocol = (saveType, formRef) => {
        let isFileupload = false;
        let Map = {};
        let dynamicValue =JSON.parse(this.props.Login.masterData.dynamicDesign.jsondata.value);

        Map["ndesigntemplatemappingcode"] = this.props.Login.masterData && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
        Map["napprovalconfigversioncode"] = this.props.Login.masterData && this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode;
        Map["ntranscode"] = this.props.Login.masterData && this.props.Login.masterData.realStatusValue.ntransactionstatus;

        const param = this.setProtocol(this.props.Login.masterData, this.state.selectedRecord,
            this.props.Login.masterData.dynamicDesignMapping[0].jsondata,
            this.props.Login.userInfo, this.props.Login.defaultTimeZone, 'update', this.props.Login.comboComponents);

        Map["protocol"] = param.protocol;
        Map["protocolVersion"] = param.protocolVersion;
        Map["protocolVersion"]["jsonuidata"]["nprotocolcode"] = String(this.state.selectedRecord.nprotocolcode);
        Map["protocolVersion"]["nprotocolcode"] = String(this.state.selectedRecord.nprotocolcode);
        Map["protocol"]["nprotocolcode"] = String(this.state.selectedRecord.nprotocolcode);
        Map["nprotocolcode"] = this.state.selectedRecord.nprotocolcode;
        Map["dateList"] = param.dateList;
        Map['dateConstraints'] = dynamicValue.dateconstraints;
        Map["combinationUnique"] = this.state.dynamicCombinationUnique;
        Map["selectedProtocol"] = this.props.Login.masterData.selectedProtocol;            
        Map["userinfo"] = this.props.Login.userInfo;   

        let tempData = {};
        const formData = new FormData();
            this.props.Login.withoutCombocomponent.map(item => {
                if (item.inputtype === "files") {
                    if (typeof this.state.selectedRecord[item && item.label] === "object") {
                        this.state.selectedRecord[item && item.label] && this.state.selectedRecord[item && item.label].forEach((item1, index) => {
                            const fileName = create_UUID();
                            const splittedFileName = item1.name.split('.');
                            const fileExtension = item1.name.split('.')[splittedFileName.length - 1];
                            const uniquefilename = fileName + '.' + fileExtension;    
                            tempData[item && item.label + '_susername_Sample'] = this.props.Login.userInfo.susername;
                            tempData[item && item.label + '_suserrolename_Sample'] = this.props.Login.userInfo.suserrolename;
                            tempData[item && item.label + '_nfilesize_Sample'] = item1.size;
                            tempData[item && item.label + '_ssystemfilename_Sample'] = uniquefilename;
                            tempData[item && item.label] = Lims_JSON_stringify(item1.name.trim(), false)
                            formData.append("uploadedFile" + index, item1);
                            formData.append("uniquefilename" + index, uniquefilename);
                            formData.append("filecount", this.state.selectedRecord[item && item.label].length);
                            formData.append("isFileEdited", transactionStatus.YES);
                            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                            Map['isFileupload'] = true;
                            Map["protocolVersion"]['jsondata'] = {
                                ...Map["protocolVersion"]['jsondata'],
                                ...tempData
                            };
                            Map["protocolVersion"]['jsonuidata'] = {
                                ...Map["protocolVersion"]['jsonuidata'],
                                ...tempData
                            };
                            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                            formData.append("Map", Lims_JSON_stringify(JSON.stringify(Map)));
                            isFileupload = true;
                        }
                        )
                    }
                }
            })
            
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "Protocol",
                displayName: this.props.Login.inputParam.displayName,
                inputData: Map,
                action:"editprotocol",
                operation: "update", saveType, formRef,
                selectedRecord: { ...this.state.selectedRecord, sloginid: this.props.Login.userInfo.sloginid },           
                isFileupload, formData: formData
            };

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName: "IDS_PROTOCOL",
                        operation: 'update'
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.updateProtocolAction(inputParam, this.props.Login.masterData, "openModal");
            }
    };

    setProtocol = (masterData, selectedRecord, templateList, userInfo, defaulttimeZone, operation, comboComponents) => {
        let protocol = {};
        let protocolVersion = {};
        let dateList = [];
        protocolVersion["ndesigntemplatemappingcode"] = masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
        protocolVersion["napproveconfversioncode"] = masterData.realApprovalVersionValue.napprovalconfigversioncode;
        protocol["nproductcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']].value : -1;
        protocol["nproductcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']].value : -1;
        protocolVersion["sprotocolname"] = selectedRecord["Protocol Name"];
        protocol["sprotocolid"] = "-";
        protocolVersion["sversion"] = "-";
        protocolVersion["jsondata"] = {};
        protocolVersion["jsonuidata"] = {};


        templateList && templateList.map(row => {
            return row.children.map(column => {
                return column.children.map(component => {
                    if (component.hasOwnProperty("children")) {
                        return component.children.map(componentrow => {
                            if (componentrow.inputtype === "combo" || componentrow.inputtype === "predefineddropdown") {
                                if (componentrow.inputtype === "predefineddropdown") {
                                    protocolVersion["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                        {
                                            value: selectedRecord[componentrow.label].value,
                                            label: selectedRecord[componentrow.label].label


                                        } : -1
                                    protocolVersion["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : "";

                                } else {
                                    protocolVersion["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                        {
                                            value: selectedRecord[componentrow.label].value,
                                            label: selectedRecord[componentrow.label].label,
                                            pkey: componentrow.valuemember,
                                            nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                            source: componentrow.source,
                                            [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]: operation === "update" ?
                                                selectedRecord[componentrow.label].item ? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                                    selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                                :
                                                selectedRecord[componentrow.label].item ? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                                    selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] ? selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                                        : selectedRecord[componentrow.label].vale

                                        } : -1
                                    protocolVersion["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : "";

                                }
                            }
                            else if (componentrow.inputtype === "date") {
                                if (componentrow.mandatory) {
                                    protocolVersion["jsondata"][componentrow.label] = (typeof selectedRecord[componentrow.label] === "object") ?
                                        convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                            selectedRecord[componentrow.label] : new Date(), userInfo) :
                                        (typeof selectedRecord[componentrow.label] === "number") ?
                                            convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)
                                            : selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : "";

                                    protocolVersion["jsonuidata"][componentrow.label] = protocolVersion["jsondata"][componentrow.label]
                                } else {
                                    protocolVersion["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                        typeof selectedRecord[componentrow.label] === "object" ?
                                            convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : new Date(), userInfo) :
                                            typeof selectedRecord[componentrow.label] === "number" ?
                                                convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                    new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)

                                                : selectedRecord[componentrow.label] ?
                                                    selectedRecord[componentrow.label] : "" :
                                        selectedRecord[componentrow.label] ? typeof selectedRecord[componentrow.label] === "object" ?
                                            convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : new Date(), userInfo) : typeof selectedRecord[componentrow.label] === "number" ?
                                                convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                    new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)

                                                : selectedRecord[componentrow.label] ?
                                                    selectedRecord[componentrow.label]
                                                    : "" : "";

                                    protocolVersion["jsonuidata"][componentrow.label] = protocolVersion["jsondata"][componentrow.label]
                                }
                                if (componentrow.timezone) {
                                    protocolVersion["jsondata"][`tz${componentrow.label}`] = selectedRecord[`tz${componentrow.label}`] ?
                                        { value: selectedRecord[`tz${componentrow.label}`].value, label: selectedRecord[`tz${componentrow.label}`].label } :
                                        defaulttimeZone ? defaulttimeZone : -1

                                    protocolVersion["jsonuidata"][`tz${componentrow.label}`] = protocolVersion["jsondata"][`tz${componentrow.label}`]
                                }
                                dateList.push(componentrow.label)
                            }

                            else {
                                protocolVersion["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                    selectedRecord[componentrow.label] : ""

                                protocolVersion["jsonuidata"][componentrow.label] = protocolVersion["jsondata"][componentrow.label]
                            }
                        })
                        return protocolVersion;

                    }
                    else {
                        if (component.inputtype === "combo" || component.inputtype === "predefineddropdown") {
                            if (component.inputtype === "predefineddropdown") {
                                protocolVersion["jsondata"][component.label] = selectedRecord[component.label] ?
                                    {
                                        value: selectedRecord[component.label].value,
                                        label: selectedRecord[component.label].label,


                                    } : -1
                                protocolVersion["jsonuidata"][component.label] = selectedRecord[component.label] ? selectedRecord[component.label].label : "";

                            } else {
                                protocolVersion["jsondata"][component.label] = selectedRecord[component.label] ?
                                    {
                                        value: selectedRecord[component.label].value,
                                        label: selectedRecord[component.label].label,
                                        pkey: component.valuemember,
                                        nquerybuildertablecode: component.nquerybuildertablecode,
                                        source: component.source,
                                        [component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]: operation === "update" ?
                                            selectedRecord[component.label].item ? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                                selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                            :
                                            selectedRecord[component.label].item ? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                                selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] ? selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                                    : selectedRecord[component.label].value

                                    } : -1
                                protocolVersion["jsonuidata"][component.label] = selectedRecord[component.label] ? selectedRecord[component.label].label : "";

                            }
                        }
                        else if (component.inputtype === "date") {
                            if (component.mandatory) {
                                console.log(typeof selectedRecord[component.label] === "object")
                                protocolVersion["jsondata"][component.label] = typeof selectedRecord[component.label] === "object" ?

                                    convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                        selectedRecord[component.label] : new Date(), userInfo) :
                                    (typeof selectedRecord[component.label] === "number") ?
                                        convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                            new Date(selectedRecord[component.label]) : new Date(), userInfo) :
                                        selectedRecord[component.label] ?
                                            selectedRecord[component.label] : "";

                                protocolVersion["jsonuidata"][component.label] = protocolVersion["jsondata"][component.label]
                            } else {
                                protocolVersion["jsondata"][component.label] = component.loadcurrentdate ?
                                    typeof selectedRecord[component.label] === "object" ?
                                        convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                            selectedRecord[component.label] : new Date(), userInfo) :
                                        typeof selectedRecord[component.label] === "number" ?
                                            convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                                new Date(selectedRecord[component.label]) : new Date(), userInfo)

                                            : selectedRecord[component.label] ?
                                                selectedRecord[component.label] : "" :
                                    selectedRecord[component.label] ? typeof selectedRecord[component.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                        selectedRecord[component.label] : new Date(), userInfo) : typeof selectedRecord[component.label] === "number" ?
                                        convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                            new Date(selectedRecord[component.label]) : new Date(), userInfo)
                                        : selectedRecord[component.label] ?
                                            selectedRecord[component.label] : "" : "";

                                protocolVersion["jsonuidata"][component.label] = protocolVersion["jsondata"][component.label]
                            }
                            if (component.timezone) {
                                protocolVersion["jsondata"][`tz${component.label}`] = selectedRecord[`tz${component.label}`] ?
                                    { value: selectedRecord[`tz${component.label}`].value, label: selectedRecord[`tz${component.label}`].label } :
                                    defaulttimeZone ? defaulttimeZone : -1

                                protocolVersion["jsonuidata"][`tz${component.label}`] = protocolVersion["jsondata"][`tz${component.label}`]
                            }
                            dateList.push(component.label)
                        }
                        else {
                            protocolVersion["jsondata"][component.label] = selectedRecord[component.label] ?
                                selectedRecord[component.label] : ""

                            protocolVersion["jsonuidata"][component.label] = protocolVersion["jsondata"][component.label]
                        }
                        return protocolVersion;
                    }
                }
                )
            })
        })
        const param = { protocol, protocolVersion, dateList };
        return param;

    };

    confirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteProtocol("delete", deleteId));
    }

    deleteProtocol = (operation, ncontrolCode) => {
        let inputData = [];
        inputData["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
        inputData["napprovalconfigversioncode"] = this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode;
        inputData["ntranscode"] = this.props.Login.masterData.realStatusValue.ntransactionstatus;
        inputData["nprotocolcode"] = this.props.Login.masterData.selectedProtocol[0].nprotocolcode;
        inputData["userinfo"] = this.props.Login.userInfo;
        const postParam = {
            inputListName: "protocol", selectedObject: "selectedProtocol",
            primaryKeyField: "nprotocolcode",
            primaryKeyValue: this.props.Login.masterData.selectedProtocol[0].nprotocolcode,
            fetchUrl: "protocol/getActiveProtocolById",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "Protocol",
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "delete",
            action:"deleteprotocol",
            postParam
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "IDS_PROTOCOL", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    completeProtocol = (ncontrolCode, protocolSkip, protocolTake) => {

        let protocolList =[];
        if (this.props.Login.masterData.searchedProtocol !== undefined) {
            protocolList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedProtocol, 
                           this.props.Login.masterData.searchedProtocol.slice(protocolSkip, protocolSkip + protocolTake), "nprotocolcode");
        } else {
            protocolList = this.props.Login.masterData.protocol && this.props.Login.masterData.protocol.slice(protocolSkip, protocolSkip + protocolTake);
        }
        let completeList = getSameRecordFromTwoArrays(protocolList || [], this.props.Login.masterData.selectedProtocol, "nprotocolcode");
        if(completeList && completeList.length===0){
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPROTOCOL" }));
        // }else if(completeList && completeList.length>1){
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYONEPROTOCOL" }));
        }else if(completeList && completeList.length===1){                
            let Map = {};
            Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
            Map["napprovalconfigversioncode"] = this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode;
            Map["nprotocolcode"] = this.props.Login.masterData.selectedProtocol[0].nprotocolcode;
            Map["userinfo"] = this.props.Login.userInfo;
            Map["masterData"] = this.props.Login.masterData;
            const postParam = {
                inputListName: "protocol", selectedObject: "selectedProtocol",
                primaryKeyField: "nprotocolcode",
                primaryKeyValue: this.props.Login.masterData.selectedProtocol[0].nprotocolcode,
                fetchUrl: "protocol/getActiveProtocolById",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            const inputParam = {
                methodUrl: "Protocol",
                classUrl: this.props.Login.inputParam.classUrl,
                postParamList: this.postParamList,
                inputData: Map,
                operation: "complete",
                action:"complete",
                postParam
            }
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "IDS_PROTOCOL", operation:"complete"
                    }
                }
                this.props.updateStore(updateInfo);
            }else {
                this.props.completeProtocolAction(inputParam, masterData, "");
            }
        }

    }
    approveProtocol = (status, needEsign,protocolSkip, protocolTake) => {

        let protocolList =[];
        if (this.props.Login.masterData.searchedProtocol !== undefined) {
            protocolList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedProtocol, 
                           this.props.Login.masterData.searchedProtocol.slice(protocolSkip, protocolSkip + protocolTake), "nprotocolcode");
        } else {
            protocolList = this.props.Login.masterData.protocol && this.props.Login.masterData.protocol.slice(protocolSkip, protocolSkip + protocolTake);
        }
        let approveList = getSameRecordFromTwoArrays(protocolList || [], this.props.Login.masterData.selectedProtocol, "nprotocolcode");
        if(approveList && approveList.length===0){
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPROTOCOL" }));
        // }else if(completeList && completeList.length>1){
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYONEPROTOCOL" }));
        }else if(approveList && approveList.length===1){                
            let Map = {};
            Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
            Map["napprovalconfigversioncode"] = this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode;
            Map["nprotocolcode"] = this.props.Login.masterData.selectedProtocol[0].nprotocolcode;
            Map["userinfo"] = this.props.Login.userInfo;
            Map["masterData"] = this.props.Login.masterData;           
            Map["napprovalstatus"] = status.ntransactionstatus;
            const masterData = this.props.Login.masterData;
            const inputParam = {
                inputData: Map,
                classUrl: this.props.Login.inputParam.classUrl,
                operation: "dynamicAction",
                methodUrl: "Protocol",
                screenName: "IDS_PROTOCOL",
                action: "dynamicAction"
            };
            if (needEsign === transactionStatus.YES) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "IDS_PROTOCOL", operation: "dynamicAction", selectedRecord: {}
                    }
                };
                this.props.updateStore(updateInfo);
            } else {
                this.props.dynamicAction(inputParam, masterData, "openModal", {});
            }
        }    
    }

    rejectProtocol = (ncontrolCode, protocolSkip, protocolTake) => {

        let protocolList =[];
        if (this.props.Login.masterData.searchedProtocol !== undefined) {
            protocolList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedProtocol, 
                           this.props.Login.masterData.searchedProtocol.slice(protocolSkip, protocolSkip + protocolTake), "nprotocolcode");
        } else {
            protocolList = this.props.Login.masterData.protocol && this.props.Login.masterData.protocol.slice(protocolSkip, protocolSkip + protocolTake);
        }
        let rejectList = getSameRecordFromTwoArrays(protocolList || [], this.props.Login.masterData.selectedProtocol, "nprotocolcode");
        if(rejectList && rejectList.length===0){
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPROTOCOL" }));
        // }else if(completeList && completeList.length>1){
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYONEPROTOCOL" }));
        }else if(rejectList && rejectList.length===1){                
            let Map = {};
            Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
            Map["napprovalconfigversioncode"] = this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode;
            Map["nprotocolcode"] = this.props.Login.masterData.selectedProtocol[0].nprotocolcode;
            Map["userinfo"] = this.props.Login.userInfo;
            Map["masterData"] = this.props.Login.masterData;
            const postParam = {
                inputListName: "protocol", selectedObject: "selectedProtocol",
                primaryKeyField: "nprotocolcode",
                primaryKeyValue: this.props.Login.masterData.selectedProtocol[0].nprotocolcode,
                fetchUrl: "protocol/getActiveProtocolById",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            };
            const inputParam = {
                methodUrl: "Protocol",
                classUrl: this.props.Login.inputParam.classUrl,
                inputData: Map,
                operation: "reject",
                postParam,
                action: "reject"
            };
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "IDS_PROTOCOL", operation:"reject"
                    }
                }
                this.props.updateStore(updateInfo);
            }else {
                this.props.rejectProtocolAction(inputParam, masterData, "");
            }
        }

    }

    copyProtocol = (ncontrolCode, protocolSkip, protocolTake) => {
        let protocolList =[];
        if (this.props.Login.masterData.searchedProtocol !== undefined) {
            protocolList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedProtocol, 
                           this.props.Login.masterData.searchedProtocol.slice(protocolSkip, protocolSkip + protocolTake), "nprotocolcode");
        } else {
            protocolList = this.props.Login.masterData.protocol && this.props.Login.masterData.protocol.slice(protocolSkip, protocolSkip + protocolTake);
        }
        let copyList = getSameRecordFromTwoArrays(protocolList || [], this.props.Login.masterData.selectedProtocol, "nprotocolcode");
        if(copyList && copyList.length===0){
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPROTOCOL" }));
        // }else if(copyList && copyList.length>1){
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYONEPROTOCOL" }));
        }else if(copyList && copyList.length===1){                
            let Map = {};
            Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
            Map["napprovalconfigversioncode"] = this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode;
            Map["nprotocolcode"] = this.props.Login.masterData.selectedProtocol[0].nprotocolcode;
            Map["userinfo"] = this.props.Login.userInfo;
            Map["masterData"] = this.props.Login.masterData;
            Map["operation"] = "copy";
            Map["screenName"]= "IDS_PROTOCOL";
            Map["ncontrolCode"]=ncontrolCode;
            const inputParam = {               
                inputData: Map,
            };        
            this.props.copyProtocolAction(inputParam);            
        }
    }
    
    copySaveProtocol = (saveType, formRef) => {

        let Map = {};
        Map["ndesigntemplatemappingcode"] = this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode;
        Map["napprovalconfigversioncode"] = this.props.Login.masterData.realApprovalVersionValue.napprovalconfigversioncode;
        Map["ntranscode"] = this.props.Login.masterData.realStatusValue.ntransactionstatus;
        Map["nprotocolcode"] = this.props.Login.masterData.selectedProtocol[0].nprotocolcode;
        Map["sprotocolname"] = this.state.selectedRecord.sprotocolname;
        Map["sprotocolid"] = "-";
        Map["Sample Category"]= {
            "pkey": "nproductcatcode",
            "label": this.state.selectedRecord.nproductcatcode.label,
            "value": this.state.selectedRecord.nproductcatcode.value,
            "source": "productcategory",
            "nproductcatcode": this.state.selectedRecord.nproductcatcode.value,
            "nquerybuildertablecode": "107"
        }

        Map["Sample Type"]= {
            "pkey": "nproductcode",
            "label": this.state.selectedRecord.nproductcode.label,
            "value": this.state.selectedRecord.nproductcode.value,
            "source": "product",
            "nproductcatcode": this.state.selectedRecord.nproductcode.value,
            "nquerybuildertablecode": "105"
        }
     
        Map["userinfo"] = this.props.Login.userInfo;
        Map["masterData"] = this.props.Login.masterData;
       
        const inputParam = {   
            methodUrl: "Protocol",
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: Map,
            operation: "copy", 
            action:"copy"           
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {                     
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: "IDS_PROTOCOL", operation:"copy",saveType,formRef
                }
            };
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        };
        this.props.updateStore(updateInfo);
    }

    tabDetail = () => {
        const tabMap = new Map();
       tabMap.set("IDS_PROTOCOLINFORMATION",
            <ProtocolView
                 data={(this.props.Login.masterData.selectedProtocol && this.props.Login.masterData.selectedProtocol.length > 0) ?
                        this.props.Login.masterData.selectedProtocol[0]: {}}
                singleItem={this.props.Login.masterData.selectedProtocol && this.props.Login.masterData.selectedProtocol ?
                        this.state.singleItem : []}
                screenName="IDS_PROTOCOLINFO"
                userInfo={this.props.Login.userInfo}
                viewFile={this.viewFile}

            />
       )

        tabMap.set("IDS_PROTOCOLHISTORY",
            <ProtocolHistoryTab
                protocolHistory={this.props.Login.masterData.protocolHistory || []}
                dataResult={process(this.props.Login.masterData.protocolHistory || [], this.state.historyState)}
                dataState={this.state.historyState}
                dataStateChange={this.dataStateProtocolHistoryChange}
                userInfo={this.props.Login.userInfo}
                methodUrl={"ProtocolHistory"}
                screenName="IDS_PROTOCOLHISTORY"
                selectedId = {this.props.Login.selectedId}

            />
        ) 
        
        tabMap.set("IDS_PROTOCOLFILE",
            <ProtocolFileTab
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                genericLabel={this.props.Login.genericLabel}
                inputParam={this.props.Login.inputParam}
                deleteRecord={this.deleteFileRecord}
                protocolFile={this.props.Login.masterData.protocolFile || []}
                getAvailableData={this.props.getAvailableData}
                addProtocolFile={this.props.addProtocolFile}
                viewProtocolFile={this.viewProtocolFile}
                defaultRecord={this.defaultRecord}
                screenName={"IDS_PROTOCOLFILE"}
                settings={this.props.Login.settings}
                masterData={this.props.Login.masterData}
            />);
        return tabMap;
    }

    insertProtocolFile = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let napprovalconfigversioncode = this.props.Login.masterData.defaultApprovalVersionValue 
                                         && this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode 
                                         && parseInt(this.props.Login.masterData.defaultApprovalVersionValue.napprovalconfigversioncode) || -1;
        let ndesigntemplatemappingcode = this.props.Login.masterData.defaultDesignTemplateMappingValue 
                                         && this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode
                                         && parseInt( this.props.Login.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1;
        let ntranscode = this.props.Login.masterData.defaultStatusValue && this.props.Login.masterData.defaultStatusValue.ntranscode || -1;
        let nprotocolcode = this.props.Login.masterData.selectedProtocol[0].nprotocolcode;
        let protocolFileArray = [];
        let protocolFile = {
            nprotocolcode: this.props.Login.masterData.selectedProtocol[0].nprotocolcode,
            nprotocolversioncode: this.props.Login.masterData.selectedProtocol[0].nprotocolversioncode,
            nprotocolfilecode: selectedRecord.nprotocolfilecode ? selectedRecord.nprotocolfilecode : 0,
            nstatus: transactionStatus.ACTIVE,
            nattachmenttypecode,
        };
        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, protocolFile);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== undefined ? selectedRecord.ssystemfilename.split('.') : create_UUID();
                    const filesystemfileext = selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== undefined ? file.name.split('.')[ssystemfilename.length - 1] : fileExtension;
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.nprotocolfilecode && selectedRecord.nprotocolfilecode > 0
                        && selectedRecord.ssystemfilename !== "" ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] = Lims_JSON_stringify(file.name.trim(), false);
                    tempData["sdescription"] = Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "", false);
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    protocolFileArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                protocolFile["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename, false);
                protocolFile["sdescription"] = Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "", false);
                protocolFile["nlinkcode"] = transactionStatus.NA;
                protocolFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                protocolFile["nfilesize"] = selectedRecord.nfilesize;
                protocolFileArray.push(protocolFile);
            }
        } else {
            protocolFile["sfilename"] = Lims_JSON_stringify(selectedRecord.slinkfilename.trim(), false);
            protocolFile["sdescription"] = Lims_JSON_stringify(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : "", false);
            protocolFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            protocolFile["ssystemfilename"] = "";
            protocolFile["nfilesize"] = 0;
            protocolFileArray.push(protocolFile);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("protocolFile", JSON.stringify(protocolFileArray));
        formData.append("napprovalconfigversioncode", JSON.stringify(napprovalconfigversioncode));
        formData.append("ndesigntemplatemappingcode", JSON.stringify(ndesigntemplatemappingcode));
        formData.append("ntranscode", JSON.stringify(ntranscode));
        formData.append("nprotocolcode", JSON.stringify(nprotocolcode));

        let selectedId = null;
        let postParam = undefined;
        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "protocol", selectedObject: "selectedProtocol", primaryKeyField: "nprotocolcode" };
            selectedId = selectedRecord["nprotocolfilecode"];
        };
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                    slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
                }
            },
            displayName: this.props.Login.inputParam.displayName,
            formData: formData,
            isFileupload: true,
            operation: this.props.Login.operation,
            classUrl: "protocol",
            action:"editprotocolfile",
            saveType, formRef, methodUrl: "ProtocolFile", postParam
        };
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData }, saveType
                }
            };
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal");
        }
    }

    deleteFileRecord = (protocolDeleteParam) => {
        let inputParam = {};
        inputParam = {
            classUrl: "protocol",
            methodUrl: protocolDeleteParam.methodUrl,
            inputData: {
                [protocolDeleteParam.methodUrl.toLowerCase()]: protocolDeleteParam.selectedRecord,
                "nprotocolcode": this.props.Login.masterData.selectedProtocol[0].nprotocolcode,
                "nprotocolfilecode":protocolDeleteParam.selectedRecord.nprotocolfilecode,
                "userinfo": {
                    ...this.props.Login.userInfo,
                    slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
                }
            },
            operation: protocolDeleteParam.operation,
            dataState: this.state.dataState,
            postParam: {
                inputListName: "protocol", selectedObject: "selectedProtocol", primaryKeyField: "nprotocolcode",
                fetchUrl: "protocol/getActiveProtocolById", fecthInputObject: { userinfo: this.props.Login.userInfo },
            },
            action:"deleteprotocolfile",

        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, protocolDeleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openChildModal: true,
                    screenName: protocolDeleteParam.screenName, operation: protocolDeleteParam.operation
                }
            };
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal");
        }
    }
    
    viewProtocolFile = (props) => {
        const viewParam = {
            operation: "view",
            methodUrl: "ProtocolFile",
            classUrl: "protocol",
            inputData: {
                userinfo: this.props.Login.userInfo,
                nprotocolcode: props.nprotocolcode,
                nprotocolfilecode: props.nprotocolfilecode,
            }
        };
        this.props.viewAttachment(viewParam);
    }

    dataStateProtocolHistoryChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData.ProtocolHistory, event.dataState),
            historyState: event.dataState
        });
    }

    handleProtocolPageChange = e => {
        this.setState({
            protocolSkip: e.skip,
            protocolTake: e.take
        });
    };

    componentDidUpdate(previousProps) {


        let { userRoleControlRights, controlMap, selectedRecord, masterData, dynamicGridItem, dynamicGridMoreField, 
              dynamicExportItem, dynamicDateField, dynamicTemplateField,dynamicDateConstraints, dynamicCombinationUnique, 
              dynamicExportfields, configVersionList,dynamicDesignMappingList, statusList,activeTabIndex,
              activeTabId,singleItem,dynamiccolumns,editable,searchFields } = this.state;
        let bool = false;
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                bool = true;
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord
            bool = true;
        }

        if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex) {
            activeTabIndex = this.props.Login.activeTabIndex;
            activeTabId = this.props.Login.activeTabId;
            bool = true;
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if(this.props.Login.masterData.configVersion !== previousProps.Login.masterData.configVersion){
                const configVersionListMap = constructOptionList(this.props.Login.masterData.configVersion || [], "napprovalconfigversioncode", "sversionname", "nsorter", "ascending", false);
                configVersionList = configVersionListMap.get("OptionList");
                bool = true;
            }            

            if(this.props.Login.masterData.dynamicDesignMapping !== previousProps.Login.masterData.dynamicDesignMapping){
                const dynamicDesignMappingListMap = constructOptionList(this.props.Login.masterData.dynamicDesignMapping || [], "ndesigntemplatemappingcode", "sregtemplatename","nsorter", "ascending", false);
                dynamicDesignMappingList = dynamicDesignMappingListMap.get("OptionList");
                bool = true;
            }
            

            if (this.props.Login.masterData.status !== previousProps.Login.masterData.status) {
                const statusListMap = constructOptionList(this.props.Login.masterData.status || [], "ntransactionstatus", "sfilterstatus", "","ascending", false);
                statusList = statusListMap.get("OptionList");
                bool = true;
            }    

            
        }
        if (this.props.Login.masterData.dynamicDesign && this.props.Login.masterData.dynamicDesign !== previousProps.Login.masterData.dynamicDesign) {
            const dynamicColumn = JSON.parse(this.props.Login.masterData.dynamicDesign.jsondata && this.props.Login.masterData.dynamicDesign.jsondata.value)
            if (dynamicColumn !== null) {
                dynamicGridItem = dynamicColumn.griditem ? dynamicColumn.griditem : [];
                dynamicGridMoreField = dynamicColumn.gridmoreitem ? dynamicColumn.gridmoreitem : [];
                dynamicExportItem = dynamicColumn.exportFields ? dynamicColumn.exportFields : [];
                dynamicDateField = dynamicColumn.datefields ? dynamicColumn.datefields : [];
                dynamicTemplateField = dynamicColumn.templatefields ? dynamicColumn.templatefields : [];
                dynamicDateConstraints = dynamicColumn.dateconstraints ? dynamicColumn.dateconstraints : [];
                dynamicCombinationUnique = dynamicColumn.combinationunique ? dynamicColumn.combinationunique : [];
                dynamicExportfields = dynamicColumn.exportFields ? dynamicColumn.exportFields : [];   
                singleItem = dynamicColumn.displayFields ? dynamicColumn.displayFields : [];
                dynamiccolumns = dynamicColumn.listItem ? dynamicColumn.listItem : [];
                editable = dynamicColumn.editable ? dynamicColumn.editable:[];
                searchFields = dynamicColumn.searchfields ?  dynamicColumn.searchfields:[];
                

            }


        }

        if (bool) {
            bool = false;
            this.setState({
                userRoleControlRights, controlMap, selectedRecord, masterData, dynamicGridItem, dynamicGridMoreField, 
                dynamicExportItem, dynamicDateField, dynamicTemplateField,dynamicDateConstraints, dynamicCombinationUnique,
                dynamicExportfields, configVersionList, dynamicDesignMappingList, statusList,activeTabIndex, activeTabId,singleItem,
                dynamiccolumns,editable,searchFields
            });
        }
    }

}

export default connect(mapStateToProps, {
    updateStore, callService, crudMaster, getProtocolTemplateByConfigVersion, ProtocolFilterSubmit,
    getPreviewTemplate, getProtocolDetail, addProtocolFile, viewAttachment, getChildValues,validateEsignforProtocol,
    completeProtocolAction,dynamicAction,getEditComboService,updateProtocolAction,rejectProtocolAction,copyProtocolAction,
    insertProtocolAction,filterTransactionList,getProduct
})(injectIntl(Protocol))