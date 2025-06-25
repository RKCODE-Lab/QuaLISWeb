import React from 'react';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component'
import { injectIntl } from 'react-intl';
import TestGroupParameterAccordion from './TestGroupParameterAccordion';
import PerfectScrollbar from 'react-perfect-scrollbar';

const TestGroupParameterTab = (props) => {
    //console.log('eeeefff')
   const ClinicalSpecColumns = [//{ "idsName": "IDS_GENDER", "dataField": "sgendername", "width": "150px","fieldType":"groupHeader"},
     { "idsName": "IDS_FROMAGE", "mandatory": true, "dataField": "nfromage", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
     { "idsName": "IDS_PERIOD", "mandatory": true, "dataField": "sfromageperiod", "width": "150px" , "mandatoryLabel":"IDS_SELECT", "controlType": "textbox"},
     { "idsName": "IDS_TOAGE", "mandatory": true, "dataField": "ntoage", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}, 
     { "idsName": "IDS_PERIOD", "mandatory": true, "dataField": "stoageperiod", "width": "150px" , "mandatoryLabel":"IDS_SELECT", "controlType": "textbox"},
     { "idsName": "IDS_HIGHA", "mandatory": true, "dataField": "shigha", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
      { "idsName": "IDS_HIGHB", "mandatory": true, "dataField": "shighb", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
      { "idsName": "IDS_LOWA", "mandatory": true, "dataField": "slowa", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
       { "idsName": "IDS_LOWB", "mandatory": true, "dataField": "slowb", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },

       { "idsName": "IDS_MINLOQ", "mandatory": true, "dataField": "sminloq", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
      { "idsName": "IDS_MAXLOQ", "mandatory": true, "dataField": "smaxloq", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
      { "idsName": "IDS_MINLOD", "mandatory": true, "dataField": "sminlod", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
       { "idsName": "IDS_MAXLOD", "mandatory": true, "dataField": "smaxlod", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
       { "idsName": "IDS_DISREGARDED", "mandatory": true, "dataField": "sdisregard", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },

       { "idsName": "IDS_DEFAULTRESULT", "mandatory": true, "dataField": "sresultvalue", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
       { "idsName": "IDS_GRADE", "mandatory": true, "dataField": "sgradename", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}

    ];
   

      const detailedFieldList = [
        { "dataField": "shigha","idsName": "IDS_HIGHA" , columnSize:"4"},
        { "dataField": "shighb" ,"idsName": "IDS_HIGHB",  columnSize:"4"},
        { "dataField": "slowa", idsName: "IDS_LOWA" , columnSize:"4"},
          { "dataField": "slowb", idsName: "IDS_LOWB", columnSize: "12" },
          { "dataField": "sresultvalue", idsName: "IDS_DEFAULTRESULT", columnSize:"4" }

      
    ];

    const dataState = {
        // skip: 0,
        // take : 5,
        group: [{ field: 'sgendername' }] 
    };
   
      const { TestGroupTestParameter, selectedParameter, TestGroupTestFormula, TestGroupTestNumericParameter,
        TestGroupTestPredefinedParameter, TestGroupTestCharParameter, SelectedSpecification,TestGroupTestClinicalSpec,SelectedNode } = props.masterData;
    function testGroupParameterAccordion(TestGroupParameter) {
        const accordionMap = new Map();
        TestGroupParameter.map((testGroupParameter) =>
            accordionMap.set(testGroupParameter.ntestparametercode,
                <TestGroupParameterAccordion
                    testgrouptestparameter={testGroupParameter}
                    selectedSpecification={SelectedSpecification}
                    selectedNode= { SelectedNode }
                    userRoleControlRights={props.userRoleControlRights}
                    controlMap={props.controlMap}
                    userInfo={props.userInfo}
                    selectedParameter={selectedParameter}
                    addParameter={props.addParameter}
                    deleteAction={props.deleteAction}
                    addCodedResult={props.addCodedResult}
                    addFormula={props.addFormula}
                    onSwitchChange={props.onSwitchChange}
                    addParameterSpecification={props.addParameterSpecification}
                    testGroupTestFormula={TestGroupTestFormula}
                    testGroupTestNumericParameter={TestGroupTestNumericParameter}
                    testGroupTestPredefinedParameter={TestGroupTestPredefinedParameter}
                    testGroupCharParameter={TestGroupTestCharParameter}
                    addTestGroupFormula={props.addTestGroupFormula}
                    filterData={props.filterData}
                    editTestGroupParameter={props.editTestGroupParameter}
                    addTestGroupCodedResult={props.addTestGroupCodedResult}
                    subCodedResultView={props.subCodedResultView}
                    addTestGroupNumericTab={props.addTestGroupNumericTab}
                    viewTestGroupCheckList={props.viewTestGroupCheckList}
                    masterData={props.masterData}
                    extractedColumnList={ClinicalSpecColumns}
                    detailedFieldList={detailedFieldList}
                    testGroupTestClinicalSpec={TestGroupTestClinicalSpec}
                    data={TestGroupTestClinicalSpec || []}
                    //dataState={dataState}
                   
                    optionalData={{ testgroupspecification: SelectedSpecification }}
                    openModal={props.addTestGroupNumericTab}
                    EditSpecDetails={props.EditSpecDetails}
                    DeleteSpecDetails={props.DeleteSpecDetails}
                    hasDynamicColSize={true}
                    dataState={props.dataState}
                dataStateChange={props.dataStateChange}
                />)
        );
        return accordionMap;
    }

    return (
        <>
            {TestGroupTestParameter && TestGroupTestParameter.length > 0 &&
            <PerfectScrollbar>
                <div className='grouped-tab-inner grouped-tab-inner-test-group'>
                <CustomAccordion
                    paneHeight={props.paneHeight}
                    //ALPD-5178 - Parameter Accordion Title set with parameter name instead of parameter synonym
                    key="testgroupparameteraccordion"
                    accordionTitle={"sparametername"}                  
                    accordionComponent={testGroupParameterAccordion(TestGroupTestParameter)}
                    inputParam={{ masterData: props.masterData, userinfo: props.userInfo }}
                    accordionClick={props.getTestGroupParameter}
                    accordionPrimaryKey={"ntestgrouptestparametercode"}
                    accordionObjectName={"testgrouptestparameter"}
                    selectedKey={selectedParameter ? selectedParameter.ntestgrouptestparametercode : 0}
                />
                </div>
                </PerfectScrollbar>
            }
        </>
    );
};

export default injectIntl(TestGroupParameterTab);