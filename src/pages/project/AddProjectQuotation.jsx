import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

//ALPD-3566
const AddProjectQuotation = (props) => {
    return (
        <Row>
            <Col md={12}>
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_QUOTATION" })}
                name={"nquotationcode"}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={true}
                showOption={props.isMulti}
                options={props.ProjectQuotationList}
                optionId='nquotationcode'
                optionValue='squotationno'
                onChange={(event) => props.onComboChange(event, "nquotationcode", 3)}
                value={props.selectedRecord["nquotationcode"] ? props.selectedRecord["nquotationcode"] || [] : []}
                isMulti={props.isMulti}
                isSearchable={true}
                closeMenuOnSelect={!props.isMulti}
                alphabeticalSort={true}
                isClearable={false}
                isDisabled={props.operation==="update"?true:false}


            >
            </FormSelectSearch>
            
            </Col>
            <Col md={12}>
            <FormTextarea
                            name={"sremarks"}
                            label={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            value={props.selectedRecord ? props.selectedRecord["sremarks"] : ""}
                            rows="2"
                            required={false}
                            maxLength={255}
                            isMandatory={false}
            >
            </FormTextarea>
            </Col>
            <Col md={12}>
            <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                            type="switch"
                            name={"ndefaultstatus"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                            defaultValue={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : ""}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : false}
                        />
                    </Col>
        </Row>
    );

}

export default injectIntl(AddProjectQuotation);