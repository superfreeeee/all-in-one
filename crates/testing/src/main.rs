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

#[cfg(test)]
mod path_tests {
    use std::path::{Path, PathBuf};

    #[test]
    fn path_new() {
        let _path = Path::new("/usr/loacl");
        println!("_path={_path:?}");

        let path_ab = PathBuf::from("/usr/local");
        let path_rel = PathBuf::from("usr/local");
        println!("path_ab={path_ab:?}");
        println!("path_rel={path_rel:?}");

        println!("{:?}", path_ab.as_path());
        println!("{:?}", path_rel.as_path());

        println!("{:?}", path_ab.exists());
        println!("{:?}", path_rel.exists());
    }
}

#[cfg(test)]
mod env_test {
    use std::{env, io};

    #[test]
    fn cwd_test() -> Result<(), io::Error> {
        let cwd = env::current_dir()?;
        let cmd = env::current_exe()?;
        println!("cwd={cwd:?}");
        println!("cmd={cmd:?}");

        Ok(())
    }
}
