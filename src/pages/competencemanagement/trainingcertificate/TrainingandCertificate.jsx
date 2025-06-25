import React from 'react'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faThumbsUp, faUserLock, faClock } from '@fortawesome/free-solid-svg-icons';//,faUserTimes, faTrash
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getTrainingCertificateDetail,
    getTrainingCertificateComboService, getTrainingParticipantsComboDataService, filterColumnData, reloadTrainingCertificate,rescheduleTrainingCertificate,getAddValidityExpiry
} from '../../../actions';
import { ReactComponent as Reject } from '../../../assets/image/reject.svg'
import { ReadOnlyText, ContentPanel } from '../../../components/App.styles';
import { constructOptionList, getControlMap, showEsign, validateEmail, validatePhoneNumber, validateTwoDigitDate, convertDateValuetoString, formatInputDate } from '../../../components/CommonScript';//searchData, sortData,
import ListMaster from '../../../components/list-master/list-master.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import AddTrainingCertificate from './AddTrainingCertificate';

import Esign from '../../../pages/audittrail/Esign';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import { ListWrapper } from '../../../components/client-group.styles';
import { transactionStatus } from '../../../components/Enumeration';
import DateFilter from '../../../components/DateFilter';
import { Affix } from 'rsuite';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
// import ReactTooltip from 'react-tooltip';
import TrainingCertificateParticipantsTab from './TrainingCertificateParticipantsTab';
import AddValidityExpiry from './AddValidityExpiry';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class TrainingCertificate extends React.Component {
    constructor(props) {
        super(props);

        // const dataState = {
        //     skip: 0,
        //     take: 10,
        // };

        this.state = {
            isOpen: false,
            trainingcertificateData: [], TrainingParticipantsData: [],
            trainingcategoryList: [], techniqueList: [],
            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            sidebarview: false,
            screenName: undefined,
            userLogged: true,
            selectedTrainingCertificate: undefined,
            trainingparticipants: [], selectedTrainingParticipants: [],
            userRoleControlRights: [],
            controlMap: new Map(),
            showAccordian: true,
            TrainingParticipantscombo: [], trainingparticipantsList: []
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.trainingcertificateFieldList = ['strainername', 'strainingtopic', 'strainingvenue',
            'dtrainingdatetime', 'ntransactionstatus', 'ntechniquecode', 'ntrainingcategorycode', 'stztrainingdate', 'scomments'];//'nmahcode',
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
                        //console.log('screen name:',this.props.Login.screenName,'operation ;',this.props.Login.operation)
                        //console.log('selected r :', this.props.Login.inputParam)
        let userStatusCSS = "outline-secondary";
        if (this.props.Login.masterData.SelectedTrainingCertificate ? this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.COMPLETED
            || this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.CONDUCTED : false) {
            userStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.SelectedTrainingCertificate && this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.CANCELLED) {
            userStatusCSS = "outline-danger";
        }

        const addId = this.state.controlMap.has("AddTrainingCertificate") && this.state.controlMap.get("AddTrainingCertificate").ncontrolcode;
        const resheduleId = this.state.controlMap.has("ResheduleTrainingCertificate") && this.state.controlMap.get("ResheduleTrainingCertificate").ncontrolcode;
        const editId = this.state.controlMap.has("EditTrainingCertificate") && this.state.controlMap.get("EditTrainingCertificate").ncontrolcode;
        const conductId = this.state.controlMap.has("ConductTrainingCertificate") && this.state.controlMap.get("ConductTrainingCertificate").ncontrolcode
        const cancelId = this.state.controlMap.has("CancelTrainingCertificate") && this.state.controlMap.get("CancelTrainingCertificate").ncontrolcode

        const deleteId = this.state.controlMap.has("DeleteTrainingCertificate") && this.state.controlMap.get("DeleteTrainingCertificate").ncontrolcode;
        const deleteParam = { operation: "delete" };
        let obj = convertDateValuetoString(this.state.selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
            this.state.selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate),
            this.props.Login.userInfo)

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        const filterParam = {
            inputListName: "TrainingCertificate",
            selectedObject: "SelectedTrainingCertificate",
            primaryKeyField: "ntrainingcode",
            fetchUrl: "trainingcertificate/getTrainingCertificate",
            fecthInputObject: { userinfo: this.props.Login.userInfo, fromDate, toDate },
            masterData: this.props.Login.masterData,
            unchangeList: ["FromDate", "ToDate"],
            searchFieldList: this.trainingcertificateFieldList


        };
        this.validationColumnList = [
            { "idsName": "IDS_TRAININGCATERGORY", "dataField": "ntrainingcategorycode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_TECHNIQUE", "dataField": "ntechniquecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_TRAININGTPOIC", "dataField": "strainingtopic", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_TRAININGDATETIME", "dataField": "dtrainingdatetime", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "idsName": "IDS_TIMEZONE", "dataField": "ntztrainingdate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_TRAINERNAME", "dataField": "strainername", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_TRAININGVENUE", "dataField": "strainingvenue", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "150px","mandatory": false, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },

        ]
        const mandatoryFields = [];
        this.validationColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        let breadCrumbDataDate = convertDateValuetoString(this.props.Login.masterData && this.props.Login.masterData.FromDate,
            this.props.Login.masterData && this.props.Login.masterData.ToDate,
            this.props.Login.userInfo)

        const breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": breadCrumbDataDate.breadCrumbFrom
            },
            {
                "label": "IDS_TO",
                "value": breadCrumbDataDate.breadCrumbto
            }
        ];
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                    {/* Start of get display*/}
                    {/* <div className="client-listing-wrap mtop-4"> */}
                    {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={"IDS_TRAININGCERTIFICATE"}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.TrainingCertificate}
                                getMasterDetail={(trainingcertificate) => this.props.getTrainingCertificateDetail(trainingcertificate, fromDate, toDate, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.SelectedTrainingCertificate}
                                primaryKeyField="ntrainingcode"
                                mainField="strainingtopic"
                                firstField="strainingcategoryname"
                                secondField="sdisplaystatus"
                                isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
                                openModal={() => this.props.getTrainingCertificateComboService("IDS_TRAININGCERTIFICATE", "create", "ntrainingcode", null, this.props.Login.masterData, this.props.Login.userInfo, addId)}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}


                                filterComponent={[
                                    {
                                        "IDS_FILTER":
                                            <DateFilter
                                                selectedRecord={this.state.selectedRecord || {}}
                                                handleDateChange={this.handleDateChange}
                                                fromDate={fromDate}
                                                toDate={toDate}
                                                userInfo={this.props.Login.userInfo}
                                            />
                                    }
                                ]}
                            />
                        </Col>

                        {/* <Row>
                        <Col md={3}>
                                <DateTimePicker
                                        name={"fromdate"} 
                                        label={ this.props.intl.formatMessage({ id:"IDS_FROM"})}                     
                                        className='form-control'
                                        placeholderText="Select date.."
                                        selected={this.state.selectedRecord["fromdate"] || (this.props.Login.inputParam && new Date(this.props.Login.inputParam.inputData.fromDate))}
                                        dateFormat={"dd/MM/yyyy"}
                                        isClearable={false}
                                        onChange={date => this.handleDateChange("fromdate", date)}
                                        value={this.state.selectedRecord["fromdate"] || (this.props.Login.inputParam && new Date(this.props.Login.inputParam.inputData.fromDate))}
                                                                        
                                />
                        </Col>
                        <Col md={3}>
                                <DateTimePicker
                                        name={"todate"} 
                                        label={ this.props.intl.formatMessage({ id:"IDS_TO"})}                     
                                        className='form-control'
                                        placeholderText="Select date.."
                                        selected={this.state.selectedRecord["todate"] || (this.props.Login.inputParam && new Date(this.props.Login.inputParam.inputData.toDate))}
                                        dateFormat={"dd/MM/yyyy"}
                                        isClearable={false}                                        
                                        onChange={date => this.handleDateChange("todate", date)}
                                        value={this.state.selectedRecord["todate"] || (this.props.Login.inputParam && new Date(this.props.Login.inputParam.inputData.toDate))}
                                                                        
                                />
                        </Col>
                        <Col></Col>
                   </Row> */}
                        <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?                    
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i> 
                                    }
                                </div>
                            </div> 
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.TrainingCertificate && this.props.Login.masterData.TrainingCertificate.length > 0 && this.props.Login.masterData.SelectedTrainingCertificate ?
                                        <>
                                            <Card.Header>
                                                <Card.Title>
                                                    <h1 className="product-title-main">{this.props.Login.masterData.SelectedTrainingCertificate.strainingtopic}</h1>
                                                </Card.Title>
                                                <Card.Subtitle className="text-muted font-weight-normal">
                                                    <Row>
                                                        <Col md={10} className="d-flex no-padding">
                                                            <h2 className="product-title-sub flex-grow-1">

                                                                <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                                    {this.props.Login.masterData.SelectedTrainingCertificate && this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.ACTIVE ? <i class="fas fa-check "></i> : ""}
                                                                    <FormattedMessage id={this.props.Login.masterData.SelectedTrainingCertificate.sdisplaystatus || ""} />
                                                                </span>

                                                            </h2>
                                                        </Col>
                                                        <Col md={2}>
                                                            <div className="d-flex product-category float-right icon-group-wrap">

                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                   // data-for="tooltip_list_wrap"
                                                                    onClick={() => this.getTrainingCertificateComboService(editId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" name="deletemethodname"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            
                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                            onClick={() => this.ConfirmDelete(deleteParam,deleteId)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                            
                                                        </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(resheduleId) === -1}
                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_RESCHEDULE" })}
                                                                   // data-for="tooltip_list_wrap"
                                                                    onClick={() => this.getTrainingCertificateComboService(resheduleId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faClock} title={this.props.intl.formatMessage({ id: "IDS_RESCHEDULE" })} />
                                                                </Nav.Link>


                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(conductId) === -1}
                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_CONDUCT" })}
                                                                   // data-for="tooltip_list_wrap"
                                                                    //onClick={() => this.onConductlick()}
                                                                    onClick={()=>this.props.getAddValidityExpiry("IDS_TRAININGEXPIRY", "create", this.props.Login.masterData, this.props.Login.userInfo, conductId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faThumbsUp} title={this.props.intl.formatMessage({ id: "IDS_CONDUCT" })} />
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(cancelId) === -1}
                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_TRAININGSCHEDULECANCEL" })}
                                                                 //   data-for="tooltip_list_wrap"
                                                                    onClick={() => this.onCancelListClick()}
                                                                >
                                                                    <Reject className="custom_icons" width="20" height="20" />
                                                                    {/* <FontAwesomeIcon icon={faUserLock} title={this.props.intl.formatMessage({ id: "IDS_TRAININGSCHEDULECANCEL" })} /> */}
                                                                </Nav.Link>
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>
                                                {/* <Card.Text> */}
                                                <Row>
                                                <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TRAININGCATEGORY" message="Training Category" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingCertificate.strainingcategoryname}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TECHNIQUE" message="Technique" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingCertificate.stechniquename}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TRAININGTOPIC" message="Training Topic" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingCertificate.strainingtopic}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TRAININGDATETIME" message="Training Date" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingCertificate.strainingdatetime}</ReadOnlyText>
                                                            {/* <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingCertificate.strainingdatetime.substring(0,10)}</ReadOnlyText> */}
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TRAININGNAME" message="Training Name" /></FormLabel>
                                                            <ReadOnlyText> {this.props.Login.masterData.SelectedTrainingCertificate.strainername}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TRAININGVENUE" message="Venue" /></FormLabel>
                                                            <ReadOnlyText> {this.props.Login.masterData.SelectedTrainingCertificate.strainingvenue}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    {/* <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TRAININTIMEZONE" message="Time Zone" /></FormLabel>
                                                            <ReadOnlyText> {this.props.Login.masterData.SelectedTrainingCertificate.ntztrainingdate}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> */}
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TRAININGCOMMENTS" message="Comments" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingCertificate.scomments}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TRAININGEXPIRYNEED" message="Training Expiry Need" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingCertificate.strainingexpiryneed}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TRAININGEXPIRYVALUE" message="Training Expiry Value" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingCertificate.ntrainingexpiryvalue}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TRAININGEXPIRYPERIOD" message="Training Expiry Period" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingCertificate.speriodname}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TRAININGEXPIRYDATE" message="Training Expiry Date" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingCertificate.strainingexpirydate && 
                                                            this.props.Login.masterData.SelectedTrainingCertificate.strainingexpirydate.length > 1 ? 
                                                            this.props.Login.masterData.SelectedTrainingCertificate.strainingexpirydate.substring(0,10)
                                                        :"-"}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>

                                                </Row>
                                                <TrainingCertificateParticipantsTab formatMessage={this.props.intl.formatMessage}
                                                    operation={this.props.Login.operation}
                                                    inputParam={this.props.Login.inputParam|| []}
                                                    screenName={this.props.Login.screenName}
                                                    userInfo={this.props.Login.userInfo}
                                                    masterData={this.props.Login.masterData}
                                                    crudMaster={this.props.crudMaster}
                                                    errorCode={this.props.Login.errorCode}
                                                    masterStatus={this.props.Login.masterStatus}
                                                    openChildModal={this.props.Login.openChildModal}
                                                    updateStore={this.props.updateStore}
                                                    selectedRecord={this.props.Login.selectedRecord}
                                                    getTrainingParticipantsComboDataService={this.props.getTrainingParticipantsComboDataService}
                                                    ncontrolCode={this.props.Login.ncontrolCode}
                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                    esignRights={this.props.Login.userRoleControlRights}
                                                    screenData={this.props.Login.screenData}
                                                    validateEsignCredential={this.props.validateEsignCredential}
                                                    loadEsign={this.props.Login.loadEsign}
                                                    controlMap={this.state.controlMap}
                                                    showAccordian={this.state.showAccordian}
                                                    dataState={this.props.Login.dataState}
                                                    selectedId={this.props.Login.selectedId}
                                                    settings={this.props.Login.settings}
                                                    nFlag={this.props.Login.nFlag}

                                                />
                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col>
                    </Row>
                </ListWrapper>


                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        // operation={this.props.Login.operation === "update" ? this.props.intl.formatMessage({ id:"IDS_RESCHEDULE"}) : this.props.Login.operation}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam || []}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.props.Login.screenName === "IDS_TRAININGEXPIRY"  ? this.onConductlick:this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.screenName === "IDS_TRAININGEXPIRY" ? 
                         [] : mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            this.props.Login.screenName === "IDS_TRAININGEXPIRY"  ? 
                            <AddValidityExpiry
                                     selectedRecord={this.state.selectedRecord || {}}
                                     onComboChange={this.onComboChange}
                                     onInputOnChange={this.onInputOnChange}
                                     period={this.props.Login.period || []}/>
                            
                            :
                            <AddTrainingCertificate
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                handleDateChange={this.handleDateChange}
                                formatMessage={this.props.intl.formatMessage}
                                trainingcategoryList={this.props.Login.trainingcategoryList || []}
                                techniqueList={this.props.Login.techniqueList || []}
                                timeZoneList={this.props.Login.timeZoneList || []}
                                currentTime={this.props.Login.currentTime || []}
                                selectedTrainingCertificate={this.props.Login.masterData.SelectedTrainingCertificate || {}}
                                operation={this.props.Login.operation}
                                userLogged={this.props.Login.userLogged}
                                inputParam={this.props.Login.inputParam}
                                userInfo={this.props.Login.userInfo}
                            />
                        }
                    />
                }
                {/* End of Modal Sideout for User Creation */}
            </>
        );
    }

    ConfirmDelete = (deleteParam,deleteID) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(deleteParam,deleteID));
    }

    deleteRecord = (deleteParam, nControlcode) => {

        let objdate = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);

        let fromDate = objdate.fromDate;
        let toDate = objdate.toDate;

        const postParam = {
            inputListName: "TrainingCertificate", selectedObject: "SelectedTrainingCertificate",
            primaryKeyField: "ntrainingcode",
            primaryKeyValue: this.props.Login.masterData.SelectedTrainingCertificate.ntrainingcode,
            fetchUrl: "trainingcertificate/getTrainingCertificate",
            fecthInputObject: { userinfo: this.props.Login.userInfo,"fromDate":fromDate,"toDate":toDate },
        }
        

        const inputParam = {
                                classUrl: this.props.Login.inputParam.classUrl,
                                methodUrl: "TrainingCertificate",
                                displayName:this.props.Login.screenName,
                                inputData: {["trainingcertificate"] :this.props.Login.masterData.SelectedTrainingCertificate,   
                                "fromDate":fromDate,"toDate":toDate,"userinfo": this.props.Login.userInfo},
                                operation:deleteParam.operation,
            dataState: this.state.dataState ,
            postParam
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

    componentDidUpdate(previousProps) {
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

    getTrainingCertificateComboService = (controlId) => {

        if (this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.CANCELLED && this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.COMPLETED) {
            let operation = controlId === this.state.controlMap.get("EditTrainingCertificate").ncontrolcode ? "update" : "reschedule";
            if(this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.CONDUCTED){     
                        this.props.getTrainingCertificateComboService("IDS_TRAININGCERTIFICATE", operation, "ntrainingcode", this.props.Login.masterData.SelectedTrainingCertificate.ntrainingcode,
                        this.props.Login.masterData, this.props.Login.userInfo, controlId)
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id:"IDS_TESTTRAININGALREADYCONDUCTED"}));
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id:this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.CANCELLED ? "IDS_TESTTRAININGALREADYCANCELLED" : "IDS_TESTTRAININGALREADYCOMPLETED"}));
        }
    }
    generateBreadCrumData() {
        const breadCrumbData = [];

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {

            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate,
                this.props.Login.masterData.ToDate,
                this.props.Login.userInfo);

            breadCrumbData.push(
                {
                    "label": "IDS_FROM",
                    "value": obj.breadCrumbFrom
                },
                {
                    "label": "IDS_TO",
                    "value": obj.breadCrumbto
                },
            );
        }
        return breadCrumbData;
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
    onFilterSubmit = () => {
        this.reloadData(true);
    }

    reloadData = (isFilterSubmit) => {

        this.searchRef.current.value = "";
        // let obj = this.convertDatetoString(selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
        //     selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate))

        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
        if (isFilterSubmit) {
            let selectedRecord = this.state.selectedRecord || {};
            if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
                fromDate = selectedRecord["fromdate"];
            }
            if (selectedRecord && selectedRecord["todate"] !== undefined) {
                toDate = selectedRecord["todate"];
            }
        }
        //let obj = this.convertDatetoString(fromDate, toDate); 
        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                currentDate: null
                //currentdate: isDateChange === true ? null : formatInputDate(new Date(), true)
            },
            classUrl: "trainingcertificate",
            methodUrl: "TrainingCertificate",
            displayName: "IDS_TRAININGCERTIFICATE",

            userInfo: this.props.Login.userInfo
        };
        //this.props.callService(inputParam);
        this.props.reloadTrainingCertificate(inputParam);
    }

    onConductlick = () => {
        if (this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.CANCELLED) {

        const ncontrolCode = this.state.controlMap.has("ConductTrainingCertificate") && this.state.controlMap.get("ConductTrainingCertificate").ncontrolcode
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;


        if (this.state.selectedRecord.nvalidityneed && this.state.selectedRecord.nvalidityneed===3
             &&  (this.state.selectedRecord.nvalidityexpiryvalue === undefined ||
                this.state.selectedRecord.nvalidityexpiryvalue === 0))
            {
        toast.info(this.props.intl.formatMessage({ id:"IDS_SELECTEXPIRYVALUE"}));
        return;
    }
    if (this.state.selectedRecord.nvalidityneed && this.state.selectedRecord.nvalidityneed===3
        && (this.state.selectedRecord["nvalidityexpiryperiod"] === undefined ||
        this.state.selectedRecord["nvalidityexpiryperiod"] === null ||
        this.state.selectedRecord["nvalidityexpiryperiod"].value === undefined))
       {
        
        toast.info(this.props.intl.formatMessage({ id:"IDS_SELECTPERIOD"}));
   return;
}

        let postParam = undefined;
        inputData["trainingcertificate"] = { "ntrainingcode": this.props.Login.masterData.SelectedTrainingCertificate["ntrainingcode"] ? this.props.Login.masterData.SelectedTrainingCertificate["ntrainingcode"].Value : "" };
        // inputData["trainingcertificate"] = { "ntrainingexpiryneed": this.state.selectedRecord.nvalidityneed ? this.state.selectedRecord.nvalidityneed : "4",
        // "ntrainingexpiryvalue": this.state.selectedRecord.nvalidityexpiryvalue ? this.state.selectedRecord.nvalidityexpiryvalue : "0",
        // "ntrainingexpiryperiod": this.state.selectedRecord["nvalidityexpiryperiod"] ? this.state.selectedRecord["nvalidityexpiryperiod"].nperiodcode : "4" };
        inputData["trainingcertificate"] = this.props.Login.masterData.SelectedTrainingCertificate;
        
        postParam = { inputListName: "TrainingCertificate", selectedObject: "SelectedTrainingCertificate", primaryKeyField: "ntrainingcode" };

        inputData["trainingcertificate"]["ntrainingexpiryperiod"] = this.state
        .selectedRecord["nvalidityexpiryperiod"]
        ? this.state.selectedRecord["nvalidityexpiryperiod"].value ||
        transactionStatus.NA
        : transactionStatus.NA;

        inputData["trainingcertificate"]["ntrainingexpiryneed"] = this.state
        .selectedRecord.nvalidityneed
        ? this.state.selectedRecord.nvalidityneed : transactionStatus.NO;

        inputData["trainingcertificate"]["ntrainingexpiryvalue"] = this.state
        .selectedRecord.nvalidityexpiryvalue
        ? this.state.selectedRecord.nvalidityexpiryvalue : 0;

       

        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        inputData["fromDate"] = fromDate;
        inputData["toDate"] = toDate;

        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate, toDate,
            },
            classUrl: 'trainingcertificate',
            methodUrl: "TrainingCertificate",
            inputData: inputData,
            operation: "conduct", postParam
        }
        let saveType;

        const masterData = this.props.Login.masterData;

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "conduct"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

    }
    else {

        toast.warn(this.props.intl.formatMessage({ id:"IDS_TRAININGCANCELED"}));
    }
    }

    onCancelListClick = () => {
        if(this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.CONDUCTED && this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.COMPLETED){
        //if (this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.DRAFT) {
        const ncontrolCode = this.state.controlMap.has("CancelTrainingCertificate") && this.state.controlMap.get("CancelTrainingCertificate").ncontrolcode
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        //add               
        let postParam = undefined;
        inputData["trainingcertificate"] = { "ntrainingcode": this.props.Login.masterData.SelectedTrainingCertificate["ntrainingcode"] ? this.props.Login.masterData.SelectedTrainingCertificate["ntrainingcode"].Value : "" };
        inputData["trainingcertificate"] = this.props.Login.masterData.SelectedTrainingCertificate;

        postParam = { inputListName: "TrainingCertificate", selectedObject: "SelectedTrainingCertificate", primaryKeyField: "ntrainingcode" };

        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        inputData["fromDate"] = fromDate;
        inputData["toDate"] = toDate;

        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate, toDate,
            },
            classUrl: 'trainingcertificate',
            methodUrl: "TrainingCertificate",
            inputData: inputData,
            operation: "cancel", postParam
        }
        let saveType;

        const masterData = this.props.Login.masterData;

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "cancel"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }
    else{
        toast.warn(this.props.intl.formatMessage({ id: this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.CONDUCTED ? "IDS_TESTTRAININGALREADYCONDUCTED" : "IDS_TESTTRAININGALREADYCOMPLETED"}));
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



    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "conduct"
                || this.props.Login.operation === "blackList" || this.props.Login.operation === "cancel"
                  || this.props.Login.operation === "invite") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason']="";
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;

        this.setState({ selectedRecord });
    }

    onInputOnChange = (event, optional,name) => {
        const selectedRecord = this.state.selectedRecord || {};
        if(name==="nvalidityexpiryvalue")
        {
            selectedRecord[name] = event;
        }
        else
        {
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
    }
        this.setState({ selectedRecord });
    }
    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onSaveClick = (saveType, formRef) => {


        let inputData = [];
        inputData["ncontrolcode"] = this.props.Login.ncontrolCode;
        inputData["userinfo"] = this.props.Login.userInfo;
        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        inputData["fromDate"] = fromDate;
        inputData["toDate"] = toDate;

        let postParam = undefined;
        
        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "TrainingCertificate", selectedObject: "SelectedTrainingCertificate", primaryKeyField: "ntrainingcode" };
            inputData["trainingcertificate"] = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));

            this.trainingcertificateFieldList.map(item => {
                return inputData["trainingcertificate"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
            inputData["trainingcertificate"]["ntransactionstatus"] = this.state.selectedRecord.ntransactionstatus;
        }
        else if(this.props.Login.operation === "reschedule"){
            //reschedule
            postParam = { inputListName: "TrainingCertificate", selectedObject: "SelectedTrainingCertificate", primaryKeyField: "ntrainingcode" };
            inputData["trainingcertificate"] = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));

            this.trainingcertificateFieldList.map(item => {
                return inputData["trainingcertificate"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
            inputData["trainingcertificate"]["ntransactionstatus"] = transactionStatus.RESCHEDULED;
            
        }
        else {
            //add               
            inputData["trainingcertificate"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };


            this.trainingcertificateFieldList.map(item => {
                return inputData["trainingcertificate"][item] = this.state.selectedRecord[item]
            });
            inputData["trainingcertificate"]["ntransactionstatus"] = transactionStatus.SCHEDULED;

        }
        if (this.state.selectedRecord["dtrainingdatetime"]) {
            inputData["trainingcertificate"]["dtrainingdatetime"] = formatInputDate(
              this.state.selectedRecord["dtrainingdatetime"],
              false
            );
          }

        inputData["trainingcertificate"]["ntrainingcategorycode"] = this.state.selectedRecord["ntrainingcategorycode"] ? this.state.selectedRecord["ntrainingcategorycode"].value : "-1";
        inputData["trainingcertificate"]["ntechniquecode"] = this.state.selectedRecord["ntechniquecode"] ? this.state.selectedRecord["ntechniquecode"].value : "-1";
        inputData["trainingcertificate"]["ntztrainingdate"] = this.state.selectedRecord["ntztrainingdate"] ? this.state.selectedRecord["ntztrainingdate"].value : "-1";

        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate, toDate,
            },
            classUrl: "trainingcertificate", //this.props.Login.inputParam.classUrl,
            methodUrl: "TrainingCertificate",
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef
        }
        const masterData = this.props.Login.masterData;

        if (
            showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal") 
        }
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
    // reloadData = () => {
    //     const startDate = this.state.selectedRecord["fromdate"] || (this.props.Login.inputParam && new Date(this.props.Login.inputParam.inputData.fromDate));
    //     const endDate = this.state.selectedRecord["todate"] || (this.props.Login.inputParam && new Date(this.props.Login.inputParam.inputData.toDate));

    //     const prevMonth = validateTwoDigitDate(String(startDate.getMonth()+1)); 
    //     const currentMonth = validateTwoDigitDate(String(endDate.getMonth()+1));
    //     const prevDay = validateTwoDigitDate(String(startDate.getDate())); 
    //     const currentDay = validateTwoDigitDate(String(endDate.getDate()));

    //     const fromDate = startDate.getFullYear()+'-'+prevMonth+'-'+prevDay +" 00:00:00";
    //     const toDate = endDate.getFullYear()+'-'+currentMonth+'-'+currentDay + " 23:59:00" ;                    

    //     const inputParam = {
    //         inputData : {"userinfo":this.props.Login.userInfo,
    //                         fromDate, toDate,
    //                     },                        
    //                     classUrl: this.props.Login.inputParam.classUrl,
    //                     methodUrl: this.props.Login.inputParam.methodUrl,
    //                     displayName:this.props.Login.inputParam.displayName,
    //                     userInfo: this.props.Login.userInfo
    //                 };     
    //     this.props.callService(inputParam);

    //     // this.searchRef.current.value = "";
    //     // const inputParam = {
    //     //     inputData: { "userinfo": this.props.Login.userInfo },
    //     //     classUrl: "trainingcertificate",
    //     //     methodUrl: "TrainingCertificate",

    //     //     displayName: "IDS_TRAININGcertificate",
    //     //     userInfo: this.props.Login.userInfo
    //     // };

    //     // this.props.callService(inputParam);
    // }
    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,
    updateStore, getTrainingCertificateDetail,
    getTrainingCertificateComboService, getTrainingParticipantsComboDataService, filterColumnData, reloadTrainingCertificate,rescheduleTrainingCertificate,getAddValidityExpiry
})(injectIntl(TrainingCertificate));

