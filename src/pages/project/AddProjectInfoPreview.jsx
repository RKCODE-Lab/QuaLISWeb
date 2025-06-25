import React from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import { ReadOnlyText } from "../../components/App.styles";
import { FormGroup, FormLabel } from "react-bootstrap";
import { injectIntl } from 'react-intl';
import { rearrangeDateFormatDateOnly } from "../../components/CommonScript";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';


const AddProjectInfoPreview = (props) => {
  return (
    <>
      <Row>
        <Col md="6 pl-0">
          <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_PROJECTTITLE" })}</FormLabel>
              <ReadOnlyText>{props.selectedProjectMaster.sprojecttitle}</ReadOnlyText>
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_PROJECTCODE" })}</FormLabel>
              <ReadOnlyText>{props.selectedProjectMaster.sprojectcode}</ReadOnlyText>
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_PROJECTNAME" })}</FormLabel>
              <ReadOnlyText>{props.selectedProjectMaster.sprojectname}</ReadOnlyText>
            </FormGroup>
          </Col>


          <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_ROLE" })}</FormLabel>
              <ReadOnlyText>{props.selectedProjectMaster.suserrolename}</ReadOnlyText>
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_INCHARGE" })}</FormLabel>
              <ReadOnlyText>{props.selectedProjectMaster.susername}</ReadOnlyText>
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
              <FormLabel>{props.intl.formatMessage({ id: "IDS_RFWDATE" })}</FormLabel>
              <ReadOnlyText>{rearrangeDateFormatDateOnly(props.userInfo, props.selectedProjectMaster.srfwdate)} </ReadOnlyText>
            </FormGroup>
          </Col>

          <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_STARTDATE" })}</FormLabel>
              <ReadOnlyText>{rearrangeDateFormatDateOnly(props.userInfo, props.selectedProjectMaster.sprojectstartdate)} </ReadOnlyText>
            </FormGroup>
          </Col>

          <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_EXPECTEDPROJECTCOMPLETIONDATE" })}</FormLabel>
              <ReadOnlyText>{rearrangeDateFormatDateOnly(props.userInfo, props.selectedProjectMaster.sexpectcompletiondate)} </ReadOnlyText>
            </FormGroup>
          </Col>

        </Col>


        <Col md="6 pl-0">
          <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_CLIENTCATEGORY" })}</FormLabel>
              <ReadOnlyText>{props.selectedProjectMaster.sclientcatname}</ReadOnlyText>
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_CLIENT" })}</FormLabel>
              <ReadOnlyText>{props.selectedProjectMaster.sclientname}</ReadOnlyText>
            </FormGroup>
          </Col> <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_QUOTATIONNO" })}</FormLabel>
              <ReadOnlyText>{props.selectedProjectMaster.squotationno === null ||
                props.selectedProjectMaster.nquotationcode === -1 ? "-" : props.selectedProjectMaster.squotationno}</ReadOnlyText>
            </FormGroup>
          </Col> <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_RFWID" })}</FormLabel>
              <ReadOnlyText>{props.selectedProjectMaster.srfwid === null ? "-" : props.selectedProjectMaster.srfwid}</ReadOnlyText>
            </FormGroup>
          </Col> <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_PROJECTDURATION" })}</FormLabel>
              <ReadOnlyText>{props.selectedProjectMaster.sprojectduration}</ReadOnlyText>
            </FormGroup>
          </Col> <Col md="12">
            <FormGroup>
              <FormLabel>{props.intl.formatMessage({ id: "IDS_PROJECTDESCRIPTION" })}</FormLabel>
              <ReadOnlyText>{props.selectedProjectMaster.sprojectdescription}</ReadOnlyText>
            </FormGroup>
          </Col>
          {/* { props.selectedProjectMaster.sapprovedate!=null?
                <Col md="12">
               <FormGroup>
                 <FormLabel>{props.intl.formatMessage({ id: "IDS_PROJECTAPPROVEDDATE" })}</FormLabel>
                 <ReadOnlyText>{props.selectedProjectMaster.sapprovedate!=null?   rearrangeDateFormatDateOnly(props.userInfo,props.selectedProjectMaster.sapprovedate) :"-"} </ReadOnlyText>
               </FormGroup>
             </Col>
             :""

               } */}

        </Col>




        {((props.selectedProjectMaster.sfilename !== null) && (props.selectedProjectMaster.sfilename !== "-")) ?

          <Row>
            <Col md={12}>
              <div className="horizontal-line"></div>
            </Col>

            <Col md="6 pl-0">


              <Col md="6">
                <FormGroup>
                  <FormLabel>{props.intl.formatMessage({ id: "IDS_CLOSUREFILENAME" })}</FormLabel>
                  <ReadOnlyText>{props.selectedProjectMaster.sfilename === null ? "-" : props.selectedProjectMaster.sfilename}</ReadOnlyText>
                </FormGroup>
              </Col>
            </Col>
            <Col md="6 pl-0">
              {props.selectedProjectMaster.sfilename != null ?
                <Col md="6">
                  <Nav.Link name="ClosureProjectMasterFile" className="btn btn-circle outline-grey mr-2"
                    hidden={(props.userRoleControlRights.indexOf(props.viewClosureFileId) === -1) ? true : props.selectedProjectMaster.sfilename === '-' ? true : false}
                    data-tip={props.intl.formatMessage({ id: "IDS_DOWNLOAD" })}
                    onClick={() => props.viewProjectMasterClosureFile(props.selectedProjectMaster, props.userInfo)}>
                    <FontAwesomeIcon icon={faCloudDownloadAlt} />
                  </Nav.Link>
                </Col>
                : ""}

            </Col>
          </Row>
          : ""}
      </Row>

      {/* {((props.selectedProjectMaster.sprojectcompletiondate!="-" && props.selectedProjectMaster.sprojectcompletiondate!=null) || (props.selectedProjectMaster.scompletionremarks!=null && props.selectedProjectMaster.scompletionremarks!="-"))? 
               
               <Row>
               <Col md={12}>
                                       <div className="horizontal-line"></div>
                                     </Col>
               <Col md="6 pl-0"> 
                                   <Col md="6">
                                          <FormGroup>
                                            <FormLabel>{props.intl.formatMessage({ id: "IDS_PROJECTCOMPLETEDDATE" })}</FormLabel>
                                        <ReadOnlyText>{rearrangeDateFormatDateOnly(props.userInfo,props.selectedProjectMaster.sprojectcompletiondate)} </ReadOnlyText>
                                          </FormGroup>
                                        </Col>
                                        </Col>
                                        <Col md="6 pl-0"> 
                                      <Col md="6">
                                        <FormGroup>
                                            <FormLabel>{props.intl.formatMessage({ id: "IDS_REMARKS" })}</FormLabel>
                                            <ReadOnlyText>{props.selectedProjectMaster.scompletionremarks===null?"-":props.selectedProjectMaster.scompletionremarks}</ReadOnlyText>
                                         </FormGroup>
                                        </Col>
                                        </Col>
                                      </Row> 
               
               :""
                                   } */}




      {/* {((props.selectedProjectMaster.sprojectretiredate!="-" && props.selectedProjectMaster.sprojectretiredate!=null)|| (props.selectedProjectMaster.sretiredremarks!="-" && props.selectedProjectMaster.sretiredremarks!=null))? 
                      
                      <Row>
                    <Col md={12}>
                        <div className="horizontal-line"></div>
                      </Col>
                      
   <Col md="6 pl-0"> 
                    <Col md="6">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_RETIREDATE" })}</FormLabel>
                           <ReadOnlyText>{rearrangeDateFormatDateOnly(props.userInfo,props.selectedProjectMaster.sprojectretiredate)} </ReadOnlyText>
                           </FormGroup>
                         </Col>
                         </Col>
                         <Col md="6 pl-0"> 
                       <Col md="6">
                          <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_REMARKS" })}</FormLabel>
                             <ReadOnlyText>{props.selectedProjectMaster.sretiredremarks===null?"-":props.selectedProjectMaster.sretiredremarks}</ReadOnlyText>
                          </FormGroup>
                         </Col>
                         </Col>
                         <Col md={12}>
                          <div className="horizontal-line"></div>
                        </Col>
                        </Row>
                         
                        :""
                      } */}





    </>
    /* {<Col md="6">
                  <FormGroup>
                    <FormLabel>{props.intl.formatMessage({ id: "IDS_ROLE" })}</FormLabel>
                    <ReadOnlyText>{props.selectedQuotation.suserrolename}</ReadOnlyText>
                  </FormGroup>
                </Col> } */

    /*{ <Col md="12">
                  <FormGroup>
                    <FormLabel>{props.intl.formatMessage({ id: "IDS_INCHARGE" })}</FormLabel>
                    <ReadOnlyText>{props.selectedQuotation.susername}</ReadOnlyText>
                  </FormGroup>
                </Col>  }*/





    /*  {<Col md="12">
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
                 </Col> }*/

    /*{ <Col md="6">
                  <FormGroup>
                    <FormLabel>{props.intl.formatMessage({ id: "IDS_ROLE" })}</FormLabel>
                    <ReadOnlyText>{props.selectedQuotation.suserrolename}</ReadOnlyText>
                  </FormGroup>
                </Col>}  */










  );

}




export default injectIntl(AddProjectInfoPreview);