import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import { injectIntl } from 'react-intl';


const AddProjectMember = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormMultiSelect
                    name={"nusercode"}
                    label={props.intl.formatMessage({ id: "IDS_USER" })}
                    options={props.MembersList || []}
                    optionId="nusercode"
                    optionValue="steammembername"
                    value={props.selectedRecord["nusercode"] ? props.selectedRecord["nusercode"] || [] : []}
                    isMandatory={true}
                    isClearable={true}
                    alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, "nusercode", 3)}
                />
            </Col>

        </Row>
    );

}

export default injectIntl(AddProjectMember);