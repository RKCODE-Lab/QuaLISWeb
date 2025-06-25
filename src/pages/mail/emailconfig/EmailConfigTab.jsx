import React, { Component } from 'react';
import { Row, Col, Card, Nav } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../../components/data-grid/data-grid.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class EmailConfigTab extends Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: 10,
        };
        this.state = {
            dataState: dataState
        }
    }
    extractedColumnList = [
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERNAME", "dataField": "susername", "width": "150px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_EMAILID", "dataField": "semail", "width": "130px" },

    ]
    render() {
        return (
            <>
                <Row noGutters={true}>
                    <Col md='12'>
                        <Card>
                            {/* <Tab.Container defaultActiveKey=""> */}
                            <Card.Header className="add-txt-btn">
                                {/* <Nav className="nav nav-tabs card-header-tabs flex-grow-1" as="ul">
                                        <Nav.Item as='li'>
                                            <Nav.Link eventKey=""> */}
                                <strong><FormattedMessage id="IDS_USERS" defaultMessage="Users" /></strong>
                                {/* </Nav.Link>
                                        </Nav.Item>
                                    </Nav> */}
                            </Card.Header>
                           
                                {/* <Tab.Content>
                                    <Tab.Pane className="fade p-0" eventKey="ProductmahhistoryKey"> */}
                                    <div className="actions-stripe">
                                        <div className="d-flex justify-content-end">
                                               <Nav.Link name="addSite" className="add-txt-btn"  hidden={this.props.userRoleControlRights.indexOf(this.props.addUserId) === -1}
                                                   onClick={()=>this.props.getUserEmailConfig("IDS_USERS", "create", "nemailconfigcode", this.props.SelectedEmailConfig, this.props.masterdata, this.props.userInfo, this.props.addUserId)}>
                                                  <FontAwesomeIcon icon={faPlus} /> { }
                                                  <FormattedMessage id='IDS_ADDUSERS' defaultMessage='Add Users' />
                                              </Nav.Link>
                                         </div>
                                    </div>
                                <Row noGutters={true}>
                                    <Col md={12}>
                                        
                                        <DataGrid
                                            extractedColumnList={this.extractedColumnList}
                                            primaryKeyField="nemailuserconfigcode"
                                            inputParam={this.props.inputParam}
                                            userInfo={this.props.userInfo}
                                            data={this.props.masterData.users || []}
                                            dataResult={process(this.props.masterData.users || [], this.state.dataState)}
                                            dataState={this.state.dataState}
                                            width="500px"
                                            pageable={false}
                                            controlMap={this.props.controlMap}
                                            userRoleControlRights={this.props.userRoleControlRights || []}
                                            scrollable={"Scrollable"}
                                            isActionRequired={true}
                                            isToolBarRequired={false}
                                            methodUrl={this.props.methodUrl}
                                            deleteRecord={this.props.deleteRecord}
                                            deleteParam={this.props.deleteParam}
                                            hideColumnFilter={true}
                                          
                                        />
                                    </Col>
                                </Row>
                                {/* </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container> */}
                           
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

export default injectIntl(EmailConfigTab);