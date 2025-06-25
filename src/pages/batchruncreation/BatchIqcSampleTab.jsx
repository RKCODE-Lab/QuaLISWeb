import React from 'react';
import {Nav, Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';

const BatchIqcSampleTab = (props) =>{
    const addIqcSampleId = props.controlMap.has("AddIQCSample") && props.controlMap.get("AddIQCSample").ncontrolcode;
    
    // const sampleColumnList = [];
    
    // if (props.nneedsubsample){
    //     sampleColumnList.push({"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
    // }
    // else{
    //     sampleColumnList.push({"idsName":"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
    // }
    const deleteParam = { operation: "delete" };
    const batchIqcColumnList = [];

    batchIqcColumnList.push(   
        {"idsName":"IDS_IQCSAMPLE","dataField":"smaterialname","width":"155px"},
        {"idsName":"IDS_IQCSAMPLEARNO","dataField":"sarno","width":"155px"},
        {"idsName":"IDS_AVAILABLEQTY","dataField":"savailablequatity","width":"170px"},
        {"idsName":"IDS_ISSUEDQTY","dataField":"nqtyused","width":"155px"},
        {"idsName":"IDS_UNIT","dataField":"sunitname","width":"100px"},
        {"idsName":"IDS_INVENTORYID","dataField":"sinventoryid","width":"155px"},
        {"idsName":"IDS_REMARKS","dataField":"sremarks","width":"155px"},
        
     );
    
    return (
        <>
         <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addiqcsample" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addIqcSampleId) === -1}
                            onClick={props.getIqcSamples}
                    >
                            <FontAwesomeIcon icon = { faPlus } /> { }
                            <FormattedMessage id="IDS_IQCSAMPLE" defaultMessage="IQCSamples"></FormattedMessage>
                        </Nav.Link>
                </div>
            </div>
    
        <Row noGutters>
            <Col md={12}>
                <DataGrid
                    key="nbatchsampleiqccode"
                    primaryKeyField = "nbatchsampleiqccode"
                    data = {props.iqcsample && props.iqcsample.length > 0 ? props.iqcsample :[]}
                    dataResult = {props.dataResult}
                    dataState = {props.dataState}
                    dataStateChange = {props.dataStateChange}
                    extractedColumnList = {batchIqcColumnList}
                    controlMap = {props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    userInfo={props.userInfo}
                    pageable={true}
                    methodUrl={props.methodUrl}
                    deleteParam={deleteParam}
                    deleteRecord={props.cancelRecord}
                    //cancelRecord={props.cancelRecord}
                    scrollable={'scrollable'}
                    gridHeight = {'375px'}
                    hideDetailBand={true}
                    // width={'600px'}
                    isActionRequired={true}
                >
                </DataGrid>
            </Col>
        </Row>
        </>
    );
};
export default BatchIqcSampleTab;
