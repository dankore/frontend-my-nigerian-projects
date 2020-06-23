module.exports = {
  formatPostedAndUpdatedDate: function (dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    if (month < 10) {
      month = '0' + month;
    }

    return `${year}-${month}-${day}`;
  },
  daysRemaining: function (dateString) {
    /**
     * @param dateString comes in this format e.g yyyy-mm-dd
     * @returns e.g 2
     */
    // TIME DIFF IN DAYS
    const pastOrFutureDate = new Date(dateString);
    const todaysDate = new Date();
    const timeDifferenceInSecs = pastOrFutureDate - todaysDate;

    let days /** TIME DIFFERENCE IN DAYS */ = Math.ceil(timeDifferenceInSecs / (24 * 60 * 60 * 1000));
    return days;
  },
  dateFormatted: function (dateString) {
    /**
     * @param dateString comes in this format e.g yyyy-mm-dd
     * @returns e.g 06/30/2020
     */

    if (dateString) {
      const datePartsArray = dateString.split('-');
      return `${datePartsArray[1]}/${datePartsArray[2]}/${datePartsArray[0]}`;
    }
  },
  dateFormattedUserCreationDate: function (dateString) {
    if (dateString && typeof dateString == 'string') {
      let month = new Array();
      month[1] = 'January';
      month[2] = 'February';
      month[3] = 'March';
      month[4] = 'April';
      month[5] = 'May';
      month[6] = 'June';
      month[7] = 'July';
      month[8] = 'August';
      month[9] = 'September';
      month[10] = 'October';
      month[11] = 'November';
      month[12] = 'December';

      /**
       * @param dateString is in this format e.g yyyy-mm-dd
       * @returns e.g May 29, 2020
       */

      const datePartsArray = dateString.split('-');
      // the plus(+) sign converts string to number, gets rid of the trailing zero in the month
      return `${month[+datePartsArray[1]]} ${datePartsArray[2]}, ${datePartsArray[0]}`;
    }
  },
};
