import React from 'react';
import moment from 'moment';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import { formatDate, parseDate } from 'react-day-picker/moment';

export default class DatePicker extends React.Component {
    constructor(props) {
        let startDate = new Date();
        startDate.setDate(startDate.getDate()-3);
        super(props);
        this.dateChanged = props.dateChanged;
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.state = {
            from: startDate,
            to: new Date(),
        };
    }

    showFromMonth() {
        const { from, to } = this.state;
        if (!from) {
            return;
        }
        if (moment(to).diff(moment(from), 'months') < 2) {
            this.to.getDayPicker().showMonth(from);
        }
    }

    handleFromChange(from) {
        // Change the from date and focus the "to" input field
        this.setState({ from });
        if(this.dateChanged){
            this.dateChanged(from, this.state.to);
        }
    }

    handleToChange(to) {
        this.setState({ to }, this.showFromMonth);
        if(this.dateChanged){
            this.dateChanged(this.state.from, to);
        }
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        return (
            <div className="InputFromTo">
                <DayPickerInput
                    value={from}
                    placeholder="From"
                    format="LL"
                    formatDate={formatDate}
                    parseDate={parseDate}
                    dayPickerProps={{
                        selectedDays: [from, { from, to }],
                        disabledDays: { after: to },
                        toMonth: to,
                        modifiers,
                        numberOfMonths: 2,
                        onDayClick: () => this.to.getInput().focus(),
                    }}
                    onDayChange={this.handleFromChange}
                />{' '}
                —{' '}
                <span className="InputFromTo-to">
          <DayPickerInput
              ref={el => (this.to = el)}
              value={to}
              placeholder="To"
              format="LL"
              formatDate={formatDate}
              parseDate={parseDate}
              dayPickerProps={{
                  selectedDays: [from, { from, to }],
                  disabledDays: { before: from },
                  modifiers,
                  month: from,
                  fromMonth: from,
                  numberOfMonths: 2,
              }}
              onDayChange={this.handleToChange}
          />
        </span>
            </div>
        );
    }
}