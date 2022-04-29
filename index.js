const core = require('@actions/core');
const fs = require('fs');

try {
  const fileName = core.getInput('file-name');
  // Get todays date in the required format
  var today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  today = dd + '/' + mm;
  console.log(today);

  // Get the JSON file with the dates and messages
  var file = fs.readFileSync(fileName);
  file = JSON.parse(file);
  const datesList = file.dates;

  // Get entries of festivals with todays date
  itemList = datesList.filter(item =>
    item.date == today);

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
    messageList.push("It’s party time! Happy Birthday to " + userString + " ! :cake-intensifies::meow-celebration:");
  }
  console.log(messageList);

  // Set messageList as an output to be used in other workflow steps
  core.setOutput("messageList", messageList);
} catch (error) {
  core.setFailed(error.message);
}
