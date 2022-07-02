const core = require('@actions/core');

try {
  const sheetData = core.getInput('sheet-data');
  const purpose = core.getInput('purpose');

  // Date to match will be todays date for birthday wish and 1 week laters date for reminder
  // Get date to match in the required format
  var dateToMatch = new Date();
  if (purpose === "reminder") {
    dateToMatch = new Date(dateToMatch.getFullYear(), dateToMatch.getMonth(), dateToMatch.getDate()+7);
  }
  const dd = String(dateToMatch.getDate()).padStart(2, '0');
  const mm = String(dateToMatch.getMonth() + 1).padStart(2, '0'); //January is 0!
  dateToMatch = dd + '/' + mm;
  console.log(dateToMatch);

  const datesList = JSON.parse(sheetData).results[0].result.rawData;

  console.log(datesList);

  // Get entries of festivals with todays date
  itemList = datesList.filter(item => {
    console.log (item[3] + ' ' + dateToMatch)
    if (purpose === "reminder") {
      return item[3] == dateToMatch
    } else {
      return (item[3] == dateToMatch) && (item[1] != "N")
    }
  });

  // Get messages to post on slack channel
  var messageList = [];
  var userString = "";
  for (let i=0; i<itemList.length; i++) {
    if (i!=0 && itemList.length > 1) {
      if (i == itemList.length-1) {
        userString += " and ";
      } else {
        userString += ", ";
      }
    }
    userString += "@" + itemList[i][2];
  }
  if (itemList.length > 0) {
    if (purpose === "reminder") {
      messageList.push("Upcoming birthdays a week from today - " + userString + " ! :cake-intensifies::meow-celebration:");
    } else {
      messageList.push("It’s party time! Happy Birthday to " + userString + " ! :cake-intensifies::meow-celebration:");
    }
  }
  console.log(messageList);

  // Set messageList as an output to be used in other workflow steps
  core.setOutput("messageList", messageList);
} catch (error) {
  core.setFailed(error.message);
}
