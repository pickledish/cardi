use serde_json::Value;

pub fn write(path: &str, value: Value) -> Result<(), String> {}
pub fn read(path: &str) -> Result<Value, String> {}
pub fn delete(path: &str) -> Result<(), String> {}
