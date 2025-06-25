import React from 'react'
import { Card, Row, Col, FormGroup, FormLabel } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import { ReadOnlyText } from '../../components/App.styles';
import { designProperties } from '../../components/Enumeration';
import {faCloudDownloadAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  FontIconWrap } from '../../../src/components/data-grid/data-grid.styles';
import {dynamicFileDownload} from '../../../src/actions/ServiceAction';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
class SampleInfoView extends React.Component {
    render() {
        const jsondata = this.props.data
        return (
            <Card className="border-0">
                <Card.Body>
                    <Row>
                        {this.props.SingleItem && this.props.SingleItem.map((field, index) =>
                            // ALPD-950
                            <Col md={this.props.size ? this.props.size : 6} key={index}>
                                <FormGroup>
                                    <FormLabel>
                                        <FormattedMessage
                                            id={field[designProperties.LABEL][this.props.userInfo.slanguagetypecode] || "-"}
                                            message={field[designProperties.LABEL][this.props.userInfo.slanguagetypecode] || "-"} />
                                    </FormLabel>
                                    {/* <ReadOnlyText>{jsondata[field[designProperties.VALUE]]||
                                        jsondata.jsondata[field[designProperties.VALUE]]&& 
                                        jsondata.jsondata[field[designProperties.VALUE]].label||
                                    jsondata.jsondata[field[designProperties.VALUE]]||"-"}</ReadOnlyText> */}
                                    <ReadOnlyText>{jsondata[field[designProperties.VALUE]] || "-"}
                                    {field && field[3] === 'files' ?
                                        <FontIconWrap icon={faCloudDownloadAlt} className="ml-2 className action-icons-wrap" size="lg"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DOWNLOAD" })}
                                            data-place="left"
                                            onClick={() => this.props.dynamicFileDownload({field,...jsondata ,viewName:'InfoView',userInfo:this.props.userInfo})}>
                                            <FontAwesomeIcon icon={faCloudDownloadAlt} />
                                        </FontIconWrap> : ""
                                    }</ReadOnlyText>
                                   
                                </FormGroup>
                            </Col>
                        )}
                    </Row>
                </Card.Body>
            </Card>

        )
    }
}

export default connect(mapStateToProps,{dynamicFileDownload})(injectIntl(SampleInfoView));