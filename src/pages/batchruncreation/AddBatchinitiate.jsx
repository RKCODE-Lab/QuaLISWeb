import React from 'react';
import { injectIntl } from 'react-intl';
import {Row, Col} from 'react-bootstrap';

import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import MultiColumnComboSearch from '../../components/multi-column-combo-search/multi-column-combo-search';

const AddBatchinitiate = (props) =>{    
       return (<>
           <Row>                                
                <Col md={12}>
                   <Row>
                   <Col md={12}>
                   <DateTimePicker
                        name={"dtransactiondate"}
                        label={props.operation=="initiate" ? props.intl.formatMessage({ id: "IDS_BATCHINITIATEDTIME" }) : props.intl.formatMessage({ id: "IDS_BATCHCOMPLETEDTIME" })}
                        className='form-control'
                        placeholderText="Select date.."
                        selected={props.selectedRecord ? props.selectedRecord["dtransactiondate"] !== undefined ? props.selectedRecord["dtransactiondate"]: props.currentTime
                         : props.currentTime}
                        dateFormat={props.userInfo.ssitedatetime}
                        timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                        showTimeInput={true}
                        //showTimeSelect ={true}
                        isClearable={false}
                        timeIntervals={1}
                        onChange={date => props.handleDateChange("dtransactiondate", date)}
                        //value={props.selectedRecord["dexpirydate"]}
                        maxDate={props.currentTime}
                        //minTime={new Date()}
                        maxTime={props.currentTime}
                        minTime={props.currentTime}
                        isMandatory={true}
                        required={true}
                    />
                    </Col>

                    <Col md={12}>
                        <FormTextarea
                                name={"scomments"}
                                label={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                                onChange={(event) => props.onInputOnChange(event, 1)}
                                placeholder={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                                //ALPD-3588
                                value={props.selectedRecord["scomments"]?props.selectedRecord["scomments"]:""}
                                rows="2"
                                required={false}
                                maxLength={255}
                            >
                        </FormTextarea>
                    </Col>
                   </Row>
               </Col>      
        </Row>   
       
      </>
       )
   }
   export default injectIntl(AddBatchinitiate);
