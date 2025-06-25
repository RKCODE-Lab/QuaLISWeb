import React from 'react'
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
//import FormMultiSelect from '../../../components/form-multi-select/form-multi-select.component';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import FormNumericInput from '../../../components/form-numeric-input/form-numeric-input.component';

import { injectIntl } from 'react-intl';

const AddValidityExpiry = (props) => {

    return (
        <Row>           
            
            <Col md={12}>
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_TRAININGEXPIRYNEED" })}
                            type="switch"
                            name={"nvalidityneed"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_TRAININGEXPIRYNEED" })}
                            defaultValue={props.selectedRecord ? props.selectedRecord["nvalidityneed"] === 3 ? true : false : ""}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["nvalidityneed"] === 3 ? true : false : false}
                        />
                    </Col>
                    
                    <Col md={6}>
    
                        <FormNumericInput
                        name="nvalidityexpiryvalue"
                        label={props.intl.formatMessage({ id: "IDS_TRAININGEXPIRYVALUE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_TRAININGEXPIRYVALUE" })}
                        type="number"
                        isDisabled={props.selectedRecord ? props.selectedRecord["nvalidityneed"] === 3 ? false : true : true }
                        value={props.selectedRecord["nvalidityexpiryvalue"]}
                        max={999}
                        min={0}
                        strict={true}
                        maxLength={3}
                        onChange={(event) => props.onInputOnChange(event,1,"nvalidityexpiryvalue")}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={props.selectedRecord ? props.selectedRecord["nvalidityneed"] === 3 ? true : false : false}
                        errors="Please provide a valid number."
                    />
                    </Col>
                
                    
                    <Col md={6}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_PERIOD" })}
                            isSearchable={true}
                            name={"nperiodcode"}
                            isDisabled={props.selectedRecord ? props.selectedRecord["nvalidityneed"] === 3 ? false : true : true }
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={props.selectedRecord ? props.selectedRecord["nvalidityneed"] === 3 ? true : false : false}
                            isClearable={true}
                            required={false}
                            isMulti={false}
                            options={props.period}
                            value={props.selectedRecord["nvalidityexpiryperiod"] || ""}
                            defaultValue={props.selectedRecord["nvalidityexpiryperiod"]}
                            onChange={(event) => props.onComboChange(event, "nvalidityexpiryperiod", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>                       
                       
                    </Col>         
              </Row>
    )
}

export default injectIntl(AddValidityExpiry);