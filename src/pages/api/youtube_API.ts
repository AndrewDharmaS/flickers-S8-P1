import axios from "axios";
const YOUTUBE_API_KEY = "AIzaSyCmHjyl3Shr-KgobNYgcqlsMTTZjvfstWE";
const DEFAULT_API_URL = "https://www.googleapis.com/youtube/v3";
const API_URL = "?key=" + YOUTUBE_API_KEY;
function buildYoutubeURL(data: any) {
  let URLS: any = [];
  if (data.items) {
    data.items.forEach((item: any) => {
      URLS.push("https://www.youtube.com/embed/" + item.id.videoId);
    });
  }
  return URLS;
}
const searchRelevant = async function searchRelevant(
  query: string
): Promise<any> {
  query = query.replace(" ", "%20");
  let url =
    DEFAULT_API_URL +
    "/search" +
    API_URL +
    "&part=snippet&maxResults=3&q=" +
    query +
    "&type=video&regionCode=US";
  try {
    const { data: res } = await axios.get(url);
    const processed = buildYoutubeURL(res);
    // console.log(processed);
    return processed as any;
  } catch (error) {
    alert("Youtube API QUOTA REACHED");
    return null;
  }
};
export default { searchRelevant };
