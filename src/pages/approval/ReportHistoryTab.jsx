import React from 'react'
import { Row, Col, } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import { injectIntl } from 'react-intl';

class ReportHistoryTab extends React.Component {
    render() {
        const extractedColumnList = [
            { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" },
            { "idsName": "IDS_REPORTTYPE", "dataField": "scoareporttypename", "width": "140px" },
            { "idsName": "IDS_GENERATEDDATE", "dataField": "sgeneratedtime", "width": "140px" },
            // { "idsName": "IDS_SECTION", "dataField": "ssectionname", "width": "140px" },
            { "idsName": "IDS_USER", "dataField": "susername", "width": "150px" },
            { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "150px" },
            { "idsName": "IDS_FILENAME", "dataField": "ssystemfilename", "width": "150px" },
        ];
        const attachmentParam={
            classUrl:"approval",
            operation:"view",
            methodUrl:"Report",
            userinfo:this.props.userInfo
    
        } 
        return (

            <Row noGutters={"true"}>
                <Col md={12}>
                    <DataGrid
                        primaryKeyField={"ncoahistorycode"}
                        data={this.props.COAHistory}
                        dataResult={process(this.props.COAHistory || [], this.props.dataState)}
                        dataState={this.props.dataState}
                        dataStateChange={this.props.dataStateChange}
                        extractedColumnList={extractedColumnList}
                        userInfo={this.props.userInfo}
                        controlMap={this.props.controlMap}
                        userRoleControlRights={this.props.userRoleControlRights}
                        inputParam={this.props.inputParam}
                        pageable={true}
                        isActionRequired={true}
                        isToolBarRequired={false}
                        scrollable={"scrollable"}
                        methodUrl="Report"
                        viewDownloadFile={this.props.viewDownloadFile}
                        downloadParam = {attachmentParam}
                    />
                </Col>
            </Row>

        )
    }
}
export default injectIntl(ReportHistoryTab);