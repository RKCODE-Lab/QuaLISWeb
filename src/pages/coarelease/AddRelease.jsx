import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddRelease = (props) => {
    return (
        <Row>

            <Col md={12}>
            <FormSelectSearch
                    name={"ncoareporttypecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_REPORTTYPE" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.ReportTypeList}
                    // optionId="ntimezonecode"
                    // optionValue="stimezoneid"
                    value={props.selectedRecord ? props.selectedRecord["ncoareporttypecode"] : ""}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ncoareporttypecode"] : ""}
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={true}
                    // isClearable={false}                               
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, 'ncoareporttypecode', 1)}
                />
            </Col>

        </Row>
    )
}
export default injectIntl(AddRelease);