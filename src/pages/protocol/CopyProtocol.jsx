import React from 'react';
import {FormattedMessage,injectIntl } from 'react-intl';
import {Row, Col,Card, FormGroup, FormLabel} from 'react-bootstrap';
import { CardBody, CardHeader } from '@progress/kendo-react-layout';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const CopyProtocol = (props) =>{    
    
       return (
            <>    
                <Row>                                
                    <Col md={12}>
                        <FormGroup>
                            <Card>
                                <CardHeader>
                                    <span style={{ display: "inline-block", marginTop: "1%" }} >
                                        <h4>{props.intl.formatMessage({ id: "IDS_PROTOCOLINFO" })}</h4>
                                    </span>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md={4}>
                                            <FormGroup>
                                                <FormLabel><FormattedMessage id="IDS_SAMPLECATEGORY" message="Sample Category" /></FormLabel>
                                                <span className="readonly-text font-weight-normal"> {props.productCategoryName}</span>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <FormLabel><FormattedMessage id="IDS_SAMPLETYPE" message="Sample Type" /></FormLabel>
                                                <span className="readonly-text font-weight-normal"> {props.productName}</span>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <FormLabel><FormattedMessage id="IDS_PROTOCOLNAME" message="Protocol Name" /></FormLabel>
                                                <span className="readonly-text font-weight-normal"> {props.protocolName}</span>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card> 
                        </FormGroup>         
                    </Col>                   
                </Row>
                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            name={"nproductcatcode"}
                            formLabel={ props.intl.formatMessage({ id:"IDS_SAMPLECATEGORY"})}                                
                            placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                              
                            options={ props.productCategory || []}
                            value = { props.selectedRecord["nproductcatcode"] || ""}
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={true}                               
                            isDisabled={false}
                            closeMenuOnSelect={true}
                            defaultValue={props.selectedRecord["nproductcatcode"]}
                            onChange = {(event)=> props.onComboChange(event, 'nproductcatcode')}  
                        />

                        <FormSelectSearch
                            name={"nproductcode"}
                            formLabel={ props.intl.formatMessage({ id:"IDS_SAMPLETYPE"})}                                
                            placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                              
                            options={props.selectedRecord["nproductcatcode"]!==undefined? props.product : []}
                            value = { props.selectedRecord["nproductcode"] || ""}
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={true}                               
                            isDisabled={false}
                            closeMenuOnSelect={true}
                            defaultValue={props.selectedRecord["nproductcode"]}
                            onChange = {(event)=> props.onComboChange(event, 'nproductcode')}  
                        />

                        <FormInput
                            name={"sprotocolname"}
                            type="text"
                            label={ props.intl.formatMessage({ id:"IDS_PROTOCOLNAME"})}                  
                            placeholder={ props.intl.formatMessage({ id:"IDS_PROTOCOLNAME"})}
                            value ={ props.selectedRecord["sprotocolname"] || ""}
                            isMandatory={true}
                            required={true}
                            maxLength={100}
                            onChange={(event)=> props.onInputOnChange(event)}
                        />

                    </Col>
                </Row> 
            </>  
       )
   }
   export default injectIntl(CopyProtocol);
