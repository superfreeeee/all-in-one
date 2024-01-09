use std::{
    env,
    path::{Path, PathBuf},
};

pub fn resolve_path(relative_path: Option<&str>) -> PathBuf {
    match relative_path {
        Some(path) => {
            let path = Path::new(path);
            if path.is_absolute() {
                return PathBuf::from(path);
            }
            match env::current_dir() {
                Ok(current_dir) => current_dir.join(path),
                Err(_) => PathBuf::from(path),
            }
        }
        None => match env::current_dir() {
            Ok(current_dir) => current_dir,
            Err(_) => PathBuf::new(),
        },
    }
}
