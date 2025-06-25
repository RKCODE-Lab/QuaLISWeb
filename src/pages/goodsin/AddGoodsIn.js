import React from 'react';
import {injectIntl } from 'react-intl';
import {Row, Col} from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import {transactionStatus} from '../../components/Enumeration';

const AddGoodsIn = (props) =>{    
    
       return (
           <Row>                                
                <Col md={6}>
                    <Row>
                         <Col md={12}>

                              <FormSelectSearch
                                   name={"nclientcatcode"}
                                   formLabel={ props.intl.formatMessage({ id:"IDS_CLIENTCATEGORY"})}                                
                                   placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                              
                                   options={ props.ClientCategory}
                                   value = { props.selectedRecord["nclientcatcode"] || ""}
                                   isMandatory={true}
                                   isMulti={false}
                                   isSearchable={true}                               
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   defaultValue={props.selectedRecord["nclientcatcode"]}
                                   onChange = {(event)=> props.onComboChange(event, 'nclientcatcode')}  
                              />

                              <FormSelectSearch
                                   name={"nclientcode"}
                                   formLabel={ props.intl.formatMessage({ id:"IDS_CLIENT"})}                                
                                   placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                              
                                   options={props.selectedRecord["nclientcatcode"]!==undefined? props.Client : []}
                                   value = { props.selectedRecord["nclientcode"] || ""}
                                   isMandatory={true}
                                   isMulti={false}
                                   isSearchable={true}                               
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   defaultValue={props.selectedRecord["nclientcode"]}
                                   onChange = {(event)=> props.onComboChange(event, 'nclientcode')}  
                              />

                              <FormSelectSearch
                                   name={"nprojecttypecode"}
                                   formLabel={ props.intl.formatMessage({ id:"IDS_PROJECTTYPE"})}                                
                                   placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                              
                                   options={ props.selectedRecord["nclientcode"]!==undefined && props.selectedRecord["nclientcode"]!=="" ? props.ProjectType:[]}
                                   value = { props.selectedRecord["nprojecttypecode"] || ""}
                                   isMandatory={false}
                                   isClearable={true}
                                   isMulti={false}
                                   isSearchable={true}                               
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   defaultValue={props.selectedRecord["nprojecttypecode"]}
                                   onChange = {(event)=> props.onComboChange(event, 'nprojecttypecode')}  
                              />
                   
                              <FormSelectSearch
                                   name={"nprojectmastercode"}
                                   formLabel={ props.intl.formatMessage({ id:"IDS_PROJECT"})}                                
                                   placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                
                                   options={props.selectedRecord["nprojecttypecode"] !==null&&props.selectedRecord["nprojecttypecode"] !==undefined &&props.selectedRecord["nprojecttypecode"]!=="" ? props.Project :[]}
                                   value = {props.selectedRecord["nprojecttypecode"] !==null && props.selectedRecord["nprojecttypecode"] !==undefined?
                                             props.selectedRecord["nprojectmastercode"] || "" : ""}
                                   isMandatory={false}
                                   isClearable={true}
                                   isMulti={false}
                                   isSearchable={true}                               
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   defaultValue={props.selectedRecord["nprojectmastercode"]}
                                   onChange = {(event)=> props.onComboChange(event, 'nprojectmastercode')}  
                              />
                    
                              <FormSelectSearch
                                  name={"ncouriercode"}
                                  formLabel={ props.intl.formatMessage({ id:"IDS_COURIERCARRIER"})}                                
                                  placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                
                                  options={ props.Courier}
                                  value = { props.selectedRecord["ncouriercode"] || ""}
                                  isMandatory={false}
                                  isClearable={true}
                                  isMulti={false}
                                  isSearchable={true}                               
                                  isDisabled={false}
                                  closeMenuOnSelect={true}
                                  defaultValue={props.selectedRecord["ncouriercode"]}
                                  onChange = {(event)=> props.onComboChange(event, 'ncouriercode')}  
                              />
                                             
                              <FormNumericInput
                                   name={"nnoofpackages"}
                                   label={ props.intl.formatMessage({ id:"IDS_NOOFPACKAGES"})}  
                                   placeholder={ props.intl.formatMessage({ id:"IDS_NOOFPACKAGES"})}                        
                                   value ={ props.selectedRecord["nnoofpackages"]}
                                   type="number"                               
                                   strict={true}
                                   maxLength={9}
                                   noStyle={true}
                                   onChange={(event) => props.onNumericInputOnChange(event, "nnoofpackages")}
                                   precision={0}
                                   min={1}
                                   className="form-control"
                                   isMandatory={true}
                                   required={true}
                                   errors="Please provide a valid number."
                              />                       
                         </Col>                   
                    </Row>
               </Col>
               <Col md={6}>
                    <Row>
                         <Col md={12}> 

                              <FormInput
                                   name={"sconsignmentno"}
                                   type="text"
                                   label={ props.intl.formatMessage({ id:"IDS_CONSIGNMENTNO"})}                  
                                   placeholder={ props.intl.formatMessage({ id:"IDS_CONSIGNMENTNO"})}
                                   value ={ props.selectedRecord["sconsignmentno"] || ""}
                                   isMandatory={false}
                                   required={false}
                                   maxLength={100}
                                   onChange={(event)=> props.onInputOnChange(event)}
                              /> 
                               
                              <DateTimePicker
                                        name={"dgoodsindatetime"} 
                                        label={ props.intl.formatMessage({ id:"IDS_GOODSINDATE"})}                     
                                        className='form-control'
                                        placeholderText="Select date.."
                                        selected={props.selectedRecord["dgoodsindatetime"]}
                                        dateFormat={props.userInfo.ssitedatetime}
                                        timeInputLabel=  {props.intl.formatMessage({ id:"IDS_TIME"})}
                                        showTimeInput={true}
                                        isClearable={false}
                                        isMandatory={true}                       
                                        required={true}
                                        maxTime={props.currentTime}
                                        onChange={date => props.handleDateChange("dgoodsindatetime", date)}
                                        value={props.selectedRecord["dgoodsindatetime"]}
                              />
                              {props.userInfo.istimezoneshow === transactionStatus.YES &&
                                   <FormSelectSearch
                                        name={"ntimezonecode"}
                                        formLabel={ props.intl.formatMessage({ id:"IDS_TIMEZONE"})}                                
                                        placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                               
                                        options={ props.TimeZone}
                                        value = { props.selectedRecord["ntimezonecode"] || ""}
                                        isMandatory={true}
                                        isMulti={false}
                                        isSearchable={true}
                                        isClearable={false}                               
                                        isDisabled={false}
                                        closeMenuOnSelect={true}
                                        defaultValue={props.selectedRecord["ntimezonecode"]}
                                        onChange = {(event)=> props.onComboChange(event, 'ntimezonecode')}
                                   />
                              }
                        
                              <CustomSwitch
                                   name={"noutofhours"}
                                   type="switch"
                                   label={ props.intl.formatMessage({ id:"IDS_OUTOFHOURS"})}
                                   placeholder={ props.intl.formatMessage({ id:"IDS_OUTOFHOURS"})}                            
                                   defaultValue ={ props.selectedRecord["noutofhours"] === transactionStatus.YES ? true :false }  
                                   isMandatory={false}                       
                                   required={false}
                                   checked={ props.selectedRecord["noutofhours"] === transactionStatus.YES ? true :false}
                                   onChange={(event)=> props.onInputOnChange(event)}
                              />
                         
                              <FormInput
                                   name={"ssecurityrefno"}
                                   type="text"
                                   label={ props.intl.formatMessage({ id:"IDS_SECURITYREFNO"})}                  
                                   placeholder={ props.intl.formatMessage({ id:"IDS_SECURITYREFNO"})}
                                   value ={ props.selectedRecord["ssecurityrefno"] || ""}
                                   isMandatory={props.selectedRecord["noutofhours"] === transactionStatus.YES ? true :false}
                                   required={props.selectedRecord["noutofhours"] === transactionStatus.YES ? true :false}
                                   maxLength={100}
                                   onChange={(event)=> props.onInputOnChange(event)}
                              />
                         
                              <FormTextarea
                                   name={"scomments"}
                                   label={ props.intl.formatMessage({ id:"IDS_COMMENTS"})}                    
                                   placeholder={ props.intl.formatMessage({ id:"IDS_COMMENTS"})}
                                   value ={ props.selectedRecord["scomments"] || ""}
                                   rows="2"
                                   isMandatory={false}
                                   required={false}
                                   maxLength={255}
                                   onChange={(event)=> props.onInputOnChange(event)}
                              />
                         </Col>         
                   </Row>
               </Col>              
          </Row>   
       )
   }
   export default injectIntl(AddGoodsIn);
