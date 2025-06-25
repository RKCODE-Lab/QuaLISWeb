import React from 'react'
import { Row, Col, Card  } from "react-bootstrap";
import { injectIntl } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';


const EditQuotationTestPricing = (props) => {
       // console.log("props.selected:", props.selectedRecord)
        return (
            Object.keys(props.selectedRecord).length > 0 ? 
                props.selectedRecord.map((item,index)=>
                <>
                
        {/* <Row> */}
          {/* <Card.Body className="form-static-wrap"> */}
            <Card className="at-tabs mb-3">
              <Row noGutters>
               <Col md={12}>
                <Card>
                  <Card.Body>

                <Row className="mb-4 card-header" Style="border-bottom: 0px;">
                    <Col md={5}>  

                      <FormInput
                                label={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                                name={"squotationleadtime"}
                                type="text" 
                                // onChange={(event) => props.onInputOnChange(event, item.nquotationtestcode)}
                                placeholder={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                                value={item.stestsynonym ? item.stestsynonym === "-" ? "" : item.stestsynonym : ""}
                                isMandatory={false}
                                isDisabled={true}
                                required={true}
                                // maxLength={"5"}
                        />

                    </Col>

                    <Col md={5}>  

                    <FormInput
                                label={props.intl.formatMessage({ id: "IDS_METHODNAME" })}
                                name={"smethodname"}
                                type="text" 
                                // onChange={(event) => props.onInputOnChange(event, item.nquotationtestcode)}
                                placeholder={props.intl.formatMessage({ id: "IDS_METHODNAME" })}
                                value={item.smethodname ? item.smethodname === "-" ? "" : item.smethodname : ""}
                                isMandatory={false}
                                isDisabled={true}
                                required={true}
                                // maxLength={"5"}
                        />

                    </Col>

                    <Col md={2}>  

                      <FormInput
                              label={props.intl.formatMessage({ id: "IDS_LEADTIME" })}
                              name={"squotationleadtime"}
                              type="text" 
                              onChange={(event) => props.onInputOnChange(event, item.nquotationtestcode)}
                              placeholder={props.intl.formatMessage({ id: "IDS_LEADTIME" })}
                              value={item.squotationleadtime ? item.squotationleadtime === "-" ? "" : item.squotationleadtime : ""}
                              isMandatory={false}
                              isDisabled={false}
                              required={true}
                              maxLength={"5"}
                      />

                    </Col>

                </Row>


                <Row>

                    <Col md={3}>  

                        <FormSelectSearch

                            formLabel={props.intl.formatMessage({ id: "IDS_DISCOUNTBAND" })}
                            isSearchable={true}
                            name={"ndiscountbandcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={false}
                            isClearable={true}
                            options={props.DiscountBand}
                            //      value={{label:item['sdiscountbandname'],value:item['ndiscountbandcode']} || -1}
                            //ALPD-4575
                            value={item.ndiscountbandcode && item.ndiscountbandcode.label !=="" ? item.ndiscountbandcode : ""} 
                            //      value={item.ndiscountbandcode || ""}
                            //      defaultValue={props.selectedRecord["ndiscountbandcode"]}
                            defaultValue={item }
                            onChange={(event) => props.onComboChange(event, "ndiscountbandcode", 5,item.nquotationtestcode)}
                            closeMenuOnSelect={true}
                            // onBlur={() => props.onnetAmountEvent(item.nquotationtestcode)}
                             
                         /> 

                    </Col>

                    <Col md={3}>  

                    <FormInput
                                label={props.intl.formatMessage({ id: "IDS_AMOUNT" })}
                                name={"namount"}
                                type="text" 
                                onChange={(event) => props.onInputOnChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                             // value={props.selectedRecord.namount ? props.selectedRecord.namount : 0}
                                value={item.namount ? item.namount : 0}
                                isMandatory={false}
                                isDisabled={true}
                                required={true}
                                maxLength={"100"}
                    />

                    </Col>

                    <Col md={2}>  

                    <FormNumericInput
                                        
                                label={props.intl.formatMessage({ id: "IDS_COST" })}
                                type="number"
                                value={item.ncost || 0}
                                placeholder={props.intl.formatMessage({ id: "IDS_COST" })}
                                strict={true}
                                min={0}
                                maxLength={10}
                                // onChange={(event) => props.onNumericInputChange(event, item.nquotationtestcode)}
                                onChange={(event) => props.onNumericInputChange(event, "ncost",item.nquotationtestcode)}
                                onBlur={() => props.onnetAmountEvent(item.nquotationtestcode)}
                                noStyle={true}
                                precision={2}
                                className="form-control"
                                errors="Please provide a valid number."
                    /> 

                    </Col>

                    <Col md={2}>  

                    <FormInput
                                name={"nnoofsamples"}
                                type="text"
                                label={props.intl.formatMessage({ id: "IDS_NUMBEROFSAMPLES" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_NUMBEROFSAMPLES" })}
                                isMandatory={false}
                                required={true}
                                className="form-control"
                                value={item.nnoofsamples || 0}
                                // onChange={(event) => props.onNumericInputChange(event, item.nquotationtestcode)}
                                onChange={(event) => props.onInputOnChange(event, item.nquotationtestcode)}
                                onBlur={() => props.onnetAmountEvent(item.nquotationtestcode)}
                                maxLength={9}
                                onFocus={props.onFocus}
                     />  

                    </Col>

                    <Col md={2}> 

                    <FormInput
                                label={props.intl.formatMessage({ id: "IDS_TOTALNETAMOUNT" })}
                                name={"ntotalamount"}
                                type="text"
                                onChange={(event) => props.onInputOnChange(event, item.nquotationtestcode)}
                                placeholder={props.intl.formatMessage({ id: "IDS_TOTALNETAMOUNT" })}
                                value={ item.ntotalamount>0 ? item.ntotalamount : 0 }
                            //     value={(item.ncost * item.nnoofsamples) || 0}
                                isMandatory={false}
                                required={true}
                                maxLength={10}
                                isDisabled={true}
                                precision={2}
                        /> 
                    
                    </Col>

                </Row>

                <Row>
                    
                    <Col md={6}> 
                    
                    <FormTextarea
                                label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                name={"stestplatform"}
                                type="text" 
                                onChange={(event) => props.onInputOnChange(event, item.nquotationtestcode)}
                                placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                value={item.stestplatform ? item.stestplatform === "-" ? "" : item.stestplatform : ""}
                                isMandatory={false}
                                isDisabled={false}
                                required={true}
                                maxLength={"500"}
                    />
                    </Col> 

                    <Col md={6}> 
                
                    <FormTextarea
                                name={"snotes"}
                                type="text"
                                label={props.intl.formatMessage({ id: "IDS_NOTES" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_NOTES" })}
                                isMandatory={false}
                                required={true}
                                className="form-control"
                                value={item.snotes ? item.snotes === "-" ? "" : item.snotes : ""}
                                onChange={(event) => props.onInputOnChange(event, item.nquotationtestcode)}
                                maxLength={500}
                    />
                    </Col> 

                </Row>           

                </Card.Body>
             </Card>
            </Col>
          </Row>
        </Card>

          {/* </Card.Body> */}
        {/* </Row> */}

                {/* { (Object.keys(props.selectedRecord).length > 1 && Object.keys(props.selectedRecord).length) !== item.length ? 

                    <Col md={12}>
                          <div Style="border-top: 1px solid #007bff;  margin-bottom: 1rem;"></div>
                   </Col> : ""

                } */}

                  {/* { Object.keys(props.selectedRecord).length > 1   ? 
       ((Object.keys(props.selectedRecord).length > 1) && ((index+1)=== (Object.keys(props.selectedRecord).length))) ? 
            "":
                    <Col md={12}>     
                          <div Style="border-top: 1px solid #007bff;  margin-bottom: 1rem;"></div>
                   </Col> : ""  } */}
                 </>
          
            ) :""
        )
}

export default injectIntl(EditQuotationTestPricing);