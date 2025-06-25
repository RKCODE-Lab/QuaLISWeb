import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
//import { Col, Row } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import { injectIntl,FormattedMessage } from 'react-intl';
import { Col} from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
const ViewSubCodedResult = (props) => {
   
    const testMethodColumnList = [
        { "idsName": "IDS_SUBCODEDRESULT", "dataField": "ssubcodedresult", "width": "200px" }    ];
    return (
       <>
        <DataGrid
                    key="ssubcodedresult"
                    primaryKeyField="ssubcodedresult"
                    // dataResult={[]}
                    dataResult={props.selectedsubcoderesult || []}
                    // dataResult={this.props.selectedWorklistHistory ||[]}
                    dataState={{}}
                    // dataState={this.state.sectionDataState}
                    // dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                    data={[]}
                    extractedColumnList={testMethodColumnList}
                    controlMap={props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    pageable={false}
                    scrollable={'scrollable'}
                    gridHeight={'335px'}
                    isActionRequired={false}
                    methodUrl="AuditTrail"
                   

                >
                </DataGrid>

                </>


    );
}

export default injectIntl(ViewSubCodedResult);