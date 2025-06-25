import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
//import { Col, Row } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import { injectIntl,FormattedMessage } from 'react-intl';
import { Col} from 'react-bootstrap';
const AddSubCodedResult = (props) => {
    const { needCodedResult, needActualResult, grade } = props.parameterData;
    const testMethodColumnList = [
        {"idsName":"IDS_METHOD","dataField":"smethodname","width":"200px"}    ];
    return (
        <Col md="12">
            <FormInput
                name="ssubcodedresult"
                label={props.intl.formatMessage({ id: "IDS_SUBCODEDRESULT" })}
                type="text"
                required={!needCodedResult}
                isMandatory={needCodedResult ? "" : "*"}
                isDisabled={needCodedResult}
                value={props.selectedRecord && props.selectedRecord["ssubcodedresult"] ? props.selectedRecord["ssubcodedresult"] : ""}
                placeholder={props.intl.formatMessage({ id: "IDS_SUBCODEDRESULT" })}
                //onChange = { (event) => props.onInputOnChange(event, 1) }
                onChange={(event) => props.onInputOnChange(event, 1)}
                maxLength={100}
            />
        </Col>




    );
}

export default injectIntl(AddSubCodedResult);