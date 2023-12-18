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
mod env_tests {
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

#[cfg(test)]
mod fs_tests {
    use std::fs::{self};

    use yx_common::AnyError;

    #[test]
    fn read_dir_test() -> Result<(), AnyError> {
        let dir = fs::read_dir(".")?;

        for entry in dir {
            let entry = entry?;

            println!("=>>>>>>>> entry");
            let name = entry.file_name();
            println!("name  : {:?}", name);

            let path = entry.path();
            println!("path  : {:?}", path);

            let file_type = entry.file_type()?;
            println!("is_dir     : {}", file_type.is_dir());
            println!("is_file    : {}", file_type.is_file());
            println!("is_symlink : {}", file_type.is_symlink());

            let metadata = entry.metadata()?;
            println!("created   : {:?}", metadata.created()?);
            println!("modified  : {:?}", metadata.modified()?);
            println!("accessed  : {:?}", metadata.accessed()?);

            println!("permissions  : {:?}", metadata.permissions());

            println!("{:#?}", entry.metadata()?);
            println!();
        }

        Ok(())
    }
}

#[cfg(test)]
mod ansi_term_tests {
    use ansi_term::{Color, Style};

    #[test]
    fn color_test() {
        let msg = "default message";
        println!("==========> Style");
        println!("plain     : {}", Style::new().paint(msg));
        println!("dimmed    : {}", Style::new().dimmed().paint(msg));
        println!("bold      : {}", Style::new().bold().paint(msg));
        println!("underline : {}", Style::new().underline().paint(msg));

        let msg = "error message";
        println!("==========> Red");
        println!("plain     : {}", Color::Red.paint(msg));
        println!("dimmed    : {}", Color::Red.dimmed().paint(msg));
        println!("bold      : {}", Color::Red.bold().paint(msg));
        println!("underline : {}", Color::Red.underline().paint(msg));

        let msg = "success message";
        println!("==========> Green");
        println!("plain     : {}", Color::Green.paint(msg));
        println!("dimmed    : {}", Color::Green.dimmed().paint(msg));
        println!("bold      : {}", Color::Green.bold().paint(msg));
        println!("underline : {}", Color::Green.underline().paint(msg));

        let msg = "info message";
        println!("==========> Blue");
        println!("plain     : {}", Color::Blue.paint(msg));
        println!("dimmed    : {}", Color::Blue.dimmed().paint(msg));
        println!("bold      : {}", Color::Blue.bold().paint(msg));
        println!("underline : {}", Color::Blue.underline().paint(msg));

        let msg = "info message";
        println!("==========> Cyan");
        println!("plain     : {}", Color::Cyan.paint(msg));
        println!("dimmed    : {}", Color::Cyan.dimmed().paint(msg));
        println!("bold      : {}", Color::Cyan.bold().paint(msg));
        println!("underline : {}", Color::Cyan.underline().paint(msg));
    }
}

#[cfg(test)]
mod log_tests {
    use log::{info, warn, LevelFilter};

    #[test]
    fn log_test() {
        // with default info level
        env_logger::builder()
            .filter_level(LevelFilter::Info)
            .format_target(false) // format test name
            // .format_timestamp_secs() // format time precision
            .init();
        // env_logger::init();

        info!("starting up");
        warn!("oops, nothing implemented!");
    }
}

static mut STATIC_NUM: u32 = 1;

#[cfg(test)]
mod static_tests {
    use crate::STATIC_NUM;

    #[test]
    fn get_test() {
        unsafe {
            STATIC_NUM = 2;
            println!("STATIC_NUM={}", STATIC_NUM);
        }
    }
}
