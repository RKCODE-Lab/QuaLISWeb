import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { injectIntl } from 'react-intl';
import { Row, Col, Card, FormGroup } from 'react-bootstrap';

import {
    callService, crudMaster, validateEsignCredential, updateStore, getGrapicalSchedulerViewDetail,
    getSchedulerComboService, changeGrapicalScheduleTypeFilter,filterColumnData
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { getControlMap,constructOptionList } from '../../components/CommonScript';
//import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { transactionStatus } from '../../components/Enumeration';
import ListMaster from '../../components/list-master/list-master.component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
import {ContentPanel } from '../../components/App.styles';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import ReactTooltip from 'react-tooltip';
import GrapicalScheduleTypeFilter from './GrapicalScheduleTypeFilter';
import { Scheduler, DayView,WeekView, MonthView } from '@progress/kendo-react-scheduler';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class GraphicalSchedulerView extends React.Component {
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
            userRoleControlRights: [],
            controlMap: new Map(),
            isClearSearch: false,
            displayDate:new Date(Date.UTC(currentYear,10 , 27)),
            timezone:"Etc/UTC",
            data: this.props.Login.masterData.SelectedSchedulerView!==undefined?this.props.Login.masterData.SelectedSchedulerView:""
        };
        this.searchRef = React.createRef();
       
        this.confirmMessage = new ConfirmMessage();

        this.schedulerFieldList = ['stitle', 'sscheduletype'];

        this.searchFieldList = ['stitle', 'sscheduletype'];
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

    handleDateChange = (event) => {
        this.setState({
            displayDate: event.value,
        });
      };

    render() {

        //let userStatusCSS = "outline-success"//"outline-secondary";
        let userStatusCSS = "outline-secondary";
        if (this.props.Login.masterData.SelectedSchedulerView && this.props.Login.masterData.SelectedSchedulerView.ntransactionstatus === transactionStatus.APPROVED) {
            userStatusCSS = "outline-success";
        }
        let activeIconCSS = "fa fa-check"
        
         const addId = this.state.controlMap.has("AddScheduler") && this.state.controlMap.get("AddScheduler").ncontrolcode;
        // const editId = this.state.controlMap.has("EditScheduler") && this.state.controlMap.get("EditScheduler").ncontrolcode;
        // const deleteId = this.state.controlMap.has("DeleteScheduler") && this.state.controlMap.get("DeleteScheduler").ncontrolcode;
        // const approveId = this.state.controlMap.has("ApproveScheduler") && this.state.controlMap.get("ApproveScheduler").ncontrolcode;
        

        const filterParam = {
            inputListName: "SchedulerView", selectedObject: "SelectedSchedulerView", primaryKeyField: "nschedulecode",
            fetchUrl: "graphicalschedulerview/getGraphicalSchedulerView", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList,
            sscheduletype:this.state.nfilterScheduleType ? this.state.nfilterScheduleType.label:null
        };

        const addParam = {
            screenName: "IDS_SCHEDULER", operation: "create", primaryKeyName: "nschedulecode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: addId,
            nfilterScheduleType:this.state.nfilterScheduleType
        }

        // const editParam = {
        //     screenName: "IDS_SCHEDULER", operation: "update", primaryKeyName: "nschedulecode",
        //     masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
        //     ncontrolcode: editId, inputListName: "Scheduler", selectedObject: "SelectedScheduler"
        // };

        // const approveParam = {
        //     screenName: "IDS_SCHEDULER", operation: "update", primaryKeyName: "nschedulecode",
        //     masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
        //     ncontrolcode: approveId, inputListName: "Scheduler", selectedObject: "SelectedScheduler"
        // };
       

        // const mandatoryFields = [{"idsName": "IDS_SCHEDULERNAME", "dataField": "sschedulename" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
        //                         //{ "idsName": "IDS_SCHEDULERTYPE", "dataField": "sscheduletype" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
        //                         //{ "idsName": "IDS_OCCURRENCE", "dataField": "noccurencenooftimes" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
        //                         //{ "idsName": "IDS_OCCURRENCEDAYWISE", "dataField": "noccurencedaywiseinterval", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
        //                         //{ "idsName": "IDS_OCCURRENCEHOURWISE", "dataField": "soccurencehourwiseinterval" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
        //                         //{ "idsName": "IDS_MONTHLYOCCURRENCETYPE", "dataField": "nmonthlyoccurrencetype" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
        //                         { "idsName": "IDS_STARTDATE", "dataField": "dstartdate" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
        //                         { "idsName": "IDS_STARTTIME", "dataField": "dstarttime" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
        //                         ];
        const breadCrumbData = this.state.filterData || [];
        return (<>
            {/* Start of get display*/}
            
            <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb">
            {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                <Row noGutters>
                    <Col md={4}>
                        {/* <Row noGutters>
                            <Col md={12}> */}
                            {/* <div className="list-fixed-wrap"> */}
                                <ListMaster
                                    screenName={this.props.intl.formatMessage({ id: "IDS_GRAPHICALSCHDULERVIEW" })}
                                    masterData={this.props.Login.masterData}
                                    userInfo={this.props.Login.userInfo}
                                    masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.SchedulerView}
                                    getMasterDetail={(scheduler) => this.props.getGrapicalSchedulerViewDetail(scheduler,this.props.Login.userInfo, this.props.Login.masterData,this.state.nfilterScheduleType.label)}
                                    selectedMaster={this.props.Login.masterData.SelectedSchedulerView}
                                    primaryKeyField="nschedulecode"
                                    mainField="stitle"
                                    firstField="sscheduletype"
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
                                            <GrapicalScheduleTypeFilter
                                            filterScheduleType={this.state.filterScheduleType || []}
                                                nfilterScheduleType={this.state.nfilterScheduleType || {}}
                                                onComboChange={this.onComboChangeevent}
                                            />
                                    }
                                ]}
                                />
                            {/* </div>
                        </Col></Row> */}
                    </Col>
                    <Col md={8}>
                        {/* <Row>
                            <Col md={12}> */}
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.SchedulerView && this.props.Login.masterData.SchedulerView.length > 0 && this.props.Login.masterData.SelectedSchedulerView ?
                                        <>
                                            <Card.Header>
                                                <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" />
                                                <Card.Title className="product-title-main">
                                                    
                                                    {this.props.Login.masterData.SelectedSchedulerView &&
                                                                    this.props.Login.masterData.SelectedSchedulerView.stitle !== undefined ?
                                                                    this.props.Login.masterData.SelectedSchedulerView.stitle : ""}
                                                </Card.Title>
                                                <Card.Subtitle>
                                                    <div className="d-flex product-category">
                                                        <h2 className="product-title-sub flex-grow-1">

                                                            <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                                {activeIconCSS !== "" ? <i class="fas fa-check "></i> : ""}
                                                                {/* {this.props.Login.masterData.SelectedScheduler.nstatus === 1 ? "DRAFT": "Approved"} */}
                                                                {this.props.Login.masterData.SelectedSchedulerView &&
                                                                    this.props.Login.masterData.SelectedSchedulerView.sscheduletype !== undefined ?
                                                                    this.props.Login.masterData.SelectedSchedulerView.sscheduletype : ""}
                                                                {" "}
                                                                {/*{activeIconCSS}  <FormattedMessage id= {this.props.Login.masterData.SelectedUser.sactivestatus}/> */}

                                                            </span>
                                                        </h2>
                                                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                        {/* <div className="d-inline">
                                                            <Nav.Link name="editScheduler" hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                className="btn btn-circle outline-grey mr-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                data-for="tooltip_list_wrap"
                                                                onClick={() => this.props.getSchedulerComboService(editParam)}
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </Nav.Link>

                                                            <Nav.Link name="deleteScheduler" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                data-for="tooltip_list_wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                onClick={() => this.ConfirmDelete(deleteId)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                               
                                                            </Nav.Link>
                                                            <Nav.Link name="ApproveScheduler" hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                className="btn btn-circle outline-grey mr-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                data-for="tooltip_list_wrap"
                                                                onClick={() => this.onApproveClick("Scheduler", "approve", "nschedulecode", this.props.Login.masterData.SelectedScheduler.nschedulecode, approveId)}
                                                            >
                                                                <FontAwesomeIcon icon={faThumbsUp} />
                                                            </Nav.Link>
                                                            
                                                            
                                                        </div> */}
                                                        {/* </Tooltip> */}
                                                    </div>

                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body className="form-static-wrap">
                                                {/* <Card.Text> */}

                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            {/* <FormLabel><FormattedMessage id="IDS_SCHEDULERTYPE" message="Scheduler Type" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedScheduler.sscheduletype==="O"?"One Time":
                                                            this.props.Login.masterData.SelectedScheduler.sscheduletype==="D"?"Daily":
                                                            this.props.Login.masterData.SelectedScheduler.sscheduletype==="W"?"Weekly":"Monthly"}</ReadOnlyText> */}

{/* onDataChange={this.handleDataChange} */}
<Scheduler data={this.state.data} date={this.state.displayDate}
              onDateChange={this.handleDateChange} timezone={this.state.timezone}
                 editable={{
      add: true,
      remove: true,
      drag: true,
      resize: true,
      
      select: true,
      edit: true
     }} >
          {/* <TimelineView /> defaultDate={this.state.displayDate}> */}
          <DayView numberOfDays={3} />
          <WeekView />
          <MonthView />
        </Scheduler>;

                                                        </FormGroup>
                                                    </Col>
                                                    

                                                    {/* <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_STARTDATEANDTIME" message="Start Date & Time" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler && 
                                                                this.props.Login.masterData.SelectedScheduler.sstartdate !== null ?
                                                                this.props.Login.masterData.SelectedScheduler.sstartdate.substring(0,10):""}
                                                                {"  "}
                                                                {this.props.Login.masterData.SelectedScheduler && 
                                                                this.props.Login.masterData.SelectedScheduler.sstarttime !== null ?
                                                                this.props.Login.masterData.SelectedScheduler.sstarttime.substring(16,11):""}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> */}

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
                                                    {/* {this.props.Login.masterData.SelectedScheduler.sscheduletype !== "O" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_ENDDATEANDTIME" message="End Date & Time" /></FormLabel>
                                                            <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedScheduler && 
                                                                this.props.Login.masterData.SelectedScheduler.senddate !== null ?
                                                                this.props.Login.masterData.SelectedScheduler.senddate.substring(0,10):""}
                                                                {" "}
                                                                {this.props.Login.masterData.SelectedScheduler && 
                                                                this.props.Login.masterData.SelectedScheduler.sendtime !== null ?
                                                                this.props.Login.masterData.SelectedScheduler.sendtime.substring(16,11):""}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> :""} */}
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
                                                    {/* {this.props.Login.masterData.SelectedScheduler.sscheduletype === "W" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_WEEKLYSCHEDULE" message="Weekly Schedule" /></FormLabel>
                                                            
                                                            <ReadOnlyText>
                                                           
                                                                {this.props.Login.masterData.SelectedScheduler.nsunday !== 0 ? sweek=this.props.intl.formatMessage({ id:"IDS_SUNDAY"}):""}
                                                            
                                                            {this.props.Login.masterData.SelectedScheduler.nmonday !==0 ? sweek.trim()==""?sweek= this.props.intl.formatMessage({ id:"IDS_MONDAY"}):sweek=", "+this.props.intl.formatMessage({ id:"IDS_MONDAY"}) : ""}
                                                            
                                                            {this.props.Login.masterData.SelectedScheduler.ntuesday !== 0?sweek.trim()==""?sweek= this.props.intl.formatMessage({ id:"IDS_TUESDAY"}):sweek=", "+this.props.intl.formatMessage({ id:"IDS_TUESDAY"}) :""}
                                                            
                                                            {this.props.Login.masterData.SelectedScheduler.nwednesday !==0 ?sweek.trim()==""?sweek= this.props.intl.formatMessage({ id:"IDS_WEDNESDAY"}):sweek=", "+this.props.intl.formatMessage({ id:"IDS_WEDNESDAY"})   :""}
                                                            
                                                            {this.props.Login.masterData.SelectedScheduler.nthursday !==0 ?sweek.trim()==""?sweek= this.props.intl.formatMessage({ id:"IDS_THURSDAY"}):sweek=", "+this.props.intl.formatMessage({ id:"IDS_THURSDAY"}) : ""}
                                                            
                                                            {this.props.Login.masterData.SelectedScheduler.nfriday !==0 ?sweek.trim()==""?sweek= this.props.intl.formatMessage({ id:"IDS_FRIDAY"}):sweek=", "+this.props.intl.formatMessage({ id:"IDS_FRIDAY"})  :""}
                                                            
                                                            {this.props.Login.masterData.SelectedScheduler.nsaturday !==0 ?sweek.trim()==""?sweek= this.props.intl.formatMessage({ id:"IDS_SATURDAY"}):sweek=", "+this.props.intl.formatMessage({ id:"IDS_SATURDAY"}) :""}
                                                            
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""} */}
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
                                                    {/* {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_MONTHLYOCCURRENCETYPE" message="Monthly Occurrence Type" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.sscheduletype==="M"?
                                                                this.props.Login.masterData.SelectedScheduler.nmonthlyoccurrencetype === 1?"Exact Day":
                                                                this.props.Login.masterData.SelectedScheduler.nmonthlyoccurrencetype===2?"1st Week":
                                                                this.props.Login.masterData.SelectedScheduler.nmonthlyoccurrencetype===3?"2nd Week":
                                                                this.props.Login.masterData.SelectedScheduler.nmonthlyoccurrencetype===4?"3rd Week":"4th week":"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""} */}
                                                    {/* {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" &&
                                                    this.props.Login.masterData.SelectedScheduler.nmonthlyoccurrencetype === 1 ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_EXACTDAY" message="Exactday" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.nexactday !==0?this.props.Login.masterData.SelectedScheduler.nexactday:"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""} */}
                                                    {/* {this.props.Login.masterData.SelectedScheduler.sscheduletype === "M" ?
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_MONTHLYSCHEDULE" message="Monthly Schedule" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedScheduler.njan !==0 ? smonth= this.props.intl.formatMessage({ id:"IDS_JANUARY"}):""}
                                                                {this.props.Login.masterData.SelectedScheduler.nfeb!==0?smonth.trim()===""?smonth= this.props.intl.formatMessage({ id:"IDS_FEBRUARY"}):smonth=", "+ this.props.intl.formatMessage({ id:"IDS_FEBRUARY"}) :""}
                                                                {this.props.Login.masterData.SelectedScheduler.nmar!==0?smonth.trim()===""?smonth=this.props.intl.formatMessage({ id:"IDS_MARCH"}):smonth=", "+this.props.intl.formatMessage({ id:"IDS_MARCH"}):""}
                                                                {this.props.Login.masterData.SelectedScheduler.napr!==0?smonth.trim()===""?smonth=this.props.intl.formatMessage({ id:"IDS_APRIL"}):smonth=", "+this.props.intl.formatMessage({ id:"IDS_APRIL"}):""}
                                                                {this.props.Login.masterData.SelectedScheduler.nmay!==0?smonth.trim()===""?smonth=this.props.intl.formatMessage({ id:"IDS_MAY"}):smonth=", "+this.props.intl.formatMessage({ id:"IDS_MAY"}):""}
                                                                {this.props.Login.masterData.SelectedScheduler.njun!==0?smonth.trim()===""?smonth=this.props.intl.formatMessage({ id:"IDS_JUNE"}):smonth=", "+this.props.intl.formatMessage({ id:"IDS_JUNE"}):""}
                                                                {this.props.Login.masterData.SelectedScheduler.njul!==0?smonth.trim()===""?smonth=this.props.intl.formatMessage({ id:"IDS_JULY"}):smonth=", "+this.props.intl.formatMessage({ id:"IDS_JULY"}):""}
                                                                {this.props.Login.masterData.SelectedScheduler.naug!==0?smonth.trim()===""?smonth=this.props.intl.formatMessage({ id:"IDS_AUGUST"}):smonth=", "+this.props.intl.formatMessage({ id:"IDS_AUGUST"}):""}
                                                                {this.props.Login.masterData.SelectedScheduler.nsep!==0?smonth.trim()===""?smonth=this.props.intl.formatMessage({ id:"IDS_SEPTEMBER"}):smonth=", "+this.props.intl.formatMessage({ id:"IDS_SEPTEMBER"}):""}
                                                                {this.props.Login.masterData.SelectedScheduler.noct!==0?smonth.trim()===""?smonth=this.props.intl.formatMessage({ id:"IDS_OCTOBER"}):smonth=", "+this.props.intl.formatMessage({ id:"IDS_OCTOBER"}):""}
                                                                {this.props.Login.masterData.SelectedScheduler.nnov!==0?smonth.trim()===""?smonth=this.props.intl.formatMessage({ id:"IDS_NOVEMBER"}):smonth=", "+this.props.intl.formatMessage({ id:"IDS_NOVEMBER"}):""}
                                                                {this.props.Login.masterData.SelectedScheduler.ndec!==0?smonth.trim()===""?smonth=this.props.intl.formatMessage({ id:"IDS_DECEMBER"}):smonth=", "+this.props.intl.formatMessage({ id:"IDS_DECEMBER"}):""}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>:""} */}
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
                                                    {/* <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_REMARKS" message="Remarks" /></FormLabel>
                                                            <ReadOnlyText>
                                                                
                                                                    {this.props.Login.masterData.SelectedScheduler && 
                                                                    this.props.Login.masterData.SelectedScheduler.sremarks.trim()!=="null"?
                                                                    this.props.Login.masterData.SelectedScheduler.sremarks.trim():"-"}
                                                            </ReadOnlyText>
                                                        </FormGroup>
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
            {/* {this.props.Login.openModal ?
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
                /> : ""} */}
            {/* End of Modal Sideout for Scheduler Creation */}
        </>
        );
    }

    componentDidUpdate(previousProps) {
        let isComponentUpdated = false;
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
        let nfilterScheduleType = this.state.nfilterScheduleType || {};
        let filterScheduleType = this.state.filterScheduleType || {};

        if (this.props.Login.masterData.filterGrapicalScheduleType !== previousProps.Login.masterData.filterGrapicalScheduleType) {
            const scheduleTypeMap = constructOptionList(this.props.Login.masterData.filterGrapicalScheduleType || [], "nschedulecode",
                "sscheduletype", 'nschedulecode', 'ascending', false);
                filterScheduleType = scheduleTypeMap.get("OptionList");
        if(this.state.nfilterScheduleType===null || this.state.nfilterScheduleType===undefined)
        {
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
        if (isComponentUpdated) {
            this.setState({ nfilterScheduleType, filterScheduleType });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            // if (this.props.Login.masterData.SelectedScheduler !== undefined) {
            //     if(this.props.Login.masterData.SelectedScheduler.sscheduletype==="O")
            //     {
            //         nfilterScheduleType = filterScheduleType[0];
            //     }
            //     else
            //     {
            //         nfilterScheduleType = filterScheduleType[1];
            //     }
                
            //     this.setState({ filterData,nfilterScheduleType });
            // }
            //else
            //{
            this.setState({ filterData });
            //}
        }


        let data=[];
        //let tempdate;
        if(this.props.Login.masterData.SelectedSchedulerView !== null &&
            this.props.Login.masterData.SelectedSchedulerView!==undefined)
        {
          if (this.props.Login.masterData.SelectedSchedulerView !== previousProps.Login.masterData.SelectedSchedulerView) {
        //for(let i =0;i<this.props.Login.masterData.selectedScheduler.length;i++)
        //{
          data.push(this.props.Login.masterData.SelectedSchedulerView.jsondata);
        //}
        
      
    
       data = data.map(dataItem => ({
        id: dataItem.id,
        start: parseAdjust(dataItem.start),
        tempdate:parseAdjust(dataItem.start),
        startTimezone: dataItem.startTimezone,
        end: parseAdjust(dataItem.end),
        endTimezone: dataItem.endTimezone,
        isAllDay: dataItem.isAllDay,
        title: dataItem.title,
        description: dataItem.description,
        recurrenceRule: dataItem.recurrenceRule,
        recurrenceId: dataItem.recurrenceID,
        recurrenceExceptions: dataItem.recurrenceException,
        roomId: dataItem.roomID,
        ownerID: dataItem.TaskID,
        personId: dataItem.TaskID
      }))
      //let tempdate = new Date(Date.UTC(data[0].start.getFullYear(),data[0].start.getMonth() , data[0].start.getDate()));
      //let tempdate = new Date(Date.UTC(data[0].start.getFullYear(),10 , 27));
      //tempdate=parseAdjust(tempdate);
    //   data[0].tempdate=data[0].tempdate.replace("T","");
    //   data[0].tempdate=data[0].tempdate.replace("Z","");
    //   data[0].tempdate=parseAdjust(data[0].tempdate);
      this.setState({data,displayDate:data[0].tempdate});
        }
      }

    }
    onFilterSubmit = () => {
        if (this.state.nfilterScheduleType.label) {
            let inputParam = {
                inputData: {
                    sscheduletype: this.state.nfilterScheduleType.label,
                    userinfo: this.props.Login.userInfo,
                    nfilterScheduleType: this.state.nfilterScheduleType
                },
                classUrl: "graphicalschedulerview",
                methodUrl: "GraphicalSchedulerByScheduleType"
            }
            this.props.changeGrapicalScheduleTypeFilter(inputParam, this.props.Login.masterData.filterScheduleType);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_TESTCATEGORYNOTAVAILABLE" }));
        }
    }
    
    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData ) {

            breadCrumbData.push(
                {
                    "label": "IDS_SCHEDULERTYPE",
                    "value": this.props.Login.masterData.SelectedSchedulerView && 
                    this.props.Login.masterData.SelectedSchedulerView.sscheduletype !== undefined ? this.props.Login.masterData.SelectedSchedulerView.sscheduletype: "NA"

                },
            );
        }
        return breadCrumbData;
    }

    // ConfirmDelete = (deleteId) => {
    //     this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
    //         this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
    //         () => this.deleteScheduler("Scheduler", this.props.Login.masterData.SelectedScheduler, "delete", deleteId));
    // }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" ) {
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
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    

    // onComboChange = (comboData, fieldName) => {
    //     const selectedRecord = this.state.selectedRecord || {};
    //     selectedRecord[fieldName] = comboData;
    //     this.setState({ selectedRecord });
    // }

    onComboChangeevent = (comboData, fieldName) => {
        let nfilterScheduleType = this.state.nfilterScheduleType || {}
        nfilterScheduleType = comboData;
        this.searchRef.current.value = "";
        this.setState({ nfilterScheduleType })
        // const selectedRecord = this.state.selectedRecord || {};
        // selectedRecord[fieldName] = comboData;
        // this.setState({ selectedRecord });
    }

    // onNumericInputOnChange = (value, name) => {
    //     const selectedRecord = this.state.selectedRecord || {};
    //     selectedRecord[name] = value;
    //     this.setState({ selectedRecord });
    // }

    // onInputOnChange = (event) => {
    //     const selectedRecord = this.state.selectedRecord || {};

    //     if (event.target.type === 'checkbox') {
    //         if (event.target.name === "ntransactionstatus")
    //             selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
    //         else if (event.target.name === "nlockmode")
    //             selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.UNLOCK : transactionStatus.LOCK;
    //         else
    //             selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.ALL;

    //     }
    //     else {
    //         if (event.target.name === "noccurencenooftimes" || event.target.name === "noccurencedaywiseinterval" || event.target.name ===  "nexactday") {
    //             if (event.target.value !== "") {
    //                 event.target.value = validatePhoneNumber(event.target.value);
    //                 selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
    //             }
    //             else {
    //                 selectedRecord[event.target.name] = event.target.value;
    //             }
    //         } else if (event.target.name === "sloginid") {
    //             if (event.target.value !== "") {
    //                 if (validateLoginId(event.target.value)) {
    //                     selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
    //                 }
    //             }
    //             else {
    //                 selectedRecord[event.target.name] = event.target.value;
    //             }
    //         } else {
    //             selectedRecord[event.target.name] = event.target.value;
    //         }
    //     }
    //     this.setState({ selectedRecord });
    // }

    

    // handleDateChange = (dateName, dateValue,sdatename) => {
    //     const { selectedRecord } = this.state;
    //     selectedRecord[dateName] = dateValue;
    //     selectedRecord[sdatename] = dateValue;
    //     this.setState({ selectedRecord });
    // }

    
//     onSaveClick = (saveType, formRef) => {

//         let scheduleData = {};
//         scheduleData["userinfo"] = this.props.Login.userInfo;

//         if(this.state.selectedRecord["nschedulertypecode"]===undefined ||
//         this.state.selectedRecord["nschedulertypecode"]===null)
//         {
//             toast.info("Please select SchedulerType");
//             return;
//         }

//         if(this.state.selectedRecord["nschedulertypecode"].value!==1)
//         {
            
//             if(this.state.selectedRecord["denddate"]===undefined || 
//             this.state.selectedRecord["denddate"]===null)
//             {
//                 toast.info("Please select END Date");
//                 return;
//             }
//             if(this.state.selectedRecord["dendtime"]===undefined || 
//             this.state.selectedRecord["dendtime"]===null)
//             {
//                 toast.info("Please select END Time");
//                 return;
//             }
//             if(this.state.selectedRecord["denddate"]!==undefined && this.state.selectedRecord["dstartdate"]!==undefined)
//             {
//                 if(this.state.selectedRecord["denddate"] < this.state.selectedRecord["dstartdate"])
//                 {
//                 toast.info("Please select END Date Greater than Start Date");
//                 return;
//                 }
//             }
//             if(this.state.selectedRecord["ntyperecurringcode"].value===1)
//             {
//                 if(this.state.selectedRecord["noccurencenooftimes"]===undefined ||
//                 this.state.selectedRecord["noccurencenooftimes"]===null)
//                 {
//                     toast.info("Please enter Occurrence value");
//                     return;
//                 }
//                 if(this.state.selectedRecord["soccurencehourwiseinterval"]===undefined ||
//                 this.state.selectedRecord["soccurencehourwiseinterval"]===null)
//                 {
//                     toast.info("Please select Occurrence Hour wise");
//                     return;
//                 }
//                 if(this.state.selectedRecord["noccurencedaywiseinterval"]===undefined ||
//                 this.state.selectedRecord["noccurencedaywiseinterval"]===null)
//                 {
//                     toast.info("Please enter Occurrence Day wise");
//                     return;
//                 }

//             }
//             if(this.state.selectedRecord["ntyperecurringcode"].value===3)
//             {
//                 if(this.state.selectedRecord["nrecurringperiodcode"]===undefined)
//                 {
//                     toast.info("Please select Monthly Occurrence type");
//                     return;
//                 }

//                 if(this.state.selectedRecord["nrecurringperiodcode"]!==undefined && 
//                 this.state.selectedRecord["nrecurringperiodcode"].value === 1 && 
//                 this.state.selectedRecord["nexactday"]===undefined)
//                 {
//                     toast.info("Please enter Exact Day");
//                     return;
//                 }
//             }
//         }

//         let postParam = undefined;

        
//             //add               
//             scheduleData["schedulemaster"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

//             this.schedulerFieldList.map(item => {
//                 return scheduleData["schedulemaster"][item] = this.state.selectedRecord[item]
//             });
//             if (this.props.Login.operation === "update") {
//             scheduleData["schedulemaster"]["nschedulecode"]= this.props.Login.masterData.SelectedScheduler["nschedulecode"];
//             }
//             if(this.props.Login.operation === "create" && 
//             this.state.selectedRecord["ntyperecurringcode"].value === 2)
//             {
//             if(this.state.selectedRecord["nsunday"]===undefined)
//             {
//                this.state.selectedRecord["nsunday"]=1;
//             }
//             if(this.state.selectedRecord["nmonday"]===undefined)
//             {
//                this.state.selectedRecord["nmonday"]=1;
//             }
//             if(this.state.selectedRecord["ntuesday"]===undefined)
//             {
//                 this.state.selectedRecord["ntuesday"]=1;
//             }
//             if(this.state.selectedRecord["nwednesday"]===undefined)
//             {
//                 this.state.selectedRecord["nwednesday"]=1;
//             }
//             if(this.state.selectedRecord["nthursday"]===undefined)
//             {
//                 this.state.selectedRecord["nthursday"]=1;
//             }
//             if(this.state.selectedRecord["nfriday"]===undefined)
//             {
//                 this.state.selectedRecord["nfriday"]=1;
//             }
//             if(this.state.selectedRecord["nsaturday"]===undefined)
//             {
//                 this.state.selectedRecord["nsaturday"]=1;
//             }
//         }

//         if(this.props.Login.operation === "create" && 
//         this.state.selectedRecord["ntyperecurringcode"].value === 3)
//         {
//             if(this.state.selectedRecord["njan"]===undefined)
//             {
//                this.state.selectedRecord["njan"]=1;
//             }
//             if(this.state.selectedRecord["nfeb"]===undefined)
//             {
//                this.state.selectedRecord["nfeb"]=1;
//             }
//             if(this.state.selectedRecord["nmar"]===undefined)
//             {
//                this.state.selectedRecord["nmar"]=1;
//             }
//             if(this.state.selectedRecord["napr"]===undefined)
//             {
//                this.state.selectedRecord["napr"]=1;
//             }
//             if(this.state.selectedRecord["nmay"]===undefined)
//             {
//                this.state.selectedRecord["nmay"]=1;
//             }
//             if(this.state.selectedRecord["njun"]===undefined)
//             {
//                this.state.selectedRecord["njun"]=1;
//             }
//             if(this.state.selectedRecord["njul"]===undefined)
//             {
//                this.state.selectedRecord["njul"]=1;
//             }
//             if(this.state.selectedRecord["naug"]===undefined)
//             {
//                this.state.selectedRecord["naug"]=1;
//             }
//             if(this.state.selectedRecord["nsep"]===undefined)
//             {
//                this.state.selectedRecord["nsep"]=1;
//             }
//             if(this.state.selectedRecord["noct"]===undefined)
//             {
//                this.state.selectedRecord["noct"]=1;
//             }
//             if(this.state.selectedRecord["nnov"]===undefined)
//             {
//                this.state.selectedRecord["nnov"]=1;
//             }
//             if(this.state.selectedRecord["ndec"]===undefined)
//             {
//                this.state.selectedRecord["ndec"]=1;
//             }
//         }

//             scheduleData["schedulemasterweekly"] = {
//                 "nsunday": this.state.selectedRecord["nsunday"] ? this.state.selectedRecord["nsunday"] : 0,
//                 //"ndefaultrole": transactionStatus.YES, "ntransactionstatus": transactionStatus.ACTIVE
//                 "nmonday": this.state.selectedRecord["nmonday"] ? this.state.selectedRecord["nmonday"] : 0,
//                 "ntuesday": this.state.selectedRecord["ntuesday"] ? this.state.selectedRecord["ntuesday"] : 0,
//                 "nwednesday": this.state.selectedRecord["nwednesday"] ? this.state.selectedRecord["nwednesday"] : 0,
//                 "nthursday": this.state.selectedRecord["nthursday"] ? this.state.selectedRecord["nthursday"] : 0,
//                 "nfriday": this.state.selectedRecord["nfriday"] ? this.state.selectedRecord["nfriday"] : 0,
//                 "nsaturday": this.state.selectedRecord["nsaturday"] ? this.state.selectedRecord["nsaturday"] : 0,
//             }
            
//             scheduleData["schedulemastermonthly"] = {
//                 "nexactday": this.state.selectedRecord["nexactday"] ? this.state.selectedRecord["nexactday"] : 0,
//                 "nmonthlyoccurrencetype": this.state.selectedRecord["nrecurringperiodcode"] ? this.state.selectedRecord["nrecurringperiodcode"].value : 0,
//                 "njan": this.state.selectedRecord["njan"] ? this.state.selectedRecord["njan"] : 0,
//                 "nfeb": this.state.selectedRecord["nfeb"] ? this.state.selectedRecord["nfeb"] : 0,
//                 "nmar": this.state.selectedRecord["nmar"] ? this.state.selectedRecord["nmar"] : 0,
//                 "napr": this.state.selectedRecord["napr"] ? this.state.selectedRecord["napr"] : 0,
//                 "nmay": this.state.selectedRecord["nmay"] ? this.state.selectedRecord["nmay"] : 0,
//                 "njun": this.state.selectedRecord["njun"] ? this.state.selectedRecord["njun"] : 0,
//                 "njul": this.state.selectedRecord["njul"] ? this.state.selectedRecord["njul"] : 0,
//                 "naug": this.state.selectedRecord["naug"] ? this.state.selectedRecord["naug"] : 0,
//                 "nsep": this.state.selectedRecord["nsep"] ? this.state.selectedRecord["nsep"] : 0,
//                 "noct": this.state.selectedRecord["noct"] ? this.state.selectedRecord["noct"] : 0,
//                 "nnov": this.state.selectedRecord["nnov"] ? this.state.selectedRecord["nnov"] : 0,
//                 "ndec": this.state.selectedRecord["ndec"] ? this.state.selectedRecord["ndec"] : 0,
//             }

            

        
// let date;
// let time;
//         scheduleData["schedulemaster"]["sscheduletype"] = this.state.selectedRecord["nschedulertypecode"] ? this.state.selectedRecord["nschedulertypecode"].value === 1 ? 'O' : this.state.selectedRecord["ntyperecurringcode"].value === 1 ? 'D' : this.state.selectedRecord["ntyperecurringcode"].value === 2 ? 'W' :  'M' : 'O';
//         if (scheduleData["schedulemaster"]["dstartdate"] !== undefined
//             && scheduleData["schedulemaster"]["dstartdate"] !== null && scheduleData["schedulemaster"]["dstartdate"] !== "") {
//                 //scheduleData["schedulemaster"]["dstartdate"] = formatInputDate(scheduleData["schedulemaster"]["dstartdate"]);
//                 scheduleData["schedulemaster"]["dstartdate"] = formatInputDate(this.state.selectedRecord["sstartdate"]);
//         }
//         if (scheduleData["schedulemaster"]["denddate"] !== undefined
//             && scheduleData["schedulemaster"]["denddate"] !== null && scheduleData["schedulemaster"]["denddate"] !== "") {
//                 //scheduleData["schedulemaster"]["denddate"] = formatInputDate(scheduleData["schedulemaster"]["denddate"]);
//                 scheduleData["schedulemaster"]["denddate"] = formatInputDate(this.state.selectedRecord["senddate"]);
//         }
//         else
//         {
//             scheduleData["schedulemaster"]["denddate"] = scheduleData["schedulemaster"]["dstartdate"];
//         }
//         if (scheduleData["schedulemaster"]["dstarttime"] !== undefined
//             && scheduleData["schedulemaster"]["dstarttime"] !== null && scheduleData["schedulemaster"]["dstarttime"] !== "") {
//                 //scheduleData["schedulemaster"]["dstarttime"] = formatInputDate(scheduleData["schedulemaster"]["dstarttime"]);
//                 date=formatInputDate(this.state.selectedRecord["sstartdate"]);
//                 date=date.substring(0,10);
//                 time=formatInputDate(this.state.selectedRecord["sstarttime"]);
//                 time=time.substring(19,11);
//                 date=date+"T"+time+"Z";
//                 //scheduleData["schedulemaster"]["dstarttime"] = formatInputDate(this.state.selectedRecord["sstarttime"]);
//                 scheduleData["schedulemaster"]["dstarttime"] = date;//formatInputDate(date);
//         }
//         if (scheduleData["schedulemaster"]["dendtime"] !== undefined
//             && scheduleData["schedulemaster"]["dendtime"] !== null && scheduleData["schedulemaster"]["dendtime"] !== "") {
//                 //scheduleData["schedulemaster"]["dendtime"] = formatInputDate(scheduleData["schedulemaster"]["dendtime"]);
//                 //scheduleData["schedulemaster"]["dendtime"] = formatInputDate(this.state.selectedRecord["sendtime"]);
//                 date=formatInputDate(this.state.selectedRecord["senddate"]);
//                 date=date.substring(0,10);
//                 time=formatInputDate(this.state.selectedRecord["sendtime"]);
//                 time=time.substring(19,11);
//                 date=date+"T"+time+"Z";
//                 //scheduleData["schedulemaster"]["dstarttime"] = formatInputDate(this.state.selectedRecord["sstarttime"]);
//                 scheduleData["schedulemaster"]["dendtime"] = date;
//         }
//         else
//         {
//             scheduleData["schedulemaster"]["dendtime"] = scheduleData["schedulemaster"]["dstarttime"];
//         }
//         if (scheduleData["schedulemaster"]["soccurencehourwiseinterval"] !== undefined
//             && scheduleData["schedulemaster"]["soccurencehourwiseinterval"] !== null && scheduleData["schedulemaster"]["soccurencehourwiseinterval"] !== "" &&
//             scheduleData["schedulemaster"]["soccurencehourwiseinterval"] !== "null ") {
//                 let shour= formatInputDate(scheduleData["schedulemaster"]["soccurencehourwiseinterval"]);
//                 //scheduleData["schedulemaster"]["soccurencehourwiseinterval"] =shour.substring(shour.indexOf('T'),5);
//                 scheduleData["schedulemaster"]["soccurencehourwiseinterval"] =shour.substring(16,11);
//         }
        

//         // const controlMaster = [{ncontrolcode:517, scontrolname:'UserImage', ssubfolder:"users"},
//         //                         {ncontrolcode:518, scontrolname:'SignImage', ssubfolder:""}]

        

//         const inputParam = {
//             classUrl: this.props.Login.inputParam.classUrl,
//             methodUrl: "Scheduler",
//             inputData: {scheduleData, userinfo: this.props.Login.userInfo },
//             //formData: formData,
//             //isFileupload: true,
//             operation: this.props.Login.operation,
//             saveType, formRef, postParam, searchRef: this.searchRef,
//             isClearSearch: this.props.Login.isClearSearch
//         }
//         const masterData = this.props.Login.masterData;

//         if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {

//             const updateInfo = {
//                 typeName: DEFAULT_RETURN,
//                 data: {
//                     loadEsign: true, screenData: { inputParam, masterData }, saveType
//                 }
//             }
//             this.props.updateStore(updateInfo);
//         }
//         else {
//             this.props.crudMaster(inputParam, masterData, "openModal");
//         }

//     }

    

    // deleteUserFile = (event, file, fieldName) => {
    //     let selectedRecord = this.state.selectedRecord || {};
    //     selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

    //     this.setState({
    //         selectedRecord, actionType: "delete" //fileToDelete:file.name 
    //     });
    // }

    

    // deleteScheduler = (methodUrl, selectedScheduler, operation, ncontrolCode) => {
    //     if (this.props.Login.masterData.SelectedScheduler.ntransactionstatus === transactionStatus.DRAFT) {
    //     {

    //         const postParam = {
    //             inputListName: "Scheduler", selectedObject: "SelectedScheduler",
    //             primaryKeyField: "nschedulecde",
    //             primaryKeyValue: selectedScheduler.nschedulecode,
    //             fetchUrl: "scheduler/getScheduler",
    //             fecthInputObject: { userinfo: this.props.Login.userInfo },
    //         }

    //         const inputParam = {
    //             classUrl: this.props.Login.inputParam.classUrl,
    //             methodUrl, postParam,
    //             inputData: {
    //                 "userinfo": this.props.Login.userInfo,
    //                 "scheduler": selectedScheduler
    //             },
    //             operation,
    //             isClearSearch: this.props.Login.isClearSearch
    //         }

    //         const masterData = this.props.Login.masterData;

    //         if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
    //             const updateInfo = {
    //                 typeName: DEFAULT_RETURN,
    //                 data: {
    //                     loadEsign: true, screenData: { inputParam, masterData },
    //                     openModal: true, screenName: "IDS_SCHEDULER", operation
    //                 }
    //             }
    //             this.props.updateStore(updateInfo);
    //         }
    //         else {
    //             this.props.crudMaster(inputParam, masterData, "openModal");
    //         }
    //     }
    // }
    // else
    // {
    //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTODELETE" }));
    // }
    // }

    // onApproveClick = (screenName, operation, primaryKeyName, primaryKeyValue, ncontrolCode) => {
    //     if (this.props.Login.masterData.SelectedScheduler.ntransactionstatus === transactionStatus.DRAFT) {
    //         const approveId = this.state.controlMap.has("ApproveScheduler") && this.state.controlMap.get("ApproveScheduler").ncontrolcode
    //         let inputData = [];
    //         inputData["userinfo"] = this.props.Login.userInfo;
    //         //add               
    //         let postParam = undefined;
    //         inputData["scheduler"] = { "nschedulecode": this.props.Login.masterData.SelectedScheduler["nschedulecode"] ? this.props.Login.masterData.SelectedScheduler["nschedulecode"].Value : "" };
    //         inputData["scheduler"] = this.props.Login.masterData.SelectedScheduler;
    //         postParam = { inputListName: "Scheduler", selectedObject: "SelectedScheduler", primaryKeyField: "nschedulecode" };
    //         const inputParam = {
    //             classUrl: this.props.Login.inputParam.classUrl,
    //             methodUrl: "Scheduler",
    //             inputData: inputData,
    //             operation: "approve", postParam
    //         }
    //         let saveType;

    //         const masterData = this.props.Login.masterData;

    //         const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, approveId);
    //         if (esignNeeded) {
    //             const updateInfo = {
    //                 typeName: DEFAULT_RETURN,
    //                 data: {
    //                     loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: operation
    //                 }
    //             }
    //             this.props.updateStore(updateInfo);
    //         }
    //         else {
    //             this.props.crudMaster(inputParam, masterData, "openModal");
    //         }
            
    //     }
    //     else {
    //         toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOAPPROVE" }));
    //     }
    // }

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
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "graphicalschedulerview",
            methodUrl: "GraphicalSchedulerView",
            displayName: "IDS_GRAPHICALSCHEDULERVIEW",
            userInfo: this.props.Login.userInfo,
            isClearSearch: this.props.Login.isClearSearch,
            

        };

        this.props.callService(inputParam);
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,
    updateStore, getGrapicalSchedulerViewDetail, getSchedulerComboService,changeGrapicalScheduleTypeFilter, filterColumnData
})(injectIntl(GraphicalSchedulerView));

export const currentYear = new Date().getFullYear();
export const parseAdjust = eventDate => {
  const date = new Date(eventDate);
  date.setFullYear(currentYear);
  return date;
};
export const displayDate = new Date(Date.UTC(currentYear, new Date().getMonth(), new Date().getDate()));
