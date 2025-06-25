import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import { Col, Form, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { CONTAINERTYPE,transactionStatus } from '../../components/Enumeration';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';



const AddTestContainerType = (props) => {
 //   const { nresourecode,disabled } = props.selectedRecord;
 const { unit} = props
    return (
        <Col md="12">
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_CONTAINERTYPE" })}
                name={"ncontainertypecode"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={true}
                showOption={props.isMulti}
                options={props.containertype}
                optionId='ncontainertypecode'
                optionValue='scontainertype'
                defaultValue={props.selectedRecord["ncontainertypecode"]}
                onChange={value => props.onComboChange(value, props.isMulti?"availableData":"ncontainertypecode", 1)}
                value={props.selectedRecord["ncontainertypecode"] ? props.selectedRecord["ncontainertypecode"] || [] : []}
                isMulti={props.isMulti}
                isSearchable={true}
                closeMenuOnSelect={!props.isMulti}
                alphabeticalSort={true}
                isClearable={false}
            >
            </FormSelectSearch>

            {/* <FormInput
                    name={"nquantity"}
                    label={props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event, 4)}
                    placeholder={props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                    value={props.selectedRecord && props.selectedRecord["nquantity"] ? props.selectedRecord["nquantity"] : ""}
                    isMandatory="*"
                    required={true}
                    maxLength={6}
                    precision={2}
                /> */}
                 <Row>
                <Col md="6">
                <FormNumericInput
                    name={"nquantity"}
                    label={props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                    type="number"
                    value={props.selectedRecord["nquantity"]}
                    placeholder={props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                    strict={true}
                    min={0}
                    //max={9999999.99}
                    maxLength={6}
                    onChange={(value) => props.onNumericInputChange(value, "nquantity", "nunitcode")}
                    noStyle={true}
                    precision={2}
                    className="form-control"
                    errors="Please provide a valid number."
                /> 
                </Col>
                 <Col md="6">
                 <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_UNIT" })}
                    isSearchable={true}
                    name={"nunitcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={unit || []}
                    optionId='nunitcode'
                    optionValue='sunitname'
                   // value={props.selectedRecord ? props.selectedRecord["nunitcode"] : ""}
                   value={props.selectedRecord["ncontainertypecode"] ? props.selectedRecord["nunitcode"] || [] : []}

                    onChange={value => props.onComboChange(value, "nunitcode", 1)}
                    alphabeticalSort={true}
                    isMandatory={props.selectedRecord.unitMandatory ? props.selectedRecord.unitMandatory === true ? true : false : false}
                    isClearable={props.selectedRecord.unitMandatory ? props.selectedRecord.unitMandatory === true ? false : true : true}
                    isDisabled={(props.selectedRecord["nquantity"] === 0 || props.selectedRecord["nquantity"] === undefined) ? true : false}
                >
                </FormSelectSearch>
                </Col>
                </Row>
{/* <Form.Check 
                        name="noutsourcecode" 
                        type="checkbox"
                        id="AddFiles"
                        label={props.intl.formatMessage({ id: "IDS_OUTSOURCE" })}
                        inline={true}
                        onChange={(event)=>props.onInputOnChange(event, 1,CONTAINERTYPE)}
                        checked={props.selectedRecord ? props.selectedRecord["noutsourcecode"] === CONTAINERTYPE.YES ? true : false : false}
                       // disabled={disabled}
                    >
                    </Form.Check> */}
        </Col>
    );
};

export default injectIntl(AddTestContainerType);