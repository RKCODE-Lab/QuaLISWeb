import React from 'react'
import {Row, Col, Media, Form, ListGroup} from 'react-bootstrap';   
import { ClientList, MediaHeader, MediaLabel, MediaSubHeader } from '../../components/App.styles';
const SampleAccordion =(props)=>{

    return(
        <Row>
            <Col md={12}>
                <ClientList className="product-list">                    
                    <ListGroup as="ul">
                        {props.subSampleList.map((ss, index) =>
                        <ListGroup.Item  as="li" className={`list-bgcolor ${props.selectedSubSample ? props.selectedSubSample['samplecode'] === ss['samplecode'] ? "active" : "" : ""}`}>
                            <Media>
                                <Form.Check custom type="checkbox" id="customControl" className="mr-3" >
                                    <Form.Check.Input type="checkbox" id={`tm_customCheck_${index}`}
                                        checked={props.selectedSubSample&& props.selectedSubSample['samplecode'] === ss['samplecode'] ? true : false}
                                        readOnly
                                    />
                                    <Form.Check.Label htmlFor={`tm_customCheck_${index}`}></Form.Check.Label>
                                </Form.Check>
                                <Media.Body>
                                    <MediaHeader className="mt-0 text-wrap">
                                        {ss['samplearno']}
                                    </MediaHeader>
                                    <MediaSubHeader>
                                        <MediaLabel>{ss['arno']}</MediaLabel>
                                    </MediaSubHeader>
                                </Media.Body>
                            </Media>
                        </ListGroup.Item>
                        )}
                    </ListGroup>
                </ClientList>
            </Col>
        </Row>)
}
export default SampleAccordion;