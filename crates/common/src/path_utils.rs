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

#[cfg(test)]
mod resolve_path_tests {
    use crate::path_utils::resolve_path;

    #[test]
    fn mvp_test() {
        let path = resolve_path(None);
        assert!(path.is_absolute());
        assert!(path.exists());
    }

    #[test]
    fn target_exists() {
        let path = resolve_path(Some("tests/test.txt"));
        assert!(path.is_absolute());
        assert!(path.exists());
    }

    #[test]
    fn target_not_exists() {
        let path = resolve_path(Some("test.txt"));
        assert!(path.is_absolute());
        assert!(!path.exists());
    }
}
