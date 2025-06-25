
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { parameterType } from '../../components/Enumeration';

const EditTestGroupParameter = (props) => {
    const { needRoundingDigit, needUnit, unit ,resultaccuracy} = props.testGroupInputData;
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    name={"sparametersynonym"}
                    label={props.intl.formatMessage({ id: "IDS_PARAMETERSYNONYM" })}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event, 1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_PARAMETERSYNONYM" })}
                    value={props.selectedRecord && props.selectedRecord["sparametersynonym"] ? props.selectedRecord["sparametersynonym"] : ""}
                    isMandatory="*"
                    required={true}
                    maxLength={100}
                >
                </FormInput>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_PARAMETERTYPE" })}
                    isSearchable={false}
                    name={"nparametertypecode"}
                    isDisabled={false}
                    placeholder="Please Select..."
                    isMandatory={true}
                    showOption={true}
                    options={props.testGroupInputData.parameterType || []}
                    optionId='nparametertypecode'
                    optionValue='sdisplaystatus'
                    value={props.selectedRecord ? props.selectedRecord["nparametertypecode"] : ""}
                    onChange={value => props.onComboChange(value, "nparametertypecode", 2)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
            </Col>
            <Col md={6}>
                {/* <FormNumericInput
                    name={"nroundingdigits"}
                    label={props.intl.formatMessage({ id: "IDS_ROUNDINGDIGITS" })}
                    type="number"
                    onChange={(value) => props.onNumericInputChange(value, "nroundingdigits")}
                    placeholder={props.intl.formatMessage({ id: "IDS_ROUNDINGDIGITS" })}
                    value={props.selectedRecord["nroundingdigits"]}
                    min={0}
                    max={9}
                    maxLength={1}
                    noStyle={true}
                    precision={0}
                    strict={true}
                    isDisabled={needRoundingDigit}
                    isMandatory={!needRoundingDigit}
                    required={!needRoundingDigit}
                    className="form-control"
                    errors="Please provide a valid number."
                >
                </FormNumericInput> */}
                 <FormInput
                    name={"nroundingdigits"}
                    type="text"
                    label={props.intl.formatMessage({ id: "IDS_ROUNDINGDIGITS" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_ROUNDINGDIGITS" })}
                    isDisabled={needRoundingDigit}
                    isMandatory={!needRoundingDigit}
                    required={!needRoundingDigit}
                    className="form-control"
                    onFocus={props.onFocus}
                    value={props.selectedRecord["nroundingdigits"] && typeof props.selectedRecord["nroundingdigits"] === "number" ?
                        props.selectedRecord["nroundingdigits"].toString() : props.selectedRecord["nroundingdigits"]}
                    onChange={value => props.onNumericInputChange(value, "nroundingdigits")}
                    maxLength={1}
                />
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_UNIT" })}
                    isSearchable={true}
                    name={"nunitcode"}
                    isDisabled={needUnit}
                    placeholder="Please Select..."
                    isMandatory={!needUnit}
                    options={unit || []}
                    optionId='nunitcode'
                    optionValue='sunitname'
                    value={props.selectedRecord ? props.selectedRecord["nunitcode"] || {} : ""}
                    onChange={value => props.onComboChange(value, "nunitcode", 1)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                {/*ALPD-4363*/}
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_RESULTACCURACY" })}
                    isSearchable={true}
                    name={"nresultaccuracycode"}
                    isDisabled={needUnit}
                    placeholder="Please Select..."
                    isMandatory={false}
                    options={resultaccuracy || []}
                    optionId='nresultaccuracycode'
                    optionValue='sresultaccuracyname'
                    value={props.selectedRecord ? props.selectedRecord["nresultaccuracycode"] || {} : ""}
                    onChange={value => props.onComboChange(value, "nresultaccuracycode", 1)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
            </Col>
            <Col md={6}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_CHECKLIST" })}
                    isSearchable={false}
                    name={"nchecklistversioncode"}
                    isDisabled={false}
                    placeholder="Please Select..."
                    isMandatory={false}
                    showOption={false}
                    options={props.testGroupInputData.checkListVersion || []}
                    optionId='nchecklistversioncode'
                    optionValue='schecklistname'
                    value={props.selectedRecord ? props.selectedRecord["nchecklistversioncode"] : ""}
                    onChange={value => props.onComboChange(value, "nchecklistversioncode", 3)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                <FormInput
                    name={"schecklistversionname"}
                    label={props.intl.formatMessage({ id: "IDS_CHECKLISTVERSION" })}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event, 1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CHECKLISTVERSION" })}
                    value={props.selectedRecord && props.selectedRecord["schecklistversionname"] ? props.selectedRecord["schecklistversionname"] : ""}
                    required={false}
                    maxLength={100}
                    readOnly={true}
                ></FormInput>
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"sspecdesc"}
                    //label={props.intl.formatMessage({ id: "IDS_SPECDESCRIPTION" })}//
                    label={props.intl.formatMessage({ id: "IDS_PARAMETERDESCRIPTION" })}
                    onChange={(event) => props.onInputOnChange(event, 1)}
                    //placeholder={props.intl.formatMessage({ id: "IDS_SPECDESCRIPTION" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_PARAMETERDESCRIPTION" })}
                    value={props.selectedRecord ? props.selectedRecord["sspecdesc"] : ""}
                    rows="2"
                    required={false}
                    maxLength={255}
                >
                </FormTextarea>
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
                ></FormNumericInput>
            </Col>
            <Col md={6}>
                <CustomSwitch
                    name={"nreportmandatory"}
                    label={props.intl.formatMessage({ id: "IDS_REPORTMANDATORY" })}
                    type="switch"
                    onChange={(event) => props.onInputOnChange(event, 1, [3, 4])}
                    placeholder={props.intl.formatMessage({ id: "IDS_REPORTMANDATORY" })}
                    defaultValue={props.selectedRecord["nreportmandatory"] === 3 ? true : false}
                    checked={props.selectedRecord["nreportmandatory"] === 3 ? true : false}
                >
                </CustomSwitch>
                <CustomSwitch
                    name={"nresultmandatory"}
                    label={props.intl.formatMessage({ id: "IDS_RESULTMANDATORY" })}
                    type="switch"
                    onChange={(event) => props.onInputOnChange(event, 1, [3, 4])}
                    placeholder={props.intl.formatMessage({ id: "IDS_RESULTMANDATORY" })}
                    defaultValue={props.selectedRecord["nresultmandatory"] === 3 ? true : false}
                    checked={props.selectedRecord["nresultmandatory"] === 3 ? true : false}
                >
                </CustomSwitch>
                <CustomSwitch
                    name={"nisadhocparameter"}
                    label={props.intl.formatMessage({ id: "IDS_ADHOCPARAMETER" })}
                    type="switch"
                    onChange={(event) => props.onInputOnChange(event, 1, [3, 4])}
                    placeholder={props.intl.formatMessage({ id: "IDS_ADHOCPARAMETER" })}
                    defaultValue={props.selectedRecord["nisadhocparameter"] === 3 ? true : false}
                    checked={props.selectedRecord["nisadhocparameter"] === 3 ? true : false}
                >
                </CustomSwitch>
            </Col>
            {props.selectedRecord["parameterTypeCode"] && props.selectedRecord["parameterTypeCode"] === parameterType.NUMERIC &&
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_FORMULA" })}
                        isSearchable={false}
                        name={"ntestformulacode"}
                        isDisabled={false}
                        placeholder="Please Select..."
                        isMandatory={false}
                        showOption={true}
                        options={props.testGroupInputData.testFormula || []}
                        optionId='ntestformulacode'
                        optionValue='sformulaname'
                        value={props.selectedRecord ? props.selectedRecord["ntestformulacode"] : ""}
                        onChange={value => props.onComboChange(value, "ntestformulacode", 1)}
                        alphabeticalSort={true}
                        isClearable={true}
                    >
                    </FormSelectSearch>
                </Col>
            }
        </Row>
    );
};

export default injectIntl(EditTestGroupParameter);