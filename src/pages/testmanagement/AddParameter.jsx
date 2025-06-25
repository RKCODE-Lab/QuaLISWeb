import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Col,  Row } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import AddCodedResult from './AddCodedResult';
//import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import ReactSelectAddEdit from '../../components/react-select-add-edit/react-select-add-edit-component'
import { injectIntl } from 'react-intl';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
//import { CONTAINERTYPE } from '../../components/Enumeration';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../components/Enumeration';

const AddParameter = (props) => {
    const { needRoundingDigit, needUnit, parameterType, unit, testParameter,deltaperiod,resultaccuracy } = props.parameterData;
   //console.log("reound:",  props.selectedRecord["nroundingdigits"]);
    //console.log("reound:", props.selectedRecord["ndeltacheck"]);
    return (
        <Row>
            <Col md={12}>
                <ReactSelectAddEdit
                    name="sparametername"
                    label={props.intl.formatMessage({ id: "IDS_PARAMETERNAME" })}
                    className="color-select"
                    classNamePrefix="react-select"
                    optionId="sparametername"
                    optionValue="sparametername"
                    options={testParameter}
                    isMandatory={true}
                    getValue={value => props.onComboChange(value, "sparametername", 1)}
                    value={props.selectedRecord["sparametername"] ? props.selectedRecord["sparametername"] : ""}
                   displayNameSearch={props.intl.formatMessage({ id: "IDS_SEARCH" })}
                // defaultValue={props.selectedRecord? props.selectedRecord["sparametername"]:""}
                />
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
                />
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_PARAMETERTYPE" })}
                    isSearchable={false}
                    name={"nparametertypecode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    showOption={true}
                    options={parameterType || []}
                    optionId='nparametertypecode'
                    optionValue='sdisplaystatus'
                    value={props.selectedRecord ? props.selectedRecord["nparametertypecode"] : ""}
                    onChange={value => props.onComboChange(value, "nparametertypecode", 2)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                <Row>
                     <Col md={12}>
                        <FormInput
                            name={"nroundingdigits"}
                            type="text"
                            label={props.intl.formatMessage({ id: "IDS_ROUNDINGDIGITS" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_ROUNDINGDIGITS" })}
                            isDisabled={needRoundingDigit}
                            isMandatory={!needRoundingDigit}
                            required={!needRoundingDigit}
                            className="form-control"
                            value={props.selectedRecord["nroundingdigits"]?props.selectedRecord["nroundingdigits"] && typeof props.selectedRecord["nroundingdigits"] === "number" ?
                                props.selectedRecord["nroundingdigits"].toString() : props.selectedRecord["nroundingdigits"]:""}
                            onChange={value => props.onNumericInputChange(value, "nroundingdigits")}
                            maxLength={1}
                            onFocus={props.onFocus}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_UNIT" })}
                            isSearchable={true}
                            name={"nunitcode"}
                            isDisabled={needUnit}
                            placeholder={props.intl.formatMessage({ id: "IDS_UNIT" })}
                            isMandatory={!needUnit}
                            options={unit || []}
                            optionId='nunitcode'
                            optionValue='sunitname'
                            value={props.selectedRecord ? props.selectedRecord["nunitcode"] : ""}
                            onChange={value => props.onComboChange(value, "nunitcode",1)}
                            alphabeticalSort={true}
                        >
                        </FormSelectSearch>
                    </Col>


                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_CONVERSIONUNIT" })}
                            isSearchable={true}
                            name={"ndestinationunitcode"}
                            isDisabled={needUnit}
                            placeholder={props.intl.formatMessage({ id: "IDS_CONVERSIONUNIT" })}
                            isMandatory={false}
                            options={props.selectedRecord["nunitcode"]!==undefined&&props.selectedRecord["nunitcode"]!=="" ? props.DestinationUnit : []}
                            optionId='ndestinationunitcode'
                            optionValue='sunitname1'
                            value={props.selectedRecord ? props.selectedRecord["ndestinationunitcode"] : ""}
                            onChange={value => props.onComboChange(value, "ndestinationunitcode", 1)}
                            alphabeticalSort={true}
                          //  closeMenuOnSelect={true}
                            isClearable={true}

                        >
                        </FormSelectSearch>
                    </Col>

                   

                    <Col md={12}>
                        <FormInput
                            name={"soperator"}
                            type="text"
                            label={props.intl.formatMessage({ id: "IDS_CONVERSIONOPERATOR" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_CONVERSIONOPERATOR" })}
                            isDisabled={true}
                            isMandatory={false}
                            required={!needUnit}
                            className="form-control"
                            value={props.selectedRecord["ndestinationunitcode"]!=="" && props.selectedRecord["ndestinationunitcode"] != undefined ?  props.selectedRecord["soperator"]:""}
                            onChange={(event) => props.onInputOnChange(event, 1)}                            
                            maxLength={1}     
                        
                        />
                    </Col>
                    <Col md={12}>
                        <FormNumericInput
                            name={"nconversionfactor"}
                            type="number"
                            label={props.intl.formatMessage({ id: "IDS_CONVERSIONFACTOR" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_CONVERSIONFACTOR" })}
                            isDisabled={true}
                            isMandatory={false}
                            required={!needUnit}
                            className="form-control"
                            value={props.selectedRecord["ndestinationunitcode"]!==""&&props.selectedRecord["ndestinationunitcode"] != undefined? props.selectedRecord["nconversionfactor"]:""}
                            onChange={(value) => props.onNumericInputChange(value, "nconversionfactor")}                      
                            maxLength={10}  
                            strict={true}
                            noStyle={true} 
                            precision ={5}  
                            errors="Please provide a valid number."
                        
                        />

                        {/* <FormNumericInput
                           
                            min={1}
                           
                           
                        />   */}

                    </Col>
                    {/*ALPD-4363*/}
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_RESULTACCURACY" })}
                            isSearchable={true}
                            name={"nresultaccuracycode"}
                            isDisabled={needUnit}
                            placeholder={props.intl.formatMessage({ id: "IDS_RESULTACCURACY" })}
                            isMandatory={false}
                            options={resultaccuracy || []}
                            optionId='nresultaccuracycode'
                            optionValue='sresultaccuracyname'
                            value={props.selectedRecord ? props.selectedRecord["nresultaccuracycode"] : ""}
                            onChange={value => props.onComboChange(value, "nresultaccuracycode",1)}
                            alphabeticalSort={true}
                        >
                        </FormSelectSearch>
                    </Col>

                </Row>              
            </Col>
            <AddCodedResult
                onInputOnChange={props.onInputOnChange}
                parameterData={props.parameterData}
                selectedRecord={props.selectedRecord}
                onComboChange={props.onComboChange}
                userInfo={props.userInfo}
                //selectedsubcodedresult={this.state.selectedsubcodedresult||[]}
            ></AddCodedResult>
 
        <Col md={12}>
            <CustomSwitch
                    name={"ndeltacheck"}
                    label={props.intl.formatMessage({ id: "IDS_DELTACHECK"})}
                    type="switch"
                    onChange={(event)=>props.onInputOnChange(event, 1, [transactionStatus.YES, transactionStatus.NO])}
                    placeholder={props.intl.formatMessage({ id: "IDS_DELTACHECK"})}
                    defaultValue ={props.selectedRecord["ndeltacheck"] === 3 ? true :false}
                    checked={props.selectedRecord["ndeltacheck"] === 3 ? true :false}
                    disabled={needRoundingDigit}
                >
            </CustomSwitch> 

            <FormNumericInput
                    name={"ndeltacheckframe"}
                    label={props.intl.formatMessage({ id: "IDS_DELTACHECKTIMEFRAME" })}
                    type="number"
                    value={props.selectedRecord["ndeltacheckframe"]}
                    placeholder={props.intl.formatMessage({ id: "IDS_DELTACHECKTIMEFRAME" })}
                    strict={true}
                    min={0}
                    maxLength={3}
                    onChange={(value) => props.onNumericInputChange(value, "ndeltacheckframe")}
                    noStyle={true}
                    isDisabled={props.selectedRecord["ndeltacheck"] !== transactionStatus.YES}
                    className="form-control"
                    errors="Please provide a valid number."
                    
                />
            <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_DELTACHECKTIMEUNIT" })}
                    isSearchable={true}
                    isClearable={true}
                    name={"ndeltaunitcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_DELTACHECKTIMEUNIT" })}
                    options={deltaperiod || []}
                    value={props.selectedRecord ? props.selectedRecord["ndeltaunitcode"] : ""}
                    onChange={value => props.onComboChange(value, "ndeltaunitcode", 1)}
                    alphabeticalSort={true}
                    isDisabled={props.selectedRecord["ndeltacheck"] !== transactionStatus.YES}
                >
            </FormSelectSearch>

            <FormNumericInput
                    name={"ndeltachecklimitcode"}
                    label={props.intl.formatMessage({ id: "IDS_DELTACHECKLIMIT" })}
                    type="number"
                    value={props.selectedRecord["ndeltachecklimitcode"]}
                    placeholder={props.intl.formatMessage({ id: "IDS_DELTACHECKLIMIT" })}
                    strict={true}
                    min={0}
                    //max={9999999.99}
                    maxLength={6}
                    onChange={(value) => props.onNumericInputChange(value, "ndeltachecklimitcode")}
                    noStyle={true}
                    isDisabled={needRoundingDigit}
                    precision={2}
                    className="form-control"
                    errors="Please provide a valid number."
                /> 
            </Col>
        </Row>
    );
}

export default injectIntl(AddParameter);