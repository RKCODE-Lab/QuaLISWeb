import React from "react";
import { Row, Col } from "react-bootstrap";
import FormSelectSearch from "../../../components/form-select-search/form-select-search.component";
import { injectIntl } from "react-intl";
import DateTimePicker from "../../../components/date-time-picker/date-time-picker.component";

const TechniqueFilter = (props) => {
  return (
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
          name={"ntechniquecode"}
          formLabel={props.intl.formatMessage({ id: "IDS_TECHNIQUE" })}
          //menuPosition="fixed"
          isSearchable={true}
          placeholder="Please Select..."
          options={props.filterTechnique}
          optionId="ntechniquecode"
          optionValue="stechniquename"
          value={props.nfilterTechnique ? props.nfilterTechnique : ""}
          onChange={(value) => props.onComboChange(value, "ntechniquecode", 3)}
        ></FormSelectSearch>
      </Col>
    </Row>
  );
};

export default injectIntl(TechniqueFilter);
