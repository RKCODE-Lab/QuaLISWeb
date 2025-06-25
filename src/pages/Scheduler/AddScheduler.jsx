import React from 'react';
import { injectIntl } from 'react-intl';
import {Row, Col} from 'react-bootstrap';

import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';

import {transactionStatus, attachmentType} from '../../components/Enumeration';

const AddScheduler = (props) =>{    
    return (<>
        <Row>                                
             <Col md={12}>
                 <Row>
                      <Col md={12}>
                           <FormInput
                                name={"sschedulename"}
                                type="text"
                                label={ props.intl.formatMessage({ id:"IDS_SCHEDULERNAME"})}                  
                                placeholder={ props.intl.formatMessage({ id:"IDS_SCHEDULERNAME"})}
                                value ={ props.selectedRecord["sschedulename"] ? props.selectedRecord["sschedulename"]:""}
                                isMandatory={true}
                                required={true}
                                maxLength={100}
                                //readOnly = { props.userLogged}
                                onChange={(event)=> props.onInputOnChange(event)}
                           />
                     
                           {/* <FormInput
                                name={"sremarks"}
                                type="text"
                                label={ props.intl.formatMessage({ id:"IDS_REMARKS"})}                            
                                placeholder={ props.intl.formatMessage({ id:"IDS_REMARKS"})}
                                value ={ props.selectedRecord["sremarks"] ? props.selectedRecord["sremarks"].trim()!=="null"?props.selectedRecord["sremarks"].trim():"":"" }
                                isMandatory={false}
                                required={true}
                                maxLength={255}
                                onChange={(event)=> props.onInputOnChange(event)}                            
                           /> */}
                           {/* <FormTextarea
                                   name={"sremarks"}
                                   label={ props.intl.formatMessage({ id:"IDS_REMARKS"})}                      
                                   placeholder={ props.intl.formatMessage({ id:"IDS_REMARKS"})}
                                   value ={ props.selectedRecord["sremarks"] ? props.selectedRecord["sremarks"].trim()!=="null"?props.selectedRecord["sremarks"].trim():"":"" }
                                   rows="2"
                                   isMandatory={false}
                                   required={false}
                                   maxLength={255}
                                   onChange={(event)=> props.onInputOnChange(event)}
                                   /> */}
                      <FormSelectSearch
                      name={"nschedulertypecode"}
                      formLabel={ props.intl.formatMessage({ id:"IDS_SCHEDULERTYPE"})}                                
                      placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                
                      options={ props.schedulerTypeList}
                      value = { props.selectedRecord["nschedulertypecode"] }
                      //defaultValue={props.selectedRecord["nschedulertypecode"]}
                      isMandatory={true}
                      isClearable={false}
                      isMulti={false}
                      isSearchable={true}                               
                      isDisabled={false}
                      closeMenuOnSelect={true}
                      //alphabeticalSort={false}
                      onChange = {(event)=> props.onComboChange(event, 'nschedulertypecode')}                               
                    />
                     </Col>                   
                </Row>
            </Col>
            <Col md={12}>   
                 <Row>                   
                 <Col md={12}>

                
              {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2?
                 <FormSelectSearch
                      name={"ntyperecurringcode"}
                      formLabel={ props.intl.formatMessage({ id:"IDS_RECURRINGMODE"})}                                
                      placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                
                      options={ props.recurringList}
                      value = { props.selectedRecord["ntyperecurringcode"] }
                      //defaultValue={props.selectedRecord["nrecurringcode"]}
                      isMandatory={true}
                      isClearable={false}
                      isMulti={false}
                      isSearchable={true}                               
                      isDisabled={false}
                      closeMenuOnSelect={true}
                      //alphabeticalSort={false}
                      onChange = {(event)=> props.onComboChange(event, 'ntyperecurringcode')}                               
                    />
                    :""}
              </Col>
            </Row>
            {/* <Row> 
                 <Col md={6}>
                    <CustomSwitch                          
                        name={"ntransactionstatus"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_ISACTIVE"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_ISACTIVE"})}
                        defaultValue ={ props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                      //   disabled={props.selectedRecord["nlogintypecode"] === transactionStatus.LOGINTYPE_ADS}
                        checked={ props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                </Col>
                 <Col md={6}>
                    <CustomSwitch
                         name={"nlockmode"}
                         type="switch"
                         label={ props.intl.formatMessage({ id:"IDS_LOCKMODE"})}
                         placeholder={ props.intl.formatMessage({ id:"IDS_LOCKMODE"})}                            
                         defaultValue ={ props.selectedRecord["nlockmode"] === transactionStatus.UNLOCK ? true :false }  
                         isMandatory={false}                       
                         required={false}
                      //    disabled={props.selectedRecord["nlogintypecode"] === transactionStatus.LOGINTYPE_ADS}
                         checked={ props.selectedRecord["nlockmode"] === transactionStatus.UNLOCK ? true :false}
                         onChange={(event)=> props.onInputOnChange(event)}
                      />
                </Col> 
                
             </Row>   */}
         </Col> 
         <Col md={6}>   
           <Row>                   
               <Col md={12}>
               {/* {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"] &&
                 props.selectedRecord["ntyperecurringcode"] !== null &&
                 props.selectedRecord["ntyperecurringcode"].value === 1 ?
                     
                    <DateTimePicker
                       name={"soccurencehourwiseinterval"} 
                       label={ props.intl.formatMessage({ id:"IDS_OCCURRENCEHOURWISE"})}                     
                       className='form-control'
                       placeholderText="--:--"
                       selected={props.selectedRecord["soccurencehourwiseinterval"] && 
                                 props.selectedRecord["soccurencehourwiseinterval"]!=="null "?
                                 props.selectedRecord["soccurencehourwiseinterval"] : ""}
                       //dateFormat={"Pp"}
                       timeInputLabel="Time:"
                       timeIntervals={5}
                       isMandatory={true}
                       timeCaption="Time"
                       dateFormat="H:mm "
                       showTimeSelect={true}
                       showTimeSelectOnly={true}
                       timeFormat={"HH:mm"}
                       showTimeInput={true}
                       onSelect={true}
                       //dateFormat={props.userInfo.ssitedate}
                       isClearable={false}
                       onChange={time => props.handleDateChange("soccurencehourwiseinterval", time)}
                       value={props.selectedRecord["soccurencehourwiseinterval"] && 
                       props.selectedRecord["soccurencehourwiseinterval"]!=="null "?
                       props.selectedRecord["soccurencehourwiseinterval"] : "11:15"}
                       //value={props.selectedRecord["dstarttime"]}
                    />  
                     :""} */}

               {/* {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 1 ?
                     <FormInput
                      name={"noccurencenooftimes"}
                      type="text"
                      label={ props.intl.formatMessage({ id:"IDS_OCCURRENCE"})}                   
                      placeholder={ props.intl.formatMessage({ id:"IDS_OCCURRENCE"})}
                      value ={ props.selectedRecord["noccurencenooftimes"] }
                     
                      required={false}
                      isMandatory={true}
                      maxLength={3}
                      
                      onChange={(event)=> props.onInputOnChange(event)}
                    />   
                    :""} */}
                  
                     
                </Col>
            </Row> 
          </Col>
          <Col md={6}>   
              <Row>                   
                 <Col md={12}>
                 {/* {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 1 ?
                    <FormInput
                      name={"noccurencedaywiseinterval"}
                      type="text"
                      label={ props.intl.formatMessage({ id:"IDS_OCCURRENCEDAYWISE"})}                   
                      placeholder={ props.intl.formatMessage({ id:"IDS_OCCURRENCEDAYWISE"})}
                      value ={ props.selectedRecord["noccurencedaywiseinterval"] }
                      isMandatory={true}
                      required={false}
                      maxLength={3}
                     
                      onChange={(event)=> props.onInputOnChange(event)}
                  />   
                  :""} */}
                </Col>
              </Row> 
            </Col>

      <Col md={6}>   
           <Row>                   
               <Col md={12}>
               {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
               <FormSelectSearch
                      name={"nrecurringperiodcode"}
                      formLabel={ props.intl.formatMessage({ id:"IDS_MONTHLYOCCURRENCETYPE"})}                                
                      placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                
                      options={ props.monthlyTypeList}
                      value = { props.selectedRecord["nrecurringperiodcode"] }
                      //defaultValue={props.selectedRecord["nmonthlyoccurrencetype"]}
                      isMandatory={true}
                      isClearable={false}
                      isMulti={false}
                      isSearchable={true}                               
                      isDisabled={false}
                      closeMenuOnSelect={true}
                      //alphabeticalSort={false}
                      onChange = {(event)=> props.onComboChange(event, 'nrecurringperiodcode')}                               
                    /> 
                    :""}
                     </Col>
            </Row> 
          </Col>
          <Col md={6}>   
           <Row>                   
               <Col md={12}>
               {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 &&
                 props.selectedRecord["nrecurringperiodcode"].value === 1 ?
                    <FormInput
                      name={"nexactday"}
                      type="text"
                      label={ props.intl.formatMessage({ id:"IDS_EXACTDAY"})}                   
                      placeholder={ props.intl.formatMessage({ id:"IDS_EXACTDAY"})}
                      value ={ props.selectedRecord["nexactday"] }
                      isMandatory={props.selectedRecord["nschedulertypecode"] && 
                                   props.selectedRecord["nschedulertypecode"].value === 2 && 
                                   props.selectedRecord["ntyperecurringcode"].value === 3 &&
                                   props.selectedRecord["nrecurringperiodcode"].value === 1 ? true:false}
                      required={false}
                      maxLength={3}
                      onChange={(event)=> props.onInputOnChange(event)}
                  /> 
                  :""}
                     </Col>
            </Row> 
          </Col>
          <Col md={4}>   
           <Row>                   
               <Col md={12}>
               {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                    <CustomSwitch                          
                        name={"njan"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_JANUARY"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_JANUARY"})}
                        defaultValue ={ props.selectedRecord["njan"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["njan"] === undefined ? true: props.selectedRecord["njan"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                  {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                     <CustomSwitch                          
                        name={"nfeb"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_FEBRUARY"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_FEBRUARY"})}
                        //defaultValue ={ props.selectedRecord["nfeb"] === transactionStatus.ACTIVE ? true :false}
                       
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nfeb"] === undefined ? true: props.selectedRecord["nfeb"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                  {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                     <CustomSwitch                          
                        name={"nmar"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_MARCH"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_MARCH"})}
                        defaultValue ={ props.selectedRecord["nmar"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nmar"] === undefined ? true: props.selectedRecord["nmar"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                       {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                       <CustomSwitch                          
                        name={"napr"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_APRIL"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_APRIL"})}
                        defaultValue ={ props.selectedRecord["napr"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["napr"] === undefined ? true: props.selectedRecord["napr"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                              </Col>
            </Row> 
          </Col>
          <Col md={4}>   
           <Row>                   
               <Col md={12}>
                       {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                       <CustomSwitch                          
                        name={"nmay"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_MAY"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_MAY"})}
                        defaultValue ={ props.selectedRecord["nmay"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nmay"] === undefined ? true: props.selectedRecord["nmay"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                       {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                       <CustomSwitch                          
                        name={"njun"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_JUNE"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_JUNE"})}
                        defaultValue ={ props.selectedRecord["njun"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["njun"] === undefined ? true: props.selectedRecord["njun"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                        {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                  <CustomSwitch                          
                        name={"njul"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_JULY"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_JULY"})}
                        defaultValue ={ props.selectedRecord["njul"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["njul"] === undefined ? true: props.selectedRecord["njul"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                  {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                     <CustomSwitch                          
                        name={"naug"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_AUGUST"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_AUGUST"})}
                        defaultValue ={ props.selectedRecord["naug"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["naug"] === undefined ? true: props.selectedRecord["naug"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                                </Col>
            </Row> 
          </Col>
          <Col md={4}>   
              <Row>                   
                 <Col md={12}>
                 
                 
                  {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                     <CustomSwitch                          
                        name={"nsep"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_SEPTEMBER"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_SEPTEMBER"})}
                        defaultValue ={ props.selectedRecord["nsep"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nsep"] === undefined ? true: props.selectedRecord["nsep"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                  {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                       <CustomSwitch                          
                        name={"noct"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_OCTOBER"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_OCTOBER"})}
                        defaultValue ={ props.selectedRecord["noct"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["noct"] === undefined ? true: props.selectedRecord["noct"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                  {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                       <CustomSwitch                          
                        name={"nnov"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_NOVEMBER"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_NOVEMBER"})}
                        defaultValue ={ props.selectedRecord["nnov"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nnov"] === undefined ? true: props.selectedRecord["nnov"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                    {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 3 ?
                       <CustomSwitch                          
                        name={"ndec"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_DECEMBER"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_DECEMBER"})}
                        defaultValue ={ props.selectedRecord["ndec"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["ndec"] === undefined ? true: props.selectedRecord["ndec"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                </Col>
              </Row> 
            </Col> 

            <Col md={4}>   
           <Row>                   
               <Col md={12}>
               {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 2 ?      
                  <CustomSwitch                          
                        name={"nsunday"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_SUNDAY"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_SUNDAY"})}
                        //defaultValue ={ props.selectedRecord["nsunday"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nsunday"] === undefined ? true: props.selectedRecord["nsunday"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                  {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 2 ?
                     <CustomSwitch                          
                        name={"nmonday"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_MONDAY"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_MONDAY"})}
                        //defaultValue ={ props.selectedRecord["nmonday"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nmonday"] === undefined ? true:  props.selectedRecord["nmonday"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                  {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 2 ?
                     <CustomSwitch                          
                        name={"ntuesday"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_TUESDAY"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_TUESDAY"})}
                        //defaultValue ={ props.selectedRecord["ntuesday"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["ntuesday"] === undefined ? true: props.selectedRecord["ntuesday"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                        </Col>
              </Row> 
            </Col> 
            <Col md={4}>   
           <Row>                   
               <Col md={12}>
                  {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 2 ?
                       <CustomSwitch                          
                        name={"nwednesday"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_WEDNESDAY"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_WEDNESDAY"})}
                        //defaultValue ={ props.selectedRecord["nwednesday"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nwednesday"] === undefined ? true: props.selectedRecord["nwednesday"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                       {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 2 ?
                  <CustomSwitch                          
                        name={"nthursday"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_THURSDAY"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_THURSDAY"})}
                        //defaultValue ={ props.selectedRecord["nthursday"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nthursday"] === undefined ? true: props.selectedRecord["nthursday"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                  {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 2 ?
                     <CustomSwitch                          
                        name={"nfriday"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_FRIDAY"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_FRIDAY"})}
                        //defaultValue ={ props.selectedRecord["nfriday"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nfriday"] === undefined ? true: props.selectedRecord["nfriday"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                </Col>
            </Row> 
          </Col>
          <Col md={4}>   
              <Row>                   
                 <Col md={12}>
                     
                 
                    {props.selectedRecord["nschedulertypecode"] && 
                 props.selectedRecord["nschedulertypecode"].value === 2 && 
                 props.selectedRecord["ntyperecurringcode"].value === 2 ?
                     <CustomSwitch                          
                        name={"nsaturday"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_SATURDAY"})}                          
                        placeholder={ props.intl.formatMessage({ id:"IDS_SATURDAY"})}
                        //defaultValue ={ props.selectedRecord["nsaturday"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nsaturday"] === undefined ? true: props.selectedRecord["nsaturday"] === transactionStatus.ACTIVE ? true :false }
                        onChange={(event)=> props.onInputOnChange(event)}
                       />
                       :""}
                </Col>
              </Row> 
            </Col> 

        <Col md={6}>   
          <Row>                   
             <Col md={12}>
                     
                  <DateTimePicker
                       name={"dstartdate"} 
                       label={ props.intl.formatMessage({ id:"IDS_STARTDATE"})}                     
                       className='form-control'
                       placeholderText="Select date.."
                       selected={props.selectedRecord["sstartdate"] || ""}
                       // dateFormat={"dd/MM/yyyy"}
                       dateFormat={props.userInfo.ssitedate}
                       isMandatory={true}
                       isClearable={false}
                       minDate={new Date()}
                       onChange={date => props.handleDateChange("dstartdate", date,"sstartdate")}
                       value={props.selectedRecord["dstartdate"]}
                    />
                    {props.selectedRecord["nschedulertypecode"] && 
                      props.selectedRecord["nschedulertypecode"].value === 2 ?
                      <DateTimePicker
                       name={"denddate"} 
                       label={ props.intl.formatMessage({ id:"IDS_ENDDATE"})}                     
                       className='form-control'
                       placeholderText="Select date.."
                       selected={props.selectedRecord["senddate"] || ""}
                       // dateFormat={"dd/MM/yyyy"}
                       dateFormat={props.userInfo.ssitedate}
                       isMandatory={props.selectedRecord["nschedulertypecode"] && 
                                    props.selectedRecord["nschedulertypecode"].value === 2?true:false}
                       minDate={new Date()}
                       isClearable={false}
                       onChange={date => props.handleDateChange("denddate", date,"senddate")}
                       value={props.selectedRecord["denddate"]}
                    />
                    :""} 
                </Col>
            </Row> 
          </Col>
          <Col md={6}>   
              <Row>                   
                 <Col md={12}>
                     
                    
                 <DateTimePicker
                       name={"dstarttime"} 
                       label={ props.intl.formatMessage({ id:"IDS_STARTTIME"})}                     
                       className='form-control'
                       placeholderText="--:--"
                       selected={props.selectedRecord["sstarttime"] || ""}
                       //dateFormat={"Pp"}
                       timeInputLabel="Time:"
                       timeIntervals={5}
                       timeCaption="Time"
                       //dateFormat="h:mm aa"
                       dateFormat="H:mm"
                       showTimeSelect={true}
                       showTimeSelectOnly={true}
                       timeFormat={"HH:mm"}
                       showTimeInput={false}
                       onSelect={true}
                       isMandatory={true}
                       //dateFormat={props.userInfo.ssitedate}
                       isClearable={false}
                       onChange={time => props.handleDateChange("dstarttime", time,"sstarttime")}
                       value={props.selectedRecord["dstarttime"]}
                    />
                    {props.selectedRecord["nschedulertypecode"] && 
                      props.selectedRecord["nschedulertypecode"].value === 2 ?
                      
                    <DateTimePicker
                       name={"dendtime"} 
                       label={ props.intl.formatMessage({ id:"IDS_ENDTIME"})}                     
                       className='form-control'
                       placeholderText="--:--"
                       selected={props.selectedRecord["sendtime"] || ""}
                       //dateFormat={"Pp"}
                       timeInputLabel="Time:"
                       timeIntervals={5}
                       timeCaption="Time"
                       //dateFormat="h:mm aa"
                       dateFormat="H:mm"
                       showTimeSelect={true}
                       showTimeSelectOnly={true}
                       timeFormat={"HH:mm"}
                       showTimeInput={false}
                       onSelect={true}
                       isMandatory={props.selectedRecord["nschedulertypecode"] && 
                                    props.selectedRecord["nschedulertypecode"].value === 2?true:false}
                       //dateFormat={props.userInfo.ssitedate}
                       isClearable={false}
                       onChange={time => props.handleDateChange("dendtime", time,"sendtime")}
                       value={props.selectedRecord["dendtime"]}
                    />
                    :""}
                </Col>
              </Row> 
            </Col>
            <Col md={12}>   
          <Row>                   
             <Col md={12}>
             <FormTextarea
                                   name={"sremarks"}
                                   label={ props.intl.formatMessage({ id:"IDS_REMARKS"})}                      
                                   placeholder={ props.intl.formatMessage({ id:"IDS_REMARKS"})}
                                   value = { props.selectedRecord["sremarks"] ? props.selectedRecord["sremarks"]:""}  //Added by sonia on 2nd Sept 2024 for JIRA ID:ALPD-4786
                                  // value ={ props.selectedRecord["sremarks"] ? props.selectedRecord["sremarks"].trim()!=="null"?props.selectedRecord["sremarks"].trim():"":"" }  //Commented by sonia on 2nd Sept 2024 for JIRA ID:ALPD-4786
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
    
       </>
    )
}
export default injectIntl(AddScheduler);


