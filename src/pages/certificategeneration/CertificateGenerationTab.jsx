import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import CerGenTabs from './CerGenTabs';
import { faFlushed } from '@fortawesome/free-solid-svg-icons';


class CertificateGenerationTab extends Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: 10,
        };
       
        const dataStateComponent = {
            skip: 0,
            take: 10,
        };
        // const dataStateTestParameter = {
        //     skip: 0,
        //     take: 10,
        //     group:[{field:'sarno'}]
        // };
        const dataStatePrintHistory = {
            skip: 0,
            take: 10,
        };
        const dataStateClockHistory = {
            skip: 0,
            take: 10,
        };
        const dataStateNullifiedHistory = {
            skip: 0,
            take: 10,
        };
        const dataSentMailHistory={
            skip: 0,
            take: 10,
        };
        this.state = {
            isOpen: false, 
            activeTab: 'IDS_COMPONENT-tab',
            selectedRecord: {}, dataResult: [],
            dataState: dataState, 
            dataStateComponent: dataStateComponent,
            dataStatePrintHistory:dataStatePrintHistory,
            dataStateClockHistory:dataStateClockHistory,
            dataStateNullifiedHistory:dataStateNullifiedHistory,
            dataSentMailHistory:dataSentMailHistory,
            // dataStateTestParameter:dataStateTestParameter,
            listReport:[],listDashBoard:[],listAlert:[]
        };
        //this.onMultiColumnValue = this.onMultiColumnValue.bind(this);
       // this.ProductmaholderFieldList = ['sdashboardtypename']
    }
    // dataStateChange = (event) => {
    //     this.setState({
    //         dataState: event.dataState
    //     });
    // }

  
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
        // tabMap.set("IDS_CERTIFICATE", <CerGenTabs
        //     userRoleControlRights={this.props.userRoleControlRights}
        //     controlMap={this.props.controlMap}
        //     inputParam={this.props.inputParam}
        //     userInfo={this.props.userInfo}
        //     comboDataService={this.props.getDashBoardRightsComboDataService}
        //     //primaryKeyField={"ndashboardtypecode"}
        //     masterData={this.props.masterData}
        //     primaryList={"Certificate"}
        //     dataResult={process(this.props.masterData["Certificate"], this.state.dataState)}
        //     dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_CERTIFICATE") ? this.state.dataState : { skip: 0, take: 10 }}
        //     dataStateChange={(event) => this.setState({ dataState: event.data })}
        //     columnList={this.extractedcertificateList}
        //     methodUrl={"CertificateGeneration"}
        //     selectedId={0}
        // />)
        tabMap.set("IDS_COMPONENT", <CerGenTabs 
        userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
           // primaryKeyField={"nreportrightscode"}
            masterData={this.props.masterData}
            primaryList={"Component"}
            dataResult={process(this.props.masterData["Component"], this.state.dataStateComponent)}
            dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_COMPONENT") ? this.state.dataStateComponent : { skip: 0, take: 10 }}
            dataStateChange={(event) => this.setState({ dataStateComponent: event.data })}
            columnList={this.extractedComponentList}
            methodUrl={"CertificateGeneration"}
            selectedId={0}
            expandField="expanded"
            handleExpandChange={this.props.handleExpandChange}
            hasChild={true}
            childColumnList={this.TestColumnList}
            childList ={this.props.childList || new Map()}
        />)
        // tabMap.set("IDS_TESTPARAMETER", <CerGenTabs 
        // userRoleControlRights={this.props.userRoleControlRights}
        //     controlMap={this.props.controlMap}
        //     inputParam={this.props.inputParam}
        //     userInfo={this.props.userInfo}
        //    // primaryKeyField={"nreportrightscode"}
        //     masterData={this.props.masterData}
        //     primaryList={"Parameter"}
        //     dataResult={process(this.props.masterData["Parameter"], this.state.dataStateTestParameter)}
        //     dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_TESTPARAMETER") ? this.state.dataStateTestParameter : { skip: 0, take: 10 }}
        //     dataStateChange={(event) => this.setState({ dataStateTestParameter: event.data })}
        //     columnList={this.extractedTestParameterList}
        //     methodUrl={"CertificateGeneration"}
        //     selectedId={0}
        //     expandField=""
        //     handleExpandChange={this.props.handleExpandChange}
        //     hasChild={faFlushed}
        //     childColumnList={this.props.roleColumnList}
        //     childList ={this.props.childList || new Map()}
        // />)
        tabMap.set("IDS_PRINTHISTORY", <CerGenTabs 
        userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
        inputParam={this.props.inputParam}
        userInfo={this.props.userInfo}
        //primaryKeyField={"nalertrightscode"}
        masterData={this.props.masterData}
        primaryList={"PrintHistory"}
        dataResult={process(this.props.masterData["PrintHistory"], this.state.dataStatePrintHistory)}
        dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_PRINTHISTORY") ? this.state.dataStatePrintHistory : { skip: 0, take: 10 }}
        dataStateChange={(event) => this.setState({ dataStatePrintHistory: event.data })}
        columnList={this.extractedPrintHistoryColumnList}
        methodUrl={"CertificateGeneration"}
        selectedId={0}
        expandField=""
        handleExpandChange={this.props.handleExpandChange}
        hasChild={false}
        childColumnList={this.TestColumnList}
        childList ={this.props.childList || new Map()}
    />)

    tabMap.set("IDS_SENTHISTORY",
    <CerGenTabs
        printHistory={this.props.Login.masterData.emailSentHistory}
        dataResult={process(this.props.Login.masterData.emailSentHistory || [], this.state.sentMailHistory)}
        dataState={ this.state.sentMailHistory }
        dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_SENTHISTORY") ? 
                  this.state.dataStatePrintHistory : { skip: 0, take: 10 }}
        controlMap={this.state.controlMap}
        dataStateChange={(event) => this.setState({ dataSentMailHistory: event.dataState })}
        userRoleControlRights={this.state.userRoleControlRights}
        userInfo={this.props.Login.userInfo}
        inputParam={this.props.Login.inputParam}
        columnList={this.mailHistColumnList}
        methodUrl={"CertificateGeneration"}
        //screenName="IDS_SENTHISTORY"
    />);


    tabMap.set("IDS_CLOCKHISTORY", <CerGenTabs 
    userRoleControlRights={this.props.userRoleControlRights}
    controlMap={this.props.controlMap}
    inputParam={this.props.inputParam}
    userInfo={this.props.userInfo}
    //primaryKeyField={"nalertrightscode"}
    masterData={this.props.masterData}
    primaryList={"ClockHistory"}
    dataResult={process(this.props.masterData["ClockHistory"], this.state.dataStateClockHistory)}
    dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_CLOCKHISTORY") ? this.state.dataStateClockHistory : { skip: 0, take: 10 }}
    dataStateChange={(event) => this.setState({ dataStateClockHistory: event.data })}
    columnList={this.extractedClockHistoryColumnList}
    methodUrl={"CertificateGeneration"}
    selectedId={0}
    expandField=""
    handleExpandChange={this.props.handleExpandChange}
    hasChild={false}
    childColumnList={this.TestColumnList}
    childList ={this.props.childList || new Map()}
/>)
  tabMap.set("IDS_NULLIFIEDHISTORY", <CerGenTabs 
  userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
  inputParam={this.props.inputParam}
  userInfo={this.props.userInfo}
  //primaryKeyField={"nalertrightscode"}
  masterData={this.props.masterData}
  primaryList={"NullifiedHistory"}
  dataResult={process(this.props.masterData["NullifiedHistory"], this.state.dataStateNullifiedHistory)}
  dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_NULLIFIEDHISTORY") ? this.state.dataStateNullifiedHistory : { skip: 0, take: 10 }}
  dataStateChange={(event) => this.setState({ dataStateNullifiedHistory: event.data })}
  columnList={this.extractedNullifiedHistoryColumnList}
  methodUrl={"CertificateGeneration"}
  selectedId={0}
  expandField=""
  handleExpandChange={this.props.handleExpandChange}
  hasChild={false}
  childColumnList={this.TestColumnList}
  childList ={this.props.childList || new Map()}
/>)
        return tabMap;
    }

    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {

            let isOpen = false;
            if (this.props.errorCode !== undefined && (this.state.operation === "create" || this.state.operation === "update")) {
                isOpen = true;
            }
            this.setState({ isOpen, activeTab: 'IDS_REPORTRIGHTS-tab' });
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }
        let { dataState, dataStateMaterial } = this.state;
        if (this.props.dataState !== previousProps.dataState && this.props.dataState !== dataState) {
            dataState = { skip: 0, take: 10 }
            dataStateMaterial = { skip: 0, take: 10 }
            this.setState({ dataState, dataStateMaterial });
        }

    }



    // extractedcertificateList = [{ "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CERTIFIEDDATE", "dataField": "scertificatedate", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CERTIFIEDCOMMENTS", "dataField": "scomments", "width": "200px" },
    // ]

    extractedComponentList = [{ "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_ARNO", "dataField": "sarno", "width": "300px" },
    { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", "width": "300px" },
    { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_MANUFACTUREBATCHLOTNO", "dataField": "sbatchfillinglotno", "width": "250px" },
    { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DATERECEIVED", "dataField": "sreceiveddate", "width": "300px" },
     ]

   
    extractedPrintHistoryColumnList = [
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PRINTCOUNT", "dataField": "nprintcount", "width": "250px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "250px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "250px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PRINTDATE", "dataField": "sprintdate", "width": "250px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PRINTCOMMENTS", "dataField": "scomments", "width": "250px" },
       
    ]
    extractedClockHistoryColumnList = [
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CLOCKSTATUS", "dataField": "stransdisplaystatus", "width": "150px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "250px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "250px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DATETIME", "dataField": "sapproveddate", "width": "150px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_ACTIONTYPE", "dataField": "sactionstatus", "width": "150px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "250px" },
       
    ]
    extractedNullifiedHistoryColumnList = [
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "250px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "250px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_NULLIFIEDDATE", "dataField": "sprintdate", "width": "250px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PRINTCOMMENTS", "dataField": "scomments", "width": "250px" },
       
    ]
    // extractedTestParameterList = [{ "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_UNITS", "dataField": "sunitname", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_RESULT", "dataField": "sresult", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_RESULTDATE", "dataField": "dentereddate", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "200px" },
    //  ]
    TestColumnList=[{"idsName":"IDS_TESTNAME","dataField":"stestsynonym", "width":"250px"},
    {"idsName":"IDS_PARAMETERNAME","dataField":"sparametersynonym","width":"250px"},
    //{"idsName":"IDS_UNITS","dataField":"sunitname","width":"100px"},
    {"idsName":"IDS_RESULT","dataField":"sresult","width":"150px"},
    {"idsName":"IDS_RESULTFLAG","dataField":"sgradename","width":"100px"},
    {"idsName":"IDS_RESULTDATE","dataField":"dentereddate","width":"100px"},
    {"idsName":"IDS_STATUS","dataField":"stransdisplaystatus","width":"100px"},
    ];


   mailHistColumnList = [
        {"idsName":"IDS_EMAILID","dataField":"semail","width":"250px"},
        {"idsName":"IDS_TRANSACTIONDATE","dataField":"stransdate","width":"250px"},
        {"idsName":"IDS_EMAILSTATUS","dataField":"smailstatus","width":"250px"},
 
    ];
}

export default injectIntl(CertificateGenerationTab);