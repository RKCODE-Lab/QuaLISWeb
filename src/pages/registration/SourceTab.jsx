import React from 'react'
import { Row, Col, } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import { injectIntl } from 'react-intl';

class SourceTab extends React.Component {
    render() {
        const extractedColumnList = [
            { "idsName": "IDS_SOURCE", "dataField": "scountryname", "width": "600px" }
        ]
        return (

            <Row className="no-gutters">
                <Col md={12}>
                    <DataGrid
                        primaryKeyField={"nsourcecountrycode"}
                        data={this.props.RegistrationSourceCountry}
                        dataResult={process(this.props.RegistrationSourceCountry || [], this.props.dataState)}
                        dataState={this.props.dataState}
                        dataStateChange={this.props.dataStateChange}
                        extractedColumnList={extractedColumnList}
                        userInfo={this.props.userInfo}
                        controlMap={this.props.controlMap}
                        userRoleControlRights={this.props.userRoleControlRights}
                        inputParam={this.props.inputParam}
                        hideDetailBand={true}
                        pageable={true}
                        expandField="expanded"
                        isActionRequired={true}
                        isToolBarRequired={false}
                        scrollable={"scrollable"}
                        gridHeight={"350px"}
                        deleteRecord={this.props.deleteRecord}
                        screenName={this.props.screenName}
                        methodUrl="RegistrationSourceCountry"
                    />
                </Col>
            </Row>

        )
    }
}
export default injectIntl(SourceTab);