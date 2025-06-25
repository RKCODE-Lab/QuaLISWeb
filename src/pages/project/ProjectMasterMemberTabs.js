import React from 'react'
import { Row, Col, Nav } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// import ReactTooltip from 'react-tooltip';

const ProjectMasterMemberTabs = (props) => {
  //console.log(props);
    return (<>
        <Row className="no-gutters text-right border-bottom pt-2 pb-2" >
            <Col md={12}>
                <div className="d-flex justify-content-end">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap"/> */}
                    <Nav.Link className="add-txt-btn" hidden={props.userRoleControlRights ? props.userRoleControlRights.indexOf(props.addId) === -1 : false}
                        //  data-tip={props.intl.formatMessage({ id: props.addTitleIDS})}

                        //data-for="tooltip_list_wrap"
                        onClick={() => props.comboDataService(props.addParam.screenName, props.addParam.operation, props.addParam.masterData, props.addParam.userInfo, props.addParam.ncontrolCode)}>
                        <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id={props.addTitleIDS} defaultMessage={props.addTitleDefaultMsg} />
                    </Nav.Link>
                </div>
            </Col>
        </Row>
        <Row className="no-gutters">
            <Col md={12}>
                <DataGrid
                    primaryKeyField={"nprojectmembercode"}

                    dataResult={props.dataResult}
                    dataState={props.dataState}
                    dataStateChange={props.dataStateChange}
                    extractedColumnList={props.columnList}
                    controlMap={props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    inputParam={props.inputParam}
                    userInfo={props.userInfo}
                    // --   fetchRecord={this.props.getPricingEditService}
                    //--       editParam={{...editTestPriceParam, "updateType":"Single", priceDataState:this.state.priceDataState}}
                    deleteRecord={props.deleteRecord}
                    deleteParam={props.deleteParam}
                    methodUrl={props.methodUrl}
                    // reloadData={this.reloadData}
                    // --      addRecord = {() => this.openModal(addId)}
                    pageable={true}
                    scrollable={'scrollable'}
                    // gridHeight = {'600px'}
                    isActionRequired={true}
                    isToolBarRequired={false}
                    selectedId={props.selectedId}
                    data={props.masterData[props.primaryList]}
                />

            </Col>
        </Row>
    </>
    );
}
export default injectIntl(ProjectMasterMemberTabs);