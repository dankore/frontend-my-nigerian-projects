module.exports = {
    dateFormatted: function(dateString){
    /**
     * @param dateString comes in this format e.g yyyy-mm-dd
     * @returns format 06/30/2020
     */

    if (dateString) {
      const datePartsArray = dateString.split('-');
      return `${datePartsArray[1]}/${datePartsArray[2]}/${datePartsArray[0]}`;
    }
  },
  dateFormattedUserCreationDate:  function(dateString){
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
       * @returns format May 29, 2020
       */

      const datePartsArray = dateString.split('-');
      // the plus(+) sign converts string to number, gets rid of the trailing zero in the month
      return `${month[+datePartsArray[1]]} ${datePartsArray[2]}, ${datePartsArray[0]}`;
    }
  }
}