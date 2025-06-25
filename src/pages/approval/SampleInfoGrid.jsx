import { process } from '@progress/kendo-data-query';
import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
class SampleInfoGrid extends React.Component{
    render(){
        let viewFileURL={"classUrl":"registration",
        "methodUrl" :"RegistrationFile","screenName":"SampleRegistration"};
        // const detailedFieldList=this.props.detailedFieldList.map(field=>{
        //     return (
        //         {"idsName":field[1],"dataField":field[2],"width":"100px"}
        //     )
        // })
        // const extractedColumnList=this.props.extractedColumnList.map(field=>{
        //     return (
        //         {"idsName":field[1],"dataField":field[2],"width":"200px"}
        //     )
        // })
        return(
            <>
            <Row noGutters={"true"}>
                <Col md={12}>
                    <DataGrid
                        primaryKeyField={this.props.primaryKeyField || "npreregno"}
                        data={this.props.selectedSample}
                        dataResult={process(this.props.selectedSample||[],this.props.dataState)}
                        dataState={this.props.dataState}
                        dataStateChange={this.props.dataStateChange}
                        expandField={this.props.detailedFieldList.length > 0 && this.props.expandField ? this.props.expandField : false}
                        detailedFieldList={this.props.detailedFieldList}
                        extractedColumnList={this.props.extractedColumnList}
                        userInfo={this.props.userInfo}
                        controlMap={new Map()}
                        userRoleControlRights={{}}
                        inputParam={this.props.inputParam}
                        pageable={true}
                        isActionRequired={false}
                        isToolBarRequired={false}
                        scrollable={"scrollable"}
                        gridHeight={"500px"}
                        jsonField={this.props.jsonField}
                        viewFileURL={viewFileURL}
                    />
                </Col>
            </Row>
        </>
        )
    }
}
export default injectIntl(SampleInfoGrid);