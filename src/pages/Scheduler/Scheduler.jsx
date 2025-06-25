import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

import {
    callService, crudMaster, validateEsignCredential, updateStore, getSchedulerDetail,
    getSchedulerComboService, changeScheduleTypeFilter, getUserMultiRoleComboDataService, getUserMultiDeputyComboDataService,
    getUserSiteDetail, getUserSiteComboService, filterColumnData, getPreviewTemplate
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap, constructOptionList, validatePhoneNumber, formatInputDate, create_UUID, validateEmail, validateLoginId, formatDate, onDropAttachFileList, deleteAttachmentDropZone, comboChild } from '../../components/CommonScript';
//import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { transactionStatus } from '../../components/Enumeration';
import ListMaster from '../../components/list-master/list-master.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
import { process } from "@progress/kendo-data-query";
import DataGrid from "../../components/data-grid/data-grid.component";
// import 'react-perfect-scrollbar/dist/css/styles.css';
import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import AddScheduler from './AddScheduler';
import Esign from '../audittrail/Esign';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import ScheduleTypeFilter from './ScheduleTypeFilter';
import PortalModal from '../../PortalModal';
import PreRegisterSlideOutModal from '../registration/PreRegisterSlideOutModal';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Scheduler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            selectedScheduler: undefined,
            screenName: undefined,
            userLogged: true,
            dataState: { skip: 0, take: 5 },
            userRoleControlRights: [],
            controlMap: new Map(),
            isClearSearch: false,
            comboComponents: [],
            withoutCombocomponent: [],
            childColumnList: [],
            columnList: [],

        };
        this.searchRef = React.createRef();

        this.confirmMessage = new ConfirmMessage();

        this.schedulerFieldList = ['sschedulename', 'sscheduletype', 'stempscheduleType', 'stransstatus', 'sremarks', 'dstartdate',
            'dstarttime', 'noccurencenooftimes', 'soccurencehourwiseinterval', 'noccurencedaywiseinterval', 'sstartdate',
            'denddate', 'dendtime', 'nmonthyweek', 'nexactday', 'nmonthlyoccurrencetype', 'njan', 'nfeb', 'nmar', 'napr', 'nmay', 'njun', 'njul',
            'naug', 'nsep', 'noct', 'nnov', 'ndec', 'nsunday', 'nmonday', 'ntuesday', 'nwednesday', 'nthursday', 'nfriday', 'nsaturday', 'sstarttime', 'senddate', 'sendtime'];

        this.searchFieldList = ['sschedulename', 'sscheduletype', 'stempscheduleType', 'stransstatus', 'sremarks', 'dstartdate',
            'dstarttime', 'nsitecode', 'nstatus', 'noccurencenooftimes', 'soccurencehourwiseinterval', 'noccurencedaywiseinterval', 'sstartdate',
            'denddate', 'dendtime', 'nmonthyweek', 'nexactday', 'nmonthlyoccurrencetype', 'njan', 'nfeb', 'nmar', 'napr', 'nmay', 'njun', 'njul',
            'naug', 'nsep', 'noct', 'nnov', 'ndec', 'nsunday', 'nmonday', 'ntuesday', 'nwednesday', 'nthursday', 'nfriday', 'nsaturday', 'sstarttime', 'senddate', 'sendtime'];

        this.columnList = [
            { idsName: "IDS_SCHEDULEPRODUCT", dataField: "sproduct", width: "250px" },
            { idsName: "IDS_SAMPLINGPOINT", dataField: "ssamplingpoint", width: "150px" },
            { idsName: "IDS_SCHEDULEROCCURENCEDATE", dataField: "sscheduleoccurencedate", width: "150px" }


        ];
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

    getRegistrationComboService = (preregId) => {
        if (this.props.Login.masterData.SelectedScheduler.ntransactionstatus === transactionStatus.APPROVED) {


            const ndesigntemplatemappingcodefilter = this.props.Login.masterData.ndesigntemplatemappingcode &&
                this.props.Login.masterData.ndesigntemplatemappingcode
            if (ndesigntemplatemappingcodefilter === this.props.Login.masterData.ndesigntemplatemappingcode) {
                let data = [];
                const withoutCombocomponent = []
                const Layout = this.props.Login.masterData.schedulerTemplate
                    && this.props.Login.masterData.schedulerTemplate.jsondata
                if (Layout !== undefined) {
                    Layout.map(row => {
                        return row.children.map(column => {
                            return column.children.map(component => {
                                return component.hasOwnProperty("children") ?
                                    component.children.map(componentrow => {
                                        if (componentrow.inputtype === "combo") {
                                            data.push(componentrow)
                                        } else {
                                            withoutCombocomponent.push(componentrow)
                                        }
                                        return null;
                                    })
                                    : component.inputtype === "combo" ?
                                        data.push(component) : withoutCombocomponent.push(component)
                            })
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
                        nsampletypecode: 1, //parseInt(this.props.Login.masterData.RealSampleTypeValue.nsampletypecode)
                        nneedsubsample: transactionStatus.NO
                    }
                    this.props.getPreviewTemplate(this.props.Login.masterData, this.props.Login.userInfo, preregId,
                        data, this.state.selectedRecord, childColumnList,
                        comboComponents, withoutCombocomponent, true, false,
                        mapOfFilterRegData, false, "create", 'scheduler')
                } else {
                    toast.info("Configure the schedule template for this scheduler")
                }
            } else {
                toast.info("select the approved design template")
            }
        } else {
            toast.info("select the approved schedule")
        }
    }

    render() {

        //let userStatusCSS = "outline-success"//"outline-secondary";
        let userStatusCSS = "outline-secondary";
        if (this.props.Login.masterData.SelectedScheduler && this.props.Login.masterData.SelectedScheduler.ntransactionstatus === transactionStatus.APPROVED) {
            userStatusCSS = "outline-success";
        }
        let activeIconCSS = "fa fa-check"
        let sweek = "";
        let smonth = "";

        const addId = this.state.controlMap.has("AddScheduler") && this.state.controlMap.get("AddScheduler").ncontrolcode;
        const editId = this.state.controlMap.has("EditScheduler") && this.state.controlMap.get("EditScheduler").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteScheduler") && this.state.controlMap.get("DeleteScheduler").ncontrolcode;
        const approveId = this.state.controlMap.has("ApproveScheduler") && this.state.controlMap.get("ApproveScheduler").ncontrolcode;
        const preregId = this.state.controlMap.has("PreregScheduler") && this.state.controlMap.get("PreregScheduler").ncontrolcode;

        const testTabMap = new Map();
        const filterParam = {
            inputListName: "Scheduler", selectedObject: "SelectedScheduler", primaryKeyField: "nschedulecode",
            fetchUrl: "scheduler/getScheduler", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList,
            sscheduletype: this.state.nfilterScheduleType ? this.state.nfilterScheduleType.label : null
        };

        const addParam = {
            screenName: "IDS_SCHEDULER", operation: "create", primaryKeyName: "nschedulecode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: addId,
            nfilterScheduleType: this.state.nfilterScheduleType
        }

        const editParam = {
            screenName: "IDS_SCHEDULER", operation: "update", primaryKeyName: "nschedulecode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: editId, inputListName: "Scheduler", selectedObject: "SelectedScheduler"
        };

        const approveParam = {
            screenName: "IDS_SCHEDULER", operation: "update", primaryKeyName: "nschedulecode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: approveId, inputListName: "Scheduler", selectedObject: "SelectedScheduler"
        };


        const userImgPath = this.props.Login.settings && this.props.Login.settings[6] + this.props.Login.masterData.UserImagePath;
        const signImgPath = this.props.Login.settings && this.props.Login.settings[6] + this.props.Login.masterData.SignImagePath;

        const mandatoryFields = [{ "idsName": "IDS_SCHEDULERNAME", "dataField": "sschedulename", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        //{ "idsName": "IDS_SCHEDULERTYPE", "dataField": "sscheduletype" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
        //{ "idsName": "IDS_OCCURRENCE", "dataField": "noccurencenooftimes" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
        //{ "idsName": "IDS_OCCURRENCEDAYWISE", "dataField": "noccurencedaywiseinterval", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
        //{ "idsName": "IDS_OCCURRENCEHOURWISE", "dataField": "soccurencehourwiseinterval" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
        //{ "idsName": "IDS_MONTHLYOCCURRENCETYPE", "dataField": "nmonthlyoccurrencetype" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
        { "idsName": "IDS_STARTDATE", "dataField": "dstartdate", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_STARTTIME", "dataField": "dstarttime", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        ];
        this.breadCrumbData = [
            
            {
                "label": "IDS_SCHEDULERTYPE",
                "value": this.props.Login.masterData.nfilterScheduleType ? this.props.Login.masterData.nfilterScheduleType.label : "One Time"
            }
        ];
        //const breadCrumbData = this.state.filterData || [];
        return (<>
            {/* Start of get display*/}

            <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb">
                {//breadCrumbData.length > 0 ?
                    <Affix top={53}>
                        <BreadcrumbComponent breadCrumbItem={this.breadCrumbData } />
                    </Affix>// : ""
                }
                <Row noGutters>
                    <Col md={4}>
                        {/* <Row noGutters>
                            <Col md={12}> */}
                        {/* <div className="list-fixed-wrap"> */}
                        <ListMaster
                            screenName={this.props.intl.formatMessage({ id: "IDS_SCHDULER" })}
                            masterData={this.props.Login.masterData}
                            userInfo={this.props.Login.userInfo}
                            masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Scheduler}
                            getMasterDetail={(scheduler) => this.props.getSchedulerDetail(scheduler, this.props.Login.userInfo, this.props.Login.masterData, this.state.nfilterScheduleType.label)}
                            selectedMaster={this.props.Login.masterData.SelectedScheduler}
                            primaryKeyField="nschedulecode"
                            mainField="sschedulename"
                            firstField="stempscheduleType"
                            //secondField="nstatus"
                            filterColumnData={this.props.filterColumnData}
                            filterParam={filterParam}
                            userRoleControlRights={this.state.userRoleControlRights}
                            addId={addId}
                            searchRef={this.searchRef}
                            reloadData={this.reloadData}
                            openModal={() => this.props.getSchedulerComboService(addParam)}
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
                                    "IDS_TESTFILTER":
                                        <ScheduleTypeFilter
                                            filterScheduleType={this.state.filterScheduleType || []}
                                            nfilterScheduleType={this.state.nfilterScheduleType || {}}
                                            onComboChange={this.onComboChangeevent}
                                        />
                                }
                            ]}
                        // actionIcons={
                        //     [
                        //         {
                        //             title: this.props.intl.formatMessage({ id: "IDS_PREREG" }),
                        //             controlname: "faPencilAlt",
                        //             objectName: "mastertocreate",
                        //             //hidden: this.state.userRoleControlRights.indexOf(this.state.editSampleId) === -1,
                        //             onClick: this.getRegistrationComboService,
                        //             inputData: {
                        //                 primaryKeyName: "nschedulecode",
                        //                 operation: "create",
                        //                 masterData: this.props.Login.masterData,
                        //                 userInfo: this.props.Login.userInfo,
                        //                 createRegParam: {
                        //                     ncontrolCode: preregId
                        //                 }
                        //             },
                        //         }

                        //     ]
                        // }
                        />
                        {/* </div>
                        </Col></Row> */}
                    </Col>
                    <Col md={8}>
                        {/* <Row>
                            <Col md={12}> */}
                        <ContentPanel className="panel-main-content">
                            <Card className="border-0">
                                {this.props.Login.masterData.Scheduler && this.props.Login.masterData.Scheduler.length > 0 && this.props.Login.masterData.SelectedScheduler ?
                                    <>
                                        <Card.Header>
                                            {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                            <Card.Title className="product-title-main">
                                                {this.props.Login.masterData.SelectedScheduler.sschedulename}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                <div className="d-flex product-category">
                                                    <h2 className="product-title-sub flex-grow-1">

                                                        <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                            {/* {activeIconCSS !== "" ? <i class="fas fa-check "></i> : ""} */}
                                                            {/* {this.props.Login.masterData.SelectedScheduler.nstatus === 1 ? "DRAFT": "Approved"} */}
                                                            {this.props.Login.masterData.SelectedScheduler.stransstatus}
                                                            {/*{activeIconCSS}  <FormattedMessage id= {this.props.Login.masterData.SelectedUser.sactivestatus}/> */}

                                                        </span>
                                                    </h2>
                                                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                    <div className="d-inline">
                                                        {/* <Nav.Link name="preregScheduler"
                                                           hidden={this.state.userRoleControlRights.indexOf(preregId) === -1}
                                                            className="btn btn-circle outline-grey mr-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_SCHEDULERPREREGISTER" })}
                                                           data-for="tooltip_list_wrap"
                                                            onClick={() => this.getRegistrationComboService(preregId)}
                                                        >
                                                            <FontAwesomeIcon icon={faUserPlus} />
                                                        </Nav.Link> */}
                                                        <Nav.Link name="editScheduler" hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                            className="btn btn-circle outline-grey mr-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            //data-for="tooltip_list_wrap"
                                                            onClick={() => this.props.getSchedulerComboService(editParam)}
                                                        >
                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                        </Nav.Link>

                                                        <Nav.Link name="deleteScheduler" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                          //  data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                            onClick={() => this.ConfirmDelete(deleteId)}>
                                                            <FontAwesomeIcon icon={faTrashAlt} />

                                                        </Nav.Link>
                                                        <Nav.Link name="ApproveScheduler" hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                            className="btn btn-circle outline-grey mr-2"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                         //   data-for="tooltip_list_wrap"
                                                            onClick={() => this.onApproveClick("Scheduler", "approve", "nschedulecode", this.props.Login.masterData.SelectedScheduler.nschedulecode, approveId)}
                                                        >
                                                            <FontAwesomeIcon icon={faThumbsUp} />
                                                        </Nav.Link>


                                                    </div>
                                                    {/* </Tooltip> */}
                                                </div>

                                            </Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body className="form-static-wrap">
                                            {/* <Card.Text> */}

                                            <Row>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_SCHEDULERTYPE" message="Scheduler Type" /></FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedScheduler.sscheduletype === "O" ? "One Time" :
                                                            this.props.Login.masterData.SelectedScheduler.sscheduletype === "D" ? "Daily" :
                                                                this.props.Login.masterData.SelectedScheduler.sscheduletype === "W" ? "Weekly" : "Monthly"}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>


                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_STARTDATEANDTIME" message="Start Date & Time" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedScheduler &&
                                                                this.props.Login.masterData.SelectedScheduler.sstartdate !== undefined ?
                                                                this.props.Login.masterData.SelectedScheduler.sstartdate.substring(0, 10) : ""}
                                                            {"  "}
                                                            {this.props.Login.masterData.SelectedScheduler &&
                                                                this.props.Login.masterData.SelectedScheduler.sstarttime !== undefined ?
                                                                this.props.Login.masterData.SelectedScheduler.sstarttime.substring(16, 11) : ""}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                {/* <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_STARTTIME" message="Start Time" /></FormLabel>
                                                            <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedScheduler && 
                                                                this.props.Login.masterData.SelectedScheduler.sstarttime !== null ?
                                                                this.props.Login.masterData.SelectedScheduler.sstarttime.substring(19,11):""}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> */}
                                                {this.props.Login.masterData.SelectedScheduler.sscheduletype !== "O" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_ENDDATEANDTIME" message="End Date & Time" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler &&
                                                                    this.props.Login.masterData.SelectedScheduler.senddate !== undefined ?
                                                                    this.props.Login.masterData.SelectedScheduler.senddate.substring(0, 10) : ""}
                                                                {" "}
                                                                {this.props.Login.masterData.SelectedScheduler &&
                                                                    this.props.Login.masterData.SelectedScheduler.sendtime !== undefined ?
                                                                    this.props.Login.masterData.SelectedScheduler.sendtime.substring(16, 11) : ""}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> : ""}
                                                {/* {this.props.Login.masterData.SelectedScheduler.sscheduletype !== "O" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_ENDTIME" message="End Time" /></FormLabel>
                                                            <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedScheduler && 
                                                                this.props.Login.masterData.SelectedScheduler.sendtime !== null ?
                                                                this.props.Login.masterData.SelectedScheduler.sendtime.substring(19,11):""}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> :""} */}
                                                {/* {this.props.Login.masterData.SelectedScheduler.sscheduletype === "D" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_OCCURRENCE" message="Occurrence" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.noccurencenooftimes!==0?
                                                                this.props.Login.masterData.SelectedScheduler.noccurencenooftimes:"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""} */}
                                                {/* {this.props.Login.masterData.SelectedScheduler.sscheduletype === "D" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_OCCURRENCEDAYWISE" message="Occurrence Day Wise" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.noccurencedaywiseinterval!==0?
                                                                this.props.Login.masterData.SelectedScheduler.noccurencedaywiseinterval:"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""} */}
                                                {/* {this.props.Login.masterData.SelectedScheduler.sscheduletype === "D" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_OCCURRENCEHOURWISE" message="Occurrence Hour Wise" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.soccurencehourwiseinterval!=="null "?
                                                                this.props.Login.masterData.SelectedScheduler.soccurencehourwiseinterval:"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""} */}
                                                {this.props.Login.masterData.SelectedScheduler.sscheduletype === "W" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_WEEKLYSCHEDULE" message="Weekly Schedule" /></FormLabel>

                                                            <ReadOnlyText>

                                                                {this.props.Login.masterData.SelectedScheduler.nsunday !== 0 ? sweek = this.props.intl.formatMessage({ id: "IDS_SUNDAY" }) : ""}

                                                                {this.props.Login.masterData.SelectedScheduler.nmonday !== 0 ? sweek.trim() == "" ? sweek = this.props.intl.formatMessage({ id: "IDS_MONDAY" }) : sweek = ", " + this.props.intl.formatMessage({ id: "IDS_MONDAY" }) : ""}

                                                                {this.props.Login.masterData.SelectedScheduler.ntuesday !== 0 ? sweek.trim() == "" ? sweek = this.props.intl.formatMessage({ id: "IDS_TUESDAY" }) : sweek = ", " + this.props.intl.formatMessage({ id: "IDS_TUESDAY" }) : ""}

                                                                {this.props.Login.masterData.SelectedScheduler.nwednesday !== 0 ? sweek.trim() == "" ? sweek = this.props.intl.formatMessage({ id: "IDS_WEDNESDAY" }) : sweek = ", " + this.props.intl.formatMessage({ id: "IDS_WEDNESDAY" }) : ""}

                                                                {this.props.Login.masterData.SelectedScheduler.nthursday !== 0 ? sweek.trim() == "" ? sweek = this.props.intl.formatMessage({ id: "IDS_THURSDAY" }) : sweek = ", " + this.props.intl.formatMessage({ id: "IDS_THURSDAY" }) : ""}

                                                                {this.props.Login.masterData.SelectedScheduler.nfriday !== 0 ? sweek.trim() == "" ? sweek = this.props.intl.formatMessage({ id: "IDS_FRIDAY" }) : sweek = ", " + this.props.intl.formatMessage({ id: "IDS_FRIDAY" }) : ""}

                                                                {this.props.Login.masterData.SelectedScheduler.nsaturday !== 0 ? sweek.trim() == "" ? sweek = this.props.intl.formatMessage({ id: "IDS_SATURDAY" }) : sweek = ", " + this.props.intl.formatMessage({ id: "IDS_SATURDAY" }) : ""}
                                                                {/* {sweek} */}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> : ""}
                                                {/* {this.props.Login.masterData.SelectedScheduler.sscheduletype === "W" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_MONDAY" message="Monday" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nmonday !==0 ? "Active" : "-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "W" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TUESDAY" message="Tuesday" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.ntuesday !== 0? "Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "W" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_WEDNESDAY" message="Wednesday" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nwednesday !==0 ? "Active" :"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "W" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_THURSDAY" message="Thursday" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nthursday !==0 ? "Active": "-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "W" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_FRIDAY" message="Friday" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nfriday !==0 ? "Active" :"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "W" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_SATURDAY" message="Saturday" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nsaturday !==0 ? "Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""} */}
                                                {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_MONTHLYOCCURRENCETYPE" message="Monthly Occurrence Type" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                                    this.props.Login.masterData.SelectedScheduler.nmonthlyoccurrencetype === 1 ? "Exact Day" :
                                                                        this.props.Login.masterData.SelectedScheduler.nmonthlyoccurrencetype === 2 ? "1st Week" :
                                                                            this.props.Login.masterData.SelectedScheduler.nmonthlyoccurrencetype === 3 ? "2nd Week" :
                                                                                this.props.Login.masterData.SelectedScheduler.nmonthlyoccurrencetype === 4 ? "3rd Week" : "4th week" : "-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> : ""}
                                                {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" &&
                                                    this.props.Login.masterData.SelectedScheduler.nmonthlyoccurrencetype === 1 ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_EXACTDAY" message="Exactday" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nexactday !== 0 ? this.props.Login.masterData.SelectedScheduler.nexactday : "-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> : ""}
                                                {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_MONTHLYSCHEDULE" message="Monthly Schedule" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.njan !== 0 ? smonth = this.props.intl.formatMessage({ id: "IDS_JANUARY" }) : ""}
                                                                {this.props.Login.masterData.SelectedScheduler.nfeb !== 0 ? smonth.trim() === "" ? smonth = this.props.intl.formatMessage({ id: "IDS_FEBRUARY" }) : smonth = ", " + this.props.intl.formatMessage({ id: "IDS_FEBRUARY" }) : ""}
                                                                {this.props.Login.masterData.SelectedScheduler.nmar !== 0 ? smonth.trim() === "" ? smonth = this.props.intl.formatMessage({ id: "IDS_MARCH" }) : smonth = ", " + this.props.intl.formatMessage({ id: "IDS_MARCH" }) : ""}
                                                                {this.props.Login.masterData.SelectedScheduler.napr !== 0 ? smonth.trim() === "" ? smonth = this.props.intl.formatMessage({ id: "IDS_APRIL" }) : smonth = ", " + this.props.intl.formatMessage({ id: "IDS_APRIL" }) : ""}
                                                                {this.props.Login.masterData.SelectedScheduler.nmay !== 0 ? smonth.trim() === "" ? smonth = this.props.intl.formatMessage({ id: "IDS_MAY" }) : smonth = ", " + this.props.intl.formatMessage({ id: "IDS_MAY" }) : ""}
                                                                {this.props.Login.masterData.SelectedScheduler.njun !== 0 ? smonth.trim() === "" ? smonth = this.props.intl.formatMessage({ id: "IDS_JUNE" }) : smonth = ", " + this.props.intl.formatMessage({ id: "IDS_JUNE" }) : ""}
                                                                {this.props.Login.masterData.SelectedScheduler.njul !== 0 ? smonth.trim() === "" ? smonth = this.props.intl.formatMessage({ id: "IDS_JULY" }) : smonth = ", " + this.props.intl.formatMessage({ id: "IDS_JULY" }) : ""}
                                                                {this.props.Login.masterData.SelectedScheduler.naug !== 0 ? smonth.trim() === "" ? smonth = this.props.intl.formatMessage({ id: "IDS_AUGUST" }) : smonth = ", " + this.props.intl.formatMessage({ id: "IDS_AUGUST" }) : ""}
                                                                {this.props.Login.masterData.SelectedScheduler.nsep !== 0 ? smonth.trim() === "" ? smonth = this.props.intl.formatMessage({ id: "IDS_SEPTEMBER" }) : smonth = ", " + this.props.intl.formatMessage({ id: "IDS_SEPTEMBER" }) : ""}
                                                                {this.props.Login.masterData.SelectedScheduler.noct !== 0 ? smonth.trim() === "" ? smonth = this.props.intl.formatMessage({ id: "IDS_OCTOBER" }) : smonth = ", " + this.props.intl.formatMessage({ id: "IDS_OCTOBER" }) : ""}
                                                                {this.props.Login.masterData.SelectedScheduler.nnov !== 0 ? smonth.trim() === "" ? smonth = this.props.intl.formatMessage({ id: "IDS_NOVEMBER" }) : smonth = ", " + this.props.intl.formatMessage({ id: "IDS_NOVEMBER" }) : ""}
                                                                {this.props.Login.masterData.SelectedScheduler.ndec !== 0 ? smonth.trim() === "" ? smonth = this.props.intl.formatMessage({ id: "IDS_DECEMBER" }) : smonth = ", " + this.props.intl.formatMessage({ id: "IDS_DECEMBER" }) : ""}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> : ""}
                                                {/* {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_FEBRUARY" message="February" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nfeb!==0?"Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_MARCH" message="March" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nmar!==0?"Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_APRIL" message="April" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.napr!==0?"Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_MAY" message="May" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nmay!==0?"Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_JUNE" message="June" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.njun!==0?"Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_JULY" message="July" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.njul!==0?"Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_AUGUST" message="August" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.naug!==0?"Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_SEPTEMBER" message="September" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nsep!==0?"Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_OCTOBER" message="October" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.noct!==0?"Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_NOVEMBER" message="November" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nnov!==0?"Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""}
                                                    {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_DECEMBER" message="December" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.ndec!==0?"Active":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""} */}
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_REMARKS" message="Remarks" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {/* {this.props.Login.masterData.SelectedUser.sdateofjoin === null || this.props.Login.masterData.SelectedUser.sdateofjoin.length === 0 ? '-' :
                                                                    this.props.Login.masterData.SelectedUser.sdateofjoin} */}
                                                            {this.props.Login.masterData.SelectedScheduler &&
                                                                this.props.Login.masterData.SelectedScheduler.sremarks !== undefined ?
                                                                this.props.Login.masterData.SelectedScheduler.sremarks : "-"}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                {/* <Col md={12}>
                                                    <CustomTabs activeKey={"IDS_SCHEDULERTRANSACTION"}
                                                        tabDetail={this.testRETabDetail()} />


                                                </Col> */}
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div className="horizontal-line"></div>
                                                </Col>
                                            </Row>


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

            {/* Start of Modal Sideout for Scheduler Creation */}
            {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
            {
                this.props.Login.openPortal ?
                    <PortalModal>
                        <PreRegisterSlideOutModal
                            postParamList={this.postParamList}
                            PrevoiusLoginData={this.PrevoiusLoginData}
                            closeModal={this.closeModal}
                            operation={"create"}
                            screenName={"IDS_REGISTRATION"}
                            onSaveClick={this.onSaveClick}
                            validateEsign={this.validateEsign}
                            updateStore={this.props.updateStore}
                            comboComponents={this.state.comboComponents}
                            withoutCombocomponent={this.state.withoutCombocomponent}
                            userRoleControlRights={this.state.userRoleControlRights}
                            //fromDate={this.fromDate}
                            // toDate={this.toDate}
                            //  specBasedComponent={this.state.specBasedComponent}
                            mandatoryFields={[
                                { "idsName": "IDS_PRODUCTCATEGORY", "dataField": "nproductcatcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                                { "idsName": "IDS_PRODUCTNAME", "dataField": "sproductname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]}
                        />
                    </PortalModal>
                    : ""
            }
            {this.props.Login.openModal ?
                <SlideOutModal show={this.props.Login.openModal}
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
                    mandatoryFields={mandatoryFields}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign operation={this.props.Login.operation}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        :
                        <AddScheduler
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange}
                            onNumericInputOnChange={this.onNumericInputOnChange}
                            handleDateChange={this.handleDateChange}
                            schedulerTypeList={this.props.Login.schedulerTypeList || []}
                            recurringList={this.props.Login.recurringList || []}
                            monthlyTypeList={this.props.Login.monthlyTypeList || []}
                            selectedScheduler={this.props.Login.masterData.SelectedScheduler || {}}
                            operation={this.props.Login.operation}
                            userLogged={this.props.Login.userLogged}
                            inputParam={this.props.Login.inputParam}
                            actionType={this.state.actionType}
                            userInfo={this.props.Login.userInfo}

                        />}
                /> : ""}
            {/* End of Modal Sideout for Scheduler Creation */}
        </>
        );
    }

    dataStateChange = (event) => {
        this.setState({ dataState: event.dataState })
    }
    testRETabDetail = () => {
        const testTabMap = new Map();
        //let npreregno = this.props.Login.masterData.RESelectedSample ? this.props.Login.masterData.RESelectedSample.map(sample => sample.npreregno).join(",") : "-1";

        testTabMap.set("IDS_SCHEDULERTRANSACTION",
            <DataGrid
                userRoleControlRights={
                    this.state.userRoleControlRights
                }
                controlMap={this.state.controlMap}
                primaryKeyField={"nschedulartransactioncode"}
                data={
                    this.props.Login.masterData &&
                    this.props.Login.masterData.SchedulerTransaction
                }
                dataResult={process(
                    this.props.Login.masterData &&
                    (this.props.Login.masterData.SchedulerTransaction ||
                        []),
                    this.state.dataState
                )}
                dataState={this.state.dataState}
                dataStateChange={this.dataStateChange}
                extractedColumnList={this.columnList}
                inputParam={this.props.Login.inputParam}
                userInfo={this.props.Login.userInfo}
                methodUrl={this.props.Login.inputParam.methodUrl}
                pageable={true}
                scrollable={"scrollable"}
                isActionRequired={false}
                isToolBarRequired={false}
                selectedId={null}
                hideColumnFilter={false}
                //expandField={"expanded"}
                handleExpandChange={this.handleExpandChange}
            //  hasChild={true}
            //   childColumnList={this.childColumnList}
            //   childMappingField={"nschedulartransactioncode"}
            //   childList={this.props.Login.testMap || new Map()}
            />
        )
        return testTabMap;
    }
    componentDidUpdate(previousProps) {
        let isComponentUpdated = false;

        if (this.props.Login.columnList !== previousProps.Login.columnList) {
            isComponentUpdated = true;
            // this.setState({
            //     columnList: this.props.Login.columnList,
            //     childColumnList: this.props.Login.childColumnList,
            //     withoutCombocomponent: this.props.Login.withoutCombocomponent,
            //     comboComponents: this.props.Login.comboComponents
            // });

        }

        // if (this.props.Login.regparentSubSampleColumnList !== previousProps.Login.regparentSubSampleColumnList) {
        //     this.setState({
        //         regparentSubSampleColumnList: this.props.Login.regparentSubSampleColumnList,
        //         regSubSamplecomboComponents: this.props.Login.regSubSamplecomboComponents,
        //         regSubSamplewithoutCombocomponent: this.props.Login.regSubSamplewithoutCombocomponent
        //     });

        // }


        if (this.props.Login.showSaveContinue !== previousProps.Login.showSaveContinue) {
            isComponentUpdated = true;
            //this.setState({ showSaveContinue: this.props.Login.showSaveContinue });

        }
        if (this.props.Login !== previousProps.Login) {
            this.PrevoiusLoginData = previousProps
        }

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            isComponentUpdated = true;
            //this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        let userRoleControlRights;
        let controlMap;
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            //isComponentUpdated = true;
            this.setState({ userRoleControlRights, controlMap });
        }
        let nfilterScheduleType = this.state.nfilterScheduleType || {};
        let filterScheduleType = this.state.filterScheduleType || {};

        if (this.props.Login.masterData.filterScheduleType !== previousProps.Login.masterData.filterScheduleType) {
            const scheduleTypeMap = constructOptionList(this.props.Login.masterData.filterScheduleType || [], "nschedulertypecode",
                "sschedulertypename", 'nschedulertypecode', 'ascending', false);
            filterScheduleType = scheduleTypeMap.get("OptionList");
            if (this.state.nfilterScheduleType === null || this.state.nfilterScheduleType === undefined) {
                if (scheduleTypeMap.get("DefaultValue")) {
                    nfilterScheduleType = scheduleTypeMap.get("DefaultValue");
                } else if (filterScheduleType && filterScheduleType.length > 0) {
                    nfilterScheduleType = filterScheduleType[0];
                }
            }
            isComponentUpdated = true;
        } else if (this.props.Login.masterData.nfilterScheduleType !== previousProps.Login.masterData.nfilterScheduleType) {
            nfilterScheduleType = this.props.Login.masterData.nfilterScheduleType;
            isComponentUpdated = true;
        }
        let filterData;
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            filterData = this.generateBreadCrumData();
            if (this.props.Login.masterData.SelectedScheduler !== undefined &&
                this.props.Login.masterData.SelectedScheduler !== null
            ) {
                if (this.props.Login.masterData.SelectedScheduler.sscheduletype === "O") {
                    nfilterScheduleType = filterScheduleType[0];
                    
                }
                else {
                    if(filterScheduleType.length>1)
                    {
                    nfilterScheduleType = filterScheduleType[1];
                    }
                    else
                    {
                        nfilterScheduleType = filterScheduleType[0];
                    }
                }
                //isComponentUpdated = true;
                this.setState({ filterData, nfilterScheduleType });
            }
            else {
                this.setState({ filterData });
                //isComponentUpdated = true;
            }
        }
        if (isComponentUpdated) {
            this.setState({ nfilterScheduleType, filterScheduleType,selectedRecord: this.props.Login.selectedRecord,showSaveContinue: this.props.Login.showSaveContinue,
                columnList: this.props.Login.columnList,
                childColumnList: this.props.Login.childColumnList,
                withoutCombocomponent: this.props.Login.withoutCombocomponent,
                comboComponents: this.props.Login.comboComponents  });
        }
    }
    onFilterSubmit = () => {
        if (this.state.nfilterScheduleType !== undefined && this.state.nfilterScheduleType.value) {
            let inputParam = {
                inputData: {
                    nscheduletypecode: this.state.nfilterScheduleType.value,
                    userinfo: this.props.Login.userInfo,
                    nfilterScheduleType: this.state.nfilterScheduleType
                },
                classUrl: "scheduler",
                methodUrl: "SchedulerByScheduleType"
            }
            this.props.changeScheduleTypeFilter(inputParam, this.props.Login.masterData.filterScheduleType);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_TESTCATEGORYNOTAVAILABLE" }));
        }
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData) {

            breadCrumbData.push(
                {
                    "label": "IDS_SCHEDULERTYPE",
                    "value": this.props.Login.masterData.SelectedScheduler ? this.props.Login.masterData.SelectedScheduler.stempscheduleType !== "One Time" ? "Recurring" : "One Time" : ""

                },
            );
        }
        return breadCrumbData;
    }

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteScheduler("Scheduler", this.props.Login.masterData.SelectedScheduler, "delete", deleteId));
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let openPortal = this.props.Login.openPortal;

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
            openPortal = false;
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null, openPortal }
        }
        this.props.updateStore(updateInfo);

    }



    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
    }

    onComboChangeevent = (comboData, fieldName) => {
        let nfilterScheduleType = this.state.nfilterScheduleType || {}
        nfilterScheduleType = comboData;
        this.searchRef.current.value = "";
        this.setState({ nfilterScheduleType })
        // const selectedRecord = this.state.selectedRecord || {};
        // selectedRecord[fieldName] = comboData;
        // this.setState({ selectedRecord });
    }

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else if (event.target.name === "nlockmode")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.UNLOCK : transactionStatus.LOCK;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.ALL;

        }
        else {
            if (event.target.name === "noccurencenooftimes" || event.target.name === "noccurencedaywiseinterval" || event.target.name === "nexactday") {
                if (event.target.value !== "") {
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                }
                else {
                    selectedRecord[event.target.name] = event.target.value;
                }
            } else if (event.target.name === "sloginid") {
                if (event.target.value !== "") {
                    if (validateLoginId(event.target.value)) {
                        selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                    }
                }
                else {
                    selectedRecord[event.target.name] = event.target.value;
                }
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedRecord });
    }



    handleDateChange = (dateName, dateValue, sdatename) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        selectedRecord[sdatename] = dateValue;
        this.setState({ selectedRecord });
    }


    onSaveClick = (saveType, formRef) => {

        let scheduleData = {};
        scheduleData["userinfo"] = this.props.Login.userInfo;

        if (this.state.selectedRecord["nschedulertypecode"] === undefined ||
            this.state.selectedRecord["nschedulertypecode"] === null) {
            //toast.info("Please select SchedulerType");
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSCHEDULERTYPE" }));
            return;
        }

        if (this.state.selectedRecord["nschedulertypecode"].value !== 1) {

            if (this.state.selectedRecord["denddate"] === undefined ||
                this.state.selectedRecord["denddate"] === null) {
                //toast.info("Please select End Date");
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTENDDATE" }));
                return;
            }
            if (this.state.selectedRecord["dendtime"] === undefined ||
                this.state.selectedRecord["dendtime"] === null) {
                //toast.info("Please select End Time");
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTENDTIME" }));
                return;
            }
            if (this.state.selectedRecord["denddate"] !== undefined && this.state.selectedRecord["dstartdate"] !== undefined) {
                if (this.state.selectedRecord["denddate"] < this.state.selectedRecord["dstartdate"]) {
                    //toast.info("Please select End Date Greater than Start Date");
                    toast.info(this.props.intl.formatMessage({ id: "IDS_ENDDATESTARTDATE" }));
                    return;
                }
            }
            if (this.state.selectedRecord["ntyperecurringcode"].value === 1) {
                // if(this.state.selectedRecord["noccurencenooftimes"]===undefined ||
                // this.state.selectedRecord["noccurencenooftimes"]===null)
                // {
                //     toast.info("Please enter Occurrence value");
                //     return;
                // }
                // if(this.state.selectedRecord["soccurencehourwiseinterval"]===undefined ||
                // this.state.selectedRecord["soccurencehourwiseinterval"]===null)
                // {
                //     toast.info("Please select Occurrence Hour wise");
                //     return;
                // }
                // if(this.state.selectedRecord["noccurencedaywiseinterval"]===undefined ||
                // this.state.selectedRecord["noccurencedaywiseinterval"]===null)
                // {
                //     toast.info("Please enter Occurrence Day wise");
                //     return;
                // }

            }
            if (this.state.selectedRecord["ntyperecurringcode"].value === 3) {
                if (this.state.selectedRecord["nrecurringperiodcode"] === undefined) {
                    //toast.info("Please select Monthly Occurrence type");
                    toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTMONTHLYTYPE" }));
                    return;
                }

                if (this.state.selectedRecord["nrecurringperiodcode"] !== undefined &&
                    this.state.selectedRecord["nrecurringperiodcode"].value === 1 &&
                    this.state.selectedRecord["nexactday"] === undefined) {
                    //toast.info("Please enter Exact Day");
                    toast.info(this.props.intl.formatMessage({ id: "IDS_ENTEREXACT" }));
                    return;
                }
            }
        }

        let postParam = undefined;


        //add               
        scheduleData["schedulemaster"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

        this.schedulerFieldList.map(item => {
            return scheduleData["schedulemaster"][item] = this.state.selectedRecord[item]
        });
        if (this.props.Login.operation === "update") {
            scheduleData["schedulemaster"]["nschedulecode"] = this.props.Login.masterData.SelectedScheduler["nschedulecode"];
        }
        if (this.props.Login.operation === "create" &&
            this.state.selectedRecord["ntyperecurringcode"].value === 2) {
            if (this.state.selectedRecord["nsunday"] === undefined) {
                this.state.selectedRecord["nsunday"] = 1;
            }
            if (this.state.selectedRecord["nmonday"] === undefined) {
                this.state.selectedRecord["nmonday"] = 1;
            }
            if (this.state.selectedRecord["ntuesday"] === undefined) {
                this.state.selectedRecord["ntuesday"] = 1;
            }
            if (this.state.selectedRecord["nwednesday"] === undefined) {
                this.state.selectedRecord["nwednesday"] = 1;
            }
            if (this.state.selectedRecord["nthursday"] === undefined) {
                this.state.selectedRecord["nthursday"] = 1;
            }
            if (this.state.selectedRecord["nfriday"] === undefined) {
                this.state.selectedRecord["nfriday"] = 1;
            }
            if (this.state.selectedRecord["nsaturday"] === undefined) {
                this.state.selectedRecord["nsaturday"] = 1;
            }
        }

        if (this.props.Login.operation === "create" &&
            this.state.selectedRecord["ntyperecurringcode"].value === 3) {
            if (this.state.selectedRecord["njan"] === undefined) {
                this.state.selectedRecord["njan"] = 1;
            }
            if (this.state.selectedRecord["nfeb"] === undefined) {
                this.state.selectedRecord["nfeb"] = 1;
            }
            if (this.state.selectedRecord["nmar"] === undefined) {
                this.state.selectedRecord["nmar"] = 1;
            }
            if (this.state.selectedRecord["napr"] === undefined) {
                this.state.selectedRecord["napr"] = 1;
            }
            if (this.state.selectedRecord["nmay"] === undefined) {
                this.state.selectedRecord["nmay"] = 1;
            }
            if (this.state.selectedRecord["njun"] === undefined) {
                this.state.selectedRecord["njun"] = 1;
            }
            if (this.state.selectedRecord["njul"] === undefined) {
                this.state.selectedRecord["njul"] = 1;
            }
            if (this.state.selectedRecord["naug"] === undefined) {
                this.state.selectedRecord["naug"] = 1;
            }
            if (this.state.selectedRecord["nsep"] === undefined) {
                this.state.selectedRecord["nsep"] = 1;
            }
            if (this.state.selectedRecord["noct"] === undefined) {
                this.state.selectedRecord["noct"] = 1;
            }
            if (this.state.selectedRecord["nnov"] === undefined) {
                this.state.selectedRecord["nnov"] = 1;
            }
            if (this.state.selectedRecord["ndec"] === undefined) {
                this.state.selectedRecord["ndec"] = 1;
            }
        }

        scheduleData["schedulemasterweekly"] = {
            "nsunday": this.state.selectedRecord["nsunday"] ? this.state.selectedRecord["nsunday"] : 0,
            //"ndefaultrole": transactionStatus.YES, "ntransactionstatus": transactionStatus.ACTIVE
            "nmonday": this.state.selectedRecord["nmonday"] ? this.state.selectedRecord["nmonday"] : 0,
            "ntuesday": this.state.selectedRecord["ntuesday"] ? this.state.selectedRecord["ntuesday"] : 0,
            "nwednesday": this.state.selectedRecord["nwednesday"] ? this.state.selectedRecord["nwednesday"] : 0,
            "nthursday": this.state.selectedRecord["nthursday"] ? this.state.selectedRecord["nthursday"] : 0,
            "nfriday": this.state.selectedRecord["nfriday"] ? this.state.selectedRecord["nfriday"] : 0,
            "nsaturday": this.state.selectedRecord["nsaturday"] ? this.state.selectedRecord["nsaturday"] : 0,
        }

        scheduleData["schedulemastermonthly"] = {
            "nexactday": this.state.selectedRecord["nexactday"] ? this.state.selectedRecord["nexactday"] : 0,
            "nmonthlyoccurrencetype": this.state.selectedRecord["nrecurringperiodcode"] ? this.state.selectedRecord["nrecurringperiodcode"].value : 0,
            "njan": this.state.selectedRecord["njan"] ? this.state.selectedRecord["njan"] : 0,
            "nfeb": this.state.selectedRecord["nfeb"] ? this.state.selectedRecord["nfeb"] : 0,
            "nmar": this.state.selectedRecord["nmar"] ? this.state.selectedRecord["nmar"] : 0,
            "napr": this.state.selectedRecord["napr"] ? this.state.selectedRecord["napr"] : 0,
            "nmay": this.state.selectedRecord["nmay"] ? this.state.selectedRecord["nmay"] : 0,
            "njun": this.state.selectedRecord["njun"] ? this.state.selectedRecord["njun"] : 0,
            "njul": this.state.selectedRecord["njul"] ? this.state.selectedRecord["njul"] : 0,
            "naug": this.state.selectedRecord["naug"] ? this.state.selectedRecord["naug"] : 0,
            "nsep": this.state.selectedRecord["nsep"] ? this.state.selectedRecord["nsep"] : 0,
            "noct": this.state.selectedRecord["noct"] ? this.state.selectedRecord["noct"] : 0,
            "nnov": this.state.selectedRecord["nnov"] ? this.state.selectedRecord["nnov"] : 0,
            "ndec": this.state.selectedRecord["ndec"] ? this.state.selectedRecord["ndec"] : 0,
        }




        let date;
        let time;
        scheduleData["schedulemaster"]["sscheduletype"] = this.state.selectedRecord["nschedulertypecode"] ? this.state.selectedRecord["nschedulertypecode"].value === 1 ? 'O' : this.state.selectedRecord["ntyperecurringcode"].value === 1 ? 'D' : this.state.selectedRecord["ntyperecurringcode"].value === 2 ? 'W' : 'M' : 'O';
        if (scheduleData["schedulemaster"]["dstartdate"] !== undefined
            && scheduleData["schedulemaster"]["dstartdate"] !== null && scheduleData["schedulemaster"]["dstartdate"] !== "") {
            //scheduleData["schedulemaster"]["dstartdate"] = formatInputDate(scheduleData["schedulemaster"]["dstartdate"]);
            scheduleData["schedulemaster"]["dstartdate"] = formatInputDate(this.state.selectedRecord["sstartdate"]);
        }
        if (scheduleData["schedulemaster"]["denddate"] !== undefined
            && scheduleData["schedulemaster"]["denddate"] !== null && scheduleData["schedulemaster"]["denddate"] !== "") {
            //scheduleData["schedulemaster"]["denddate"] = formatInputDate(scheduleData["schedulemaster"]["denddate"]);
            scheduleData["schedulemaster"]["denddate"] = formatInputDate(this.state.selectedRecord["senddate"]);
        }
        else {
            scheduleData["schedulemaster"]["denddate"] = scheduleData["schedulemaster"]["dstartdate"];
        }
        if (scheduleData["schedulemaster"]["dstarttime"] !== undefined
            && scheduleData["schedulemaster"]["dstarttime"] !== null && scheduleData["schedulemaster"]["dstarttime"] !== "") {
            //scheduleData["schedulemaster"]["dstarttime"] = formatInputDate(scheduleData["schedulemaster"]["dstarttime"]);
            date = formatInputDate(this.state.selectedRecord["sstartdate"]);
            date = date.substring(0, 10);
            time = formatInputDate(this.state.selectedRecord["sstarttime"]);
            time = time.substring(19, 11);
            date = date + "T" + time + "Z";
            //scheduleData["schedulemaster"]["dstarttime"] = formatInputDate(this.state.selectedRecord["sstarttime"]);
            scheduleData["schedulemaster"]["dstarttime"] = date;//formatInputDate(date);
        }
        if (scheduleData["schedulemaster"]["dendtime"] !== undefined
            && scheduleData["schedulemaster"]["dendtime"] !== null && scheduleData["schedulemaster"]["dendtime"] !== "") {
            //scheduleData["schedulemaster"]["dendtime"] = formatInputDate(scheduleData["schedulemaster"]["dendtime"]);
            //scheduleData["schedulemaster"]["dendtime"] = formatInputDate(this.state.selectedRecord["sendtime"]);
            date = formatInputDate(this.state.selectedRecord["senddate"]);
            date = date.substring(0, 10);
            time = formatInputDate(this.state.selectedRecord["sendtime"]);
            time = time.substring(19, 11);
            date = date + "T" + time + "Z";
            //scheduleData["schedulemaster"]["dstarttime"] = formatInputDate(this.state.selectedRecord["sstarttime"]);
            scheduleData["schedulemaster"]["dendtime"] = date;
        }
        else {
            scheduleData["schedulemaster"]["dendtime"] = scheduleData["schedulemaster"]["dstarttime"];
        }
        if (scheduleData["schedulemaster"]["soccurencehourwiseinterval"] !== undefined
            && scheduleData["schedulemaster"]["soccurencehourwiseinterval"] !== null && scheduleData["schedulemaster"]["soccurencehourwiseinterval"] !== "" &&
            scheduleData["schedulemaster"]["soccurencehourwiseinterval"] !== "null ") {
            let shour;
            if(scheduleData["schedulemaster"]["soccurencehourwiseinterval"]!=="00:00")
            {
            shour = formatInputDate(scheduleData["schedulemaster"]["soccurencehourwiseinterval"]);
            //scheduleData["schedulemaster"]["soccurencehourwiseinterval"] =shour.substring(shour.indexOf('T'),5);
            scheduleData["schedulemaster"]["soccurencehourwiseinterval"] = shour.substring(16, 11);
            }
        }
        scheduleData["schedulemaster"]["soccurencehourwiseinterval"] = "00:00";

        scheduleData["schedulemaster"]["ntzstartdatetimezone"] = this.state.selectedRecord[
            "ntzstartdatetimezone"
          ]
            ? this.state.selectedRecord["ntzstartdatetimezone"].value ||
            this.props.Login.userInfo.ntimezonecode
            : this.props.Login.userInfo.ntimezonecode;
        scheduleData["schedulemaster"]["ntzenddatetimezone"] = this.state.selectedRecord[
                "ntzenddatetimezone"
              ]
                ? this.state.selectedRecord["ntzenddatetimezone"].value ||
                this.props.Login.userInfo.ntimezonecode
                : this.props.Login.userInfo.ntimezonecode;

                scheduleData["schedulemaster"]["ntzstarttimetimezone"] = this.state.selectedRecord[
                    "ntzstarttimetimezone"
                  ]
                    ? this.state.selectedRecord["ntzstarttimetimezone"].value ||
                    this.props.Login.userInfo.ntimezonecode
                    : this.props.Login.userInfo.ntimezonecode;
                    scheduleData["schedulemaster"]["ntzendtimetimezone"] = this.state.selectedRecord[
                        "ntzendtimetimezone"
                      ]
                        ? this.state.selectedRecord["ntzendtimetimezone"].value ||
                        this.props.Login.userInfo.ntimezonecode
                        : this.props.Login.userInfo.ntimezonecode;


                //         scheduleData["schedulemaster"]["stzstartdatetimezone"] = this.state.selectedRecord[
                //     "stzstartdatetimezone"
                //   ]
                //     ? this.state.selectedRecord["stzstartdatetimezone"].value ||
                //     this.props.Login.userInfo.ntimezonecode
                //     : this.props.Login.userInfo.ntimezonecode;
                //     scheduleData["schedulemaster"]["stzenddatetimezone"] = this.state.selectedRecord[
                //         "stzenddatetimezone"
                //       ]
                //         ? this.state.selectedRecord["stzenddatetimezone"].value ||
                //         this.props.Login.userInfo.ntimezonecode
                //         : this.props.Login.userInfo.ntimezonecode;

                //         scheduleData["schedulemaster"]["stzstarttimetimezone"] = this.state.selectedRecord[
                //             "stzstarttimetimezone"
                //           ]
                //             ? this.state.selectedRecord["stzstarttimetimezone"].value ||
                //             this.props.Login.userInfo.ntimezonecode
                //             : this.props.Login.userInfo.ntimezonecode;
                //             scheduleData["schedulemaster"]["stzendtimetimezone"] = this.state.selectedRecord[
                //                 "stzendtimetimezone"
                //               ]
                //                 ? this.state.selectedRecord["stzendtimetimezone"].value ||
                //                 this.props.Login.userInfo.ntimezonecode
                //                 : this.props.Login.userInfo.ntimezonecode;

        // const controlMaster = [{ncontrolcode:517, scontrolname:'UserImage', ssubfolder:"users"},
        //                         {ncontrolcode:518, scontrolname:'SignImage', ssubfolder:""}]



        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Scheduler",
            inputData: { scheduleData, userinfo: this.props.Login.userInfo },
            //formData: formData,
            //isFileupload: true,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef,
            isClearSearch: this.props.Login.isClearSearch
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



    deleteUserFile = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }



    deleteScheduler = (methodUrl, selectedScheduler, operation, ncontrolCode) => {
        if (this.props.Login.masterData.SelectedScheduler.ntransactionstatus === transactionStatus.DRAFT) {
            {

                const postParam = {
                    inputListName: "Scheduler", selectedObject: "SelectedScheduler",
                    primaryKeyField: "nschedulecde",
                    primaryKeyValue: selectedScheduler.nschedulecode,
                    fetchUrl: "scheduler/getScheduler",
                    fecthInputObject: { userinfo: this.props.Login.userInfo },
                }

                const inputParam = {
                    classUrl: this.props.Login.inputParam.classUrl,
                    methodUrl, postParam,
                    inputData: {
                        "userinfo": this.props.Login.userInfo,
                        "scheduler": selectedScheduler
                    },
                    operation,
                    isClearSearch: this.props.Login.isClearSearch
                }

                const masterData = this.props.Login.masterData;

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData },
                            openModal: true, screenName: "IDS_SCHEDULER", operation
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, masterData, "openModal");
                }
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTODELETE" }));
        }
    }

    onApproveClick = (screenName, operation, primaryKeyName, primaryKeyValue, ncontrolCode) => {
        if (this.props.Login.masterData.SelectedScheduler.ntransactionstatus === transactionStatus.DRAFT) {
            const approveId = this.state.controlMap.has("ApproveScheduler") && this.state.controlMap.get("ApproveScheduler").ncontrolcode
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            //add               
            let postParam = undefined;
            inputData["scheduler"] = { "nschedulecode": this.props.Login.masterData.SelectedScheduler.nschedulecode ? this.props.Login.masterData.SelectedScheduler.nschedulecode : "" };
            inputData["scheduler"] = this.props.Login.masterData.SelectedScheduler;
            postParam = { inputListName: "Scheduler", selectedObject: "SelectedScheduler", primaryKeyField: "nschedulecode" };
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "Scheduler",
                inputData: inputData,
                operation: "approve", postParam
            }
            let saveType;

            const masterData = this.props.Login.masterData;

            const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, approveId);
            if (esignNeeded) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }

        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOAPPROVE" }));
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
        this.searchRef.current.value = "";

        const inputParam = {
            //inputData: { "userinfo": this.props.Login.userInfo, sscheduletype: this.state.nfilterScheduleType ? this.state.nfilterScheduleType.label : null },
            inputData: { "userinfo": this.props.Login.userInfo, sscheduletype: this.props.Login.masterData.nfilterScheduleType ? this.props.Login.masterData.nfilterScheduleType.label : null },
            classUrl: "scheduler",
            methodUrl: "Scheduler",
            displayName: "IDS_SCHEDULER",
            userInfo: this.props.Login.userInfo,
            isClearSearch: this.props.Login.isClearSearch,


        };

        this.props.callService(inputParam);
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,
    updateStore, getSchedulerDetail, getSchedulerComboService, changeScheduleTypeFilter, getUserMultiRoleComboDataService,
    getUserMultiDeputyComboDataService, getUserSiteDetail, getUserSiteComboService, filterColumnData, getPreviewTemplate
})(injectIntl(Scheduler));

