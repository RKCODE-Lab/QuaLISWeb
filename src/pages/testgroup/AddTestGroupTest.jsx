import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';

const AddTestGroupTest = (props) => {
    return (
        <>
            <Row>
                <Col md="12">
                    {props.screenName === props.genericLabel["Component"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] &&
                        <FormSelectSearch
                            formLabel={props.genericLabel["Component"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                            isSearchable={true}
                            name={"ncomponentcode"}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            showOption={true}
                            options={props.testGroupInputData.TestGroupSpecSampleType || []}
                            optionId='ncomponentcode'
                            optionValue='scomponentname'
                            value={props.selectedRecord["ncomponentcode"]?props.selectedRecord["ncomponentcode"]||[]:[]}
                            onChange={value => props.onComboChange(value, "ncomponentcode", 1)}
                            alphabeticalSort={true}
                        >
                        </FormSelectSearch>
                    }
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_TESTCATEGORY" })}
                        isSearchable={true}
                        name={"ntestcategorycode"}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        showOption={true}
                        options={props.testGroupInputData.TestCategory || []}
                        optionId='ntestcategorycode'
                        optionValue='stestcategoryname'
                        value={props.selectedRecord["ntestcategorycode"]?props.selectedRecord["ntestcategorycode"]||[]:[]}
                        onChange={value => props.onFilterComboChange(value, "ntestcategorycode", 5)}
                        alphabeticalSort={true}
                    >
                    </FormSelectSearch>
                    <FormMultiSelect
                        name={"ntestcode"}
                        label={props.intl.formatMessage({ id: "IDS_TEST" })}
                        options={props.testGroupInputData.TestGroupTest || []}
                        optionId="ntestcode"
                        optionValue="stestname"
                        value={props.selectedRecord["ntestcode"] ? props.selectedRecord["ntestcode"] ||[]: []}
                        isMandatory={true}
                        isClearable={true}
                        alphabeticalSort={true}
                        onChange={(value) => props.onComboChange(value, "ntestcode", 1)}
                    />
                </Col>
            </Row>
        </>
    );
};

export default injectIntl(AddTestGroupTest);