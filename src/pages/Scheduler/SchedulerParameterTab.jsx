import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import ResultGrid from '../resultgrid/ResultGrid';

class SchedulerParameterTab extends React.Component {

    render() {
       
        const extractedColumnList = [];        

        extractedColumnList.push(
            { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "175px" },
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "175px" },
            { "idsName": "IDS_PARAMETERTYPE", "dataField": "sparametertypename", "width": "175px" });
   

        // if (this.props.masterData["RegSubTypeValue"] && this.props.masterData["RegSubTypeValue"].nneedsubsample) {
        //     extractedColumnList.push({ "idsName":this.props.genericLabel ? this.props.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]: "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "155px" });
        // }
        // extractedColumnList.push({ "idsName":this.props.genericLabel ? this.props.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]: "IDS_ARNUMBER", "dataField": "sarno", "width": "155px" });
      
       
        
        return (
            <>
                <Row noGutters={"true"}>
                    <Col md={12}>
                        <ResultGrid
                            primaryKeyField={"nschedulertestparametercode"}
                            data={this.props.masterData.SchedulerConfigurationParameter}
                            dataResult={process(this.props.masterData.SchedulerConfigurationParameter || [], this.props.dataState)}
                            dataState={this.props.dataState}
                            dataStateChange={this.props.dataStateChange}
                             expandField=""
                            extractedColumnList={extractedColumnList}
                            userInfo={this.props.userInfo}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            inputParam={this.props.inputParam}
                            pageable={true}
                            isComponent={true}
                            isActionRequired={false}
                            isToolBarRequired={false}
                            scrollable={"scrollable"}
                            methodUrl={"Status"}
                           
                            selectedId={null}
                        
                        />
                    </Col>
                </Row>
            </>
        )
    }
}
export default injectIntl(SchedulerParameterTab);