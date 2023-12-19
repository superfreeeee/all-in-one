#[derive(Debug)]
pub struct A {
    pub a: u32,
}

impl From<u32> for A {
    fn from(value: u32) -> Self {
        A { a: value }
    }
}

#[test]
fn test_a() {
    let a = A::from(1);
    println!("a.a = {}", a.a)
}
