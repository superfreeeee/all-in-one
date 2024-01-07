use yx_common::path_utils::resolve_path;

fn main() {
    let path = resolve_path(None);
    println!("resolve_path: {:?}", path);
}
