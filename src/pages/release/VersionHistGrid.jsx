import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';


const VersionHistGrid = (props) =>{  
    const versionColumnList = [];
    versionColumnList .push( 
        {"idsName":"IDS_REPORTNO","dataField":"sreportno","width":"100px"},
        {"idsName":"IDS_VERSION","dataField":"nversionno","width":"75px"},
        {"idsName":"IDS_USER","dataField":"susername","width":"100px"},
        {"idsName":"IDS_USERROLE","dataField":"suserrolename","width":"100px"},
        {"idsName":"IDS_GENERATEDDATE","dataField":"sgenerateddate","width":"155px"} 
     );
    return (
            <>
                <DataGrid
                        key="ncoaparentcode"
                        primaryKeyField="ncoaparentcode"
                        data={props.versionHistory || []}
                        dataResult={props.dataResult}
                        dataState={props.dataState}
                        //expandField="expanded"
                        isExportExcelRequired={props.isExportExcelRequired}
                        dataStateChange={props.dataStateChange}
                        extractedColumnList = {versionColumnList}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                    // detailedFieldList={this.props.detailedFieldList}
                    // //editParam={editReportParam}
                    // selectedId={this.props.Login.selectedId}
                    // fetchRecord={this.props.fetchReportInfoReleaseById}
                        pageable={true}
                        // dataStateChange={this.dataStateChange}
                        scrollable={'scrollable'}
                        gridHeight={'630px'}
                        isActionRequired={true}
                        methodUrl={'ReleaseVersion'}
                        isDownload={true}
                        viewDownloadFile={props.viewDownloadFile}
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
    )

}
export default injectIntl(VersionHistGrid);