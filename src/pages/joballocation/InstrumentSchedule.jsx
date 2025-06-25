import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import SlideOutModal from "../../components/slide-out-modal/SlideOutModal";
import AnalystCalenderBasedOnUser from './AnalystCalenderBasedOnUser'
import AlertModal from "../dynamicpreregdesign/AlertModal";
import { Dialog } from '@progress/kendo-react-dialogs';
import { SchedulerForm } from '@progress/kendo-react-scheduler';
import { CustomDialog } from './custom-dialog';
import { faDoorClosed } from "@fortawesome/free-solid-svg-icons";

class Instrument extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slideOutOpen: false

        }
    }


    onCalendarClick = () => {
        this.setState({ slideOutOpen: !this.state.slideOutOpen })
    }

    render() {
        return (
            <>
                <div onClick={this.onCalendarClick}>
                    <FontAwesomeIcon icon={faCalendar} />
                </div>
                {this.state.slideOutOpen &&
                    <div onClick={this.onCalendarClick}>
                        <FontAwesomeIcon icon={faDoorClosed} />
                    </div>
                }
                {this.state.slideOutOpen &&
                    <SchedulerForm {...this.props} editor={AnalystCalenderBasedOnUser} dialog={CustomDialog} />

                }
            </>
        )
    }


}
export default Instrument;