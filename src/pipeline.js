async function fetchPageText(url) {
  // When I die, please know that CORS is what killed me
  // This lovely proxy limits to somewhere on the order of 100 req per 15 min
  let fullurl = "https://cors-anywhere.herokuapp.com/" + url;
  return fetch(fullurl).then(response => response.text());
}

export async function getTitle(url) {
  let fullText = await fetchPageText(url);

  let titleRegex = new RegExp("<title[^>]*>([^<]+)<\/title>");
  let ogRegex = new RegExp("<meta[^>]*og:title[^>]*content=\"([^\"]+)\"[^>]*\/>");

  let titleMatch = fullText.match(titleRegex);

  if (titleMatch) {
    return titleMatch[1];
  }

  let ogMatch = fullText.match(ogRegex);

  if (ogMatch) {
    return ogMatch[1];
  }

  return "";
}
