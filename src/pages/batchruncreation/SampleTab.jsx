import React from 'react';
import {Nav, Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';



const SampleTab = (props) =>{
    const addSampleId = props.controlMap.has("AddSamples") && props.controlMap.get("AddSamples").ncontrolcode;
    
    const sampleColumnList = [];
    
    if (props.nneedsubsample){
        sampleColumnList.push({"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
    }
    else{
        sampleColumnList.push({"idsName":"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
    }

     sampleColumnList.push(      
        {"idsName":"IDS_TESTNAME","dataField":"stestsynonym","width":"250px"}
     );
    
    

    const deleteParam = { operation: "delete" };
    return (
        <>
         <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addsamples" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addSampleId) === -1}
                            onClick={props.getSamples}
                    >
                            <FontAwesomeIcon icon = { faPlus } /> { }
                            <FormattedMessage id="IDS_SAMPLE" defaultMessage="Samples"></FormattedMessage>
                        </Nav.Link>
                </div>
            </div>
    
        <Row noGutters>
            <Col md={12}>
                <DataGrid
                    key="nbatchsamplecode"
                    primaryKeyField = "nbatchsamplecode"
                    data = {props.sample && props.sample.length > 0 ? props.sample :[]}
                    dataResult = {props.dataResult}
                    dataState = {props.dataState}
                    dataStateChange = {props.dataStateChange}
                    extractedColumnList = {props.extractedColumnList}
                    detailedFieldList={props.detailedFieldList}
                    controlMap = {props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    userInfo={props.userInfo}
                    expandField="expanded"
                    pageable={true}
                    methodUrl={props.methodUrl}
                    deleteParam={deleteParam}
                    deleteRecord={props.deleteRecord}
                    scrollable={'scrollable'}
                    gridHeight = {'375px'}
                    hideDetailBand={false}
                    // width={'600px'}
                    isActionRequired={true}
                >
                </DataGrid>
            </Col>
        </Row>
        </>
    );
};
export default SampleTab;
