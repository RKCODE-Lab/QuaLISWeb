import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../../components/form-input/form-input.component';
import DataGrid from '../../../components/data-grid/data-grid.component';

const SpecView = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    name={"sproductname"}
                    type="text"
                    label={props.intl.formatMessage({ id: "IDS_PRODUCT" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_PRODUCT" })}
                    value={props.selectedRecord["sproductname"] || ""}
                    isMandatory={false}
                    required={false}
                    maxLength={100}
                    readOnly
                />
                <FormInput
                    name={"sspecname"}
                    type="text"
                    label={props.intl.formatMessage({ id: "IDS_TESTGROUP" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTGROUP" })}
                    value={props.selectedRecord["sspecname"] || ""}
                    isMandatory={false}
                    required={false}
                    maxLength={100}
                    readOnly
                />
                <DataGrid
                    primaryKeyField={"ncomponentcode"}
                    data={props.SpecComponents}
                    dataResult={props.SpecComponents || []}
                    dataState={{skip:0}}
                    extractedColumnList={[{ "idsName": "IDS_COMPONENT", "dataField": "scomponentname", "width": "300px" }]}
                    userInfo={props.userInfo}
                    controlMap={new Map()}
                    userRoleControlRights={[]}
                    inputParam={""}
                    pageable={false}
                    isActionRequired={false}
                    isToolBarRequired={false}
                    scrollable={"scrollable"}
                    groupable={false}
                    hideColumnFilter={true}
                />
            </Col>
        </Row>
    )
}
export default injectIntl(SpecView);
