const fs = require("fs");
const readExcel = require("read-excel-file/node");

readExcel("./ITSMData.xlsx").then((data) => {
  const json = [];
  let isFirstRow = true;
  for (i in data) {
    if (isFirstRow) {
      isFirstRow = false;
      continue;
    }
    const [id, userId, serviceTypeId, title, createdAt, modifiedDate, status] =
      data[i];
    const createdAtDate = new Date(createdAt);
    createdAtDate.setFullYear(2023);
    const modifiedDateDate = new Date(modifiedDate);
    modifiedDateDate.setFullYear(2023);
    const repairNotification = {
      id,
      user_id: parseInt(/\d+/.exec(userId)?.[0]),
      title,
      status_id: status === "Completed" ? 3 : 1,
      created_at: createdAtDate.toISOString().slice(0, 19).replace("T", " "),
      modified_date: modifiedDateDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      repair_type_id: parseInt(/\d+/.exec(serviceTypeId)?.[0]),
      image_url: null,
    };
    json.push(repairNotification);
  }
  fs.writeFile("output.json", JSON.stringify(json), "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }
    console.log("JSON file has been saved.");
  });
});
