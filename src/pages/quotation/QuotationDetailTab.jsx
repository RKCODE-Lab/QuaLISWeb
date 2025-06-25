import React from 'react'
import { Row, Col, Nav } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus,faPencilAlt } from '@fortawesome/free-solid-svg-icons';
// import ReactTooltip from 'react-tooltip';

const QuotationDetailTab = (props) => {
    console.log(props);
    return (<>
        <Row className="no-gutters text-right border-bottom pt-2 pb-2" >
            <Col md={12}>
                <div className="d-flex justify-content-end">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap"/> */}
                    <Nav.Link name="addPrice" className="add-txt-btn" 
                                              hidden={props.userRoleControlRights.indexOf(props.addQuotationTestId) === -1}
                                              onClick={()=>props.getQuotationAddTestService("IDS_TEST", "create", props.masterData, props.userInfo, props.addQuotationTestId)}
                                              >
                            <FontAwesomeIcon icon={faPlus} /> { } 
                            <FormattedMessage id='IDS_TEST' defaultMessage='Test' />
                      </Nav.Link>
                     <Nav.Link name="updatePrice" className="add-txt-btn" 
                                              hidden={props.userRoleControlRights.indexOf(props.updateQuotationTestId) === -1}
                                              onClick={()=>props.getQuotationPricingEditService({...props.editTestPriceParam, "updateType":"All", dataState:undefined})}
                                              >
                              <FontAwesomeIcon icon={faPencilAlt} /> { }
                              <FormattedMessage id='IDS_PRICE' defaultMessage='Price' />
                     </Nav.Link>
                </div>
            </Col>
        </Row>
        <Row className="no-gutters">
            <Col md={12}>
                <DataGrid
                     primaryKeyField={"nquotationtestcode"}
                        data={props.data}
                    //  dataResult={process(this.props.Login.masterData.QuotationTest || [], this.state.quotationDataState)}
                        dataResult={props.dataResult}
                   //   dataState={this.state.quotationDataState}
                        dataState={props.dataState}
                     // dataStateChange={this.dataStateChange}
                     //   dataStateChange={(event) => this.setState({ quotationDataState: event.dataState })}
                        dataStateChange={props.dataStateChange}
                        extractedColumnList={props.columnList}
                        expandField="expanded"
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        inputParam={props.inputParam}
                        userInfo={props.userInfo}
                        fetchRecord={props.getQuotationPricingEditService}
                        editParam={{...props.editTestPriceParam, "updateType":"Single", dataState:props.dataState}}
                        gridHeight={'335px'}
                        deleteRecord={props.deleteRecord}
                        deleteParam={{operation:"delete"}}
                        methodUrl={"QuotationTest"}
                        addRecord = {() => this.openModal(props.addQuotationTestId)}
                        pageable={true}
                        scrollable={'scrollable'}
                        isActionRequired={true}
                        isToolBarRequired={false}
                        selectedId={props.selectedId}
                        
                />

            </Col>
        </Row>
    </>
    );
}
export default injectIntl(QuotationDetailTab);