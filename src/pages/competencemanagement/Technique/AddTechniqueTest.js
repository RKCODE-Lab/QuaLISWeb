import React from 'react';
import { injectIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import FormMultiSelect from '../../../components/form-multi-select/form-multi-select.component';
import Component from './../../product/Component';

const AddTechniqueTest = (props) => {
    return(
        <Row>
            <Col md={12}>
                <FormMultiSelect
                        name={"ntestcode"}
                        label={props.intl.formatMessage({ id: "IDS_TEST" })}
                        options={props.techniqueTestList || []}
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

export default injectIntl(AddTechniqueTest);