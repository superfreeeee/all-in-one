fn main() {
    println!("Hello, world!");
}

#[cfg(test)]
mod serde_tests {
    use std::{collections::HashMap, fs::File, io::BufReader};

    use serde_json::Value;
    use yx_common::AnyError;

    #[test]
    fn test_json_serialize() -> Result<(), AnyError> {
        println!("Hello, world! test_json_serialize");
        Ok(())
    }

    #[test]
    fn test_json_deserialize() -> Result<(), AnyError> {
        let file_path = "./config.json";
        let file = File::open(file_path)?;
        let reader = BufReader::new(file);
        let res: HashMap<String, Value> = serde_json::from_reader(reader)?;

        println!("{res:#?}");

        Ok(())
    }
}
