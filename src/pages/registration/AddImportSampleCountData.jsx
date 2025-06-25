import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import { injectIntl } from 'react-intl';

const AddImportSampleCountData = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_SAMPLECOUNT" })}
                    name= "nsamplecount"
                    type="numeric"
                    onChange={(event) => props.onNumericInputChange(event.target.value,"nsamplecount")}
                    placeholder={props.intl.formatMessage({ id: "IDS_SAMPLECOUNT" })}
                    value={props.selectedRecord && props.selectedRecord["nsamplecount"] ? props.selectedRecord["nsamplecount"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={"100"}
                />
            </Col>
        </Row>

        
    );
};

export default injectIntl(AddImportSampleCountData);