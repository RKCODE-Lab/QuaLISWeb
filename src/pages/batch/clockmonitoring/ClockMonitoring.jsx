import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { injectIntl, FormattedMessage } from 'react-intl';
import SplitterLayout from "react-splitter-layout";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Row, Col, Card, Nav, FormGroup, FormLabel, Button, } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
//import { Tooltip } from '@progress/kendo-react-tooltip';
// import ReactTooltip from 'react-tooltip';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getClockMonitoringComboService,
    getClockBatchCreationDetail, reloadClockMonitoring,
    filterColumnData
} from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import {
    showEsign, getControlMap, getStartOfDay, getEndOfDay, formatInputDate, constructOptionList,
    convertDateValuetoString, rearrangeDateFormat
} from '../../../components/CommonScript';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import { transactionStatus } from '../../../components/Enumeration';
import { designProperties } from '../../../components/Enumeration';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { ReadOnlyText, ContentPanel, OutlineTransactionStatus, DecisionStatus } from '../../../components/App.styles';
import { ListWrapper } from '../../../components/client-group.styles';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';

import Esign from '../../audittrail/Esign';
import ClockMonitoringTabs from './ClockMonitoringTabs';
import AddClockHistory from './AddClockHistory';

import TransactionListMaster from '../../../components/TransactionListMaster';
import BatchFilter from '../../../components/BatchFilter';
import { ProductList } from '../../testmanagement/testmaster-styled';

// import { ReactComponent as ClockStartIcon } from '../../../assets/image/clock-start.svg';
// import { ReactComponent as ClockStopIcon } from '../../../assets/image/clock-stop.svg';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class ClockMonitoring extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            screenName: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            firstPane: 0,
            paneHeight: 0,
            secondPaneHeight: 0,
            tabPane: 0,
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],

        };
        this.searchRef = React.createRef();

        this.searchFieldList = ["nnoofcontainer", "nreleasebatchcode", "sbatchfillinglotno",
            "sbatchregdate", "sbatchspecvarinfo", "scertificatehistorycode", "scertificatetype",
            "sdecision", "sexpirydate", "sfinalbulkno", "smahname",
            "smanufname", "snibsccomments", "spackinglotno", "sproductname", "sspecname",
            "stransactionstatus", "svaliditystartdate",
            "sversioncode"];

        this.mandatoryFields = [{ "idsName": "IDS_DATE", "dataField": "dapproveddate" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
                                { "idsName": "IDS_TIMEZONE", "dataField": "ntzapproveddate", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"  },
                                { "idsName": "IDS_COMMENTS", "dataField": "scomments" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },];

        this.confirmMessage = new ConfirmMessage();
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }
        if (props.Login.multiLingualMasterStatus && props.Login.multiLingualMasterStatus !== "") {
            toast.warn(props.intl.formatMessage({ id: props.Login.multiLingualMasterStatus }));
            props.Login.multiLingualMasterStatus = "";
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

        const startId = this.state.controlMap.has("StartClock") && this.state.controlMap.get("StartClock").ncontrolcode;
        const stopId = this.state.controlMap.has("StopClock") && this.state.controlMap.get("StopClock").ncontrolcode;
        // const editId = this.state.controlMap.has("StartClock") && this.state.controlMap.get("StartClock").ncontrolcode;
        // const deleteId = this.state.controlMap.has("StopClock") && this.state.controlMap.get("StopClock").ncontrolcode;


        let fromDate = "";
        let toDate = "";

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            fromDate = (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"]))
                || rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.FromDate);
            toDate = (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"]))
                || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        }

        let stransactionstatuscode = this.props.Login.masterData.SelectedClockFilterStatus ? String(this.props.Login.masterData.SelectedClockFilterStatus.ntransactionstatus) : null;

        if (this.state.selectedRecord && this.state.selectedRecord["nfiltertransstatus"] !== undefined) {
            stransactionstatuscode = this.state.selectedRecord["nfiltertransstatus"].value === String(0) ? null : String(this.state.selectedRecord["nfiltertransstatus"].value);
        }

        const filterParam = {
            inputListName: "ClockMonitoringBatchList", selectedObject: "SelectedClockBatch", primaryKeyField: "nreleasebatchcode",
            fetchUrl: "clockmonitoring/getClockMonitoring",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                fromDate, toDate, stransactionstatuscode,
                //activeBCTab :this.props.Login.activeBCTab || "IDS_COMPONENT" 
            },
            masterData: this.props.Login.masterData, unchangeList: ["FromDate", "ToDate", "SelectedClockFilterStatus"],
            searchFieldList: this.searchFieldList
        }

        // let decisionIcon = ""
        // let decisionClass = "outline-secondary"
        // if (this.props.Login.masterData.SelectedClockBatch) {

        //     decisionClass = this.props.Login.masterData.SelectedClockBatch.ndecision === transactionStatus.PASS ? "outline-success" :
        //         this.props.Login.masterData.SelectedClockBatch.ndecision === transactionStatus.FAIL ? "outline-danger" : "outline-secondary";
        //     decisionIcon = this.props.Login.masterData.SelectedClockBatch.ndecision === transactionStatus.PASS ? "fa fa-thumbs-up" :
        //         this.props.Login.masterData.SelectedClockBatch.ndecision === transactionStatus.FAIL ? "fa fa-thumbs-down" :
        //             this.props.Login.masterData.SelectedClockBatch.ndecision === transactionStatus.WITHDRAWN ? "fa fa-minus" : ""
        // }

        const breadCrumbData = this.state.filterData || [];
        return (<>
            {/* Start of get display*/}
            <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                {breadCrumbData.length > 0 ?
                    <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                    : ""}
                <Row noGutters={true}>
                    <Col md={12} className="parent-port-height sticky_head_parent" ref={(parentHeight) => { this.parentHeight = parentHeight }}>

                        <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={25}>

                            <TransactionListMaster
                                masterList={this.props.Login.masterData.searchedData || (this.props.Login.masterData.ClockMonitoringBatchList || [])}
                                selectedMaster={[this.props.Login.masterData.SelectedClockBatch]}
                                primaryKeyField="nreleasebatchcode"
                                getMasterDetail={this.props.getClockBatchCreationDetail}
                                inputParam={
                                    {
                                        userInfo: this.props.Login.userInfo,
                                        masterData: this.props.Login.masterData,
                                    }
                                }
                                mainField="nreleasebatchcode"
                                selectedListName="SelectedClockBatch"
                                objectName="BatchCreation"
                                listName="IDS_BATCH"
                                needValidation={false}
                                subFields={
                                    [
                                        { [designProperties.VALUE]: "sproductname" },
                                        { [designProperties.VALUE]: "smanufname" },
                                        { [designProperties.VALUE]: "smahname" },
                                        { [designProperties.VALUE]: "stransactionstatus", [designProperties.COLOUR]: "transstatuscolor" }
                                    ]
                                }
                                needFilter={true}
                                needMultiSelect={false}
                                subFieldsLabel={true}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                filterColumnData={this.props.filterColumnData}
                                searchListName="searchedData"
                                searchRef={this.searchRef}
                                filterParam={filterParam}
                                skip={this.state.skip}
                                take={this.state.take}
                                handlePageChange={this.handlePageChange}
                                commonActions={


                                    <ProductList className="d-flex product-category float-right">
                                        {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                          //  data-for="tooltip-common-wrap"
                                            onClick={() => this.reloadData(false)} >
                                            <RefreshIcon className='custom_icons'/>
                                        </Button>

                                    </ProductList>

                                }
                                filterComponent={[
                                    {
                                        "IDS_FILTER":
                                            <BatchFilter
                                                selectedRecord={this.state.selectedRecord || {}}
                                                handleDateChange={this.handleDateChange}
                                                onFilterComboChange={this.onComboChange}
                                                fromDate={fromDate}
                                                toDate={toDate}
                                                userInfo={this.props.Login.userInfo}
                                                statusList={this.state.filterStatusList}
                                                selectedFilterStatus={this.props.Login.masterData.SelectedClockFilterStatus}
                                            />
                                    }
                                ]}

                            />

                            <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} //secondaryInitialSize={400}
                                customClassName="fixed_list_height">
                                <PerfectScrollbar>
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            {this.props.Login.masterData.ClockMonitoringBatchList && this.props.Login.masterData.ClockMonitoringBatchList.length > 0
                                                && this.props.Login.masterData.SelectedClockBatch ?
                                                <>
                                                    <Card.Header>
                                                        <Card.Title className="product-title-main">
                                                            {this.props.Login.masterData.SelectedClockBatch.nreleasebatchcode}
                                                        </Card.Title>
                                                        <Card.Subtitle>
                                                            <div className="d-flex product-category">
                                                                <h2 className="product-title-sub flex-grow-1">

                                                                    {/* <span className={`btn btn-outlined ${decisionClass}  btn-sm`}>
                                                                        {decisionIcon !== "" ? <i class={`${decisionIcon} mr-2`}></i> : ""}
                                                                        {this.props.Login.masterData.SelectedClockBatch.sdecision}
                                                                    </span>
                                                                    <span className={`btn btn-outlined btn-sm ml-3`} style={{ color: this.props.Login.masterData.SelectedClockBatch.transstatuscolor }}>
                                                                        {this.props.Login.masterData.SelectedClockBatch.stransactionstatus}
                                                                    </span> */}

                                                                    <OutlineTransactionStatus transcolor={this.props.Login.masterData.SelectedClockBatch.transstatuscolor}>
                                                                        {this.props.Login.masterData.SelectedClockBatch.stransactionstatus}
                                                                    </OutlineTransactionStatus>

                                                                    {/* {this.props.Login.masterData.SelectedClockBatch.ndecision !== transactionStatus.DRAFT ?
                                                                        <DecisionStatus decisioncolor={this.props.Login.masterData.SelectedClockBatch.decisioncolor}>
                                                                           {this.props.Login.masterData.SelectedClockBatch.sdecision}
                                                                        </DecisionStatus>
                                                                    :""} */}
                                                                </h2>
                                                                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                                <div className="d-inline">
                                                                    <Nav.Link name="startclock"
                                                                        hidden={this.state.userRoleControlRights.indexOf(startId) === -1}
                                                                        className="btn btn-circle outline-grey mr-2 action-icons-wrap startclock"
                                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_STARTCLOCK" })}
                                                                      //  data-for="tooltip-common-wrap"
                                                                        onClick={() => this.props.getClockMonitoringComboService({
                                                                            screenName: "IDS_CLOCKHISTORY",
                                                                            operation: "create", primaryKeyField: "nclockhistorycode",
                                                                            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
                                                                            ncontrolCode: startId,
                                                                            selectedBatch: this.props.Login.masterData.SelectedClockBatch,
                                                                            clockAction: transactionStatus.START
                                                                        })}
                                                                    >
                                                                        <FontAwesomeIcon icon={faPlay}
                                                                            name="startclockicon" /> { }

                                                                    </Nav.Link>

                                                                    <Nav.Link name="stopclock"
                                                                        hidden={this.state.userRoleControlRights.indexOf(stopId) === -1}
                                                                        className="btn btn-circle outline-grey mr-2 action-icons-wrap stopclock"
                                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_STOPCLOCK" })}
                                                                       // data-for="tooltip-common-wrap"
                                                                        onClick={() => this.props.getClockMonitoringComboService({
                                                                            screenName: "IDS_CLOCKHISTORY",
                                                                            operation: "create", primaryKeyField: "nclockhistorycode",
                                                                            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
                                                                            ncontrolCode: stopId,
                                                                            selectedBatch: this.props.Login.masterData.SelectedClockBatch,
                                                                            clockAction: transactionStatus.STOP
                                                                        })}
                                                                    >
                                                                        <FontAwesomeIcon icon={faStop}
                                                                            name="stopclockicon" /> { }
                                                                    </Nav.Link>
                                                                    {/* <ContentPanel className="d-flex justify-content-end dropdown badget_menu icon-group-wrap">
                                                                    <Nav.Link   name="startclock" 
                                                                                hidden={this.state.userRoleControlRights.indexOf(startId) === -1} 
                                                                                className="btn btn-circle outline-grey mr-2" 
                                                                                title={this.props.intl.formatMessage({ id: "IDS_STARTCLOCK" })}
                                                                                onClick = {()=>this.props.getClockMonitoringComboService({screenName: "IDS_CLOCKHISTORY", 
                                                                                                                                        operation: "create", primaryKeyField: "nclockhistorycode",
                                                                                                                                        inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
                                                                                                                                        ncontrolCode: startId,
                                                                                                                                        selectedBatch:this.props.Login.masterData.SelectedClockBatch,
                                                                                                                                        clockAction:transactionStatus.START})}
                                                                            >
                                                                           <ClockStartIcon  className="custom_icons clock_marginstyle" width="30" height="30"
                                                                                            name="startclockicon"
                                                                                            title={this.props.intl.formatMessage({ id: "IDS_STARTCLOCK" })} /> { }
                                                                                                               
                                                                    </Nav.Link>

                                                                    <Nav.Link   name="stopclock" 
                                                                                hidden={this.state.userRoleControlRights.indexOf(stopId) === -1} 
                                                                                className="btn btn-circle outline-grey mr-2"
                                                                                title={this.props.intl.formatMessage({ id: "IDS_STOPCLOCK" })} 
                                                                                onClick = {()=>this.props.getClockMonitoringComboService({ screenName: "IDS_CLOCKHISTORY", 
                                                                                                                                            operation: "create", primaryKeyField: "nclockhistorycode",
                                                                                                                                            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
                                                                                                                                            ncontrolCode: stopId,
                                                                                                                                            selectedBatch:this.props.Login.masterData.SelectedClockBatch,
                                                                                                                                            clockAction:transactionStatus.STOP})}
                                                                            >
                                                                        <ClockStopIcon  className="custom_icons clock_marginstyle" width="30" height="30"
                                                                                            name="stopclockicon"
                                                                                            title={this.props.intl.formatMessage({ id: "IDS_STOPCLOCK" })} /> { }
                                                                    </Nav.Link>       
                                                                </ContentPanel>                                                            */}
                                                                </div>
                                                                {/* </Tooltip> */}

                                                            </div>

                                                        </Card.Subtitle>
                                                    </Card.Header>
                                                    <Card.Body className="form-static-wrap">
                                                        <Row>
                                                            <Col md={8}>
                                                                <Row>
                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_BATCHREGISTRATIONDATE" message="Batch Registration Date" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedClockBatch.sbatchregdate}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_CERTFICATENUMBER" message="Certificate Number" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedClockBatch.scertificatehistorycode === null || this.props.Login.masterData.SelectedClockBatch.scertificatehistorycode.length === 0 ? '-' :
                                                                                    this.props.Login.masterData.SelectedClockBatch.scertificatehistorycode}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_VERSION" message="Version" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedClockBatch.sversioncode === null || this.props.Login.masterData.SelectedClockBatch.sversioncode.length === 0 ? '-' :
                                                                                    this.props.Login.masterData.SelectedClockBatch.sversioncode}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_PRODUCT" message="Product" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedClockBatch.sproductname}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_MANUFACTURER" message="Manufacturer" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedClockBatch.smanufname}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_STUDYPLAN" message="Study Plan" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedClockBatch.sspecname}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_BATCHFILINGNUMBER" message="Batch Filing Lot No." /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedClockBatch.sbatchfillinglotno} </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_PACKINGLOTNUMBER" message="Packing Lot No." /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedClockBatch.spackinglotno === null || this.props.Login.masterData.SelectedClockBatch.spackinglotno.length === 0 ? '-' :
                                                                                    this.props.Login.masterData.SelectedClockBatch.spackinglotno}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_MAHOLDERNAME" message="MA Holder" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedClockBatch.smahname}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_NOOFCONTAINER" message="No. of Container" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedClockBatch.nnoofcontainer} </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_FINALBULKNUMBER" message="Final Bulk No." /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedClockBatch.sfinalbulkno} </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_BATCHSPECVARINFO" message="Batch Spec Var Info" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedClockBatch.sbatchspecvarinfo === null || this.props.Login.masterData.SelectedClockBatch.sbatchspecvarinfo.length === 0 ? '-' :
                                                                                    this.props.Login.masterData.SelectedClockBatch.sbatchspecvarinfo}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_MANUFORDERNO" message="Manufacture Order No" /></FormLabel>
                                                                            <ReadOnlyText>
                                                                                {this.props.Login.masterData.SelectedClockBatch.smanuforderno === null || this.props.Login.masterData.SelectedClockBatch.smanuforderno.length === 0 ? '-' :
                                                                                    this.props.Login.masterData.SelectedClockBatch.smanuforderno}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_VALIDITYSTARTDATE" message="Validity Start Date" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedClockBatch.svaliditystartdate}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_EXPIRYDATE" message="Expiry Date" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedClockBatch.sexpirydate}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md={6}>
                                                                        {this.props.Login.masterData.SelectedClockBatch.ndecision !== transactionStatus.DRAFT ?
                                                                            <FormGroup>
                                                                                <FormLabel><FormattedMessage id="IDS_DECISIONSTATUS" message="Desicion Status" /></FormLabel>
                                                                                <DecisionStatus decisioncolor={this.props.Login.masterData.SelectedClockBatch.decisioncolor}>
                                                                                    {this.props.Login.masterData.SelectedClockBatch.sdecision}
                                                                                </DecisionStatus>
                                                                            </FormGroup>
                                                                            : ""}
                                                                    </Col>

                                                                    <Col md={12}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_NIBSCCOMMENTS" message="NIBSC Comments" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedClockBatch.snibsccomments === null || this.props.Login.masterData.SelectedClockBatch.snibsccomments.length === 0 ? '-' :
                                                                                this.props.Login.masterData.SelectedClockBatch.snibsccomments}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>
                                                            </Col>
                                                            <Col md={4}>                                                              

                                                                <Card>
                                                                    <Card.Header><FormattedMessage id="IDS_DEVIATION" message="DEVIATION"/></Card.Header>                           
                                                                    <Card.Body>                                                                        
                                                                       
                                                                            <Row>
                                                                                <Col md={12}>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_KPIDATE" message="KPI Date" /></FormLabel>
                                                                                        <ReadOnlyText> {this.props.Login.masterData.KPIDate ? this.props.Login.masterData.KPIDate : "_____"}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_ACTUALDURATION" message="Actual Duration" /> ({'DD:HH'})</FormLabel>
                                                                                        <ReadOnlyText>   {this.props.Login.masterData.CM_ActualDuration &&
                                                                                                            this.props.Login.masterData.CM_ActualDuration.length > 0 ?
                                                                                                            this.props.Login.masterData.CM_ActualDuration : "_____"}
                                                                                                        
                                                                                        </ReadOnlyText>
                                                                                    </FormGroup>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_TOTALDURATION" message="Total Duration" /> ({'DD:HH'})</FormLabel>
                                                                                        <ReadOnlyText>  {this.props.Login.masterData.CM_TotalDuration
                                                                                                            && this.props.Login.masterData.CM_TotalDuration.length > 0 ?
                                                                                                            this.props.Login.masterData.CM_TotalDuration : "_____"}                                                                                                          
                                                                                        </ReadOnlyText>
                                                                                    </FormGroup>
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id="IDS_DEVIATION" message="Deviation" /> ({'DD:HH'})</FormLabel>
                                                                                        <ReadOnlyText>  {this.props.Login.masterData.CM_Deviation
                                                                                                        && this.props.Login.masterData.CM_Deviation.length > 0 ?
                                                                                                        this.props.Login.masterData.CM_Deviation : "_____"}
                                                                                        </ReadOnlyText>
                                                                                    </FormGroup>


                                                                                    {/* <ReadOnlyText><FormattedMessage id="IDS_KPIDATE" message="KPI Date" /></ReadOnlyText>
                                                                                    <span className={`btn btn-outlined btn-sm ml-3`} style={{ color: 'gray' }}>
                                                                                        {this.props.Login.masterData.KPIDate ? this.props.Login.masterData.KPIDate : "-"}
                                                                                    </span>

                                                                                    <ReadOnlyText><FormattedMessage id="IDS_ACTUALDURATION" message="Actual Duration" /></ReadOnlyText>

                                                                                    <span className={`btn btn-outlined btn-sm ml-3`} style={{ color: 'green' }}>
                                                                                        {this.props.Login.masterData.CM_ActualDuration &&
                                                                                            this.props.Login.masterData.CM_ActualDuration.length > 0 ?
                                                                                            this.props.Login.masterData.CM_ActualDuration : "-"}&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                    <FormLabel>{'DD:HH'}</FormLabel>
                                                                                    </span>

                                                                                    <ReadOnlyText><FormattedMessage id="IDS_TOTALDURATION" message="Total Duration" /></ReadOnlyText>

                                                                                    <span className={`btn btn-outlined btn-sm ml-3`} style={{ color: 'blue' }}>
                                                                                        {this.props.Login.masterData.CM_TotalDuration
                                                                                            && this.props.Login.masterData.CM_TotalDuration.length > 0 ?
                                                                                            this.props.Login.masterData.CM_TotalDuration : "-"}&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                    <FormLabel>{'DD:HH'}</FormLabel>
                                                                                    </span>

                                                                                    <ReadOnlyText><FormattedMessage id="IDS_DEVIATION" message="Deviation" /></ReadOnlyText>

                                                                                    <span className={`btn btn-outlined btn-sm ml-3`} style={{ color: 'red' }}>
                                                                                        {this.props.Login.masterData.CM_Deviation
                                                                                            && this.props.Login.masterData.CM_Deviation.length > 0 ?
                                                                                            this.props.Login.masterData.CM_Deviation : "-"}&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                    <FormLabel>{'DD:HH'}</FormLabel>
                                                                                    </span> */}
                                                                                </Col>

                                                                            </Row>
                                                                       
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>

                                                        <ClockMonitoringTabs
                                                            operation={this.props.Login.operation}
                                                            inputParam={this.props.Login.inputParam}
                                                            screenName={this.props.Login.screenName}
                                                            userInfo={this.props.Login.userInfo}
                                                            masterData={this.props.Login.masterData}
                                                            crudMaster={this.props.crudMaster}
                                                            masterStatus={this.props.Login.masterStatus}
                                                            openChildModal={this.props.Login.openChildModal}
                                                            updateStore={this.props.updateStore}
                                                            selectedRecord={this.props.Login.selectedRecord}
                                                            ncontrolCode={this.props.Login.ncontrolCode}
                                                            userRoleControlRights={this.state.userRoleControlRights}
                                                            esignRights={this.props.Login.userRoleControlRights}
                                                            screenData={this.props.Login.screenData}
                                                            validateEsignCredential={this.props.validateEsignCredential}
                                                            loadEsign={this.props.Login.loadEsign}
                                                            controlMap={this.state.controlMap}
                                                            selectedId={this.props.Login.selectedId}
                                                            dataState={this.props.Login.dataState}
                                                            activeBCTab={this.props.Login.activeBCTab}
                                                            getClockMonitoringComboService={this.props.getClockMonitoringComboService}
                                                            onSaveClick={this.onSaveClick}
                                                            deleteRecord={this.deleteRecord}
                                                        />

                                                    </Card.Body>
                                                </>
                                                : ""
                                            }
                                        </Card>
                                    </ContentPanel>
                                </PerfectScrollbar>
                            </SplitterLayout>
                        </SplitterLayout >
                    </Col>
                </Row>

            </ListWrapper>

            {/* End of get display*/}

            {/* Start of Modal Sideout for User Creation */}
            {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
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
                    mandatoryFields={this.mandatoryFields}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign operation={this.props.Login.operation}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        :   // this.props.Login.operation === "create"?
                        <AddClockHistory
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            handleDateChange={this.handleDateChange}
                            timeZoneList={this.props.Login.timeZoneList || []}
                            //selectedBacthCreation={this.props.Login.masterData.SelectedClockBatch||{}}
                            operation={this.props.Login.operation}
                            inputParam={this.props.Login.inputParam}
                            userInfo={this.props.Login.userInfo}
                        />

                    }
                /> : ""}

        </>
        );
    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

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
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();

            const filterStatusListMap = constructOptionList(this.props.Login.masterData.ClockMonitoringFilterStatus || [], "ntransactionstatus", "stransdisplaystatus", undefined, undefined, true);
            const filterStatusList = filterStatusListMap.get("OptionList");
            this.setState({ filterData, filterStatusList });
        }

    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        //let selectedRecord = this.state.selectedRecord;
        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) 
        {
           // let obj = this.convertDatetoString((selectedRecord && selectedRecord["fromdate"]) || this.props.Login.masterData.FromDate, (selectedRecord && selectedRecord["todate"]) || this.props.Login.masterData.ToDate);
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
            breadCrumbData.push(
                {
                    "label": "IDS_FROM",
                    "value": obj.breadCrumbFrom
                },
                {
                    "label": "IDS_TO",
                    "value": obj.breadCrumbto
                },
                {
                    "label": "IDS_FILTERSTATUS",
                    "value": this.props.Login.masterData.SelectedClockFilterStatus ?
                        this.props.intl.formatMessage({ id: this.props.Login.masterData.SelectedClockFilterStatus.stransdisplaystatus || "IDS_ALL" }) : "IDS_ALL"
                
               }
            );
        }
        return breadCrumbData;
    }

    // generateBreadCrumData() {
    //     const breadCrumbData = [];
    //     if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
    //         let dateField = this.formatDatesWithT((this.state.selectedRecord && this.state.selectedRecord["fromdate"])
    //             || this.props.Login.masterData.FromDate,
    //             (this.state.selectedRecord && this.state.selectedRecord["todate"])
    //             || this.props.Login.masterData.ToDate);
    //         breadCrumbData.push(
    //             {
    //                 "label": "IDS_FROM",
    //                 //"value": (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) 
    //                 //                || this.props.Login.masterData.FromDate

    //                 "value": dateField.breadCrumbFrom
    //             },
    //             {
    //                 "label": "IDS_TO",
    //                 // "value": (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) 
    //                 // || this.props.Login.masterData.ToDate
    //                 "value": dateField.breadCrumbto
    //             },
    //             {
    //                 "label": "IDS_FILTERSTATUS",
    //                 "value": this.props.Login.masterData.SelectedClockFilterStatus ?
    //                     this.props.intl.formatMessage({ id: this.props.Login.masterData.SelectedClockFilterStatus.stransdisplaystatus || "IDS_ALL" }) : "IDS_ALL"
    //             }
    //         );
    //     }
    //     return breadCrumbData;
    // }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
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


    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;

        }
        this.setState({ selectedRecord });
    }


    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });

    }
    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onSaveClick = (saveType, formRef) => {

        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;

        let postParam = undefined;


        if (this.props.Login.operation === "update") {
            // edit
            postParam = {
                inputListName: "ClockMonitoringBatchList", selectedObject: "SelectedClockBatch",
                primaryKeyField: "nreleasebatchcode", unchangeList: ["FromDate", "ToDate"]
            };
            inputData["clockhistory"] = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));
        }
        else {
            //add  
            postParam = { inputListName: "ClockMonitoringBatchList", selectedObject: "SelectedClockBatch" }
            inputData["clockhistory"] = {};
            inputData["clockhistory"]["ntransactionstatus"] = this.props.Login.clockAction;
        }

        inputData["clockhistory"]["nreleasebatchcode"] = this.props.Login.masterData.SelectedClockBatch.nreleasebatchcode;
        inputData["clockhistory"]["scomments"] = this.state.selectedRecord["scomments"] || "";
        inputData["clockhistory"]["dapproveddate"] = this.state.selectedRecord["dapproveddate"];
        inputData["clockhistory"]["ntzapproveddate"] = this.state.selectedRecord["ntzapproveddate"] ?
            this.state.selectedRecord["ntzapproveddate"].value : 1;
        inputData["clockhistory"]["stzapproveddate"] = this.state.selectedRecord["stzapproveddate"] || "";
        inputData["clockhistory"]["nactiontype"] = transactionStatus.MANUAL;


        const approvedDate = inputData["clockhistory"]["dapproveddate"];

        //need this conversion when the datatype of the field is 'Instant'
        inputData["clockhistory"]["dapproveddate"] = formatInputDate(approvedDate, false);

        const inputParam = {
            classUrl: "clockmonitoring",
            methodUrl: "ClockHistory",
            displayName: "IDS_CLOCKMONITORING",
            inputData: inputData, postParam, searchRef: this.searchRef,
            operation: this.props.Login.operation, saveType, formRef
        }

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: "IDS_CLOCKMONITORING",
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal", null);
        }
    }


    deleteRecord = (deleteParam) => {

        if (this.props.Login.masterData.SelectedClockBatch.ntransactionstatus === transactionStatus.CERTIFIED
            || this.props.Login.masterData.SelectedClockBatch.ntransactionstatus === transactionStatus.NULLIFIED
            || this.props.Login.masterData.SelectedClockBatch.ntransactionstatus === transactionStatus.SENT) {
            //const message = "IDS_CANNOTDELETE"+this.props.Login.masterData.SelectedClockBatch.stransactionstatus.toUpperCase() +"RECORD";
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTDELETECERTIFIEDCLOCK" }));
        }
        else {
            if (deleteParam.selectedRecord.nactiontype === transactionStatus.AUTO) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTDELETEAUTOCLOCK" }));
            }
            else {
                let dataState = undefined;

                // const postParam = { inputListName: "ClockMonitoringBatchList", selectedObject: "SelectedClockBatch", 
                //                 primaryKeyField: "nreleasebatchcode", unchangeList: ["FromDate", "ToDate"] };

                const postParam = {
                    inputListName: "ClockMonitoringBatchList", selectedObject: "SelectedClockBatch",
                    primaryKeyField: "nreleasebatchcode",
                    primaryKeyValue: this.props.Login.masterData.SelectedClockBatch.nreleasebatchcode,
                    fetchUrl: "clockmonitoring/getClockMonitoring",
                    fecthInputObject: { userinfo: this.props.Login.userInfo },
                }
                const inputParam = {
                    classUrl: this.props.Login.inputParam.classUrl,
                    methodUrl: deleteParam.methodUrl,
                    inputData: {
                        clockhistory: deleteParam.selectedRecord,
                        "userinfo": this.props.Login.userInfo
                    },
                    operation: "delete", dataState, postParam

                }
                const masterData = this.props.Login.masterData;

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData },
                            openModal: true, screenName: "IDS_CLOCKMONITORING", operation: "delete"
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, masterData, "openModal");
                }
            }
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

    onFilterSubmit = () => {
        this.reloadData(true);
    }

    // formatDatesWithT(startDateValue, endDateValue) {
    //     const startDate = new Date(startDateValue);
    //     const endDate = new Date(endDateValue);

    //     const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
    //     const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
    //     const prevDay = validateTwoDigitDate(String(startDate.getDate()));
    //     const currentDay = validateTwoDigitDate(String(endDate.getDate()));

    //     const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay
    //     const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay
    //     const fromDate = fromDateOnly + "T00:00:00";
    //     const toDate = toDateOnly + "T23:59:59";


    //     return ({ fromDate, toDate, breadCrumbFrom: fromDateOnly, breadCrumbto: toDateOnly })
    // }

    // convertDatetoString(startDateValue, endDateValue) {
    //     const startDate = new Date(startDateValue);
    //     const endDate = new Date(endDateValue);

    //     const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
    //     const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
    //     const prevDay = validateTwoDigitDate(String(startDate.getDate()));
    //     const currentDay = validateTwoDigitDate(String(endDate.getDate()));

    //     const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay
    //     const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay
    //     const fromDate = fromDateOnly + "T00:00:00";
    //     const toDate = toDateOnly + "T23:59:59";
    //     return ({ fromDate, toDate, breadCrumbFrom: fromDateOnly, breadCrumbto: toDateOnly })
    // }

    reloadData = (isFilterSubmit) => {
        this.searchRef.current.value = "";
        // let obj = this.convertDatetoString((selectedRecord && selectedRecord["fromdate"]) || this.props.Login.masterData.FromDate, (selectedRecord && selectedRecord["todate"]) || this.props.Login.masterData.ToDate)

        let stransactionstatuscode = this.props.Login.masterData.SelectedClockFilterStatus ? String(this.props.Login.masterData.SelectedClockFilterStatus.ntransactionstatus) : null;

        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
        if (isFilterSubmit) {
            const selectedRecord = this.state.selectedRecord || {};
            if (selectedRecord && selectedRecord["nfiltertransstatus"] !== undefined) {
                stransactionstatuscode = selectedRecord["nfiltertransstatus"].value === String(0) ? null : String(selectedRecord["nfiltertransstatus"].value);
            }
            if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
                fromDate = selectedRecord["fromdate"];
            }
            if (selectedRecord && selectedRecord["todate"] !== undefined) {
                toDate = selectedRecord["todate"];
            }
        }
        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        const inputParam = {
            inputData: {
                userinfo: this.props.Login.userInfo,
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                stransactionstatuscode,
                //currentdate: isFilterSubmit === true ? null : formatInputDate(new Date(), true)
                currentdate:null
            },
            classUrl: "clockmonitoring",
            methodUrl: "ClockMonitoring",
            displayName: "IDS_CLOCKMONITORING",
            userInfo: this.props.Login.userInfo
        };

        // this.props.callService(inputParam);
        this.props.reloadClockMonitoring(inputParam);
    }

    // reloadData = (selectedRecord, isFilterSubmit) => {
    //     this.searchRef.current.value = "";

    //     // let fromDate = this.props.Login.masterData.FromDate;
    //     // let toDate =  this.props.Login.masterData.ToDate;
    //     let stransactionstatuscode = this.props.Login.masterData.SelectedClockFilterStatus ? String(this.props.Login.masterData.SelectedClockFilterStatus.ntransactionstatus) : null;

    //     if (isFilterSubmit) {
    //         if (selectedRecord && selectedRecord["nfiltertransstatus"] !== undefined) {
    //             stransactionstatuscode = selectedRecord["nfiltertransstatus"].value === String(0) ? null : String(selectedRecord["nfiltertransstatus"].value);
    //         }
    //         // if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
    //         //     fromDate = selectedRecord["fromdate"];
    //         //     toDate =  selectedRecord["todate"];
    //         //  }
    //     }

    //     let dateField = this.formatDatesWithT((selectedRecord && selectedRecord["fromdate"])
    //         || this.props.Login.masterData.FromDate,
    //         (selectedRecord && selectedRecord["todate"])
    //         || this.props.Login.masterData.ToDate);

    //     const inputParam = {
    //         inputData: {
    //             "userinfo": this.props.Login.userInfo,
    //             //fromDate, toDate, 
    //             fromDate: dateField.fromDate,
    //             toDate: dateField.toDate,
    //             stransactionstatuscode,
    //             currentdate: isFilterSubmit === true ? null : formatInputDate(new Date(), true)
    //         },
    //         classUrl: "clockmonitoring",
    //         methodUrl: "ClockMonitoring",
    //         displayName: "IDS_CLOCKMONITORING",
    //         userInfo: this.props.Login.userInfo
    //     };

    //     this.props.callService(inputParam);
    // }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,
    updateStore, getClockMonitoringComboService, getClockBatchCreationDetail,
    filterColumnData, reloadClockMonitoring
})(injectIntl(ClockMonitoring));

