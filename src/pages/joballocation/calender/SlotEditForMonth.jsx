import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SchedulerEditSlot } from '@progress/kendo-react-scheduler';
import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { intl } from "../../../components/App"
import { toast } from 'react-toastify';
import { parseAdjustDate } from './NewJobAlloct';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}


const CustomEditSlotForMonth = (props) => {
    const [formItem, setFormItem] = React.useState(null);
    const handleFormItemChange = React.useCallback(
        (event) => {
            if (event.value) {
                if (event.value.buttonClick) {
                    if (event.value.ntransactionstatus) {
                        if (event.value.ntransactionstatus !== 20) {
                            setFormItem(event.value);
                        } else {
                            toast.info(intl.formatMessage({ id: "IDS_ALREADYALLOTED" }))
                        }

                    } else {
                        setFormItem(event.value);
                    }
                }
            } else {
                setFormItem(event.value);
            }
        },
        []
    );
    return (
        <SchedulerEditSlot
            {...props}
            //  onDoubleClick={ondoubleClick}
            formItem={formItem}
            onFormItemChange={handleFormItemChange}
        >

            {
                (props.Login.personalLeaveRestrict
                    && props.Login.calenderUserHolidays.some(x => parseAdjustDate(x.start) === parseAdjustDate(props.start)))
                    ||
                    (props.Login.holidaydateRestrict
                        && props.Login.calenderPublicHolidays.some(x => parseAdjustDate(x.start) === parseAdjustDate(props.start)))
                    ||
                    (props.Login.commonHolidaydateRestrict
                        && Object.keys(props.Login.calenderCommonHolidays1).some(x =>
                            props.Login.calenderCommonHolidays1[x] === 3 ?
                                new Date(props.start).getDay() === 0 ? x === "nsunday" :
                                    new Date(props.start).getDay() === 1 ? x === "nmonday" :
                                        new Date(props.start).getDay() === 2 ? x === "ntuesday" :
                                            new Date(props.start).getDay() === 3 ? x === "nwednesday" :
                                                new Date(props.start).getDay() === 4 ? x === "nthursday" :
                                                    new Date(props.start).getDay() === 5 ? x === "nfriday" :
                                                        new Date(props.start).getDay() === 6 ? x === "nsaturday" : false
                                : false
                        )) ? "" : props.editable.add &&
                <Button className="btn btn-circle outline-grey nav-link bg-transparent " style={{"padding-bottom": "16px"}} role="button"
                    onClick={(e) => handleFormItemChange({
                        value: {
                            start: props.start,
                            end: props.end, isAllDay: true, buttonClick: true
                        }
                    })}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
            }
            {/* <div className='pt-4'> */}
            {props.children}

            {/* </div> */}

        </SchedulerEditSlot>
    );
};

export default connect(mapStateToProps, {})(CustomEditSlotForMonth);