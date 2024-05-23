import moment from "moment"

export const dateTime2Str = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

export const endDate2Str = (date) => {
    return moment(date).format('MM-DD /HH:mm');
}