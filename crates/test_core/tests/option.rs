#[test]
fn smoke_test() {
    fn print_option(option: &Option<u32>) {
        match option {
            Some(num) => {
                println!("option = Some({:?})", num)
            }
            None => {
                println!("option = None")
            }
        }
    }

    let mut op = Some(123u32);
    print_option(&op);
    op = None;
    print_option(&op);
}
