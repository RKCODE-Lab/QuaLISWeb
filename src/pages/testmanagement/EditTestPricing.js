import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import { ReadOnlyText } from '../../components/App.styles';

const EditTestPricing = (props) => {
       // console.log("props.selected:", props.selectedRecord)
        return (
            Object.keys(props.selectedRecord).length > 0 ? 
                props.selectedRecord.map(item=>
                <Row>
                    <Col md={6}>
                                <ReadOnlyText>{item.stestname}</ReadOnlyText>
                    </Col>
                    <Col md={6}>
                                <FormInput
                                    label={props.intl.formatMessage({ id: "IDS_COST" })}
                                    name={"ncost"}
                                    type="text"
                                    onChange={(event) => props.onInputOnChange(event, item.ntestpricedetailcode)}
                                    placeholder={props.intl.formatMessage({ id: "IDS_COST" })}
                                    value={item.ncost || 0}
                                    isMandatory={true}
                                    required={true}
                                    maxLength={9}
                                    onFocus={props.onFocus}
                            />
                            
                    </Col>
                </Row>
            ) :""
        )
}

export default injectIntl(EditTestPricing);