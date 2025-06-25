import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, ListGroup, Media } from 'react-bootstrap';
 import { HeaderText, ContactHeader } from '../testmanagement/testmaster-styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ProductList } from '../product/product.styled';
import { ClientList } from '../../components/App.styles';
import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { SampleType, transactionStatus } from '../../components/Enumeration';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
// import ReactTooltip from 'react-tooltip';

const NumericParameterTab = (props) => {
    const { predefinedParameterList, selectedParameter, userInfo, addId, editId, deleteId,
        userRoleControlRights, optionalData, methodUrl, primaryKeyName,selectedSpecification } = props;
    return (
        <Row>
            <Col md="12">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                        <HeaderText>{props.intl.formatMessage({ id: "IDS_CLINICALSPEC" })}</HeaderText>
                        <Nav.Item className="add-txt-btn" name="addclinicalspec"
                            // hidden={userRoleControlRights.indexOf(addId) === -1}
                            hidden={props.masterData.selectedNode.nsampletypecode !== SampleType.CLINICALTYPE}
                            onClick={() => props.openModal("create", selectedParameter, userInfo, addId, optionalData,props.masterData)}>
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>{" "}
                            <FormattedMessage id="IDS_ADD" defaultMessage="Add" />
                        </Nav.Item>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <ListGroup as="ul">
                            {predefinedParameterList &&
                                predefinedParameterList.map((predefitem, predefindex) => {
                                    return (
                                        <ListGroup.Item key={predefindex} as="li">
                                            <Media>
                                                <Media.Body>
                                                    <ContactHeader className="mt-0">{predefitem.sgendername}</ContactHeader>
                                                    {/* <Row>
                                                    <Col md={6}> */}
                                                    <ProductList>{predefitem.nfromage}</ProductList>
                                                    <ProductList>{predefitem.ntoage}</ProductList>
                                                    {/* </Col>
                                                    </Row> */}
                                                    <ProductList>{predefitem.shigha}</ProductList>
                                                    <ProductList>{predefitem.shighb}</ProductList>
                                                    <ProductList>{predefitem.slowa}</ProductList>
                                                    <ProductList>{predefitem.slowb}</ProductList>
                                                    <ProductList>{predefitem.sresultvalue}</ProductList>

                                                </Media.Body>
                                                {/* <ClientList className="mr-1">
                                                    <FormLabel>{props.intl.formatMessage({ id: "IDS_SETASDEFAULT" })}</FormLabel>
                                                    <CustomSwitch
                                                        name={`predefinedswitch_${predefitem[primaryKeyName]}`}
                                                        checked={predefitem["ndefaultstatus"] === 4 ? false : true}
                                                        onChange={(event) => props.onSwitchChange(predefitem, methodUrl.toLowerCase(), methodUrl,event)}
                                                    />
                                                </ClientList> */}
                                                <ClientList className="ml-5">
                                                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                    <Nav.Item as="a" className="mr-3" name="editclinicalspec"
                                                        //hidden={userRoleControlRights.indexOf(editId) === -1}
                                                        hidden={props.masterData.selectedNode.nsampletypecode !== SampleType.CLINICALTYPE}
                                                        data-tip={props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                      //  data-for="tooltip_list_wrap"
                                                        onClick={() => props.openModal("update", predefitem, userInfo, editId, optionalData,props.masterData)}>
                                                        <FontAwesomeIcon icon={faPencilAlt} className="ActionIconColor"></FontAwesomeIcon>
                                                    </Nav.Item>

                                                    <Nav.Item as="a" className="mr-3 action-icons-wrap" name="deleteclinicalspec">
                                                        <ConfirmDialog
                                                            name="deleteMessage"
                                                            message={props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                            doLabel={props.intl.formatMessage({ id: "IDS_OK" })}
                                                            doNotLabel={props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                            icon={faTrashAlt}
                                                            dataforprops="tooltip_list_wrap"
                                                            title={props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            //hidden={userRoleControlRights && userRoleControlRights.indexOf(deleteId) === -1}
                                                            hidden={props.masterData.selectedNode.nsampletypecode !== SampleType.CLINICALTYPE}
                                                            handleClickDelete={() => props.deleteAction(predefitem, "delete", deleteId, methodUrl, "openChildModal")}
                                                        />
                                                    </Nav.Item>
                                                </ClientList>
                                            </Media>
                                        </ListGroup.Item>
                                    )
                                })
                            }

                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default injectIntl(NumericParameterTab);