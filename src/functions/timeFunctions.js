import {parse, format} from "date-fns";

export const parseUserInputToDate = (userInput) => {
    try {
        return parse(userInput, "dd-MM-yyyy", new Date());
    } catch (error) {
        console.error("Invalid date format", error);
        return null;
    }
};

export const formatDateToUserInput = (date) => {
    try {
        return format(date, "dd-MM-yyyy");
    } catch (error) {
        console.error("Invalid date object", error);
        return null;
    }
};