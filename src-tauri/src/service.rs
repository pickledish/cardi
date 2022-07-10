use serde_json::Value;

pub fn put(request: Put) -> Result<(), String> {}
pub fn get(request: Get) -> Result<Value, String> {}
pub fn query(request: Query) -> Result<Vec<Value>, String> {}
pub fn delete(request: Delete) -> Result<(), String> {}
//pub fn sync()
