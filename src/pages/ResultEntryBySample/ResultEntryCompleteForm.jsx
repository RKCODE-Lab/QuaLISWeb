import React from 'react';
import {injectIntl } from 'react-intl';
import { intl } from '../../components/App';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {updateStore} from '../../actions';
import { connect } from 'react-redux';

class ResultEntryCompleteForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedRecordCompleteForm: this.props.selectedRecordCompleteForm,     
            Users: this.props.Users,   
            loading: false
        }

    }
    onComboChange = (comboData) => {
        let selectedRecordCompleteForm = this.state.selectedRecordCompleteForm || {};
        if (comboData) {
            selectedRecordCompleteForm['nusercode'] = comboData;
        } else {
            selectedRecordCompleteForm['nusercode'] = []
        }
        //Sync Child Component data with Parent Component     
        this.props.onChildDataChange(selectedRecordCompleteForm);
        this.setState({ selectedRecordCompleteForm });
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { isCompleteInitialRender: false }
        }
        this.props.updateStore(updateInfo);
    }

    componentDidUpdate(previousProps) {
        if (this.props.selectedRecordCompleteForm !== previousProps.selectedRecordCompleteForm) {
            this.setState({ selectedRecordCompleteForm: this.props.selectedRecordCompleteForm });
        }
        if (this.props.Users !== previousProps.Users) {
            this.setState({ Users: this.props.Users });
        }
        
    }

    render() {

        return (
            <>
                <FormSelectSearch
                    formLabel={intl.formatMessage({ id: "IDS_USER" })}
                    placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isSearchable={false}
                    name={"nusercode"}
                    isDisabled={false}
                    isMandatory={true}
                    options={this.state.Users || []}
                    optionId='nusercode'
                    optionValue='susername'
                    value={this.state.selectedRecordCompleteForm ? this.state.selectedRecordCompleteForm.nusercode : ""}
                    showOption={true}
                    required={true}
                    onChange={(event) => this.onComboChange(event, 'nusercode')}
                    isMulti={false}
                    closeMenuOnSelect={true}
                />                         
                    
            </>
        )
    }

}
export default connect(null, {updateStore})(injectIntl(ResultEntryCompleteForm));








