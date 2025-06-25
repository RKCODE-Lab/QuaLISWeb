import { LocalizationProvider } from '@progress/kendo-react-intl';
import React from 'react'
import { injectIntl } from 'react-intl'
import 'rc-tabs/assets/index.css';
import { AtTabs } from '../../components/custom-tabs/custom-tabs.styles';

import PerfectScrollbar from 'react-perfect-scrollbar';
import Tabs, { TabPane } from "rc-tabs";
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import { formCode } from '../../components/Enumeration';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';

class ReleaseReportHistory extends React.Component {
    constructor(props) {
        super(props);
        const preliminaryHistoryDataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        const releaseyHistoryDataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        const regenerateHistoryDataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        const releaseHistoryTabDataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };

        const screens = [];

        screens.push({ eventKey: 'ReleaseHistoryTab', name: "IDS_RELEASEHISTORY", formcode: formCode.RELEASE },
            { eventKey: 'PreliminaryReportHistory', name: "IDS_PRELIMINARYREPORTHISTORY", formcode: formCode.RESULTENTRY },
            { eventKey: 'ReleaseReportHistory', name: "IDS_RELEASEREPORTHISTORY", formcode: formCode.APPROVAL },
            { eventKey: 'RegenerateReportHistory', name: "IDS_REGENERATEREPORTHISTORY", formcode: formCode.RELEASE }
        );

        this.state = {
            screens,
            preliminaryHistoryDataState: preliminaryHistoryDataState,
            releaseyHistoryDataState: releaseyHistoryDataState,
            regenerateHistoryDataState: regenerateHistoryDataState,
            releaseHistoryTabDataState: releaseHistoryTabDataState,
            selectedScreen: { eventKey: 'ReleaseHistoryTab', name: "IDS_RELEASEHISTORY", formcode: 43 },
            dataResult: process(this.props.dataResult["ReleaseHistoryTab"] || [], preliminaryHistoryDataState),
            data: this.props.dataResult["ReleaseHistoryTab"]
        }
    }
    onTabChange = (tab) => {
        let selectedScreen = this.state.screens.find(screen => screen.eventKey === tab);
        let dataState = selectedScreen.eventKey === "PreliminaryReportHistory" ? this.state.preliminaryHistoryDataState :
            selectedScreen.eventKey === "ReleaseReportHistory" ? this.state.releaseyHistoryDataState :
                selectedScreen.eventKey === "RegenerateReportHistory" ? this.state.regenerateHistoryDataState : this.state.releaseHistoryTabDataState;
        let dataResult = process(this.props.dataResult[selectedScreen.eventKey] || [], dataState);
        let data = this.props.dataResult[selectedScreen.eventKey] || [];
        this.setState({
            selectedScreen,
            dataResult,
            data
        });
    }
    preliminaryHistoryDataStateChange = (event) => {
        this.setState({
            preliminaryHistoryDataState: event.dataState,
            dataResult: process(this.state.data ? this.state.data : [], event.dataState)
        })
        // this.expandNextData(event.dataState);
    }
    releaseHistoryDataStateChange = (event) => {
        this.setState({
            releaseyHistoryDataState: event.dataState,
            dataResult: process(this.state.data ? this.state.data : [], event.dataState)
        })
        // this.expandNextData(event.dataState);
    }
    regenerateHistoryDataStateChange = (event) => {
        this.setState({
            regenerateHistoryDataState: event.dataState,
            dataResult: process(this.state.data ? this.state.data : [], event.dataState)
        })
        // this.expandNextData(event.dataState);
    }
    releaseHistoryTabDataStateChange = (event) => {
        this.setState({
            releaseHistoryTabDataState: event.dataState,
            dataResult: process(this.state.data ? this.state.data : [], event.dataState)
        })
        // this.expandNextData(event.dataState);
    }
    render() {
        const extractedColumnList = [];
        if (this.state && this.state.selectedScreen &&
            (this.state.selectedScreen.eventKey === "ReleaseReportHistory" || this.state.selectedScreen.eventKey === "RegenerateReportHistory")) {
            extractedColumnList.push(
                { "idsName": "IDS_REPORTREFERENCENO", "dataField": "sreportno", "width": "155px" },
                { "idsName": "IDS_VERSION", "dataField": "nversionno", "width": "75px" },
                { "idsName": "IDS_USER", "dataField": "susername", "width": "155px" },
                { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "155px" },
                { "idsName": "IDS_GENERATEDDATETIME", "dataField": "sgenerateddate", "width": "155px" }
            );
        }
        else if (this.state.selectedScreen.eventKey === "ReleaseHistoryTab") {
            extractedColumnList.push(
                { "idsName": "IDS_REPORTREFERENCENO", "dataField": "sreportno", "width": "155px" },
                { "idsName": "IDS_VERSION", "dataField": "nversionno", "width": "75px" },
                { "idsName": "IDS_USER", "dataField": "susername", "width": "155px" },
                { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "155px" },
                { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransdisplaystatus", "width": "155px" },
                { "idsName": "IDS_GENERATEDDATETIME", "dataField": "sgenerateddate", "width": "155px" }
            );
        }
        else {
            extractedColumnList.push(
                { "idsName": "IDS_PRELIMINARYREFERENCENO", "dataField": "ncoaparentcode", "width": "155px" },
                { "idsName": "IDS_USER", "dataField": "susername", "width": "155px" },
                { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "155px" },
                { "idsName": "IDS_GENERATEDDATETIME", "dataField": "sgenerateddate", "width": "155px" }
            );
        }

        return (
            <>
                {
                    <AtTabs>
                        <Tabs activeKey={this.state.selectedScreen.eventKey} moreIcon="..." onChange={this.onTabChange}>
                            {this.state.screens.map(screen =>
                                <TabPane name={screen.eventKey} tab={this.props.intl.formatMessage({ id: screen.name })} key={screen.eventKey}>
                                    <PerfectScrollbar>
                                        {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}
                                        <AtTableWrap className="at-list-table">
                                            <LocalizationProvider language="lang">
                                                <>
                                                    <DataGrid
                                                        key="ncoaparentcode"
                                                        primaryKeyField="ncoaparentcode"
                                                        data={this.props.dataResult[this.state.selectedScreen.eventKey] || []}
                                                        // dataResult={process(this.props.dataResult[this.state.selectedScreen.eventKey], this.state.preliminaryHistoryDataState)}
                                                        dataResult={this.state.dataResult}
                                                        dataState={this.state && this.state.selectedScreen &&
                                                            this.state.selectedScreen.eventKey === "PreliminaryReportHistory" ? this.state.preliminaryHistoryDataState :
                                                            this.state && this.state.selectedScreen &&
                                                                this.state.selectedScreen.eventKey === "ReleaseReportHistory" ? this.state.releaseyHistoryDataState :
                                                                this.state.selectedScreen.eventKey === "RegenerateReportHistory" ? this.state.regenerateHistoryDataState : this.state.releaseHistoryTabDataState
                                                        }
                                                        //expandField="expanded"
                                                        isExportExcelRequired={false}
                                                        dataStateChange={this.state && this.state.selectedScreen &&
                                                            this.state.selectedScreen.eventKey === "PreliminaryReportHistory" ? this.preliminaryHistoryDataStateChange :
                                                            this.state && this.state.selectedScreen &&
                                                                this.state.selectedScreen.eventKey === "ReleaseReportHistory" ? this.releaseHistoryDataStateChange :
                                                                this.state.selectedScreen.eventKey === "RegenerateReportHistory" ? this.regenerateHistoryDataStateChange :
                                                                    this.releaseHistoryTabDataStateChange}
                                                        extractedColumnList={extractedColumnList}
                                                        controlMap={this.props.controlMap}
                                                        userRoleControlRights={this.props.userRoleControlRights}
                                                        // detailedFieldList={this.props.detailedFieldList}
                                                        // //editParam={editReportParam}
                                                        // selectedId={this.props.Login.selectedId}
                                                        // fetchRecord={this.props.fetchReportInfoReleaseById}
                                                        pageable={true}
                                                        // dataStateChange={this.dataStateChange}
                                                        scrollable={'scrollable'}
                                                        gridHeight={'600px'}
                                                        isActionRequired={this.state && (this.state.selectedScreen.eventKey === "RegenerateReportHistory" || this.state.selectedScreen.eventKey === "ReleaseHistoryTab") ? false : true}
                                                        methodUrl={'ReleaseVersion'}
                                                        isDownload={this.state && (this.state.selectedScreen.eventKey === "RegenerateReportHistory" || this.state.selectedScreen.eventKey === "ReleaseHistoryTab") ? false : true}
                                                        viewDownloadFile={this.props.viewDownloadFile}
                                                    // actionIcons={[{
                                                    //     title: this.props.intl.formatMessage({ id: "IDS_PREVIOUSRESULTVIEW" }),
                                                    //     controlname: "faEye",
                                                    //     objectName: "ExceptionLogs",
                                                    //     hidden: -1 === -1,
                                                    //    onClick: (viewSample) => this.props.viewSample(viewSample)
                                                    // }]}
                                                    >
                                                    </DataGrid>

                                                </>
                                            </LocalizationProvider>
                                        </AtTableWrap>
                                        {/* <ReactTooltip /> */}
                                    </PerfectScrollbar>
                                </TabPane>
                            )}
                        </Tabs>
                    </AtTabs>
                }
            </>
        );
    }
}
export default injectIntl(ReleaseReportHistory)