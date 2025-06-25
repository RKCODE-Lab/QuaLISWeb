import React from 'react'
import {Row, Col} from 'react-bootstrap';
import {injectIntl } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { transactionStatus } from '../../components/Enumeration';


const AddMethod = (props) => {
        
        return(
                <Row>
                    <Col md={12}>
                            <FormSelectSearch
                                    name={"nmethodcatcode"}
                                    formLabel={props.intl.formatMessage({ id:"IDS_METHODCATCODE"})}                              
                                    placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                              
                                    options={ props.methodCategoryList || []}
                                   // optionId='nmethodcatcode'
                                   // optionValue='smethodcatname'
                                    value = { props.selectedRecord ? props.selectedRecord["nmethodcatcode"]:""}
                                    isMandatory={true}
                                    isMulti={false}
                                    isSearchable={true}                                
                                    isDisabled={false}
                                    closeMenuOnSelect={true}
                                   // alphabeticalSort={true}
                                    onChange = {(event)=> props.onComboChange(event, 'nmethodcatcode')}                               
                            />
                    {/* </Col>
                    <Col md={12}> */}
                        <FormInput
                            label={props.intl.formatMessage({ id:"IDS_METHODNAME"})}
                            name={"smethodname"}
                            type="text"
                            onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_METHODNAME"})}
                            value ={props.selectedRecord?props.selectedRecord["smethodname"]:""}
                            isMandatory={true}
                            required={true}
                            maxLength={100}
                        />
                    {/* </Col>

                    <Col md={12}> */}
                        <FormTextarea
                            label={props.intl.formatMessage({ id:"IDS_REMARKS"})}
                            name={"sdescription"}
                            onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_REMARKS"})}
                            value ={props.selectedRecord ? props.selectedRecord["sdescription"] :""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={255}
                            >
                        </FormTextarea>
                        {props.operation==="create"?
                        <CustomSwitch
                            label={props.intl.formatMessage({ id:"IDS_METHODVALIDITYENABLE"})}
                            type="switch"
                            name={"nneedvalidity"}
                            onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_METHODVALIDITYENABLE"})}
                            defaultValue ={props.selectedRecord ? props.selectedRecord["nneedvalidity"] === 3 ? true :false:false}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["nneedvalidity"] === 3 ? true :false:false}
                            //disabled={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true :false:false}
                            >                                               

                        </CustomSwitch>
                         :""
                    } 
                     {props.operation==="create"? 
                       <Col md={props.userInfo.istimezoneshow === transactionStatus.YES  ? 6 : 12}>
                        <DateTimePicker
                       name={"dvaliditystartdate"} 
                       label={ props.intl.formatMessage({ id:"IDS_METHODVALIDITYSTARTDATE"})}                     
                       className='form-control'
                       placeholderText="Select date.."
                       selected={props.selectedRecord["dvaliditystartdate"]?props.selectedRecord["dvaliditystartdate"]:props.selectedRecord["dcurrentdate"] }
                       dateFormat={props.userInfo.ssitedate}
                       isMandatory={props.selectedRecord && props.selectedRecord["nneedvalidity"] ?props.selectedRecord["nneedvalidity"]===3?true:false:false}
                       minDate={props.selectedRecord["dcurrentdate"]}
                       isClearable={false}
                       onChange={date => props.handleDateChange("dvaliditystartdate", date,"svaliditystartdate")}
                       value={props.selectedRecord["dvaliditystartdate"]}
                       isDisabled={props.selectedRecord && props.selectedRecord["nneedvalidity"] ?props.selectedRecord["nneedvalidity"]===3?false:true:true}
                     />
                     
                        
                        
                     </Col>
                     : ""
                }
                     {props.userInfo.istimezoneshow  === transactionStatus.YES &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntzvaliditystartdatetimezone"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.TimeZoneList}
                                value={props.selectedRecord["ntzvaliditystartdatetimezone"] || ""}
                                defaultValue={props.selectedRecord["ntzvaliditystartdatetimezone"]}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                // isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(event) => props.onComboChange(event, 'ntzvaliditystartdatetimezone', 1)}
                            />
                        </Col>
                       
                    }
                      
                        
                       {props.operation==="create"? 
                <Col md={props.userInfo.istimezoneshow === transactionStatus.YES  ? 6 : 12}>
                    <DateTimePicker
                       name={"dvalidityenddate"} 
                       label={ props.intl.formatMessage({ id:"IDS_VALIDITYENDDATE"})}                     
                       className='form-control'
                       placeholderText="Select date.."
                       selected={props.selectedRecord["dvalidityenddate"]?props.selectedRecord["dvalidityenddate"]:props.selectedRecord["dcurrentdate"] }
                       dateFormat={props.userInfo.ssitedate}
                       isMandatory={props.selectedRecord && props.selectedRecord["nneedvalidity"] ?props.selectedRecord["nneedvalidity"]===3?true:false:false}
                       minDate={props.selectedRecord["dcurrentdate"]}
                       isClearable={false}
                       onChange={date => props.handleDateChange("dvalidityenddate", date,"svalidityenddate")}
                       value={props.selectedRecord["dvalidityenddate"]}
                       isDisabled={props.selectedRecord && props.selectedRecord["nneedvalidity"] ?props.selectedRecord["nneedvalidity"]===3?false:true:true}
                    />
                    </Col>
                    : "" }
                    {props.userInfo.istimezoneshow === transactionStatus.YES  &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntzvalidityenddatetimezone"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.TimeZoneList}
                                value={props.selectedRecord["ntzvalidityenddatetimezone"] || ""}
                                defaultValue={props.selectedRecord["ntzvalidityenddatetimezone"]}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                // isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(event) => props.onComboChange(event, 'ntzvalidityenddatetimezone', 1)}
                            />
                        </Col>
                    }
                    {/* :""
                } */}

                    {/* </Col>
                    <Col md={12}> */}
                        <CustomSwitch
                            label={props.intl.formatMessage({ id:"IDS_DEFAULTSTATUS"})}
                            type="switch"
                            name={"ndefaultstatus"}
                            onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_DEFAULTSTATUS"})}
                            defaultValue ={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true :false:false}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true :false:false}
                            //disabled={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true :false:false}
                            >                                               

                        </CustomSwitch>
                    </Col>
                        
                </Row>
            )   
}

export default injectIntl(AddMethod);