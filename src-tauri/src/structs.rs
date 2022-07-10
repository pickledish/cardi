use serde::Serialize;
use serde::Deserialize;
use serde_json::Value;

#[derive(Serialize, Deserialize)]
pub struct Put {
  pub repository: String,
  pub table: String,
  pub key: String,
  pub value: Value,
}

#[derive(Serialize, Deserialize)]
pub struct Get {
  pub repository: String,
  pub table: String,
  pub key: String,
}

#[derive(Serialize, Deserialize)]
pub struct Delete {
  pub repository: String,
  pub table: String,
  pub key: String,
}

#[derive(Serialize, Deserialize)]
pub struct Query {
  pub repository: String,
  pub table: String,
  pub filters: Vec<Predicate>,
  pub ascending: bool,
  pub limit: u32,
}

#[derive(Serialize, Deserialize)]
pub struct Predicate {
  pub field: String,
  pub condition: Condition,
}

#[derive(Serialize, Deserialize)]
pub enum Condition {
  IsNull,
  IsNonexistent,
  IsBool(bool),
  IsNumber(u32),
  IsString(String),
  IsGreater(u32),
  IsLess(u32),
}
