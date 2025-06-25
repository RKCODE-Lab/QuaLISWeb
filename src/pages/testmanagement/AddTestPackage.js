import React from 'react'
import {Row, Col} from 'react-bootstrap';
import {injectIntl } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
// import CustomSwitch from '../../components/custom-switch/custom-switch.component';
// import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const AddTestPackage = (props) => {
        
        return(
                <Row>
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id:"IDS_PACKAGENAME"})}
                            name={"stestpackagename"}
                            type="text"
                            onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_PACKAGENAME"})}
                            value ={props.selectedRecord?props.selectedRecord["stestpackagename"]:""}
                            isMandatory={true}
                            required={true}
                            maxLength={100}
                        />
{/* 
                      <FormTextarea
                            label={props.intl.formatMessage({ id:"IDS_PACKAGEREFRANCECODE"})}
                            name={"spackagerefcode"}
                            onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_PACKAGEREFRANCECODE"})}
                            value ={props.selectedRecord ? props.selectedRecord["spackagerefcode"] :""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={255}
                            >
                        </FormTextarea> */}


                        {/* <FormInput
                            label={props.intl.formatMessage({ id:"IDS_PACKAGEPRICE"})}
                            name={"npackageprice"}
                            type="text"
                            onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_PACKAGEPRICE"})}
                            value ={props.selectedRecord?props.selectedRecord["npackageprice"]:""}
                            isMandatory={true}
                            required={true}
                            maxLength={100}
                        /> */}

               <FormNumericInput
                    name={"ntestpackageprice"}
                    label={props.intl.formatMessage({ id: "IDS_PACKAGEPRICE" })}
                    type="number"
                    value={props.selectedRecord["ntestpackageprice"]}
                    placeholder={props.intl.formatMessage({ id: "IDS_PRICE" })}
                    strict={true}
                    min={0}
                    //max={99999999.99}
                    maxLength={11}
                    onChange={(value) => props.onNumericInputChange(value, "ntestpackageprice")}
                    noStyle={true}
                    precision={2}
                    //isMandatory={true}
                    className="form-control"
                    errors="Please provide a valid number."
                />


                           {/* <FormInput
                            label={props.intl.formatMessage({ id:"IDS_PACKAGETATPRICE"})}
                            name={"npackagetatdays"}
                            type="text"
                            onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_PACKAGETATPRICE"})}
                            value ={props.selectedRecord?props.selectedRecord["npackagetatdays"]:""}
                            isMandatory={true}
                            required={true}
                            maxLength={100}
                        /> */}

                  <FormNumericInput
                    name={"ntestpackagetatdays"}
                    label={props.intl.formatMessage({ id: "IDS_PACKAGETATPRICE" })}
                    type="number"
                    value={props.selectedRecord["ntestpackagetatdays"]}
                    placeholder={props.intl.formatMessage({ id: "IDS_PACKAGETATPRICE" })}
                    strict={true}
                    min={0}
                    isMandatory={false}
                    //max={99999999.99}
                    maxLength={3}
                    onChange={(value) => props.onNumericInputChange(value, "ntestpackagetatdays")}
                    noStyle={true}
                    className="form-control"
                    errors="Please provide a valid number."
                />
                    {/* </Col>
                    

                    <Col md={12}> */}

                    <FormInput
                        label={props.intl.formatMessage({ id:"IDS_OPENMRSREFERENCECODE"})}
                        name={"sopenmrsrefcode"}
                        type="text"
                        onChange={(event)=>props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id:"IDS_OPENMRSREFERENCECODE"})}
                        value ={props.selectedRecord?props.selectedRecord["sopenmrsrefcode"]:""}
                        //isMandatory={true}
                        required={false}
                        maxLength={20}
                    />
                    <FormInput
                        label={props.intl.formatMessage({ id:"IDS_PREVENTTBREFERENCECODE"})}
                        name={"spreventtbrefcode"}
                        type="text"
                        onChange={(event)=>props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id:"IDS_PREVENTTBREFERENCECODE"})}
                        value ={props.selectedRecord?props.selectedRecord["spreventtbrefcode"]:""}
                        //isMandatory={true}
                        required={false}
                        maxLength={20}
                    />
                    <FormInput
                        label={props.intl.formatMessage({ id:"IDS_PORTALREFERENCECODE"})}
                        name={"sportalrefcode"}
                        type="text"
                        onChange={(event)=>props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id:"IDS_PORTALREFERENCECODE"})}
                        value ={props.selectedRecord?props.selectedRecord["sportalrefcode"]:""}
                        //isMandatory={true}
                        required={false}
                        maxLength={20}
                    />
                        <FormTextarea
                            label={props.intl.formatMessage({ id:"IDS_DESCRIPTION"})}
                            name={"sdescription"}
                            onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_DESCRIPTION"})}
                            value ={props.selectedRecord ? props.selectedRecord["sdescription"] :""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={255}
                            >
                        </FormTextarea>
                    {/* </Col>
                    <Col md={12}> */}
                        
                    </Col>
                        
                </Row>
            )   
}

export default injectIntl(AddTestPackage);