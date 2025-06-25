import React from "react";
import { injectIntl } from "react-intl";
import { Row, Col } from "react-bootstrap";
import DateTimePicker from "../../components/date-time-picker/date-time-picker.component";
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const FlexTransactionFilter = (props) => {
  return (
    <Row>
      <Col md={12}>
        <Row>
          <Col md={6}>
            <DateTimePicker
              name={"fromdate"}
              label={props.intl.formatMessage({ id: "IDS_FROM" })}
              className="form-control"
              placeholderText="Select date.."
              selected={props.selectedRecord["fromdate"] || props.fromDate}
              dateFormat={props.userInfo.ssitedate}
              isClearable={false}
              onChange={(date) => props.handleDateChange("fromdate", date)}
              value={props.selectedRecord["fromdate"] || props.fromDate}
            // minDate={props.selectedRecord["nauditactionfiltercode"].value===1?props.selectedRecord["fromdate"] && props.selectedRecord["fromdate"].setFullYear(props.selectedRecord["todate"].getFullYear()+1) 
            // || props.fromDate.setFullYear(props.toDate.getFullYear()-1) :""}
            // maxDate={props.selectedRecord["nauditactionfiltercode"].value===1?props.selectedRecord["todate"] || props.toDate:""}
            //maxDate={new Date()}
            />
          </Col>
          <Col md={6}>
            <DateTimePicker
              name={"todate"}
              label={props.intl.formatMessage({ id: "IDS_TO" })}
              className="form-control"
              placeholderText="Select date.."
              selected={props.selectedRecord["todate"] || props.toDate}
              dateFormat={props.userInfo.ssitedate}
              isClearable={false}
              onChange={(date) => props.handleDateChange("todate", date)}
              value={props.selectedRecord["todate"] || props.toDate}
            // maxDate={new Date()}
            />
          </Col>
        </Row>

        {/* <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_RECORDTODISPLAY" })}
                    isSearchable={true}
                    name={"ntransfiltercode"}
                    isDisabled={false}
                    placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}      
                    isMandatory={false}
                    showOption={true}
                    //  menuPosition="fixed"
                    options={props.transfilterViewType}
                    optionId='ntransdetailsfiltercode'
                    optionValue='sdisplayname'
                    value={props.selectedRecord["ntransfiltercode"] ? props.selectedRecord["ntransfiltercode"] : ""}
                    onChange={value => props.onComboChange(value, "ntransfiltercode")}
                    alphabeticalSort={true}
                >
                </FormSelectSearch> */}

        <FormSelectSearch
          formLabel={props.intl.formatMessage({ id: "IDS_VIEWPERIOD" })}
          isSearchable={true}
          name={"nauditactionfiltercode"}
          isDisabled={false}
          placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
          isMandatory={false}
          showOption={true}
          //  menuPosition="fixed"
          options={props.filterViewType}
          optionId='nauditactionfiltercode'
          optionValue='sauditactionfiltername'
          value={props.selectedRecord["nauditactionfiltercode"] ? props.selectedRecord["nauditactionfiltercode"] : ""}
          onChange={value => props.onComboChange(value, "nauditactionfiltercode")}
          alphabeticalSort={true}
        >
        </FormSelectSearch>
      </Col>
    </Row>
  );
};
export default injectIntl(FlexTransactionFilter);