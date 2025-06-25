import React from "react";
import { injectIntl } from "react-intl";
import { Row, Col } from "react-bootstrap";
import DateTimePicker from "../../components/date-time-picker/date-time-picker.component";

const CertificateGenerationFilter = (props) => {
  return (
    <Row>
      <Col md={12}>
        <Row>
          <Col md={6}>
            <DateTimePicker
              name={"fromdate"}
              //portalId={"fromdate"}
              label={props.intl.formatMessage({ id: "IDS_FROM" })}
              className="form-control"
              placeholderText="Select date.."
              selected={props.selectedRecord["fromdate"] || props.fromDate}
              //dateFormat={"dd/MM/yyyy"}
              dateFormat={props.userInfo.ssitedate}            
              isClearable={false}
              onChange={(date) => props.handleDateChange("fromdate", date)}
              value={props.selectedRecord["fromdate"] || props.fromDate}
            />
          </Col>
          <Col md={6}>
            <DateTimePicker
              name={"todate"}
             // portalId={"todate"}
              label={props.intl.formatMessage({ id: "IDS_TO" })}
              className="form-control"
              placeholderText="Select date.."
              selected={props.selectedRecord["todate"] || props.toDate}
              //dateFormat={"dd/MM/yyyy"}
              dateFormat={props.userInfo.ssitedate}
              isClearable={false}
              onChange={(date) => props.handleDateChange("todate", date)}              
              value={props.selectedRecord["todate"] || props.toDate}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default injectIntl(CertificateGenerationFilter);