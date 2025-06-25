import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import CustomTabs from '../../../components/custom-tabs/custom-tabs.component';
import CerGenTabs from './CerGenTabs';



class CertificateGenerationTab extends Component {
    constructor(props) {
        super(props);

        const dataStateComponent = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        const dataStatePrintHistory = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        const dataStateClockHistory = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        const dataStateNullifiedHistory = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        const dataSentMailHistory={
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        this.state = {
            isOpen: false, 
            activeTab: 'IDS_COMPONENT-tab',
            selectedRecord: {}, dataResult: [],
            dataStateComponent: dataStateComponent,
            dataStatePrintHistory:dataStatePrintHistory,
            dataStateClockHistory:dataStateClockHistory,
            dataStateNullifiedHistory:dataStateNullifiedHistory,
            dataStateReportHistory:dataStateNullifiedHistory,
            dataSentMailHistory:dataSentMailHistory,
            dataStateVersionHistory: {skip: 0,take: this.props.settings ? parseInt(this.props.settings[14]) : 5,}
        };
    }
   
    ComponentDataStateChange = (event) => {
        this.setState({
            dataStateComponent: event.dataState
        });
    }

    TestParameterDataStateChange = (event) => {
        this.setState({
            dataStateTestParameter: event.dataState
        });
    }

    PrintHistoryDataStateChange = (event) => {
        this.setState({
            dataStatePrintHistory: event.dataState
        });
    }

    ClockHistoryDataStateChange = (event) => {
        this.setState({
            dataStateClockHistory: event.dataState
        });
    }

    NullifiedHistoryDataStateChange = (event) => {
        this.setState({
            dataStateNullifiedHistory: event.dataState
        });
    }
    ReportHistoryDataStateChange = (event) => {
        this.setState({
            dataStateReportHistory: event.dataState
        });
    }
  
    SentMailDataStateChange = (event) => {
        this.setState({
            dataSentMailHistory: event.dataState
        });
    }


    render() {
        return (
            <>
                 <Row className="no-gutters">
                    <Col md={12}>
                        <Card className="at-tabs">
                           <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.props.onTabChange} />
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }

    tabDetail = () => {
        const tabMap = new Map();
        tabMap.set("IDS_COMPONENT", <CerGenTabs 
            userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            masterData={this.props.masterData}
            primaryList={"Component"}
            dataResult={process(this.props.masterData["Component"]||[], this.state.dataStateComponent)}
            dataState={this.state.dataStateComponent }
           // dataStateChange={(event) => this.setState({ dataStateComponent: event.dataState })}
            dataStateChange={(event) => this.ComponentDataStateChange(event)}
            columnList={this.extractedComponentList}
            methodUrl={"CertificateGeneration"}
            selectedId={0}
            expandField="expanded"
            handleExpandChange={this.props.handleExpandChange}
            hasChild={true}
            childColumnList={this.TestColumnList}
            childList ={this.props.childList || new Map()}
        />)
        tabMap.set("IDS_CLOCKHISTORY", <CerGenTabs 
            userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            masterData={this.props.masterData}
            primaryList={"ClockHistory"}
            dataResult={process(this.props.masterData["ClockHistory"]||[], this.state.dataStateClockHistory)}
            dataState={this.state.dataStateClockHistory }
            dataStateChange={(event) => this.ClockHistoryDataStateChange(event)}
            columnList={this.extractedClockHistoryColumnList}
            methodUrl={"CertificateGeneration"}
            selectedId={0}
            expandField=""
            handleExpandChange={this.props.handleExpandChange}
            hasChild={false}
            childColumnList={this.TestColumnList}
            childList ={this.props.childList || new Map()}
        />)
        tabMap.set("IDS_BATCHREPORTHISTORY", <CerGenTabs 
            userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            masterData={this.props.masterData}
            primaryList={"ReportHistory"}
            dataResult={process(this.props.masterData["ReportHistory"]||[], this.state.dataStateReportHistory)}
            dataState={ this.state.dataStateReportHistory }
            dataStateChange={(event) => this.ReportHistoryDataStateChange(event)}
            columnList={this.extractedReportHistoryColumnList}
            methodUrl={"Cetrificate"}
            isActionRequired={true}
            selectedId={0}
            expandField=""
            handleExpandChange={this.props.handleExpandChange}
            hasChild={false}
            childColumnList={this.TestColumnList}
            childList ={this.props.childList || new Map()}
            viewDownloadFile= {this.props.viewDownloadFile}
            downloadParam = {{classUrl:"certificategeneration",operation:"download",methodUrl:"Report"}}
            hasControlWithOutRights={true}
            viewReportFile={this.props.viewReportFile}
            showDocViewer={true}
            isreportview={true}
            handleClickRegenrate={this.props.handleClickRegenrate}
        />)
        tabMap.set("IDS_PRINTHISTORY", <CerGenTabs 
             userRoleControlRights={this.props.userRoleControlRights}
             controlMap={this.props.controlMap}
             inputParam={this.props.inputParam}
             userInfo={this.props.userInfo}
             masterData={this.props.masterData}
             primaryList={"PrintHistory"}
             dataResult={process(this.props.masterData["PrintHistory"]||[], this.state.dataStatePrintHistory)}
             dataState={this.state.dataStatePrintHistory }
             dataStateChange={(event) => this.PrintHistoryDataStateChange(event)}
             columnList={this.extractedPrintHistoryColumnList}
             methodUrl={"CertificateGeneration"}
             selectedId={0}
             expandField=""
             handleExpandChange={this.props.handleExpandChange}
             hasChild={false}
             childColumnList={this.TestColumnList}
             childList ={this.props.childList || new Map()}
        />)

        tabMap.set("IDS_MAILSTATUS",
        <CerGenTabs
           // printHistory={this.props.Login.masterData.emailSentHistory}
            masterData={this.props.masterData}
            dataResult={process(this.props.masterData.emailSentHistory || [], this.state.dataSentMailHistory)}
            dataState={this.state.dataSentMailHistory}
            controlMap={this.props.controlMap}
            dataStateChange={(event) => this.SentMailDataStateChange(event)}
            userRoleControlRights={this.props.userRoleControlRights}
            userInfo={this.props.userInfo}
            inputParam={this.props.inputParam}
            selectedId={0}
            expandField=""
            columnList={this.mailHistColumnList}
            methodUrl={"CertificateGeneration"}
            //screenName="IDS_MAILSTATUS"
        />);
    tabMap.set("IDS_NULLIFIEDHISTORY", <CerGenTabs 
        userRoleControlRights={this.props.userRoleControlRights}
        controlMap={this.props.controlMap}
        inputParam={this.props.inputParam}
        userInfo={this.props.userInfo}
        masterData={this.props.masterData}
        primaryList={"NullifiedHistory"}
        dataResult={process(this.props.masterData["NullifiedHistory"]||[], this.state.dataStateNullifiedHistory)}
        dataState={this.state.dataStateNullifiedHistory}
        dataStateChange={(event) => this.NullifiedHistoryDataStateChange(event)}
        columnList={this.extractedNullifiedHistoryColumnList}
        methodUrl={"Cetrificate"}
        isActionRequired={true}
        selectedId={0}
        expandField=""
        handleExpandChange={this.props.handleExpandChange}
        hasChild={false}
        childColumnList={this.TestColumnList}
        childList ={this.props.childList || new Map()}
        downloadParam = {{classUrl:"certificategeneration",operation:"download",methodUrl:"Report"}}
        hasControlWithOutRights={true}
        viewReportFile={this.props.viewReportFile}
        showDocViewer={true}
        isreportview={true}
        viewDownloadFile= {this.props.viewDownloadFile}
   />)
    tabMap.set("IDS_CERTIFIEDHISTORY", <CerGenTabs 
         userRoleControlRights={this.props.userRoleControlRights}
         controlMap={this.props.controlMap}
         inputParam={this.props.inputParam}
         userInfo={this.props.userInfo}
         masterData={this.props.masterData}
         primaryList={"VersionHistory"}
         dataResult={process(this.props.masterData["VersionHistory"]||[], this.state.dataStateVersionHistory)}
         dataState={this.state.dataStateVersionHistory}
         dataStateChange={(event) => this.setState({ dataStateVersionHistory: event.dataState })}
         columnList={this.extractedVersionHistoryColumnList}
         methodUrl={"Cetrificate"}
         isActionRequired={false}
         selectedId={0}
         expandField=""
         hasChild={false}
         viewReportFile={this.props.viewReportFile}
         showDocViewer={true}
         isreportview={true}
         childList ={new Map()}
    />)
  
    return tabMap;
}

    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {
            let isOpen = false;
            if (this.props.errorCode !== undefined && (this.state.operation === "create" || this.state.operation === "update")) {
                isOpen = true;
            }
            let { dataStateVersionHistory,dataSentMailHistory, dataStateNullifiedHistory, dataStateClockHistory,
                dataStatePrintHistory,dataStateComponent,dataStateReportHistory } = this.state;
            if (this.props.dataState === undefined) {
                if (this.props.screenName === "IDS_COMPONENT") {
                    dataStateComponent = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                } else if (this.props.screenName === "IDS_BATCHREPORTHISTORY") {
                    dataStateReportHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                } else if (this.props.screenName === "IDS_NULLIFIEDHISTORY") {
                    dataStateNullifiedHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                }else if (this.props.screenName === "IDS_CERTIFIEDHISTORY") {
                    dataStateVersionHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                } else if (this.props.screenName === "IDS_CLOCKHISTORY") {
                    dataStateClockHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                } else if (this.props.screenName === "IDS_MAILSTATUS") {
                    dataSentMailHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                } else if (this.props.screenName === "IDS_PRINTHISTORY") {
                    dataStatePrintHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                }                
                else {
                    dataStateComponent = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                    dataStateReportHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                    dataStateNullifiedHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                    dataStateVersionHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                    dataStateClockHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                    dataSentMailHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                    dataStatePrintHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                }
            }
            this.setState({ isOpen, activeTab: 'IDSCOMPONENT-tab',
            dataStateVersionHistory,dataSentMailHistory,
            dataStateNullifiedHistory, dataStateClockHistory,
           dataStatePrintHistory,dataStateComponent,dataStateReportHistory });
        }
        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }
       
    }

    extractedComponentList = [{  "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" },
        {  "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", "width": "250px" },
        {  "idsName": "IDS_MANUFACTUREBATCHLOTNO", "dataField": "sbatchfillinglotno", "width": "200px" },
        {  "idsName": "IDS_DATERECEIVED", "dataField": "sreceiveddate", "width": "250px" },
    ]

   
    extractedPrintHistoryColumnList = [
        {  "idsName": "IDS_PRINTCOUNT", "dataField": "nprintcount", "width": "150px" },
        {  "idsName": "IDS_PRINTDATE", "dataField": "sprintdate", "width": "200px" },
        {  "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "250px" },
        {  "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "150px" },       
        {  "idsName": "IDS_PRINTCOMMENTS", "dataField": "scomments", "width": "250px" },
       
    ]
    extractedClockHistoryColumnList = [
        {  "idsName": "IDS_CLOCKSTATUS", "dataField": "stransdisplaystatus", "width": "150px" },
        {  "idsName": "IDS_ACTIONTYPE", "dataField": "sactionstatus", "width": "150px" },
        {  "idsName": "IDS_TRANSDATE", "dataField": "sapproveddate", "width": "250px" },
        {  "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "250px" },
        {  "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "200px" },
        {  "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "150px" },         
    ]
    extractedNullifiedHistoryColumnList = [
        {  "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "150px" },
        {  "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
        {   "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "150px" },
        {  "idsName": "IDS_NULLIFIEDDATETIME", "dataField": "sgeneratedtime", "width": "250px" },
        { "idsName": "IDS_COMMENTS", "dataField": "sreportcomments", "width": "250px" },
       
    ]
    
    extractedReportHistoryColumnList = [
        {  "idsName": "IDS_VERSION", "dataField": "nversioncode", "width": "150px" },
        {  "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "150px" },
        {  "idsName": "IDS_REPORTDATE", "dataField": "sgeneratedtime", "width": "250px" },
        {  "idsName": "IDS_USERNAME", "dataField": "susername", "width": "250px" },
        {   "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "150px" },       
        { "idsName": "IDS_REPORTCOMMENTS", "dataField": "sreportcomments", "width": "250px" },
       
    ]

    extractedVersionHistoryColumnList = [
        {  "idsName": "IDS_VERSION", "dataField": "nversioncode", "width": "150px" },
        {  "idsName": "IDS_CERTIFIEDDATE", "dataField": "scertificatedate", "width": "250px" },
        {  "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "250px" },
        {   "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "250px" },
       
    ]

    TestColumnList=[{"idsName":"IDS_TESTNAME","dataField":"stestsynonym", "width":"250px"},
        {"idsName":"IDS_PARAMETERNAME","dataField":"sparametersynonym","width":"250px"},
        //{"idsName":"IDS_UNITS","dataField":"sunitname","width":"100px"},
        {"idsName":"IDS_RESULT","dataField":"sresult","width":"150px"},
        {"idsName":"IDS_RESULTFLAG","dataField":"sgradename","width":"100px"},
        {"idsName":"IDS_RESULTDATE","dataField":"sentereddate","width":"100px"},
        {"idsName":"IDS_STATUS","dataField":"stransdisplaystatus","width":"100px"},
    ];

    mailHistColumnList = [
        {"idsName":"IDS_EMAILID","dataField":"semail","width":"200px"},
        {"idsName":"IDS_TRANSACTIONDATE","dataField":"stransdate","width":"250px"},
        {"idsName":"IDS_EMAILSTATUS","dataField":"smailstatus","width":"200px"},
 
    ];
}
export default injectIntl(CertificateGenerationTab);