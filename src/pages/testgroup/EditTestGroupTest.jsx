import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import { injectIntl } from 'react-intl';
import { formCode } from '../../components/Enumeration';

const EditTestGroupTest = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    name={"stestsynonym"}
                    label={props.intl.formatMessage({ id: "IDS_TESTSYNONYM" })}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event, 1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTSYNONYM" })}
                    value={props.selectedRecord ? props.selectedRecord["stestsynonym"] : ""}
                    isMandatory="*"
                    required={true}
                    maxLength={100}
                />
                {/* <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_SOURCE" })}
                    name={"nsourcecode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={true}
                    options={props.testGroupInputData.source}
                    optionId='nsourcecode'
                    optionValue='ssourcename'
                    onChange={value => props.onComboChange(value, "nsourcecode", 1)}
                    value={props.selectedRecord ? props.selectedRecord["nsourcecode"] : -1}
                    isSearchable={true}
                    alphabeticalSort={true}
                >
                </FormSelectSearch> */}
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_SECTION" })}
                    name={"nsectioncode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={true}
                    options={props.testGroupInputData.section}
                    optionId='nsectioncode'
                    optionValue='ssectionname'
                    onChange={value => props.onComboChange(value, "nsectioncode", 1)}
                    value={props.selectedRecord ? props.selectedRecord["nsectioncode"] : -1}
                    isSearchable={true}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_METHOD" })}
                    name={"nmethodcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={false}
                    options={props.testGroupInputData.method}
                    optionId='nmethodcode'
                    optionValue='smethodname'
                    onChange={value => props.onComboChange(value, "nmethodcode", 1)}
                    value={props.selectedRecord ? props.selectedRecord["nmethodcode"] : ""}
                    isSearchable={true}
                    alphabeticalSort={true}
                    isClearable={true}
                >
                </FormSelectSearch>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" })}
                    name={"ninstrumentcatcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={false}
                    options={props.testGroupInputData.instrumentCategory}
                    optionId='ninstrumentcatcode'
                    optionValue='sinstrumentcatname'
                    onChange={value => props.onComboChange(value, "ninstrumentcatcode", 1)}
                    value={props.selectedRecord ? props.selectedRecord["ninstrumentcatcode"] : ""}
                    isSearchable={true}
                    alphabeticalSort={true}
                    isClearable={true}
                >
                </FormSelectSearch>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_CONTAINERTYPE" })}
                    name={"ncontainertypecode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={false}
                    options={props.testGroupInputData.containerType}
                    optionId='ncontainertypecode'
                    optionValue='scontainertype'
                    onChange={value => props.onComboChange(value, "ncontainertypecode", 1)}
                    value={props.selectedRecord ? props.selectedRecord["ncontainertypecode"] : ""}
                    isSearchable={true}
                    alphabeticalSort={true}
                    isClearable={true}
                >
                </FormSelectSearch>


              {    (props.hideQualisForms && props.hideQualisForms.findIndex(item=>item.nformcode === formCode.TESTPACKAGE) === -1) &&

                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_TESTPACKAGE" })}
                    name={"ntestpackagecode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={false}
                    options={props.testGroupInputData.testpackage}
                    optionId='ntestpackagecode'
                    optionValue='stestpackagename'
                    onChange={value => props.onComboChange(value, "ntestpackagecode", 1)}
                    value={props.selectedRecord ? props.selectedRecord["ntestpackagecode"] : ""}
                    isSearchable={true}
                    alphabeticalSort={true}
                    isClearable={true}
                >
                </FormSelectSearch>
}
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_ATTACHMENT" })}
                    name={"ntestfilecode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={false}
                    options={props.testGroupInputData.testFile}
                    optionId='ntestfilecode'
                    optionValue='sfilename'
                    onChange={value => props.onComboChange(value, "ntestfilecode", 1)}
                    value={props.selectedRecord ? props.selectedRecord["ntestfilecode"] : ""}
                    isSearchable={true}
                    alphabeticalSort={true}
                    isClearable={true}
                >
                </FormSelectSearch>
                {/* need to Hide test group test's cost as we have test price screen as per Common FRS ?*/}
                <FormNumericInput
                    name={"ncost"}
                    label={props.intl.formatMessage({ id: "IDS_PRICE" })}
                    type="number"
                    value={props.selectedRecord["ncost"]}
                    placeholder={props.intl.formatMessage({ id: "IDS_PRICE" })}
                    strict={true}
                    maxLength={10}
                    onChange={(value) => props.onNumericInputChange(value, "ncost")}
                    noStyle={true}
                    precision={2}
                    className="form-control"
                    errors="Please provide a valid number."
                /> 
                <FormNumericInput
                    name={"nsorter"}
                    label={props.intl.formatMessage({ id: "IDS_SORTER" })}
                    type="number"
                    value={props.selectedRecord["nsorter"]}
                    placeholder={props.intl.formatMessage({ id: "IDS_SORTER" })}
                    strict={true}
                    maxLength={3}
                    onChange={(value) => props.onNumericInputChange(value, "nsorter")}
                    noStyle={true}
                    precision={0}
                    className="form-control"
                    errors="Please provide a valid number."
                />
                <FormNumericInput
                    name={"nrepeatcountno"}
                    label={props.intl.formatMessage({ id: "IDS_REPLICATECOUNT" })}
                    type="number"
                    value={props.selectedRecord["nrepeatcountno"]}
                    placeholder={props.intl.formatMessage({ id: "IDS_REPEATCOUNTNO" })}
                    strict={true}
                    maxLength={3}
                    min={1}
                    onChange={(value) => props.onNumericInputChange(value, "nrepeatcountno")}
                    noStyle={true}
                    precision={0}
                    className="form-control"
                    errors="Please provide a valid number."
                />
            </Col>
        </Row>
    );
};

export default injectIntl(EditTestGroupTest);