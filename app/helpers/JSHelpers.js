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
  }
}