// When I die, please know that CORS is what killed me
// This lovely proxy limits to somewhere on the order of 100 req per 15 min
async function fetchPageText(url) {
  let fullurl = "https://cors-cardi.herokuapp.com/" + url;
  return fetch(fullurl).then(response => response.text());
}

// Returns a struct of form {"title": "foo", "image": "bar"},
// with title a string, image a URL, and either one potentially null
export async function getMetadata(url) {

  let response = {
    "title": null,
    "image": null,
  }

  let fullText = await fetchPageText(url);

  let titleRegex1 = new RegExp("<title[^>]*>([^<]+)<\/title>");
  let titleRegex2 = new RegExp("<meta[^>]*(?:og|twitter):title[^>]*content=\"([^\"]+)\"[^>]*\/?>");
  let titleRegex3 = new RegExp("<meta[^>]*content=\"([^\"]+)\"[^>]*(?:og|twitter):title[^>]*\/?>");
  let imageRegex1 = new RegExp("<meta[^>]*(?:og|twitter):image[^>]*content=\"([^\"]+)\"[^>]*\/?>");
  let imageRegex2 = new RegExp("<meta[^>]*content=\"([^\"]+)\"[^>]*(?:og|twitter):image[^>]*\/?>");

  let titleMatch1 = fullText.match(titleRegex1);
  let titleMatch2 = fullText.match(titleRegex2);
  let titleMatch3 = fullText.match(titleRegex3);
  let imageMatch1 = fullText.match(imageRegex1);
  let imageMatch2 = fullText.match(imageRegex2);

  if (titleMatch1) {
    response["title"] = titleMatch1[1];
  } else if (titleMatch2) {
    response["title"] = titleMatch2[1];
  } else if (titleMatch3) {
    response["title"] = titleMatch3[1];
  }

  if (imageMatch1) {
    response["image"] = imageMatch1[1];
  } else if (imageMatch2) {
    response["image"] = imageMatch2[1];
  }

  return response;
}
