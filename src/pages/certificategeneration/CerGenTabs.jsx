import React from 'react'
import { Row, Col } from 'react-bootstrap';
import {  injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';



const CerGenTabs = (props) => {
    return (<>
        <Row className="no-gutters">
            <Col md={12}>
                <DataGrid
                  userRoleControlRights={props.userRoleControlRights}
                  controlMap={props.controlMap}
                    primaryKeyField={props.primaryKeyField}
                    data={props.masterData[props.primaryList]}
                    dataResult={props.dataResult}
                    dataState={props.dataState}
                    dataStateChange={props.dataStateChange}
                    extractedColumnList={props.columnList}
                    inputParam={props.inputParam}
                    userInfo={props.userInfo}
                    methodUrl={props.methodUrl}
                    pageable={true}
                    scrollable={"scrollable"}
                    isActionRequired={false}
                    isToolBarRequired={false}
                    selectedId={props.selectedId}
                    hideColumnFilter={false}
                    expandField={props.expandField}
                    handleExpandChange={props.handleExpandChange}
                    hasChild={props.hasChild}
                    childColumnList={props.childColumnList}
                    childMappingField={"npreregno"}
                    childList ={props.childList || new Map()}
                />
           
            </Col>
        </Row>
    </>
    );
}
export default injectIntl(CerGenTabs);