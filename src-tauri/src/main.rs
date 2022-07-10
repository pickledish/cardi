#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[derive(serde::Serialize, serde::Deserialize)]
struct Snippet {
  created: u32,
  updated: u32,
  status: String,
  title: String,
  content: String,
  boards: Vec<u32>,
  search: Vec<String>,
  kind: String,
  image: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct Board {
  created: u32,
  name: String,
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![getSnippet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn getSnippet(status: &str, created: u32) -> Result<Snippet, String> {
  let resp = Snippet{
    created: 1600000000,
    updated: 1600000001,
    status: "current".into(),
    title: "My Favorite Note".into(),
    content: "It's this one `right here` bruv".into(),
    boards: vec![],
    search: vec![],
    kind: "".into(),
    image: "".into(),
  };
  Ok(resp)
}
