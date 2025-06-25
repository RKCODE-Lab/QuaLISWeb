import React from 'react';
import { Row, Col ,FormGroup } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import { ReadOnlyText } from '../../components/App.styles';

import { injectIntl } from 'react-intl';


const AddGrossQuotation = (props) => {
    return (
        <>
        <Row className='justify-content-end pt-2'>
            <Col md={4}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_TOTALGROSSAMOUNT" })}
                    name={"ntotalgrossamount"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TOTALGROSSAMOUNT" })}
                    value={props.QuotationGrossAmount ? parseFloat((props.QuotationGrossAmount[0]["ntotalgrossamount"]).toFixed(2)) : ""}
                    isMandatory={false}
                    required={true}
                    maxLength={"100"}
                    isDisabled={true}
                />
            </Col>
        </Row>
        <Row>
            <Col md={4}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_DISCOUNTBAND" })}
                    isSearchable={true}
                    name={"ndiscountbandcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    isClearable={true}
                    options={props.DiscountBand}
                    value={props.selectedRecord["ndiscountbandcode"] || ""}
                    defaultValue={props.selectedRecord["ndiscountbandcode"]}
                    onChange={(event) => props.onComboChange(event, "ndiscountbandcode", 3)}
                    //    onBlur={() => props.onnetDiscountEvent(props.selectedRecord)}
                    closeMenuOnSelect={true}
                    
                >
                </FormSelectSearch>
            </Col>
            <Col md={4}>
                <FormInput
                        label={props.intl.formatMessage({ id: "IDS_AMOUNT" })}
                        name={"namount"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        // value={props.selectedRecord ? props.selectedRecord["namount"] : ""}
                    //   value={props.selectedRecord.ndiscountbandcode ? props.selectedRecord.ndiscountbandcode.item["namount"] : ""}
                        value={props.selectedRecord.ndiscountpercentage ? props.selectedRecord.ndiscountpercentage : 0}
                        isMandatory={false}
                        isDisabled={true}
                        required={true}
                        maxLength={"100"}
                    />
            </Col>  
            <Col md={4}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_DISCOUNTAMOUNT" })}
                    name={"ndiscountbandcode"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DISCOUNTAMOUNT" })}
                    value={ parseFloat(props.DiscountAmount.toFixed(2))}
                    isMandatory={false}
                    required={true}
                    maxLength={"100"}
                    isDisabled={true}
                />
            </Col>
        </Row>
        <Row>
            <Col md={4}>
                <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_VATBAND" })}
                        isSearchable={true}
                        name={"nvatbandcode"}
                        isDisabled={false}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={false}
                        isClearable={true}
                        options={props.VATBand}
                        showOption={props.isMulti}
                        value={props.selectedRecord["nvatbandcode"] || ""}
                    //     value={props.SelectedClient? { "label": props.SelectedClient.sclientname, "value": props.SelectedClient.nclientcode } : ""}
                        defaultValue={props.selectedRecord["nvatbandcode"]}
                        onChange={(event) => props.onComboChange(event, "nvatbandcode", 3)}
                        closeMenuOnSelect={true}
                    >
                    </FormSelectSearch>
            </Col>
            <Col md={4}>
                  <FormInput
                        label={props.intl.formatMessage({ id: "IDS_AMOUNT" })}
                        name={"namount"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        // value={props.selectedRecord ? props.selectedRecord["namount"] : ""}
                    //       value={props.selectedRecord.nvatbandcode ? props.selectedRecord.nvatbandcode.item["namount"] : ""}
                        value={props.selectedRecord.nvatpercentage ? props.selectedRecord.nvatpercentage : 0}
                        isMandatory={false}
                        isDisabled={true}
                        required={true}
                        maxLength={"100"}
                    />
            </Col>

            <Col md={4}>
                <FormInput
                        label={props.intl.formatMessage({ id: "IDS_VATAMOUNT" })}
                        name={"nvatbandcode"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_VATAMOUNT" })}
                        value={parseFloat(props.VatAmount.toFixed(2))}
                        isMandatory={false}
                        required={true}
                        maxLength={"100"}
                        isDisabled={true}
                    />
            </Col>
        </Row>
        <Row className='justify-content-end'>                
            <Col md={4}>
                <FormInput
                        label={props.intl.formatMessage({ id: "IDS_TOTALNETAMOUNT" })}
                        name={"ntotalnetamount"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_TOTALNETAMOUNT" })}
                        value={parseFloat((props.TotalNetAmount).toFixed(2))}
                        isMandatory={false}
                        required={true}
                        maxLength={"100"}
                        isDisabled={true}
                    />
            </Col>                   
        </Row>
        </>
    );

}




export default injectIntl(AddGrossQuotation);