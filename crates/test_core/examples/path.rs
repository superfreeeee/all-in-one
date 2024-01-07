use std::path::{Path, PathBuf};

fn main() {
    let path = Path::new("/usr/loacl");
    println!("path         : {:?}", path);

    let path_absolute = PathBuf::from("/usr/local");
    let path_relative = PathBuf::from("usr/local");
    println!("path_absolute: {:?}", path_absolute);
    println!("path_relative: {:?}", path_relative);

    println!("path_absolute.exists(): {:?}", path_absolute.exists());
    println!("path_relative.exists(): {:?}", path_relative.exists());
}
