import React from 'react';
import { Row, Col, Card, Nav, ListGroup, Media } from 'react-bootstrap';
import { HeaderText } from './testmaster-styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MediaSubHeader, MediaLabel, ClientList } from '../../components/App.styles';
import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import {  transactionStatus } from '../../components/Enumeration';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';



// import ReactTooltip from 'react-tooltip';

const TestSpecificationTab = (props) => {
    const { parameterNumericList, selectedParameter, userInfo, addId, editId, deleteId, userRoleControlRights } = props;
    const gridHeight = 'auto'
    const ClinicalSpecColumns = [//{ "idsName": "IDS_GENDER", "dataField": "sgendername", "width": "150px","fieldType":"groupHeader"},
    { "idsName": "IDS_FROMAGE", "mandatory": true, "dataField": "nfromage", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
    { "idsName": "IDS_PERIOD", "mandatory": true, "dataField": "sfromageperiod", "width": "150px" , "mandatoryLabel":"IDS_SELECT", "controlType": "textbox"},
    { "idsName": "IDS_TOAGE", "mandatory": true, "dataField": "ntoage", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}, 
    { "idsName": "IDS_PERIOD", "mandatory": true, "dataField": "stoageperiod", "width": "150px" , "mandatoryLabel":"IDS_SELECT", "controlType": "textbox"}, 
    { "idsName": "IDS_HIGHA", "mandatory": true, "dataField": "shigha", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
     { "idsName": "IDS_HIGHB", "mandatory": true, "dataField": "shighb", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
     { "idsName": "IDS_LOWA", "mandatory": true, "dataField": "slowa", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
      { "idsName": "IDS_LOWB", "mandatory": true, "dataField": "slowb", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },

      { "idsName": "IDS_MINLOQ", "mandatory": true, "dataField": "sminloq", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
     { "idsName": "IDS_MAXLOQ", "mandatory": true, "dataField": "smaxloq", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
     { "idsName": "IDS_MINLOD", "mandatory": true, "dataField": "sminlod", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
      { "idsName": "IDS_MAXLOD", "mandatory": true, "dataField": "smaxlod", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
      { "idsName": "IDS_DISREGARDED", "mandatory": true, "dataField": "sdisregard", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },

      { "idsName": "IDS_DEFAULTRESULT", "mandatory": true, "dataField": "sresultvalue", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
      { "idsName": "IDS_GRADE", "mandatory": true, "dataField": "sgradename", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}

   ];
  

     const detailedFieldList = [
       { "dataField": "shigha","idsName": "IDS_HIGHA" , columnSize:"4"},
       { "dataField": "shighb" ,"idsName": "IDS_HIGHB",  columnSize:"4"},
       { "dataField": "slowa", idsName: "IDS_LOWA" , columnSize:"4"},
         { "dataField": "slowb", idsName: "IDS_LOWB", columnSize: "12" },
         { "dataField": "sresultvalue", idsName: "IDS_DEFAULTRESULT", columnSize:"4" }

     
   ];
    return (
        <div className="mt-3">

{props.SelectedTest  && props.SelectedTest.nclinicaltyperequired===transactionStatus.YES ?//props.masterData.selectedNode.nsampletypecode === SampleType.CLINICALTYPE &&
                        <>
                            <Row className="no-gutters pt-2 pb-2 col-12 text-right border-bottom">
                                <Col md={12}>
                            <div className="d-flex justify-content-end">
                                
                            <Nav.Link name="addclinicalspec" className="add-txt-btn" hidden={userRoleControlRights.indexOf(addId) === -1}
                        onClick={() =>   props.openModalSpec("create", selectedParameter, userInfo, addId)}>
                        <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id="IDS_CLINICALSPEC" defaultMessage="Clinical Spec" />
                    </Nav.Link>
                                       
                                    </div>
                                </Col>
                            </Row>
                            {/* {props.siteAddress.nmanufsitecode === props.masterData.ManufacturerSiteAddress.nmanufsitecode ? */}
                            <Row>
                                <Col>
                                    {/* <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            <Card.Body className='form-static-wrap padding-class'> */}
                                                <DataGrid
                                                    primaryKeyField={"ntestmasterclinicspeccode"}
                                                    expandField="expanded"
                                                    gridHeight={gridHeight + 'px'}
                                                    extractedColumnList={ClinicalSpecColumns || []}
                                                    userInfo={props.userInfo}
                                                    scrollable={"scrollable"}
                                                    isActionRequired={true}
                                                    data={props.data}
                                                    total={props.data && props.data.length || 0}
                                                    dataState={props.dataState}
                                                    dataStateChange={props.dataStateChange}
                                                    dataResult={process(props.TestMasterClinicalSpec|| [], props.dataState)}{...props.dataState}
                                                    controlMap={props.controlMap}
                                                    userRoleControlRights={[]}
                                                            methodUrl="testgrouptestclinicspeccode"
                                                    pageable={true}
                                                    selectedId={props.selectedId}
                                                    hasDynamicColSize={props.hasDynamicColSize}
                                                    hideDetailBand={true}
                                                    actionIcons={[{
                                                        title: props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                        controlname: "faPencilAlt",
                                                        objectName: "mastertoedit",
                                                        hidden: userRoleControlRights.indexOf(editId) === -1,
                                                        //onClick: (viewdetails) => this.ViewAuditDetails(viewdetails)
                                                        onClick: (viewdetails) => props.EditSpecDetails(viewdetails,editId)

                                                    },
                                                    {
                                                        title: props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                        controlname: "faTrashAlt",
                                                        objectName: "mastertodelete",
                                                        hidden: userRoleControlRights.indexOf(deleteId) === -1,
                                                        onClick: (viewdetails) => props.deleteRecord(viewdetails,deleteId)
                                                    }
                                                    ]}



                                                >
                                                </DataGrid>

                                            {/* </Card.Body>
                                        </Card>
                                    </ContentPanel> */}
                                </Col>
                            </Row>
                        </>
                        :
                        <>
                         <Row>
                            <Col md="12">
                                <Card>
                                    <Card.Header className="d-flex justify-content-between">
                                        <HeaderText>{props.intl.formatMessage({ id: "IDS_SPECIFICATION" })}</HeaderText>
                                        <Nav.Item className="add-txt-btn" name="addnumericspecificationname"
                                            hidden={userRoleControlRights.indexOf(addId) === -1}
                                            onClick={() => props.openModal("create", selectedParameter, userInfo, addId)}>
                                            <FontAwesomeIcon icon={faPlus} />{" "}
                                            <FormattedMessage id="IDS_ADDSPECIFICATION" defaultMessage="Specification" />
                                        </Nav.Item>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <ListGroup as="ul">
                                            {parameterNumericList &&
                                                parameterNumericList.map((specitem, specindex) => {
                                                    return (
                                                        <ListGroup.Item key={specindex}>
                                                            <Media>
                                                                <Media.Body>
                                                                    {/* 
                                                                    Note:
                                                                    Don't delete these commented lines because this feature is needed for Agaram LIMS */}
                                                                    {/* Start Here */}
                                                                    <MediaSubHeader>
                                                                        <MediaLabel>{props.intl.formatMessage({id: "IDS_DISREGARDED"})}{": "}</MediaLabel>{specitem.sdisregard}
                                                                    </MediaSubHeader>
                                                                    <MediaSubHeader>
                                                                        <MediaLabel>{props.intl.formatMessage({id: "IDS_MINLOD"})}{": "}</MediaLabel>{specitem.sminlod}
                                                                        <MediaLabel className="seperator">|</MediaLabel>
                                                                        <MediaLabel>{props.intl.formatMessage({id: "IDS_MAXLOD"})}{": "}</MediaLabel>{specitem.smaxlod}
                                                                    </MediaSubHeader>
                                                                    <MediaSubHeader>
                                                                        <MediaLabel>{props.intl.formatMessage({id: "IDS_MINLOQ"})}{": "}</MediaLabel>{specitem.sminloq}
                                                                        <MediaLabel className="seperator">|</MediaLabel>
                                                                        <MediaLabel>{props.intl.formatMessage({id: "IDS_MAXLOQ"})}{": "}</MediaLabel>{specitem.smaxloq}
                                                                    </MediaSubHeader>
                                                                    {/* Start Here */}
                                                                    <MediaSubHeader>
                                                                        <MediaLabel>{props.intl.formatMessage({ id: "IDS_MINB" })}{": "}</MediaLabel>{specitem.sminb}
                                                                        <MediaLabel className="seperator">|</MediaLabel>
                                                                        <MediaLabel>{props.intl.formatMessage({ id: "IDS_MAXB" })}{": "}</MediaLabel>{specitem.smaxb}
                                                                    </MediaSubHeader>
                                                                    {/*
                                                                     Note: 
                                                                     Don't delete these commented lines because this feature is needed for Agaram LIMS */}
                                                                    {/* Start Here */}
                                                                    <MediaSubHeader>
                                                                        <MediaLabel>{props.intl.formatMessage({id: "IDS_MINA"})}{": "}</MediaLabel>{specitem.smina}
                                                                        <MediaLabel className="seperator">|</MediaLabel>
                                                                        <MediaLabel>{props.intl.formatMessage({id: "IDS_MAXA"})}{": "}</MediaLabel>{specitem.smaxa}
                                                                    </MediaSubHeader>
                                                                    {/* Start Here */}
                                                                    <MediaSubHeader>
                                                                        <MediaLabel>{props.intl.formatMessage({ id: "IDS_DEFAULTRESULT" })}{": "}</MediaLabel>{specitem.sresultvalue}
                                                                    </MediaSubHeader>
                                                                    <MediaSubHeader>
                                                                        <MediaLabel>{props.intl.formatMessage({ id: "IDS_GRADENAME" })}{": "}</MediaLabel>{specitem.sgradename}
                                                                    </MediaSubHeader>
                                                                </Media.Body>
                                                                <ClientList className="ml-5">
                                                                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                                    <Nav.Item as="a" className="mr-3 action-icons-wrap" name="editnumericspecificationname"
                                                                        hidden={userRoleControlRights.indexOf(editId) === -1}
                                                                       // data-for="tooltip_list_wrap"
                                                                        data-tip={props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                        onClick={() => props.openModal("update", specitem, userInfo, editId)}>
                                                                        <FontAwesomeIcon icon={faPencilAlt} className="ActionIconColor"></FontAwesomeIcon>
                                                                    </Nav.Item>
                                                                    <Nav.Item as="a" className="mr-3 action-icons-wrap" name="deletenumericspecificationname">
                                                                        <ConfirmDialog
                                                                            name="deleteMessage"
                                                                            message={props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                            doLabel={props.intl.formatMessage({ id: "IDS_OK" })}
                                                                            doNotLabel={props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                            icon={faTrashAlt}
                                                                            title={props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                            hidden={userRoleControlRights && userRoleControlRights.indexOf(deleteId) === -1}
                                                                            handleClickDelete={() => props.deleteAction(specitem, "delete", deleteId, "TestParameterNumeric", "openChildModal")}
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
                        </>
}

        </div>
    );
};

export default injectIntl(TestSpecificationTab);