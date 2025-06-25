import React from "react";
import { injectIntl } from "react-intl";
import { Row, Col } from "react-bootstrap";
import DateTimePicker from "../../../components/date-time-picker/date-time-picker.component";
import FormSelectSearch from "../../../components/form-select-search/form-select-search.component";

const UserTechniqueViewDateFilter = (props)=> {
    return(
        <Row>
            <Col md={12}>
                <Row>
                    <Col md={6}>
                    <DateTimePicker
                        name={"fromdate"}
                        label={props.intl.formatMessage({ id: "IDS_FROM" })}
                        className="form-control"
                        placeholderText="Select date.."
                        selected={
                            props.selectedRecord["fromdate"] || props.fromDate
                            ? new Date(props.fromDate)
                            : new Date()
                        }
                        dateFormat={props.userInfo.ssitedate}
                        isClearable={false}
                        onChange={(date) => props.handleDateChange("fromdate", date)}
                        value={
                            props.selectedRecord["fromdate"] || props.fromDate
                            ? new Date(props.fromDate)
                            : new Date()
                        }
                    />
                    </Col>
                    <Col md={6}>
                    <DateTimePicker
                        name={"todate"}
                        label={props.intl.formatMessage({ id: "IDS_TO" })}
                        className="form-control"
                        placeholderText="Select date.."
                        selected={
                            props.selectedRecord["todate"] || props.toDate
                            ? new Date(props.toDate)
                            : new Date()
                        }
                        dateFormat={props.userInfo.ssitedate}
                        isClearable={false}
                        onChange={(date) => props.handleDateChange("todate", date)}
                        value={
                            props.selectedRecord["todate"] || props.toDate
                            ? new Date(props.toDate)
                            : new Date()
                        }
                     />  
                     </Col>
                     <Col md={12}>
                     <FormSelectSearch

                        formLabel={props.intl.formatMessage({ id: "IDS_TECHNIQUE" })}
                        isSearchable={true}
                        name={"ntechniquecode"}
                        placeholder="Please Select..."
                        options={props.filterTechnique}
                        optionId='ntechniquecode'
                        optionValue='stechniquename'
                        value={props.selectedRecord["ntechniquecode"] ? props.selectedRecord["ntechniquecode"] : ""}
                        onChange={(event)=> props.onComboChange(event, "ntechniquecode")}

                    
                    ></FormSelectSearch>
                    </Col>

                    <Col md={12}>
                     <FormSelectSearch
                        name={"nusercode"}
                        formLabel={props.intl.formatMessage({ id: "IDS_USERS" })}
                        isSearchable={true}
                        placeholder="Please Select..."
                        options={props.filterUsers}
                        optionId="nusercode"
                        optionValue="susername"
                        value={props.selectedRecord["nusercode"] ? props.selectedRecord["nusercode"] : ""}
                        onChange={(event) => props.onComboChange(event, "nusercode")}
                    ></FormSelectSearch>
                    </Col>    

                </Row>
            </Col>
        </Row>
    )
}
export default injectIntl(UserTechniqueViewDateFilter);