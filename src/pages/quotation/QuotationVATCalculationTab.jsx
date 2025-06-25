import React from 'react';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from "react-bootstrap";
import { injectIntl } from 'react-intl';
import { ReadOnlyText } from "../../components/App.styles";
import { ReactComponent as Quotationdiscount } from '../../assets/image/quotationdiscount.svg';


const QuotationVATCalculationTab = (props) => {
    return (
        <Row>
          <Card.Body className="form-static-wrap">
            <Card className="at-tabs border-0">
              <Row noGutters>
                <Col md={12}>
                  <Card>
                     <Card.Body>

                         <Row className='justify-content-end pr-2 m-0'>
                                <Nav.Link name="CalculatePricing" className="btn btn-circle outline-grey mr-2"
                                    hidden={props.userRoleControlRights.indexOf(props.grossQuotationeId) === -1}
                                    data-tip={props.intl.formatMessage({ id: "IDS_VATCALCULATION" })}
                                    onClick={() => props.GrossQuotation("create", props.userInfo, props.grossQuotationeId, props.selectedQuotation)}>
                                  <Quotationdiscount className="custom_icons" width="20" height="20" />
                                </Nav.Link>

                          </Row>  

                          <Row className='justify-content-end'>

                            <Col md="4">
                              <FormGroup>
                                <FormLabel>{props.intl.formatMessage({ id: "IDS_TOTALGROSSAMOUNT" })}</FormLabel>
                                <ReadOnlyText>{parseFloat((props.EstimateQuotation ? props.EstimateQuotation.ntotalgrossamount : 0).toFixed(2))}</ReadOnlyText>
                              </FormGroup>
                            </Col>

                          </Row>

                        <Row>

                          <Col md="4">
                              <FormGroup>
                                <FormLabel>{props.intl.formatMessage({ id: "IDS_DISCOUNTBAND" })}</FormLabel>
                                <ReadOnlyText>{props.EstimateQuotation ? props.EstimateQuotation.sdiscountbandname : '-'}</ReadOnlyText>
                              </FormGroup>
                            </Col>

                            <Col md="4">
                              <FormGroup>
                                <FormLabel>{props.intl.formatMessage({ id: "IDS_AMOUNT" })}</FormLabel>
                                <ReadOnlyText>{props.EstimateQuotation ? props.EstimateQuotation.ndiscountpercentage : 0}</ReadOnlyText>
                              </FormGroup>
                            </Col>

                            <Col md="4">
                              <FormGroup>
                                <FormLabel>{props.intl.formatMessage({ id: "IDS_DISCOUNTAMOUNT" })}</FormLabel>
                                <ReadOnlyText>{parseFloat((props.EstimateQuotation ? props.EstimateQuotation.ndiscountamount : 0).toFixed(2))} </ReadOnlyText>
                              </FormGroup>
                            </Col>

                         </Row>

                         <Row>

                            <Col md="4">
                                <FormGroup>
                                  <FormLabel>{props.intl.formatMessage({ id: "IDS_VATBAND" })}</FormLabel>
                                  <ReadOnlyText>{props.EstimateQuotation ? props.EstimateQuotation.svatbandname : '-'}</ReadOnlyText>
                                </FormGroup>
                            </Col>

                           
                            <Col md="4">
                              <FormGroup>
                                <FormLabel>{props.intl.formatMessage({ id: "IDS_AMOUNT" })}</FormLabel>
                                <ReadOnlyText>{props.EstimateQuotation ? props.EstimateQuotation.nvatpercentage : 0}</ReadOnlyText>
                              </FormGroup>
                            </Col>

                            <Col md="4">
                              <FormGroup>
                                <FormLabel>{props.intl.formatMessage({ id: "IDS_VATAMOUNT" })}</FormLabel>
                                <ReadOnlyText>{parseFloat((props.EstimateQuotation ? props.EstimateQuotation.nvatamount : 0).toFixed(2))} </ReadOnlyText>
                              </FormGroup>
                            </Col>

                          </Row>

                          <Row className='justify-content-end'>

                            <Col md="4">
                              <FormGroup>
                                <FormLabel>{props.intl.formatMessage({ id: "IDS_TOTALNETAMOUNT" })}</FormLabel>
                                  <ReadOnlyText>{parseFloat((props.EstimateQuotation ? props.EstimateQuotation.ntotalnetamount : 0).toFixed(2))}</ReadOnlyText>
                              </FormGroup>
                            </Col>

                          </Row>

                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
            </Card>
          </Card.Body>
        </Row>

    );

}




export default injectIntl(QuotationVATCalculationTab);