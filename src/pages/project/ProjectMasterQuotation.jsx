import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
//import { transactionStatus } from '../../components/Enumeration';
//ALPD-3566
const ProjectMasterQuotation = (props) => {
    const addProjectQuotationId = props.controlMap.has("AddProjectQuotation") && props.controlMap.get("AddProjectQuotation").ncontrolcode;
    const projectQuotationColumnList = [
        { "idsName": "IDS_QUOTATION", "dataField": "squotationno", "width": "200px" },
        { "idsName": "IDS_DEFAULTSTATUS", "dataField": "stransdisplaystatus", "width": "150px" },
        {"idsName":"IDS_REMARKS","dataField":"sremarks","width":"200px"}
    ];    
    const editParam = {screenName:"IDS_QUOTATION" , operation:"update", 
    primaryKeyField:"nprojectquotationcode", inputParam:props.inputParam,  userInfo:props.userInfo,SelectedProjectMaster:props.SelectedProjectMaster
};
    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addprojectquotation" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addProjectQuotationId) === -1}
                        onClick={()=>props.getAvailableQuotation(props.SelectedProjectMaster, "IDS_QUOTATION", props.userInfo, addProjectQuotationId)}>
                        <FontAwesomeIcon icon={faPlus} /> {" "}
                        <FormattedMessage id="IDS_ADDPROJECTQUOTATION" defaultMessage="Project Quotation" />
                    </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                        key="projectquotationkey"
                        primaryKeyField="nprojectquotationcode"
                        data={props.ProjectQuotation || []}
                        dataResult={props.projectQuotationdataResult}
                        dataState={props.projectQuotationDataState}
                        dataStateChange={props.projectQuotationDataStateChange}
                        extractedColumnList={projectQuotationColumnList}
                        controlMap={ props.controlMap }
                        userRoleControlRights={props.userRoleControlRights}
                        inputParam={props.inputParam}
                        userInfo={props.userInfo}
                        deleteRecord={props.deleteProjectQuotation}
                        pageable={true}
                        scrollable={'scrollable'}
                        gridHeight={'450px'}
                        isActionRequired={true}
                        deleteParam={{operation:"delete", methodUrl:"ProjectQuotation"}}
                        methodUrl={"ProjectQuotation"}
                        hideColumnFilter={false}
                        fetchRecord={props.getActiveProjectQuotationById}
                        editParam={editParam}
                    >
                    </DataGrid>
                </Col>
            </Row>
        </>
    );
};

export default ProjectMasterQuotation;