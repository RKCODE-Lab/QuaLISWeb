import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
//import { process } from '@progress/kendo-data-query';

const QuotationHistoryTab = (props) => {
  
    const historyColumnList = [
        
        { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransdisplaystatus", "width": "200px" },
        { "idsName": "IDS_REMARKS", "dataField": "sretireremarks", "width": "200px" },
        { "idsName": "IDS_TRANSACTIONDATE", "dataField": "sdtransactiondate", "width": "250px" },
        { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "150px" },
        { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "150px" },
        
    ];
       
    return (
        <>
            {/* { props.testGroupQuotationHistoryTab && props.testGroupQuotationHistoryTab.length > 0 && */}
                <Row noGutters>
                    <Col md={12}>
                        <DataGrid
                            key="QuotationHistory"
                            primaryKeyField="nquotationhistorycode"
                            // data={props.testGroupQuotationHistoryTab}
                            // dataResult={process(props.testGroupQuotationHistoryTab || [], { skip: 0, take: 10 })}
                            data={props.QuotationHistorydata}
                            dataResult={props.QuotationHistorydataResult}
                            dataState={props.dataState}
                            hideColumnFilter={true}
                            dataStateChange={props.historydataStateChange}
                            extractedColumnList={historyColumnList}
                            controlMap={props.controlMap}
                            userRoleControlRights={props.userRoleControlRights}
                            inputParam={props.inputParam}
                            userInfo={props.userInfo}
                            pageable={false}
                            // scrollable={'scrollable'}
                            gridHeight={'250px'}
                            isActionRequired={false}
                            methodUrl=""
                            expandField="expanded"
                        >
                        </DataGrid>
                    </Col>
                </Row>
            {/* } */}
        </>
    );
};

export default QuotationHistoryTab;