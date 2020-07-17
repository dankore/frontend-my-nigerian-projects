module.exports = {
   bidItemsTotal: function (array) {
    return array.reduce((total, currentElem) => {
      const currentTotal = +currentElem.quantity * +currentElem.price_per_item;
      return total + currentTotal;
    }, 0);
  },
  handleUploadImage: async function (image, type) {
    const data = new FormData();
    data.append('file', image);

    switch (type) {
      case 'profilePicture': {
        data.append('upload_preset', 'profile-pictures');

        const res = await fetch(`https://api.cloudinary.com/v1_1/my-nigerian-projects/image/upload`, {
          method: 'POST',
          body: data,
        });

        const file = await res.json();

        return file.secure_url;
      }
      case 'project': {
        data.append('upload_preset', 'projects-files');

        const res = await fetch(`https://api.cloudinary.com/v1_1/my-nigerian-projects/image/upload`, {
          method: 'POST',
          body: data,
        });

        const file = await res.json();

        return file.secure_url;
      }
      case 'bid': {
        data.append('upload_preset', 'bids-files');

        const res = await fetch(`https://api.cloudinary.com/v1_1/my-nigerian-projects/image/upload`, {
          method: 'POST',
          body: data,
        });

        const file = await res.json();

        return file.secure_url;
      }
    }
  },
  removeDupsInObject_Id: function (arrayOfObjects) {
    let checker = [],
      result = [];

    arrayOfObjects.map(object => {
      if (!checker.includes(object.author._id)) {
        checker.push(object.author._id);
        result.push(object);
      }
    });

    return result.reverse();
  },
  daysRemaining: function (dateString) {
    if (dateString) {
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
    }
  },

  dateFormatted_Like_This_May_29_2020: function (dateString) {
    if (dateString && typeof dateString == 'string') {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const monthNumber = date.getUTCMonth() + 1;
      const day = date.getUTCDate();

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
       * @param dateString is in this format e.g yyyy-mm-dd or otherwise
       * @returns e.g May 29, 2020
       */

      return `${month[+monthNumber]} ${day}, ${year}`;
    }
  },

  formatMinDate: function () {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  },

  // END OF MODULE
};
