import React from "react";
import { injectIntl } from "react-intl";
import { Row, Col } from "react-bootstrap";
import DateTimePicker from "../../components/date-time-picker/date-time-picker.component";

const GoodsInFilter = (props) => {
  return (
    <Row>
      <Col md={12}>
        <Row>
          <Col md={6}>
            <DateTimePicker
              name={"fromdate"}
              label={props.intl.formatMessage({ id: "IDS_FROM" })}
              className="form-control"
              placeholderText={props.intl.formatMessage({ id:"IDS_FROM"})}
              selected={props.fromDate}
              value={props.fromDate}
              dateFormat={props.userInfo.ssitedate}            
              isClearable={false}
              onChange={(date) => props.handleFilterDateChange("fromDate", date)}
            />
          </Col>
          <Col md={6}>
            <DateTimePicker
              name={"todate"}
              label={props.intl.formatMessage({ id: "IDS_TO" })}
              className="form-control"
              placeholderText={props.intl.formatMessage({ id:"IDS_TO"})}
              selected={props.toDate}
              value={ props.toDate}
              dateFormat={props.userInfo.ssitedate}
              isClearable={false}
              onChange={(date) => props.handleFilterDateChange("toDate", date)}              
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default injectIntl(GoodsInFilter);