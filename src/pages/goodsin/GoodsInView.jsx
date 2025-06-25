import { faCheck, faCopy, faUserTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Col, FormGroup, FormLabel, Nav, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { ReadOnlyText } from '../../components/App.styles';

const GoodsInView = (props) => {
    return (
            <>
             {props.selectedRecordView && Object.values(props.selectedRecordView).length ?
                <Row>
                    {props.viewInfoFields ?

                        props.viewInfoFields.map((item, index) => {
                            return (
                                <Col md={6} key={`specInfo_${index}`}>
                                    <FormGroup>
                                        <FormLabel>{props.intl.formatMessage({ id: item.label })}</FormLabel>
                                        <ReadOnlyText className='text-break'>{props.selectedRecordView[item.fieldName]}</ReadOnlyText>
                                    </FormGroup>
                                </Col>
                            )
                        }) :""
                    }
                 </Row> : ""
            }
            </>
        );
};
export default injectIntl(GoodsInView);

                   
               