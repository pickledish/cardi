#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod structs;
mod service;
mod files;

use serde_json::Value;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn get(request: structs::Get) -> Result<Value, String> {
  return service::get(request);
}
