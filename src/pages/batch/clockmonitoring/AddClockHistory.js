import React from 'react';
import {injectIntl} from 'react-intl';
import {Row, Col} from 'react-bootstrap';

import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';

const AddClockHistory = (props) =>{       
       return (
               <Row>                   
                   <Col md={12}>                   
                    
                       <DateTimePicker
                                    name={"dapproveddate"} 
                                    label={ props.intl.formatMessage({ id:"IDS_DATE"})}                     
                                    className='form-control'
                                    placeholderText="Select date.."
                                    selected={props.selectedRecord["dapproveddate"]}
                                    dateFormat={props.userInfo.ssitedatetime}
                                    timeInputLabel=  {props.intl.formatMessage({ id:"IDS_TIME"})}
                                    showTimeInput={true}
                                    isClearable={false}
                                    isMandatory={true}                       
                                    required={true}
                                    onChange={date => props.handleDateChange("dapproveddate", date)}
                                    value={props.selectedRecord["dapproveddate"]}
                                                                    
                        />                   
                        <FormSelectSearch
                                name={"ntzapproveddate"}
                                formLabel={ props.intl.formatMessage({ id:"IDS_TIMEZONE"})}                                
                                placeholder="Please Select..."                                
                                options={ props.timeZoneList}
                                value = { props.selectedRecord["ntzapproveddate"] }
                                defaultValue={props.selectedRecord["ntzapproveddate"]}
                                isMandatory={true}
                                isMulti={false}
                                isSearchable={true}
                                isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                onChange = {(event)=> props.onComboChange(event, 'ntzapproveddate')}                               
                        />
                       
                        <FormTextarea
                                name={"scomments"}
                                label={ props.intl.formatMessage({ id:"IDS_COMMENTS"})}                    
                                placeholder={ props.intl.formatMessage({ id:"IDS_COMMENTS"})}
                                value ={ props.selectedRecord["scomments"] || ""}
                                rows="2"
                                isMandatory={true}
                                required={true}
                                maxLength={255}
                                onChange={(event)=> props.onInputOnChange(event)}
                           />
                   </Col>       
                            
               </Row>           
       )
   }
   export default injectIntl(AddClockHistory);
