#[cfg(test)]
mod resolve_path_tests {
    use yx_common::path_utils::resolve_path;

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
