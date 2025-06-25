import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, ListGroup, Media, FormLabel } from 'react-bootstrap';
import { HeaderText, ContactHeader } from './testmaster-styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrashAlt,faEye} from '@fortawesome/free-solid-svg-icons';
import { ProductList } from '../product/product.styled';
import { ClientList } from '../../components/App.styles';
import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
// import ReactTooltip from 'react-tooltip';

const PredefinedParameterTab = (props) => {
    const { predefinedParameterList, selectedParameter, userInfo, addId, editId, deleteId,viewId,
        userRoleControlRights, optionalData, methodUrl, primaryKeyName } = props;
    return (
        <Row>
            <Col md="12">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                        <HeaderText>{props.intl.formatMessage({ id: "IDS_CODEDRESULT" })}</HeaderText>
                        <Nav.Item className="add-txt-btn" name="addcodedresultname"
                            hidden={userRoleControlRights.indexOf(addId) === -1}
                            onClick={() => props.openModal("create", selectedParameter, userInfo, addId, optionalData,props.masterData)}>
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>{" "}
                            {/* <FormattedMessage id="IDS_ADD" defaultMessage="Add" /> */}
                            <FormattedMessage id="IDS_CODEDRESULT" defaultMessage="Coded Result" />
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
                                                    <ContactHeader className="mt-0">{predefitem.spredefinedname}</ContactHeader>
                                                    <ProductList>{predefitem.sdisplaystatus}</ProductList>
                                                    {/* <ProductList>{predefitem.sresultparacomment}</ProductList> */}
                                                    <ProductList>{predefitem.spredefinedsynonym}</ProductList>
                                                </Media.Body>
                                                <div>
                                                <div className='d-flex  justify-content-end mr-1'>
                                                <ClientList className="action-icons-wrap">
                                                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                    <Nav.Item as="a" className="ml-2" name="editcodedresultname"
                                                        hidden={userRoleControlRights.indexOf(editId) === -1}
                                                        data-tip={props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                      //  data-for="tooltip_list_wrap"
                                                        onClick={() => props.openModal("update", predefitem, userInfo, editId, optionalData,props.masterData)}>
                                                        <FontAwesomeIcon icon={faPencilAlt} className="ActionIconColor"></FontAwesomeIcon>
                                                    </Nav.Item>
                                                </ClientList>
                                                <ClientList className="action-icons-wrap">
                                                    <Nav.Item as="a" className="ml-2 action-icons-wrap" name="deletecodedresultname">
                                                        <ConfirmDialog
                                                            name="deleteMessage"
                                                            message={props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                            doLabel={props.intl.formatMessage({ id: "IDS_OK" })}
                                                            doNotLabel={props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                            icon={faTrashAlt}
                                                            //dataforprops="tooltip_list_wrap"
                                                            //data-tip={props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            title={props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            hidden={userRoleControlRights && userRoleControlRights.indexOf(deleteId) === -1}
                                                            handleClickDelete={() => props.deleteAction(predefitem, "delete", deleteId, methodUrl, "openChildModal")}
                                                        />
                                                    </Nav.Item>
                                                </ClientList>
                                                <ClientList className="action-icons-wrap">
                                                    <Nav.Item as="a" className="ml-2" name="editcodedresultname"
                                                       // hidden={userRoleControlRights.indexOf(viewId) === -1}
                                                       hidden={ predefitem.nneedsubcodedresult===4 || predefitem.nneedsubcodedresult===undefined}
                                                        data-tip={props.intl.formatMessage({ id: "IDS_SUBCODERESULT" })}
                                                      //  data-for="tooltip_list_wrap"
                                                        onClick={() => props.subCodedResultView("update", predefitem, userInfo, viewId, optionalData,props.masterData)}>
                                                 
                                                        <FontAwesomeIcon icon={faEye} className="ActionIconColor"></FontAwesomeIcon>
                                                    </Nav.Item>
                                                </ClientList>
                                                </div>
                                                <div className='mt-2'>
                                                <ClientList className="d-flex inline-switch">
                                                    <FormLabel>{props.intl.formatMessage({ id: "IDS_SETASDEFAULT" })}</FormLabel>
                                                    <CustomSwitch
                                                        name={`predefinedswitch_${predefitem[primaryKeyName]}`}
                                                        checked={predefitem["ndefaultstatus"] === 4 ? false : true}
                                                        onChange={(event) => props.onSwitchChange(predefitem, methodUrl.toLowerCase(), methodUrl,event)}
                                                    />
                                                </ClientList>
                                                </div>
                                                </div>
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

export default injectIntl(PredefinedParameterTab);