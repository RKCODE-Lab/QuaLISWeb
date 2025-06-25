import React from 'react';
import { injectIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';

const AddPricingTest = (props) => {
    return(
        <Row>
            <Col md={12}>
                <FormMultiSelect
                        name={"ntestcode"}
                        label={props.intl.formatMessage({ id: "IDS_TEST" })}
                        options={props.pricingTestList || []}
                        optionId="ntestcode"
                        optionValue="stestname"
                        value={props.selectedRecord["ntestcode"] ? props.selectedRecord["ntestcode"] ||[]: []}
                        isMandatory={true}
                        isClearable={true}
                        alphabeticalSort={true}
                        onChange={(value) => props.onComboChange(value, "ntestcode")}
                    />
            </Col>

        </Row>
    );
  
}

export default injectIntl(AddPricingTest);