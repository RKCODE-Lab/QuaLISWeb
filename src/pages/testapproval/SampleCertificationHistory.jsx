import React, { Component } from 'react';
import CustomTab from '../../components/custom-tabs/custom-tabs.component';
import { Row, Col, Card, FormGroup, FormLabel, Button } from 'react-bootstrap';
import {
    callService, crudMaster, updateStore, getSampleCertTypeChange, getSampleCertRegSubTypeChange, filterColumnData,
    getTestResultDataHistory, getActiveSampleHistory, generateCertificateAction, sentCertificateAction, correctionCertificateAction, xmlExportAction, getWholeFilterStatusHistory
} from '../../actions'
import { getControlMap,convertDateValuetoString,rearrangeDateFormat} from '../../components/CommonScript';
import { constructOptionList, validateTwoDigitDate } from '../../components/CommonScript';
import ApprovalHistory from './ApprovalHistory';
import PrintHistory from './PrintHistory';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import Results from './Results';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { FormattedMessage, injectIntl } from 'react-intl';
import SampleCertificationHistoryFilter from './SampleCertificationHistoryFilter';
import { ReadOnlyText, ContentPanel, OutlineTransactionStatus, DecisionStatus  } from '../../components/App.styles';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import TransactionListMaster from '../../components/TransactionListMaster';
import { designProperties } from '../../components/Enumeration';
import SplitterLayout from "react-splitter-layout";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ListWrapper } from '../../components/client-group.styles';
import { ProductList } from '../product/product.styled';
import { process } from '@progress/kendo-data-query';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';




const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class SampleCertificationHistory extends Component {
    constructor(props) {
        super(props);
        const appHistoryDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        const resultsDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        const printHistoryDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        const dataStateReportHistory = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        
        this.searchSampleRef = React.createRef();
        this.state = {
            openModal: false,
            masterStatus: "",
            controlMap: new Map(),
            error: "",
            selectedRecord: {},
            selectedFilter: {},
            userRoleControlRights: [],
            appHistoryDataState,
            resultsDataState,
            printHistoryDataState,
            dataStateReportHistory,
            skip: 0,
            take: this.props.Login.settings ? this.props.Login.settings[3] : 25
        }

        this.searchRef = React.createRef();
        this.searchFieldList =  ["scomponentname","sarno","sproductname","ssamplecertificateversioncode","sversion",
		"smanufname","sspecname","nrmsno","dtransactiondate","smanuflotno"]
    }


    onSampleTypeChange = (event, fieldName, labelname) => {
        if (event !== null) {
            let Map = {};
            Map["nsampletypecode"] = parseInt(event.value);
            Map['userinfo'] = this.props.Login.userInfo;
            this.props.getSampleCertTypeChange(Map, this.props.Login.masterData, event, labelname);
        }
    }

    onRegSubTypeChange = (comboData, fieldName) => {
        const regSubTypeValue = this.state.regSubTypeValue || {};
        regSubTypeValue[fieldName] = comboData;
        this.setState({ regSubTypeValue });
        //this.props.getSampleCertRegSubTypeChange(Map, this.props.Login.masterData, event, labelname);

    }


    onFilterChange = (comboData, fieldName) => {
        const FilterStatusValue = this.state.FilterStatusValue || {};
        FilterStatusValue[fieldName] = comboData;
        this.setState({ FilterStatusValue });
        //this.props.getSampleCertRegSubTypeChange(Map, this.props.Login.masterData, event, labelname);

    }



    onRegTypeChange = (event, fieldName, labelname) => {
        if (event !== null) {
            let Map = {};
            Map["nregtypecode"] = parseInt(event.value);
            Map['userinfo'] = this.props.Login.userInfo;
            this.props.getSampleCertRegSubTypeChange(Map, this.props.Login.masterData, event, labelname);
        }
    }


    handleExpandChange = (row, dataState) => {

        const viewParam = {
            TransactionSampleResults: this.props.Login.masterData.TransactionSampleResults,
            userInfo: this.props.Login.userInfo,
            primaryKeyField: "ntransactiontestcode",
            npreregno: "npreregno",
            masterData: this.props.Login.masterData
        };
        this.props.getTestResultDataHistory({
            ...viewParam, dataState,
            primaryKeyValue: row["dataItem"][viewParam.primaryKeyField], viewRow: row["dataItem"]
        });
    }




    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }



    handleFilterDateChange = (dateName, dateValue) => {
        const { selectedFilter } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedFilter[dateName] = dateValue;
        this.setState({ selectedFilter });
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
        if (props.Login.showConfirmAlert !== state.showConfirmAlert) {
            return {
                showConfirmAlert: props.Login.showConfirmAlert
            }
        }
        // if (props.Login.selectComponent !== state.selectComponent) {
        //     return {
        //         selectComponent: props.Login.selectComponent
        //     }
        // }
        return null;
    }


    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        // setTimeout(() => { this._scrollBarRef.updateScroll() })
    };


    onFilterSubmit = () => {
        let SampleTypeValue = this.state.SampleTypeValue?this.state.SampleTypeValue.nsampletypecode:""
    
   if(SampleTypeValue){
        let RealSampleTypeValue = this.state.SampleTypeValue ? this.state.SampleTypeValue.nsampletypecode.label : ""
        let RealRegTypeValue = this.state.RegTypeValue ? this.state.RegTypeValue.nregtypecode.label : ""
        let RealRegSubTypeValue = this.state.regSubTypeValue ? this.state.regSubTypeValue.nregsubtypecode.label : ""
        let RealFromDate = new Date(this.state.selectedFilter.fromdate || this.props.Login.masterData.FromDate)
        let RealToDate = new Date(this.state.selectedFilter.todate || this.props.Login.masterData.ToDate)       
        let inputData = {
            nsampletypecode: this.state.SampleTypeValue.nsampletypecode.value,
            nregtypecode: this.state.RegTypeValue.nregtypecode.value,
            nregsubtypecode: this.state.regSubTypeValue.nregsubtypecode.value,
            // nfilterstatus: this.state.FilterStatusValue.ntransactionstatus.value,
            userinfo: this.props.Login.userInfo
        }
        let masterData = {
            ...this.props.Login.masterData, RealSampleTypeValue, RealRegTypeValue, RealRegSubTypeValue,
            RealFromDate, RealToDate
        }

        let obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.RealFromDate,
            this.state.selectedFilter.todate || this.props.Login.masterData.RealToDate,this.props.Login.userInfo)
        inputData['FromDate'] = obj.fromDate;
        inputData['ToDate'] = obj.toDate;
        this.props.getWholeFilterStatusHistory(masterData, inputData, "FilterSubmit",  {printHistoryDataState:this.state.printHistoryDataState,
            appHistoryDataState:this.state.appHistoryDataState,
            resultsDataState:this.state.resultsDataState});
        }else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
        }

    }

    reloadData = () => {
        let SampleTypeValue = this.state.SampleTypeValue?this.state.SampleTypeValue.nsampletypecode:""
        if(SampleTypeValue){
        let inputData = {
            nsampletypecode: this.state.SampleTypeValue.nsampletypecode.value,
            nregtypecode: this.state.RegTypeValue.nregtypecode.value,
            nregsubtypecode: this.props.Login.masterData.RegistrationSubTypeValue ? this.props.Login.masterData.RegistrationSubTypeValue.nregsubtypecode :
                this.state.regSubTypeValue ? this.state.regSubTypeValue.nregsubtypecode.value : "",
            userinfo: this.props.Login.userInfo
        }

        let obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.RealFromDate,
            this.state.selectedFilter.todate || this.props.Login.masterData.RealToDate,this.props.Login.userInfo)
        inputData['FromDate'] = obj.fromDate;
        inputData['ToDate'] = obj.toDate;
        //let inputParam = { masterData, inputData }
        // const FilterStatusValue ={ntransactionstatus: this.state.FilterStatusValue.ntransactionstatus?
        //     this.state.FilterStatusValue.ntransactionstatus.label: ""};
        // this.setState({FilterStatusValue});
        this.props.getWholeFilterStatusHistory(this.props.Login.masterData, inputData, "FilterSubmit",  {printHistoryDataState:this.state.printHistoryDataState,
            appHistoryDataState:this.state.appHistoryDataState,
            resultsDataState:this.state.resultsDataState});
        }else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
        }

    }

    covertDatetoString(startDateValue, endDateValue) {
        const startDate = new Date(startDateValue);
        const endDate = new Date(endDateValue);

        const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
        const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
        const prevDay = validateTwoDigitDate(String(startDate.getDate()));
        const currentDay = validateTwoDigitDate(String(endDate.getDate()));
        const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay
        const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay

        const fromDate = fromDateOnly + "T00:00:00";
        const toDate = toDateOnly + "T23:59:59";
        return ({ fromDate, toDate, breadCrumbFrom: fromDateOnly, breadCrumbto: toDateOnly })
    }

    tabDetail = () => {
        const tabMap = new Map();
        tabMap.set("IDS_APPROVALHISTORY",
            <ApprovalHistory
                approvalHistory={this.props.Login.masterData.approvalHistory}
                dataResult={process(this.props.Login.masterData.approvalHistory || [], this.state.appHistoryDataState)}
                dataState={(this.props.Login.screenName === "" || this.props.Login.screenName === "IDS_APPROVALHISTORY") ? this.state.appHistoryDataState : { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }}
                controlMap={this.state.controlMap}
                userInfo={this.props.Login.userInfo}
                dataStateChange={(event) => this.setState({ appHistoryDataState: event.dataState })}
                userRoleControlRights={this.state.userRoleControlRights}
                screenName="IDS_APPROVALHISTORY"
            />
        );

        tabMap.set("IDS_PRINTHISTORY",
            <PrintHistory
                printHistory={this.props.Login.masterData.printHistory}
                dataResult={process(this.props.Login.masterData.printHistory || [], this.state.printHistoryDataState)}
                dataState={(this.props.Login.screenName === "" || this.props.Login.screenName === "IDS_PRINTHISTORY") ? this.state.printHistoryDataState : { skip: 0, take: 10 }}
                controlMap={this.state.controlMap}
                dataStateChange={(event) => this.setState({ printHistoryDataState: event.dataState })}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                inputParam={this.props.Login.inputParam}
                screenName="IDS_PRINTHISTORY"
            />);


        tabMap.set("IDS_RESULTS",
            <Results
                TransactionSampleTests={this.props.Login.masterData.TransactionSampleTests}
                dataResult={process(this.props.Login.masterData.TransactionSampleTests || [], this.state.resultsDataState)}
                dataState={(this.props.Login.screenName === "" || this.props.Login.screenName === "IDS_RESULTS") ? this.state.resultsDataState : { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }}
                controlMap={this.state.controlMap}
                dataStateChange={(event) => this.setState({ resultsDataState: event.dataState })}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                inputParam={this.props.Login.inputParam}
                handleExpandChange={this.handleExpandChange}
                screenName="IDS_RESULTS"
                childList={this.props.Login.masterData.sampleTestResults}
                childMappingField={"ntransactiontestcode"}
                hasChild={true}
            // childList ={props.childList || new Map()}
            />);


    //         tabMap.set("IDS_SAMPLEREPORTHISTORY", <SampleReportHistory 
    //         userRoleControlRights={this.props.userRoleControlRights}
    //         controlMap={this.props.controlMap}
    //         inputParam={this.props.inputParam}
    //         userInfo={this.props.userInfo}
    //         masterData={this.props.masterData}
    //         primaryList={"ReportHistory"}
    //         dataResult={process(this.props.masterData["ReportHistory"]||[], this.state.dataStateReportHistory)}
    //         dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_BATCHREPORTHISTORY") ? this.state.dataStateReportHistory : { skip: 0, take: 10 }}
    //         dataStateChange={(event) => this.setState({ dataStateReportHistory: event.data })}
    //         columnList={this.extractedReportHistoryColumnList}
    //         methodUrl={"Cetrificate"}
    //         isActionRequired={true}
    //         selectedId={0}
    //         expandField=""
    //         handleExpandChange={this.props.handleExpandChange}
    //         hasChild={false}
    //         childColumnList={this.TestColumnList}
    //         childList ={this.props.childList || new Map()}
    //         viewDownloadFile= {this.props.viewDownloadFile}
    //         downloadParam = {{classUrl:"certificategeneration",operation:"download",methodUrl:"Report"}}
    //         hasControlWithOutRights={true}
    //         showDocViewer={true}
    //         handleClickRegenrate={this.props.handleClickRegenrate}
    //    />)

        return tabMap;

    }

    render() {
        const { SelectedRegistration, searchedData, Registration } = this.props.Login.masterData;
    

        // if (Registration) {
        //     sortData(Registration, "descending", "nregcertificatecode");
        // }
        const getSample = {
            screenName: "IDS_SAMPLECERTIFICATIONGENERATION", operation: "get", masterData: this.props.Login.masterData,
            userInfo: this.props.Login.userInfo, methodUrl: "SampleCertification", keyName: "samplecertification"
        };
        this.fromDate = (this.state.selectedFilter["fromdate"] && this.state.selectedFilter["fromdate"]) || rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.RealFromDate);
        this.toDate = (this.state.selectedFilter["todate"] && this.state.selectedFilter["todate"]) || rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.RealToDate);
       

        let obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.RealFromDate,
            this.state.selectedFilter.todate || this.props.Login.masterData.RealToDate,this.props.Login.userInfo)

        this.breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom || this.state.RealFromDate
            }, {
                "label": "IDS_TO",
                "value": obj.breadCrumbto || this.state.RealToDate
            },
            {
                "label": "IDS_SAMPLETYPE",
                //"value": this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.ssampletypename
                "value": this.state.RealSampleTypeValue
            }, {
                "label": "IDS_REGTYPE",
                "value": this.state.RealRegTypeValue
            }, {
                "label": "IDS_REGSUBTYPE",
                "value": this.state.RealRegSubTypeValue
            },
            // {
            //     "label": "IDS_FILTERSTATUS",
            //     "value": this.state.RealFilterValue
            // }
        ]


        const filterParam = {
            inputListName: "Registration", selectedObject: "SelectedRegistration", primaryKeyField: "nregcertificatecode",
            fetchUrl: "samplecertificationhistory/getSampleCertificationById", fecthInputObject: { userinfo: this.props.Login.userInfo }, masterData: this.props.Login.masterData,
            searchFieldList: this.searchFieldList
        };


        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    {this.breadCrumbData.length > 0 ?
                        <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} /> : ""
                    }

                    <Row noGutters={true}>
                        <Col md={12} className="parent-port-height sticky_head_parent" ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={30}
                            >
                                <TransactionListMaster
                                    masterList={searchedData || Registration || []}
                                    selectedMaster={[SelectedRegistration]}
                                    primaryKeyField="nregcertificatecode"
                                    getMasterDetail={(SampleCertification) => this.props.getActiveSampleHistory(SampleCertification, this.props.Login.userInfo, this.props.Login.masterData,
                                                                        {printHistoryDataState:this.state.printHistoryDataState,
                                                                         appHistoryDataState:this.state.appHistoryDataState,
                                                                         resultsDataState:this.state.resultsDataState}
                                                                        )}
                                    inputParam={getSample}
                                    additionalParam={[]}
                                    mainField="scomponentname"
                                    // selectedListName="smanuflotno"
                                    // objectName="sarno"
                                    listName="IDS_SAMPLE"
                                    showStatusLink={true}
                                    subFields={
                                        [
                                            { [designProperties.VALUE]: "smanuflotno" },
                                            { [designProperties.VALUE]: "sarno" },
                                        ]
                                    }
                                    // moreField="sarno"
                                    //needValidation={false}
                                    needFilter={true}
                                    filterColumnData={this.props.filterColumnData}
                                    searchListName="searchedData"
                                    searchRef={this.searchRef}
                                    filterParam={filterParam}
                                    handlePageChange={this.handlePageChange}
                                    onFilterSubmit={this.onFilterSubmit}
                                    skip={this.state.skip}
                                    take={this.state.take}
                                    commonActions={
                                        <ProductList className="d-flex product-category float-right icon-group-wrap">
                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                onClick={() => this.reloadData()} 
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })} >
                                                    <RefreshIcon className='custom_icons'/>
                                            </Button>
                                        </ProductList>
                                    }
                                    filterComponent={[
                                        {
                                            "IDS_SAMPLECERTIFICATEGENERATION": <SampleCertificationHistoryFilter
                                                formatMessage={this.props.intl.formatMessage}
                                                Product={this.props.Login.masterData.MAHProduct || []}
                                                SampleType={this.state.SampleType || []}
                                                RegistrationType={this.state.RegistrationType || []}
                                                RegistrationSubType={this.state.RegistrationSubType || []}
                                                FilterStatus={this.state.FilterList || []}
                                                userInfo={this.props.Login.userInfo || {}}
                                                SampleTypeValue={this.state.SampleTypeValue || {}}
                                                RegTypeValue={this.state.RegTypeValue || {}}
                                                regSubTypeValue={this.state.regSubTypeValue || {}}
                                                FilterStatusValue={this.state.FilterStatusValue || {}}
                                                FromDate={this.fromDate}
                                                ToDate={this.toDate}
                                                onSampleTypeChange={this.onSampleTypeChange}
                                                onRegTypeChange={this.onRegTypeChange}
                                                onRegSubTypeChange={this.onRegSubTypeChange}
                                                handleFilterDateChange={this.handleFilterDateChange}
                                                onFilterChange={this.onFilterChange}
                                            />
                                        }
                                    ]}
                                />
                                <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={400}
                                    customClassName="fixed_list_height">
                                    <PerfectScrollbar>
                                        <div className="card_group">
                                            <ContentPanel className="panel-main-content">
                                                <Card className="border-0">
                                                    {this.props.Login.masterData.SelectedRegistration ?
                                                        <>
                                                            <Card.Header>
                                                                <Card.Title className="product-title-main">
                                                                    {this.props.Login.masterData.SelectedRegistration.scomponentname}
                                                                </Card.Title>

                                                                <Card.Subtitle>
                                                                    <div className="d-flex product-category">
                                                                        <h2 className="product-title-sub flex-grow-1">

                                                                        <OutlineTransactionStatus
                                                                                transcolor={this.props.Login.masterData.SelectedRegistration.scolorhexcode}>
                                                                                {this.props.Login.masterData.SelectedRegistration.stransdisplaystatus}
                                                                        </OutlineTransactionStatus>
                                                                            {/* <DecisionStatus
                                                                                decisioncolor={this.props.Login.masterData.SelectedRegistration.sdecisioncolor}>
                                                                                {this.props.Login.masterData.SelectedRegistration.sdecisionstatus}
                                                                            </DecisionStatus> */}
                                                                            {/* <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                                                {activeIconCSS !== "" ? <i class={activeIconCSS}></i> : ""}
                                                                                <FormattedMessage id={this.props.Login.masterData.SelectedRegistration.sdecisionstatus} />
                                                                            </span>
                                                                            {" "}
                                                                            <MediaLabel style={{ color: this.props.Login.masterData.SelectedRegistration ? this.props.Login.masterData.SelectedRegistration.scolorhexcode : "" }}>
                                                                                <FormattedMessage id={this.props.Login.masterData.SelectedRegistration.stransdisplaystatus} />
                                                                            </MediaLabel> */}
                                                                        </h2>

                                                                    </div>
                                                                </Card.Subtitle>
                                                            </Card.Header>
                                                            <Row>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_ARNO" message="Arno" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.sarno}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_COMPONENTNAME" message="Componentname" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.scomponentname}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_GENERICPRODUCT" message="Genericproduct" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.sproductname}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_VERSION" message="Version" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.sversion}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_MANUFACTURENAME" message="Manufacturename" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.smanufname}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_CERTIFICATENUMBER" message="Certificatenumber" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.ssamplecertificateversioncode}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>


                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_SPECIFICATIONSTUDYPLAN" message="Specificationname" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.sspecname}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_RMSNO" message="Rmsno" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.nrmsno}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_REGISTRATIONDATE" message="RegistrationDate" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.dtransactiondate}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_BATCHLOTNO" message="Batchlotno" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.smanuflotno}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_DECISIONSTATUS" message="Decisionstatus" /></FormLabel>
                                                                        <DecisionStatus
                                                                          decisioncolor={this.props.Login.masterData.SelectedRegistration.sdecisioncolor}>
                                                                          {this.props.Login.masterData.SelectedRegistration.sdecisionstatus}
                                                                        </DecisionStatus> 
                                                                        {/* <ReadOnlyText>{this.props.Login.masterData.SelectedRegistration.sdecisionstatus}</ReadOnlyText> */}
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col>
                                                                    <div className="horizontal-line"></div>
                                                                </Col>
                                                            </Row>

                                                            <CustomTab tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                                                        </>
                                                        : ""}
                                                </Card>
                                            </ContentPanel>
                                        </div>
                                    </PerfectScrollbar>
                                </SplitterLayout>
                            </SplitterLayout >
                        </Col>
                    </Row>
                </ListWrapper>
            </>
        );
    }

    componentDidUpdate(previousProps) {

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const SampleMap = constructOptionList(this.props.Login.masterData.SampleType || [], "nsampletypecode",
                "ssampletypename", undefined, undefined, true);
            const SampleType = SampleMap.get("OptionList");
            const SampleTypeValue = { nsampletypecode: SampleType.length > 0 ? SampleType[0] : "" };

            const RegMap = constructOptionList(this.props.Login.masterData.RegistrationType || [], "nregtypecode",
                "sregtypename", undefined, undefined, true);
            const RegistrationType = RegMap.get("OptionList");
            const RegTypeValue = { nregtypecode: RegistrationType.length > 0 ? RegistrationType[0] : "" };

            const RegSubMap = constructOptionList(this.props.Login.masterData.RegistrationSubType || [], "nregsubtypecode",
                "sregsubtypename", 'nsorter', "ascending", false);
            const RegistrationSubType = RegSubMap.get("OptionList");
            //const regSubTypeValue = {nregsubtypecode: RegistrationSubType.length> 0? RegistrationSubType[2]: ""};

            const FilterStatus = constructOptionList(this.props.Login.masterData.FilterStatus || [], "napprovalstatuscode",
                "stransdisplaystatus", undefined, undefined, true);
            const FilterList = FilterStatus.get("OptionList")
            let FilterStatusValue = {};
            let regSubTypeValue = {};
            if (this.props.Login.masterData.operation === "FilterSubmit") {
                FilterStatusValue = this.state.FilterStatusValue
                regSubTypeValue = this.state.regSubTypeValue
            } else {
                FilterStatusValue = { ntransactionstatus: FilterList.length > 0 ? FilterList[1] : "" };
                regSubTypeValue = { nregsubtypecode: RegistrationSubType.length > 0 ?
                    {label:this.props.Login.masterData.RegistrationSubTypeValue.sregsubtypename,
                    value:this.props.Login.masterData.RegistrationSubTypeValue.nregsubtypecode,
                    item:this.props.Login.masterData.ApprovalVersionValue}
                    : "" };
            }


            let RealFilterValue = {};
            let RealRegSubTypeValue = {};
            let RealFromDate = {};
            let RealToDate = {};
            if (this.props.Login.masterData.RealFilterValue !== previousProps.Login.masterData) {

                RealFilterValue = this.props.Login.masterData.RealFilterValue ? this.props.Login.masterData.RealFilterValue :
                    this.props.Login.masterData.FilterStatusValue ? this.props.Login.masterData.FilterStatusValue.stransdisplaystatus : ""

            }

            if (this.props.Login.masterData.RealRegSubTypeValue !== previousProps.Login.masterData) {

             RealRegSubTypeValue = this.props.Login.masterData.RealRegSubTypeValue ? this.props.Login.masterData.RealRegSubTypeValue:
                   this.props.Login.masterData.RegistrationSubTypeValue?this.props.Login.masterData.RegistrationSubTypeValue.sregsubtypename:""
                   
                // RealRegSubTypeValue = this.props.Login.masterData.RealRegSubTypeValue ? this.props.Login.masterData.RealRegSubTypeValue :
                //     this.props.Login.masterData.RegistrationSubTypeValue ? this.props.Login.masterData.RegistrationSubTypeValue.sregsubtypename : ""

            }

            if (this.props.Login.masterData.RealFromDate !== previousProps.Login.masterData) {

                RealFromDate = this.props.Login.masterData.RealFromDate ? this.props.Login.masterData.RealFromDate :
                    this.props.Login.masterData.RealFromDate ? this.props.Login.masterData.RealFromDate : ""

            }


            if (this.props.Login.masterData.RealToDate !== previousProps.Login.masterData) {

                RealToDate = this.props.Login.masterData.RealToDate ? this.props.Login.masterData.RealToDate :
                    this.props.Login.masterData.RealToDate ? this.props.Login.masterData.RealToDate : ""

            }

            // if (this.props.Login.masterData.Registration !== previousProps.Login.masterData) {

            //     const  Registration  = this.props.Login.masterData;
            //     sortData(Registration, "descending", "nregcertificatecode");

            // }

            let { printHistoryDataState, appHistoryDataState, resultsDataState} = this.state;
          
            let  isStateChanged = false;
            if (this.props.Login.printHistoryDataState && this.props.Login.printHistoryDataState !== previousProps.Login.printHistoryDataState) {
                printHistoryDataState = this.props.Login.printHistoryDataState;
                isStateChanged = true;
            }
            if (this.props.Login.appHistoryDataState && this.props.Login.appHistoryDataState !== previousProps.Login.appHistoryDataState) {
                appHistoryDataState = this.props.Login.appHistoryDataState;
                isStateChanged = true;
            }
            if (this.props.Login.resultsDataState && this.props.Login.resultsDataState !== previousProps.Login.resultsDataState) {
                resultsDataState = this.props.Login.resultsDataState;
                isStateChanged = true;
            }

            const RealSampleTypeValue = this.props.Login.masterData.SampleTypeValue ? this.props.Login.masterData.SampleTypeValue.ssampletypename : ""
            const RealRegTypeValue = this.props.Login.masterData.RegistrationTypeValue ? this.props.Login.masterData.RegistrationTypeValue.sregtypename : ""
            if (isStateChanged)
            {
                this.setState({printHistoryDataState, appHistoryDataState, resultsDataState,
                    SampleType, RegistrationType, RegistrationSubType, FilterList, SampleTypeValue, RegTypeValue, RealSampleTypeValue,
                    regSubTypeValue, FilterStatusValue, RealRegTypeValue, RealRegSubTypeValue, RealFilterValue, RealFromDate, RealToDate
                });
            }  
            else{
                this.setState({
                    SampleType, RegistrationType, RegistrationSubType, FilterList, SampleTypeValue, RegTypeValue, RealSampleTypeValue,
                    regSubTypeValue, FilterStatusValue, RealRegTypeValue, RealRegSubTypeValue, RealFilterValue, RealFromDate, RealToDate
                });  
            }      

        }
        // if (this.props.Login.masterData.RealFilterValue !== previousProps.Login.masterData)  {

        //     const RealFilterValue = this.props.Login.masterData.RealFilterValue ? this.props.Login.masterData.RealFilterValue:""

        //     this.setState({RealFilterValue});
        //  }
        //else{
        //     const RealFilterValue = this.props.Login.masterData.RealFilterValue ? this.props.Login.masterData.RealFilterValue:""

        //     //this.setState({RealFilterValue});
        // }this.state.regSubTypeValue




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



}
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, getSampleCertTypeChange, filterColumnData,
    getSampleCertRegSubTypeChange, getTestResultDataHistory, getActiveSampleHistory, generateCertificateAction, sentCertificateAction,
    correctionCertificateAction, xmlExportAction, getWholeFilterStatusHistory
}
)(injectIntl(SampleCertificationHistory));