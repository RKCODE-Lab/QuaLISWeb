import { process } from '@progress/kendo-data-query';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
// import ColumnMenu from '../../components/data-grid/ColumnMenu';
import { transactionStatus } from '../../components/Enumeration';
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import {  LocalizationProvider } from '@progress/kendo-react-intl';

class EditApprovalParameter extends React.Component {
    constructor(props) {
        super(props)
        //let group=this.props.nsubsampleneed===transactionStatus.NO?[{ field: 'sarno' },{ field: 'stestsynonym' }]: [{ field: 'ssamplearno' },{ field: 'stestsynonym' }]
        const group = this.props.nsubsampleneed === transactionStatus.NO ? [{ field: 'sarno' }] : [{ field: 'ssamplearno' }]
        this.state = {
            dataState: { skip: 0, take: 10, group },
            isExpanded: false,
            data: process(this.props.ApprovalParamEdit, { skip: 0, take: 10, group })
        }
    }
    dataStateChange = (event) => {
        this.setState({
            data: process(this.props.ApprovalParamEdit, event.dataState),
            dataState: event.dataState
        });
    }
    expandChange1 = (event) => {
        const expandField = event.target.props.expandField || "";
        event.dataItem[expandField] = event.value;
        this.setState({
            data: process(this.props.ApprovalParamEdit, this.state.dataState),
            dataState: this.state.dataState
        });
    };


    expandChange = (event) => {
        // const data = process(this.props.ApprovalParamEdit,this.state.dataState);
        // console.log("data:", data, event);
        const isExpanded =
            event.dataItem.expanded === undefined ? event.dataItem.aggregates : event.dataItem.expanded;
        // event.dataItem.aggregates && event.dataItem.aggregates.length > 0 ? event.dataItem.aggregates 
        // :true
        // : event.dataItem.expanded;

        if (this.props.hasChild && event.value === true) {
            event.dataItem.expanded = !isExpanded;
            this.props.handleExpandChange(event, this.props.dataState)
        }
        else {
            event.dataItem.expanded = event.value;

            // this.setState({
            //     isExpanded,
            //     data: process(this.props.ApprovalParamEdit, this.state.dataState),
            //     dataState: this.state.dataState
            // });
            this.setState({
                isExpanded
            });

        }
    }
    // columnProps(field) {

    //     return {
    //         field: field,
    //         columnMenu: ColumnMenu,
    //         headerClassName: this.isColumnActive(field, this.state.dataState) ? 'active' : ''
    //     };

    // }

    // isColumnActive(field, dataState) {
    //     return GridColumnMenuFilter.active(field, dataState.filter)
    // }
    render() {
        return (
            <AtTableWrap className="at-list-table" actionColWidth={this.props.actionColWidth ? this.props.actionColWidth : "150px"} >
                 <LocalizationProvider language="lang">
                <Row>
                    <Col md={12}>
                        <Grid
                            sortable
                            resizable
                            scrollable={"scrollable"}
                            //groupable={false}
                            onExpandChange={this.expandChange}
                            expandField="expanded"
                            detail={false}
                            pageable={{ buttonCount: 4, pageSizes: true, previousNext: false }}
                            data={this.state.data}
                            {...this.state.dataState}
                            onDataStateChange={this.dataStateChange}
                        >
                            <GridColumn
                                title={this.props.intl.formatMessage({ id: "IDS_PARAMETER" })}
                                // {...this.columnProps("sparametersynonym")}
                                field={"sparametersynonym"}
                            />
                            <GridColumn
                                title={this.props.intl.formatMessage({ id: "IDS_TESTSYNONYM" })}
                                field={"stestsynonym"}
                            />
                            <GridColumn
                                field={"nreportmandatory"}
                                title={this.props.intl.formatMessage({ id: "IDS_REPORTMANDATORY" })}
                                cell={(row) => (
                                    row.rowType === "groupHeader" ? null :
                                        <td>
                                            <CustomSwitch
                                                type="switch"
                                                id={row["dataItem"]["ntransactionresultcode"]}
                                                role="button"
                                                onChange={(event) => this.props.changeMandatory(event, row["dataItem"])}
                                                checked={this.props.selectedRecord[row["dataItem"]["ntransactionresultcode"]] ? this.props.selectedRecord[row["dataItem"]["ntransactionresultcode"]] === transactionStatus.YES ? true : false :
                                                    row["dataItem"]["nreportmandatory"] === transactionStatus.YES ? true : false}
                                                name={row["dataItem"]["nreportmandatory"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                        </td>)}
                            />
                        </Grid>
                    </Col>
                </Row>
                </LocalizationProvider>
            </AtTableWrap>
        );
    }
    componentDidUpdate(previousProps) {
        if (this.props !== previousProps) {
            // let group = this.props.nsubsampleneed === transactionStatus.NO ? [{ field: 'sarno' }] : [{ field: 'ssamplearno' }]

            //let group=this.props.nsubsampleneed===transactionStatus.NO?[{ field: 'sarno' },{ field: 'stestsynonym' }]: [{ field: 'ssamplearno' },{ field: 'stestsynonym' }]
            this.setState({
                data: process(this.props.ApprovalParamEdit, this.state.dataState),
                //dataState: {skip:0,take:10,group}
                dataState: this.state.dataState
            });
        }
    }
}
export default injectIntl(EditApprovalParameter)