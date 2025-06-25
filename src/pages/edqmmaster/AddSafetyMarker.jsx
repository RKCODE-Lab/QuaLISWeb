import React from 'react'
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import {transactionStatus} from '../../components/Enumeration';
import {injectIntl } from 'react-intl';

const AddSafetyMarker = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_SAFETYMARKERNAME" })}
                    name={"ssafetymarkername"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id:"IDS_SAFETYMARKERNAME"})}
                    value={props.selectedRecord ? props.selectedRecord["ssafetymarkername"] : ""}

                    isMandatory={true}
                    required={true}
                    maxLength={"50"}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    name={"ssafetymarkerdesc"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord ? props.selectedRecord["ssafetymarkerdesc"] : ""}
                    rows="2"
                    isMandatory={false}                   
                    maxLength={"100"}
                >
                </FormTextarea>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_TESTCATEGORY" })}
                    isSearchable={true}
                    name={"ntestcategorycode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.testCategory}
                    // optionId='ntestcategorycode'
                    // optionValue='stestcategoryname'
                    // value={this.state.ntestcategorycode}
                    // defaultValue={props.ntestcategorycode || []}
                    value={props.selectedRecord["ntestcategorycode"] ?  props.selectedRecord["ntestcategorycode"] : ""}
                    onChange={value => props.handleChange(value, "ntestcategorycode", "TestCategory")}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                    isSearchable={true}
                    name={"ntestcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.testMaster || []}
                    // optionId='ntestcode'
                    // optionValue='stestname'
                    // value={props.selectedRecord.ntestcode ?  props.selectedRecord.ntestcode : ""}
                    value={props.selectedRecord["ntestcode"] ?  props.selectedRecord["ntestcode"] : ""}
                    onChange={value => props.handleChange(value, "ntestcode", "")}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_UPLOADTOEDQM" })}
                    type="switch"
                    name={"ntransactionstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_UPLOADTOEDQM" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.YES ? true : false : ""}
                    isMandatory={false}
                    rows="3"
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.YES ? true : false : false}

                >

                </CustomSwitch>
            </Col>
        </Row>
    )
}
export default injectIntl(AddSafetyMarker);