import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
//import { process } from '@progress/kendo-data-query';

const ProjectMasterHistoryTab = (props) => {

    const historyColumnList = [

        { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransdisplaystatus", "width": "200px" },
        { "idsName": "IDS_TRANSACTIONDATE", "dataField": "sdtransactiondate", "width": "250px","fieldType":"dateOnlyFormat" },
        { "idsName": "IDS_REMARKS", "dataField": "sremarks", "width": "250px" },
        { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "150px" },
        { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "150px" },

    ];

    return (
        <>
            <Row noGutters>
                <Col md={12}>
                    <DataGrid
                        key="ProjectMaster"
                        primaryKeyField="nprojectmasterhistorycode"

                        data={props.projectMasterHistorydata}
                        dataResult={props.projectMasterdataResult}
                        dataState={props.dataState}
                        hideColumnFilter={true}
                        dataStateChange={props.historydataStateChange}
                        extractedColumnList={historyColumnList}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        inputParam={props.inputParam}
                        userInfo={props.userInfo}
                        pageable={false}
                        scrollable={'scrollable'}
                        gridHeight={'200px'}
                        isActionRequired={false}
                        methodUrl=""
                        // expandField="expanded"

                    >
                    </DataGrid>
                </Col>
            </Row>
            {/* } */}
        </>
    );
};

export default ProjectMasterHistoryTab;