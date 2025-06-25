import React from 'react'
import { Row, Col } from 'react-bootstrap';

import { injectIntl } from 'react-intl';
import FormMultiSelect from '../../../components/form-multi-select/form-multi-select.component';

const AddParticipantsStatus = (props) => {

    return (
        <Row>
            <Col md={12}>
                <FormMultiSelect
                    label={props.intl.formatMessage({ id: "IDS_PARTICIPANTSNAME" })}
                    name={"nusercode"}
                    isSearchable={true}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    showOption={true}
                    options={props.usersStatus || []}
                    optionId='nusercode'
                    optionValue='sfullname'
                    onChange={value => props.handleChange(value,"nusercode", "")}
                    value = { props.selectedRecord["nusercode"] ? props.selectedRecord["nusercode"]||[]:[]}
                    alphabeticalSort={true}
                >
                </FormMultiSelect>
                
            </Col>

        </Row>
    )
}

export default injectIntl(AddParticipantsStatus);