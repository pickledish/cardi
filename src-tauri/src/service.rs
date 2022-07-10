use crate::structs;
use crate::files;
use std::path::PathBuf;
use serde_json::Value;

static ROOT: &str = "/tmp/cardi-tauri-data";

//pub fn put(request: structs::Put) -> Result<(), String> {}

pub fn get(request: structs::Get) -> Result<Value, String> {
    let mut buffer = PathBuf::from(ROOT);
    buffer.push(request.repository);
    buffer.push(request.table);
    buffer.push(request.key);
    buffer.set_extension("json");
    let path = buffer.as_path();
    if !path.exists() {
        //return Err(fmt!("No file found at path {}", path))
        return Err("No file found at path".into())
    }
    return files::read(path);
}

//pub fn query(request: structs::Query) -> Result<Vec<Value>, String> {}

//pub fn delete(request: structs::Delete) -> Result<(), String> {}

//pub fn sync()
