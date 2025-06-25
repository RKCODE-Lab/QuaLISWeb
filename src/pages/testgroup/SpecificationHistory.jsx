import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
//import { process } from '@progress/kendo-data-query';

const SpecificationHistory = (props) => {
    const historyColumnList = [
        { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransdisplaystatus", "width": "200px" },
        { "idsName": "IDS_TRANSACTIONDATE", "dataField": "sdtransactiondate", "width": "250px" },
        { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "150px" },
        { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "150px" },
        { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px" }
    ];
       
    return (
        <>
            {/* { props.testGroupSpecificationHistory && props.testGroupSpecificationHistory.length > 0 && */}
                <Row noGutters>
                    <Col md={12}>
                        <DataGrid
                            key="testgroupspecificationhistorykey"
                            primaryKeyField="nspecificationhistorycode"
                            // data={props.testGroupSpecificationHistory}
                            // dataResult={process(props.testGroupSpecificationHistory || [], { skip: 0, take: 10 })}
                            data={props.data}
                            dataResult={props.dataResult}
                            dataState={props.dataState}
                            dataStateChange={props.dataStateChange}
                            extractedColumnList={historyColumnList}
                            controlMap={props.controlMap}
                            userRoleControlRights={props.userRoleControlRights}
                            inputParam={props.inputParam}
                            userInfo={props.userInfo}
                            pageable={true}
                            scrollable={'scrollable'}
                            gridHeight={'400px'}
                            isActionRequired={false}
                            methodUrl=""
                        >
                        </DataGrid>
                    </Col>
                </Row>
            {/* } */}
        </>
    );
};

export default SpecificationHistory;