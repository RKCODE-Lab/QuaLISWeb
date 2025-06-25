import { faEye, faPencilAlt, faPlus, faSort, faThumbsUp, faTrashAlt ,faCopy} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ReactComponent as Reject } from '../../assets/image/reject.svg'
import { Button, Card, Nav } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import { ProductList } from '../product/product.styled';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { rulesEngineMoreFields, rulesEngineSubFields } from './TestGroupFields';
import { sortData } from '../../components/CommonScript';
import PerfectScrollbar from 'react-perfect-scrollbar'; 
import ListBoxDraggable from '../../components/ListBoxDraggable';

const TestGroupRulesEngineTab = (props) => {

    function insertSelectedField(array) {
        array[0]['selected'] = {}
        array[0]['selected'] = true;
        return array
    }
   // console.log('props--->>>', props)
    const addId = props.controlMap.has("Add Rules Engine") && props.controlMap.get("Add Rules Engine").ncontrolcode;
    const editId = props.controlMap.has("Edit Rules Engine") && props.controlMap.get("Edit Rules Engine").ncontrolcode;
    const deleteId = props.controlMap.has("Delete Rules Engine") && props.controlMap.get("Delete Rules Engine").ncontrolcode;
    const ApproveId = props.controlMap.has("Approve Rules Engine") && props.controlMap.get("Approve Rules Engine").ncontrolcode;
    const RetireId = props.controlMap.has("Retire Rules Engine") && props.controlMap.get("Retire Rules Engine").ncontrolcode;
    const saveExecutionOrderId = props.controlMap.has("Save Execution Order") && props.controlMap.get("Save Execution Order").ncontrolcode;
    const copyId = props.controlMap.has("Copy Rules Engine") && props.controlMap.get("Copy Rules Engine").ncontrolcode;

    return (
        <>
            <PerfectScrollbar>
                <div className='grouped-tab-inner rules-engine-tab-list'>
                    {/* <div className='grouped-tab-inner'> */}
                    <ListBoxDraggable
                        masterList={props.masterData.searchedDataRulesEngine || sortData(props.masterData.RulesEngine, 'ascending', 'nruleexecorder') || []}
                        isSearchedDataPresent={props.masterData.searchedDataRulesEngine &&
                            props.masterData.searchedDataRulesEngine.length > 0 ? true : false}
                        selectedListName="SelectedRulesEngine"
                        clickIconGroup={true}
                        filterColumnData={props.filterTransactionList}
                        searchListName="searchedDataRulesEngine"
                        mainField="srulename"
                        filterParam={props.filterParamRulesEngine}
                        selectedMaster={props.masterData.SelectedRulesEngine}
                        selectedTestGroupTestCode={props.masterData.SelectedRulesEngine && props.masterData.SelectedRulesEngine['ntestgrouptestcode']}
                        openflowview={props.openflowview}
                        viewOutcome={props.viewOutcome}
                        primaryKeyField="ntestgrouprulesenginecode"
                        sortableField={'nruleexecorder'}
                        getMasterDetail={(param) => props.getSelectedTestGroupRulesEngine(param, props.userInfo, props.masterData)}
                        userInfo={props.userInfo}
                        subFieldsLabel={true}
                        hideSearch={true}
                        subFields={rulesEngineSubFields}
                        masterData={props.masterData}
                        saveExecutionOrder={props.saveExecutionOrder}
                        actionIcons={
                            [
                                {
                                    title: props.intl.formatMessage({ id: "IDS_VIEWRULE" }),
                                    controlname: "faEye",
                                    objectName: "SelectedRulesEngine",
                                    // hidden: props.userRoleControlRights.indexOf(editId) === -1,
                                    hidden: false,
                                    inputData: { masterData: props.masterData, userInfo: props.userInfo },
                                    onClick: props.openflowview
                                }, {
                                    title: props.intl.formatMessage({ id: "IDS_VIEWOUTCOME" }),
                                    controlname: "faGift",
                                    objectName: "SelectedRulesEngine",
                                    // hidden: props.userRoleControlRights.indexOf(editId) === -1,
                                    hidden: false,
                                    inputData: { masterData: props.masterData, userInfo: props.userInfo },
                                    onClick: props.viewOutcome
                                }
                            ]}
                        commonActions={
                            <>
                                <ProductList className="d-flex product-category float-right icon-group-wrap">
                                    <Nav.Link className="btn btn-icon-rounded btn-circle solid-blue mr-1" role="button"
                                        hidden={props.userRoleControlRights.indexOf(addId) === -1}
                                        data-tip={props.intl.formatMessage({ id: "IDS_ADD" })}
                                        // data-for="tooltip-list-wrap"
                                        onClick={() => props.getTestGroupRulesEngineAdd()}
                                    >
                                        <FontAwesomeIcon icon={faPlus} title={props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                    </Nav.Link>
                                    <Nav.Link className="btn btn-circle outline-grey mr0 mr-1" href="#"
                                        data-tip={props.intl.formatMessage({ id: "IDS_EDIT" })}
                                        hidden={props.userRoleControlRights.indexOf(editId) === -1}

                                        onClick={(e) =>
                                            props.getEditTestGroupRulesEngine(
                                                "update", props.masterData, props.userInfo
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt}
                                            title={props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                    </Nav.Link>
                                    <Nav.Link className="btn btn-circle outline-grey " href=""
                                        data-tip={props.intl.formatMessage({ id: "IDS_DELETE" })}
                                        hidden={props.userRoleControlRights.indexOf(deleteId) === -1}

                                        onClick={props.ConfirmDeleteRule}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />

                                    </Nav.Link>
                                    <Nav.Link className="btn btn-circle outline-grey ml-1"
                                        data-tip={props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                        hidden={props.userRoleControlRights.indexOf(ApproveId) === -1}
                                        onClick={(e) => props.approveVersion(props.masterData, 1)}
                                    >
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                    </Nav.Link>
                                    <Nav.Link className="btn btn-circle outline-grey ml-1"
                                        data-tip={props.intl.formatMessage({ id: "IDS_RETIRE" })}
                                        hidden={props.userRoleControlRights.indexOf(RetireId) === -1}
                                        onClick={(e) => props.approveVersion(props.masterData, 2)}
                                    >
                                        <Reject className="custom_icons" width="20" height="20" />
                                    </Nav.Link>
                                    <Nav.Link className="btn btn-circle outline-grey ml-1"
                                        data-tip={props.intl.formatMessage({ id: "IDS_COPY" })}
                                        hidden={props.userRoleControlRights.indexOf(copyId) === -1}
                                        onClick={(e) => props.copyVersion(props.masterData, copyId)}
                                    >
                                        <FontAwesomeIcon icon={faCopy} />
                                    </Nav.Link>
                                </ProductList>

                            </>
                        }>
                    </ListBoxDraggable>
                </div>
            </PerfectScrollbar>
            {/* </div> */}
            {/* 
            <PerfectScrollbar>
                <div className='grouped-tab-inner'>

                    <TransactionListMasterJsonView
                        cardHead={167}
                        // componentBreadcrumbs={this.breadCrumbData ? this.breadCrumbData.length > 0 ? true : false : false}
                        // notSearchable={false}
                        masterList={props.masterData.searchedDataRulesEngine || sortData(props.masterData.RulesEngine, 'descending', 'ntestgrouprulesenginecode') || []}
                        selectedMaster={[props.masterData.SelectedRulesEngine]}
                        clickIconGroup={true}
                        // selectedMaster={SelectedTest !== undefined ? [SelectedTest] : undefined}
                        primaryKeyField="ntestgrouprulesenginecode"
                        getMasterDetail={(param) => props.getSelectedTestGroupRulesEngine(param, props.userInfo, props.masterData)}
                        //  inputParam={getTest}
                        // additionalParam={[]}
                        mainField="srulename"
                        selectedListName="SelectedRulesEngine"
                        objectName="RulesEngine"
                        listName="IDS_RULESENGINE"
                        showStatusLink={true}
                        statusFieldName="stransdisplaystatus"
                        statusField="ntransactionstatus"
                        subFields={rulesEngineSubFields}
                        //   moreField={rulesEngineMoreFields}
                        needValidation={false}
                        needFilter={false}
                        subFieldsLabel={true}
                        filterColumnData={props.filterTransactionList}
                        searchListName="searchedDataRulesEngine"
                        //searchRef={this.searchRef}
                        hidePaging={false}
                        filterParam={props.filterParamRulesEngine}
                        handlePageChange={props.handlePageChangeRuleEngine}
                        skip={props.skipRulesEngine}
                        take={props.takeRulesEngine}
                        pageSize={props.settings && props.settings[13].split(",").map(setting => parseInt(setting))}
                        actionIcons={
                            [
                                // {
                                //     title: props.intl.formatMessage({ id: "IDS_EDIT" }),
                                //     controlname: "faPencilAlt",
                                //     objectName: "SelectedRulesEngine",
                                //     // hidden: props.userRoleControlRights.indexOf(editId) === -1,
                                //     hidden: false,
                                //     inputData: { masterData: props.Login.masterData, userInfo: props.Login.userInfo },
                                //     onClick:   props.getEditTestGroupRulesEngine(
                                //         "update",  props.Login.masterData,    props.Login.userInfo
                                //     ),
                                //   //s  needConditionalIcon: true,
                                //   //  conditionalIconFunction: this.fileViewIcon
                                // }, 
                                // {
                                //     title: props.intl.formatMessage({ id: "IDS_DELETE" }),
                                //     controlname: "faTrashAlt",
                                //     objectName: "SelectedRulesEngine",
                                //     // hidden: props.userRoleControlRights.indexOf(editId) === -1,
                                //     hidden: false,
                                //     inputData: { masterData: props.Login.masterData, userInfo: props.Login.userInfo },
                                //     //  onClick: (props) => this.getEditRulesEngine(props), 
                                // }, {
                                //     title: props.intl.formatMessage({ id: "IDS_APPROVE" }),
                                //     controlname: "faThumbsUp",
                                //     objectName: "SelectedRulesEngine",
                                //     // hidden: props.userRoleControlRights.indexOf(editId) === -1,
                                //     hidden: false,
                                //     inputData: { masterData: props.Login.masterData, userInfo: props.Login.userInfo },
                                //     //  onClick: (props) => this.getEditRulesEngine(props), 
                                // },  
                                {
                                    title: props.intl.formatMessage({ id: "IDS_VIEWRULE" }),
                                    controlname: "faEye",
                                    objectName: "SelectedRulesEngine",
                                    // hidden: props.userRoleControlRights.indexOf(editId) === -1,
                                    hidden: false,
                                    inputData: { masterData: props.masterData, userInfo: props.userInfo },
                                    onClick: props.openflowview
                                }, {
                                    title: props.intl.formatMessage({ id: "IDS_VIEWOUTCOME" }),
                                    controlname: "faGift",
                                    objectName: "SelectedRulesEngine",
                                    // hidden: props.userRoleControlRights.indexOf(editId) === -1,
                                    hidden: false,
                                    inputData: { masterData: props.masterData, userInfo: props.userInfo },
                                    onClick: props.viewOutcome
                                }
                            ]
                        }
                        commonActions={
                            <>
                                <ProductList className="d-flex product-category float-right icon-group-wrap">
                                    <Nav.Link className="btn btn-icon-rounded btn-circle solid-blue mr-1" role="button"
                                        hidden={props.userRoleControlRights.indexOf(addId) === -1}
                                        data-tip={props.intl.formatMessage({ id: "IDS_ADD" })}
                                        // data-for="tooltip-list-wrap"
                                        onClick={() => props.getTestGroupRulesEngineAdd()}
                                    >
                                        <FontAwesomeIcon icon={faPlus} title={props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                    </Nav.Link>
                                    <Nav.Link className="btn btn-circle outline-grey mr0 mr-1" href="#"
                                        data-tip={props.intl.formatMessage({ id: "IDS_EDIT" })}
                                        hidden={props.userRoleControlRights.indexOf(editId) === -1}

                                        onClick={(e) =>
                                            props.getEditTestGroupRulesEngine(
                                                "update", props.masterData, props.userInfo
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt}
                                            title={props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                    </Nav.Link>
                                    <Nav.Link className="btn btn-circle outline-grey " href=""
                                        data-tip={props.intl.formatMessage({ id: "IDS_DELETE" })}
                                        hidden={props.userRoleControlRights.indexOf(deleteId) === -1}

                                        onClick={props.ConfirmDeleteRule}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />

                                    </Nav.Link>
                                    <Nav.Link className="btn btn-circle outline-grey ml-1"
                                        data-tip={props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                        hidden={props.userRoleControlRights.indexOf(ApproveId) === -1}
                                        onClick={(e) => props.approveVersion(props.masterData, 1)}
                                    >
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                    </Nav.Link>
                                    <Nav.Link className="btn btn-circle outline-grey ml-1"
                                        data-tip={props.intl.formatMessage({ id: "IDS_RETIRE" })}
                                        hidden={props.userRoleControlRights.indexOf(RetireId) === -1}
                                        onClick={(e) => props.approveVersion(props.masterData, 2)}
                                    >
                                        <Reject className="custom_icons" width="20" height="20" />
                                    </Nav.Link> 
                                </ProductList>

                            </>
                        }
                    />
                </div>
            </PerfectScrollbar> */}
        </>
    );
};

export default injectIntl(TestGroupRulesEngineTab);