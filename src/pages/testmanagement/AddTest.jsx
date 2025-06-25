import React from 'react';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Col, Row } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import AddTestMethod from './AddTestMethod';
import AddTestInstrumentCategory from './AddTestInstrumentCategory';
import AddTestSection from './AddTestSection';
import AddTestPackageTest from './AddTestPackageTest';
import { transactionStatus, formCode } from '../../components/Enumeration';


const AddTest = (props) => {
    const {period,interfacetype} = props.parameterData;
    return (
        <Row>
              <Col md={12}>
            
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_TESTCATEGORY" })}
                    isSearchable={true}
                    name={"ntestcategorycode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    showOption={true}
                    options={props.testData.testCategory || []}
                    optionId='ntestcategorycode'
                    optionValue='stestcategoryname'
                    value={props.selectedRecord["ntestcategorycode"]}
                    onChange={value => props.onComboChange(value, "ntestcategorycode", 1)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                <FormInput
                    name={"stestname"}
                    label={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event, 2)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                    value={props.selectedRecord?props.selectedRecord["stestname"]:""}
                    isMandatory="*"
                    required={true}
                    maxLength={100}
                />
                <FormInput
                    name={"stestsynonym"}
                    label={props.intl.formatMessage({ id: "IDS_TESTSYNONYM" })}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event, 1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTSYNONYM" })}
                    value={props.selectedRecord?props.selectedRecord["stestsynonym"]:""}
                    isMandatory="*"
                    required={true}
                    maxLength={100}
                />
                 <FormInput
                    name={"sshortname"}
                    label={props.intl.formatMessage({ id: "IDS_SHORTNAME" })}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event, 1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_SHORTNAME" })}
                    value={props.selectedRecord?props.selectedRecord["sshortname"]:""}
                   // isMandatory="*"
                    required={false}
                    maxLength={20}
                />
             { props.needOtherTest && 
                <>
                <AddTestSection
                    onComboChange={props.onComboChange}
                    selectedRecord={props.selectedRecord}
                    section={props.otherTestData.section}
                    isMulti={false}
                />
             
                <AddTestMethod
                    onComboChange={props.onComboChange}
                    selectedRecord={props.selectedRecord}
                    method={props.otherTestData.method}
                    isMulti={false}
                />
                 <AddTestInstrumentCategory
                    onComboChange={props.onComboChange}
                    selectedRecord={props.selectedRecord}
                    instrumentcategory={props.otherTestData.instrumentcategory}
                    isMulti={false}
                />
                </>
                }
                <FormNumericInput
                    name={"ncost"}
                    label={props.intl.formatMessage({ id: "IDS_PRICE" })}
                    type="number"
                    value={props.selectedRecord["ncost"]}
                    placeholder={props.intl.formatMessage({ id: "IDS_PRICE" })}
                    strict={true}
                    min={0}
                    //max={9999999.99}
                    maxLength={11}
                    onChange={(value) => props.onNumericInputChange(value, "ncost")}
                    noStyle={true}
                    precision={2}
                    className="form-control"
                    errors="Please provide a valid number."
                />

                <FormTextarea
                    name={"sdescription"}
                    label={props.intl.formatMessage({ id: "IDS_TESTPROCEDURE" })}
                    onChange={(event) => props.onInputOnChange(event, 1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTPROCEDURE" })}
                    value={props.selectedRecord?props.selectedRecord["sdescription"]:""}
                    rows="2"
                    required={false}
                    maxLength={2000}
                >
                </FormTextarea>

            <Row>
                <Col md={4}>
                    <CustomSwitch
                        name={"naccredited"}
                        label={props.intl.formatMessage({ id: "IDS_ACCREDITED" })}
                        type="switch"
                        onChange={(event) => props.onInputOnChange(event, 1, [transactionStatus.ACCREDITED, transactionStatus.NOTACCREDITED])}
                        placeholder={props.intl.formatMessage({ id: "IDS_ACCREDITED" })}
                        defaultValue={props.selectedRecord["naccredited"] === transactionStatus.ACCREDITED ? true : false }
                        checked={props.selectedRecord["naccredited"] === transactionStatus.ACCREDITED ? true : false }
                    />
                </Col>
                <Col md={4}>
                    <CustomSwitch
                        name={"ntransactionstatus"}
                        label={props.intl.formatMessage({ id: "IDS_ACTIVE"})}
                        type="switch"
                        onChange={(event)=>props.onInputOnChange(event, 1, [1, 2])}
                        //onChange={(event)=>props.onActiveStatusChange(event, [1, 2])}
                        placeholder={props.intl.formatMessage({ id: "IDS_ACTIVE"})}
                        defaultValue ={props.selectedRecord["ntransactionstatus"] === 1 ? true :false}
                        checked={props.selectedRecord["ntransactionstatus"] === 1 ? true :false}
                    />
                </Col>

                <Col md={4}>
                    <CustomSwitch
                        name={"ntrainingneed"}
                        label={props.intl.formatMessage({ id: "IDS_TRAININGNEEDED" })}
                        type="switch"
                        onChange={(event) => props.onInputOnChange(event, 1, [transactionStatus.YES, transactionStatus.NO])}
                        placeholder={props.intl.formatMessage({ id: "IDS_TRAININGNEEDED" })}
                        defaultValue={props.selectedRecord["ntrainingneed"] === transactionStatus.YES ? true : false }
                        checked={props.selectedRecord["ntrainingneed"] === transactionStatus.YES ? true : false }
                    />
                </Col>
            </Row>
            { props.needOtherTest && 
                  //(props.userRoleControlRights && Object.keys(props.userRoleControlRights).indexOf(formCode.TESTPACKAGE) !==-1) &&
                    (props.hideQualisForms && props.hideQualisForms.findIndex(item=>item.nformcode === formCode.TESTPACKAGE) === -1) &&
                    <AddTestPackageTest
                        onComboChange={props.onComboChange}
                        selectedRecord={props.selectedRecord}
                        package={props.otherTestData.package}
                        isMulti={false}
                    />
                }
 
            <Row>
                <Col md={6}>
                    <FormNumericInput
                        name={"ntat"}
                        label={props.intl.formatMessage({ id: "IDS_TAT" })}
                        type="number"
                        value={props.selectedRecord["ntat"]}
                        placeholder={props.intl.formatMessage({ id: "IDS_TAT" })}
                        strict={true}
                        min={0}
                        //max={9999999.99}
                        maxLength={3}
                        onChange={(value) => props.onNumericInputChange(value, "ntat")}
                        noStyle={true}
                        className="form-control"
                        errors="Please provide a valid number."
                    />
                 </Col>
                 <Col md={6}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_TATPERIOD" })}
                        isSearchable={true}
                        isClearable={true}
                        name={"ntatperiodcode"}
                        placeholder={props.intl.formatMessage({ id: "IDS_TATPERIOD" })}                   
                        options={period || []}
                        value={props.selectedRecord ? props.selectedRecord["ntatperiodcode"] : ""}
                        onChange={value => props.onComboChange(value, "ntatperiodcode", 1)}
                        alphabeticalSort={true}
                    >
                    </FormSelectSearch>
                </Col>
            </Row>
            <FormInput
                    name={"stestplatform"}
                    label={props.intl.formatMessage({ id: "IDS_TESTPLATFORM" })}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event, 1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTPLATFORM" })}
                    value={props.selectedRecord?props.selectedRecord["stestplatform"]:""}
                    required={false}
                    maxLength={100}
                />

           <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_INTERFACETYPE" })}
                    isSearchable={true}
                    name={"ninterfacetypecode"}
                    isClearable={true}
                    placeholder={props.intl.formatMessage({ id: "IDS_INTERFACETYPE" })}                   
                    options={interfacetype || []}
                    optionId='ninterfacetypecode'
                    optionValue='sinterfacetypename'
                    value={props.selectedRecord ? props.selectedRecord["ninterfacetypecode"] : ""}
                    onChange={value => props.onComboChange(value, "ninterfacetypecode", 1)}
                    alphabeticalSort={true}
                >
            </FormSelectSearch>     
        </Col>   
                   
        </Row>
     );
}

export default injectIntl(AddTest);