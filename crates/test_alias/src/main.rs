/// set alias in `.cargo/config.toml`
///
/// ```toml
/// [alias]
/// custom-alias = "run -p test_alias --release --"
/// ```
///
/// enable cargo sub-command
///
/// ```sh
/// cargo custom-alias
/// ```
///
fn main() {
    println!("[custom-command entry] Hello World!");
}
