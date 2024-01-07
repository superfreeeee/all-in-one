use std::{collections::HashMap, env, fs::File, io::BufReader};

use serde_json::Value;
use yx_common::AnyError;

fn test_json_deserialize() -> Result<(), AnyError> {
    println!("> test_json_deserialize");
    let file_name = "config.json";
    let cwd = env::current_dir()?;
    println!("cwd: {}", cwd.to_str().unwrap());

    let mut file_path = cwd.join(file_name);
    if !file_path.exists() {
        file_path = cwd.join("crates/test_core").join(file_name);
        if !file_path.as_path().exists() {
            return Err(format!("No such file: {}", file_name).into());
        }
    }

    println!("file_path: {}", file_path.to_str().unwrap());

    let file = File::open(file_path)?;
    let reader = BufReader::new(file);
    let res: HashMap<String, Value> = serde_json::from_reader(reader)?;

    println!("{:#?}", res);

    Ok(())
}

fn main() {
    test_json_deserialize().unwrap();
}
