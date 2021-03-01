import pica from 'pica';

// When I die, please know that CORS is what killed me
// This lovely proxy limits to somewhere on the order of 100 req per 15 min
async function fetchPageText(url) {
  let fullurl = "https://cors-cardi.herokuapp.com/" + url;
  return fetch(fullurl).then(response => response.text());
}

async function downsizeImage(imageUrl) {
  let image = new Image();

  image.crossOrigin = "anonymous"; // CORS killed me, remember?
  image.src = imageUrl;

  await image.decode(); // wait for the image to finish loading

  let tuple = smallerDimensions(image);

  let canvas = document.createElement("canvas");
  canvas.width = tuple[0];
  canvas.height = tuple[1];

  await pica().resize(image, canvas, {
    unsharpAmount: 80,
    unsharpRadius: 0.6,
    unsharpThreshold: 2
  });

  return canvas.toDataURL("image/jpeg");
}

function smallerDimensions(image) {
  let origWidth = image.naturalWidth;
  let origHeight = image.naturalHeight;
  let newWidth = Math.min(origWidth, 256);
  let scaledHeight = Math.floor(origHeight * (newWidth / origWidth));
  let newHeight = Math.min(origHeight, scaledHeight);
  return [newWidth, newHeight];
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
    response["imageUrl"] = imageMatch1[1];
  } else if (imageMatch2) {
    response["imageUrl"] = imageMatch2[1];
  }

  if (response["imageUrl"]) {
    let proxied = "https://cors-cardi.herokuapp.com/" + response["imageUrl"];
    let image64 = await downsizeImage(proxied);
    response["image"] = image64;
  }

  return response;
}
