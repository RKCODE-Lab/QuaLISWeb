import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { Row, Col, Card, FormGroup, FormLabel, Button } from 'react-bootstrap';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getCerHisDetail,
    getTestParameter, filterTransactionList,
} from '../../../actions';
import { getControlMap, getStartOfDay, getEndOfDay, formatInputDate, rearrangeDateFormat, convertDateValuetoString, sortData } from '../../../components/CommonScript';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import { ListWrapper } from '../../../components/client-group.styles';
import SplitterLayout from "react-splitter-layout";
import { ReadOnlyText, ContentPanel, OutlineTransactionStatus, DecisionStatus } from '../../../components/App.styles';
import CertificateHistoryTab from './CertificateHistoryTab';
//import { getStatusIcon } from '../../../components/StatusIcon';
import TransactionListMaster from '../../../components/TransactionListMaster';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CertificateFilter from './CertificateFilter'
import { designProperties, transactionStatus } from '../../../components/Enumeration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { ProductList } from '../../testmanagement/testmaster-styled';
// import ReactTooltip from 'react-tooltip';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class CertificateHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            selectedCerHis: undefined,
            screenName: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            showSaveContinue: true,
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
        };
        this.breadCrumbData = [];
        this.searchRef = React.createRef();
        this.searchFieldList = [
            "scertificatehistorycode", "nreleasebatchcode", "sloginid", "suserrolename", "scomments", "scertificatetype"];
    }
    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "") {
            if (props.screenName === "IDS_CERTIFICATIONHISTORY") {
                toast.warn(props.Login.masterStatus);
                props.Login.masterStatus = "";
            }
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
                parentHeight: height
            });
        }
    }

    render() {
        // let goodsInStatusCSS = "";
        // if (this.props.Login.masterData.SelectedCerHis && this.props.Login.masterData.SelectedCerHis.ntransactionstatus === 15) {
        //     goodsInStatusCSS = "outline-secondary";
        // }
        // else {
        //     goodsInStatusCSS = "outline-success";
        // }

        let fromDate = "";
        let toDate = "";

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            fromDate = (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
            toDate = (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) || rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.ToDate);
        }
        const filterParam = {
            inputListName: "CerHis",
            selectedObject: "SelectedCerHis",
            primaryKeyField: "nreleasebatchcode",
            fetchUrl: "certificategeneration/getCertificateGeneration",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                fromDate, toDate
            },
            masterData: this.props.Login.masterData, unchangeList: ["FromDate", "ToDate"],
            changeList: ["Component", "PrintHistory", "ClockHistory"],
            searchFieldList: this.searchFieldList
        }

        const breadCrumbData = this.state.filterData || [];
        this.confirmMessage = new ConfirmMessage();
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    {breadCrumbData.length > 0 ?
                        <BreadcrumbComponent breadCrumbItem={breadCrumbData} /> : ""
                    }
                    {/* <div className="client-listing-wrap mtop-4"> */}
                    {/* Start of get display*/}
                    <Row noGutters={true}>
                        <Col md={12} className="parent-port-height sticky_head_parent" ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={30}>
                                <TransactionListMaster
                                    //  paneHeight={this.state.parentHeight}
                                    masterList={this.props.Login.masterData.searchedData ||
                                         sortData(this.props.Login.masterData.CerHis||[],"descending","nbatchcreationhistorycode") }
                                    selectedMaster={this.props.Login.masterData.SelectedCerHis}
                                    primaryKeyField="ncertificateversionhistorycode"
                                    getMasterDetail={(CerHis) => this.props.getCerHisDetail(CerHis, fromDate, toDate,
                                        this.props.Login.userInfo, this.props.Login.masterData)}
                                    inputParam={""}
                                    mainField="scertificatehistorycode"
                                    selectedListName="SelectedCerHis"
                                    objectName="Select"
                                    listName="IDS_CERTIFICATEHISTORY"
                                    needValidation={false}
                                    subFields={[{ [designProperties.VALUE]: "sproductname" }, { [designProperties.VALUE]: "smanufname" }, { [designProperties.LABEL]: "IDS_RELEASEBATCHCODE", [designProperties.VALUE]: "nreleasebatchcode" }, { [designProperties.VALUE]: "stransactionstatus", [designProperties.COLOUR]: "transstatuscolor" }] || []}
                                    needFilter={true}
                                    needMultiSelect={false}
                                    subFieldsLabel={true}
                                    mainFieldLabel={"Certificate Version"}
                                    openFilter={this.openFilter}
                                    closeFilter={this.closeFilter}
                                    onFilterSubmit={this.onFilterSubmit}
                                    skip={this.state.skip}
                                    take={this.state.take}
                                    handlePageChange={this.handlePageChange}
                                    filterColumnData={this.props.filterTransactionList}
                                    searchListName="searchedData"
                                    searchRef={this.searchRef}
                                    filterParam={filterParam}

                                    commonActions={
                                        <>
                                            {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                            <ProductList className="d-flex product-category float-right icon-group-wrap" data-tip="Refresh">
                                                <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                    onClick={() => this.reloadData(this.state.filterData, true, "reload")} >
                                                    <RefreshIcon className='custom_icons'/>
                                                </Button>
                                            </ProductList>
                                        </>
                                    }


                                    filterComponent={[
                                        {
                                            "IDS_FILTER":
                                                <CertificateFilter
                                                    selectedRecord={this.state.selectedRecord || {}}
                                                    handleDateChange={this.handleDateChange}
                                                    fromDate={fromDate}
                                                    toDate={toDate}
                                                    userInfo={this.props.Login.userInfo}
                                                />
                                        }
                                    ]}
                                />
                                {/* </Col> */}
                                <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={400}
                                    customClassName="fixed_list_height">
                                    <PerfectScrollbar>
                                        {/* <Col md={8}>  */}
                                        <div className="card_group">
                                            <ContentPanel className="panel-main-content">
                                                <Card className="border-0">
                                                    {this.props.Login.masterData.CerHis && this.props.Login.masterData.CerHis.length > 0 && this.props.Login.masterData.SelectedCerHis ?
                                                        <>
                                                            <Card.Header>
                                                                <Card.Title className="product-title-main">{this.props.Login.masterData.SelectedCerHis[0].scertificatetype}/{this.props.Login.masterData.SelectedCerHis[0].scertificatehistorycode}</Card.Title>
                                                                <Card.Subtitle className="text-muted font-weight-normal">
                                                                    <Row>
                                                                        <Col md={6} >
                                                                            <h2 className="product-title-sub flex-grow-1">

                                                                                <OutlineTransactionStatus transcolor={this.props.Login.masterData.SelectedCerHis[0].transstatuscolor}>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].stransactionstatus}
                                                                                </OutlineTransactionStatus>

                                                                                {this.props.Login.masterData.SelectedCerHis[0].ndecision !== transactionStatus.DRAFT ?
                                                                                    <DecisionStatus decisioncolor={this.props.Login.masterData.SelectedCerHis[0].decisioncolor}>
                                                                                        {this.props.Login.masterData.SelectedCerHis[0].sdecision}
                                                                                    </DecisionStatus>
                                                                                    : ""}
                                                                            </h2>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Subtitle>
                                                            </Card.Header>
                                                            <Card.Body className='form-static-wrap'>
                                                                <Card.Text>
                                                                    <Row>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_BATCHREGISTRATIONDATETIME" message="Batch Registration Date" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].sbatchregdate}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_GENERICPRODUCT" message="Generic Product" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].sproductname}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_MANUFACTURENAME" message="Manufacturename" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].smanufname}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_STUDYPLANNAME" message="StudyPlan" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].sspecname}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_BATCHFILLINGLOTNO" message="Batch Filling Lot No" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].sbatchfillinglotno}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_PACKINGLOTNO" message="Packing Lot No" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].spackinglotno === "" ? "-" : this.props.Login.masterData.SelectedCerHis[0].spackinglotno}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_MAHOLDERNAME" message="MA Holder Name" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].smahname}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_NOOFCONTAINER" message="No Of Container" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].nnoofcontainer}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_VALIDITYSTARTDATETIME" message="Validity Start Date" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].svaliditystartdate}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_EXPIRYDATETIME" message="Expiry Date" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].sexpirydate}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_LICENCENO" message="Licence No" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].slicencenumber}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel><FormattedMessage id="IDS_CERTIFICATETYPE" message="Certificate Type" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].scertificatetype}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_DECISIONSTATUS" message="Decision Status" />
                                                                                </FormLabel>
                                                                                <DecisionStatus style={{ marginLeft: "0rem" }}
                                                                                    decisioncolor={this.props.Login.masterData.SelectedCerHis[0].decisioncolor}>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].sdecision}
                                                                                </DecisionStatus>
                                                                                {/* <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].sdecision}
                                                                                </ReadOnlyText> */}
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_USERNAME" message="User Name" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].sloginid}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_USERROLE" message="User Role" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].suserrolename}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_CERTIFIEDDATETIME" message="Certified Date" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].scertificatedate}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_CERTIFIEDCOMMENTS" message="Certified Comments" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerHis[0].scomments === null || this.props.Login.masterData.SelectedCerHis[0].scomments === "" ? "-" : this.props.Login.masterData.SelectedCerHis[0].scomments}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <div className="horizontal-line"></div>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Text>
                                                            </Card.Body>
                                                        </>
                                                        : ""}
                                                </Card>
                                            </ContentPanel>
                                            <ContentPanel >
                                                {this.props.Login.masterData.CerHis && this.props.Login.masterData.CerHis.length > 0 && this.props.Login.masterData.SelectedCerHis ?
                                                    <Card className="border-0">
                                                        <Card.Body className='p-0'>
                                                            <Row className='no-gutters'>
                                                                <Col md={12}>
                                                                    <Card className='p-0'>
                                                                        <Card.Body>
                                                                            {this.props.Login.masterData.CerHis && this.props.Login.masterData.CerHis.length > 0 && this.props.Login.masterData.SelectedCerHis ?
                                                                                <>
                                                                                    <CertificateHistoryTab
                                                                                        formatMessage={this.props.intl.formatMessage}
                                                                                        operation={this.props.Login.operation}
                                                                                        inputParam={this.props.Login.inputParam}
                                                                                        screenName={this.props.Login.screenName}
                                                                                        userInfo={this.props.Login.userInfo}
                                                                                        masterData={this.props.Login.masterData}
                                                                                        masterStatus={this.props.Login.masterStatus}
                                                                                        selectedRecord={this.props.Login.selectedRecord}
                                                                                        screenData={this.props.Login.screenData}
                                                                                        showAccordian={this.state.showAccordian}
                                                                                        //selectedId={this.props.Login.selectedId}
                                                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                                                        controlMap={this.state.controlMap}
                                                                                        dataState={this.props.Login.dataState}
                                                                                        onTabChange={this.onTabChange}
                                                                                        searchRef={this.searchRef}
                                                                                        handleExpandChange={this.handleExpandChange}
                                                                                        childList={this.props.Login.testMap || new Map()}
                                                                                        settings = {this.props.Login.settings}
                                                                                    />
                                                                                </>
                                                                                : ""}
                                                                        </Card.Body>
                                                                    </Card>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                    : ""}
                                            </ContentPanel>
                                            {/* </Col> */}
                                        </div>
                                    </PerfectScrollbar>
                                </SplitterLayout>
                            </SplitterLayout >
                        </Col>
                    </Row>
                    {/* </div> */}
                </ListWrapper>
                {/* End of get display*/}

                {/* Start of Modal Sideout*/}
                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}

                {/* End of Modal Sideout for GoodsIn Creation */}
            </>
        );
    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        //  setTimeout(() => { this._scrollBarRef.updateScroll() })
    };


    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
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
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            this.setState({ filterData });
        }
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            let selectedRecord = this.state.selectedRecord
            let obj = convertDateValuetoString((selectedRecord && selectedRecord["fromdate"]) || this.props.Login.masterData.FromDate,
                (selectedRecord && selectedRecord["todate"]) || this.props.Login.masterData.ToDate,
                this.props.Login.userInfo)
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
    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onFilterSubmit = () => {
        this.reloadData(this.state.selectedRecord, true, "filtersubmit");
    }

    handleExpandChange = (row, dataState) => {
        const viewParam = {
            userInfo: this.props.Login.userInfo, primaryKeyField: "npreregno",
            masterData: this.props.Login.masterData
        };

        this.props.getTestParameter({
            ...viewParam, dataState,
            primaryKeyValue: row["dataItem"][viewParam.primaryKeyField], viewRow: row["dataItem"]
        });

    }

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

    reloadData = (selectedRecord, isDateChange, operation) => {
        this.searchRef.current.value = "";
        // let obj = convertDateValuetoString(this.state.filterData[0].value, this.state.filterData[1].value, this.props.Login.userInfo)
        // let fromDate = obj.fromDate;
        // let toDate = obj.toDate;
        // let currentdate = "";
        // const dataState=undefined;
        // if (operation === "filtersubmit") {
        //     obj = convertDateValuetoString((selectedRecord && selectedRecord["fromdate"]) || this.props.Login.masterData.FromDate,
        //         (selectedRecord && selectedRecord["todate"]) || this.props.Login.masterData.ToDate,
        //         this.props.Login.userInfo)

        //     currentdate = isDateChange === true ? null : formatInputDate(new Date(), true);
        //     fromDate = obj.fromDate;
        //     toDate = obj.toDate;
        // }
       
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
        if (operation === "filtersubmit") {
           // let selectedRecord = this.state.selectedRecord || {};
            if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
                fromDate = selectedRecord["fromdate"];
            }
            if (selectedRecord && selectedRecord["todate"] !== undefined) {
                toDate = selectedRecord["todate"];
            }
            
        }
        //let obj = this.convertDatetoString(fromDate, toDate); 
        console.log("date:", fromDate, toDate);
        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);  

        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                currentdate: null
            },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "CertificateHistory",
            displayName: "IDS_CERTIFICATEHISTORY",
            userInfo: this.props.Login.userInfo,
            dataState:undefined
        };
        this.props.callService(inputParam);
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential, updateStore,
    getCerHisDetail, filterTransactionList, getTestParameter
})(injectIntl(CertificateHistory));

