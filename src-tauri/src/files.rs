use std::path::Path;
use std::fs::read_to_string;
use serde_json::Value;
use serde_json::from_str;

//pub fn write(path: Path, value: Value) -> Result<(), String> {}

pub fn read(path: &Path) -> Result<Value, String> {
    let path = path.to_str().ok_or("Could not turn path to string")?;
    let data = read_to_string(path).map_err(|x| x.to_string())?;
    return from_str(&data).map_err(|x| x.to_string());
}

//pub fn delete(path: Path) -> Result<(), String> {}
