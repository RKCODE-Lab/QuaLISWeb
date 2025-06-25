import React from 'react'
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormMultiSelect from '../../../components/form-multi-select/form-multi-select.component';

import { injectIntl } from 'react-intl';

const AddParticipants = (props) => {

    return (
        <Row>
            <Col md={12}>
            <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_SECTION" })}
                    isSearchable={true}
                    name={"nsectioncode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.section}
                    // optionId='ntestcategorycode'
                    // optionValue='stestcategoryname'
                    // value={this.state.ntestcategorycode}
                    // defaultValue={props.ntestcategorycode || []}
                    value={props.selectedRecord["nsectioncode"] ?  props.selectedRecord["nsectioncode"] : ""}
                    onChange={value => props.handleChange(value, "nsectioncode", "Section")}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
            
                <FormMultiSelect
                    label={props.intl.formatMessage({ id: "IDS_PARTICIPANTSNAME" })}
                    name={"nusercode"}
                    isSearchable={true}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    showOption={true}
                    options={props.sectionUsers || []}
                    optionId='nusercode'
                    optionValue='sfullname'
                    onChange={value => props.handleChange(value,"nusercode", "")}
                    value = { props.selectedRecord["nusercode"] ? props.selectedRecord["nusercode"]||[]:[]}
                    alphabeticalSort={true}
                >
                </FormMultiSelect>
                
                {/* <FormMultiSelect
                                        name={props.extractedColumnList[1].dataField}
                                        label={props.intl.formatMessage({ id: props.extractedColumnList[1].idsName })}
                                        options={props.comboDataList || []}
                                        optionId={props.extractedColumnList[1].optionId}
                                        optionValue={props.extractedColumnList[1].optionValue}
                                        value={props.selectedRecord ? props.selectedRecord[props.extractedColumnList[1].dataField]|| [] : []}
                                        isMandatory={true}
                                        isClearable={true}
                                        disableSearch={false}
                                        disabled={false}
                                        closeMenuOnSelect={false}
                                        alphabeticalSort={true}
                                        onChange={(event) => props.onComboChange(event, props.extractedColumnList[1].dataField)} */}
            </Col>

        </Row>
    )
}

export default injectIntl(AddParticipants);