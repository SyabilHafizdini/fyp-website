import React, {useState, Fragment} from 'react';
import TextField from '@material-ui/core/TextField';
import { DateTimePicker } from "@material-ui/pickers";


export default function DateTimePickerUi() {   

    const [selectedDate, handleDateChange] = useState(new Date());

    return (
        <Fragment>
            <DateTimePicker
            label="DateTimePicker"
            inputVariant="outlined"
            value={selectedDate}
            onChange={handleDateChange}
            />
        </Fragment>
    );
}