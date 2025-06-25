import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {Row, Col, Nav} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../../components/data-grid/data-grid.component';

const BatchComponentTab = (props) => {

    const addComponentId = props.controlMap.has("AddBatchComponent") && props.controlMap.get("AddBatchComponent").ncontrolcode
   
    const componentAddParam = {screenName:"IDS_COMPONENT", operation:"create", primaryKeyField:"nbatchcompcode", 
                         primaryKeyValue:-2, masterData:props.masterData, userInfo:props.userInfo,
                         //batchCreation:
                         ncontrolCode:addComponentId};

    const deleteComponentId = props.controlMap.has("DeleteBatchComponent") && props.controlMap.get("DeleteBatchComponent").ncontrolcode
   
    const deleteParam = {screenName:"IDS_COMPONENT", operation:"delete", primaryKeyField:"nbatchcompcode", 
                        masterData:props.masterData, userInfo:props.userInfo,
                        ncontrolCode:deleteComponentId};

    return (<>
         <div className="actions-stripe">
            <div className="d-flex justify-content-end">               
                <Nav.Link name="addrole" className="add-txt-btn" 
                            hidden={props.userRoleControlRights.indexOf(addComponentId) === -1}
                            onClick={()=>props.getBatchComponentComboService(componentAddParam)}>
                    <FontAwesomeIcon icon={faPlus} /> { }
                    <FormattedMessage id='IDS_COMPONENT' defaultMessage='Component' />
                </Nav.Link>

                <Nav.Link name="addrole" className="add-txt-btn" 
                            hidden={props.userRoleControlRights.indexOf(deleteComponentId) === -1}
                            onClick={()=>props.getBatchComponentComboService(deleteParam)}>
                    <FontAwesomeIcon icon={faTrashAlt} /> { }
                    <FormattedMessage id='IDS_COMPONENT' defaultMessage='Component' />
                </Nav.Link>
            </div>
        </div>
        <Row className="no-gutters">
            <Col md={12}>
                <DataGrid   userRoleControlRights={props.userRoleControlRights}
                            controlMap={props.controlMap}
                            primaryKeyField={"nbatchcompcode"}
                            data={props.masterData.BatchComponentCreation || []}
                            dataResult={props.dataResult}
                            dataState={props.dataState}
                            dataStateChange={props.dataStateChange}
                            extractedColumnList={[{ "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" },
                                                    {  "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", "width": "250px" },
                                                    { "idsName": "IDS_MANUFACTUREBATCHLOTNO", "dataField": "smanuflotno", "width": "250px" },
                                                    { "idsName": "IDS_DATERECEIVED", "dataField": "sreceiveddate", "width": "250px" },
                                                    ]}
                            inputParam={props.inputParam}
                            userInfo={props.userInfo}
                            methodUrl={"BatchComponent"}
                            pageable={true}
                            scrollable={"scrollable"}
                            isActionRequired={true}
                            deleteRecord={props.deleteRecord}
                            deleteParam={props.deleteParam}
                            isToolBarRequired={false}
                            selectedId={props.selectedId}
                            hideColumnFilter={false}
                            expandField={props.expandField}
                            handleExpandChange={props.handleExpandChange}
                            hasChild={props.hasChild}
                            childColumnList={props.childColumnList}
                            childMappingField={props.childMappingField}
                            childList ={props.childList || new Map()}
                        />            
           </Col>
        </Row>  
    </>
    );
}
export default injectIntl(BatchComponentTab);