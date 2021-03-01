import pica from 'pica';

// When I die, please know that CORS is what killed me
// This lovely proxy limits to somewhere on the order of 100 req per 15 min
async function fetchPageText(url) {
  let fullurl = "https://cors-anywhere.herokuapp.com/" + url;
  return fetch(fullurl).then(response => response.text());
}

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function smallerTuple(image) {
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
    response["image"] = imageMatch1[1];
  } else if (imageMatch2) {
    response["image"] = imageMatch2[1];
  }

  let image = new Image();
  image.crossOrigin = "anonymous"; // This enables CORS

  image.onload = function() {
    console.log("onload")
    let tuple = smallerTuple(image);

    let canvas = document.createElement("canvas");
    canvas.width = tuple[0];
    canvas.height = tuple[1];

    pica().resize(image, canvas, {
      unsharpAmount: 80,
      unsharpRadius: 0.6,
      unsharpThreshold: 2
    }).then(result => console.log(canvas.toDataURL("image/png")));
  };

  image.src = "https://cors-anywhere.herokuapp.com/" + response["image"];

  sleep(5000).then(() => {
    return response;
  });
}
