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

  let titleRegex = new RegExp("<title[^>]*>([^<]+)<\/title>");
  let ogRegex1 = new RegExp("<meta[^>]*og:title[^>]*content=\"([^\"]+)\"[^>]*\/?>");
  let ogRegex2 = new RegExp("<meta[^>]*content=\"([^\"]+)\"[^>]*og:title[^>]*\/?>");
  let imageRegex1 = new RegExp("<meta[^>]*og:image[^>]*content=\"([^\"]+)\"[^>]*\/?>");
  let imageRegex2 = new RegExp("<meta[^>]*content=\"([^\"]+)\"[^>]*og:image[^>]*\/?>");

  let titleMatch = fullText.match(titleRegex);
  let ogMatch1 = fullText.match(ogRegex1);
  let ogMatch2 = fullText.match(ogRegex2);
  let imageMatch1 = fullText.match(imageRegex1);
  let imageMatch2 = fullText.match(imageRegex2);

  if (titleMatch) {
    response["title"] = titleMatch[1];
  } else if (ogMatch1) {
    response["title"] = ogMatch1[1];
  } else if (ogMatch2) {
    response["title"] = ogMatch2[1];
  }

  if (imageMatch1) {
    response["image"] = imageMatch1[1];
  } else if (imageMatch2) {
    response["image"] = imageMatch2[1];
  }

  return response;
}
