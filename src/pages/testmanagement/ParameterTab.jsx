import React from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component';
import ParameterTabAccordion from './ParameterTabAccordion';
// import ReactTooltip from 'react-tooltip';

const ParameterTab = (props) => {
    const addParameterId = props.controlMap.has("AddParameter") && props.controlMap.get("AddParameter").ncontrolcode;

    function testParameterAccordion(TestParameter) {
        const accordionMap = new Map();
        TestParameter.map((testParameter) =>
            accordionMap.set(testParameter.ntestparametercode,
                <ParameterTabAccordion
                    testParameter={testParameter}
                    userRoleControlRights={props.userRoleControlRights}
                    controlMap={props.controlMap}
                    userInfo={props.userInfo}
                    masterData={props.masterData}
                    selectedParameter={props.masterData.selectedParameter}
                    addParameter={props.addParameter}
                    deleteAction={props.deleteAction}
                    ConfirmDelete={props.ConfirmDelete}
                    addCodedResult={props.addCodedResult}
                    addSubCodedResult={props.addSubCodedResult}
                    addFormula={props.addFormula}
                    openPredefinedModal={props.openPredefinedModal}
                    onSwitchChange={props.onSwitchChange}
                    addParameterSpecification={props.addParameterSpecification}
                    testFormula={props.masterData.TestFormula}
                    testParameterNumeric={props.masterData.TestParameterNumeric}
                    testPredefinedParameter={props.masterData.TestPredefinedParameter}
                    SelectedTest={props.masterData.SelectedTest}
                    addClinicalSpecification={props.addClinicalSpecification}
                    dataStateChange={props.dataStateChange}
                    dataState={props.dataState}
                    EditSpecDetails={props.EditSpecDetails}
                    deleteRecord={props.deleteRecord}

                />)
        );
        return accordionMap;
    }
    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                    <Nav.Link name="addtestparameter" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addParameterId) === -1}
                        onClick={() => props.addParameter("create", {}, props.userInfo, addParameterId)}>
                        <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id="IDS_ADDPARAMETER" defaultMessage="Add Parameter" />
                    </Nav.Link>
                </div>
            </div>
            {props.TestParameter && props.TestParameter.length > 0 &&
                <CustomAccordion
                    key="parameteraccordion"
                    accordionTitle={"sparametername"}
                    accordionComponent={testParameterAccordion(props.TestParameter)}
                    inputParam={{ masterData: props.masterData, userInfo: props.userInfo, nFlag: 5 }}
                    accordionClick={props.getTestDetails}
                    accordionPrimaryKey={"ntestparametercode"}
                    accordionObjectName={"testParameter"}
                    selectedKey={props.masterData.selectedParameter ? props.masterData.selectedParameter.ntestparametercode : 0}
                />
            }
        </>
    );
};

export default ParameterTab;