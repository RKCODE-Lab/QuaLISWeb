import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { ReadOnlyText } from "../../components/App.styles";
import { FormGroup, FormLabel } from "react-bootstrap";
import { injectIntl } from 'react-intl';
import {  rearrangeDateFormatDateOnly } from "../../components/CommonScript";
//import { intl } from "../../components/App";

const AddQuotationPreview = (props) => {
    return (
        <Row>
          <Col md="6 pl-0">
                    <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_CLIENTCATEGORY" })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.sclientcatname}</ReadOnlyText>
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_CLIENT" })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.sclientname}</ReadOnlyText>
                          </FormGroup>
                        </Col>

                        {/* <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_CLIENTADDRESS" })}</FormLabel>
                            <ReadOnlyText>{props.selectedQuotation.sclientsiteaddress}</ReadOnlyText>
                          </FormGroup>
                        </Col> */}
                        {/* <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_INVOICEADDRESS" })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.sinvoiceaddress}</ReadOnlyText>
                          </FormGroup>
                        </Col> */}

                      <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_CONTACTPERSON" })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.scontactname}</ReadOnlyText>
                          </FormGroup>
                        </Col>
                        
                         <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_CONTACTNUMBER" })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.sphoneno}</ReadOnlyText>
                          </FormGroup>
                        </Col>

                        <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_EMAILID" })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.semail}</ReadOnlyText>
                          </FormGroup>
                        </Col>

                        {/* <Col md="6">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_ROLE" })}</FormLabel>
                            <ReadOnlyText>{props.selectedQuotation.suserrolename}</ReadOnlyText>
                          </FormGroup>
                        </Col>  */}

                        {/* <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_INCHARGE" })}</FormLabel>
                            <ReadOnlyText>{props.selectedQuotation.susername}</ReadOnlyText>
                          </FormGroup>
                        </Col>  */}

          </Col>
          <Col md="6">

                       <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_OEM" })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.soemname}</ReadOnlyText>
                          </FormGroup>
                        </Col>

                        <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: (props.genericlabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode])  })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.sproductcatname}</ReadOnlyText>
                          </FormGroup>
                        </Col>

                        <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: (props.genericlabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]) })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.sproductname}</ReadOnlyText>
                          </FormGroup>
                        </Col>

                        
                     {/* <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}</FormLabel>
                            <ReadOnlyText>{props.selectedQuotation.sprojecttypename}</ReadOnlyText>
                          </FormGroup>
                        </Col>

                        <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_PROJECTTITLE" })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.sprojecttitle} </ReadOnlyText>
                          </FormGroup>
                        </Col>

                        <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_PROJECTCODE" })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.sprojectcode} </ReadOnlyText>
                          </FormGroup>
                        </Col>

                        <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_RFWDATE" })}</FormLabel>
                          
                            <ReadOnlyText>{rearrangeDateFormatDateOnly(props.userInfo,props.selectedQuotation.srfwdate)} </ReadOnlyText>
                          </FormGroup>
                        </Col> */}

                        {/* <Col md="6">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_ROLE" })}</FormLabel>
                            <ReadOnlyText>{props.selectedQuotation.suserrolename}</ReadOnlyText>
                          </FormGroup>
                        </Col>  */}


                        <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_QUOTATIONDATE" })}</FormLabel>
                            {/* <ReadOnlyText>{props.selectedQuotation.squotationdate}</ReadOnlyText> */}
                            <ReadOnlyText>{rearrangeDateFormatDateOnly(props.userInfo,props.selectedQuotation.squotationdate)} </ReadOnlyText>
                          </FormGroup>
                        </Col>

                      
          </Col>
           
                       

                        <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.sdescription}</ReadOnlyText>
                          </FormGroup>
                        </Col>

                        <Col md="12">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_REMARKS" })}</FormLabel>
                            <ReadOnlyText className='text-break'>{props.selectedQuotation.sdeviationremarks}</ReadOnlyText>
                          </FormGroup>
                        </Col>

        </Row>

    );

}




export default injectIntl(AddQuotationPreview);