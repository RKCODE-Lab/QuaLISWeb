import React from 'react';
import { injectIntl } from 'react-intl';
import {Row, Col} from 'react-bootstrap';
import {SampleType} from '../../components/Enumeration';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddBatchCreation = (props) =>{    
       return (<>
           <Row>                                
                <Col md={12}>
                   <Row>
                   <Col md={12}>
                        <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_SECTION" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="nsectioncode"
                                optionId="nsectioncode"
                                optionValue="ssectionname"
                                // className='form-control'
                                options={props.Section}
                                value={props.selectedSection ? props.selectedSection : ""}
                                isMandatory={true}
                                isMulti={false}
                                isSearchable={true}
                                //isDisabled={true}
                                isDisabled={props.operation === "update" ? true : false}
                                alphabeticalSort={false}
                                isClearable={false}
                                // required={true}
                                onChange={(event) => props.onComboChange(event, "ssectionname")}
                            />
                        </Col>
                        
                   <Col md={12}>
                        <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_TEST" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="ntestcode"
                                optionId="ntestcode"
                                optionValue="stestname"
                                // className='form-control'
                                options={props.Test}
                                value={props.TestValue ? props.TestValue : ""}
                                isMandatory={true}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={props.operation === "update" ? true : false}
                                alphabeticalSort={false}
                                isClearable={false}
                                required={true}
                                onChange={(event) => props.onComboChange(event, "stestname")}
                            />
                        </Col>

                    { props.sampleType === SampleType.PROJECTSAMPLETYPE &&
                         <Col md={12}>
                          <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_PROJECTCODE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="nprojectmastercode"
                                optionId="nprojectmastercode"
                                optionValue="sprojectcode"
                                // className='form-control'
                                options={props.ProjectCode}
                                value={props.selectedProjectcode ? props.selectedProjectcode : ""}
                                isMandatory={true}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={props.operation === "update" ? true : false}
                                alphabeticalSort={false}
                                isClearable={false}
                                required={true}
                                onChange={(event) => props.onComboChange(event, "sprojectcode")}
                            />
                     </Col>
                }

                    <Col md={12}>
                        <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_PRODUCT" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="nproductcode"
                                optionId="nproductcode"
                                optionValue="sproductname"
                                className='form-control'
                                options={props.product}
                                value={props.selectedProduct ? props.selectedProduct : ""}
                                isMandatory={true}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={false}
                                alphabeticalSort={false}
                                isClearable={false}
                                required={true}
                                onChange={(event) => props.onComboChange(event, "sproductname")}
                            />
                     </Col>

                        <Col md={12}>
                        <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="ninstrumentcatcode"
                                optionId="ninstrumentcatcode"
                                optionValue="sinstrumentcatname"
                                className='form-control'
                                options={props.InstrumentCategory}
                                value={props.InstrumentCategory ? props.selectedInstrumentCategory : ""}
                                // isMandatory={props.selectedInstrumentCategory == undefined ? false  : props.selectedInstrumentCategory == "" ? false : true}
                                isMulti={false}
                                isSearchable={true}
                                required={true}
                                isDisabled={false}
                                alphabeticalSort={false}
                                isClearable={true}
                                onChange={(event) => props.onComboChange(event, "sinstrumentcatname")}
                            />
                        </Col> 

                        <Col md={12}>
                           <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENT" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="ninstrumentnamecode"
                                optionId="ninstrumentnamecode"
                                optionValue="sinstrumentname"
                                className='form-control'
                                options={props.Instrument}
                                value={props.Instrument ? props.selectedInstrument : ""}
                                isMandatory={props.selectedInstrumentCategory === undefined ? false  : props.selectedInstrumentCategory === "" ? false : props.selectedInstrumentCategory.value <= 0 ? false : true}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={false}
                                alphabeticalSort={false}
                                isClearable={false}
                                required={true}
                                onChange={(event) => props.onComboChange(event, "sinstrumentname")}
                            />
                        </Col>   

                    <Col md={12}>
                        <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTID" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="ninstrumentcode"
                                optionId="ninstrumentcode"
                                optionValue="sinstrumentid"
                                className='form-control'
                                options={props.instrumentID}
                                value={props.selectedInstrumentId ? props.selectedInstrumentId : ""}
                                isMandatory={props.selectedInstrumentCategory === undefined ? false  : props.selectedInstrumentCategory === "" ? false : props.selectedInstrumentCategory.value <= 0 ? false : true}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={false}
                                alphabeticalSort={false}
                                isClearable={false}
                                required={true}
                                //closeMenuOnSelect={true}
                                onChange={(event) => props.onComboChange(event, "sinstrumentid")}
                            />
                     </Col>
                        
                    
                   </Row>
               </Col>      
        </Row>   
       
      </>
       )
   }
   export default injectIntl(AddBatchCreation);
