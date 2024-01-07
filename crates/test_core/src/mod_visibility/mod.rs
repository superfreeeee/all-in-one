mod other;
mod privacy;
pub mod root;

#[test]
fn test_root() {
    use root::A;

    let a = A::from(1);
    println!("a.a = {}", a.a);
}

#[test]
fn test_privacy() {
    privacy::inner::f();

    use privacy::inner::f;

    f();

    use privacy::f_p;

    f_p()
}
