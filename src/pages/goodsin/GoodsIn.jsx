import React from 'react';
import { connect } from 'react-redux';
import { injectIntl,FormattedMessage } from 'react-intl';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { callService,crudMaster,updateStore,getGoodsInFilterSubmit,validateEsignCredential,getGoodsInComboService,getGoodsInDetail,getClient,getProjectType,getProject,filterColumnData,getPreviewTemplate,viewInformation,checkListGoodsIn,downloadGoodsIn,onSaveGoodsInCheckList,validateEsignGoodsIn,generateControlBasedReport  } from '../../actions';
import { toast } from 'react-toastify';
import { convertDateValuetoString, rearrangeDateFormat, getControlMap,showEsign,formatInputDate,comboChild,convertDateTimetoStringDBFormat,onDropAttachFileList,deleteAttachmentDropZone,Lims_JSON_stringify } from '../../components/CommonScript';
import { ListWrapper } from '../../components/client-group.styles';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {  Col, Row, Card, Nav,FormGroup,FormLabel } from 'react-bootstrap';
import GoodsInFilter from './GoodsInFilter';
import ListMaster from '../../components/list-master/list-master.component';
import AddGoodsIn  from './AddGoodsIn';
import Esign from '../audittrail/Esign';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { SampleType, designProperties,transactionStatus } from '../../components/Enumeration';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { ContentPanel,ReadOnlyText } from '../../components/App.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt,faThumbsUp,faListAlt,faCloudDownloadAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import DynamicSlideout from '../dynamicpreregdesign/DynamicSlideout';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import { ReactComponent as GoodsReceivedIcon } from '../../assets/image/goods-received.svg';
import { ReactComponent as DownloadGoods} from '../../assets/image/Download Goods.svg';
import AddFile from './AddFile';
import GoodsInView from './GoodsInView';
import GoodsInChecklist from './GoodsInChecklist';
import { templateChangeHandler } from '../checklist/checklist/checklistMethods';
import { REPORTTYPE } from '../../components/Enumeration';
import { ReactComponent as ReceiveGoods} from '../../assets/image/Receive Goods.svg';
import { Affix } from 'rsuite';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}


class GoodsIn extends React.Component {
    constructor(props) {
        super(props)
        this.searchRef = React.createRef();    
        this.formRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();

        this.state = {
            dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            sampleGridDataState : {  skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            userRoleControlRights: [],
            controlMap: new Map(),
            masterStatus: "",
            error: "",
            selectedRecord: {},
            filterGoodsInParam: {},
            operation: "",           
            firstPane: 0,
            paneHeight: 0,
            secondPaneHeight: 0,
            tabPane: 0,          
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],           
            splitChangeWidthPercentage: 28.6,
            goodsinSearchField: [],           
            propertyPopupWidth: "60",
            data: [],
            mandatorySampleFields:[]
        
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

    shouldComponentUpdate(nextProps, nextState) {
        // Rendering the component only if 
        // passed props value is changed
        if (nextState.data.length > 0 && nextState.data === this.state.data) {
            return false;
        } else {
            return true;
        }
    }

    render () {
        let obj = convertDateValuetoString(this.props.Login.masterData.realfromDate, this.props.Login.masterData.realtoDate, this.props.Login.userInfo);

        let fromDate=this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date();
        let toDate=this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date();

        const addId = this.state.controlMap.has("AddGoodsIn") ? this.state.controlMap.get("AddGoodsIn").ncontrolcode : -1;
        const editId = this.state.controlMap.has("EditGoodsIn") ? this.state.controlMap.get("EditGoodsIn").ncontrolcode : -1;
        const deleteId = this.state.controlMap.has("DeleteGoodsIn") ? this.state.controlMap.get("DeleteGoodsIn").ncontrolcode : -1;
        const receiveId = this.state.controlMap.has("ReceiveGoodsIn") ? this.state.controlMap.get("ReceiveGoodsIn").ncontrolcode : -1;
        const approveId = this.state.controlMap.has("ApproveGoodsIn") ? this.state.controlMap.get("ApproveGoodsIn").ncontrolcode : -1;
        const checklistId = this.state.controlMap.has("ChecklistGoodsIn") ? this.state.controlMap.get("ChecklistGoodsIn").ncontrolcode : -1;
        const downloadGoodsIn = this.state.controlMap.has("DownloadGoodsIn") ? this.state.controlMap.get("DownloadGoodsIn").ncontrolcode : -1; 
        const deleteSampleId = this.state.controlMap.has("DeleteSampleGoodsIn") ? this.state.controlMap.get("DeleteSampleGoodsIn").ncontrolcode : -1; 
 

        const goodsinAddParam = {
            screenName: "IDS_GOODSIN", operation: "create", primaryKeyField: "ngoodsincode",
            userInfo: this.props.Login.userInfo, ncontrolCode: addId
        };

        const goodsinEditParam = {
            screenName: "IDS_GOODSIN", operation: "update", primaryKeyField: "ngoodsincode",
            userInfo: this.props.Login.userInfo, ncontrolCode: editId,masterData:this.props.Login.masterData
            
        };

        const goodsinDeleteSampleParam = { 
            screenName: "IDS_GOODSINSAMPLE", methodUrl: "GoodsIn", operation: "delete", ncontrolCode: deleteSampleId };        

        const filterParam = {
            inputListName: "GoodsIn", selectedObject: "selectedGoodsIn", primaryKeyField: "ngoodsincode",
            fetchUrl: "goodsin/getActiveGoodsInById", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["sgoodsinid1","sclientname", "sprojectname", "scouriername","nnoofpackages","sconsignmentno","sgoodsindatetime","ssecurityrefno","scomments" ,"stransdisplaystatus"]
        };

        const viewInfoFields=[];
        viewInfoFields.push(
            { "fieldName": "sclientcatname", "label": "IDS_CLIENTCATEGORY"},
            { "fieldName": "sclientname", "label": "IDS_CLIENT"},
            { "fieldName": "sprojecttypename", "label": "IDS_PROJECTTYPE"},
            { "fieldName": "sprojectname", "label": "IDS_PROJECT"},
            { "fieldName": "scouriername", "label": "IDS_COURIERCARRIER"},
            { "fieldName": "nnoofpackages", "label": "IDS_NOOFPACKAGES"},
            { "fieldName": "sconsignmentno", "label": "IDS_CONSIGNMENTNO"},
            { "fieldName": "sgoodsindatetime", "label": "IDS_GOODSINDATE"},
            { "fieldName": "sviewstatus", "label": "IDS_OUTOFHOURS"},
            { "fieldName": "ssecurityrefno", "label": "IDS_SECURITYREFNO"},
            { "fieldName": "scomments", "label": "IDS_COMMENTS"}
        )                        
                                           

        let breadCrumbData = [];
        breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom
            },
            {
                "label": "IDS_TO",
                "value": obj.breadCrumbto
            }
        ]; 

        let mandatoryFields = [];
            if(this.props.Login.screenName==="IDS_GOODSIN"){
                mandatoryFields.push(
                    { "idsName": "IDS_CLIENTCATEGORY", "dataField": "nclientcatcode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_CLIENT", "dataField": "nclientcode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_NOOFPACKAGES", "dataField": "nnoofpackages" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                    { "idsName": "IDS_GOODSINDATE", "dataField": "dgoodsindatetime" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }
    
                )
    
                if(this.props.Login.userInfo.istimezoneshow === transactionStatus.YES){
                    mandatoryFields.push({ "idsName": "IDS_TIMEZONE", "dataField": "ntzgoodsindate" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" });
                }
    
                if (this.state.selectedRecord["noutofhours"] === transactionStatus.YES) {
                    mandatoryFields.push({ "idsName": "IDS_SECURITYREFNO", "dataField": "ssecurityrefno", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"});
                }
            }
           

            let userStatusCSS = "";
            let activeIconCSS = "fa fa-check";
            if (this.props.Login.masterData.selectedGoodsIn && this.props.Login.masterData.selectedGoodsIn.ntransactionstatus === transactionStatus.DRAFT) {
                userStatusCSS = "outline-secondary";
                activeIconCSS = "";
            }
            else if (this.props.Login.masterData.selectedGoodsIn && this.props.Login.masterData.selectedGoodsIn.ntransactionstatus === transactionStatus.RECEIVED) {
                userStatusCSS = "outline-success";
            }
            else {
                userStatusCSS = "outline-Final";
            }
   

        
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                    <Row noGutters={true} >
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={"IDS_GOODSIN"}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.GoodsIn}
                                //masterList={this.props.Login.masterData.searchedData}
                                getMasterDetail={(GoodsIn) => this.props.getGoodsInDetail(GoodsIn, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.selectedGoodsIn}
                                primaryKeyField="ngoodsincode"
                                mainField="sgoodsinid1"
                                firstField="sclientcatname"
                                secondField="sclientname"
                                isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
                                openModal={() => this.props.getGoodsInComboService(goodsinAddParam)}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                filterComponent={[
                                    {
                                        "IDS_GOODSINFILTER":
                                            <GoodsInFilter
                                                fromDate={fromDate}
                                                toDate={toDate}
                                                handleFilterDateChange={this.handleFilterDateChange}
                                                userInfo={this.props.Login.userInfo}

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
                            <Row>
                                <Col md={12}>
                                    <ContentPanel className="panel-main-content">
                                        {this.props.Login.masterData.selectedGoodsIn && this.props.Login.masterData.GoodsIn && this.props.Login.masterData.GoodsIn.length > 0 && this.props.Login.masterData.selectedGoodsIn ?
                                            <Card className="border-0">
                                                <Card.Header>
                                                <Card.Title className="product-title-main">{this.props.Login.masterData.selectedGoodsIn.sgoodsinid1}</Card.Title>
                                                <Card.Subtitle>
                                                    <div className="d-flex product-category">
                                                        <h2 className="product-title-sub flex-grow-1">
                                                            <span className={`btn btn-outlined ${userStatusCSS} btn-sm`}>
                                                                <i className={activeIconCSS}></i>
                                                                {this.props.Login.masterData.selectedGoodsIn.stransdisplaystatus}
                                                            </span>
                                                        </h2>
                                                        <div className="d-inline ">
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                            hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            onClick={(e) => this.props.getGoodsInComboService(goodsinEditParam)} >
                                                            <FontAwesomeIcon icon={faPencilAlt} title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                        </Nav.Link>
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="#"
                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            onClick={() => this.ConfirmDelete(deleteId)}>
                                                            <FontAwesomeIcon icon={faTrashAlt} />                                                            
                                                        </Nav.Link>
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="#"
                                                            hidden={this.state.userRoleControlRights.indexOf(receiveId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_RECEIVE" })}
                                                            onClick={() => this.receiveGoodsIn("receive",receiveId)}>
                                                            <ReceiveGoods/>
                                                            {/* <GoodsReceivedIcon className="custom_icons" width="20" height="20"
                                                                            name="goodsreceivedicon"/>                                                                                                                        */}
                                                        </Nav.Link>
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="#"
                                                            hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                            onClick={() => this.approveGoodsIn("approve",approveId)}>
                                                            <FontAwesomeIcon icon={faThumbsUp} />                                                            
                                                        </Nav.Link> 
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="#"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_VIEWINFO" })}
                                                            onClick={() => this.props.viewInformation(this.props.Login.masterData.selectedGoodsIn.ngoodsincode,this.props.Login.userInfo,this.props.Login.masterData)}>
                                                            <FontAwesomeIcon icon={faEye} />                                                            
                                                        </Nav.Link> 

                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="#"
                                                             hidden={this.state.userRoleControlRights.indexOf(checklistId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_CHECKLIST" })}
                                                            onClick={() => this.props.checkListGoodsIn(this.props.Login.masterData,this.props.Login.masterData.selectedGoodsIn,this.state.Checklist,checklistId,this.props.Login.userInfo)}>
                                                            <FontAwesomeIcon icon={faListAlt} />                                                            
                                                        </Nav.Link> 

                                                         <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="#"
                                                            hidden={this.state.userRoleControlRights.indexOf(downloadGoodsIn) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DOWNLOADFILE" })}
                                                            //onClick={() => this.props.downloadGoodsIn()}>
                                                            onClick={() =>this.props.generateControlBasedReport(downloadGoodsIn,this.props.Login.masterData.selectedGoodsIn,this.props.Login,"ngoodsincode",this.props.Login.masterData.selectedGoodsIn.ngoodsincode)}> 
                                                             <FontAwesomeIcon icon={faCloudDownloadAlt} /> 
                                                         </Nav.Link>                                              
                                                        
                                                        </div>
                                                    </div>
                                                </Card.Subtitle>
                                                </Card.Header>
                                                <Card.Body>                                           
                                                    <DataGrid
                                                        primaryKeyField={"ngoodsinsamplecode"}
                                                        data={this.props.Login.masterData.GoodsInSample ||[]}
                                                        dataResult={process(this.props.Login.masterData.GoodsInSample ||[], this.state.sampleGridDataState)}
                                                        dataState={this.state.sampleGridDataState}
                                                        dataStateChange={this.sampleInfoDataStateChange}
                                                        extractedColumnList={this.gridfillingColumn(this.state.DynamicGridItem) || []}
                                                        detailedFieldList={this.gridfillingColumn(this.state.DynamicGridMoreField) || []} 
                                                        exportFieldList={this.gridfillingColumn(this.state.DynamicExportItem) || []} 
                                                        userInfo={this.props.Login.userInfo}
                                                        controlMap={this.state.controlMap}
                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                        inputParam={this.props.Login.inputParam}
                                                        //editParam={goodsinSampleEditParam}
                                                        //fetchRecord={this.editSampleGoodsIn}
                                                        deleteRecord = {this.DeleteGoodsInSample}
                                                        deleteParam={goodsinDeleteSampleParam}
                                                        methodUrl ={"SampleGoodsIn"}
                                                        pageable={true}
                                                        isComponent={false}
                                                        hasDynamicColSize={true}
                                                        isActionRequired={true}
                                                        isToolBarRequired={true}
                                                        isAddRequired={true}
                                                        addRecord={this.openSampleGoodsIn}
                                                        isRefreshRequired ={false}
                                                        isImportRequired={true}
                                                        isDownloadPDFRequired={false}
                                                        isDownloadExcelRequired={false}
                                                        import={this.ImportFile}
                                                        scrollable={'scrollable'}
                                                        gridHeight={'600px'}
                                                        expandField="expanded"
                                                        screenName ="Goods In Sample"
                                                    />

                       

                                                </Card.Body>

                                            </Card>
                                        :""}
                                    </ContentPanel>
                                </Col>
                            </Row>
                        </Col>   

                    </Row>
                </ListWrapper>  
                { this.props.Login.openModal ?
                    <SlideOutModal 
                        show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                       // masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        noSave={this.props.Login.operation === "view" ? true : false}
                        mandatoryFields={this.props.Login.screenName ==="IDS_GOODSINSAMPLE" && this.props.Login.operation ==="create" ? this.state.mandatorySampleFields :  mandatoryFields}
                        addComponent={this.props.Login.loadEsign ? (
                            <Esign 
                            operation={this.props.Login.operation}
                            formatMessage={this.props.intl.formatMessage}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        ) : this.props.Login.screenName ===  "IDS_GOODSIN"  && (this.props.Login.operation ===  "create" || this.props.Login.operation === "update") ? (
                            <AddGoodsIn
                                onNumericInputOnChange={this.onNumericInputOnChange}
                                onInputOnChange={this.onInputOnChange}
                                handleDateChange ={this.handleDateChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                operation={this.props.Login.operation}
                                inputParam={this.props.Login.inputParam}
                                ClientCategory ={this.props.Login.ClientCategory}
                                Client={this.props.Login.Client}
                                ProjectType={this.props.Login.ProjectType}
                                Courier={this.props.Login.Courier}
                                Project={this.props.Login.Project}
                                TimeZone={this.props.Login.TimeZone}
                                selectedRecord={this.state.selectedRecord || {}}
                                currentTime={this.props.Login.currentTime || []}
                                userInfo={this.props.Login.userInfo}
    
                            />
                        ) : this.props.Login.screenName === "IDS_GOODSIN" && this.props.Login.operation ==="view" ? (
                            <GoodsInView
                                userInfo={this.props.Login.userInfo}
                                selectedRecordView={this.props.Login.masterData.selectedRecordView}
                                viewInfoFields={viewInfoFields|| []}
                            />  

                        ): this.props.Login.screenName === "IDS_GOODSINSAMPLE" && this.props.Login.operation ==="create" ? (                                
                                    <DynamicSlideout
                                        selectedRecord={this.props.Login.selectedRecord}
                                        templateData={this.props.Login.masterData.DesignTemplateMapping && this.props.Login.masterData.DesignTemplateMapping [0].jsondata}
                                        handleDateChange={this.dynamicHandleDateChange}
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
                                        userRoleControlRights={this.props.Login.userRoleControlRights}
                                    ></DynamicSlideout>  
                                                    
                        ): this.props.Login.screenName ==="IDS_GOODSINSAMPLE" && this.props.Login.operation ==="import" ? (
                                <AddFile
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onDrop={this.onDropSampleFile}
                                    deleteAttachment={this.deleteAttachment}
                                    actionType={this.state.actionType}
                                    operation={this.props.Login.operation}    
                                    screenName={this.props.Login.screenName}
                               
                                />
                        ):( "" )
                        
                        
                        }
                    />
                : 
                this.props.Login.screenName === "IDS_GOODSINCHECKLIST" && this.props.Login.operation ==="checklist" ? (
                    <GoodsInChecklist
                        templateData={this.props.Login.masterData.ChecklistData}
                        needSaveButton={this.props.Login.masterData.selectedGoodsIn.ntransactionstatus===transactionStatus.RECEIVED ? true:false}
                        formRef={this.formRef}
                        onTemplateInputChange={this.onTemplateInputChange}
                        handleClose={this.closeModal}
                        onTemplateComboChange={this.onTemplateComboChange}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.insertGoodsInChecklist}
                        Login={this.props.Login}
                        viewScreen={this.props.Login.openTemplateModal}
                        selectedGoodsIn ={this.props.Login.masterData.selectedGoodsIn}
                        selectedRecord={this.state.selectedRecord || []}
                        onTemplateDateChange={this.onTemplateDateChange}
                        needValidation={true}
                    /> 
                ) :("")
                } 
                
            </>
        )
    }
    componentWillUnmount() {
        let activeTabIndex=this.props.Login.activeTabIndex
         const updateInfo = {
             typeName: DEFAULT_RETURN,
             data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
             }
         }
         this.props.updateStore(updateInfo);
     }

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    handleFilterDateChange = (dateName, dateValue) => {
        let masterData = this.props.Login.masterData;
        masterData[dateName] = dateValue;         
        this.setState ({masterData});

    }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    };

    dynamicHandleDateChange = (dateValue, dateName) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onTemplateInputChange = (event, control) => {
        let selectedRecord = templateChangeHandler(1, this.state.selectedRecord, event, control)
        this.setState({ selectedRecord });
    }

    onTemplateComboChange = (comboData, control) => {
        let selectedRecord = templateChangeHandler(2, this.state.selectedRecord, comboData, control)
        this.setState({ selectedRecord });
    }

    onTemplateDateChange = (dateData, control) => {
        let selectedRecord = templateChangeHandler(3, this.state.selectedRecord, dateData, control)
        this.setState({ selectedRecord });
    }

    onFilterSubmit = () => {         
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo);
        let realfromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
        let realtoDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);
        let masterData = { ...this.props.Login.masterData, realfromDate, realtoDate};
        let inputData ={
            fromDate: obj.fromDate,
            toDate : obj.toDate,
            userinfo: this.props.Login.userInfo,

        }       
        let inputParam = {
            masterData,
            inputData
        }
        this.props.getGoodsInFilterSubmit(inputParam);

        

    }
    reloadData = () => {
        this.searchRef.current.value = "";
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo);
        let realfromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
        let realtoDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);
        let masterData = { ...this.props.Login.masterData, realfromDate, realtoDate};
        let inputData ={
            fromDate: obj.fromDate,
            toDate : obj.toDate,
            userinfo: this.props.Login.userInfo,

        }       
        let inputParam = {
            masterData,
            inputData
        }
        this.props.getGoodsInFilterSubmit(inputParam);
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;
        let openTemplateModal = this.props.Login.openTemplateModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "receive" ||this.props.Login.operation === "approve") {
                loadEsign = false;
                openModal = false;
                openTemplateModal =false;
                selectedRecord = {};
            }
            else {
                if(this.props.Login.operation === "checklist"){
                    openModal = false;
                }
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        }
        else {
            openModal = false;
            openTemplateModal =false;
            selectedRecord = {};
            screenName ="";
            operation ="";
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal,openTemplateModal, loadEsign, selectedRecord, selectedId: null ,screenName,operation}
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
        if(this.props.Login.operation === "checklist"){
            this.props.validateEsignGoodsIn(inputParam, "openModal");

        }else {
            this.props.validateEsignCredential(inputParam, "openModal");
        }
        
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            }else if(event.target.name === "noutofhours"){
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            } else {
                selectedRecord[event.target.name] = event.target.checked === true ? 1 : 2;
            }
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
        if(fieldName === "nclientcatcode"){
            selectedRecord["nclientcatcode"] = comboData;
            this.props.getClient(this.state.selectedRecord.nclientcatcode.value,this.props.Login.masterData, this.props.Login.userInfo, selectedRecord);
        }else if(fieldName === "nclientcode"){
            selectedRecord["nclientcode"] = comboData;
            this.props.getProjectType(this.state.selectedRecord.nclientcatcode.value,this.state.selectedRecord.nclientcode.value,this.props.Login.masterData, this.props.Login.userInfo, selectedRecord);
        }else if(fieldName === "nprojecttypecode"){
            selectedRecord["nprojecttypecode"] = comboData;
            if(comboData !==null){
                this.props.getProject(this.state.selectedRecord.nclientcatcode.value,this.state.selectedRecord.nclientcode.value,this.state.selectedRecord.nprojecttypecode.value,this.props.Login.masterData, this.props.Login.userInfo, selectedRecord);
            }else {
                delete selectedRecord["nprojecttypecode"];
                delete selectedRecord["nprojectmastercode"];
                this.setState({ selectedRecord });
            }
        }else if(fieldName === "nprojectmastercode"){
            selectedRecord["nprojectmastercode"] = comboData;
            this.setState({ selectedRecord });
        }else if(fieldName === "ncouriercode"){
            if(comboData !==null){
                selectedRecord["ncouriercode"] = comboData;
            }else {
                delete selectedRecord["ncouriercode"];
            }
            //selectedRecord["ncouriercode"] = comboData;
            this.setState({ selectedRecord });
        }
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
        this.setState({ selectedRecord });
    }   

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    };

    onNumericBlur = (control) => {
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

    sampleInfoDataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData.GoodsInSample,event.dataState),
            sampleGridDataState: event.dataState
        });
      
    }

//     onDownloadClick = (ncontrolCode) => {
//         const inputParam = {

//             inputData: {  
//                 downloadGoodsIn,
//                 selectedRecord :this.props.Login.masterData.selectedGoodsIn,
//                 userinfo: this.props.Login.userInfo,
//                 Login:this.props.Login,
//                 ncontrolcode: ncontrolCode,
//                 ngoodsincode:this.props.Login.masterData.selectedGoodsIn.ngoodsincode, 
//                 ngoodsincode_componentcode: 5,
//                 ngoodsincode_componentname: 'Number'

//             },
//         }
//         this.props.downloadGoodsIn(inputParam['inputData']);
   
// }


generateControlBasedReportReport= (downloadGoodsIn) => {
    //if(this.props.Login.masterData.selectedGoodsIn.ntransactionstatus===transactionStatus.RECEIVED  || this.props.Login.masterData.selectedGoodsIn.ntransactionstatus===transactionStatus.APPROVED ){
       let inputParam={
           primaryKeyField: "ngoodsincode",
           sreportlink:this.props.Login.reportSettings[15],
           smrttemplatelink:this.props.Login.reportSettings[16],
           nreporttypecode: REPORTTYPE.CONTROLBASED,
           ncontrolcode:downloadGoodsIn,
           primaryKeyValue:this.props.Login.masterData.selectedGoodsIn.ngoodsincode,
           ngoodsincode:this.props.Login.masterData.selectedGoodsIn.ngoodsincode,
           ngoodsincode_componentcode: REPORTTYPE.CONTROLBASED,
           ngoodsincode_componentname: 'Number',
           ntranscode:this.props.Login.masterData.selectedGoodsIn.ntransactionstatus,
           userinfo: this.props.Login.userInfo

       }
       this.props.generateControlBasedReport(inputParam);
   //  }else{
   //     toast.warn( this.props.intl.formatMessage({ id: "IDS_SELECTDOENLOADRECEIVEAPPROVE" }));
   // }
}








    gridfillingColumn(data) {
        const temparray = data && data.map((option) => {
            return { "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode] || "-", "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3", "dataType": option[designProperties.LISTITEM] };
        });
        return temparray;
    }

    onSaveClick = (saveType, formRef) => {

        if(this.props.Login.screenName ===  "IDS_GOODSIN"){
            if(this.state.selectedRecord["nnoofpackages"]<=0){
                return (toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERTHEPACKAGEGREATERTHANZERO" })));
            }
    
            let postParam = undefined;
            let dataState = undefined;
            let inputData = [];
            inputData["goodsin"] = {};
            inputData["userinfo"] = this.props.Login.userInfo;
    
            let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo);
            let fromDate = obj.fromDate;
            let toDate = obj.toDate;
            inputData["fromDate"] = fromDate;
            inputData["toDate"] = toDate;
    
            if (this.props.Login.operation === "update") {
                postParam = {
                    inputListName: "GoodsIn",
                    selectedObject: "selectedGoodsIn",
                    primaryKeyField: "ngoodsincode",
                };
    
                postParam["primaryKeyValue"] = this.props.Login.masterData.selectedGoodsIn.ngoodsincode;
                inputData["goodsin"]["ngoodsincode"]= this.props.Login.masterData.selectedGoodsIn.ngoodsincode;
            }
            inputData["goodsin"]["nclientcatcode"] = this.state.selectedRecord["nclientcatcode"] ? this.state.selectedRecord["nclientcatcode"].value : -1;              
            inputData["goodsin"]["nclientcode"] = this.state.selectedRecord["nclientcode"] ? this.state.selectedRecord["nclientcode"].value : -1;
            inputData["goodsin"]["nprojecttypecode"] = this.state.selectedRecord["nprojecttypecode"] ? this.state.selectedRecord["nprojecttypecode"].value : -1;
            inputData["goodsin"]["nprojectmastercode"] = this.state.selectedRecord["nprojectmastercode"] ? this.state.selectedRecord["nprojectmastercode"].value : -1;
            inputData["goodsin"]["ncouriercode"] = this.state.selectedRecord["ncouriercode"] ? this.state.selectedRecord["ncouriercode"].value :-1;
            inputData["goodsin"]["nnoofpackages"] = this.state.selectedRecord["nnoofpackages"];
            inputData["goodsin"]["noutofhours"] = this.state.selectedRecord["noutofhours"] ? this.state.selectedRecord["noutofhours"] :transactionStatus.NO;
            inputData["goodsin"]["sconsignmentno"] = this.state.selectedRecord["sconsignmentno"] ? this.state.selectedRecord["sconsignmentno"] : "";
            inputData["goodsin"]["ssecurityrefno"] = this.state.selectedRecord["ssecurityrefno"] ? this.state.selectedRecord["ssecurityrefno"] : "";
            inputData["goodsin"]["scomments"] = this.state.selectedRecord["scomments"] ? this.state.selectedRecord["scomments"] : "";
            inputData["goodsin"]["dgoodsindatetime"] =  formatInputDate(this.state.selectedRecord["dgoodsindatetime"], false);
                //inputData["goodsin"]["ntzgoodsindatetime"] = this.state.selectedRecord["ntimezonecode"] ? this.state.selectedRecord["ntimezonecode"].value : 1;
    
    
            
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "GoodsIn",
                displayName: this.props.Login.inputParam.displayName,
                inputData: inputData,
                selectedId: this.state.selectedRecord["ngoodsincode"],
                operation: this.props.Login.operation, saveType, formRef, dataState,
                searchRef: this.searchRef,
                postParam:postParam
                    
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName:  "IDS_GOODSIN",
                        operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }
        }else if(this.props.Login.screenName === "IDS_GOODSINSAMPLE" && this.props.Login.operation ==="create"){
            this.insertGoodsInSample();             
        }else if(this.props.Login.screenName ==="IDS_GOODSINSAMPLE" && this.props.Login.operation === "import"){
            this.importGoodsInSample();
        }      
    }
   

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.DeleteGoodsIn("delete",deleteId));
    }

    DeleteGoodsIn= (operation, ncontrolCode) => {
        let inputData = [];

        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo);
        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        inputData["fromDate"] = fromDate;
        inputData["toDate"] = toDate;


        inputData["goodsin"] = this.props.Login.masterData.selectedGoodsIn;  
        inputData["userinfo"]  = this.props.Login.userInfo;   
        const postParam = {
            inputListName: "GoodsIn", selectedObject: "selectedGoodsIn",
            primaryKeyField: "ngoodsincode",
            primaryKeyValue: this.props.Login.masterData.selectedGoodsIn.ngoodsincode,
            fetchUrl: "goodsin/getActiveGoodsInById",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "GoodsIn", 
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "delete",
            postParam
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "IDS_GOODSIN", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }


    receiveGoodsIn= (operation, ncontrolCode) => {
        let inputData = [];

        inputData["goodsin"] = this.props.Login.masterData.selectedGoodsIn;  
        inputData["userinfo"]  = this.props.Login.userInfo;   
        const postParam = {
            inputListName: "GoodsIn", selectedObject: "selectedGoodsIn",
            primaryKeyField: "ngoodsincode",
            primaryKeyValue: this.props.Login.masterData.selectedGoodsIn.ngoodsincode,
            fetchUrl: "goodsin/getActiveGoodsInById",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "GoodsIn", 
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "receive",
            postParam
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "IDS_GOODSIN", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    approveGoodsIn= (operation, ncontrolCode) => {
        let inputData = [];

        inputData["goodsin"] = this.props.Login.masterData.selectedGoodsIn;  
        inputData["userinfo"]  = this.props.Login.userInfo;   
        const postParam = {
            inputListName: "GoodsIn", selectedObject: "selectedGoodsIn",
            primaryKeyField: "ngoodsincode",
            primaryKeyValue: this.props.Login.masterData.selectedGoodsIn.ngoodsincode,
            fetchUrl: "goodsin/getActiveGoodsInById",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "GoodsIn", 
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "approve",
            postParam
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "IDS_GOODSIN", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

     openSampleGoodsIn = () => {
        const addSampleId = this.state.controlMap.has("AddSampleGoodsIn") ? this.state.controlMap.get("AddSampleGoodsIn").ncontrolcode : -1;
        const Status = this.props.Login.masterData.selectedGoodsIn.ntransactionstatus;
        if(Status === transactionStatus.APPROVED) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECEIVERECORD" }));
        }else {
            this.addSampleGoodsIn("IDS_GOODSINSAMPLE", "create", this.props.Login.masterData,this.state.selectedRecord,this.props.Login.userInfo,addSampleId);
        }

     }

     

    addSampleGoodsIn = (ScreenName, operation, masterData,selectedRecord, userInfo, controlCode,importData) => {

            let data = [];
            const withoutCombocomponent = [];
            let mandatorySampleFields = [];
            const Layout = this.props.Login.masterData.DesignTemplateMapping
                && this.props.Login.masterData.DesignTemplateMapping[0].jsondata
            if (Layout !== undefined && Layout !==null) {
                Layout.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if(component.hasOwnProperty("children")) {
                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo" || componentrow.inputtype === "backendsearchfilter"
                                        || componentrow.inputtype === "frontendsearchfilter") {
                                        data.push(componentrow)
                                    } else {
                                        withoutCombocomponent.push(componentrow)
                                    }
                                    if(componentrow.mandatory=== true){
                                        mandatorySampleFields.push({
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
                            }else {
                                component.inputtype === "combo" || component.inputtype === "backendsearchfilter"
                                  || component.inputtype === "frontendsearchfilter" ?
                                     data.push(component) : withoutCombocomponent.push(component)
                                    if(component.mandatory ===true){
                                        mandatorySampleFields.push({
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
                        this.setState({mandatorySampleFields:mandatorySampleFields});  
                    })   

                })
                const comboComponents = data
                let childColumnList = {};
                data.map(columnList => {
                    const val = comboChild(data, columnList, childColumnList, true);
                    data = val.data;
                    childColumnList = val.childColumnList
                    return null;
                })
                const mapOfFilterRegData = {
                    nsampletypecode: parseInt(SampleType.GOODSIN),

                }  
         
                this.props.getPreviewTemplate(masterData, userInfo, controlCode,
                    data, selectedRecord, childColumnList,comboComponents, withoutCombocomponent, false, true,
                    mapOfFilterRegData, false, operation, ScreenName, importData)                
            } else  {
                toast.info(this.props.intl.formatMessage({ id: "IDS_CONFIGUREGOODSINTEMPLATE" }));
            }
        
    }

    ImportFile = () => {
        const Status = this.props.Login.masterData.selectedGoodsIn.ntransactionstatus;
        let updateInfo ={};
        if(Status === transactionStatus.APPROVED ){
             toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECEIVERECORD" }));
        }else {
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModal:true,
                    operation: "import",
                    screenName : "IDS_GOODSINSAMPLE"
                }
            }
            this.props.updateStore(updateInfo);       
        }

    }
    
    onDropSampleFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(
            selectedRecord[fieldName],attachedFiles,maxSize);
        this.setState({ selectedRecord, actionType: "new" });
    };

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName],file);

        this.setState({selectedRecord,actionType: "delete"});
    };

    // editSampleGoodsIn = (goodsinSampleEditParam) => {
    //     let data = [];
    //     const withoutCombocomponent = []
    //     const Layout = this.props.Login.masterData.DesignTemplateMapping
    //                     && this.props.Login.masterData.DesignTemplateMapping[0].jsondata
    //     if (Layout !== undefined) {
    //         Layout.map(row => {
    //             return row.children.map(column => {
    //                 return column.children.map(component => {
    //                     return component.hasOwnProperty("children") ?
    //                         component.children.map(componentrow => {
    //                             if (componentrow.inputtype === "combo") {
    //                                 data.push(componentrow)
    //                             } else {
    //                                 withoutCombocomponent.push(componentrow)
    //                             }

    //                             return null;
    //                         })
    //                         : component.inputtype === "combo" ?
    //                             data.push(component) : withoutCombocomponent.push(component)
    //                 })
    //             })
    //         })
    //         const comboComponents = data
    //         let childColumnList = {};
    //         data.map(columnList => {
    //             const val = comboChild(data, columnList, childColumnList, true);
    //             data = val.data;
    //             childColumnList = val.childColumnList
    //             return null;
    //         })

    //         this.props.getEditGoodsInSampleService(goodsinSampleEditParam,data, this.state.selectedRecord, childColumnList,
    //             comboComponents, withoutCombocomponent)
    //     } else {
    //         toast.info("Configure the  template")
    //     }

    // }

    DeleteGoodsInSample= (deleteParam) => {
        let inputData = [];

        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo);
        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        inputData["fromDate"] = fromDate;
        inputData["toDate"] = toDate;

        inputData["ngoodsincode"] =deleteParam.selectedRecord.ngoodsincode;
        inputData["ngoodsinsamplecode"] =deleteParam.selectedRecord.ngoodsinsamplecode;
        inputData["ndesigntemplatemappingcode"] =deleteParam.selectedRecord.ndesigntemplatemappingcode;
        inputData["ntransactionstatus"] =this.props.Login.masterData.selectedGoodsIn.ntransactionstatus;
        inputData["userinfo"]  = this.props.Login.userInfo;   
        const postParam = {
            inputListName: "GoodsIn", selectedObject: "selectedGoodsIn",
            primaryKeyField: "ngoodsincode",
            primaryKeyValue: this.props.Login.masterData.selectedGoodsIn.ngoodsincode,
            fetchUrl: "goodsin/getActiveGoodsInById",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "GoodsInSample", 
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "delete",
            postParam
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "IDS_GOODSINSAMPLE", operation:deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }


    insertGoodsInSample= () => {
        let Map ={};

        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo);
        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        Map["fromDate"] = fromDate;
        Map["toDate"] = toDate;

        Map["ngoodsincode"] =this.props.Login.masterData.selectedGoodsIn.ngoodsincode;  
        Map["ndesigntemplatemappingcode"] =this.props.Login.masterData.DesignTemplateMapping[0].ndesigntemplatemappingcode;
        const param =  this.goodsInSample(this.props.Login.masterData,this.state.selectedRecord,
            this.props.Login.masterData.DesignTemplateMapping [0].jsondata,
            this.props.Login.userInfo,this.props.Login.defaultTimeZone, 'create',this.props.Login.comboComponents);  
        Map["GoodsInSample"] = param.GoodsInSample;
        Map["DateList"] = param.dateList;
        Map["userinfo"] = this.props.Login.userInfo;
        Map["combinationunique"] = this.state.DynamicCombinationUnique;

 
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "GoodsInSample",
            displayName: this.props.Login.inputParam.displayName,
            inputData: Map,
            selectedId: this.state.selectedRecord["ngoodsinsamplecode"],
            operation: 'create',
            searchRef: this.searchRef
                
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_GOODSIN"}),
                    operation: 'create'
                }
            }
            this.props.updateStore(updateInfo);
        }else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }



    }
    
    goodsInSample = (masterData,selectedRecord,templateList,userInfo,defaulttimeZone,operation,comboComponents) => {
        let GoodsInSample = {};
        let dateList = [];
        GoodsInSample["ngoodsincode"] = masterData.selectedGoodsIn.ngoodsincode;  
        GoodsInSample["ndesigntemplatemappingcode"] =masterData.DesignTemplateMapping[0].ndesigntemplatemappingcode;
    
    
        GoodsInSample["nunitcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Unit')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Unit')]['label']].value : -1;
        GoodsInSample["nquantity"] = selectedRecord["Quantity"];
        GoodsInSample["sexternalsampleid"] = selectedRecord["External Sample Id"];
        GoodsInSample["scomments"] = selectedRecord["Comments"];
      
        GoodsInSample["jsondata"] = {};
        GoodsInSample["jsonuidata"] = {};


        templateList && templateList.map(row => {
            return row.children.map(column => {
                return column.children.map(component => {
                    if (component.hasOwnProperty("children")) {
                        return component.children.map(componentrow => {
                            if (componentrow.inputtype === "combo" || componentrow.inputtype === "predefineddropdown") {
                                if (componentrow.inputtype === "predefineddropdown") {
                                    GoodsInSample["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                        {
                                            value: selectedRecord[componentrow.label].value,
                                            label: selectedRecord[componentrow.label].label
                                           
    
                                        } : -1
                                    GoodsInSample["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : "";
    
                                } else {
                                    GoodsInSample["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
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
                                    GoodsInSample["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : "";
    
                                }
                            }
                            else if (componentrow.inputtype === "date") {
                                if (componentrow.mandatory) {
                                    GoodsInSample["jsondata"][componentrow.label] = (typeof selectedRecord[componentrow.label] === "object") ?
                                        convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                            selectedRecord[componentrow.label] : new Date(), userInfo) :
                                        (typeof selectedRecord[componentrow.label] === "number") ?
                                            convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)
                                            : selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : "";
    
                                    GoodsInSample["jsonuidata"][componentrow.label] = GoodsInSample["jsondata"][componentrow.label]
                                } else {
                                    GoodsInSample["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
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
    
                                    GoodsInSample["jsonuidata"][componentrow.label] = GoodsInSample["jsondata"][componentrow.label]
                                }
                                if (componentrow.timezone) {
                                    GoodsInSample["jsondata"][`tz${componentrow.label}`] = selectedRecord[`tz${componentrow.label}`] ?
                                        { value: selectedRecord[`tz${componentrow.label}`].value, label: selectedRecord[`tz${componentrow.label}`].label } :
                                        defaulttimeZone ? defaulttimeZone : -1
    
                                    GoodsInSample["jsonuidata"][`tz${componentrow.label}`] = GoodsInSample["jsondata"][`tz${componentrow.label}`]
                                }
                                dateList.push(componentrow.label)
                            }
    
                            else {
                                GoodsInSample["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                    selectedRecord[componentrow.label] : ""
    
                                GoodsInSample["jsonuidata"][componentrow.label] = GoodsInSample["jsondata"][componentrow.label]
                            }
                        })
                        return GoodsInSample;
    
                    }
                    else {
                        if (component.inputtype === "combo" || component.inputtype === "predefineddropdown") {
                            if (component.inputtype === "predefineddropdown") {
                                GoodsInSample["jsondata"][component.label] = selectedRecord[component.label] ?
                                    {
                                        value: selectedRecord[component.label].value,
                                        label: selectedRecord[component.label].label,
                                       
    
                                    } : -1
                                GoodsInSample["jsonuidata"][component.label] = selectedRecord[component.label] ? selectedRecord[component.label].label : "";
    
                            } else {
                                GoodsInSample["jsondata"][component.label] = selectedRecord[component.label] ?
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
                                                    : selectedRecord[component.label].vale
    
                                    } : -1
                                    GoodsInSample["jsonuidata"][component.label] = selectedRecord[component.label] ? selectedRecord[component.label].label : "";
    
                            }                            
                        }
                        else if (component.inputtype === "date") {
                            if (component.mandatory) {
                                console.log(typeof selectedRecord[component.label] === "object")
                                GoodsInSample["jsondata"][component.label] = typeof selectedRecord[component.label] === "object" ?
    
                                    convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                        selectedRecord[component.label] : new Date(), userInfo) :
                                    (typeof selectedRecord[component.label] === "number") ?
                                        convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                            new Date(selectedRecord[component.label]) : new Date(), userInfo) :
                                        selectedRecord[component.label] ?
                                            selectedRecord[component.label] : "";
    
                                GoodsInSample["jsonuidata"][component.label] = GoodsInSample["jsondata"][component.label]
                            } else {
                                GoodsInSample["jsondata"][component.label] = component.loadcurrentdate ?
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
    
                                GoodsInSample["jsonuidata"][component.label] = GoodsInSample["jsondata"][component.label]
                            }
                            if (component.timezone) {
                                GoodsInSample["jsondata"][`tz${component.label}`] = selectedRecord[`tz${component.label}`] ?
                                    { value: selectedRecord[`tz${component.label}`].value, label: selectedRecord[`tz${component.label}`].label } :
                                    defaulttimeZone ? defaulttimeZone : -1
    
                                GoodsInSample["jsonuidata"][`tz${component.label}`] = GoodsInSample["jsondata"][`tz${component.label}`]
                            }
                            dateList.push(component.label)
                        }
                        else {
                            GoodsInSample["jsondata"][component.label] = selectedRecord[component.label] ?
                                selectedRecord[component.label] : ""
    
                            GoodsInSample["jsonuidata"][component.label] = GoodsInSample["jsondata"][component.label]
                        }
                        return GoodsInSample;
                    }
                }
                )
            })
        })
        const param = { GoodsInSample, dateList }
        return param;

    }

    importGoodsInSample =() => {

        const formData = new FormData();
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.stemplatefilename;
        let comboComponents=[];
        let data = [];
        const withoutCombocomponent = [];
        let mandatory =[];
        let mandatoryImportFields={};    
        const exportFieldProperties =[];


        if(acceptedFiles && acceptedFiles.length ===1){
            acceptedFiles.forEach((file, index) => {
                formData.append("uploadedFile", file);
            });
            const dateList = [];
            this.state.DynamicDateField.map(x=> {
                dateList.push(x['2'])
            });

            const exportList =[]; 
            this.state.DynamicExportfields.map(x=> {
                exportList.push(x['2'])
            });
           
        const Layout = this.props.Login.masterData.DesignTemplateMapping && this.props.Login.masterData.DesignTemplateMapping[0].jsondata
        if (Layout !== undefined) {
            Layout.map(row => {
                row.children.map(column => {
                    column.children.map(component => {
                        if(component.hasOwnProperty("children")) {
                            component.children.map(componentrow => {

                                if(exportList.length> 0){
                                    exportFieldProperties.push(componentrow);
                                }

                                if (componentrow.inputtype === "combo" || componentrow.inputtype === "backendsearchfilter"
                                    || componentrow.inputtype === "frontendsearchfilter") {
                                    data.push(componentrow)
                                } else {
                                    withoutCombocomponent.push(componentrow)
                                }
                                if(componentrow.mandatory=== true){
                                    mandatory.push({
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
                        }else {
                            if(exportList.length> 0){
                                exportFieldProperties.push(component);
                            }

                            component.inputtype === "combo" || component.inputtype === "backendsearchfilter"
                              || component.inputtype === "frontendsearchfilter" ?
                                 data.push(component) : withoutCombocomponent.push(component)
                                if(component.mandatory ===true){
                                    mandatory.push({
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
                })
            })
            comboComponents = data
        }      
        mandatory.map(x=>{
            mandatoryImportFields[x.dataField]=x.mandatory;

          })

            formData.append('mandatoryFields',Lims_JSON_stringify(JSON.stringify(mandatoryImportFields),false))
            formData.append('comboComponents', Lims_JSON_stringify(JSON.stringify(comboComponents), false))
            formData.append('dateconstraints', Lims_JSON_stringify(JSON.stringify(this.state.DynamicDateConstraints), false))
            formData.append('datelist', Lims_JSON_stringify(JSON.stringify(dateList), false))
            formData.append('exportFields', Lims_JSON_stringify(JSON.stringify(exportList), false))
            formData.append('exportFieldProperties', Lims_JSON_stringify(JSON.stringify(exportFieldProperties), false))
            formData.append('combinationunique', Lims_JSON_stringify(JSON.stringify(this.state.DynamicCombinationUnique), false))
            formData.append('ndesigntemplatemappingcode', this.props.Login.masterData.ndesigntemplatemappingcode)
            formData.append("ngoodsincode",this.props.Login.masterData.selectedGoodsIn.ngoodsincode)
            formData.append("ntransactionstatus",this.props.Login.masterData.selectedGoodsIn.ntransactionstatus)

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "GoodsInSample",
                displayName: this.props.Login.inputParam.displayName,
                inputData: { userinfo: this.props.Login.userInfo },
                formData: formData,
                isFileupload: true,
                operation: this.props.Login.operation,

            }
            //ALPD 3415
            // const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
            // if (esignNeeded) {
            //     const updateInfo = {
            //         typeName: DEFAULT_RETURN,
            //         data: {
            //             loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
            //             openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_GOODSINSAMPLE" }),
            //             operation: this.props.Login.operation,
            //         },

            //     }
            //     this.props.updateStore(updateInfo);
            // }
            // else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            // }                                                                                                                                                                                                                

        }else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTTHEFILE" }))
        }

    }


    insertGoodsInChecklist = () => {
        let inputData = [];     
        inputData["ngoodsincode"] =this.state.selectedRecord.ngoodsincode;
        inputData["ndesigntemplatemappingcode"]  = parseInt(this.props.Login.masterData.ndesigntemplatemappingcode && this.props.Login.masterData.ndesigntemplatemappingcode);
        inputData["userinfo"]  = this.props.Login.userInfo;   

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "GoodsInChecklist",
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: this.props.Login.operation, 
            selectedRecord:this.state.selectedRecord
                
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,openTemplateModal:true, screenName:  "IDS_GOODSINCHECKLIST",
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }        
        else {
            this.props.onSaveGoodsInCheckList(inputParam);
        }

    }

    componentDidUpdate(previousProps) {
        let { userRoleControlRights, controlMap,selectedRecord,skip, take,masterData,sampleGridDataState,
            DynamicGridItem,DynamicGridMoreField,DynamicExportItem,DynamicDateField,DynamicTemplateField,
            DynamicDateConstraints,DynamicCombinationUnique,Checklist,DynamicExportfields } = this.state;
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

        if (this.props.Login.masterData !== previousProps.Login.masterData) {     

            bool = true;
            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
            take = this.props.Login.take || take   
        }

        if (this.props.Login.sampleGridDataState && this.props.Login.sampleGridDataState !== previousProps.Login.sampleGridDataState) {
            sampleGridDataState = this.props.Login.sampleGridDataState;
        }

        if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
            const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata && this.props.Login.masterData.DynamicDesign.jsondata.value)
            if(dynamicColumn !== null){
                DynamicGridItem = dynamicColumn.griditem ? dynamicColumn.griditem : [];
                DynamicGridMoreField = dynamicColumn.gridmoreitem ? dynamicColumn.gridmoreitem : [];
                DynamicExportItem = dynamicColumn.exportFields ? dynamicColumn.exportFields : [];
                DynamicDateField = dynamicColumn.datefields ? dynamicColumn.datefields : [];
                DynamicTemplateField = dynamicColumn.templatefields ? dynamicColumn.templatefields : [];
                DynamicDateConstraints = dynamicColumn.dateconstraints ? dynamicColumn.dateconstraints : [];
                DynamicCombinationUnique = dynamicColumn.combinationunique ?  dynamicColumn.combinationunique : [] ;  
                Checklist = dynamicColumn.checklist ? dynamicColumn.checklist : [] ;      
                DynamicExportfields =dynamicColumn.exportFields ? dynamicColumn.exportFields  : [];     
            }
            

        }    

        
        if (bool) {
            this.setState({
                userRoleControlRights, controlMap,selectedRecord,skip, take,masterData,sampleGridDataState,
                DynamicGridItem,DynamicGridMoreField,DynamicExportItem, DynamicDateField,DynamicTemplateField ,
                DynamicDateConstraints,DynamicCombinationUnique,Checklist,DynamicExportfields
            });
        }
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, updateStore,getGoodsInFilterSubmit,validateEsignCredential,
    getGoodsInComboService ,getGoodsInDetail,getClient,getProjectType,getProject,filterColumnData,
    getPreviewTemplate,viewInformation,checkListGoodsIn,downloadGoodsIn,
    onSaveGoodsInCheckList,validateEsignGoodsIn,generateControlBasedReport
    
})(injectIntl(GoodsIn))