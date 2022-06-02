const core = require('@actions/core');
const fs = require('fs');

try {
  const fileName = core.getInput('file-name');
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

  // Get the JSON file with the dates and messages
  var file = fs.readFileSync(fileName);
  file = JSON.parse(file);
  const datesList = file.dates;

  // Get entries of festivals with todays date
  itemList = datesList.filter(item =>
    item.date == dateToMatch);

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
    userString += "@" + itemList[i].name;
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
