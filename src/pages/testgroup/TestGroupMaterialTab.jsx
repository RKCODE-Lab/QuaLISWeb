import React from 'react';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component'
import { FormattedMessage, injectIntl } from 'react-intl';
import TestGroupMaterialAccordion from './TestGroupMaterialAccordion';
import { Nav } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PerfectScrollbar from 'react-perfect-scrollbar';

const TestGroupMaterialTab = (props) => {
    const addMaterialId = props.controlMap.has("AddTestMaterial") && props.controlMap.get("AddTestMaterial").ncontrolcode;

    const { TestGroupTestMaterial, selectedMaterial,
          SelectedSpecification } = props.masterData;
    function testGroupMaterialAccordion(TestGroupMaterial) {
        const accordionMap = new Map();
        TestGroupMaterial.map((testGroupMaterial) =>
            accordionMap.set(testGroupMaterial.ntestgrouptestmaterialcode,
                <TestGroupMaterialAccordion
                    testgrouptestmaterial={testGroupMaterial}
                    selectedSpecification={SelectedSpecification}
                    userRoleControlRights={props.userRoleControlRights}
                    controlMap={props.controlMap}
                    userInfo={props.userInfo}
                    selectedMaterial={selectedMaterial}
                    masterData={props.masterData}
                    ConfirmDelete={props.ConfirmDelete}
                    getDataForEditTestMaterial={props.getDataForEditTestMaterial}
                    selectedRecord={props.selectedRecord}

                />)
        );
        return accordionMap;
    }

    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                    <Nav.Link name="addMaterial" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addMaterialId) === -1}
             onClick={()=>props.getDataForTestMaterial(
                         "IDS_TESTGROUPMATERIAL","create", props.userInfo, addMaterialId,props.selectedRecord,props.masterData)}
                    >
                    <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id="IDS_ADDTESTGROUPTESTMATERIAL" defaultMessage={props.intl.formatMessage({ id: "IDS_MATERIAL" })} />
                    </Nav.Link>
                </div>
            </div>
            {TestGroupTestMaterial && TestGroupTestMaterial.length > 0 &&
            <PerfectScrollbar>
                <div className='grouped-tab-inner'>
                <CustomAccordion
                    paneHeight={props.paneHeight}
                    key="testgroupmaterialaccordion"
                    accordionTitle={"smaterialname"}
                    accordionComponent={testGroupMaterialAccordion(TestGroupTestMaterial)}
                    inputParam={{ masterData: props.masterData, userinfo: props.userInfo }}
                    accordionClick={props.getTestGroupMaterial}
                    accordionPrimaryKey={"ntestgrouptestmaterialcode"}
                    accordionObjectName={"testgrouptestmaterial"}
                    selectedKey={selectedMaterial ? selectedMaterial.ntestgrouptestmaterialcode : 0}
                />
                </div>
                </PerfectScrollbar>
            }
        </>
    );
};

export default injectIntl(TestGroupMaterialTab);