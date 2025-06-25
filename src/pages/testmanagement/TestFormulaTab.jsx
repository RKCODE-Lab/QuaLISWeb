import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, ListGroup, FormLabel, Media } from 'react-bootstrap';
import { HeaderText, ContactHeader } from './testmaster-styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { ClientList } from '../../components/App.styles';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { ProductList } from '../product/product.styled';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
// import ReactTooltip from 'react-tooltip';

const TestFormulaTab = (props) => {
    const { formulaList, selectedParameter, userInfo, addId, deleteId,defaultFormulaId, userRoleControlRights, optionalData,addPreDefinedFormulaId } = props;
    return (
        <Row>
            <Col md="12">
                <Card>
                    <Card.Header className="d-flex">
                        <HeaderText className='mr-auto'>{props.intl.formatMessage({ id: "IDS_FORMULA" })}</HeaderText>
                        <Nav.Item className="add-txt-btn mr-2" name="addpredefinedformulaname"
                            hidden={props.userRoleControlRights.indexOf(addPreDefinedFormulaId) === -1}
                            onClick={() => props.openPredefinedModal(userInfo, addPreDefinedFormulaId, optionalData)}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_PREDEFINEDFORMULA" defaultMessage="PreDefinedFormula" />
                        </Nav.Item>
                        <Nav.Item className="add-txt-btn" name="adduserdefinedformulaname"
                            hidden={props.userRoleControlRights.indexOf(addId) === -1}
                            onClick={() => props.openModal(selectedParameter, userInfo, addId, optionalData)}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_USERDEFINEDFORMULA" defaultMessage="UserDefinedFormula" />
                        </Nav.Item>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <ListGroup as="ul">
                            {formulaList &&
                                formulaList.map((formulaitem, formulaindex) => {
                                    return (
                                        <ListGroup.Item key={formulaindex} as="li">
                                            <Media>
                                                <Media.Body>
                                                    <ContactHeader className="mt-0">{formulaitem.sformulaname}</ContactHeader>
                                                    <ProductList>{formulaitem.sformulacalculationdetail}</ProductList>
                                                </Media.Body>
                                                <ClientList className="mr-1">
                                                    <FormLabel>{props.intl.formatMessage({ id: "IDS_SETASDEFAULT" })}</FormLabel>
                                                    <CustomSwitch
                                                        checked={formulaitem["ndefaultstatus"] === 4 || formulaitem["ntransactionstatus"] === 4 ? false : true}
                                                        name={`formulaswitch_${formulaitem[props.primaykeyName]}`}
                                                        //onChange={(event) => props.onSwitchChange(formulaitem, props.methodUrl.toLowerCase(), props.methodUrl,event)}
                                                        onChange={(event) => props.onSwitchChange(formulaitem, props.methodUrl.toLowerCase(), props.methodUrl,event,defaultFormulaId)}

                                                    />
                                                </ClientList>
                                                <ClientList className="ml-3">
                                                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                    <Nav.Item as="a" className="action-icons-wrap" name="deleteformulaname">
                                                        <ConfirmDialog
                                                            name="deleteMessage"
                                                            message={props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                            doLabel={props.intl.formatMessage({ id: "IDS_OK" })}
                                                            doNotLabel={props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                            icon={faTrashAlt}
                                                            title={props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                          //  data-for="tooltip_list_wrap"
                                                            hidden={userRoleControlRights && userRoleControlRights.indexOf(deleteId) === -1}
                                                            handleClickDelete={() => props.deleteAction(formulaitem, "delete", deleteId, props.methodUrl, "openChildModal")}
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

export default injectIntl(TestFormulaTab);