import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';


class ApprovalPrintHistoryTab extends React.Component{  

    render(){
        
        const extractedColumnList=[
        {"idsName":"IDS_ARNO","dataField":"sarno","width":"175px"},
        {"idsName":"IDS_PRINTCOUNT","dataField":"ncount","width":"150px"},
        {"idsName":"IDS_USERNAME","dataField":"sloginid","width":"150px"},
        {"idsName":"IDS_USERROLE","dataField":"suserrolename","width":"150px"},
        {"idsName":"IDS_PRINTDATE","dataField":"sprintdate","width":"150px"},
        {"idsName":"IDS_COMMENTS","dataField":"scomments","width":"200px"}
        
    ]
    return (
        <>
            <Row noGutters={"true"}>
                <Col md={12}>
                    <DataGrid
                        primaryKeyField={"nsampleapprovalmailcode"}
                        data={this.props.ApprovalPrintHistory}
                        dataResult={process(this.props.ApprovalPrintHistory || [], this.props.dataState)}
                        dataState={this.props.dataState}
                        dataStateChange={this.props.dataStateChange}
                       //expandField="expanded"
                        extractedColumnList={extractedColumnList}
                        userInfo={this.props.userInfo}
                        controlMap={this.props.controlMap}
                        userRoleControlRights={this.props.userRoleControlRights}
                        inputParam={this.props.inputParam}
                        pageable={true}
                        isActionRequired={false}
                        isToolBarRequired={false}
                        scrollable={"scrollable"}
                        methodUrl={"Status"}
                        gridHeight={"550px"}
                    />
                </Col>
            </Row>
        </>
    )
  }
}
export default injectIntl(ApprovalPrintHistoryTab);
    