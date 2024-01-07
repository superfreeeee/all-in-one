use std::fs;

use yx_common::AnyError;

fn read_dir_test() -> Result<(), AnyError> {
    println!("> read_dir_test");
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

fn main() {
    let _ = read_dir_test();
}
