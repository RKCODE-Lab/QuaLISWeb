import React from 'react'
import { Card, Row, Col, FormGroup, FormLabel } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import { ReadOnlyText } from '../../components/App.styles';
import { designProperties } from '../../components/Enumeration';
class MyJobsSampleInfoView extends React.Component {
    render() {
        const jsondata=this.props.data
        return (
            <Card className="border-0">
                <Card.Body>
                    <Card.Text>
                        <Row>
                            {this.props.SingleItem && this.props.SingleItem.map((field,index) =>
                                <Col md={4} key={index}>
                                    <FormGroup>
                                        <FormLabel>
                                            <FormattedMessage 
                                            id={field[designProperties.LABEL][this.props.userInfo.slanguagetypecode]} 
                                            message={field[designProperties.LABEL][this.props.userInfo.slanguagetypecode]} />
                                            </FormLabel>
                                        {/* <ReadOnlyText>{jsondata[field[designProperties.VALUE]]||
                                         jsondata.jsondata[field[designProperties.VALUE]]&& 
                                         jsondata.jsondata[field[designProperties.VALUE]].label||
                                        jsondata.jsondata[field[designProperties.VALUE]]||"-"}</ReadOnlyText> */}
                                          <ReadOnlyText>{jsondata[field[designProperties.VALUE]]||"-"}</ReadOnlyText>
                                    </FormGroup>
                                </Col>
                            )}
                        </Row>
                    </Card.Text>
                </Card.Body>
            </Card>

        )
    }
}

export default injectIntl(MyJobsSampleInfoView);