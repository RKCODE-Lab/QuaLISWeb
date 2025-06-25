import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import { injectIntl } from 'react-intl';


const AddQuotationTest = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormMultiSelect
                    name={"ntestcode"}
                    label={props.intl.formatMessage({ id: "IDS_TEST" })}
                    options={props.QuotationTestList || []}
                    optionId="ntestcode"
                    optionValue="stestsynonym"
                    value={props.selectedRecord["ntestcode"] ? props.selectedRecord["ntestcode"] || [] : []}
                    isMandatory={true}
                    isClearable={true}
                    alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, "ntestcode", 3)}
                />
            </Col>

        </Row>
    );

}

export default injectIntl(AddQuotationTest);