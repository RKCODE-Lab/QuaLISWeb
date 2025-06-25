import { process } from '@progress/kendo-data-query';
import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
class TestWiseMyJobsSampleInfoGrid extends React.Component{
   

    render(){
        let sample = this.props.selectedSample;

        let data = sample && sample.filter(
            (person, index) => index === sample.findIndex(
              other => person.npreregno === other.npreregno
              
            ));
        return(
            <>
            <Row noGutters={"true"}>
                <Col md={12}>
                    <DataGrid
                        primaryKeyField={"npreregno"}
                        data={this.props.selectedSample}
                        //dataResult={process(this.props.selectedSample||[],this.props.dataState)}
                        dataResult={process(data||[],this.props.dataState)}
                        dataState={this.props.dataState}
                        dataStateChange={this.props.dataStateChange}
                        expandField="expanded"
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
                    />
                </Col>
            </Row>
        </>
        )
    }
}
export default injectIntl(TestWiseMyJobsSampleInfoGrid);