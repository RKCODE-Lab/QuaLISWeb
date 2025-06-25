import React from 'react'
import { Row, Col, Nav } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// import ReactTooltip from 'react-tooltip';

const TrainingCertificateTabs = (props) => {
    return (<>
        <Row className="no-gutters text-right border-bottom pt-2 pb-2" >
            <Col md={12}>
                <div className="d-flex justify-content-end">
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap"/> */}
                <Nav.Link className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(props.addId) === -1}
            
                 // data-for="tooltip_list_wrap"
                 onClick={() => props.comboDataService(props.addParam)}>
                    <FontAwesomeIcon icon={faPlus} /> { }
                    <FormattedMessage id={props.addTitleIDS} defaultMessage={props.addTitleDefaultMsg} />
                </Nav.Link>
                </div>
            </Col>
        </Row>
        <Row className="no-gutters">
            <Col md={12}>
                <DataGrid
                    primaryKeyField={props.primaryKeyField}
                    data={props.masterData[props.primaryList]}
                    dataResult={props.dataResult}
                    dataState={props.dataState}
                    dataStateChange={props.dataStateChange}
                    extractedColumnList={props.columnList}
                    controlMap={props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    inputParam={props.inputParam}
                    userInfo={props.userInfo}
                    methodUrl={props.methodUrl}
                    deleteRecord={props.deleteRecord}
                    deleteParam={props.deleteParam}
                    pageable={true}
                    scrollable={"scrollable"}
                    //isComponent={true}
                    isActionRequired={true}
                    isToolBarRequired={false}
                    selectedId={props.selectedId}
                />

            </Col>
        </Row>
    </>
    );
}
export default injectIntl(TrainingCertificateTabs);