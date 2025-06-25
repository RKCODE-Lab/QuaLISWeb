import React from 'react';
import {injectIntl, FormattedMessage } from 'react-intl';
import {Row, Col, Card, FormGroup, FormLabel} from 'react-bootstrap';

import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddChainCustody = (props) =>{    
     
       return (
               <><Row>    
                                             
                   <Col md={12}><FormGroup>
                         <Card>
                              <Card.Header><FormattedMessage id="IDS_GOODSINDETAIL" message="Goods In Details"/></Card.Header>
                              <Card.Body>                                
                                   <Row>  
                                        <Col md={4}>
                                             <FormGroup>
                                                  <FormLabel><FormattedMessage id="IDS_RMSNO" message="GoodsIn RMS"/></FormLabel>
                                                  <span className="readonly-text font-weight-normal"> {props.selectedGoodsIn["nrmsno"]}</span>
                                             </FormGroup>
                                        </Col>   
                                        <Col md={4}>
                                             <FormGroup>
                                                  <FormLabel><FormattedMessage id="IDS_MANUFACTURER" message="Manufacturer"/></FormLabel>
                                                  <span className="readonly-text font-weight-normal">  {props.selectedGoodsIn["smanufname"]}</span>
                                             </FormGroup>
                                        </Col>   
                                        <Col md={4}>
                                             <FormGroup>
                                                  <FormLabel><FormattedMessage id="IDS_RECIPIENT" message="Recipient Name"/></FormLabel>
                                                  <span className="readonly-text font-weight-normal"> {props.selectedGoodsIn["suserfullname"]}</span>
                                             </FormGroup>
                                        </Col>   
                                        <Col md={4}>
                                             <FormGroup>
                                                  <FormLabel> <FormattedMessage id="IDS_DEPARTMENT" message="Recipient Division"/></FormLabel>
                                                  <span className="readonly-text font-weight-normal">   {props.selectedGoodsIn["sdeptname"]}</span>
                                             </FormGroup>
                                        </Col>  
                                        <Col md={4}>
                                             <FormGroup>
                                                  <FormLabel>  <FormattedMessage id="IDS_RECEIVEDOWNER" message="Received Owner"/></FormLabel>
                                                  <span className="readonly-text font-weight-normal">  {props.userInfo.susername}</span>
                                             </FormGroup>
                                        </Col> 
                                        {/* <Col md={4}>
                                             <FormGroup>
                                                  <FormLabel> <FormattedMessage id="IDS_DEPARTMENT" message="Department"/></FormLabel>
                                                  <span className="readonly-text font-weight-normal">  {props.userInfo.sdeptname}</span>
                                             </FormGroup>
                                        </Col>       */}
                                   </Row>
                              </Card.Body>       
                         </Card> </FormGroup>                       
                    </Col>                            
               </Row>
               <Row>                   
                   <Col md={12}>                    
                       <FormNumericInput
                                name={"npackagersqty"}
                                type="number"
                                label={ props.intl.formatMessage({ id:"IDS_NPACKAGERSQTY"})}                          
                              //   placeholder={ props.intl.formatMessage({ id:"IDS_NPACKAGERSQTY"})}
                                value ={ props.selectedRecord["npackagersqty"]}
                                strict={true}
                                maxLength={9}
                                onChange={(event) => props.onNumericInputOnChange(event, "npackagersqty")}
                                precision={0}
                                min={0}
                                noStyle={true}
                                className="form-control"
                                isMandatory={true}
                                required={true}
                                errors="Please provide a valid number."
                            />
                    {/* </Col>                     
                    <Col md={12}>                      */}
                       <DateTimePicker
                                        name={"dreceiveddate"} 
                                        label={ props.intl.formatMessage({ id:"IDS_RECEIVEDDATEWOTIME"})}                     
                                        className='form-control'
                                        placeholderText="Select date.."
                                        selected={props.selectedRecord["dreceiveddate"]}
                                        dateFormat={props.userInfo.ssitedate}
                                        timeInputLabel=  {props.intl.formatMessage({ id:"IDS_TIME"})}
                                        showTimeInput={false}
                                        isClearable={false}
                                        isMandatory={true}                       
                                        required={true}
                                        maxDate={props.currentTime}
                                        maxTime={props.currentTime}
                                        onChange={date => props.handleDateChange("dreceiveddate", date)}
                                        value={props.selectedRecord["dreceiveddate"]}
                                                                       
                            />
                    {/* </Col>    
                    <Col md={12}> */}
                              <FormSelectSearch
                                   name={"ntzreceiveddate"}
                                   formLabel={ props.intl.formatMessage({ id:"IDS_TIMEZONE"})}                                
                                   placeholder="Please Select..."                                
                                   options={ props.timeZoneList}
                                   //optionId="ntimezonecode"
                                   //optionValue="stimezoneid"
                                   value = { props.selectedRecord["ntzreceiveddate"] }
                                   defaultValue={props.selectedRecord["ntzreceiveddate"]}
                                   isMandatory={true}
                                   isMulti={false}
                                   isSearchable={true}
                                   isClearable={false}                               
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   //alphabeticalSort={true}
                                   onChange = {(event)=> props.onComboChange(event, 'ntzreceiveddate')}                               
                              />
                         {/* </Col>                
                 
                    <Col md={12}> */}
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
          </>
       )
   }
   export default injectIntl(AddChainCustody);
