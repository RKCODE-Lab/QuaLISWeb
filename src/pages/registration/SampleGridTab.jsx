import React from 'react'
import { Row, Col,  } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';

class SampleGridTab extends React.Component {
    
    //const addUserMultiDeputyId = props.controlMap.has("AddUserMultiDeputy") && props.controlMap.get("AddUserMultiDeputy").ncontrolcode

    //const deputyAddParam = {screenName:"Deputy", operation:"create", primaryKeyField:"nusermultideputycode", 
    // primaryKeyValue:undefined, masterData:props.masterData, userInfo:props.userInfo,
    // ncontrolCode:addUserMultiDeputyId};
    render() {
        let viewFileURL={"classUrl":"registration",
        "methodUrl" :"RegistrationFile","screenName":"SampleRegistration"};
        // const extractedColumnList = [
        // ]
        // const detailedFieldList = [

        // ]
        return (
            <>
                <Row className="no-gutters">
                    <Col md={12}>
                        <DataGrid
                            primaryKeyField={this.props.primaryKeyField}
                            data={this.props.GridData}
                            dataResult={process(this.props.GridData || [], this.props.dataState)}
                            dataState={this.props.dataState}
                            dataStateChange={this.props.dataStateChange}
                            expandField={this.props.expandField}
                            detailedFieldList={this.props.detailedFieldList}
                            extractedColumnList={this.props.extractedColumnList}
                            userInfo={this.props.userInfo}
                            controlMap={new Map()}
                            userRoleControlRights={[]}
                            inputParam={this.props.inputParam}
                            pageable={true}
                            isComponent={false}
                            hasDynamicColSize={true}
                            isActionRequired={false}
                            isToolBarRequired={false}
                            scrollable={'scrollable'}
                            gridHeight={'350px'}
                            jsonField={this.props.jsonField}
                            viewFileURL={viewFileURL}
                        />
                    </Col>
                </Row>
            </>
        )
    }
}
export default injectIntl(SampleGridTab);