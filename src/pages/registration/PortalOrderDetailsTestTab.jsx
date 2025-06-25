import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Nav, Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
class  PortalOrderDetailsTestTab extends React.Component{
    constructor(props) {
    super(props);
    this.state = ({
        testDataState: { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 },
    });
}
    render(){
        const portalTestColumnList = [
            {"idsName":"IDS_TESTCATEGORY","dataField":"stestcategoryname","width":"150px"},
            {"idsName":"IDS_TEST","dataField":"stestname","width":"150px"}
        ];
    return (
        <>
        
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                       primaryKeyField = "nportalordertestcode"
                       data = {this.props.PortalOrderTest}
                       dataResult = {process(this.props.PortalOrderTest||[],this.state.testDataState)}
                       dataState = {this.state.testDataState}
                       dataStateChange = {(event) => this.setState({testDataState: event.dataState })}
                       extractedColumnList = {portalTestColumnList}
                       inputParam = {this.props.inputParam}
                       userInfo = {this.props.userInfo}
                       pageable={true}
                       scrollable={'scrollable'}
                       
                    >
                    </DataGrid>
                </Col>
            </Row>
        </>
    );
}
componentDidUpdate(previousProps) {
    if (this.props.PortalOrderTest !== previousProps.PortalOrderTest) {
        let { testDataState} = this.state;
        if (this.props.dataState=== undefined) {
            testDataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
        }
        this.setState({ testDataState });
    }

}
};

export default injectIntl(PortalOrderDetailsTestTab);