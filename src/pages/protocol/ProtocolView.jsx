import React from 'react';
import { Card, Row, Col, FormGroup, FormLabel } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {faCloudDownloadAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReadOnlyText } from '../../components/App.styles';
import { designProperties } from '../../components/Enumeration';
import {  FontIconWrap } from '../../../src/components/data-grid/data-grid.styles';
import {dynamicFileDownload} from '../../../src/actions/ProtocolAction';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
class ProtocolView extends React.Component {
    render() {
        const jsondata = this.props.data
        return (
            <Card className="border-0">
                <Card.Body>
                    <Row>
                        {this.props.singleItem && this.props.singleItem.map((field, index) =>
                            <Col md={this.props.size ? this.props.size : 6} key={index}>
                                <FormGroup>
                                    <FormLabel>
                                        <FormattedMessage
                                            id={field[designProperties.LABEL][this.props.userInfo.slanguagetypecode] || "-"}
                                            message={field[designProperties.LABEL][this.props.userInfo.slanguagetypecode] || "-"} />
                                    </FormLabel>
                                   
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

export default connect(mapStateToProps,{dynamicFileDownload})(injectIntl(ProtocolView));