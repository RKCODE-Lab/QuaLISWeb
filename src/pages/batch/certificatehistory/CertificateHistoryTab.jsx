import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import CustomTabs from '../../../components/custom-tabs/custom-tabs.component';
import CerGenTabs from '../certificategeneration/CerGenTabs';

class CertificateHistoryTab extends Component {
    constructor(props) {
        super(props);
        const dataStateComponent = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        // const dataStateTestParameter = {
        //     skip: 0,
        //     take: 10,
        //     group:[{field:'sarno'}]
        // };
        const dataStatePrintHistory = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        const dataStateClockHistory = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        // const dataStateNullifiedHistory = {
        //     skip: 0,
        //     take: 5,
        // };
        this.state = {
            isOpen: false,
            activeTab: 'IDS_COMPONENT-tab',
            selectedRecord: {}, dataResult: [],
            dataStateComponent: dataStateComponent,
            dataStatePrintHistory: dataStatePrintHistory,
            dataStateClockHistory: dataStateClockHistory,
            // dataStateTestParameter:dataStateTestParameter,
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
            dataResult={process(this.props.masterData["Component"] || [], this.state.dataStateComponent)}
            dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_COMPONENT") ? this.state.dataStateComponent : { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }}
            dataStateChange={(event) => this.setState({ dataStateComponent: event.dataState })}
            columnList={this.extractedComponentList}
            methodUrl={"CertificateGeneration"}
            selectedId={0}
            expandField="expanded"
            handleExpandChange={this.props.handleExpandChange}
            hasChild={true}
            childColumnList={this.TestColumnList}
            childList={this.props.childList || new Map()}
        />)
        tabMap.set("IDS_PRINTHISTORY", <CerGenTabs
            userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            //primaryKeyField={"nalertrightscode"}
            masterData={this.props.masterData}
            primaryList={"PrintHistory"}
            dataResult={process(this.props.masterData["PrintHistory"] || [], this.state.dataStatePrintHistory)}
            dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_PRINTHISTORY") ? this.state.dataStatePrintHistory : { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }}
            dataStateChange={(event) => this.setState({ dataStatePrintHistory: event.dataState })}
            columnList={this.extractedPrintHistoryColumnList}
            methodUrl={"CertificateGeneration"}
            selectedId={0}
            expandField=""
            handleExpandChange={this.props.handleExpandChange}
            hasChild={false}
            childColumnList={this.TestColumnList}
            childList={this.props.childList || new Map()}
        />)
        tabMap.set("IDS_CLOCKHISTORY", <CerGenTabs
            userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            //primaryKeyField={"nalertrightscode"}
            masterData={this.props.masterData}
            primaryList={"ClockHistory"}
            dataResult={process(this.props.masterData["ClockHistory"] || [], this.state.dataStateClockHistory)}
            dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_CLOCKHISTORY") ? this.state.dataStateClockHistory : { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }}
            dataStateChange={(event) => this.setState({ dataStateClockHistory: event.dataState })}
            columnList={this.extractedClockHistoryColumnList}
            methodUrl={"CertificateGeneration"}
            selectedId={0}
            expandField=""
            handleExpandChange={this.props.handleExpandChange}
            hasChild={false}
            childColumnList={this.TestColumnList}
            childList={this.props.childList || new Map()}
        />)
        return tabMap;
    }

    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {
            let isOpen = false;
            if (this.props.errorCode !== undefined && (this.state.operation === "create" || this.state.operation === "update")) {
                isOpen = true;
            }
                let {dataStateClockHistory,
                    dataStatePrintHistory,dataStateComponent } = this.state;
                if (this.props.dataState === undefined) {
                    if (this.props.screenName === "IDS_COMPONENT") {
                        dataStateComponent = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                    }  else if (this.props.screenName === "IDS_CLOCKHISTORY") {
                        dataStateClockHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                    } else if (this.props.screenName === "IDS_PRINTHISTORY") {
                        dataStatePrintHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5};
                    }                
                    else {
                        dataStateComponent = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                        dataStateClockHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                        dataStatePrintHistory = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
                    }
                };

            this.setState({ isOpen, activeTab: 'IDS_COMPONENT-tab',dataStateComponent,dataStateClockHistory,dataStatePrintHistory });
        }
        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }
    }
    // extractedcertificateList = [{ "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CERTIFIEDDATE", "dataField": "scertificatedate", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CERTIFIEDCOMMENTS", "dataField": "scomments", "width": "200px" },
    // ]

    extractedComponentList = [{ "idsName": "IDS_ARNO", "dataField": "sarno", "width": "300px" },
    { "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", "width": "300px" },
    { "idsName": "IDS_MANUFACTUREBATCHLOTNO", "dataField": "sbatchfillinglotno", "width": "250px" },
    { "idsName": "IDS_DATERECEIVED", "dataField": "sreceiveddate", "width": "300px" },
    ]

    extractedPrintHistoryColumnList = [
        { "idsName": "IDS_PRINTCOUNT", "dataField": "nprintcount", "width": "250px" },
        { "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "250px" },
        { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "250px" },
        { "idsName": "IDS_PRINTDATE", "dataField": "sprintdate", "width": "250px" },
        { "idsName": "IDS_PRINTCOMMENTS", "dataField": "scomments", "width": "250px" },

    ]
    extractedClockHistoryColumnList = [
        { "idsName": "IDS_CLOCKSTATUS", "dataField": "stransdisplaystatus", "width": "150px" },
        { "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "250px" },
        { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "250px" },
        { "idsName": "IDS_DATETIME", "dataField": "sapproveddate", "width": "150px" },
        { "idsName": "IDS_ACTIONTYPE", "dataField": "sactionstatus", "width": "150px" },
        { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "250px" },
    ]

    // extractedTestParameterList = [{ "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_UNITS", "dataField": "sunitname", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_RESULT", "dataField": "sresult", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_RESULTDATE", "dataField": "dentereddate", "width": "200px" },
    // { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "200px" },
    //  ]
    TestColumnList = [{ "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "250px" },
    { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "250px" },
    //{"idsName":"IDS_UNITS","dataField":"sunitname","width":"100px"},
    { "idsName": "IDS_RESULT", "dataField": "sresult", "width": "150px" },
    { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "100px" },
    { "idsName": "IDS_RESULTDATE", "dataField": "sentereddate", "width": "100px" },
    { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "100px" },
    ];
}
export default injectIntl(CertificateHistoryTab);