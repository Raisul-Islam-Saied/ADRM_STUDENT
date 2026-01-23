function isBefore(givenDateAndTime) {
    // Parse the given date and time
    const [date, time] = givenDateAndTime.split(" ");
    const [day, month, year] = date.split("/");
    const [hours, minutes] = time.split(":");

    // Create a Date object for the given date and time
    const givenDateTime = new Date(year, month - 1, day, hours, minutes);

    // Get the current date and time
    const now = new Date();

    // Check if the current date and time is before the given date and time
    if (now < givenDateTime) {
        return false;
    } else {
        return true;
    }
}

// Example usage
console.log(isBefore("9/3/2023 24:50")); // true or false