import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import { injectIntl } from 'react-intl';

const AddTestGroupFormula = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormMultiSelect
                    name={"ntestformulacode"}
                    label={props.intl.formatMessage({ id: "IDS_FORMULA" })}
                    options={props.testGroupInputData.testFormula || []}
                    optionId={"ntestformulacode"}
                    optionValue={"sformulaname"}
                    value={props.selectedRecord ? props.selectedRecord["ntestformulacode"] : ""}
                    isMandatory={true}
                    isClearable={true}
                    disableSearch={false}
                    disabled={false}
                    closeMenuOnSelect={false}
                    alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, "ntestformulacode", 1)}
                />
            </Col>
        </Row>
    );
};

export default injectIntl(AddTestGroupFormula);